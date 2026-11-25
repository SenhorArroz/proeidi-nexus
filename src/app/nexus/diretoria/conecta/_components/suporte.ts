import type { RouterOutputs } from "~/trpc/react";

export type Aba = "ranking" | "equipes" | "doacoes" | "provas" | "itens";
export type DadosConecta = RouterOutputs["conecta"]["dados"];

export type AbaConectaProps = {
	ativa: boolean;
	dados: DadosConecta | undefined;
	atualizar: (mensagem: string) => Promise<void>;
	falha: (erro: { message: string }) => void;
};

export const campo =
	"min-h-11 w-full rounded-xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] px-3 text-sm text-[var(--nexus-ink)] focus-visible:outline-2 focus-visible:outline-sky-600";
export const botao =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50";
export const botaoSecundario =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--nexus-line)] px-4 py-2 text-sm font-semibold hover:bg-[var(--nexus-hover)]";
export const botaoIcone = `${botaoSecundario} w-11 shrink-0 px-0`;
export const formulario =
	"min-w-0 space-y-4 rounded-2xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-4 sm:p-5";
export const linha =
	"flex flex-wrap items-start gap-2 rounded-xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-3 sm:p-4";
const formatoPontos = new Intl.NumberFormat("pt-BR", {
	maximumFractionDigits: 2,
});
export const pontos = (valor: number) => formatoPontos.format(valor);

export const confirmarExclusao = (nome: string) =>
	window.confirm(`Excluir ${nome}?`);
