import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure } from "~/server/api/routers/diretoria";

const id = z.string().cuid();
const optionalText = z.string().trim().max(240).nullable().optional();
const optionalEmail = z
	.union([
		z.string().trim().max(254),
		z.literal(""),
	])
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
	cpf: z.string().trim().transform((value) => value.replace(/\D/g, "")).pipe(
		z.string().regex(/^\d{11}$/, "CPF deve conter 11 dígitos."),
	),
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
				select: alunoSelect,
				orderBy: { nome: "asc" },
				take: 200,
			}),
		),
	create: directorProcedure
		.input(alunoInput)
		.mutation(async ({ ctx, input }) => {
			const { turmaIds = [], semestreId, ...aluno } = input;
			await validateTurmas(ctx, semestreId, turmaIds);
			return ctx.db.aluno.create({
				data: {
					...aluno,
					email: aluno.email ?? null,
					semestre: { connect: { id: semestreId } },
					turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
				},
				select: { id: true },
			});
		}),
	update: directorProcedure
		.input(alunoInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const { id: alunoId, turmaIds = [], semestreId, ...aluno } = input;
			await validateTurmas(ctx, semestreId, turmaIds);
			const exists = await ctx.db.aluno.findFirst({
				where: { id: alunoId, semestreId },
				select: { id: true },
			});
			if (!exists)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Aluno não encontrado neste semestre.",
				});
			return ctx.db.$transaction(async (tx: any) => {
				await tx.alunoTurma.deleteMany({ where: { alunoId } });
				return tx.aluno.update({
					where: { id: alunoId },
					data: {
						...aluno,
						email: aluno.email ?? null,
						turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
					},
					select: { id: true },
				});
			});
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
					.array(alunoInput.omit({ semestreId: true }))
					.min(1)
					.max(500),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const cpfs = input.alunos.map((a) => a.cpf);
			if (new Set(cpfs).size !== cpfs.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A planilha possui CPFs duplicados.",
				});
			for (const aluno of input.alunos)
				await validateTurmas(ctx, input.semestreId, aluno.turmaIds ?? []);
			const existing = await ctx.db.aluno.findMany({
				where: { cpf: { in: cpfs } },
				select: { cpf: true },
			});
			if (existing.length)
				throw new TRPCError({
					code: "CONFLICT",
					message: `CPF já cadastrado: ${existing.map((a: { cpf: string }) => a.cpf).join(", ")}.`,
				});
			await ctx.db.$transaction(
				input.alunos.map((item) => {
					const { turmaIds = [], ...aluno } = item;
					return ctx.db.aluno.create({
						data: {
							...aluno,
							email: aluno.email ?? null,
							semestre: { connect: { id: input.semestreId } },
							turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
						},
					});
				}),
			);
			return { total: input.alunos.length };
		}),
});
