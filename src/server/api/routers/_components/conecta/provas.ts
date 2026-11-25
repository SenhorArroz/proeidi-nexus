import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { directorProcedure } from "../diretoria/procedures";
import { id, nome } from "./suporte";

const provaInput = z.object({
	semestreId: id,
	equipeId: id,
	nome,
	descricao: z.string().trim().max(500).optional(),
	pontos: z.number().int().min(0).max(1000000),
});

export const provasProcedures = {
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
};
