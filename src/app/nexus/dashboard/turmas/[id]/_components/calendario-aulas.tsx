"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
	DIAS_SEMANA,
	EVENTO_CONFIG,
	type EventoCalendario,
	gerarDiasMes,
	NOMES_MES,
	toISO,
} from "./suporte";

import { DetalhesCalendario } from "./detalhes-calendario";

export function CalendarioAulas({
	eventos,
	cor,
}: {
	eventos: EventoCalendario[];
	cor: string;
}) {
	const hoje = new Date();
	const [mes, setMes] = useState(hoje.getMonth());
	const [ano, setAno] = useState(hoje.getFullYear());
	const [diaSelecionado, setDiaSelecionado] = useState<string | null>(null);

	const { primeiroDia, totalDias } = useMemo(
		() => gerarDiasMes(ano, mes),
		[ano, mes],
	);

	const eventosDoMes = useMemo(
		() =>
			eventos
				.filter((e) => {
					const [eAno, eMes] = e.data.split("-").map(Number);
					return eAno === ano && eMes === mes + 1;
				})
				.sort((a, b) => a.data.localeCompare(b.data)),
		[eventos, ano, mes],
	);

	const eventosPorDia = useMemo(() => {
		const map: Record<string, EventoCalendario> = {};
		eventosDoMes.forEach((e) => {
			map[e.data] = e;
		});
		return map;
	}, [eventosDoMes]);

	const eventoSelecionado = diaSelecionado
		? eventosPorDia[diaSelecionado]
		: null;

	const mesAnterior = () => {
		setDiaSelecionado(null);
		if (mes === 0) {
			setMes(11);
			setAno((a) => a - 1);
		} else setMes((m) => m - 1);
	};

	const mesProximo = () => {
		setDiaSelecionado(null);
		if (mes === 11) {
			setMes(0);
			setAno((a) => a + 1);
		} else setMes((m) => m + 1);
	};

	const irParaHoje = () => {
		setMes(hoje.getMonth());
		setAno(hoje.getFullYear());
		setDiaSelecionado(
			toISO(hoje.getFullYear(), hoje.getMonth(), hoje.getDate()),
		);
	};

	const hojeISO = toISO(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());

	return (
		<div className="view-dashboard-turmas-id-calendario-aulas grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-12">
			{/* Calendário Principal (Grid adaptável) */}
			<div className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:col-span-8">
				{/* Header do calendário */}
				<div className="flex min-w-0 flex-col gap-3 border-b border-gray-100 bg-gray-50/60 px-3 py-3.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between sm:px-6">
					<div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3">
						<h4 className="turma-semantic-text text-sm sm:text-base font-bold tracking-tight">
							{NOMES_MES[mes]} {ano}
						</h4>
						<span className="turma-semantic-description text-xs bg-white border border-gray-200 px-2 py-0.5 rounded-full font-medium shadow-2xs">
							{eventosDoMes.length}{" "}
							{eventosDoMes.length === 1 ? "evento" : "eventos"}
						</span>
					</div>

					<div className="flex items-center justify-end gap-1.5">
						<button
							onClick={irParaHoje}
							className="turma-semantic-text min-h-11 rounded-lg px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-200/60"
						>
							Hoje
						</button>
						<div className="h-4 w-px bg-gray-200 mx-0.5" />
						<button
							onClick={mesAnterior}
							aria-label="Mês anterior"
							className="turma-semantic-accent grid min-h-11 min-w-11 place-items-center rounded-lg transition-colors hover:bg-gray-200/70"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							onClick={mesProximo}
							aria-label="Próximo mês"
							className="turma-semantic-accent grid min-h-11 min-w-11 place-items-center rounded-lg transition-colors hover:bg-gray-200/70"
						>
							<ChevronRight className="w-4 h-4" />
						</button>
					</div>
				</div>

				{/* Grid do calendário */}
				<div className="p-3 sm:p-5">
					{/* Header dias da semana */}
					<div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
						{DIAS_SEMANA.map((d) => (
							<div
								key={d}
								className="turma-semantic-accent text-center text-[11px] font-bold uppercase tracking-wider py-1"
							>
								{d}
							</div>
						))}
					</div>

					{/* Dias */}
					<div className="grid grid-cols-7 gap-1 sm:gap-2">
						{/* Espaços vazios antes do primeiro dia */}
						{Array.from({ length: primeiroDia }).map((_, i) => (
							<div
								key={`empty-${i}`}
								className="w-full aspect-square sm:aspect-auto sm:min-h-[3.25rem] md:min-h-[4rem] rounded-xl"
							/>
						))}

						{/* Dias do mês */}
						{Array.from({ length: totalDias }).map((_, i) => {
							const dia = i + 1;
							const iso = toISO(ano, mes, dia);
							const evento = eventosPorDia[iso];
							const isHoje = iso === hojeISO;
							const isSelecionado = iso === diaSelecionado;
							const config = evento ? EVENTO_CONFIG[evento.tipo] : null;

							return (
								<button
									key={dia}
									onClick={() => setDiaSelecionado(isSelecionado ? null : iso)}
									className={`
										w-full aspect-square sm:aspect-auto sm:min-h-[3.25rem] md:min-h-[4rem] rounded-xl flex flex-col justify-between p-1 sm:p-1.5 relative text-xs font-medium
										transition-all duration-150 group text-left
										${isSelecionado ? "ring-2 shadow-sm" : "hover:bg-gray-50 border border-transparent hover:border-gray-200"}
										${isHoje && !isSelecionado ? "ring-1 ring-gray-300 font-bold" : ""}
										${evento?.tipo === "cancelada" ? "opacity-75" : ""}
									`}
									style={{
										backgroundColor:
											isSelecionado && config
												? config.corBg
												: evento
													? `${config!.cor}0D`
													: isSelecionado
														? "#F3F4F6"
														: undefined,
										color: evento ? config!.cor : isHoje ? cor : "#374151",
										borderColor:
											isSelecionado && config ? config.cor : undefined,
									}}
								>
									{/* Top: Dia e Badge de Hoje */}
									<div className="flex items-center justify-between w-full">
										<span
											className={`
												text-[11px] sm:text-xs leading-none flex items-center justify-center rounded-full
												${isHoje ? "w-5 h-5 bg-sky-600 text-white font-bold" : ""}
											`}
										>
											{dia}
										</span>
										{evento && (
											<span
												className="sm:hidden w-1.5 h-1.5 rounded-full"
												style={{ backgroundColor: config!.cor }}
											/>
										)}
									</div>

									{/* Bottom / Middle no Desktop: Label do evento */}
									{evento && (
										<div
											className="hidden sm:flex items-center gap-1 w-full px-1.5 py-0.5 rounded text-[10px] font-medium truncate mt-1"
											style={{
												backgroundColor: config!.corBg,
												color: config!.cor,
											}}
										>
											<span
												className="w-1.5 h-1.5 rounded-full flex-shrink-0"
												style={{ backgroundColor: config!.cor }}
											/>
											<span className="truncate">{evento.titulo}</span>
										</div>
									)}
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{/* Painel Lateral Responsivo: Detalhes, Próximos Eventos e Legenda */}
			<DetalhesCalendario
				diaSelecionado={diaSelecionado}
				eventoSelecionado={eventoSelecionado}
				eventosDoMes={eventosDoMes}
				mes={mes}
				setDiaSelecionado={setDiaSelecionado}
			/>
		</div>
	);
}
