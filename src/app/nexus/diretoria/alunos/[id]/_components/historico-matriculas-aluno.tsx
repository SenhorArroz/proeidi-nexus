"use client";
import { CalendarDays, GraduationCap } from "lucide-react";
import type { RouterOutputs } from "~/trpc/react";

type HistoricoMatriculasAlunoProps = {
	carregandoHistorico: boolean;
	historico: RouterOutputs["diretoria"]["alunos"]["historico"] | undefined;
};
export function HistoricoMatriculasAluno({
	carregandoHistorico,
	historico,
}: HistoricoMatriculasAlunoProps) {
	return (
		<section className="view-historico-matriculas-aluno rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,.06)] sm:p-5">
			<h2 className="flex items-center gap-2 font-extrabold text-slate-900">
				<GraduationCap className="h-5 w-5 text-orange-600" /> Histórico de
				turmas
			</h2>
			<p className="mt-1 text-sm text-slate-500">
				Todas as turmas às quais este aluno já foi vinculado.
			</p>
			<div className="mt-4 space-y-3">
				{carregandoHistorico ? (
					<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
						Carregando histórico...
					</p>
				) : historico?.length ? (
					historico.map((registro) => (
						<article
							key={registro.id}
							className="rounded-xl border border-slate-100 p-3"
						>
							<div className="flex items-start gap-3">
								<span
									className="mt-1 h-3 w-3 shrink-0 rounded-full"
									style={{ backgroundColor: "#0284c7" }}
								/>
								<div className="min-w-0">
									<h3 className="break-words font-bold text-slate-900">
										{registro.semestre.codigo}
									</h3>
									<p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
										<span className="inline-flex items-center gap-1">
											<CalendarDays className="h-3.5 w-3.5" />
											{registro.turmas
												.map(({ turma }) => turma.titulo)
												.join(", ") || "Sem turma"}
										</span>
										<span>
											{registro.etapaTrilha || "Etapa não definida"} ·{" "}
											{registro.statusMatricula.toLowerCase()}
										</span>
									</p>
								</div>
							</div>
						</article>
					))
				) : (
					<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
						Nenhuma turma vinculada.
					</p>
				)}
			</div>
		</section>
	);
}
