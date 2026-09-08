"use client";
import {
	CalendarDays,
	CheckCircle2,
	Copy,
	GraduationCap,
	Trash2,
	Users,
} from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { Resumo } from "./resumo";

type ListaSemestresProps = {
	isLoading: boolean;
	semestres: RouterOutputs["diretoria"]["semestres"]["list"] | undefined;
	ativar: ReturnType<typeof api.diretoria.semestres.setAtivo.useMutation>;
	setSemestreParaDuplicar: Dispatch<
		SetStateAction<{ id: string; codigo: string } | null>
	>;
	setCodigoDestino: Dispatch<SetStateAction<string>>;
	remover: ReturnType<typeof api.diretoria.semestres.remove.useMutation>;
};
export function ListaSemestres({
	isLoading,
	semestres,
	ativar,
	setSemestreParaDuplicar,
	setCodigoDestino,
	remover,
}: ListaSemestresProps) {
	return (
		<div className="view-lista-semestres grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{isLoading ? (
				<DataSkeleton cards={6} className="col-span-full" />
			) : (
				semestres?.map((semestre) => (
					<div
						key={semestre.id}
						className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]"
					>
						<div className="relative flex items-center justify-between overflow-hidden bg-sky-600 px-5 py-4 text-white">
							<div className="absolute -right-5 -top-8 h-20 w-20 rounded-full bg-orange-500" />
							<div className="relative">
								<p className="text-lg font-semibold">{semestre.codigo}</p>
								{semestre.ativo && (
									<span className="mt-1 inline-flex items-center gap-1 text-xs text-white/90">
										<CheckCircle2 className="h-3.5 w-3.5" />
										Semestre ativo
									</span>
								)}
							</div>
							<CalendarDays className="relative h-5 w-5 text-white/75" />
						</div>
						<div className="grid grid-cols-1 gap-2 p-4 text-center min-[390px]:grid-cols-3 sm:p-5">
							<Resumo
								icon={GraduationCap}
								valor={semestre.totalAlunos}
								label="Alunos"
							/>
							<Resumo
								icon={Users}
								valor={semestre.totalProfessores}
								label="Professores"
							/>
							<Resumo
								icon={CalendarDays}
								valor={semestre.totalTurmas}
								label="Turmas"
							/>
						</div>
						<div className="flex flex-wrap gap-2 border-t border-gray-100 p-3">
							{!semestre.ativo && (
								<button
									onClick={() => ativar.mutate({ id: semestre.id })}
									className="min-h-11 min-w-32 flex-1 rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"
								>
									Tornar ativo
								</button>
							)}
							<button
								onClick={() => {
									setSemestreParaDuplicar({
										id: semestre.id,
										codigo: semestre.codigo,
									});
									setCodigoDestino("");
								}}
								className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-50 px-3 py-2 text-xs font-bold text-orange-800 hover:bg-orange-100"
							>
								<Copy className="h-3.5 w-3.5" /> Duplicar
							</button>
							<button
								onClick={() => {
									if (confirm(`Excluir o semestre ${semestre.codigo}?`))
										remover.mutate({ id: semestre.id });
								}}
								disabled={
									semestre.ativo ||
									semestre.totalTurmas > 0 ||
									semestre.totalAlunos > 0
								}
								title={
									semestre.ativo
										? "Não é possível excluir o semestre ativo"
										: "Semestres com dados não podem ser excluídos"
								}
								className="grid min-h-11 min-w-11 place-items-center rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					</div>
				))
			)}
		</div>
	);
}
