import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../../generated/prisma";
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
const modoRespostaSchema = z.enum(["ANONIMO", "IDENTIFICADO_POR_COOKIE"]);
const configuracaoSchema = z.object({
	corPrimaria: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0284c7"),
	corDestaque: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#ea580c"),
	corFundo: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#f8fafc"),
	fonte: z.enum(["SANS", "SERIF", "MONO"]).default("SANS"),
	mostrarProgresso: z.boolean().default(true),
	atribuirPontuacao: z.boolean().default(false),
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
				modoResposta: modoRespostaSchema.default("ANONIMO"),
				limitarPorNavegador: z.boolean().default(false),
				configuracao: configuracaoSchema.default({}),
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
				modoResposta: modoRespostaSchema,
				limitarPorNavegador: z.boolean(),
				configuracao: configuracaoSchema,
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
					modoResposta: input.modoResposta,
					limitarPorNavegador: input.limitarPorNavegador,
					configuracao: input.configuracao,
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
					modoResposta: true,
					limitarPorNavegador: true,
					configuracao: true,
				},
			});
			if (!formulario?.publicado) throw new TRPCError({ code: "NOT_FOUND" });
			return formulario;
		}),
	publicResponseStatus: publicProcedure
		.input(
			z.object({
				slug: z.string().min(1),
				identificadorCookie: z.string().uuid(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { slug: input.slug },
				select: {
					id: true,
					publicado: true,
					modoResposta: true,
					limitarPorNavegador: true,
				},
			});
			if (!formulario?.publicado) throw new TRPCError({ code: "NOT_FOUND" });
			const exigeIdentificador =
				formulario.limitarPorNavegador ||
				formulario.modoResposta === "IDENTIFICADO_POR_COOKIE";
			if (!exigeIdentificador) return { resposta: null };
			const resposta = await ctx.db.formularioResposta.findUnique({
				where: {
					formularioId_identificadorCookie: {
						formularioId: formulario.id,
						identificadorCookie: input.identificadorCookie,
					},
				},
				select: {
					id: true,
					respostas: true,
					nomeRespondente: true,
					pontuacao: true,
					createdAt: true,
				},
			});
			return { resposta };
		}),
	publicSubmit: publicProcedure
		.input(
			z.object({
				slug: z.string().min(1),
				respostas: z.record(
					z.union([z.string().max(5000), z.array(z.string().max(5000))]),
				),
				nomeRespondente: z.string().trim().max(160).optional(),
				identificadorCookie: z.string().uuid().optional(),
				editarUltima: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { slug: input.slug },
				select: { id: true, conteudo: true, publicado: true, modoResposta: true, limitarPorNavegador: true, configuracao: true },
			});
			if (!formulario?.publicado) throw new TRPCError({ code: "NOT_FOUND" });
			const conteudo = conteudoSchema.parse(formulario.conteudo);
			for (const pergunta of conteudo.perguntas)
				if (pergunta.obrigatoria && !input.respostas[pergunta.id]?.length)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Preencha as perguntas obrigatórias.",
					});
			const respostaIdentificada = formulario.modoResposta === "IDENTIFICADO_POR_COOKIE";
			const limitarPorNavegador = formulario.limitarPorNavegador || respostaIdentificada;
			const configuracao = configuracaoSchema.parse(formulario.configuracao ?? {});
			if (respostaIdentificada && !input.nomeRespondente)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Informe seu nome para responder a este questionário.",
				});
			if (limitarPorNavegador && !input.identificadorCookie)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Não foi possível identificar este navegador. Recarregue a página e tente novamente.",
				});
			const pontuacao = configuracao.atribuirPontuacao
				? conteudo.perguntas.reduce((total, pergunta) => {
					const correta = pergunta.respostaCorreta;
					if (!correta) return total;
					const recebida = input.respostas[pergunta.id];
					const iguais = Array.isArray(correta)
						? Array.isArray(recebida) && correta.length === recebida.length && [...correta].sort().every((valor, indice) => valor === [...recebida].sort()[indice])
						: recebida === correta;
					return total + (iguais ? 1 : 0);
				}, 0)
				: null;
			const dadosResposta = {
				respostas: input.respostas,
				nomeRespondente: respostaIdentificada ? input.nomeRespondente : null,
				identificadorCookie: limitarPorNavegador ? input.identificadorCookie : null,
				pontuacao,
			};
			if (input.editarUltima) {
				if (!limitarPorNavegador || !input.identificadorCookie)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Esta resposta não pode ser editada.",
					});
				try {
					return await ctx.db.formularioResposta.update({
						where: {
							formularioId_identificadorCookie: {
								formularioId: formulario.id,
								identificadorCookie: input.identificadorCookie,
							},
						},
						data: dadosResposta,
					});
				} catch (error) {
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						error.code === "P2025"
					)
						throw new TRPCError({
							code: "NOT_FOUND",
							message: "A resposta anterior não foi encontrada.",
						});
					throw error;
				}
			}
			try {
				return await ctx.db.formularioResposta.create({
					data: {
						formularioId: formulario.id,
						...dadosResposta,
					},
				});
			} catch (error) {
				if (
					error instanceof Prisma.PrismaClientKnownRequestError &&
					error.code === "P2002"
				)
					throw new TRPCError({
						code: "CONFLICT",
						message: "Este navegador já respondeu a este questionário.",
					});
				throw error;
			}
		}),
});
