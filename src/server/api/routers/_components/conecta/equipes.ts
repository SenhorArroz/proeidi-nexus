import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { directorProcedure } from "../diretoria/procedures";
import { id, nome } from "./suporte";

const cor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const equipeInput = z.object({
	turmaId: id,
	nome,
	tema: nome,
	corInicial: cor,
	corFinal: cor,
});

export const equipesProcedures = {
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
};
