import { CalendarDays } from "lucide-react";
import {
	EVENTO_CONFIG,
	NOMES_MES,
	type EventoCalendario,
	type TipoEvento,
} from "./suporte";

export function DetalhesCalendario({
	diaSelecionado,
	eventoSelecionado,
	eventosDoMes,
	mes,
	setDiaSelecionado,
}: {
	diaSelecionado: string | null;
	eventoSelecionado: EventoCalendario | null | undefined;
	eventosDoMes: EventoCalendario[];
	mes: number;
	setDiaSelecionado: (data: string) => void;
}) {
	return (
		<div className="lg:col-span-4 flex flex-col gap-4 w-full">
			{/* Detalhe do dia selecionado */}
			<div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
				<h5 className="turma-semantic-description text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5">
					<CalendarDays className="turma-semantic-accent w-3.5 h-3.5" />
					{diaSelecionado
						? `Dia ${diaSelecionado.split("-").reverse().join("/")}`
						: "Dia Selecionado"}
				</h5>

				{diaSelecionado ? (
					eventoSelecionado ? (
						(() => {
							const cfg = EVENTO_CONFIG[eventoSelecionado.tipo];
							const EvIcon = cfg.icon;
							return (
								<div
									className="rounded-xl p-3.5 flex items-start gap-3 transition-all"
									style={{ backgroundColor: cfg.corBg }}
								>
									<div
										className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
										style={{ backgroundColor: `${cfg.cor}20` }}
									>
										<EvIcon
											className="w-4.5 h-4.5"
											style={{ color: cfg.cor }}
										/>
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-center gap-2 mb-1">
											<span
												className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
												style={{
													backgroundColor: `${cfg.cor}25`,
													color: cfg.cor,
												}}
											>
												{cfg.label}
											</span>
										</div>
										<p
											className="font-semibold text-sm leading-snug"
											style={{ color: cfg.cor }}
										>
											{eventoSelecionado.titulo}
										</p>
									</div>
								</div>
							);
						})()
					) : (
						<div className="p-3 bg-gray-50 rounded-xl text-center">
							<p className="turma-semantic-description text-xs">
								Nenhuma aula ou evento programado para esta data.
							</p>
						</div>
					)
				) : (
					<div className="p-3.5 bg-gray-50 rounded-xl text-center">
						<p className="turma-semantic-description text-xs">
							Clique em qualquer dia do calendário para ver suas informações
							detalhadas.
						</p>
					</div>
				)}
			</div>

			{/* Lista de Eventos do Mês */}
			<div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col">
				<h5 className="turma-semantic-description text-xs font-semibold uppercase tracking-wider mb-3">
					Atividades de {NOMES_MES[mes]}
				</h5>

				<div className="space-y-2 max-h-60 overflow-y-auto pr-1">
					{eventosDoMes.map((ev) => {
						const cfg = EVENTO_CONFIG[ev.tipo];
						const EvIcon = cfg.icon;
						const isAtivo = ev.data === diaSelecionado;
						const diaNum = ev.data.split("-")[2];

						return (
							<button
								key={ev.id}
								onClick={() => setDiaSelecionado(ev.data)}
								className={`
									w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all text-xs
									${isAtivo ? "ring-2 shadow-xs" : "hover:bg-gray-50 bg-gray-50/50"}
								`}
								style={{
									backgroundColor: isAtivo ? cfg.corBg : undefined,
									borderColor: isAtivo ? cfg.cor : undefined,
								}}
							>
								<div
									className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] flex-shrink-0"
									style={{ backgroundColor: `${cfg.cor}1A`, color: cfg.cor }}
								>
									{diaNum}
								</div>
								<div className="flex-1 min-w-0">
									<p
										className="font-medium truncate"
										style={{ color: isAtivo ? cfg.cor : undefined }}
									>
										{ev.titulo}
									</p>
									<span className="turma-semantic-description text-[10px]">
										{cfg.label}
									</span>
								</div>
								<EvIcon className="turma-semantic-accent w-3.5 h-3.5 flex-shrink-0" />
							</button>
						);
					})}

					{eventosDoMes.length === 0 && (
						<p className="turma-semantic-description text-xs text-center py-4">
							Nenhum evento registrado neste mês.
						</p>
					)}
				</div>
			</div>

			{/* Legenda */}
			<div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm">
				<h5 className="turma-semantic-description text-[11px] font-semibold uppercase tracking-wider mb-2">
					Legenda
				</h5>
				<div className="grid grid-cols-2 gap-2">
					{(
						Object.entries(EVENTO_CONFIG) as [
							TipoEvento,
							(typeof EVENTO_CONFIG)[TipoEvento],
						][]
					).map(([tipo, cfg]) => (
						<div key={tipo} className="flex items-center gap-1.5">
							<span
								className="w-2.5 h-2.5 rounded-full flex-shrink-0"
								style={{ backgroundColor: cfg.cor }}
							/>
							<span className="turma-semantic-text text-xs font-medium">
								{cfg.label}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
