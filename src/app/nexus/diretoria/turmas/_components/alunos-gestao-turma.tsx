"use client";

import { Plus, Search, X } from "lucide-react";
import { useId, useState } from "react";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
import type { GestaoTurmaProps } from "./janela-gestao-turma";

type AlunosGestaoTurmaProps = Pick<
	GestaoTurmaProps,
	"turma" | "onChange" | "salvando"
>;

export function AlunosGestaoTurma({
	turma,
	onChange,
	salvando,
}: AlunosGestaoTurmaProps) {
	const buscaId = useId();
	const [busca, setBusca] = useState("");
	const semestreId = turma.semestreId ?? "";
	const cadastro = api.aluno.list.useQuery(
		{ semestreId },
		{ enabled: Boolean(semestreId) },
	);
	const buscaNormalizada = normalizarBusca(busca);
	const correspondeAoNome = (aluno: { nome: string }) =>
		normalizarBusca(aluno.nome).includes(buscaNormalizada);
	const alunosDb = cadastro.data ?? [];
	const alunosPorId = new Map(alunosDb.map((aluno) => [aluno.id, aluno]));
	const idsVinculados = new Set(turma.alunoIds);
	const vinculados = turma.alunoIds.map(
		(id, index) =>
			alunosPorId.get(id) ?? { id, nome: turma.alunos[index] ?? "Aluno" },
	);
	const atualizarVinculos = (alunos: { id: string; nome: string }[]) =>
		onChange({
			...turma,
			alunoIds: alunos.map((aluno) => aluno.id),
			alunos: alunos.map((aluno) => aluno.nome),
		});
	const secoes = [
		{
			titulo: "Alunos vinculados",
			alunos: vinculados.filter(correspondeAoNome),
			vinculados: true,
			mensagem: vinculados.length
				? "Nenhum aluno vinculado encontrado com esse nome."
				: "Esta turma ainda não tem alunos vinculados.",
		},
		{
			titulo: "Alunos disponíveis",
			alunos: alunosDb
				.filter((aluno) => !idsVinculados.has(aluno.id))
				.filter(correspondeAoNome),
			vinculados: false,
			mensagem: buscaNormalizada
				? "Nenhum aluno disponível encontrado com esse nome."
				: "Nenhum outro aluno cadastrado neste semestre.",
		},
	];

	return (
		<div className="view-alunos-gestao-turma space-y-5">
			<div>
				<label htmlFor={buscaId} className="text-sm font-semibold">
					Buscar aluno por nome
				</label>
				<div className="relative mt-2">
					<Search
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-500 dark:text-slate-400"
					/>
					<input
						id={buscaId}
						type="search"
						value={busca}
						onChange={(event) => setBusca(event.target.value)}
						placeholder="Digite o nome do aluno"
						className="min-h-11 w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-sky-600 dark:border-slate-700 dark:bg-slate-900 dark:placeholder:text-slate-400"
					/>
				</div>
				<p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
					Use Salvar alterações para confirmar os vínculos.
				</p>
			</div>

			<div className="grid gap-5 md:grid-cols-2">
				{secoes.map((secao) => (
					<section key={secao.titulo} className="min-w-0">
						<div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
							<h2 className="text-base font-bold">{secao.titulo}</h2>
							{secao.vinculados && (
								<span
									aria-live="polite"
									className="text-sm text-slate-600 dark:text-slate-300"
								>
									{vinculados.length} de {turma.limiteAlunos} vagas
								</span>
							)}
						</div>
						{secao.alunos.length > 0 ? (
							<ul className="max-h-80 divide-y divide-slate-200 overflow-y-auto rounded-xl border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
								{secao.alunos.map((aluno) => {
									const cadastroAluno = alunosPorId.get(aluno.id);
									const contato =
										cadastroAluno?.email || cadastroAluno?.telefone;
									const acao = secao.vinculados ? "Remover" : "Adicionar";
									const Icone = secao.vinculados ? X : Plus;
									return (
										<li
											key={aluno.id}
											className="flex items-center justify-between gap-2 p-2 pl-3"
										>
											<div className="min-w-0 break-words text-sm">
												<p className="font-medium">{aluno.nome}</p>
												{contato && (
													<p className="text-xs text-slate-600 dark:text-slate-300">
														{contato}
													</p>
												)}
											</div>
											<button
												type="button"
												aria-label={`${acao} ${aluno.nome}`}
												disabled={salvando}
												onClick={() =>
													atualizarVinculos(
														secao.vinculados
															? vinculados.filter(
																	(item) => item.id !== aluno.id,
																)
															: [...vinculados, aluno],
													)
												}
												className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg px-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 disabled:opacity-50 dark:text-slate-200 dark:hover:bg-slate-800"
											>
												<Icone aria-hidden="true" className="size-4" />
												{acao}
											</button>
										</li>
									);
								})}
							</ul>
						) : (
							<p
								role="status"
								className="py-3 text-sm text-slate-600 dark:text-slate-300"
							>
								{secao.vinculados
									? secao.mensagem
									: !semestreId
										? "Selecione o semestre na aba Visão geral."
										: cadastro.isLoading
											? "Carregando alunos do semestre…"
											: cadastro.isError
												? "Não foi possível carregar os alunos do semestre."
												: secao.mensagem}
							</p>
						)}
						{!secao.vinculados && cadastro.isError && (
							<button
								type="button"
								onClick={() => void cadastro.refetch()}
								className="min-h-11 rounded-lg px-2 text-sm font-semibold underline focus-visible:outline-2 focus-visible:outline-sky-600"
							>
								Tentar novamente
							</button>
						)}
					</section>
				))}
			</div>
		</div>
	);
}
