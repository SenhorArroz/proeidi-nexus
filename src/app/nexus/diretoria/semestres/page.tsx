"use client";
import { ListaSemestres } from "./_components/lista-semestres";
import { useSemestresDiretoria } from "./_components/use-semestres-diretoria";

import { CalendarDays, Plus } from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";

export default function SemestresDiretoria() {
	const {
		codigo,
		setCodigo,
		criar,
		erro,
		isLoading,
		semestres,
		ativar,
		setSemestreParaDuplicar,
		setCodigoDestino,
		remover,
		semestreParaDuplicar,
		duplicar,
		codigoDestino,
	} = useSemestresDiretoria();

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 px-3font-sans sm:px-4 sm:py-5">
			<div className="mx-auto w-full max-w-5xl">
				<DiretoriaBackLink />
				<div className="mb-6">
					<DiretoriaPageIntro
						icon={CalendarDays}
						title="Gerenciar semestres"
						description="Defina o período ativo e acompanhe as pessoas vinculadas pelas turmas."
					/>
				</div>

				<div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<label className="min-w-0 flex-1">
							<span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
								Novo semestre
							</span>
							<input
								value={codigo}
								onChange={(e) => setCodigo(e.target.value)}
								placeholder="Ex.: 2027.1"
								pattern="\d{4}\.[12]"
								className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
							/>
						</label>
						<button
							onClick={() => criar.mutate({ codigo })}
							disabled={criar.isPending || !codigo}
							className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-200 hover:bg-sky-700 disabled:opacity-50"
						>
							<Plus className="h-4 w-4" />
							Adicionar
						</button>
					</div>
					{erro && (
						<p role="alert" className="mt-3 text-sm text-red-600">
							{erro}
						</p>
					)}
				</div>

				<ListaSemestres
					isLoading={isLoading}
					semestres={semestres}
					ativar={ativar}
					setSemestreParaDuplicar={setSemestreParaDuplicar}
					setCodigoDestino={setCodigoDestino}
					remover={remover}
				/>
				{semestreParaDuplicar && (
					<div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-4">
						<form
							onSubmit={(event) => {
								event.preventDefault();
								duplicar.mutate({
									semestreOrigemId: semestreParaDuplicar.id,
									codigoDestino,
									continuarAlunos: true,
									copiarMateriais: true,
								});
							}}
							className="w-full max-w-md rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
						>
							<h2 className="text-lg font-bold text-slate-900">
								Duplicar {semestreParaDuplicar.codigo}
							</h2>
							<p className="mt-2 text-sm leading-5 text-slate-600">
								Serão copiadas turmas, materiais, vínculos de docentes e
								monitores e as matrículas dos alunos. Presenças, aulas, avisos e
								candidatos de sorteio não serão copiados.
							</p>
							<label className="mt-5 block text-sm font-semibold text-slate-800">
								Código do novo semestre
								<input
									autoFocus
									required
									value={codigoDestino}
									onChange={(event) => setCodigoDestino(event.target.value)}
									placeholder="Ex.: 2026.2"
									pattern="\d{4}\.[12]"
									className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
								/>
							</label>
							<div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
								<button
									type="button"
									onClick={() => setSemestreParaDuplicar(null)}
									className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
								>
									Cancelar
								</button>
								<button
									type="submit"
									disabled={duplicar.isPending}
									className="min-h-11 rounded-xl bg-orange-700 px-5 text-sm font-bold text-white hover:bg-orange-800 disabled:opacity-50"
								>
									{duplicar.isPending ? "Duplicando..." : "Duplicar semestre"}
								</button>
							</div>
						</form>
					</div>
				)}
			</div>
		</div>
	);
}
