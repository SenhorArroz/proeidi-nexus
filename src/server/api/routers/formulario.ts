import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";

const perguntaSchema = z.object({
	id: z.string().min(1),
	titulo: z.string().min(1).max(500),
	tipo: z.enum(["short_text", "paragraph", "multiple_choice", "checkbox"]),
	opcoes: z
		.array(
			z.object({ id: z.string().min(1), texto: z.string().min(1).max(300) }),
		)
		.default([]),
	obrigatoria: z.boolean().default(false),
	respostaCorreta: z
		.union([z.string().max(300), z.array(z.string().max(300))])
		.optional(),
});
const conteudoSchema = z.object({
	perguntas: z.array(perguntaSchema).min(1).max(100),
});
const diretorProcedure = protectedProcedure.use(({ ctx, next }) => {
	if (
		ctx.session.user.role !== "DIRETOR" &&
		ctx.session.user.role !== "COORDENADOR"
	)
		throw new TRPCError({ code: "FORBIDDEN" });
	return next();
});

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 72);

export const formularioRouter = createTRPCRouter({
	list: diretorProcedure.query(({ ctx }) =>
		ctx.db.formulario.findMany({
			orderBy: { updatedAt: "desc" },
			include: { _count: { select: { respostas: true } } },
		}),
	),
	create: diretorProcedure
		.input(
			z.object({
				titulo: z.string().min(3).max(160),
				descricao: z.string().max(1000).nullable().optional(),
				conteudo: conteudoSchema,
				publicado: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const base = slugify(input.titulo) || "questionario";
			let slug = base;
			let attempt = 2;
			while (
				await ctx.db.formulario.findUnique({
					where: { slug },
					select: { id: true },
				})
			)
				slug = `${base}-${attempt++}`;
			return ctx.db.formulario.create({
				data: { ...input, descricao: input.descricao || null, slug },
			});
		}),
	update: diretorProcedure
		.input(
			z.object({
				id: z.string().cuid(),
				titulo: z.string().min(3).max(160),
				descricao: z.string().max(1000).nullable().optional(),
				conteudo: conteudoSchema,
				publicado: z.boolean(),
			}),
		)
		.mutation(({ ctx, input }) =>
			ctx.db.formulario.update({
				where: { id: input.id },
				data: {
					titulo: input.titulo,
					descricao: input.descricao || null,
					conteudo: input.conteudo,
					publicado: input.publicado,
				},
			}),
		),
	remove: diretorProcedure
		.input(z.object({ id: z.string().cuid() }))
		.mutation(({ ctx, input }) =>
			ctx.db.formulario.delete({ where: { id: input.id } }),
		),
	stats: diretorProcedure
		.input(z.object({ id: z.string().cuid() }))
		.query(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { id: input.id },
				include: { respostas: { orderBy: { createdAt: "desc" } } },
			});
			if (!formulario) throw new TRPCError({ code: "NOT_FOUND" });
			return { formulario, totalRespostas: formulario.respostas.length };
		}),
	publicGet: publicProcedure
		.input(z.object({ slug: z.string().min(1) }))
		.query(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { slug: input.slug },
				select: {
					id: true,
					titulo: true,
					descricao: true,
					conteudo: true,
					publicado: true,
				},
			});
			if (!formulario?.publicado) throw new TRPCError({ code: "NOT_FOUND" });
			return formulario;
		}),
	publicSubmit: publicProcedure
		.input(
			z.object({
				slug: z.string().min(1),
				respostas: z.record(
					z.union([z.string().max(5000), z.array(z.string().max(5000))]),
				),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { slug: input.slug },
				select: { id: true, conteudo: true, publicado: true },
			});
			if (!formulario?.publicado) throw new TRPCError({ code: "NOT_FOUND" });
			const conteudo = conteudoSchema.parse(formulario.conteudo);
			for (const pergunta of conteudo.perguntas)
				if (pergunta.obrigatoria && !input.respostas[pergunta.id]?.length)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Preencha as perguntas obrigatórias.",
					});
			return ctx.db.formularioResposta.create({
				data: { formularioId: formulario.id, respostas: input.respostas },
			});
		}),
});
