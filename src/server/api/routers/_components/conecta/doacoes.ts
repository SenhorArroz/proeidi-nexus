import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { directorProcedure } from "../diretoria/procedures";
import { id, nome } from "./suporte";

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

export const doacoesProcedures = {
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
};
