"use client";
import { AcoesAlunos } from "./_components/acoes-alunos";
import { ListaAlunos } from "./_components/lista-alunos";
import { ModalCadastroAluno } from "./_components/modal-cadastro-aluno";
import { ModalContinuidadeAluno } from "./_components/modal-continuidade-aluno";
import { ModalImportacaoAlunos } from "./_components/modal-importacao-alunos";
import { useGerenciarAlunos } from "./_components/use-gerenciar-alunos";

import { GraduationCap } from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------
export default function GerenciarAlunos() {
	const {
		semestreFiltro,
		setBusca,
		setSemestreFiltro,
		semestresDb,
		busca,
		handleGerarLoteCertificados,
		gerarLoteMutation,
		setIsImportModalOpen,
		semestreSelecionado,
		handleExport,
		abrirModalNovo,
		alternarTodos,
		alunosFiltrados,
		todosSelecionados,
		alunosSelecionados,
		abrirContinuidadeEmLote,
		carregandoSemestres,
		carregandoAlunos,
		carregandoTurmas,
		alternarSelecao,
		abrirContinuidade,
		estiloVerInformacoes,
		handleGerarCertificadoIndividual,
		gerandoAlunoId,
		abrirModalEdicao,
		excluirAluno,
		estiloExcluirAluno,
		alunosParaContinuar,
		semestreDestinoId,
		turmaDestinoIds,
		continuarAluno,
		etapaTrilha,
		setAlunosSelecionados,
		setAlunosParaContinuar,
		setSemestreDestinoId,
		setTurmaDestinoIds,
		setEtapaTrilha,
		semestreDestino,
		turmasDestino,
		isModalOpen,
		setIsModalOpen,
		alunoEditando,
		salvarAluno,
		form,
		setForm,
		turmasDb,
		isImportModalOpen,
		fileInputRef,
		handleFileUpload,
	} = useGerenciarAlunos();

	return (
		<div className="diretoria-page-canvas min-h-full min-w-0 flex flex-col font-sans p-3 pb-32 sm:p-8">
			<div className="max-w-7xl w-full mx-auto space-y-6">
				<DiretoriaBackLink />
				<DiretoriaPageIntro
					icon={GraduationCap}
					title="Gerenciar alunos"
					description="Cadastro completo, perfil demográfico e emissão de certificados."
				/>

				{/* Seleção única de contexto: toda leitura, importação e exportação usa este semestre. */}
				<div className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 sm:flex sm:items-end sm:justify-between sm:gap-5">
					<div className="mb-3 sm:mb-0">
						<p className="text-sm font-semibold text-sky-900">
							Semestre de trabalho
						</p>
						<p className="mt-1 text-sm text-sky-700">
							A lista, os novos cadastros, a importação e a exportação usam o
							semestre selecionado.
						</p>
					</div>
					<label className="block w-full min-w-0 sm:w-auto sm:min-w-52">
						<span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-sky-800">
							Selecionar semestre
						</span>
						<select
							value={semestreFiltro}
							onChange={(e) => {
								setBusca("");
								setSemestreFiltro(e.target.value);
							}}
							disabled={!semestresDb?.length}
							className="w-full rounded-xl border border-sky-200 bg-white px-3 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 disabled:cursor-not-allowed"
						>
							{!semestresDb?.length && <option>Carregando semestres...</option>}
							{semestresDb?.map((semestre) => (
								<option key={semestre.id} value={semestre.codigo}>
									{semestre.codigo}
									{semestre.ativo ? " — ativo" : ""}
								</option>
							))}
						</select>
					</label>
				</div>

				{/* Controles de Filtro e Busca */}
				<AcoesAlunos
					busca={busca}
					setBusca={setBusca}
					handleGerarLoteCertificados={handleGerarLoteCertificados}
					gerarLoteMutation={gerarLoteMutation}
					setIsImportModalOpen={setIsImportModalOpen}
					semestreSelecionado={semestreSelecionado}
					handleExport={handleExport}
					abrirModalNovo={abrirModalNovo}
					alternarTodos={alternarTodos}
					alunosFiltrados={alunosFiltrados}
					todosSelecionados={todosSelecionados}
					alunosSelecionados={alunosSelecionados}
					abrirContinuidadeEmLote={abrirContinuidadeEmLote}
				/>

				{/* Lista de Alunos (Grid) */}
				<ListaAlunos
					carregandoSemestres={carregandoSemestres}
					carregandoAlunos={carregandoAlunos}
					carregandoTurmas={carregandoTurmas}
					alunosFiltrados={alunosFiltrados}
					alunosSelecionados={alunosSelecionados}
					alternarSelecao={alternarSelecao}
					abrirContinuidade={abrirContinuidade}
					estiloVerInformacoes={estiloVerInformacoes}
					handleGerarCertificadoIndividual={handleGerarCertificadoIndividual}
					gerandoAlunoId={gerandoAlunoId}
					abrirModalEdicao={abrirModalEdicao}
					excluirAluno={excluirAluno}
					estiloExcluirAluno={estiloExcluirAluno}
				/>
			</div>

			{alunosParaContinuar.length > 0 && (
				<ModalContinuidadeAluno
					semestreDestinoId={semestreDestinoId}
					turmaDestinoIds={turmaDestinoIds}
					alunosParaContinuar={alunosParaContinuar}
					continuarAluno={continuarAluno}
					etapaTrilha={etapaTrilha}
					setAlunosSelecionados={setAlunosSelecionados}
					setAlunosParaContinuar={setAlunosParaContinuar}
					setSemestreDestinoId={setSemestreDestinoId}
					setTurmaDestinoIds={setTurmaDestinoIds}
					semestresDb={semestresDb}
					semestreSelecionado={semestreSelecionado}
					setEtapaTrilha={setEtapaTrilha}
					semestreDestino={semestreDestino}
					turmasDestino={turmasDestino}
				/>
			)}
			{/* ---------------------------------------------------------------------------
                MODAL GIGANTE COM CAMPOS CONDICIONAIS
            --------------------------------------------------------------------------- */}
			{isModalOpen && (
				<ModalCadastroAluno
					setIsModalOpen={setIsModalOpen}
					alunoEditando={alunoEditando}
					salvarAluno={salvarAluno}
					form={form}
					setForm={setForm}
					semestresDb={semestresDb}
					turmasDb={turmasDb}
				/>
			)}

			{/* Modal de Importação com File Upload */}
			{isImportModalOpen && (
				<ModalImportacaoAlunos
					semestreSelecionado={semestreSelecionado}
					setIsImportModalOpen={setIsImportModalOpen}
					turmasDb={turmasDb}
					fileInputRef={fileInputRef}
					handleFileUpload={handleFileUpload}
				/>
			)}
		</div>
	);
}
