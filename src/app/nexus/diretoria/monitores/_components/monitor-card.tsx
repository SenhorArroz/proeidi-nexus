"use client";

import { DoorOpen, FileText, Pencil, Trash2 } from "lucide-react";
import { iniciais, type Monitor } from "./suporte";

export function _MonitorCard({
	monitor,
	onEditar,
	onExcluir,
	onDeclaracao,
}: {
	monitor: Monitor;
	onEditar: () => void;
	onExcluir: () => void;
	onDeclaracao: () => void;
}) {
	return (
		<div className="view-nexus-diretoria-monitores-monitor-card bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
						{iniciais(monitor.nome) || "?"}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-gray-900 truncate">
							{monitor.nome || "Sem nome"}
						</p>
						<p className="text-xs text-gray-500 truncate">
							{monitor.email || "Sem e-mail cadastrado"}
						</p>
						{monitor.matricula && (
							<p className="text-[11px] text-gray-400 font-mono mt-0.5">
								Matrícula: {monitor.matricula}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					<button
						type="button"
						onClick={onDeclaracao}
						className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
						aria-label="Gerar certificado PM"
						title="Gerar certificado PM"
					>
						<FileText className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={onEditar}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						aria-label="Editar monitor"
					>
						<Pencil className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={onExcluir}
						className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
						aria-label="Excluir monitor"
					>
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			<div className="pt-3 border-t border-gray-100">
				{monitor.turmas.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{monitor.turmas.map((t) => (
							<span
								key={t}
								className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
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
