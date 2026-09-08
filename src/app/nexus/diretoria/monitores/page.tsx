"use client";
import { AcoesMonitores } from "./_components/acoes-monitores";
import { FormularioMonitor } from "./_components/formulario-monitor";
import { useMonitoresDiretoria } from "./_components/use-monitores-diretoria";

import { ShieldCheck } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { PersonManagementCard } from "~/app/_components/diretoria/people-management-card";
import { ProjectCodeModal } from "~/app/_components/diretoria/project-code-modal";

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function MonitoresDiretoria() {
	const {
		modo,
		monitores,
		inputImportacaoRef,
		importarArquivo,
		importarMonitores,
		exportarMonitores,
		gerarLote,
		gerarLoteDeclaracoes,
		abrirNovo,
		resultadoImportacao,
		carregandoMonitores,
		abrirEdicao,
		excluir,
		solicitarRedefinicao,
		gerarDeclaracao,
		cancelar,
		editandoId,
		rascunho,
		setRascunho,
		salvar,
		formValido,
		modalLoteAberto,
		setModalLoteAberto,
		confirmarLote,
	} = useMonitoresDiretoria();

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 flex flex-col items-center font-sans px-3 py-6 sm:px-4 sm:py-4">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6">
				<DiretoriaPageIntro
					icon={ShieldCheck}
					title="Gerenciar monitores"
					description="Cadastro, acesso e turmas vinculadas."
				/>
			</div>

			<div className="w-full max-w-5xl">
				{modo === "lista" ? (
					<>
						<AcoesMonitores
							monitores={monitores}
							inputImportacaoRef={inputImportacaoRef}
							importarArquivo={importarArquivo}
							importarMonitores={importarMonitores}
							exportarMonitores={exportarMonitores}
							gerarLote={gerarLote}
							gerarLoteDeclaracoes={gerarLoteDeclaracoes}
							abrirNovo={abrirNovo}
						/>
						{resultadoImportacao && (
							<p
								role={resultadoImportacao.tipo === "erro" ? "alert" : "status"}
								className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${resultadoImportacao.tipo === "erro" ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-800"}`}
							>
								{resultadoImportacao.texto}
							</p>
						)}

						{carregandoMonitores ? (
							<DataSkeleton cards={4} />
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{monitores.map((monitor) => (
									<PersonManagementCard
										key={monitor.id}
										person={monitor}
										personRole="monitor"
										onEdit={() => abrirEdicao(monitor)}
										onRemove={() => excluir(monitor.id)}
										onResetPassword={() =>
											solicitarRedefinicao.mutate({ usuarioId: monitor.id })
										}
										onCertificate={() =>
											gerarDeclaracao.mutate({
												usuarioId: monitor.id,
												tipo: "monitor",
											})
										}
									/>
								))}
							</div>
						)}

						{!carregandoMonitores && monitores.length === 0 && (
							<div className="text-center py-16 text-sm text-gray-400">
								Nenhum monitor cadastrado ainda
							</div>
						)}
					</>
				) : (
					<FormularioMonitor
						cancelar={cancelar}
						editandoId={editandoId}
						rascunho={rascunho}
						setRascunho={setRascunho}
						salvar={salvar}
						formValido={formValido}
					/>
				)}
			</div>
			<ProjectCodeModal
				isOpen={modalLoteAberto}
				isSubmitting={gerarLoteDeclaracoes.isPending}
				personLabel="monitores"
				totalCertificates={monitores.length}
				onClose={() => setModalLoteAberto(false)}
				onConfirm={confirmarLote}
			/>
		</div>
	);
}
