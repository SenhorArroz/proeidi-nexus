import { TRPCError } from "@trpc/server";
import { Prisma } from "../../../../../../generated/prisma";
import { z } from "zod";
import { publicProcedure } from "~/server/api/trpc";
import { conteudoSchema, configuracaoSchema } from "./suporte";

export const publicoProcedures = {
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
					visibilidade: true,
					modoResposta: true,
					limitarPorNavegador: true,
					configuracao: true,
				},
			});
			if (!formulario?.publicado || formulario.visibilidade !== "COMPARTILHADO")
				throw new TRPCError({ code: "NOT_FOUND" });
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
					visibilidade: true,
					modoResposta: true,
					limitarPorNavegador: true,
				},
			});
			if (!formulario?.publicado || formulario.visibilidade !== "COMPARTILHADO")
				throw new TRPCError({ code: "NOT_FOUND" });
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
				select: {
					id: true,
					conteudo: true,
					publicado: true,
					visibilidade: true,
					modoResposta: true,
					limitarPorNavegador: true,
					configuracao: true,
				},
			});
			if (!formulario?.publicado || formulario.visibilidade !== "COMPARTILHADO")
				throw new TRPCError({ code: "NOT_FOUND" });
			const conteudo = conteudoSchema.parse(formulario.conteudo);
			for (const pergunta of conteudo.perguntas)
				if (pergunta.obrigatoria && !input.respostas[pergunta.id]?.length)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Preencha as perguntas obrigatórias.",
					});
			const respostaIdentificada =
				formulario.modoResposta === "IDENTIFICADO_POR_COOKIE";
			const limitarPorNavegador =
				formulario.limitarPorNavegador || respostaIdentificada;
			const configuracao = configuracaoSchema.parse(
				formulario.configuracao ?? {},
			);
			if (respostaIdentificada && !input.nomeRespondente)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Informe seu nome para responder a este questionário.",
				});
			if (limitarPorNavegador && !input.identificadorCookie)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Não foi possível identificar este navegador. Recarregue a página e tente novamente.",
				});
			const pontuacao = configuracao.atribuirPontuacao
				? conteudo.perguntas.reduce((total, pergunta) => {
						const correta = pergunta.respostaCorreta;
						if (!correta) return total;
						const recebida = input.respostas[pergunta.id];
						const iguais = Array.isArray(correta)
							? Array.isArray(recebida) &&
								correta.length === recebida.length &&
								[...correta]
									.sort()
									.every(
										(valor, indice) => valor === [...recebida].sort()[indice],
									)
							: recebida === correta;
						return total + (iguais ? 1 : 0);
					}, 0)
				: null;
			const dadosResposta = {
				respostas: input.respostas,
				nomeRespondente: respostaIdentificada ? input.nomeRespondente : null,
				identificadorCookie: limitarPorNavegador
					? input.identificadorCookie
					: null,
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
};
