"use client";

export type Diretor = {
	id: string;
	nome: string;
	matricula: string;
	email: string;
};

export const vazio = (): Diretor => ({
	id: "",
	nome: "",
	matricula: "",
	email: "",
});
