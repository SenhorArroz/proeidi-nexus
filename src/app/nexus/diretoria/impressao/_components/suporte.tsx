"use client";

export const CABECALHOS = [
	"Semana",
	"Data da aula",
	"Data de entrega",
	"Apostila",
	"Curso",
	"Responsáveis",
	"Pronta?",
	"Impressa?",
	"Quantidade impressa",
	"Quantidade alvo",
	"Aula realizada?",
];

export type Formulario = {
	id?: string;
	semana: number;
	dataAula: string;
	dataEntrega: string;
	aulaRealizada: boolean;
	titulo: string;
	curso: string;
	pronta: boolean;
	impressa: boolean;
	qtdImpressa: number;
	qtdAlvo: number;
	responsavelIds: string[];
};

export const formularioVazio = (semana = 1): Formulario => ({
	semana,
	dataAula: "",
	dataEntrega: "",
	aulaRealizada: false,
	titulo: "",
	curso: "",
	pronta: false,
	impressa: false,
	qtdImpressa: 0,
	qtdAlvo: 0,
	responsavelIds: [],
});

export const texto = (valor: unknown) => String(valor ?? "").trim();

export const normalizar = (valor: unknown) =>
	texto(valor)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase();

export const sim = (valor: unknown) =>
	["sim", "s", "true", "1", "x"].includes(normalizar(valor));
