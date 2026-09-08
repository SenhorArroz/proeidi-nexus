"use client";
import {
	Award,
	Download,
	GitBranch,
	Loader2,
	Search,
	Upload,
	UserPlus,
	Users,
} from "lucide-react";
import { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type AcoesAlunosProps = {
	busca: NonNullable<Estado["busca"]>;
	setBusca: NonNullable<Estado["setBusca"]>;
	handleGerarLoteCertificados: NonNullable<
		Estado["handleGerarLoteCertificados"]
	>;
	gerarLoteMutation: NonNullable<Estado["gerarLoteMutation"]>;
	setIsImportModalOpen: NonNullable<Estado["setIsImportModalOpen"]>;
	semestreSelecionado: Estado["semestreSelecionado"];
	handleExport: NonNullable<Estado["handleExport"]>;
	abrirModalNovo: NonNullable<Estado["abrirModalNovo"]>;
	alternarTodos: NonNullable<Estado["alternarTodos"]>;
	alunosFiltrados: NonNullable<Estado["alunosFiltrados"]>;
	todosSelecionados: NonNullable<Estado["todosSelecionados"]>;
	alunosSelecionados: NonNullable<Estado["alunosSelecionados"]>;
	abrirContinuidadeEmLote: NonNullable<Estado["abrirContinuidadeEmLote"]>;
};

export function AcoesAlunos({
	busca,
	setBusca,
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
}: AcoesAlunosProps) {
	return (
		<div className="view-diretoria-alunos-acoes-alunos bg-white p-3 rounded-2xl border border-gray-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
			<div className="flex min-w-0 w-full flex-1 flex-col gap-3 lg:w-auto lg:flex-row lg:items-center lg:justify-end">
				<div className="flex items-center gap-3 w-full lg:max-w-md bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition-all">
					<Search className="w-4 h-4 text-gray-400 shrink-0" />
					<input
						type="text"
						placeholder="Buscar aluno por nome ou CPF..."
						value={busca}
						onChange={(e) => setBusca(e.target.value)}
						className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400"
					/>
				</div>
				<div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
					<button
						onClick={handleGerarLoteCertificados}
						disabled={gerarLoteMutation.isPending}
						className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all shrink-0 disabled:opacity-50"
						title="Gerar certificados em lote (PDF único) para todos os alunos deste semestre"
					>
						{gerarLoteMutation.isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<Award className="w-4 h-4" />
						)}
						<span className="hidden sm:inline">
							{gerarLoteMutation.isPending ? "Gerando..." : "Certificados"}
						</span>
					</button>
					<button
						onClick={() => setIsImportModalOpen(true)}
						disabled={!semestreSelecionado}
						className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all shrink-0"
					>
						<Upload className="w-4 h-4" />
						<span className="hidden sm:inline">Importar</span>
					</button>
					<button
						onClick={handleExport}
						disabled={!semestreSelecionado}
						className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 shadow-sm transition-all shrink-0"
					>
						<Download className="w-4 h-4" />
						<span className="hidden sm:inline">Exportar</span>
					</button>
					<button
						onClick={abrirModalNovo}
						disabled={!semestreSelecionado}
						className="flex items-center justify-center gap-2 px-5 py-2.5 bg-sky-600 text-white text-sm font-bold rounded-xl hover:bg-sky-700 shadow-sm transition-all shrink-0"
					>
						<UserPlus className="w-4 h-4" />
						<span className="hidden sm:inline">Novo Aluno</span>
					</button>
				</div>
			</div>
			<div className="flex w-full flex-col gap-2 sm:flex-row lg:w-auto">
				<button
					onClick={alternarTodos}
					disabled={!alunosFiltrados.length}
					className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
				>
					<Users className="h-4 w-4" />{" "}
					{todosSelecionados ? "Limpar seleção" : "Selecionar todos"}
				</button>
				{alunosSelecionados.length > 0 && (
					<button
						onClick={abrirContinuidadeEmLote}
						className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-sm font-bold text-white hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500"
					>
						<GitBranch className="h-4 w-4" /> Continuar{" "}
						{alunosSelecionados.length} aluno(s)
					</button>
				)}
			</div>
		</div>
	);
}
