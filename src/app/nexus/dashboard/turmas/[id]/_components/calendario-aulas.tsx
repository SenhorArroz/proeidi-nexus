"use client";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import {
	DIAS_SEMANA,
	EVENTO_CONFIG,
	type EventoCalendario,
	gerarDiasMes,
	NOMES_MES,
	type TipoEvento,
	toISO,
} from "./suporte";

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
		</div>
	);
}
