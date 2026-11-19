import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { intervaloDoDia } from "~/lib/dia-calendario";
import { Prisma, type PrismaClient } from "../../generated/prisma";

const pessoa = z.object({
	id: z.string().cuid(),
	estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]),
});

export const salvarPresencasInput = z.object({
	turmaId: z.string().cuid(),
	data: z.coerce.date(),
	alunos: z.array(pessoa).max(300),
	monitores: z.array(pessoa).max(50),
	professores: z.array(pessoa).max(50),
	modoEquipe: z.enum(["sincronizar", "somente-turma"]).default("sincronizar"),
});

type Entrada = z.infer<typeof salvarPresencasInput>;
export type MarcacoesDaTurma = Omit<Entrada, "modoEquipe">;
type Pessoa = z.infer<typeof pessoa>;

async function registroDoDia(
	tx: Prisma.TransactionClient,
	turmaId: string,
	data: Date,
) {
	const intervalo = intervaloDoDia(data);
	const [registro, ...outros] = await tx.registroPresenca.findMany({
		where: { turmaId, data: intervalo },
		orderBy: { data: "asc" },
		select: { id: true },
	});
	if (registro) {
		// Chamadas antigas podiam registrar o mesmo dia em horários diferentes.
		return { id: registro.id, outrosIds: outros.map(({ id }) => id) };
	}

	const meioDia = new Date(intervalo.gte);
	meioDia.setUTCHours(12);
	const novo = await tx.registroPresenca.upsert({
		where: { turmaId_data: { turmaId, data: meioDia } },
		create: { turmaId, data: meioDia },
		update: {},
		select: { id: true },
	});
	return { id: novo.id, outrosIds: [] };
}

async function salvarEquipe(
	tx: Prisma.TransactionClient,
	registro: Awaited<ReturnType<typeof registroDoDia>>,
	monitores: Pessoa[],
	professores: Pessoa[],
) {
	const registroId = registro.id;
	const registros = { in: [registroId, ...registro.outrosIds] };
	for (const estado of ["PRESENTE", "AUSENTE", "JUSTIFICADO"] as const) {
		const monitorIds = monitores
			.filter((pessoa) => pessoa.estado === estado)
			.map(({ id }) => id);
		if (monitorIds.length)
			await tx.presencaMonitor.updateMany({
				where: { registroId: registros, monitorId: { in: monitorIds } },
				data: { estado },
			});
		const professorIds = professores
			.filter((pessoa) => pessoa.estado === estado)
			.map(({ id }) => id);
		if (professorIds.length)
			await tx.presencaProfessor.updateMany({
				where: { registroId: registros, professorId: { in: professorIds } },
				data: { estado },
			});
	}
	if (monitores.length)
		await tx.presencaMonitor.createMany({
			data: monitores.map(({ id: monitorId, estado }) => ({
				registroId,
				monitorId,
				estado,
			})),
			skipDuplicates: true,
		});
	if (professores.length)
		await tx.presencaProfessor.createMany({
			data: professores.map(({ id: professorId, estado }) => ({
				registroId,
				professorId,
				estado,
			})),
			skipDuplicates: true,
		});
}

export async function salvarMarcacoesDaTurma(
	tx: Prisma.TransactionClient,
	input: MarcacoesDaTurma,
	alunosPadrao = new Set<string>(),
) {
	const registro = await registroDoDia(tx, input.turmaId, input.data);
	const registroId = registro.id;
	if (input.alunos.length) {
		const marcacoes = new Map(
			input.alunos.map(({ id, estado }) => [id, estado]),
		);
		for (const estado of ["PRESENTE", "AUSENTE", "JUSTIFICADO"] as const) {
			const alunoIds = [...marcacoes]
				.filter(([, valor]) => valor === estado)
				.map(([id]) => id);
			if (alunoIds.length)
				await tx.presencaAluno.updateMany({
					where: {
						registroId: { in: [registroId, ...registro.outrosIds] },
						alunoId: { in: alunoIds },
					},
					data: { estado },
				});
		}
		const alunosDeOutrosRegistros =
			alunosPadrao.size && registro.outrosIds.length
				? await tx.presencaAluno.findMany({
						where: { registroId: { in: registro.outrosIds } },
						select: { alunoId: true },
					})
				: [];
		const jaRegistrados = new Set(
			alunosDeOutrosRegistros.map(({ alunoId }) => alunoId),
		);
		await tx.presencaAluno.createMany({
			data: [...new Set([...marcacoes.keys(), ...alunosPadrao])]
				.filter((id) => marcacoes.has(id) || !jaRegistrados.has(id))
				.map((alunoId) => ({
					registroId,
					alunoId,
					estado: marcacoes.get(alunoId) ?? "PRESENTE",
				})),
			skipDuplicates: true,
		});
	}
	await salvarEquipe(tx, registro, input.monitores, input.professores);
	return { id: registroId };
}

async function registrarPresencas(
	tx: Prisma.TransactionClient,
	input: Entrada,
) {
	const aulaNoDia = { tipo: "AULA", data: intervaloDoDia(input.data) } as const;
	const turma = await tx.turma.findUnique({
		where: { id: input.turmaId },
		select: {
			alunos: { select: { alunoId: true } },
			monitores: { select: { userId: true } },
			professores: { select: { userId: true } },
			eventos: { where: aulaNoDia, take: 1, select: { id: true } },
		},
	});
	if (!turma) throw new TRPCError({ code: "NOT_FOUND" });
	if (!turma.eventos.length)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message:
				"A presença só pode ser registrada em uma data de aula da turma.",
		});

	const alunos = new Set(turma.alunos.map(({ alunoId }) => alunoId));
	const monitores = new Set(turma.monitores.map(({ userId }) => userId));
	const professores = new Set(turma.professores.map(({ userId }) => userId));
	if (
		input.alunos.some(({ id }) => !alunos.has(id)) ||
		input.monitores.some(({ id }) => !monitores.has(id)) ||
		input.professores.some(({ id }) => !professores.has(id))
	)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Há pessoas sem vínculo com a turma.",
		});

	const { id: registroId } = await salvarMarcacoesDaTurma(tx, input, alunos);

	if (!input.monitores.length && !input.professores.length)
		return { id: registroId };

	const outrasTurmas = await tx.turma.findMany({
		where: {
			id: { not: input.turmaId },
			eventos: { some: aulaNoDia },
			OR: [
				{
					monitores: {
						some: { userId: { in: input.monitores.map(({ id }) => id) } },
					},
				},
				{
					professores: {
						some: { userId: { in: input.professores.map(({ id }) => id) } },
					},
				},
			],
		},
		select: {
			id: true,
			monitores: { select: { userId: true } },
			professores: { select: { userId: true } },
		},
		orderBy: { id: "asc" },
	});
	const presencasNaOutraTurma = (
		pessoas: Pessoa[],
		vinculos: { userId: string }[],
	): Pessoa[] =>
		pessoas
			.filter(({ id }) => vinculos.some(({ userId }) => id === userId))
			.map(({ id, estado }) => ({
				id,
				estado: input.modoEquipe === "sincronizar" ? estado : "AUSENTE",
			}));

	for (const outraTurma of outrasTurmas) {
		const outroRegistro = await registroDoDia(tx, outraTurma.id, input.data);
		await salvarEquipe(
			tx,
			outroRegistro,
			presencasNaOutraTurma(input.monitores, outraTurma.monitores),
			presencasNaOutraTurma(input.professores, outraTurma.professores),
		);
	}
	return { id: registroId };
}

export async function transacaoPresencas<T>(
	db: PrismaClient,
	salvar: (tx: Prisma.TransactionClient) => Promise<T>,
	timeout?: number,
) {
	for (let tentativa = 1; ; tentativa++) {
		try {
			return await db.$transaction(salvar, {
				timeout,
				isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
			});
		} catch (erro) {
			if (
				!(erro instanceof Prisma.PrismaClientKnownRequestError) ||
				erro.code !== "P2034" ||
				tentativa >= 3
			)
				throw erro;
		}
	}
}

export function salvarPresencasDaTurma(db: PrismaClient, input: Entrada) {
	return transacaoPresencas(db, (tx) => registrarPresencas(tx, input));
}
