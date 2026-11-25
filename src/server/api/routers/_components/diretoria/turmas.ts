import { TRPCError } from "@trpc/server";
import type { db } from "~/server/db";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id, text } from "./procedures";

const turmaInput = z.object({
	limiteAlunos: z.number().int().min(1).max(300).default(14),
	semestreId: id,
	titulo: text,
	sala: z.string().trim().max(80).nullable().optional(),
	horario: z.string().trim().max(80).nullable().optional(),
	cor: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#1A73E8"),
	corDestaque: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#ea580c"),
	corFundo: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#f8fafc"),
	corTexto: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#0f172a"),
	corTitulo: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#ffffff"),
	corDescricao: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#64748b"),
	fonte: z.enum(["SANS", "SERIF", "MONO"]).default("SANS"),
	professorIds: z.array(id).max(20),
	monitorIds: z.array(id).max(30),
	alunoIds: z.array(id).max(300),
	materiais: z
		.array(
			z.object({
				titulo: text,
				tipo: z.enum(["LINK", "PDF", "SLIDE", "IMAGEM"]),
				url: z.union([z.string().trim().url().max(2048), z.literal("")]),
			}),
		)
		.max(100),
	aulas: z
		.array(
			z.object({
				data: z.coerce.date(),
				titulo: text,
				tipo: z
					.enum(["AULA", "FERIADO", "CANCELADA", "ESPECIAL"])
					.default("AULA"),
			}),
		)
		.max(200),
});

async function validateTurmaRelations(
	ctx: { db: typeof db },
	input: z.infer<typeof turmaInput>,
	alunoIdsJaVinculados: string[] = [],
) {
	const [professores, monitores, alunos] = await Promise.all([
		ctx.db.user.findMany({
			where: {
				id: { in: input.professorIds },
				role: { in: ["PROFESSOR", "DIRETOR"] },
			},
			select: { id: true },
		}),
		ctx.db.user.findMany({
			where: { id: { in: input.monitorIds }, role: "MONITOR" },
			select: { id: true },
		}),
		ctx.db.aluno.findMany({
			where: {
				id: { in: input.alunoIds },
				OR: [
					{ semestreId: input.semestreId },
					{ id: { in: alunoIdsJaVinculados } },
				],
			},
			select: { id: true },
		}),
	]);
	if (
		professores.length !== new Set(input.professorIds).size ||
		monitores.length !== new Set(input.monitorIds).size ||
		alunos.length !== new Set(input.alunoIds).size
	) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Uma ou mais seleções não são válidas para esta turma.",
		});
	}
}

export const turmasRouter = createTRPCRouter({
	list: directorProcedure
		.input(z.object({ semestreId: id.optional() }).optional())
		.query(({ ctx, input }) =>
			ctx.db.turma.findMany({
				where: input?.semestreId ? { semestreId: input.semestreId } : {},
				select: {
					id: true,
					titulo: true,
					sala: true,
					horario: true,
					limiteAlunos: true,
					cor: true,
					corDestaque: true,
					corFundo: true,
					corTexto: true,
					corTitulo: true,
					corDescricao: true,
					fonte: true,
					semestreId: true,
					professores: {
						select: {
							user: { select: { id: true, nome: true, role: true } },
						},
					},
					monitores: {
						select: {
							user: { select: { id: true, nome: true, role: true } },
						},
					},
					alunos: {
						select: {
							aluno: {
								select: {
									id: true,
									nome: true,
									dataNascimento: true,
									telefone: true,
									contatoEmergencia: true,
								},
							},
						},
					},
					materiais: {
						select: { id: true, titulo: true, tipo: true, url: true },
					},
					_count: { select: { anotacoes: true } },
					eventos: {
						select: { id: true, data: true, titulo: true, tipo: true },
					},
				},
				orderBy: { titulo: "asc" },
			}),
		),
	create: directorProcedure
		.input(turmaInput)
		.mutation(async ({ ctx, input }) => {
			await validateTurmaRelations(ctx, input);
			return ctx.db.turma.create({
				data: {
					semestreId: input.semestreId,
					titulo: input.titulo,
					sala: input.sala,
					horario: input.horario,
					limiteAlunos: input.limiteAlunos,
					cor: input.cor,
					corDestaque: input.corDestaque,
					corFundo: input.corFundo,
					corTexto: input.corTexto,
					corTitulo: input.corTitulo,
					corDescricao: input.corDescricao,
					fonte: input.fonte,
					professores: {
						create: input.professorIds.map((userId) => ({ userId })),
					},
					monitores: {
						create: input.monitorIds.map((userId) => ({ userId })),
					},
					alunos: { create: input.alunoIds.map((alunoId) => ({ alunoId })) },
					materiais: { create: input.materiais },
					eventos: {
						create: input.aulas,
					},
				},
				select: { id: true },
			});
		}),
	duplicate: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const origem = await ctx.db.turma.findUnique({
				where: { id: input.id },
				select: {
					semestreId: true,
					titulo: true,
					sala: true,
					horario: true,
					limiteAlunos: true,
					cor: true,
					corDestaque: true,
					corFundo: true,
					corTexto: true,
					corTitulo: true,
					corDescricao: true,
					fonte: true,
					professores: { select: { userId: true } },
					monitores: { select: { userId: true } },
					materiais: { select: { titulo: true, tipo: true, url: true } },
					eventos: { select: { titulo: true, data: true, tipo: true } },
				},
			});
			if (!origem) throw new TRPCError({ code: "NOT_FOUND" });
			const titulo = `${origem.titulo}-copia`;
			const jaExiste = await ctx.db.turma.findFirst({
				where: { semestreId: origem.semestreId, titulo },
				select: { id: true },
			});
			if (jaExiste) {
				throw new TRPCError({
					code: "CONFLICT",
					message: `Já existe uma turma com o nome \"${titulo}\" neste semestre. Renomeie a cópia existente antes de duplicar novamente.`,
				});
			}
			return ctx.db.turma.create({
				data: {
					semestreId: origem.semestreId,
					titulo,
					sala: origem.sala,
					horario: origem.horario,
					limiteAlunos: origem.limiteAlunos,
					cor: origem.cor,
					corDestaque: origem.corDestaque,
					corFundo: origem.corFundo,
					corTexto: origem.corTexto,
					corTitulo: origem.corTitulo,
					corDescricao: origem.corDescricao,
					fonte: origem.fonte,
					professores: {
						create: origem.professores.map(({ userId }) => ({ userId })),
					},
					monitores: {
						create: origem.monitores.map(({ userId }) => ({ userId })),
					},
					materiais: { create: origem.materiais },
					eventos: { create: origem.eventos },
				},
				select: { id: true, titulo: true },
			});
		}),
	update: directorProcedure
		.input(turmaInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const [existing, semestreDestino] = await Promise.all([
				ctx.db.turma.findUnique({
					where: { id: input.id },
					select: {
						id: true,
						semestreId: true,
						alunos: { select: { alunoId: true } },
					},
				}),
				ctx.db.semestre.findUnique({
					where: { id: input.semestreId },
					select: { id: true },
				}),
			]);
			if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
			if (!semestreDestino) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Semestre de destino inválido.",
				});
			}
			const mudouSemestre = existing.semestreId !== input.semestreId;
			const alunosJaVinculados = existing.alunos.map((aluno) => aluno.alunoId);
			await validateTurmaRelations(ctx, input, alunosJaVinculados);
			const alunoIds = [...new Set(input.alunoIds)];
			const alunosMantidos = alunosJaVinculados.filter((alunoId) =>
				alunoIds.includes(alunoId),
			);
			return ctx.db.$transaction(async (tx: any) => {
				if (mudouSemestre && alunosMantidos.length) {
					await tx.aluno.updateMany({
						where: {
							id: { in: alunosMantidos },
							semestreId: existing.semestreId,
						},
						data: { semestreId: input.semestreId },
					});
				}
				await tx.professorTurma.deleteMany({ where: { turmaId: input.id } });
				await tx.monitorTurma.deleteMany({ where: { turmaId: input.id } });
				await tx.alunoTurma.deleteMany({ where: { turmaId: input.id } });
				await tx.material.deleteMany({ where: { turmaId: input.id } });
				await tx.eventoCalendario.deleteMany({
					where: { turmaId: input.id },
				});
				const turma = await tx.turma.update({
					where: { id: input.id },
					data: {
						semestreId: input.semestreId,
						titulo: input.titulo,
						sala: input.sala,
						horario: input.horario,
						limiteAlunos: input.limiteAlunos,
						cor: input.cor,
						corDestaque: input.corDestaque,
						corFundo: input.corFundo,
						corTexto: input.corTexto,
						corTitulo: input.corTitulo,
						corDescricao: input.corDescricao,
						fonte: input.fonte,
						professores: {
							create: input.professorIds.map((userId) => ({ userId })),
						},
						monitores: {
							create: input.monitorIds.map((userId) => ({ userId })),
						},
						alunos: {
							create: alunoIds.map((alunoId) => ({ alunoId })),
						},
						materiais: { create: input.materiais },
						eventos: {
							create: input.aulas,
						},
					},
					select: { id: true },
				});
				if (mudouSemestre) {
					await tx.conectaProva.updateMany({
						where: { equipe: { turmaId: turma.id } },
						data: { semestreId: input.semestreId },
					});
				}
				return turma;
			});
		}),
	remove: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.turma.deleteMany({
				where: { id: input.id },
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
	limparAlunos: directorProcedure
		.input(z.object({ turmaId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.alunoTurma.deleteMany({
				where: { turmaId: input.turmaId },
			});
			return { removidos: result.count };
		}),
});
