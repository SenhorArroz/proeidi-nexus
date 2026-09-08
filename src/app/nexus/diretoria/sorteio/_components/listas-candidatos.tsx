"use client";
import { Monitor, Smartphone } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { CardCandidato } from "./card-candidato";
import { useGerenciarSorteio } from "./use-gerenciar-sorteio";

type Estado = ReturnType<typeof useGerenciarSorteio>;
type ListasCandidatosProps = {
	listaSmartphone: NonNullable<Estado["listaSmartphone"]>;
	carregandoSemestres: NonNullable<Estado["carregandoSemestres"]>;
	carregandoCandidatos: NonNullable<Estado["carregandoCandidatos"]>;
	abrirModalEdicao: NonNullable<Estado["abrirModalEdicao"]>;
	excluirCandidato: NonNullable<Estado["excluirCandidato"]>;
	listaComputador: NonNullable<Estado["listaComputador"]>;
};

export function ListasCandidatos({
	listaSmartphone,
	carregandoSemestres,
	carregandoCandidatos,
	abrirModalEdicao,
	excluirCandidato,
	listaComputador,
}: ListasCandidatosProps) {
	return (
		<div className="view-diretoria-sorteio-listas-candidatos grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
			{/* COLUNA: SMARTPHONE */}
			<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
				<div className="bg-sky-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
							<Smartphone className="w-5 h-5" />
						</div>
						<h2 className="font-bold text-gray-800">Curso de Smartphone</h2>
					</div>
					<span className="bg-white border border-sky-100 text-sky-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
						{listaSmartphone.length} fichas
					</span>
				</div>

				<div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
					{carregandoSemestres || carregandoCandidatos ? (
						<DataSkeleton rows={4} />
					) : listaSmartphone.length === 0 ? (
						<p className="text-center text-sm text-gray-400 py-10">
							Nenhum candidato encontrado.
						</p>
					) : (
						listaSmartphone.map((candidato) => (
							<CardCandidato
								key={candidato.id}
								candidato={candidato}
								onEdit={() => abrirModalEdicao(candidato)}
								onDelete={() => excluirCandidato(candidato.id)}
							/>
						))
					)}
				</div>
			</div>

			{/* COLUNA: COMPUTADOR */}
			<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
				<div className="bg-amber-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
							<Monitor className="w-5 h-5" />
						</div>
						<h2 className="font-bold text-gray-800">Curso de Computador</h2>
					</div>
					<span className="bg-white border border-amber-100 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
						{listaComputador.length} fichas
					</span>
				</div>

				<div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
					{carregandoSemestres || carregandoCandidatos ? (
						<DataSkeleton rows={4} />
					) : listaComputador.length === 0 ? (
						<p className="text-center text-sm text-gray-400 py-10">
							Nenhum candidato encontrado.
						</p>
					) : (
						listaComputador.map((candidato) => (
							<CardCandidato
								key={candidato.id}
								candidato={candidato}
								onEdit={() => abrirModalEdicao(candidato)}
								onDelete={() => excluirCandidato(candidato.id)}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
