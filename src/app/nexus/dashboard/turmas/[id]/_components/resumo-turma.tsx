import { CalendarDays, MapPin, ShieldCheck, Users } from "lucide-react";
import type { DadosTurma } from "./suporte";

export function ResumoTurma({ turma }: { turma: DadosTurma }) {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
			<div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
				<div
					className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
					style={{ backgroundColor: turma.cor }}
				>
					{turma.professores
						.map((p) => p[0])
						.join("")
						.slice(0, 2)}
				</div>
				<p className="min-w-0 break-words text-sm font-medium text-gray-700">
					{turma.professores.join(" e ")}
				</p>
				<span className="text-gray-300">·</span>
				<span className="flex items-center gap-1 text-xs text-gray-500">
					<MapPin className="w-3.5 h-3.5" />
					{turma.sala}
				</span>
			</div>
			<div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500">
				<span className="flex items-center gap-1.5">
					<Users className="w-4 h-4 text-gray-400" />
					{turma.alunos.length} alunos
				</span>
				<span className="flex items-center gap-1.5">
					<ShieldCheck className="w-4 h-4 text-gray-400" />
					{turma.monitores.length} monitores
				</span>
				<span className="flex items-center gap-1.5">
					<CalendarDays className="w-4 h-4 text-gray-400" />
					{turma.horario}
				</span>
			</div>
		</div>
	);
}
