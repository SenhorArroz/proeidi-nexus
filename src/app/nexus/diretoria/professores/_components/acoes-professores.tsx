"use client";
import { FileText, Loader2, Plus } from "lucide-react";
import { useProfessoresDiretoria } from "./use-professores-diretoria";

type Estado = ReturnType<typeof useProfessoresDiretoria>;
type AcoesProfessoresProps = {
	professores: NonNullable<Estado["professores"]>;
	gerarLote: NonNullable<Estado["gerarLote"]>;
	gerarLoteDeclaracoes: NonNullable<Estado["gerarLoteDeclaracoes"]>;
	abrirNovo: NonNullable<Estado["abrirNovo"]>;
};

export function AcoesProfessores({
	professores,
	gerarLote,
	gerarLoteDeclaracoes,
	abrirNovo,
}: AcoesProfessoresProps) {
	return (
		<div className="view-diretoria-professores-acoes-professores mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
			<span className="text-sm font-medium text-gray-700">
				{professores.length} docentes cadastrados
			</span>
			<div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
				<button
					onClick={gerarLote}
					disabled={!professores.length || gerarLoteDeclaracoes.isPending}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					title="Gera um único PDF com todos os certificados dos docentes listados."
				>
					{gerarLoteDeclaracoes.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<FileText className="w-4 h-4" />
					)}
					{gerarLoteDeclaracoes.isPending ? "Gerando PDF..." : "Gerar lote"}
				</button>
				<button
					onClick={abrirNovo}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700"
				>
					<Plus className="w-4 h-4" />
					Novo professor
				</button>
			</div>
		</div>
	);
}
