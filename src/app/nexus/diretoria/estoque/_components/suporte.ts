import type { RouterOutputs } from "~/trpc/react";

export type Item = RouterOutputs["estoque"]["listar"][number];
export type Categoria = RouterOutputs["estoque"]["listarCategorias"][number];

export type Rascunho = {
	nome: string;
	qtd: string;
	validade: string;
	categoriaIds: string[];
};

export const campo =
	"min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-600 focus:ring-2 focus:ring-sky-100";
export const botaoPrimario =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-50";
