"use client";
import { Plus, Search } from "lucide-react";
import { useGerenciarSorteio } from "./use-gerenciar-sorteio";

type Estado = ReturnType<typeof useGerenciarSorteio>;
type FiltrosSorteioProps = {
	semestreSelecionado: Estado["semestreSelecionado"];
	setSemestreId: NonNullable<Estado["setSemestreId"]>;
	semestres: Estado["semestres"];
	busca: NonNullable<Estado["busca"]>;
	setBusca: NonNullable<Estado["setBusca"]>;
	abrirModalNovo: NonNullable<Estado["abrirModalNovo"]>;
};

export function FiltrosSorteio({
	semestreSelecionado,
	setSemestreId,
	semestres,
	busca,
	setBusca,
	abrirModalNovo,
}: FiltrosSorteioProps) {
	return (
		<div className="view-diretoria-sorteio-filtros-sorteio flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
			<label className="flex w-full items-center gap-2 px-2 text-sm font-medium text-gray-600 lg:w-48">
				Semestre
				<select
					value={semestreSelecionado?.id ?? ""}
					onChange={(e) => setSemestreId(e.target.value)}
					className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
				>
					{semestres?.map((semestre) => (
						<option key={semestre.id} value={semestre.id}>
							{semestre.codigo}
							{semestre.ativo ? " — ativo" : ""}
						</option>
					))}
				</select>
			</label>
			<div className="flex items-center gap-3 w-full sm:w-96">
				<Search className="w-5 h-5 text-gray-400 shrink-0" />
				<input
					type="text"
					placeholder="Buscar por nome ou ficha..."
					value={busca}
					onChange={(e) => setBusca(e.target.value)}
					className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 py-2"
				/>
			</div>
			<button
				onClick={abrirModalNovo}
				className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md transition-all shrink-0"
			>
				<Plus className="w-4 h-4" />
				Adicionar Ficha
			</button>
		</div>
	);
}
