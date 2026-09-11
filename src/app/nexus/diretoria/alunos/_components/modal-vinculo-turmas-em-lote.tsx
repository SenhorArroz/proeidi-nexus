"use client";

import { Check, Layers3, Users, X } from "lucide-react";
import type { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type Props = {
	semestreSelecionado: Estado["semestreSelecionado"];
	alunosFiltrados: Estado["alunosFiltrados"];
	alunosSelecionados: Estado["alunosSelecionados"];
	turmasDb: Estado["turmasDb"];
	turmaIdsParaVinculo: Estado["turmaIdsParaVinculo"];
	setTurmaIdsParaVinculo: Estado["setTurmaIdsParaVinculo"];
	setIsVinculoTurmasModalOpen: Estado["setIsVinculoTurmasModalOpen"];
	salvarVinculoTurmasEmLote: Estado["salvarVinculoTurmasEmLote"];
	vincularTurmasEmLote: Estado["vincularTurmasEmLote"];
};

export function ModalVinculoTurmasEmLote({
	semestreSelecionado,
	alunosFiltrados,
	alunosSelecionados,
	turmasDb,
	turmaIdsParaVinculo,
	setTurmaIdsParaVinculo,
	setIsVinculoTurmasModalOpen,
	salvarVinculoTurmasEmLote,
	vincularTurmasEmLote,
}: Props) {
	const alunos = alunosFiltrados.filter((aluno) =>
		alunosSelecionados.includes(aluno.id),
	);
	const alternarTurma = (turmaId: string) =>
		setTurmaIdsParaVinculo((ids) =>
			ids.includes(turmaId)
				? ids.filter((id) => id !== turmaId)
				: [...ids, turmaId],
		);

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-6">
			<div className="flex max-h-[96dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-3xl">
				<header className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7">
					<div className="flex gap-3">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
							<Layers3 className="h-5 w-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-slate-900">
								Vincular seleção a turmas
							</h2>
							<p className="mt-1 text-sm text-slate-600">
								Semestre {semestreSelecionado?.codigo}. A seleção de alunos e as
								turmas são organizadas separadamente.
							</p>
						</div>
					</div>
					<button
						type="button"
						onClick={() => setIsVinculoTurmasModalOpen(false)}
						aria-label="Fechar"
						className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
					>
						<X className="h-5 w-5" />
					</button>
				</header>

				<div className="grid min-h-0 flex-1 gap-5 overflow-y-auto bg-slate-50 p-5 sm:grid-cols-2 sm:p-7">
					<section className="min-w-0">
						<div className="mb-3 flex items-center gap-2 text-sky-950">
							<Users className="h-4 w-4 text-sky-700" />
							<h3 className="font-bold">Alunos selecionados</h3>
							<span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
								{alunos.length}
							</span>
						</div>
						<div className="space-y-2 rounded-2xl border border-sky-100 bg-white p-3">
							{alunos.map((aluno) => (
								<div
									key={aluno.id}
									className="flex items-center gap-3 rounded-xl bg-sky-50/70 px-3 py-2.5"
								>
									<span className="flex h-6 w-6 items-center justify-center rounded-full bg-sky-600 text-white">
										<Check className="h-3.5 w-3.5" />
									</span>
									<span className="min-w-0 truncate text-sm font-semibold text-sky-950">
										{aluno.nome}
									</span>
								</div>
							))}
						</div>
					</section>

					<section className="min-w-0">
						<div className="mb-3 flex items-center gap-2 text-amber-950">
							<Layers3 className="h-4 w-4 text-amber-700" />
							<h3 className="font-bold">Turmas para vincular</h3>
							<span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
								{turmaIdsParaVinculo.length}
							</span>
						</div>
						<div className="space-y-2 rounded-2xl border border-amber-100 bg-white p-3">
							{turmasDb?.length ? (
								turmasDb.map((turma) => {
									const selecionada = turmaIdsParaVinculo.includes(turma.id);
									return (
										<label
											key={turma.id}
											className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${selecionada ? "border-amber-400 bg-amber-50" : "border-slate-200 hover:border-amber-200 hover:bg-amber-50/50"}`}
										>
											<input
												type="checkbox"
												checked={selecionada}
												onChange={() => alternarTurma(turma.id)}
												className="h-4 w-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
											/>
											<span className="min-w-0 flex-1">
												<span className="block text-sm font-bold text-amber-950">
													{turma.titulo}
												</span>
												<span className="block text-xs text-amber-800">
													{turma.alunos.length} de {turma.limiteAlunos} alunos
												</span>
											</span>
										</label>
									);
								})
							) : (
								<p className="p-3 text-sm text-slate-600">
									Não há turmas neste semestre.
								</p>
							)}
						</div>
					</section>
				</div>

				<footer className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
					<p className="text-sm text-slate-600">
						{alunos.length} aluno(s) × {turmaIdsParaVinculo.length} turma(s)
					</p>
					<div className="flex flex-col-reverse gap-2 sm:flex-row">
						<button
							type="button"
							onClick={() => setIsVinculoTurmasModalOpen(false)}
							className="min-h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
						>
							Cancelar
						</button>
						<button
							type="button"
							disabled={
								!turmaIdsParaVinculo.length || vincularTurmasEmLote.isPending
							}
							onClick={salvarVinculoTurmasEmLote}
							className="min-h-11 rounded-xl bg-sky-600 px-5 text-sm font-bold text-sky-50 hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							{vincularTurmasEmLote.isPending
								? "Vinculando..."
								: "Confirmar vínculos"}
						</button>
					</div>
				</footer>
			</div>
		</div>
	);
}
