"use client";

import { DoorOpen, FileText, Pencil, Trash2 } from "lucide-react";
import { type Professor, iniciais } from "./suporte";

export function ProfessorCard({
	professor,
	onEditar,
	onExcluir,
	onDeclaracao,
}: {
	professor: Professor;
	onEditar: () => void;
	onExcluir: () => void;
	onDeclaracao: () => void;
}) {
	return (
		<div className="view-nexus-diretoria-professores-professor-card bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-10 h-10 rounded-full bg-amber-500/20 text-sky-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">
						{iniciais(professor.nome) || "?"}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-gray-900 truncate">
							{professor.nome || "Sem nome"}
						</p>
						<p className="text-xs text-gray-500 truncate">
							{professor.email || "Sem e-mail cadastrado"}
						</p>
						{professor.matricula && (
							<p className="text-[11px] text-gray-400 font-mono mt-0.5">
								Matrícula: {professor.matricula}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					<button
						onClick={onDeclaracao}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600"
						aria-label="Gerar certificado PM"
						title="Gerar certificado PM"
					>
						<FileText className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={onEditar}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						aria-label="Editar professor"
					>
						<Pencil className="w-3.5 h-3.5" />
					</button>
					<button
						onClick={onExcluir}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
						aria-label="Excluir professor"
					>
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			<div className="pt-3 border-t border-gray-100">
				{professor.turmas.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{professor.turmas.map((t) => (
							<span
								key={t}
								className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700"
							>
								<DoorOpen className="w-3 h-3" />
								{t}
							</span>
						))}
					</div>
				) : (
					<p className="text-xs text-gray-400">Nenhuma turma atribuída</p>
				)}
			</div>
		</div>
	);
}
