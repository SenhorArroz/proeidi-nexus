import { z } from "zod";
import { directorProcedure } from "../diretoria/procedures";
import { id, nome } from "./suporte";

const itemInput = z.object({
	nome,
	descricao: z.string().trim().max(500).optional(),
	pontos: z.number().int().min(0).max(1000000),
	ativo: z.boolean().default(true),
});

export const itensProcedures = {
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
};
