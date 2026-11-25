import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { turmaId, texto, acessoTurma } from "./suporte";

export const conteudoProcedures = {
	materiais: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					url: z.string().trim().url().max(2048),
					tipo: z.enum(["LINK", "PDF", "SLIDE", "IMAGEM"]).default("LINK"),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem criar materiais.",
					});
				return ctx.db.material.create({ data: input, select: { id: true } });
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem remover materiais.",
					});
				const result = await ctx.db.material.deleteMany({
					where: { id: input.id, turmaId: input.turmaId },
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	anotacoes: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					conteudo: z.string().trim().max(4000),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({ code: "FORBIDDEN" });
				return ctx.db.anotacao.create({
					data: { ...input, autorId: ctx.session.user.id },
					select: { id: true },
				});
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({ code: "FORBIDDEN" });
				const result = await ctx.db.anotacao.deleteMany({
					where: {
						id: input.id,
						turmaId: input.turmaId,
						autorId: ctx.session.user.id,
					},
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	calendario: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					data: z.coerce.date(),
					tipo: z.enum(["AULA", "FERIADO", "CANCELADA", "ESPECIAL"]),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem gerenciar o calendário.",
					});
				return ctx.db.eventoCalendario.create({
					data: input,
					select: { id: true },
				});
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem gerenciar o calendário.",
					});
				const result = await ctx.db.eventoCalendario.deleteMany({
					where: { id: input.id, turmaId: input.turmaId },
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
};
