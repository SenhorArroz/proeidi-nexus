"use client";

import { useState } from "react";
import type { EstadoPresenca } from "./presence-grid";

export type GrupoPresenca = "alunos" | "monitores" | "professores";
export type ModoEquipe = "sincronizar" | "somente-turma";
type Marcacao = { id: string; estado: EstadoPresenca };
type Chamada = Record<GrupoPresenca, Marcacao[]>;
type Entrada = Chamada & {
	turmaId: string;
	data: Date;
	modoEquipe: ModoEquipe;
};

export function useSalvamentoPresencas({
	turmaId,
	salvarDia,
	atualizarListas,
	aoSalvar,
}: {
	turmaId: string | undefined;
	salvarDia: (entrada: Entrada) => Promise<unknown>;
	atualizarListas: () => Promise<unknown>;
	aoSalvar?: (dias: string[], total: number) => void;
}) {
	const [rascunhos, setRascunhos] = useState<
		Record<string, Record<string, Chamada>>
	>({});
	const [salvando, setSalvando] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const [confirmarEquipe, setConfirmarEquipe] = useState(false);
	const diasDaTurma = turmaId ? rascunhos[turmaId] : undefined;

	const alterar = (
		grupo: GrupoPresenca,
		id: string,
		dia: string,
		estado: EstadoPresenca,
	) => {
		if (!turmaId) return;
		setErro(null);
		setRascunhos((atual) => {
			const dias = atual[turmaId] ?? {};
			const chamada = dias[dia] ?? {
				alunos: [],
				monitores: [],
				professores: [],
			};
			return {
				...atual,
				[turmaId]: {
					...dias,
					[dia]: {
						...chamada,
						[grupo]: [
							...chamada[grupo].filter((pessoa) => pessoa.id !== id),
							{ id, estado },
						],
					},
				},
			};
		});
	};

	const estadoRascunho = (grupo: GrupoPresenca, id: string, dia: string) =>
		diasDaTurma?.[dia]?.[grupo].find((pessoa) => pessoa.id === id)?.estado;

	const salvar = async (modoEquipe: ModoEquipe) => {
		if (!turmaId || !diasDaTurma || salvando) return;
		setConfirmarEquipe(false);
		setErro(null);
		setSalvando(true);
		try {
			const dias = Object.entries(diasDaTurma);
			const resultados = await Promise.allSettled(
				dias.map(([dia, chamada]) =>
					salvarDia({
						turmaId,
						data: new Date(`${dia}T12:00:00Z`),
						modoEquipe,
						...chamada,
					}),
				),
			);
			const salvos = dias.filter(
				(_, i) => resultados[i]?.status === "fulfilled",
			);
			if (salvos.length) {
				setRascunhos((atual) => {
					const pendentes = { ...atual[turmaId] };
					for (const [dia, chamada] of salvos) {
						const rascunho = pendentes[dia];
						if (!rascunho) continue;
						const retirarSalvos = (grupo: GrupoPresenca) =>
							rascunho[grupo].filter(
								(pessoa) => !chamada[grupo].includes(pessoa),
							);
						const restante = {
							alunos: retirarSalvos("alunos"),
							monitores: retirarSalvos("monitores"),
							professores: retirarSalvos("professores"),
						};
						if (
							restante.alunos.length ||
							restante.monitores.length ||
							restante.professores.length
						)
							pendentes[dia] = restante;
						else delete pendentes[dia];
					}
					return { ...atual, [turmaId]: pendentes };
				});
				await atualizarListas();
			}

			const falha = resultados.find(
				(resultado) => resultado.status === "rejected",
			);
			if (falha) {
				setErro(
					falha.reason instanceof Error
						? falha.reason.message
						: "Não foi possível salvar as presenças.",
				);
				return;
			}
			aoSalvar?.(
				salvos.map(([dia]) => dia),
				salvos.reduce(
					(total, [, chamada]) =>
						total +
						chamada.alunos.length +
						chamada.monitores.length +
						chamada.professores.length,
					0,
				),
			);
		} finally {
			setSalvando(false);
		}
	};

	const iniciar = () => {
		const dias = Object.values(diasDaTurma ?? {});
		if (!dias.length || salvando) return;
		if (
			dias.some(
				({ monitores, professores }) => monitores.length || professores.length,
			)
		)
			setConfirmarEquipe(true);
		else void salvar("sincronizar");
	};

	return {
		alterar,
		estadoRascunho,
		iniciar,
		salvar,
		salvando,
		erro,
		confirmarEquipe,
		cancelarConfirmacao: () => setConfirmarEquipe(false),
		temAlteracoes: Object.keys(diasDaTurma ?? {}).length > 0,
	};
}
