"use client";

import { FileDigit, Pencil, Phone, Trash2 } from "lucide-react";
import { type Candidato, formatarCpf } from "./suporte";

export function CardCandidato({
	candidato,
	onEdit,
	onDelete,
}: {
	candidato: Candidato;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const isSmartphone = candidato.curso === "Smartphone";

	return (
		<div className="view-nexus-diretoria-sorteio-card-candidato group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4">
			{/* Ficha Badge */}
			<div
				className={`w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center border border-dashed ${isSmartphone ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}
			>
				<span className="text-[10px] font-bold uppercase tracking-wider opacity-60 -mb-1">
					Ficha
				</span>
				<span className="text-lg font-black">{candidato.ficha}</span>
			</div>

			{/* Infos */}
			<div className="flex-1 min-w-0">
				<h4
					className="text-sm font-bold text-gray-900 truncate"
					title={candidato.nome}
				>
					{candidato.nome}
				</h4>
				<div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
					<span className="flex items-center gap-1">
						<FileDigit className="w-3 h-3" /> {formatarCpf(candidato.cpf)}
					</span>
					<span className="flex items-center gap-1">
						<Phone className="w-3 h-3" /> {candidato.telefone}
					</span>
				</div>
			</div>

			{/* Ações */}
			<div className="flex flex-col sm:flex-row gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
				<button
					onClick={onEdit}
					className="p-2 text-black/45 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
					title="Editar"
				>
					<Pencil className="w-4 h-4" />
				</button>
				<button
					onClick={onDelete}
					className="p-2 text-black/45 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
					title="Excluir"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
