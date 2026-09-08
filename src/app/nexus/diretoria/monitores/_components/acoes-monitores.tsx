"use client";
import { Download, FileText, Loader2, Plus, Upload } from "lucide-react";
import { useMonitoresDiretoria } from "./use-monitores-diretoria";

type Estado = ReturnType<typeof useMonitoresDiretoria>;
type AcoesMonitoresProps = {
	monitores: NonNullable<Estado["monitores"]>;
	inputImportacaoRef: NonNullable<Estado["inputImportacaoRef"]>;
	importarArquivo: NonNullable<Estado["importarArquivo"]>;
	importarMonitores: NonNullable<Estado["importarMonitores"]>;
	exportarMonitores: NonNullable<Estado["exportarMonitores"]>;
	gerarLote: NonNullable<Estado["gerarLote"]>;
	gerarLoteDeclaracoes: NonNullable<Estado["gerarLoteDeclaracoes"]>;
	abrirNovo: NonNullable<Estado["abrirNovo"]>;
};

export function AcoesMonitores({
	monitores,
	inputImportacaoRef,
	importarArquivo,
	importarMonitores,
	exportarMonitores,
	gerarLote,
	gerarLoteDeclaracoes,
	abrirNovo,
}: AcoesMonitoresProps) {
	return (
		<div className="view-diretoria-monitores-acoes-monitores mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
			<span className="text-sm font-medium text-gray-700">
				{monitores.length} monitores cadastrados
			</span>
			<div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
				<input
					ref={inputImportacaoRef}
					type="file"
					accept=".xlsx,.xls,.csv"
					className="sr-only"
					onChange={(event) => void importarArquivo(event)}
				/>
				<button
					type="button"
					onClick={() => inputImportacaoRef.current?.click()}
					disabled={importarMonitores.isPending}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{importarMonitores.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<Upload className="w-4 h-4" />
					)}
					{importarMonitores.isPending ? "Importando..." : "Importar planilha"}
				</button>
				<button
					type="button"
					onClick={exportarMonitores}
					disabled={!monitores.length}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
				>
					<Download className="w-4 h-4" />
					Exportar
				</button>
				<button
					type="button"
					onClick={gerarLote}
					disabled={!monitores.length || gerarLoteDeclaracoes.isPending}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
					title="Gera um único PDF com todos os certificados dos monitores listados."
				>
					{gerarLoteDeclaracoes.isPending ? (
						<Loader2 className="w-4 h-4 animate-spin" />
					) : (
						<FileText className="w-4 h-4" />
					)}
					{gerarLoteDeclaracoes.isPending ? "Gerando PDF..." : "Gerar lote"}
				</button>
				<button
					type="button"
					onClick={abrirNovo}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-colors hover:bg-sky-700"
				>
					<Plus className="w-4 h-4" />
					Novo monitor
				</button>
			</div>
		</div>
	);
}
