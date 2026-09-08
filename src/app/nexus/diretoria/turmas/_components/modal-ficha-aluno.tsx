"use client";
import { X } from "lucide-react";
import React from "react";
import type { RouterOutputs } from "~/trpc/react";
import { FichaAlunoCompleta } from "./ficha-aluno-completa";
import type { GestaoTurmaProps } from "./janela-gestao-turma";

type ModalFichaAlunoProps = {
	turma: GestaoTurmaProps["turma"];
	historicoAluno: RouterOutputs["aluno"]["detalhe"] | undefined;
	setAlunoSelecionadoId: React.Dispatch<React.SetStateAction<string | null>>;
	carregandoHistorico: boolean;
};
export function ModalFichaAluno({
	turma,
	historicoAluno,
	setAlunoSelecionadoId,
	carregandoHistorico,
}: ModalFichaAlunoProps) {
	return (
		<div
			className="view-modal-ficha-aluno fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 sm:place-items-center sm:p-5"
			role="dialog"
			aria-modal="true"
			aria-label="Ficha completa do aluno"
		>
			<div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
				<div className="flex items-start justify-between gap-4">
					<div>
						<p
							className="text-xs font-bold uppercase tracking-wide"
							style={{ color: turma.corDestaque }}
						>
							Ficha completa
						</p>
						<h2 className="mt-1 text-xl font-bold">
							{historicoAluno?.nome ?? "Carregando…"}
						</h2>
					</div>
					<button
						onClick={() => setAlunoSelecionadoId(null)}
						className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
						aria-label="Fechar ficha"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				{carregandoHistorico ? (
					<p className="py-10 text-sm text-slate-500">
						Carregando informações do aluno…
					</p>
				) : historicoAluno ? (
					<FichaAlunoCompleta aluno={historicoAluno} />
				) : (
					<p className="py-10 text-sm text-slate-500">
						Não foi possível carregar a ficha do aluno.
					</p>
				)}
			</div>
		</div>
	);
}
