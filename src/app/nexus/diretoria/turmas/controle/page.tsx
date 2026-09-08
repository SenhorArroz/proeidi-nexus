"use client";
import { ControleCard } from "./_components/controle-card";
import { useControleTurmasPage } from "./_components/use-controle-turmas-page";

import { ArrowLeft, ClipboardCheck, Download } from "lucide-react";
import Link from "next/link";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";

export default function ControleTurmasPage() {
	const {
		baixarPdf,
		gerando,
		carregando,
		erro,
		turmas,
		semestre,
		setSemestreId,
		setErroPdf,
		semestres,
		erroPdf,
	} = useControleTurmasPage();
	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 px-3 py-6 font-sans sm:px-4">
			<div className="mx-auto w-full max-w-5xl">
				<Link href="/nexus/diretoria/turmas" className="diretoria-back-link">
					<ArrowLeft className="h-4 w-4" />
					Voltar para Turmas
				</Link>
				<DiretoriaPageIntro
					icon={ClipboardCheck}
					title="Controle de turma"
					description="Alunos em ordem alfabética e ocupação das turmas."
					actions={
						<button
							type="button"
							onClick={baixarPdf}
							disabled={
								gerando || carregando || Boolean(erro) || !turmas.data?.length
							}
							className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Download className="h-4 w-4" />
							{gerando ? "Gerando PDF…" : "Baixar PDF para impressão"}
						</button>
					}
				/>
				<div className="my-6 flex flex-wrap items-end justify-between gap-4">
					<label className="text-sm font-semibold text-slate-700">
						Semestre
						<select
							value={semestre?.id ?? ""}
							onChange={(e) => {
								setSemestreId(e.target.value);
								setErroPdf("");
							}}
							disabled={semestres.isLoading}
							className="mt-2 block min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm"
						>
							{semestres.data?.map((s) => (
								<option key={s.id} value={s.id}>
									{s.codigo}
									{s.ativo ? " — ativo" : ""}
								</option>
							))}
						</select>
					</label>
					<p className="max-w-sm text-sm text-slate-600">
						A4 horizontal, duas turmas por folha e até 16 alunos de cada turma.
						Listas maiores continuam nas próximas folhas.
					</p>
				</div>
				{erroPdf && (
					<p role="alert" className="mb-4 text-sm text-red-700">
						{erroPdf}
					</p>
				)}
				{erro ? (
					<div role="alert" className="py-8 text-slate-700">
						<p>Não foi possível carregar o controle de turma.</p>
						<button
							type="button"
							onClick={() => {
								void semestres.refetch();
								void turmas.refetch();
							}}
							className="mt-3 min-h-11 rounded-lg border border-sky-600 px-4 text-sky-700"
						>
							Tentar novamente
						</button>
					</div>
				) : carregando ? (
					<DataSkeleton cards={2} />
				) : !turmas.data?.length ? (
					<p className="py-12 text-center text-sm text-slate-600">
						Nenhuma turma cadastrada neste semestre.
					</p>
				) : (
					<div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
						{turmas.data.map((turma) => (
							<ControleCard key={turma.id} turma={turma} />
						))}
					</div>
				)}
			</div>
		</div>
	);
}
