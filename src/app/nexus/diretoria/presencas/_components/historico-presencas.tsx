"use client";
import { CalendarDays, Trash2 } from "lucide-react";
import { useGerenciarPresencas } from "./use-gerenciar-presencas";

type Estado = ReturnType<typeof useGerenciarPresencas>;
type HistoricoPresencasProps = {
	registrosOrdenados: NonNullable<Estado["registrosOrdenados"]>;
	setData: NonNullable<Estado["setData"]>;
	remover: NonNullable<Estado["remover"]>;
	turma: NonNullable<Estado["turma"]>;
};

export function HistoricoPresencas({
	registrosOrdenados,
	setData,
	remover,
	turma,
}: HistoricoPresencasProps) {
	return (
		<section className="view-diretoria-presencas-historico-presencas rounded-2xl border border-gray-200 bg-white">
			<div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3">
				<CalendarDays className="h-4 w-4 text-sky-600" />
				<h2 className="font-semibold text-gray-800">Registros desta turma</h2>
			</div>
			<div className="divide-y divide-gray-100">
				{registrosOrdenados.length ? (
					registrosOrdenados.map((registro) => (
						<div
							key={registro.id}
							className="flex items-center justify-between px-5 py-3"
						>
							<button
								onClick={() =>
									setData(registro.data.toISOString().slice(0, 10))
								}
								className="text-sm font-medium text-sky-700 hover:underline"
							>
								{registro.data.toLocaleDateString("pt-BR")}
							</button>
							<span className="text-xs text-gray-500">
								{registro.alunos.length} alunos · {registro.monitores.length}{" "}
								monitores · {registro.professores.length} docentes
							</span>
							<button
								onClick={() => {
									if (confirm("Excluir este registro de presença?"))
										remover.mutate({
											id: registro.id,
											turmaId: turma.id,
										});
								}}
								className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
							>
								<Trash2 className="h-4 w-4" />
							</button>
						</div>
					))
				) : (
					<p className="px-5 py-6 text-sm text-gray-400">
						Nenhuma presença registrada para esta turma.
					</p>
				)}
			</div>
		</section>
	);
}
