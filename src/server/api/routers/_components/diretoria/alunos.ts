import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id, text } from "./procedures";

const alunoInput = z.object({
	semestreId: id,
	nome: text,
	dataNascimento: z.coerce.date(),
	cpf: z
		.string()
		.trim()
		.regex(/^\d{11}$/),
	corRaca: z.string().trim().min(1).max(80),
	identidadeGenero: z.string().trim().min(1).max(80),
	lgbtqiapn: z.string().trim().min(1).max(30),
	telefone: z.string().trim().min(8).max(30),
	contatoEmergencia: z.string().trim().min(8).max(160),
	email: z.string().trim().email().max(254),
	escolaridade: z.string().trim().min(1).max(120),
	cuidaTerceiros: z.boolean(),
	trabalha: z.boolean(),
	trabalhoLocal: z.string().trim().max(160).nullable().optional(),
	trabalhoFuncao: z.string().trim().max(160).nullable().optional(),
	estuda: z.boolean(),
	estudoLocal: z.string().trim().max(160).nullable().optional(),
	estudoCurso: z.string().trim().max(160).nullable().optional(),
	problemaSaude: z.boolean(),
	problemaSaudeQual: z.string().trim().max(240).nullable().optional(),
	necessidadeEspecial: z.boolean(),
	necessidadeEspecialQual: z.string().trim().max(240).nullable().optional(),
	acessoInternet: z.boolean(),
	temComputador: z.boolean(),
	temSmartphone: z.boolean(),
	sistemaSmartphone: z.string().trim().max(60).nullable().optional(),
	turmaIds: z.array(id).max(20),
});

export const alunosRouter = createTRPCRouter({
	continuar: directorProcedure
		.input(
			z.object({
				alunoId: id,
				semestreDestinoId: id,
				turmaIds: z.array(id).min(1).max(20),
				etapaTrilha: z.string().trim().max(80).nullable().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const aluno = await ctx.db.aluno.findUnique({
				where: { id: input.alunoId },
			});
			if (!aluno) throw new TRPCError({ code: "NOT_FOUND" });
			const [destino, turmasValidas, jaExiste] = await Promise.all([
				ctx.db.semestre.findUnique({
					where: { id: input.semestreDestinoId },
					select: { id: true },
				}),
				ctx.db.turma.count({
					where: {
						id: { in: input.turmaIds },
						semestreId: input.semestreDestinoId,
					},
				}),
				ctx.db.aluno.findFirst({
					where: { cpf: aluno.cpf, semestreId: input.semestreDestinoId },
					select: { id: true },
				}),
			]);
			if (!destino || turmasValidas !== new Set(input.turmaIds).size)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Selecione turmas válidas do semestre de destino.",
				});
			if (jaExiste)
				throw new TRPCError({
					code: "CONFLICT",
					message: "Este aluno já possui matrícula no semestre de destino.",
				});
			return ctx.db.aluno.create({
				data: {
					semestreId: input.semestreDestinoId,
					alunoOrigemId: aluno.id,
					etapaTrilha: input.etapaTrilha ?? aluno.etapaTrilha,
					nome: aluno.nome,
					dataNascimento: aluno.dataNascimento,
					cpf: aluno.cpf,
					corRaca: aluno.corRaca,
					identidadeGenero: aluno.identidadeGenero,
					lgbtqiapn: aluno.lgbtqiapn,
					telefone: aluno.telefone,
					contatoEmergencia: aluno.contatoEmergencia,
					email: aluno.email,
					escolaridade: aluno.escolaridade,
					cuidaTerceiros: aluno.cuidaTerceiros,
					trabalha: aluno.trabalha,
					trabalhoLocal: aluno.trabalhoLocal,
					trabalhoFuncao: aluno.trabalhoFuncao,
					estuda: aluno.estuda,
					estudoLocal: aluno.estudoLocal,
					estudoCurso: aluno.estudoCurso,
					problemaSaude: aluno.problemaSaude,
					problemaSaudeQual: aluno.problemaSaudeQual,
					necessidadeEspecial: aluno.necessidadeEspecial,
					necessidadeEspecialQual: aluno.necessidadeEspecialQual,
					acessoInternet: aluno.acessoInternet,
					temComputador: aluno.temComputador,
					temSmartphone: aluno.temSmartphone,
					sistemaSmartphone: aluno.sistemaSmartphone,
					turmas: { create: input.turmaIds.map((turmaId) => ({ turmaId })) },
				},
				select: { id: true },
			});
		}),
	historico: directorProcedure
		.input(z.object({ alunoId: id }))
		.query(async ({ ctx, input }) => {
			const aluno = await ctx.db.aluno.findUnique({
				where: { id: input.alunoId },
				select: { cpf: true },
			});
			if (!aluno) throw new TRPCError({ code: "NOT_FOUND" });
			return ctx.db.aluno.findMany({
				where: { cpf: aluno.cpf },
				select: {
					id: true,
					nome: true,
					etapaTrilha: true,
					statusMatricula: true,
					semestre: { select: { codigo: true } },
					turmas: { select: { turma: { select: { titulo: true } } } },
				},
				orderBy: { semestre: { codigo: "asc" } },
			});
		}),
	list: directorProcedure
		.input(
			z.object({
				semestreId: id,
				busca: z.string().trim().max(80).optional(),
			}),
		)
		.query(({ ctx, input }) =>
			ctx.db.aluno.findMany({
				where: {
					semestreId: input.semestreId,
					...(input.busca
						? { nome: { contains: input.busca, mode: "insensitive" } }
						: {}),
				},
				select: {
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
					turmas: {
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
			const { turmaIds, ...aluno } = input;
			const valid = await ctx.db.turma.count({
				where: { id: { in: turmaIds }, semestreId: input.semestreId },
			});
			if (valid !== new Set(turmaIds).size)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Turma inválida para o semestre.",
				});
			return ctx.db.aluno.create({
				data: {
					...aluno,
					turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
				},
				select: { id: true },
			});
		}),
	update: directorProcedure
		.input(alunoInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const { id: alunoId, turmaIds, ...aluno } = input;
			const valid = await ctx.db.turma.count({
				where: { id: { in: turmaIds }, semestreId: input.semestreId },
			});
			if (valid !== new Set(turmaIds).size)
				throw new TRPCError({ code: "BAD_REQUEST" });
			const existing = await ctx.db.aluno.findFirst({
				where: { id: alunoId, semestreId: input.semestreId },
				select: { id: true },
			});
			if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
			return ctx.db.$transaction(async (tx: any) => {
				await tx.alunoTurma.deleteMany({
					where: { alunoId, turma: { semestreId: input.semestreId } },
				});
				return tx.aluno.update({
					where: { id: alunoId },
					data: {
						...aluno,
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
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
