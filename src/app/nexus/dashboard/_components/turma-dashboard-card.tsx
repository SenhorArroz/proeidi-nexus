"use client";
import { ChevronRight, Clock3, DoorOpen, MapPin, Users } from "lucide-react";
import Link from "next/link";
import type { RouterOutputs } from "~/trpc/react";

type TurmaDashboardCardProps = {
	turma: RouterOutputs["turma"]["minhas"]["turmas"][number];
};
export function TurmaDashboardCard({ turma }: TurmaDashboardCardProps) {
	return (
		<Link
			href={`/nexus/dashboard/turmas/${turma.id}`}
			className="view-turma-dashboard-card turma-card-tema group min-w-0 overflow-hidden rounded-2xl shadow-[0_12px_27px_rgba(15,23,42,.07)] transition duration-200 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4"
			style={{
				backgroundColor: turma.corFundo,
				["--turma-texto" as string]: turma.corTexto,
				["--turma-descricao" as string]: turma.corDescricao,
				fontFamily:
					turma.fonte === "SERIF"
						? "Georgia, serif"
						: turma.fonte === "MONO"
							? "ui-monospace, SFMono-Regular, Menlo, monospace"
							: undefined,
				boxShadow: `0 20px 35px ${turma.cor}29`,
				["--tw-ring-color" as string]: turma.corDestaque,
			}}
		>
			<div
				className="turma-card-tema__cabecalho relative px-5 py-5"
				style={{ backgroundColor: turma.cor }}
			>
				<div
					className="absolute -right-6 -bottom-9 h-28 w-28 rounded-full"
					style={{ backgroundColor: turma.corDestaque }}
				/>
				<div className="relative flex items-start justify-between gap-4">
					<span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
						<DoorOpen className="h-5 w-5 text-white" />
					</span>
					<ChevronRight className="mt-1 h-5 w-5 text-white/75 transition group-hover:translate-x-1" />
				</div>
				<h3
					className="relative mt-5 truncate text-base font-black tracking-[-.02em] text-white"
					style={{ color: turma.corTitulo }}
				>
					{turma.titulo}
				</h3>
				<p
					className="relative mt-1 text-xs font-semibold text-white/80"
					style={{ color: turma.corTitulo }}
				>
					{turma.semestre.codigo}
				</p>
			</div>
			<div className="turma-card-descricao space-y-3 p-5 text-sm text-slate-600">
				<p className="flex min-w-0 items-center gap-2 !text-[color:var(--turma-descricao)]">
					<MapPin className="h-4 w-4" style={{ color: turma.corDestaque }} />
					<span className="truncate">{turma.sala || "Local a definir"}</span>
				</p>
				<p className="flex items-center gap-2 !text-[color:var(--turma-descricao)]">
					<Users className="h-4 w-4" style={{ color: turma.corDestaque }} />
					{turma.alunos.length} alunos
				</p>
				<p className="flex items-center gap-2 border-t border-slate-100 pt-3 font-semibold !text-[color:var(--turma-descricao)]">
					<Clock3 className="h-4 w-4" style={{ color: turma.corDestaque }} />
					{turma.horario}
				</p>
			</div>
		</Link>
	);
}
