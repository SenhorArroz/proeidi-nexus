"use client";
import { FiltrosSorteio } from "./_components/filtros-sorteio";
import { ListasCandidatos } from "./_components/listas-candidatos";
import { ModalCandidato } from "./_components/modal-candidato";
import { useGerenciarSorteio } from "./_components/use-gerenciar-sorteio";

import { Dices, Download, Ticket, Upload } from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function GerenciarSorteio() {
	const {
		inputImportacaoRef,
		importarInscricoes,
		candidatos,
		importando,
		semestreSelecionado,
		exportarInscricoes,
		resultadoImportacao,
		setSemestreId,
		semestres,
		busca,
		setBusca,
		abrirModalNovo,
		listaSmartphone,
		carregandoSemestres,
		carregandoCandidatos,
		abrirModalEdicao,
		excluirCandidato,
		listaComputador,
		isModalOpen,
		setIsModalOpen,
		candidatoEditando,
		salvarCandidato,
		form,
		setForm,
	} = useGerenciarSorteio();

	return (
		<div className="diretoria-page-canvas min-h-full min-w-0 flex flex-col font-sans p-4 sm:p-8 pb-32">
			<div className="max-w-7xl w-full mx-auto space-y-6">
				<DiretoriaBackLink />
				<input
					ref={inputImportacaoRef}
					type="file"
					accept=".xlsx,.xls"
					className="sr-only"
					onChange={(evento) => void importarInscricoes(evento)}
				/>
				<DiretoriaPageIntro
					icon={Ticket}
					title="Gerenciar sorteio"
					description={`Inscrições cadastradas: ${candidatos.length} fichas`}
					actions={
						<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
							<button
								type="button"
								onClick={() => inputImportacaoRef.current?.click()}
								disabled={importando || !semestreSelecionado}
								className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Upload className="h-4 w-4" />
								{importando ? "Importando..." : "Importar planilha"}
							</button>
							<button
								type="button"
								onClick={() => void exportarInscricoes()}
								disabled={candidatos.length === 0}
								className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Download className="h-4 w-4" />
								Exportar inscrições
							</button>
							<a
								href="/nexus/diretoria/sorteio/sorteador"
								className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-orange-50 hover:text-orange-800"
							>
								<Dices className="h-4 w-4" />
								Ir para o Sorteador
							</a>
						</div>
					}
				/>
				{resultadoImportacao && (
					<p
						role={resultadoImportacao.tipo === "erro" ? "alert" : "status"}
						className={`rounded-xl px-4 py-3 text-sm font-medium ${resultadoImportacao.tipo === "erro" ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-800"}`}
					>
						{resultadoImportacao.texto}
					</p>
				)}

				{/* Barra de Controles (Semestre, busca e adicionar) */}
				<FiltrosSorteio
					semestreSelecionado={semestreSelecionado}
					setSemestreId={setSemestreId}
					semestres={semestres}
					busca={busca}
					setBusca={setBusca}
					abrirModalNovo={abrirModalNovo}
				/>

				{/* Duas Colunas: Smartphone vs Computador */}
				<ListasCandidatos
					listaSmartphone={listaSmartphone}
					carregandoSemestres={carregandoSemestres}
					carregandoCandidatos={carregandoCandidatos}
					abrirModalEdicao={abrirModalEdicao}
					excluirCandidato={excluirCandidato}
					listaComputador={listaComputador}
				/>
			</div>

			{/* MODAL DE CRUD */}
			{isModalOpen && (
				<ModalCandidato
					setIsModalOpen={setIsModalOpen}
					candidatoEditando={candidatoEditando}
					salvarCandidato={salvarCandidato}
					form={form}
					setForm={setForm}
				/>
			)}
		</div>
	);
}
