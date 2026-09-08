"use client";
import { JanelaGestaoTurma } from "./_components/janela-gestao-turma";
import { TurmaCard } from "./_components/turma-card";
import { useTurmasDiretoria } from "./_components/use-turmas-diretoria";

import { ClipboardCheck, DoorOpen, Plus } from "lucide-react";
import Link from "next/link";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";

export default function TurmasDiretoria() {
	const {
		modo,
		rascunho,
		semestres,
		alunosDb,
		docentesDb,
		monitoresDb,
		setRascunho,
		cancelar,
		salvar,
		criar,
		atualizar,
		semestreSelecionado,
		setSemestreSelecionadoId,
		turmas,
		abrirNova,
		carregandoSemestres,
		carregandoTurmas,
		erroCarregamento,
		recarregar,
		abrirEdicao,
		duplicarTurma,
		limparAlunosDaTurma,
		excluir,
		duplicar,
	} = useTurmasDiretoria();

	if (modo === "form") {
		return (
			<JanelaGestaoTurma
				turma={rascunho}
				semestres={semestres ?? []}
				alunosDb={alunosDb ?? []}
				docentesDb={docentesDb}
				monitoresDb={monitoresDb ?? []}
				onChange={setRascunho}
				onVoltar={cancelar}
				onSalvar={salvar}
				salvando={criar.isPending || atualizar.isPending}
			/>
		);
	}

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 flex flex-col items-center font-sans px-3 py-6 sm:px-4 sm:py-6">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6">
				<DiretoriaPageIntro
					icon={DoorOpen}
					title="Gerenciar turmas"
					description="Cadastro de turmas, professores, monitores, alunos e aulas."
					actions={
						<Link
							href={`/nexus/diretoria/turmas/controle?semestreId=${semestreSelecionado?.id ?? ""}`}
							className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600"
						>
							<ClipboardCheck className="h-4 w-4" />
							Controle de turma
						</Link>
					}
				/>
			</div>

			<div className="w-full max-w-5xl">
				{
					<>
						<div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
								<label
									htmlFor="semestre-selecionado"
									className="text-xs font-semibold uppercase tracking-wide text-gray-500"
								>
									Semestre
								</label>
								<select
									id="semestre-selecionado"
									value={semestreSelecionado?.id ?? ""}
									onChange={(e) => setSemestreSelecionadoId(e.target.value)}
									className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-semibold text-gray-700 sm:w-auto sm:text-sm"
								>
									{semestres?.map((semestre) => (
										<option key={semestre.id} value={semestre.id}>
											{semestre.codigo}
											{semestre.ativo ? " — ativo" : ""}
										</option>
									))}
								</select>
								<span className="text-sm font-medium text-gray-700">
									{turmas.length} turmas cadastradas
								</span>
							</div>
							<button
								type="button"
								onClick={abrirNova}
								className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 sm:w-auto"
							>
								<Plus className="w-4 h-4" />
								Nova turma
							</button>
						</div>

						{carregandoSemestres || carregandoTurmas ? (
							<DataSkeleton cards={4} />
						) : erroCarregamento ? (
							<div
								role="alert"
								className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center text-red-900"
							>
								<p className="font-bold">
									Não foi possível carregar as turmas.
								</p>
								<p className="mt-1 text-sm">
									{erroCarregamento.message ||
										"Verifique sua conexão e tente novamente."}
								</p>
								<button
									type="button"
									onClick={() => void recarregar()}
									className="mt-4 min-h-11 rounded-xl bg-red-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-800"
								>
									Tentar novamente
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{turmas.map((turma) => (
									<TurmaCard
										key={turma.id}
										turma={turma}
										onEditar={() => abrirEdicao(turma)}
										onDuplicar={() => duplicarTurma(turma.id)}
										onLimparAlunos={() => limparAlunosDaTurma(turma)}
										onExcluir={() => excluir(turma.id)}
										duplicando={duplicar.isPending}
									/>
								))}
							</div>
						)}

						{!carregandoSemestres &&
							!carregandoTurmas &&
							turmas.length === 0 && (
								<div className="text-center py-16 text-sm text-gray-400">
									Nenhuma turma cadastrada ainda
								</div>
							)}
					</>
				}
			</div>
		</div>
	);
}
