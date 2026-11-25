import type { useImportarAlunos } from "./use-importar-alunos";

type Sugestoes = ReturnType<
	typeof useImportarAlunos
>["sugestoesTurmaImportacao"];

export function SugestoesTurmaImportacao({
	sugestoes,
}: {
	sugestoes: Sugestoes;
}) {
	return (
		<section className="mb-5 rounded-2xl border border-sky-100 bg-sky-50/60 p-4 dark:border-sky-900 dark:bg-sky-950/40">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="font-extrabold text-sky-900 dark:text-sky-100">
						Vínculos reconhecidos na planilha
					</h3>
					<p className="mt-1 text-sm text-sky-800 dark:text-sky-200">
						Os títulos da coluna Turma são rastreados até as turmas cadastradas
						no semestre. A seleção manual substitui a sugestão.
					</p>
				</div>
				<span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-bold text-sky-800 dark:bg-slate-900 dark:text-sky-200">
					{sugestoes.filter((sugestao) => sugestao.turmaId).length}/
					{sugestoes.length}
				</span>
			</div>
			<div className="mt-3 max-h-44 space-y-2 overflow-y-auto pr-1">
				{sugestoes.map((sugestao) => (
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
	);
}
