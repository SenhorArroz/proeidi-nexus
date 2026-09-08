"use client";

import { AlignLeft, CheckSquare, CircleDot, Type } from "lucide-react";

export type TipoPergunta =
	| "short_text"
	| "paragraph"
	| "multiple_choice"
	| "checkbox";

export type ModoResposta = "ANONIMO" | "IDENTIFICADO_POR_COOKIE";

export type VisibilidadeFormulario = "COMPARTILHADO" | "DIRETORIA";

export type ConfiguracaoFormulario = {
	corPrimaria: string;
	corDestaque: string;
	corFundo: string;
	fonte: "SANS" | "SERIF" | "MONO";
	mostrarProgresso: boolean;
	atribuirPontuacao: boolean;
};

export const CONFIGURACAO_PADRAO: ConfiguracaoFormulario = {
	corPrimaria: "#0284c7",
	corDestaque: "#ea580c",
	corFundo: "#f8fafc",
	fonte: "SANS",
	mostrarProgresso: true,
	atribuirPontuacao: false,
};

export interface Opcao {
	id: string;
	texto: string;
}

export interface Pergunta {
	id: string;
	titulo: string;
	tipo: TipoPergunta;
	opcoes: Opcao[];
	obrigatoria: boolean;
	respostaCorreta?: string | string[];
}

export const TIPOS_PERGUNTA = [
	{ value: "short_text", label: "Resposta curta", icon: Type },
	{ value: "paragraph", label: "Parágrafo", icon: AlignLeft },
	{ value: "multiple_choice", label: "Múltipla escolha", icon: CircleDot },
	{ value: "checkbox", label: "Caixa de seleção", icon: CheckSquare },
];
