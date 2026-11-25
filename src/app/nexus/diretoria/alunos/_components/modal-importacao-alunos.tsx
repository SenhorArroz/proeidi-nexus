"use client";

import { Check, FileSpreadsheet, Search, Upload, Users, X } from "lucide-react";
import { useState } from "react";
import type { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type Props = Pick<
	Estado,
	| "semestreSelecionado"
	| "fileInputRef"
	| "handleFileUpload"
	| "alunosParaImportar"
	| "alunosSelecionadosImportacao"
	| "turmaIdsImportacao"
	| "vinculosImportacao"
	| "avisosVinculoImportacao"
	| "sugestoesTurmaImportacao"
	| "turmasDb"
	| "alternarSelecaoImportacao"
	| "alternarTurmaImportacao"
	| "adicionarVinculoImportacao"
	| "confirmarImportacao"
	| "importandoAlunos"
> & { setIsImportModalOpen: Estado["setIsImportModalOpen"] };

import { SugestoesTurmaImportacao } from "./sugestoes-turma-importacao";

import { VinculosImportacao } from "./vinculos-importacao";

export function ModalImportacaoAlunos(p: Props) {
	const [buscaAlunos, setBuscaAlunos] = useState("");
	const [buscaTurmas, setBuscaTurmas] = useState("");
	const [retorno, setRetorno] = useState("");
	const revisando = p.alunosParaImportar.length > 0;
	const normalizar = (valor: string) =>
		valor
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase();
	const nome = (id: string) =>
		p.alunosParaImportar.find((aluno) => aluno.id === id)?.nome ?? "Aluno";
	const nomeTurma = (id: string) =>
		p.turmasDb?.find((turma) => turma.id === id)?.titulo ?? "Turma";
	const alunos = p.alunosParaImportar.filter((aluno) =>
		normalizar(`${aluno.nome} ${aluno.cpf} ${aluno.telefone ?? ""}`).includes(
			normalizar(buscaAlunos),
		),
	);
	const turmas = p.turmasDb?.filter((turma) =>
		normalizar(
			`${turma.titulo} ${turma.professores.map((v) => v.user.nome).join(" ")}`,
		).includes(normalizar(buscaTurmas)),
	);
	const criarVinculo = () => {
		if (
			!p.alunosSelecionadosImportacao.length ||
			!p.turmaIdsImportacao.length
		) {
			setRetorno("Selecione os alunos e uma turma para montar o vínculo.");
			return;
		}
		setRetorno(
			`Turma definida para ${p.alunosSelecionadosImportacao.length} aluno(s).`,
		);
		p.adicionarVinculoImportacao();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/55 p-0 backdrop-blur-sm sm:items-center sm:p-6">
			<div className="flex max-h-[96dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[1.75rem] bg-slate-50 shadow-[0_24px_70px_rgba(2,132,199,.28)] dark:bg-slate-950 sm:max-h-[90vh] sm:rounded-[1.75rem]">
				<header className="relative overflow-hidden bg-sky-600 px-5 py-5 text-white sm:px-7">
					<span
						aria-hidden="true"
						className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-orange-500"
					/>
					<span
						aria-hidden="true"
						className="absolute bottom-[-2.75rem] right-28 h-20 w-20 rounded-t-full border-[12px] border-sky-200/75"
					/>
					<div className="relative flex items-start justify-between gap-4">
						<div className="flex items-center gap-3">
							<span className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 shadow-sm">
								<FileSpreadsheet className="h-5 w-5" />
							</span>
							<div>
								<h2 className="text-xl font-black tracking-[-.025em]">
									{revisando ? "Organizar importação" : "Importar planilha"}
								</h2>
								<p className="mt-1 text-sm text-sky-100">
									Semestre {p.semestreSelecionado?.codigo ?? "não selecionado"}
								</p>
							</div>
						</div>
						<button
							type="button"
							onClick={() => p.setIsImportModalOpen(false)}
							aria-label="Fechar importação"
							className="rounded-xl bg-white/15 p-2 text-white transition hover:bg-white/25"
						>
							<X className="h-5 w-5" />
						</button>
					</div>
				</header>

				{!revisando ? (
					<div className="flex flex-1 flex-col items-center justify-center gap-5 p-6 sm:p-10">
						<p className="max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
							A planilha será revisada antes de salvar. Monte seleções de alunos
							e defina uma turma para cada seleção.
						</p>
						<label className="flex w-full max-w-xl cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-sky-200 bg-white p-8 text-center shadow-[0_12px_30px_rgba(15,23,42,.06)] transition hover:border-sky-500 hover:bg-sky-50 dark:border-sky-900 dark:bg-slate-900 dark:hover:bg-sky-950/50">
							<Upload className="mb-3 h-10 w-10 text-orange-500" />
							<span className="font-extrabold text-slate-900 dark:text-slate-100">
								Selecionar planilha
							</span>
							<span className="mt-1 text-xs text-slate-500 dark:text-slate-300">
								.xlsx, .xls, .csv ou .ods
							</span>
							<input
								type="file"
								accept=".xlsx, .xls, .csv, .ods"
								ref={p.fileInputRef}
								onChange={p.handleFileUpload}
								className="sr-only"
							/>
						</label>
					</div>
				) : (
					<>
						<div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
							<SugestoesTurmaImportacao
								sugestoes={p.sugestoesTurmaImportacao}
							/>
							<div className="grid gap-5 md:grid-cols-2">
								<section className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] dark:bg-slate-900">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="flex items-center gap-2 font-extrabold text-slate-900 dark:text-slate-100">
											<Users className="h-4 w-4 text-sky-600" /> Alunos da
											planilha
										</h3>
										<span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/70 dark:text-sky-200">
											{p.alunosParaImportar.length}
										</span>
									</div>
									<label className="mb-3 flex items-center gap-2 rounded-xl border border-sky-200 bg-sky-50 px-3 py-2 text-sky-700 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-200">
										<Search className="h-4 w-4" />
										<input
											value={buscaAlunos}
											onChange={(event) => setBuscaAlunos(event.target.value)}
											placeholder="Nome, CPF ou telefone"
											className="w-full bg-transparent text-sm outline-none placeholder:text-sky-500"
										/>
									</label>
									<div className="max-h-64 space-y-1 overflow-y-auto pr-1">
										{alunos.map((aluno) => (
											<label
												key={aluno.id}
												className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-sky-950 hover:bg-sky-50 dark:text-sky-100 dark:hover:bg-slate-800"
											>
												<input
													type="checkbox"
													checked={p.alunosSelecionadosImportacao.includes(
														aluno.id,
													)}
													onChange={() => p.alternarSelecaoImportacao(aluno.id)}
													className="h-4 w-4 accent-sky-600"
												/>
												<span className="font-semibold">{aluno.nome}</span>
											</label>
										))}
									</div>
								</section>

								<section className="rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] dark:bg-slate-900">
									<div className="mb-3 flex items-center justify-between">
										<h3 className="font-extrabold text-slate-900 dark:text-slate-100">
											Turmas do semestre
										</h3>
										<span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800 dark:bg-orange-950/60 dark:text-orange-200">
											{p.turmasDb?.length ?? 0}
										</span>
									</div>
									<label className="mb-3 flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-200">
										<Search className="h-4 w-4" />
										<input
											value={buscaTurmas}
											onChange={(event) => setBuscaTurmas(event.target.value)}
											placeholder="Turma ou professor"
											className="w-full bg-transparent text-sm outline-none placeholder:text-orange-500"
										/>
									</label>
									<div className="max-h-64 space-y-1 overflow-y-auto pr-1">
										{turmas?.map((turma) => (
											<label
												key={turma.id}
												className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-orange-950 hover:bg-orange-50 dark:text-orange-100 dark:hover:bg-slate-800"
											>
												<input
													type="radio"
													name="turma-importacao"
													checked={p.turmaIdsImportacao.includes(turma.id)}
													onChange={() => p.alternarTurmaImportacao(turma.id)}
													className="h-4 w-4 accent-orange-500"
												/>
												<span>
													<span className="block font-semibold">
														{turma.titulo}
													</span>
													<span className="text-xs text-slate-500">
														{turma.professores
															.map((v) => v.user.nome)
															.join(", ") || "Sem professor"}
													</span>
												</span>
											</label>
										))}
									</div>
									<button
										type="button"
										onClick={criarVinculo}
										className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 text-sm font-bold text-white transition hover:bg-orange-600"
									>
										<Check className="h-4 w-4" /> Definir turma da seleção
									</button>
									{retorno && (
										<p
											role="status"
											className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200"
										>
											{retorno}
										</p>
									)}
								</section>
							</div>

							<VinculosImportacao
								vinculos={p.vinculosImportacao}
								avisos={p.avisosVinculoImportacao}
								nome={nome}
								nomeTurma={nomeTurma}
							/>
						</div>
						<footer className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900 sm:flex-row sm:justify-end">
							<button
								type="button"
								onClick={() => p.setIsImportModalOpen(false)}
								className="min-h-11 rounded-xl border border-slate-200 px-5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={p.confirmarImportacao}
								disabled={p.importandoAlunos}
								className="min-h-11 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-sky-700 disabled:cursor-wait disabled:opacity-60"
							>
								{p.importandoAlunos ? "Importando..." : "Importar alunos"}
							</button>
						</footer>
					</>
				)}
			</div>
		</div>
	);
}
