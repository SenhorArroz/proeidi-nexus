import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";

export const id = z.string().cuid();
export const text = z.string().trim().min(1).max(160);

export const directorProcedure = protectedProcedure.use(
	async ({ ctx, next }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!user || (user.role !== "DIRETOR" && user.role !== "COORDENADOR")) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Acesso restrito à diretoria.",
			});
		}
		return next();
	},
);

export const coordinatorProcedure = protectedProcedure.use(
	async ({ ctx, next }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!user || user.role !== "COORDENADOR") {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Acesso restrito ao coordenador.",
			});
		}
		return next();
	},
);

export const personInput = z.object({
	nome: text,
	email: z.string().trim().email().max(254),
	matricula: z.string().trim().min(3).max(40),
	senha: z.string().min(10).max(128).optional(),
});
