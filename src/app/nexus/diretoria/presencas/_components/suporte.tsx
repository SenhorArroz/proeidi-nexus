"use client";

import {
	type EstadoPresenca,
	type PessoaPresenca,
} from "~/app/_components/diretoria/presence-grid";

export type Estado = EstadoPresenca;

export type Pessoa = PessoaPresenca;

export const hoje = () => new Date().toISOString().slice(0, 10);
