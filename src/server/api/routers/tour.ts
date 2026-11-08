import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tourRouter = createTRPCRouter({
	estado: protectedProcedure.query(async ({ ctx }) => {
		const [usuario, concluidos] = await Promise.all([
			ctx.db.user.findUnique({
				where: { id: ctx.session.user.id },
				select: { role: true, senhaAlteradaEm: true },
			}),
			ctx.db.tourConcluido.findMany({
				where: { userId: ctx.session.user.id },
				select: { tela: true },
			}),
		]);
		return {
			role: usuario?.role ?? null,
			senhaPendente: Boolean(usuario && !usuario.senhaAlteradaEm),
			concluidos: concluidos.map((item) => item.tela),
		};
	}),
	concluir: protectedProcedure
		.input(
			z.object({
				tela: z
					.string()
					.min(1)
					.max(100)
					.regex(/^[a-z0-9/_-]+$/),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await ctx.db.tourConcluido.upsert({
				where: {
					userId_tela: { userId: ctx.session.user.id, tela: input.tela },
				},
				create: { userId: ctx.session.user.id, tela: input.tela },
				update: {},
			});
			return { ok: true };
		}),
});
