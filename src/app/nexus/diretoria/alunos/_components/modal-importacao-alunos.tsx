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
> & { setIsImportModalOpen: Estado["setIsImportModalOpen"] };

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
			setRetorno(
				"Selecione alunos e pelo menos uma turma para montar o vínculo.",
			);
			return;
		}
		setRetorno(
			`Seleção adicionada: ${p.alunosSelecionadosImportacao.length} aluno(s) em ${p.turmaIdsImportacao.length} turma(s).`,
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
							e vincule cada seleção às turmas desejadas.
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
							<section className="mb-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/40">
								<div className="flex items-start justify-between gap-3">
									<div>
										<h3 className="font-extrabold text-sky-900 dark:text-sky-100">
											Vínculos reconhecidos na planilha
										</h3>
										<p className="mt-1 text-sm text-sky-800 dark:text-sky-200">
											As sugestões já serão vinculadas ao importar. Você pode complementar
											com seleções manuais abaixo.
										</p>
									</div>
									<span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-slate-900 dark:text-sky-200">
										{p.sugestoesTurmaImportacao.filter((sugestao) => sugestao.turmaId).length}/
										{p.sugestoesTurmaImportacao.length}
									</span>
								</div>
								<div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
									{p.sugestoesTurmaImportacao.map((sugestao) => (
										<div
											key={sugestao.turmaPlanilha}
											className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white/85 px-3 py-2 text-sm dark:bg-slate-900/85"
										>
											<div>
												<p className="font-bold text-slate-800 dark:text-slate-100">
													{sugestao.turmaPlanilha}
												</p>
												<p className="text-xs text-slate-500 dark:text-slate-300">
													{sugestao.totalAlunos} aluno(s) na planilha
												</p>
											</div>
											{sugestao.turmaSistema ? (
												<span className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-bold text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200">
													→ {sugestao.turmaSistema} · {sugestao.confianca}%
												</span>
											) : (
												<span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-bold text-amber-800 dark:bg-amber-950/60 dark:text-amber-200">
													Sem sugestão segura
												</span>
											)}
										</div>
									))}
								</div>
							</section>
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
										className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-sky-50 dark:text-slate-200 dark:hover:bg-slate-800"
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
										className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 text-sm text-slate-700 hover:bg-orange-50 dark:text-slate-200 dark:hover:bg-slate-800"
											>
												<input
													type="checkbox"
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
										<Check className="h-4 w-4" /> Criar seleção e vínculo
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

							<section className="mt-6 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,.06)] dark:bg-slate-900">
								<div className="mb-4 flex items-center justify-between">
									<div>
										<h3 className="font-extrabold tracking-[-.02em] text-slate-900 dark:text-slate-100">
											Vínculos separados
										</h3>
										<p className="mt-1 text-sm text-slate-500">
											Cada turma mantém sua própria lista de alunos.
										</p>
									</div>
									<span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-sky-950/70 dark:text-sky-200">
										{p.vinculosImportacao.length} vínculo(s)
									</span>
								</div>
								{p.avisosVinculoImportacao.map((aviso, index) => (
									<div
										key={`${aviso.alunoId}-${aviso.turmaId}-${index}`}
										className="mb-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-950 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-100"
									>
										<b>Vínculo repetido removido:</b> {nome(aviso.alunoId)} já
										estava vinculado a {nomeTurma(aviso.turmaId)}.
									</div>
								))}
								{p.vinculosImportacao.length ? (
									<div className="grid gap-3 sm:grid-cols-2">
										{p.vinculosImportacao.flatMap((vinculo, selecao) =>
											vinculo.turmaIds.map((turmaId) => (
												<article
													key={`${selecao}-${turmaId}`}
													className="overflow-hidden rounded-xl border border-sky-100 dark:border-sky-900"
												>
													<div className="bg-sky-600 px-4 py-3 text-white">
														<p className="font-bold">{nomeTurma(turmaId)}</p>
														<p className="mt-0.5 text-xs text-sky-100">
															Seleção {selecao + 1} · {vinculo.alunoIds.length}{" "}
															aluno(s)
														</p>
													</div>
													<div className="max-h-44 space-y-1 overflow-y-auto bg-sky-50/50 p-3 dark:bg-slate-950/80">
														{vinculo.alunoIds.map((alunoId) => (
															<p
																key={alunoId}
															className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-100"
															>
																{nome(alunoId)}
															</p>
														))}
													</div>
												</article>
											)),
										)}
									</div>
								) : (
									<div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/60 p-5 text-sm text-sky-900 dark:border-sky-900 dark:bg-sky-950/50 dark:text-sky-100">
										Ainda não há vínculos. Selecione alunos e turmas acima para
										criar a primeira divisão.
									</div>
								)}
							</section>
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
								className="min-h-11 rounded-xl bg-sky-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-sky-700"
							>
								Importar alunos
							</button>
						</footer>
					</>
				)}
			</div>
		</div>
	);
}
