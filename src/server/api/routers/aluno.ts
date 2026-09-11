import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure } from "~/server/api/routers/diretoria";

const id = z.string().cuid();
const optionalText = z.string().trim().max(240).nullable().optional();
const optionalEmail = z
	.union([z.string().trim().max(254), z.literal("")])
	.nullable()
	.optional()
	.transform((val) => (val && val.trim().length > 0 ? val.trim() : null));
const optionalPhone = z
	.union([z.string().trim(), z.literal("")])
	.nullable()
	.optional()
	.transform((val) => (val && val.trim().length > 0 ? val.trim() : null));
const optionalEmergency = z
	.union([z.string().trim().max(160), z.literal("")])
	.nullable()
	.optional()
	.transform((val) => (val && val.trim().length > 0 ? val.trim() : null));

const alunoInput = z.object({
	semestreId: id,
	nome: z.string().trim().min(1).max(160),
	dataNascimento: z.coerce.date(),
	cpf: z
		.string()
		.trim()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos.")),
	corRaca: z.string().trim().min(1).max(80),
	identidadeGenero: z.string().trim().min(1).max(80),
	lgbtqiapn: z.string().trim().min(1).max(30),
	telefone: optionalPhone,
	contatoEmergencia: optionalEmergency,
	email: optionalEmail,
	escolaridade: z.string().trim().min(1).max(120),
	cuidaTerceiros: z.boolean(),
	trabalha: z.boolean(),
	trabalhoLocal: optionalText,
	trabalhoFuncao: optionalText,
	estuda: z.boolean(),
	estudoLocal: optionalText,
	estudoCurso: optionalText,
	problemaSaude: z.boolean(),
	problemaSaudeQual: optionalText,
	necessidadeEspecial: z.boolean(),
	necessidadeEspecialQual: optionalText,
	acessoInternet: z.boolean(),
	temComputador: z.boolean(),
	temSmartphone: z.boolean(),
	sistemaSmartphone: z.string().trim().max(60).nullable().optional(),
});

// Planilhas históricas podem conter CPF incompleto. No cadastro manual, a
// validação completa acima continua obrigatória; na importação preservamos os
// dígitos que existirem para não descartar o registro.
const alunoImportInput = alunoInput.extend({
	cpf: z
		.string()
		.trim()
		.transform((value) => value.replace(/\D/g, ""))
		.pipe(z.string().min(1, "CPF deve conter ao menos um dígito.").max(11)),
	turmaIds: z.array(id).max(20).optional().default([]),
});

const alunoSelect = {
	id: true,
	nome: true,
	dataNascimento: true,
	cpf: true,
	corRaca: true,
	identidadeGenero: true,
	lgbtqiapn: true,
	telefone: true,
	contatoEmergencia: true,
	email: true,
	escolaridade: true,
	cuidaTerceiros: true,
	trabalha: true,
	trabalhoLocal: true,
	trabalhoFuncao: true,
	estuda: true,
	estudoLocal: true,
	estudoCurso: true,
	problemaSaude: true,
	problemaSaudeQual: true,
	necessidadeEspecial: true,
	necessidadeEspecialQual: true,
	acessoInternet: true,
	temComputador: true,
	temSmartphone: true,
	sistemaSmartphone: true,
	turmas: { select: { turma: { select: { id: true, titulo: true } } } },
} as const;

async function validateTurmas(
	ctx: { db: any },
	semestreId: string,
	turmaIds: string[],
) {
	const valid = await ctx.db.turma.count({
		where: { id: { in: turmaIds }, semestreId },
	});
	if (valid !== new Set(turmaIds).size)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "A turma selecionada não pertence ao semestre informado.",
		});
}

export const alunoRouter = createTRPCRouter({
	list: directorProcedure
		.input(
			z.object({ semestreId: id, busca: z.string().trim().max(80).optional() }),
		)
		.query(({ ctx, input }) =>
			ctx.db.aluno.findMany({
				where: {
					semestreId: input.semestreId,
					...(input.busca
						? {
								OR: [
									{ nome: { contains: input.busca, mode: "insensitive" } },
									{ cpf: { contains: input.busca.replace(/\D/g, "") } },
								],
							}
						: {}),
				},
				select: {
					...alunoSelect,
					turmas: {
						where: { turma: { semestreId: input.semestreId } },
						select: { turma: { select: { id: true, titulo: true } } },
					},
				},
				orderBy: { nome: "asc" },
				take: 200,
			}),
		),
	create: directorProcedure
		.input(alunoInput)
		.mutation(async ({ ctx, input }) => {
			const { semestreId, ...aluno } = input;
			return ctx.db.aluno.create({
				data: {
					...aluno,
					email: aluno.email ?? null,
					semestre: { connect: { id: semestreId } },
				},
				select: { id: true },
			});
		}),
	update: directorProcedure
		.input(alunoInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const { id: alunoId, semestreId, ...aluno } = input;
			const exists = await ctx.db.aluno.findFirst({
				where: { id: alunoId, semestreId },
				select: { id: true },
			});
			if (!exists)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Aluno não encontrado neste semestre.",
				});
			return ctx.db.aluno.update({
				where: { id: alunoId },
				data: {
					...aluno,
					email: aluno.email ?? null,
				},
				select: { id: true },
			});
		}),
	detalhe: directorProcedure
		.input(z.object({ id }))
		.query(async ({ ctx, input }) => {
			const aluno = await ctx.db.aluno.findUnique({
				where: { id: input.id },
				select: {
					...alunoSelect,
					semestre: { select: { codigo: true } },
					turmas: {
						select: {
							turma: {
								select: {
									id: true,
									titulo: true,
									cor: true,
									horario: true,
									sala: true,
									semestre: { select: { codigo: true } },
								},
							},
						},
					},
				},
			});
			if (!aluno) throw new TRPCError({ code: "NOT_FOUND" });
			return aluno;
		}),
	remove: directorProcedure
		.input(z.object({ id, semestreId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.aluno.deleteMany({ where: input });
			if (!result.count)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Aluno não encontrado neste semestre.",
				});
			return { id: input.id };
		}),
	import: directorProcedure
		.input(
			z.object({
				semestreId: id,
				alunos: z
					.array(alunoImportInput.omit({ semestreId: true }))
					.min(1)
					.max(500),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const alunosPorCpf = new Map<string, (typeof input.alunos)[number]>();
			for (const aluno of input.alunos) {
				const cpf = aluno.cpf.replace(/\D/g, "");
				if (!alunosPorCpf.has(cpf)) alunosPorCpf.set(cpf, aluno);
			}
			const alunosUnicos = [...alunosPorCpf.values()];
			const cpfs = alunosUnicos.map((a) => a.cpf);
			const existing = await ctx.db.aluno.findMany({
				where: { cpf: { in: cpfs }, semestreId: input.semestreId },
				select: { cpf: true },
			});
			const cpfsExistentes = new Set(
				existing.map((aluno: { cpf: string }) => aluno.cpf),
			);
			const alunosParaCriar = alunosUnicos.filter(
				(aluno) => !cpfsExistentes.has(aluno.cpf),
			);
			for (const aluno of alunosParaCriar)
				await validateTurmas(ctx, input.semestreId, aluno.turmaIds);
			// A consulta acima evita duplicatas no fluxo normal. O upsert protege a
			// mesma importação caso ela seja reenviada ou outra sessão crie o CPF
			// entre a consulta e a gravação (condição de corrida).
			await ctx.db.$transaction(
				alunosParaCriar.map((aluno) => {
					const { turmaIds, ...dadosAluno } = aluno;
					return ctx.db.aluno.upsert({
						where: {
							cpf_semestreId: {
								cpf: dadosAluno.cpf,
								semestreId: input.semestreId,
							},
						},
						create: {
							...dadosAluno,
							email: dadosAluno.email ?? null,
							semestre: { connect: { id: input.semestreId } },
							turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
						},
						// Registro existente é uma linha duplicada: não altera seus dados
						// nem seus vínculos de turma.
						update: {},
					});
				}),
			);
			return {
				total: alunosParaCriar.length,
				ignorados: input.alunos.length - alunosParaCriar.length,
			};
		}),
	vincularTurmasEmLote: directorProcedure
		.input(
			z.object({
				semestreId: id,
				alunoIds: z.array(id).min(1).max(300),
				turmaIds: z.array(id).min(1).max(20),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const alunoIds = [...new Set(input.alunoIds)];
			const turmaIds = [...new Set(input.turmaIds)];
			await validateTurmas(ctx, input.semestreId, turmaIds);
			const alunosValidos = await ctx.db.aluno.count({
				where: { id: { in: alunoIds }, semestreId: input.semestreId },
			});
			if (alunosValidos !== alunoIds.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Um ou mais alunos não pertencem ao semestre selecionado.",
				});
			const result = await ctx.db.alunoTurma.createMany({
				data: alunoIds.flatMap((alunoId) =>
					turmaIds.map((turmaId) => ({ alunoId, turmaId })),
				),
				skipDuplicates: true,
			});
			return { total: result.count };
		}),
});
