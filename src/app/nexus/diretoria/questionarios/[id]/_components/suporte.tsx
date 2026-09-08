"use client";

export type Pergunta = {
	id: string;
	titulo: string;
	tipo: "short_text" | "paragraph" | "multiple_choice" | "checkbox";
	opcoes?: { texto: string }[];
	respostaCorreta?: string | string[];
};

export type Respostas = Record<string, string | string[]>;

export const lista = (valor: string | string[] | undefined) =>
	valor === undefined ? [] : Array.isArray(valor) ? valor : [valor];
