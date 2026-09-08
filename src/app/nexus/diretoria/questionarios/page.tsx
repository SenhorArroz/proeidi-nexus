"use client";
import { ListaQuestionarios } from "./_components/lista-questionarios";
import { ModalExcluirQuestionario } from "./_components/modal-excluir-questionario";
import { ModalQrQuestionario } from "./_components/modal-qr-questionario";
import { useQuestionariosPage } from "./_components/use-questionarios-page";

import { ClipboardList, Plus, Search } from "lucide-react";
import Link from "next/link";
import { DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";

export default function QuestionariosPage() {
	const {
		busca,
		setBusca,
		isLoading,
		questionariosFiltrados,
		setQuestionarioQr,
		setConfirmarExclusao,
		formularios,
		confirmarExclusao,
		removerFormulario,
		questionarioQr,
		imagemQr,
		erroQr,
	} = useQuestionariosPage();
	return (
		<main className="min-h-full px-3 py-6 sm:px-4">
			<div className="mx-auto max-w-6xl">
				<Link
					href="/nexus/dashboard"
					className="text-sm font-bold text-sky-700"
				>
					← Voltar ao painel
				</Link>
				<DiretoriaPageIntro
					icon={ClipboardList}
					title="Questionários"
					description="Crie questionários para a equipe ou, quando autorizado, apenas para a Diretoria."
					actions={
						<Link
							href="/nexus/questionarios/editor"
							className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800"
						>
							<Plus className="h-4 w-4" />
							Novo questionário
						</Link>
					}
				/>
				<div className="relative mt-6">
					<Search
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<input
						type="search"
						value={busca}
						onChange={(event) => setBusca(event.target.value)}
						placeholder="Buscar questionário por nome"
						className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
					/>
				</div>
				<ListaQuestionarios
					isLoading={isLoading}
					questionariosFiltrados={questionariosFiltrados}
					setQuestionarioQr={setQuestionarioQr}
					setConfirmarExclusao={setConfirmarExclusao}
					formularios={formularios}
					busca={busca}
				/>
				{confirmarExclusao && (
					<ModalExcluirQuestionario
						confirmarExclusao={confirmarExclusao}
						setConfirmarExclusao={setConfirmarExclusao}
						removerFormulario={removerFormulario}
					/>
				)}
				{questionarioQr && (
					<ModalQrQuestionario
						questionarioQr={questionarioQr}
						setQuestionarioQr={setQuestionarioQr}
						imagemQr={imagemQr}
						erroQr={erroQr}
					/>
				)}
			</div>
		</main>
	);
}
