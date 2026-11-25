import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id } from "./procedures";

export const materialAtualizacaoRouter = createTRPCRouter({
	list: directorProcedure
		.input(z.object({ semestreId: id }))
		.query(({ ctx, input }) =>
			ctx.db.materialAtualizacao.findMany({
				where: { semestreId: input.semestreId },
				orderBy: [{ dataEntrega: "asc" }, { titulo: "asc" }],
				include: {
					responsaveis: {
						include: { user: { select: { id: true, nome: true } } },
					},
				},
			}),
		),
	responsaveis: directorProcedure.query(({ ctx }) =>
		ctx.db.user.findMany({
			where: { role: { in: ["DIRETOR", "COORDENADOR"] } },
			select: { id: true, nome: true },
			orderBy: { nome: "asc" },
		}),
	),
	salvar: directorProcedure
		.input(
			z.object({
				id: id.optional(),
				semestreId: id,
				curso: z.string().trim().min(1).max(120),
				titulo: z.string().trim().min(1).max(160),
				dataEntrega: z.coerce.date().nullable().optional(),
				revisado: z.boolean(),
				precisaAjuste: z.boolean(),
				ajustado: z.boolean(),
				responsavelIds: z.array(id).max(20),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const validos = await ctx.db.user.count({
				where: {
					id: { in: input.responsavelIds },
					role: { in: ["DIRETOR", "COORDENADOR"] },
				},
			});
			if (validos !== new Set(input.responsavelIds).size)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Responsável inválido.",
				});
			const data = {
				curso: input.curso,
				titulo: input.titulo,
				dataEntrega: input.dataEntrega ?? null,
				revisado: input.revisado,
				precisaAjuste: input.precisaAjuste,
				ajustado: input.ajustado,
			};
			const responsaveis = input.responsavelIds.map((userId) => ({ userId }));
			if (input.id) {
				const existente = await ctx.db.materialAtualizacao.findFirst({
					where: { id: input.id, semestreId: input.semestreId },
					select: { id: true },
				});
				if (!existente) throw new TRPCError({ code: "NOT_FOUND" });
				return ctx.db.materialAtualizacao.update({
					where: { id: existente.id },
					data: {
						...data,
						responsaveis: { deleteMany: {}, create: responsaveis },
					},
					select: { id: true },
				});
			}
			return ctx.db.materialAtualizacao.create({
				data: {
					...data,
					semestreId: input.semestreId,
					responsaveis: { create: responsaveis },
				},
				select: { id: true },
			});
		}),
	remover: directorProcedure
		.input(z.object({ id, semestreId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.materialAtualizacao.deleteMany({
				where: input,
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return input;
		}),
});
