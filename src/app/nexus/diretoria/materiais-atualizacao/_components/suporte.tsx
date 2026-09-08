"use client";

export const CABECALHOS = [
	"Curso",
	"Material",
	"Responsável",
	"Data de entrega",
	"Revisado",
	"Precisa de ajuste",
	"Ajustado",
];

export type Formulario = {
	id?: string;
	curso: string;
	titulo: string;
	dataEntrega: string;
	revisado: boolean;
	precisaAjuste: boolean;
	ajustado: boolean;
	responsavelIds: string[];
};

export const vazio = (): Formulario => ({
	curso: "",
	titulo: "",
	dataEntrega: "",
	revisado: false,
	precisaAjuste: false,
	ajustado: false,
	responsavelIds: [],
});

export const texto = (valor: unknown) => String(valor ?? "").trim();

export const sim = (valor: unknown) =>
	["sim", "s", "true", "1", "x"].includes(
		texto(valor)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase(),
	);
