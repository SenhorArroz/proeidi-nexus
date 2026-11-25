import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sendPostTurmaEmail } from "~/server/email";
import { turmaId, acessoTurma } from "./suporte";

export const avisosRouter = createTRPCRouter({
	create: protectedProcedure
		.input(
			z.object({
				turmaId,
				texto: z.string().trim().max(4000).optional().default(""),
				imagemUrl: z.string().url().max(2048).optional().nullable(),
				linkUrl: z.string().trim().url().max(2048).optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			await acessoTurma(ctx, input.turmaId);
			if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Escreva um aviso, envie uma imagem ou adicione um link.",
				});

			const [turmaData, autorData, monitoresData, professoresData] =
				await Promise.all([
					ctx.db.turma.findUniqueOrThrow({
						where: { id: input.turmaId },
						select: { titulo: true },
					}),
					ctx.db.user.findUniqueOrThrow({
						where: { id: ctx.session.user.id },
						select: { nome: true },
					}),
					ctx.db.monitorTurma.findMany({
						where: { turmaId: input.turmaId },
						select: { user: { select: { id: true, email: true, nome: true } } },
					}),
					ctx.db.professorTurma.findMany({
						where: { turmaId: input.turmaId },
						select: { user: { select: { id: true, email: true, nome: true } } },
					}),
				]);

			const aviso = await ctx.db.aviso.create({
				data: {
					...input,
					texto: input.texto.trim(),
					imagemUrl: input.imagemUrl ?? null,
					linkUrl: input.linkUrl ?? null,
					autorId: ctx.session.user.id,
				},
				select: { id: true },
			});

			const pessoas = [...monitoresData, ...professoresData]
				.filter(
					(a): a is { user: { id: string; email: string; nome: string } } =>
						a.user.email !== null,
				)
				.filter((a) => ctx.session.user.id !== a.user.id)
				.map((a) => ({
					email: a.user.email,
					nome: a.user.nome,
				}));

			if (pessoas.length > 0) {
				sendPostTurmaEmail({
					turma: turmaData.titulo,
					post: input.texto.trim(),
					imagemUrl: input.imagemUrl ?? null,
					linkUrl: input.linkUrl ?? null,
					autor: autorData.nome,
					pessoas,
					turmaId: input.turmaId,
				}).catch((err) =>
					console.error("Falha ao enviar e-mail de aviso:", err),
				);
			}

			return aviso;
		}),
	update: protectedProcedure
		.input(
			z.object({
				turmaId,
				id: z.string().cuid(),
				texto: z.string().trim().max(4000).optional().default(""),
				imagemUrl: z.string().url().max(2048).optional().nullable(),
				linkUrl: z.string().trim().url().max(2048).optional().nullable(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if ((await acessoTurma(ctx, input.turmaId)) !== "PROFESSOR")
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Somente professores podem editar avisos.",
				});
			if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Escreva um aviso, envie uma imagem ou adicione um link.",
				});
			const result = await ctx.db.aviso.updateMany({
				where: {
					id: input.id,
					turmaId: input.turmaId,
					autorId: ctx.session.user.id,
				},
				data: {
					texto: input.texto.trim(),
					imagemUrl: input.imagemUrl ?? null,
					linkUrl: input.linkUrl ?? null,
				},
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
	setFixado: protectedProcedure
		.input(z.object({ turmaId, id: z.string().cuid(), fixado: z.boolean() }))
		.mutation(async ({ ctx, input }) => {
			const role = await acessoTurma(ctx, input.turmaId);
			if (role === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" });
			return ctx.db.aviso.updateMany({
				where: { id: input.id, turmaId: input.turmaId },
				data: { fixado: input.fixado },
			});
		}),
	remove: protectedProcedure
		.input(z.object({ turmaId, id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const role = await acessoTurma(ctx, input.turmaId);
			const result = await ctx.db.aviso.deleteMany({
				where: {
					id: input.id,
					turmaId: input.turmaId,
					...(role === "MONITOR" ? { autorId: ctx.session.user.id } : {}),
				},
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
