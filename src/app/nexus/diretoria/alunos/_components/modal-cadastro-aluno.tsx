"use client";
import { Pencil, UserPlus, X } from "lucide-react";
import { CamposDadosPessoaisAluno } from "./campos-dados-pessoais-aluno";
import { CamposInfraestruturaAluno } from "./campos-infraestrutura-aluno";
import { CamposSaudeAluno } from "./campos-saude-aluno";
import { CamposTrabalhoEstudoAluno } from "./campos-trabalho-estudo-aluno";
import { CamposTurmaAluno } from "./campos-turma-aluno";
import type { useGerenciarAlunos } from "./use-gerenciar-alunos";
type Estado = ReturnType<typeof useGerenciarAlunos>;
export type ModalCadastroAlunoProps = {
	setIsModalOpen: NonNullable<Estado["setIsModalOpen"]>;
	alunoEditando: Estado["alunoEditando"];
	salvarAluno: NonNullable<Estado["salvarAluno"]>;
	form: NonNullable<Estado["form"]>;
	setForm: NonNullable<Estado["setForm"]>;
	semestresDb: Estado["semestresDb"];
};

export function ModalCadastroAluno({
	setIsModalOpen,
	alunoEditando,
	salvarAluno,
	form,
	setForm,
	semestresDb,
}: ModalCadastroAlunoProps) {
	return (
		<div className="view-diretoria-alunos-modal-cadastro-aluno fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={() => setIsModalOpen(false)}
			/>

			<div className="relative z-10 flex max-h-[96dvh] w-full max-w-4xl min-w-0 flex-col rounded-t-3xl border border-gray-100 bg-white shadow-2xl animate-in zoom-in-95 duration-200 sm:max-h-[90vh] sm:rounded-3xl">
				<div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-6">
					<h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
						{alunoEditando ? (
							<Pencil className="w-5 h-5 text-sky-600" />
						) : (
							<UserPlus className="w-5 h-5 text-sky-600" />
						)}
						{alunoEditando ? "Editar Ficha do Aluno" : "Matricular Novo Aluno"}
					</h3>
					<button
						onClick={() => setIsModalOpen(false)}
						className="p-2 text-gray-400 hover:bg-gray-100 rounded-full"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={salvarAluno}
					className="custom-scrollbar min-w-0 flex-1 space-y-8 overflow-y-auto p-4 sm:p-6"
				>
					{/* SEÇÃO: TURMA E SEMESTRE */}
					<CamposTurmaAluno
						form={form}
						setForm={setForm}
						semestresDb={semestresDb}
					/>

					{/* SEÇÃO: DADOS GERAIS */}
					<CamposDadosPessoaisAluno form={form} setForm={setForm} />

					{/* SEÇÃO: TRABALHO E ESTUDOS (CONDICIONAIS) */}
					<CamposTrabalhoEstudoAluno form={form} setForm={setForm} />

					{/* SEÇÃO: SAÚDE (CONDICIONAIS) */}
					<CamposSaudeAluno form={form} setForm={setForm} />

					{/* SEÇÃO: INFRAESTRUTURA TECNOLÓGICA (CONDICIONAIS) */}
					<CamposInfraestruturaAluno form={form} setForm={setForm} />

					{/* Rodapé fixo do Modal */}
					<div className="sticky bottom-0 flex flex-col-reverse gap-2 border-t border-gray-100 bg-white pb-2 pt-4 sm:flex-row sm:justify-end sm:gap-3 sm:pt-6">
						<button
							type="button"
							onClick={() => setIsModalOpen(false)}
							className="min-h-11 rounded-xl border border-gray-200 bg-white px-5 py-2.5 font-bold text-gray-600 hover:bg-gray-50"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="min-h-11 rounded-xl bg-sky-600 px-5 py-2.5 font-bold text-white shadow-sm hover:bg-sky-700"
						>
							{alunoEditando ? "Salvar Alterações" : "Concluir Matrícula"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
