import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id } from "./procedures";

export const impressaoRouter = createTRPCRouter({
	list: directorProcedure
		.input(z.object({ semestreId: id }))
		.query(({ ctx, input }) =>
			ctx.db.semanaImpressao.findMany({
				where: { semestreId: input.semestreId },
				orderBy: { numero: "asc" },
				include: {
					apostilas: {
						orderBy: { titulo: "asc" },
						include: {
							responsaveis: {
								include: { user: { select: { id: true, nome: true } } },
							},
						},
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
	salvarSemana: directorProcedure
		.input(
			z.object({
				semestreId: id,
				numero: z.number().int().min(1).max(99),
				dataAula: z.coerce.date().nullable().optional(),
				aulaRealizada: z.boolean(),
			}),
		)
		.mutation(({ ctx, input }) =>
			ctx.db.semanaImpressao.upsert({
				where: {
					semestreId_numero: {
						semestreId: input.semestreId,
						numero: input.numero,
					},
				},
				create: { ...input, dataAula: input.dataAula ?? null },
				update: {
					dataAula: input.dataAula ?? null,
					aulaRealizada: input.aulaRealizada,
				},
			}),
		),
	salvarApostila: directorProcedure
		.input(
			z.object({
				id: id.optional(),
				semestreId: id,
				semanaNumero: z.number().int().min(1).max(99),
				dataAula: z.coerce.date().nullable().optional(),
				dataEntrega: z.coerce.date().nullable().optional(),
				aulaRealizada: z.boolean(),
				titulo: z.string().trim().min(1).max(160),
				curso: z.string().trim().min(1).max(120),
				pronta: z.boolean(),
				impressa: z.boolean(),
				qtdImpressa: z.number().int().min(0).max(100000),
				qtdAlvo: z.number().int().min(0).max(100000),
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
			const semana = await ctx.db.semanaImpressao.upsert({
				where: {
					semestreId_numero: {
						semestreId: input.semestreId,
						numero: input.semanaNumero,
					},
				},
				create: {
					semestreId: input.semestreId,
					numero: input.semanaNumero,
					dataAula: input.dataAula ?? null,
					aulaRealizada: input.aulaRealizada,
				},
				update: {
					dataAula: input.dataAula ?? null,
					aulaRealizada: input.aulaRealizada,
				},
			});
			const dadosApostila = {
				titulo: input.titulo,
				curso: input.curso,
				dataEntrega: input.dataEntrega ?? null,
				pronta: input.pronta,
				impressa: input.impressa,
				qtdImpressa: input.qtdImpressa,
				qtdAlvo: input.qtdAlvo,
			};
			const novosResponsaveis = input.responsavelIds.map((userId) => ({
				userId,
			}));
			if (input.id) {
				const existente = await ctx.db.apostilaImpressao.findFirst({
					where: { id: input.id, semana: { semestreId: input.semestreId } },
					select: { id: true },
				});
				if (!existente) throw new TRPCError({ code: "NOT_FOUND" });
				await ctx.db.apostilaImpressao.update({
					where: { id: existente.id },
					data: {
						...dadosApostila,
						responsaveis: { deleteMany: {}, create: novosResponsaveis },
					},
				});
				return { id: existente.id };
			}
			return ctx.db.apostilaImpressao.create({
				data: {
					...dadosApostila,
					semanaId: semana.id,
					responsaveis: { create: novosResponsaveis },
				},
				select: { id: true },
			});
		}),
	removerApostila: directorProcedure
		.input(z.object({ id, semestreId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.apostilaImpressao.deleteMany({
				where: { id: input.id, semana: { semestreId: input.semestreId } },
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
