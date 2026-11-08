import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure } from "./diretoria";

const id = z.string().cuid();
const nome = z.string().trim().min(1).max(160);
const cor = z.string().regex(/^#[0-9a-fA-F]{6}$/);
const equipeInput = z.object({
	turmaId: id,
	nome,
	tema: nome,
	corInicial: cor,
	corFinal: cor,
});
const itemInput = z.object({
	nome,
	descricao: z.string().trim().max(500).optional(),
	pontos: z.number().int().min(0).max(1000000),
	ativo: z.boolean().default(true),
});
const doacaoBase = z.object({
	equipeId: id,
	nomeDoador: nome,
	descricao: z.string().trim().max(500).optional(),
	itens: z
		.array(
			z.object({ itemId: id, quantidade: z.number().int().min(1).max(100000) }),
		)
		.min(1)
		.max(100),
});
const doacaoUnica = <T extends { itens: { itemId: string }[] }>(value: T) =>
	new Set(value.itens.map((item) => item.itemId)).size === value.itens.length;
const doacaoInput = doacaoBase.refine(doacaoUnica, {
	message: "Cada item deve aparecer apenas uma vez.",
	path: ["itens"],
});
const provaInput = z.object({
	semestreId: id,
	equipeId: id,
	nome,
	descricao: z.string().trim().max(500).optional(),
	pontos: z.number().int().min(0).max(1000000),
});

function somarPontosDaDoacao(
	itens: { quantidade: number; pontosUnitarios: number }[],
) {
	return itens.reduce(
		(total, item) => total + item.quantidade * item.pontosUnitarios,
		0,
	);
}

export const conectaRouter = createTRPCRouter({
	dados: directorProcedure
		.input(z.object({ semestreId: id }))
		.query(async ({ ctx, input }) => {
			const [turmas, equipes, itens, registrosDoacoes, provas] =
				await Promise.all([
					ctx.db.turma.findMany({
						where: { semestreId: input.semestreId },
						select: {
							id: true,
							titulo: true,
							_count: { select: { alunos: true } },
						},
						orderBy: { titulo: "asc" },
					}),
					ctx.db.conectaEquipe.findMany({
						where: { turma: { semestreId: input.semestreId } },
						include: { turma: { select: { titulo: true } } },
					}),
					ctx.db.conectaItem.findMany({ orderBy: { nome: "asc" } }),
					ctx.db.conectaDoacao.findMany({
						where: { equipe: { turma: { semestreId: input.semestreId } } },
						include: {
							itens: { include: { item: { select: { nome: true } } } },
						},
						orderBy: { createdAt: "desc" },
					}),
					ctx.db.conectaProva.findMany({
						where: { semestreId: input.semestreId },
						orderBy: { createdAt: "desc" },
					}),
				]);
			const pessoasPorTurma = new Map(
				turmas.map((turma) => [turma.id, turma._count.alunos]),
			);
			const doacoesPorEquipe = new Map<string, number>();
			const doacoes = registrosDoacoes.map((doacao) => {
				const pontosBrutos = somarPontosDaDoacao(doacao.itens);
				doacoesPorEquipe.set(
					doacao.equipeId,
					(doacoesPorEquipe.get(doacao.equipeId) ?? 0) + pontosBrutos,
				);
				return { ...doacao, pontosBrutos };
			});
			const provasPorEquipe = new Map<string, number>();
			for (const prova of provas) {
				if (!prova.equipeId) continue;
				provasPorEquipe.set(
					prova.equipeId,
					(provasPorEquipe.get(prova.equipeId) ?? 0) + prova.pontos,
				);
			}
			const ranking = equipes
				.map((equipe) => {
					const pessoas = pessoasPorTurma.get(equipe.turmaId) ?? 0;
					const pontosBrutosDoacoes = doacoesPorEquipe.get(equipe.id) ?? 0;
					const pontosProvas = provasPorEquipe.get(equipe.id) ?? 0;
					const pontosDoacoes = pessoas > 0 ? pontosBrutosDoacoes / pessoas : 0;
					return {
						...equipe,
						pessoas,
						pontosBrutosDoacoes,
						pontosDoacoes,
						pontosProvas,
						pontos: pontosDoacoes + pontosProvas,
					};
				})
				.sort(
					(a, b) =>
						b.pontos - a.pontos || a.nome.localeCompare(b.nome, "pt-BR"),
				);
			return {
				turmas: turmas.map((turma) => ({
					id: turma.id,
					titulo: turma.titulo,
					pessoas: turma._count.alunos,
				})),
				equipes: ranking,
				itens,
				doacoes,
				provas,
			};
		}),
	criarEquipe: directorProcedure
		.input(equipeInput)
		.mutation(async ({ ctx, input }) => {
			const turma = await ctx.db.turma.findUnique({
				where: { id: input.turmaId },
				select: { id: true },
			});
			if (!turma)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Turma não encontrada.",
				});
			return ctx.db.conectaEquipe.create({ data: input });
		}),
	atualizarEquipe: directorProcedure
		.input(equipeInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const { id: equipeId, ...data } = input;
			const atual = await ctx.db.conectaEquipe.findUnique({
				where: { id: equipeId },
				select: {
					turmaId: true,
					_count: { select: { doacoes: true, provas: true } },
				},
			});
			if (!atual)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Equipe não encontrada.",
				});
			if (
				atual.turmaId !== data.turmaId &&
				(atual._count.doacoes || atual._count.provas)
			) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"A turma não pode ser trocada após registrar doações ou provas.",
				});
			}
			return ctx.db.conectaEquipe.update({ where: { id: equipeId }, data });
		}),
	excluirEquipe: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const equipe = await ctx.db.conectaEquipe.findUnique({
				where: { id: input.id },
				select: { _count: { select: { doacoes: true, provas: true } } },
			});
			if (!equipe) throw new TRPCError({ code: "NOT_FOUND" });
			if (equipe._count.doacoes || equipe._count.provas) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Remova os lançamentos da equipe antes de excluí-la.",
				});
			}
			return ctx.db.conectaEquipe.delete({ where: { id: input.id } });
		}),
	criarItem: directorProcedure
		.input(itemInput)
		.mutation(({ ctx, input }) => ctx.db.conectaItem.create({ data: input })),
	atualizarItem: directorProcedure
		.input(itemInput.extend({ id }))
		.mutation(({ ctx, input }) => {
			const { id: itemId, ...data } = input;
			return ctx.db.conectaItem.update({ where: { id: itemId }, data });
		}),
	excluirItem: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const usos = await ctx.db.conectaDoacaoItem.count({
				where: { itemId: input.id },
			});
			if (usos)
				return ctx.db.conectaItem.update({
					where: { id: input.id },
					data: { ativo: false },
				});
			return ctx.db.conectaItem.delete({ where: { id: input.id } });
		}),
	criarDoacao: directorProcedure
		.input(doacaoInput)
		.mutation(async ({ ctx, input }) => {
			const equipe = await ctx.db.conectaEquipe.findUnique({
				where: { id: input.equipeId },
				select: { id: true },
			});
			if (!equipe)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Equipe não encontrada.",
				});
			const itens = await ctx.db.conectaItem.findMany({
				where: {
					id: { in: input.itens.map((item) => item.itemId) },
					ativo: true,
				},
			});
			if (itens.length !== input.itens.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Um item não está disponível.",
				});
			return ctx.db.conectaDoacao.create({
				data: {
					equipeId: input.equipeId,
					nomeDoador: input.nomeDoador,
					descricao: input.descricao,
					itens: {
						create: input.itens.map((item) => ({
							itemId: item.itemId,
							quantidade: item.quantidade,
							pontosUnitarios:
								itens.find((catalogo) => catalogo.id === item.itemId)?.pontos ??
								0,
						})),
					},
				},
			});
		}),
	atualizarDoacao: directorProcedure
		.input(
			doacaoBase.extend({ id }).refine(doacaoUnica, {
				message: "Cada item deve aparecer apenas uma vez.",
				path: ["itens"],
			}),
		)
		.mutation(({ ctx, input }) =>
			ctx.db.$transaction(
				async (tx) => {
					const doacao = await tx.conectaDoacao.findUnique({
						where: { id: input.id },
						select: {
							equipe: { select: { turma: { select: { semestreId: true } } } },
							itens: { select: { itemId: true, pontosUnitarios: true } },
						},
					});
					if (!doacao) {
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "Doação não encontrada.",
						});
					}
					const equipe = await tx.conectaEquipe.findUnique({
						where: {
							id: input.equipeId,
							turma: { semestreId: doacao.equipe.turma.semestreId },
						},
						select: { id: true },
					});
					if (!equipe) {
						throw new TRPCError({
							code: "BAD_REQUEST",
							message: "Selecione uma equipe do mesmo semestre da doação.",
						});
					}
					const pontosPorItem = new Map(
						doacao.itens.map((item) => [item.itemId, item.pontosUnitarios]),
					);
					const novosItens = input.itens.filter(
						(item) => !pontosPorItem.has(item.itemId),
					);
					if (novosItens.length) {
						const itens = await tx.conectaItem.findMany({
							where: {
								id: { in: novosItens.map((item) => item.itemId) },
								ativo: true,
							},
						});
						for (const item of itens) pontosPorItem.set(item.id, item.pontos);
					}
					const itens = input.itens.map((item) => {
						const pontosUnitarios = pontosPorItem.get(item.itemId);
						if (pontosUnitarios === undefined) {
							throw new TRPCError({
								code: "BAD_REQUEST",
								message: "Um item não está disponível.",
							});
						}
						return { ...item, pontosUnitarios };
					});
					return tx.conectaDoacao.update({
						where: { id: input.id },
						data: {
							equipeId: input.equipeId,
							nomeDoador: input.nomeDoador,
							descricao: input.descricao,
							itens: { deleteMany: {}, create: itens },
						},
					});
				},
				{ isolationLevel: "Serializable" },
			),
		),
	excluirDoacao: directorProcedure
		.input(z.object({ id }))
		.mutation(({ ctx, input }) =>
			ctx.db.conectaDoacao.delete({ where: { id: input.id } }),
		),
	criarProva: directorProcedure
		.input(provaInput)
		.mutation(async ({ ctx, input }) => {
			const equipe = await ctx.db.conectaEquipe.findUnique({
				where: { id: input.equipeId },
				select: { turma: { select: { semestreId: true } } },
			});
			if (!equipe || equipe.turma.semestreId !== input.semestreId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A equipe deve pertencer ao semestre selecionado.",
				});
			}
			return ctx.db.conectaProva.create({ data: input });
		}),
	atualizarProva: directorProcedure
		.input(provaInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const equipe = await ctx.db.conectaEquipe.findUnique({
				where: { id: input.equipeId },
				select: { turma: { select: { semestreId: true } } },
			});
			if (!equipe || equipe.turma.semestreId !== input.semestreId) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A equipe deve pertencer ao semestre selecionado.",
				});
			}
			const { id: provaId, ...data } = input;
			return ctx.db.conectaProva.update({
				where: { id: provaId, semestreId: input.semestreId },
				data,
			});
		}),
	excluirProva: directorProcedure
		.input(z.object({ id }))
		.mutation(({ ctx, input }) =>
			ctx.db.conectaProva.delete({ where: { id: input.id } }),
		),
});
