import { z } from "zod";

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

export const conteudoSchema = z.object({
	perguntas: z.array(perguntaSchema).min(1).max(100),
});

export const modoRespostaSchema = z.enum([
	"ANONIMO",
	"IDENTIFICADO_POR_COOKIE",
]);

export const visibilidadeSchema = z.enum(["COMPARTILHADO", "DIRETORIA"]);

export const configuracaoSchema = z.object({
	corPrimaria: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#0284c7"),
	corDestaque: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#ea580c"),
	corFundo: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#f8fafc"),
	fonte: z.enum(["SANS", "SERIF", "MONO"]).default("SANS"),
	mostrarProgresso: z.boolean().default(true),
	atribuirPontuacao: z.boolean().default(false),
});
