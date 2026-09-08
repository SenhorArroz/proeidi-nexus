"use client";
import { AcoesProfessores } from "./_components/acoes-professores";
import { FormularioProfessor } from "./_components/formulario-professor";
import { ModalDeclaracao } from "./_components/modal-declaracao";
import { useProfessoresDiretoria } from "./_components/use-professores-diretoria";

import { Users } from "lucide-react";
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

export default function ProfessoresDiretoria() {
	const {
		modo,
		professores,
		gerarLote,
		gerarLoteDeclaracoes,
		abrirNovo,
		carregandoProfessores,
		carregandoDiretores,
		abrirEdicao,
		excluir,
		solicitarRedefinicao,
		setProfessorParaCertificado,
		cancelar,
		editandoId,
		rascunho,
		setRascunho,
		salvar,
		formValido,
		professorParaCertificado,
		modalLoteAberto,
		setModalLoteAberto,
		confirmarLote,
	} = useProfessoresDiretoria();

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 flex flex-col items-center font-sans px-3 py-6 sm:px-4 sm:py-6">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6">
				<DiretoriaPageIntro
					icon={Users}
					title="Gerenciar professores"
					description="Cadastro, acesso e turmas vinculadas."
				/>
			</div>

			<div className="w-full max-w-5xl">
				{modo === "lista" ? (
					<>
						<AcoesProfessores
							professores={professores}
							gerarLote={gerarLote}
							gerarLoteDeclaracoes={gerarLoteDeclaracoes}
							abrirNovo={abrirNovo}
						/>

						{carregandoProfessores || carregandoDiretores ? (
							<DataSkeleton cards={4} />
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{professores.map((professor) => (
									<PersonManagementCard
										key={professor.id}
										person={professor}
										personRole="professor"
										roleLabel={
											professor.role === "DIRETOR"
												? "Diretor · docente"
												: undefined
										}
										onEdit={
											professor.role === "PROFESSOR"
												? () => abrirEdicao(professor)
												: undefined
										}
										onRemove={
											professor.role === "PROFESSOR"
												? () => excluir(professor.id)
												: undefined
										}
										onResetPassword={() =>
											solicitarRedefinicao.mutate({ usuarioId: professor.id })
										}
										onCertificate={() => setProfessorParaCertificado(professor)}
									/>
								))}
							</div>
						)}

						{!carregandoProfessores &&
							!carregandoDiretores &&
							professores.length === 0 && (
								<div className="text-center py-16 text-sm text-gray-400">
									Nenhum professor cadastrado ainda
								</div>
							)}
					</>
				) : (
					<FormularioProfessor
						cancelar={cancelar}
						editandoId={editandoId}
						rascunho={rascunho}
						setRascunho={setRascunho}
						salvar={salvar}
						formValido={formValido}
					/>
				)}
			</div>

			{professorParaCertificado && (
				<ModalDeclaracao
					professor={professorParaCertificado}
					onClose={() => setProfessorParaCertificado(null)}
				/>
			)}
			<ProjectCodeModal
				isOpen={modalLoteAberto}
				isSubmitting={gerarLoteDeclaracoes.isPending}
				personLabel="docentes"
				totalCertificates={professores.length}
				onClose={() => setModalLoteAberto(false)}
				onConfirm={confirmarLote}
			/>
		</div>
	);
}
