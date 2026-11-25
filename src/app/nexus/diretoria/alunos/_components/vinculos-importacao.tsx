import type { useImportarAlunos } from "./use-importar-alunos";

type Importacao = ReturnType<typeof useImportarAlunos>;

export function VinculosImportacao({
	vinculos,
	avisos,
	nome,
	nomeTurma,
}: {
	vinculos: Importacao["vinculosImportacao"];
	avisos: Importacao["avisosVinculoImportacao"];
	nome: (id: string) => string;
	nomeTurma: (id: string) => string;
}) {
	return (
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
					{vinculos.length} vínculo(s)
				</span>
			</div>
			{avisos.map((aviso) => (
				<div
					key={`${aviso.alunoId}-${aviso.turmaId}`}
					className="mb-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-950 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-100"
				>
					<b>Turma anterior substituída:</b> {nome(aviso.alunoId)} saiu de{" "}
					{nomeTurma(aviso.turmaId)}.
				</div>
			))}
			{vinculos.length ? (
				<div className="grid gap-3 sm:grid-cols-2">
					{vinculos.flatMap((vinculo, selecao) =>
						vinculo.turmaIds.map((turmaId) => (
							<article
								key={turmaId}
								className="overflow-hidden rounded-xl border border-sky-100 dark:border-sky-900"
							>
								<div className="bg-sky-600 px-4 py-3 text-white">
									<p className="font-bold">{nomeTurma(turmaId)}</p>
									<p className="mt-0.5 text-xs text-sky-100">
										Seleção {selecao + 1} · {vinculo.alunoIds.length} aluno(s)
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
					Ainda não há vínculos. Selecione os alunos e uma turma acima.
				</div>
			)}
		</section>
	);
}
