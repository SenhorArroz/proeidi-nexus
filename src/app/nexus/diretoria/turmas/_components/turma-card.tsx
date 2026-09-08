"use client";

import {
	CalendarDays,
	ClipboardCheck,
	Copy,
	DoorOpen,
	FolderOpen,
	Pencil,
	Trash2,
	Users,
} from "lucide-react";
import React from "react";
import { type Turma } from "./suporte";

export function TurmaCard({
	turma,
	onEditar,
	onDuplicar,
	onLimparAlunos,
	onExcluir,
	duplicando,
}: {
	turma: Turma;
	onEditar: () => void;
	onDuplicar: () => void;
	onLimparAlunos: () => void;
	onExcluir: () => void;
	duplicando: boolean;
}) {
	return (
		<div
			className="view-nexus-diretoria-turmas-turma-card turma-card-tema group min-w-0 overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5"
			style={
				{
					backgroundColor: turma.corFundo,
					"--turma-texto": turma.corTexto,
					"--turma-descricao": turma.corDescricao,
					fontFamily:
						turma.fonte === "SERIF"
							? "Georgia, serif"
							: turma.fonte === "MONO"
								? "ui-monospace, SFMono-Regular, Menlo, monospace"
								: undefined,
					boxShadow: `0 16px 30px ${turma.cor}24`,
				} as React.CSSProperties
			}
		>
			<div
				className="turma-card-tema__cabecalho relative overflow-hidden px-5 py-4"
				style={{ backgroundColor: turma.cor }}
			>
				<div
					className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full"
					style={{ backgroundColor: turma.corDestaque }}
				/>
				<div className="relative flex items-start justify-between gap-2">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
							<DoorOpen className="w-4.5 h-4.5 text-white" />
						</div>
						<span
							className="text-sm font-semibold text-white truncate"
							style={{ color: turma.corTitulo }}
						>
							{turma.titulo}
						</span>
					</div>
					<div className="relative flex shrink-0 items-center gap-0.5">
						<button
							onClick={onEditar}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Editar turma"
						>
							<Pencil className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onDuplicar}
							disabled={duplicando}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Duplicar turma"
							title="Duplicar turma"
						>
							<Copy className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onExcluir}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Excluir turma"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>

			<div className="p-5">
				<p className="turma-card-descricao mb-3 truncate text-xs font-medium !text-[color:var(--turma-descricao)]">
					{turma.professores?.length > 0
						? turma.professores.join(", ")
						: "Sem professor definido"}
					{turma.monitores?.length > 0 &&
						` · ${turma.monitores.join(", ")} (monitor)`}
				</p>

				<div className="turma-card-descricao flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
					<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
						<Users
							className="w-3.5 h-3.5"
							style={{ color: turma.corDestaque }}
						/>
						{turma.alunos?.length ?? 0} / {turma.limiteAlunos} alunos
					</span>
					<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
						<CalendarDays
							className="w-3.5 h-3.5"
							style={{ color: turma.corDestaque }}
						/>
						{turma.aulas?.length ?? 0} aulas
					</span>
					{turma.materiais?.length > 0 && (
						<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
							<FolderOpen
								className="w-3.5 h-3.5"
								style={{ color: turma.corDestaque }}
							/>
							{turma.materiais.length} materiais
						</span>
					)}
				</div>
				{turma.alunos.length > 0 && (
					<button
						type="button"
						onClick={onLimparAlunos}
						className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-3 text-xs font-bold text-red-700 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
					>
						<ClipboardCheck className="h-4 w-4" /> Limpar alunos registrados
					</button>
				)}
			</div>
		</div>
	);
}
