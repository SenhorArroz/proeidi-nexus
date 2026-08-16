"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import {
	Home,
	FolderOpen,
	NotebookPen,
	ClipboardList,
	ShieldCheck,
	Users,
	MapPin,
	BookOpen,
	MoreVertical,
	FileText,
	Link2,
	Image as ImageIcon,
	Check,
	X,
	Plus,
	Pin,
	ChevronLeft,
	ChevronRight,
	CalendarDays,
	Pencil,
	Trash2,
	Search,
	GraduationCap,
	Settings2,
	Star,
	AlertTriangle,
	Ban,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type TabId =
	| "inicio"
	| "materiais"
	| "anotacoes"
	| "calendario"
	| "presenca-alunos"
	| "presenca-monitores"
	| "presenca-professores";
type TipoEvento = "aula" | "feriado" | "cancelada" | "especial";

interface EventoCalendario {
	id: string;
	data: string; // yyyy-mm-dd
	titulo: string;
	tipo: TipoEvento;
}

interface Material {
	id: string;
	nome: string;
	url: string;
	quando: string;
}

interface Aviso {
	id: string;
	autor: string;
	fixado: boolean;
	texto: string;
	quando: string;
}

interface Anotacao {
	id: string;
	titulo: string;
	data: string;
	conteudo: string;
}

type EstadoPresenca = "presente" | "ausente" | "justificado" | "a_registrar";

interface Pessoa {
	id: string;
	nome: string;
	presente: EstadoPresenca;
}

interface DadosTurma {
	nome: string;
	sala: string;
	horario: string;
	professores: string[];
	monitores: string[];
	alunos: string[];
	cor: string;
}

const TURMA_VAZIA: DadosTurma = { nome: "", sala: "", horario: "", professores: [], monitores: [], alunos: [], cor: "#0284c7" };

const EVENTO_CONFIG: Record<
	TipoEvento,
	{ cor: string; corBg: string; label: string; icon: React.ElementType }
> = {
	aula: { cor: "#1A73E8", corBg: "#EBF3FE", label: "Aula", icon: BookOpen },
	feriado: {
		cor: "#D93025",
		corBg: "#FDECEB",
		label: "Feriado",
		icon: AlertTriangle,
	},
	cancelada: {
		cor: "#80868B",
		corBg: "#F1F3F4",
		label: "Cancelada",
		icon: Ban,
	},
	especial: { cor: "#F9AB00", corBg: "#FEF7E0", label: "Especial", icon: Star },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOMES_MES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

function pad(n: number) {
	return n.toString().padStart(2, "0");
}

function toISO(ano: number, mes: number, dia: number) {
	return `${ano}-${pad(mes + 1)}-${pad(dia)}`;
}

function gerarDiasMes(ano: number, mes: number) {
	const primeiroDia = new Date(ano, mes, 1).getDay();
	const totalDias = new Date(ano, mes + 1, 0).getDate();
	return { primeiroDia, totalDias };
}

// ---------------------------------------------------------------------------
// Componente: SearchSelect (busca e seleciona pessoas)
// ---------------------------------------------------------------------------

function SearchSelect({
	label,
	icon: Icon,
	values = [],
	onChange,
	options,
	placeholder,
	accent,
}: {
	label: string;
	icon: React.ElementType;
	values: string[];
	onChange: (v: string[]) => void;
	options: string[];
	placeholder: string;
	accent: string;
}) {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const resultados = options
		.filter((o) => !values.includes(o))
		.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 6);

	const selecionar = (nome: string) => {
		onChange([...values, nome]);
		setQuery("");
	};

	const remover = (nome: string) => onChange(values.filter((v) => v !== nome));

	return (
		<div>
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<Icon className="w-3.5 h-3.5" />
				{label}
			</label>

			<div className="flex flex-wrap gap-1.5 mb-2 min-h-[1.75rem]">
				{values.map((v) => (
					<span
						key={v}
						className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
						style={{ backgroundColor: `${accent}1A`, color: accent }}
					>
						{v}
						<button
							onClick={() => remover(v)}
							className="p-0.5 rounded-full hover:bg-black/10"
							aria-label={`Remover ${v}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
				{values.length === 0 && (
					<span className="text-xs text-gray-400 py-1">Nenhum selecionado</span>
				)}
			</div>

			<div ref={containerRef} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
				</div>

				{open && (
					<div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
						{resultados.length > 0 ? (
							resultados.map((opt, index) => (
								<button
									key={`${opt}-${index}`}
									onClick={() => selecionar(opt)}
									className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
								>
									{opt}
								</button>
							))
						) : (
							<p className="px-3 py-2.5 text-xs text-gray-400">
								Nenhum resultado na busca
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Componente: CalendarioAulas
// ---------------------------------------------------------------------------

function CalendarioAulas({
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
		<div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
			{/* Calendário Principal (Grid adaptável) */}
			<div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
				{/* Header do calendário */}
				<div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-100 bg-gray-50/60">
					<div className="flex items-center gap-3">
						<h4 className="text-sm sm:text-base font-bold text-gray-800 tracking-tight">
							{NOMES_MES[mes]} {ano}
						</h4>
						<span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full font-medium shadow-2xs">
							{eventosDoMes.length}{" "}
							{eventosDoMes.length === 1 ? "evento" : "eventos"}
						</span>
					</div>

					<div className="flex items-center gap-1.5">
						<button
							onClick={irParaHoje}
							className="px-2.5 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-200/60 rounded-lg transition-colors"
						>
							Hoje
						</button>
						<div className="h-4 w-px bg-gray-200 mx-0.5" />
						<button
							onClick={mesAnterior}
							aria-label="Mês anterior"
							className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"
						>
							<ChevronLeft className="w-4 h-4" />
						</button>
						<button
							onClick={mesProximo}
							aria-label="Próximo mês"
							className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-200/70 hover:text-gray-800 transition-colors"
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
								className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-wider py-1"
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
					<h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
						<CalendarDays className="w-3.5 h-3.5 text-gray-400" />
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
								<p className="text-xs text-gray-500">
									Nenhuma aula ou evento programado para esta data.
								</p>
							</div>
						)
					) : (
						<div className="p-3.5 bg-gray-50 rounded-xl text-center">
							<p className="text-xs text-gray-500">
								Clique em qualquer dia do calendário para ver suas informações
								detalhadas.
							</p>
						</div>
					)}
				</div>

				{/* Lista de Eventos do Mês */}
				<div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col">
					<h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
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
											className="font-medium truncate text-gray-800"
											style={{ color: isAtivo ? cfg.cor : undefined }}
										>
											{ev.titulo}
										</p>
										<span className="text-[10px] text-gray-400">
											{cfg.label}
										</span>
									</div>
									<EvIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
								</button>
							);
						})}

						{eventosDoMes.length === 0 && (
							<p className="text-xs text-gray-400 text-center py-4">
								Nenhum evento registrado neste mês.
							</p>
						)}
					</div>
				</div>

				{/* Legenda */}
				<div className="bg-white rounded-2xl border border-gray-200 p-3.5 shadow-sm">
					<h5 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
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
								<span className="text-xs text-gray-600 font-medium">
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



// ---------------------------------------------------------------------------
// Componente: EditarTurmaModal
// ---------------------------------------------------------------------------

function EditarTurmaModal({
	turma,
	onSalvar,
	onFechar,
}: {
	turma: DadosTurma;
	onSalvar: (t: DadosTurma) => void;
	onFechar: () => void;
}) {
	const [rascunho, setRascunho] = useState<DadosTurma>({ ...turma });

	const salvar = () => {
		if (!rascunho.nome.trim()) return;
		onSalvar(rascunho);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={onFechar}
			/>

			<div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl relative z-10 flex flex-col max-h-[90vh]">
				{/* Header */}
				<div className="flex items-center justify-between p-5 border-b border-gray-100">
					<h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
						<Settings2 className="w-5 h-5 text-sky-600" />
						Editar turma
					</h3>
					<button
						onClick={onFechar}
						className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<div className="flex-1 overflow-y-auto p-5 space-y-5">
					{/* Título */}
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
							Nome da turma
						</label>
						<input
							value={rascunho.nome}
							onChange={(e) =>
								setRascunho({ ...rascunho, nome: e.target.value })
							}
							placeholder="Ex: Smartphone mais do que Avançado"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
					</div>

					{/* Sala e Horário */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
								Sala
							</label>
							<input
								value={rascunho.sala}
								onChange={(e) =>
									setRascunho({ ...rascunho, sala: e.target.value })
								}
								placeholder="Ex: Sala 204"
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
								Horário
							</label>
							<input
								value={rascunho.horario}
								onChange={(e) =>
									setRascunho({ ...rascunho, horario: e.target.value })
								}
								placeholder="Ex: Seg e Qua · 14:00 – 16:00"
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
					</div>

					{/* Professores e Monitores */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<SearchSelect
							label="Professores"
							icon={GraduationCap}
							values={rascunho.professores}
							onChange={(v) => setRascunho({ ...rascunho, professores: v })}
							options={turma.professores}
							placeholder="Buscar professor..."
							accent="#1A73E8"
						/>
						<SearchSelect
							label="Monitores"
							icon={ShieldCheck}
							values={rascunho.monitores}
							onChange={(v) => setRascunho({ ...rascunho, monitores: v })}
							options={turma.monitores}
							placeholder="Buscar monitor..."
							accent="#188038"
						/>
					</div>

					{/* Alunos */}
					<SearchSelect
						label="Alunos"
						icon={Users}
						values={rascunho.alunos}
						onChange={(v) => setRascunho({ ...rascunho, alunos: v })}
						options={turma.alunos}
						placeholder="Buscar aluno..."
						accent="#9334E6"
					/>
				</div>

				{/* Footer */}
				<div className="flex items-center justify-end gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100 rounded-b-3xl">
					<button
						onClick={onFechar}
						className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors"
					>
						Cancelar
					</button>
					<button
						onClick={salvar}
						disabled={!rascunho.nome.trim()}
						className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
					>
						<Check className="w-4 h-4" />
						Salvar
					</button>
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Sub-tela: Início (avisos + calendário)
// ---------------------------------------------------------------------------

function InicioView({
	turma,
	avisos,
	setAvisos,
	eventos,
}: {
	turma: DadosTurma;
	avisos: Aviso[];
	setAvisos: React.Dispatch<React.SetStateAction<Aviso[]>>;
	eventos: EventoCalendario[];
}) {
	const [criandoAviso, setCriandoAviso] = useState(false);
	const [novoAviso, setNovoAviso] = useState("");

	const adicionarAviso = () => {
		const texto = novoAviso.trim();
		if (!texto) return;
		const novo: Aviso = {
			id: Date.now().toString(),
			autor: turma.professores[0] ?? "Você",
			fixado: false,
			texto,
			quando: "Agora",
		};
		setAvisos((prev) => [novo, ...prev]);
		setNovoAviso("");
		setCriandoAviso(false);
	};

	const toggleFixar = (id: string) =>
		setAvisos((prev) =>
			prev.map((a) => (a.id === id ? { ...a, fixado: !a.fixado } : a)),
		);

	const excluirAviso = (id: string) =>
		setAvisos((prev) => prev.filter((a) => a.id !== id));

	// Organiza: fixados primeiro
	const avisosOrdenados = [...avisos].sort((a, b) =>
		a.fixado === b.fixado ? 0 : a.fixado ? -1 : 1,
	);

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
			{/* Card info */}
			<div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
				<div className="flex items-center gap-2 mb-3">
					<div
						className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
						style={{ backgroundColor: turma.cor }}
					>
						{turma.professores
							.map((p) => p[0])
							.join("")
							.slice(0, 2)}
					</div>
					<p className="text-sm font-medium text-gray-700">
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

			{/* Avisos */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-gray-700">Avisos</h3>
					<button
						onClick={() => setCriandoAviso((v) => !v)}
						className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
					>
						{criandoAviso ? (
							<X className="w-3.5 h-3.5" />
						) : (
							<Plus className="w-3.5 h-3.5" />
						)}
						{criandoAviso ? "Cancelar" : "Novo aviso"}
					</button>
				</div>

				{/* Input novo aviso */}
				{criandoAviso && (
					<div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 p-3 mb-3 shadow-xs">
						<input
							autoFocus
							value={novoAviso}
							onChange={(e) => setNovoAviso(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && adicionarAviso()}
							placeholder="Escreva um aviso para a turma..."
							className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
						<button
							onClick={adicionarAviso}
							className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors flex-shrink-0"
						>
							<Check className="w-4 h-4" />
							Publicar
						</button>
					</div>
				)}

				<div className="space-y-3">
					{avisosOrdenados.map((aviso) => (
						<div
							key={aviso.id}
							className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 group shadow-xs"
						>
							<div className="flex items-start justify-between gap-2 mb-2">
								<div className="flex items-center gap-2">
									<div
										className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
										style={{ backgroundColor: turma.cor }}
									>
										{aviso.autor[0]}
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900">
											{aviso.autor}
										</p>
										<p className="text-[11px] text-gray-400">{aviso.quando}</p>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<button
										onClick={() => toggleFixar(aviso.id)}
										className={`p-1 rounded-full transition-colors ${aviso.fixado ? "text-amber-500" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-500"}`}
										title={aviso.fixado ? "Desafixar" : "Fixar"}
									>
										<Pin className="w-3.5 h-3.5" />
									</button>
									<button
										onClick={() => excluirAviso(aviso.id)}
										className="p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors"
										title="Excluir"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</button>
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								{aviso.texto}
							</p>
						</div>
					))}
					{avisos.length === 0 && (
						<p className="text-center py-8 text-sm text-gray-400">
							Nenhum aviso publicado ainda
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Sub-tela: Materiais
// ---------------------------------------------------------------------------

function MateriaisView({
	materiais,
	setMateriais,
	cor,
}: {
	materiais: Material[];
	setMateriais: React.Dispatch<React.SetStateAction<Material[]>>;
	cor: string;
}) {
	const [criando, setCriando] = useState(false);
	const [nome, setNome] = useState("");
	const [url, setUrl] = useState("");

	const adicionar = () => {
		const titulo = nome.trim();
		const link = url.trim();
		if (!titulo || !link) return;
		const hoje = new Date();
		const novo: Material = {
			id: Date.now().toString(),
			nome: titulo,
			url: link,
			quando: `${pad(hoje.getDate())}/${pad(hoje.getMonth() + 1)}`,
		};
		setMateriais((prev) => [novo, ...prev]);
		setNome("");
		setUrl("");
		setCriando(false);
	};

	const excluir = (id: string) =>
		setMateriais((prev) => prev.filter((m) => m.id !== id));

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3">
			<div className="flex items-center justify-between mb-1">
				<h3 className="text-sm font-semibold text-gray-700">
					Materiais da turma
				</h3>
				<button
					onClick={() => setCriando((v) => !v)}
					className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
				>
					{criando ? (
						<X className="w-3.5 h-3.5" />
					) : (
						<Plus className="w-3.5 h-3.5" />
					)}
					{criando ? "Cancelar" : "Adicionar"}
				</button>
			</div>

			{/* Input novo material */}
			{criando && (
				<div className="flex flex-col gap-2 bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
					<input
						autoFocus
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						placeholder="Título do material"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					<input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && adicionar()}
						placeholder="URL do link (ex: https://...)"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					<button
						onClick={adicionar}
						className="w-full flex justify-center items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
					>
						<Check className="w-4 h-4" />
						Salvar
					</button>
				</div>
			)}

			{materiais.map((m) => (
				<div
					key={m.id}
					className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 hover:border-gray-300 hover:shadow-xs transition-all group"
				>
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
						style={{ backgroundColor: `${cor}1A` }}
					>
						<Link2 className="w-5 h-5" style={{ color: cor }} />
					</div>
					<div className="flex-1 min-w-0">
						<a
							href={m.url}
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-medium text-blue-600 hover:underline truncate block"
						>
							{m.nome}
						</a>
						<p className="text-xs text-gray-400 truncate mt-0.5">{m.url}</p>
					</div>
					<button
						onClick={() => excluir(m.id)}
						className="p-1.5 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 hover:bg-red-50 flex-shrink-0 transition-all"
						title="Remover"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			))}
			{materiais.length === 0 && (
				<p className="text-center py-12 text-sm text-gray-400">
					Nenhum material adicionado ainda
				</p>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Sub-tela: Anotações
// ---------------------------------------------------------------------------

function AnotacoesView({
	anotacoes,
	setAnotacoes,
	cor,
}: {
	anotacoes: Anotacao[];
	setAnotacoes: React.Dispatch<React.SetStateAction<Anotacao[]>>;
	cor: string;
}) {
	const [criando, setCriando] = useState(false);
	const [titulo, setTitulo] = useState("");
	const [conteudo, setConteudo] = useState("");
	const [expandido, setExpandido] = useState<string | null>(null);

	const adicionar = () => {
		const t = titulo.trim();
		if (!t) return;
		const hoje = new Date();
		const nova: Anotacao = {
			id: Date.now().toString(),
			titulo: t,
			data: `${pad(hoje.getDate())}/${pad(hoje.getMonth() + 1)}`,
			conteudo: conteudo.trim(),
		};
		setAnotacoes((prev) => [nova, ...prev]);
		setTitulo("");
		setConteudo("");
		setCriando(false);
	};

	const excluir = (id: string) => {
		setAnotacoes((prev) => prev.filter((a) => a.id !== id));
		if (expandido === id) setExpandido(null);
	};

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-3">
			<div className="flex items-center justify-between mb-1">
				<h3 className="text-sm font-semibold text-gray-700">
					Minhas anotações
				</h3>
				<button
					onClick={() => setCriando((v) => !v)}
					className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
				>
					{criando ? (
						<X className="w-3.5 h-3.5" />
					) : (
						<Plus className="w-3.5 h-3.5" />
					)}
					{criando ? "Cancelar" : "Nova nota"}
				</button>
			</div>

			{/* Input nova nota */}
			{criando && (
				<div className="bg-white rounded-2xl border border-gray-200 p-3.5 space-y-2 shadow-xs">
					<input
						autoFocus
						value={titulo}
						onChange={(e) => setTitulo(e.target.value)}
						placeholder="Título da anotação"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					<textarea
						value={conteudo}
						onChange={(e) => setConteudo(e.target.value)}
						placeholder="Conteúdo (opcional)"
						rows={3}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors resize-none"
					/>
					<div className="flex justify-end">
						<button
							onClick={adicionar}
							className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
						>
							<Check className="w-4 h-4" />
							Salvar
						</button>
					</div>
				</div>
			)}

			{anotacoes.map((a) => (
				<div
					key={a.id}
					className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xs transition-all group"
				>
					<button
						onClick={() => setExpandido(expandido === a.id ? null : a.id)}
						className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left"
					>
						<div
							className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
							style={{ backgroundColor: `${cor}1A` }}
						>
							<NotebookPen className="w-5 h-5" style={{ color: cor }} />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium text-gray-900 truncate">
								{a.titulo}
							</p>
							<p className="text-xs text-gray-400">{a.data}</p>
						</div>
					</button>

					{/* Conteúdo expandido */}
					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
							expandido === a.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
						}`}
					>
						<div className="overflow-hidden">
							<div className="px-4 pb-4 pt-1">
								<p className="text-sm text-gray-600 leading-relaxed mb-3">
									{a.conteudo || "Sem conteúdo adicional."}
								</p>
								<button
									onClick={() => excluir(a.id)}
									className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
								>
									<Trash2 className="w-3 h-3" />
									Excluir nota
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
			{anotacoes.length === 0 && (
				<p className="text-center py-12 text-sm text-gray-400">
					Nenhuma anotação criada ainda
				</p>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Sub-tela: Presença (alunos ou monitores)
// ---------------------------------------------------------------------------

function PresencaView({
	titulo,
	pessoas,
	setPessoas,
	cor,
	eventos,
	onSalvar,
}: {
	titulo: string;
	pessoas: Pessoa[];
	setPessoas: React.Dispatch<React.SetStateAction<Pessoa[]>>;
	cor: string;
	eventos: EventoCalendario[];
	onSalvar: (data: string) => void;
}) {
	const presentes = pessoas.filter((p) => p.presente === "presente").length;
	const hoje = new Date();
	const hojeISO = toISO(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
	const dataFormatada = `${pad(hoje.getDate())}/${pad(hoje.getMonth() + 1)}/${hoje.getFullYear()}`;
	const [dataSelecionada, setDataSelecionada] = useState(hojeISO);

	const setPresenca = (id: string, valor: EstadoPresenca) =>
		setPessoas((prev) =>
			prev.map((p) => (p.id === id ? { ...p, presente: valor } : p)),
		);

	const marcarTodos = (valor: EstadoPresenca) =>
		setPessoas((prev) => prev.map((p) => ({ ...p, presente: valor })));

	const diasDeAula = eventos
		.filter((e) => e.tipo === "aula" || e.tipo === "especial")
		.sort((a, b) => a.data.localeCompare(b.data));

	return (
		<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
				<div className="flex flex-col gap-1.5">
					<h3 className="text-sm font-semibold text-gray-700">{titulo}</h3>
					<div className="flex items-center gap-1.5">
						<CalendarDays className="w-3.5 h-3.5 text-gray-400" />
						<select
							value={dataSelecionada}
							onChange={(e) => setDataSelecionada(e.target.value)}
							className="text-xs bg-gray-50 border border-gray-200 rounded-md py-1.5 px-2.5 text-gray-700 focus:outline-none focus:border-sky-300 transition-colors cursor-pointer"
						>
							<option value={hojeISO}>Hoje ({dataFormatada})</option>
							{diasDeAula.map((aula) => (
								<option key={aula.id} value={aula.data}>
									{aula.data.split("-").reverse().join("/")} - {aula.titulo}
								</option>
							))}
						</select>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span
						className="text-xs font-semibold px-3 py-1 rounded-full shadow-2xs"
						style={{ backgroundColor: `${cor}1A`, color: cor }}
					>
						{presentes}/{pessoas.length} presentes
					</span>
					<button onClick={() => onSalvar(dataSelecionada)} className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"><Check className="h-3.5 w-3.5" />Salvar presenças</button>
				</div>
			</div>

			{/* Ações rápidas */}
			<div className="flex items-center gap-2">
				<button
					onClick={() => marcarTodos("presente")}
					className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
				>
					<Check className="w-3 h-3" />
					Todos presentes
				</button>
				<button
					onClick={() => marcarTodos("ausente")}
					className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
				>
					<X className="w-3 h-3" />
					Todos ausentes
				</button>
			</div>

			<div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden shadow-xs">
				{pessoas.map((p) => (
					<div
						key={p.id}
						className="flex items-center gap-3 px-4 py-3 sm:py-3.5 hover:bg-gray-50/50 transition-colors"
					>
						<div
							className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
							style={{ backgroundColor: cor }}
						>
							{p.nome[0]}
						</div>
						<span className="flex-1 text-sm text-gray-800 truncate font-medium">
							{p.nome}
						</span>
						<select
							value={p.presente}
							onChange={(e) =>
								setPresenca(p.id, e.target.value as EstadoPresenca)
							}
							className={`text-xs font-medium rounded-lg px-2.5 py-1.5 border outline-none transition-colors cursor-pointer text-center ${
								p.presente === "presente"
									? "bg-green-50 text-green-700 border-green-200"
									: p.presente === "ausente"
										? "bg-red-50 text-red-700 border-red-200"
								: p.presente === "a_registrar" ? "bg-slate-100 text-slate-600 border-slate-200" : "bg-amber-50 text-amber-700 border-amber-200"
							}`}
						>
							<option value="presente">Presente</option>
							<option value="ausente">Ausente</option>
							<option value="justificado">Justificado</option>
							<option value="a_registrar">A registrar</option>
						</select>
					</div>
				))}
				{pessoas.length === 0 && (
					<p className="text-center py-10 text-sm text-gray-400">
						Nenhuma pessoa cadastrada
					</p>
				)}
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Bottom nav
// ---------------------------------------------------------------------------

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
	{ id: "inicio", label: "Início", icon: Home },
	{ id: "materiais", label: "Materiais", icon: FolderOpen },
	{ id: "anotacoes", label: "Notas", icon: NotebookPen },
	{ id: "calendario", label: "Calendário", icon: CalendarDays },
	{ id: "presenca-alunos", label: "Alunos", icon: ClipboardList },
	{ id: "presenca-monitores", label: "Monitores", icon: ShieldCheck },
	{ id: "presenca-professores", label: "Professores", icon: GraduationCap },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function TurmaView() {
	const params = useParams<{ id: string }>();
	const turmaId = Array.isArray(params.id) ? params.id[0] : params.id;
	const { data: detalhe, isLoading: carregandoTurma } = api.turma.detalhe.useQuery({ id: turmaId }, { enabled: Boolean(turmaId) });
	const salvarPresencas = api.turma.presencas.salvar.useMutation({ onError: (erro) => alert(`Não foi possível salvar as presenças: ${erro.message}`) });
	const [tab, setTab] = useState<TabId>("inicio");
	const [turma, setTurma] = useState<DadosTurma>(TURMA_VAZIA);
	const [avisos, setAvisos] = useState<Aviso[]>([]);
	const [materiais, setMateriais] = useState<Material[]>([]);
	const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
	const [eventos, setEventos] = useState<EventoCalendario[]>([]);
	const [editando, setEditando] = useState(false);

	// Constroi lista de presença a partir dos nomes da turma
	const [presencaAlunos, setPresencaAlunos] = useState<Pessoa[]>(
		turma.alunos.map((nome, i) => ({
			id: `aluno-${i}`,
			nome,
			presente: "presente",
		})),
	);
	const [presencaMonitores, setPresencaMonitores] = useState<Pessoa[]>(
		turma.monitores.map((nome, i) => ({
			id: `monitor-${i}`,
			nome,
			presente: "presente",
		})),
	);
	const [presencaProfessores, setPresencaProfessores] = useState<Pessoa[]>(
		turma.professores.map((nome, i) => ({ id: `professor-${i}`, nome, presente: "presente" })),
	);
	const salvarNaData = (data: string) => {
		const todas = [...presencaAlunos, ...presencaMonitores, ...presencaProfessores];
		if (todas.some((pessoa) => pessoa.presente === "a_registrar")) return alert("Defina a presença de todas as pessoas antes de salvar.");
		const estado = (pessoa: Pessoa) => pessoa.presente.toUpperCase() as "PRESENTE" | "AUSENTE" | "JUSTIFICADO";
		salvarPresencas.mutate({ turmaId, data: new Date(`${data}T12:00:00`), alunos: presencaAlunos.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })), monitores: presencaMonitores.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })), professores: presencaProfessores.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })) });
	};

	useEffect(() => {
		const dados = detalhe?.turma;
		if (!dados) return;
		setTurma({ nome: dados.titulo, sala: dados.sala ?? "Local a definir", horario: dados.horario ?? "Horário a definir", cor: dados.cor, professores: dados.professores.map((item) => item.user.nome), monitores: dados.monitores.map((item) => item.user.nome), alunos: dados.alunos.map((item) => item.aluno.nome) });
		setAvisos(dados.avisos.map((item) => ({ id: item.id, autor: item.autor.nome, fixado: item.fixado, texto: item.texto, quando: item.createdAt.toLocaleDateString("pt-BR") })));
		setMateriais(dados.materiais.map((item) => ({ id: item.id, nome: item.titulo, url: item.url, quando: item.createdAt.toLocaleDateString("pt-BR") })));
		setAnotacoes((dados.anotacoes ?? []).map((item) => ({ id: item.id, titulo: item.titulo, conteudo: item.conteudo, data: item.createdAt.toLocaleDateString("pt-BR") })));
		setEventos(dados.eventos.map((item) => ({ id: item.id, titulo: item.titulo, data: item.data.toISOString().slice(0, 10), tipo: item.tipo.toLowerCase() as TipoEvento })));
		setPresencaAlunos(dados.alunos.map((item) => ({ id: item.aluno.id, nome: item.aluno.nome, presente: "presente" })));
		setPresencaMonitores(dados.monitores.map((item) => ({ id: item.user.id, nome: item.user.nome, presente: "presente" })));
		setPresencaProfessores(dados.professores.map((item) => ({ id: item.user.id, nome: item.user.nome, presente: "presente" })));
	}, [detalhe]);

	// Atualiza presença quando turma muda (editor)
	const salvarTurma = (novaTurma: DadosTurma) => {
		setTurma(novaTurma);
		setPresencaAlunos(
			novaTurma.alunos.map((nome, i) => ({
				id: `aluno-${i}`,
				nome,
				presente:
					presencaAlunos.find((p) => p.nome === nome)?.presente ?? "presente",
			})),
		);
		setPresencaMonitores(
			novaTurma.monitores.map((nome, i) => ({
				id: `monitor-${i}`,
				nome,
				presente:
					presencaMonitores.find((p) => p.nome === nome)?.presente ??
					"presente",
			})),
		);
		setPresencaProfessores(
			novaTurma.professores.map((nome, i) => ({
				id: `professor-${i}`,
				nome,
				presente: presencaProfessores.find((p) => p.nome === nome)?.presente ?? "presente",
			})),
		);
		setEditando(false);
	};

	// Menu do header
	const [menuAberto, setMenuAberto] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!menuAberto) return;
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setMenuAberto(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [menuAberto]);

	if (carregandoTurma) {
		return <div className="flex h-full min-h-0 flex-col animate-pulse bg-slate-50"><div className="h-40 shrink-0 bg-sky-200" /><div className="flex-1 space-y-5 p-6"><div className="h-7 w-48 rounded-lg bg-slate-200" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="h-44 rounded-2xl bg-white" /><div className="h-44 rounded-2xl bg-white" /></div><div className="h-36 rounded-2xl bg-white" /></div><div className="h-16 shrink-0 border-t border-sky-100 bg-white" /></div>;
	}

	if (!detalhe) {
		return <div className="grid h-full place-items-center bg-slate-50 p-6 text-center"><div><AlertTriangle className="mx-auto h-8 w-8 text-orange-500" /><h1 className="mt-3 font-bold text-slate-800">Turma indisponível</h1><p className="mt-1 text-sm text-slate-500">Não foi possível carregar esta turma ou você não possui acesso a ela.</p></div></div>;
	}

	return (
		<div className="flex h-full min-h-0 min-w-0 flex-col overflow-x-clip text-slate-900 bg-[radial-gradient(circle_at_96%_2%,rgba(14,165,233,.12),transparent_24rem),#f8fafc]">
			{/* Header da turma */}
			<div
				className="relative flex-shrink-0 overflow-hidden bg-sky-600 px-4 pb-6 pt-6 shadow-[0_18px_35px_rgba(2,132,199,.2)] sm:px-6 lg:px-8"
			>
				<div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-orange-500" />
				<div className="absolute right-10 -top-8 w-20 h-20 rounded-full border-[11px] border-sky-200/80" />

				<div className="w-full max-w-6xl mx-auto relative">
					<div className="flex items-center justify-between mb-4">
						<div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
							<BookOpen className="w-4.5 h-4.5 text-white" />
						</div>
						<div ref={menuRef} className="relative">
							<button
								onClick={() => setMenuAberto((v) => !v)}
							className="rounded-xl p-2 text-white/80 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
							>
								<MoreVertical className="w-4 h-4" />
							</button>
							{menuAberto && (
								<div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<button
										onClick={() => {
											setEditando(true);
											setMenuAberto(false);
										}}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
									>
										<Pencil className="w-4 h-4" />
										Editar turma
									</button>
									<button
										onClick={() => setMenuAberto(false)}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
									>
										<Settings2 className="w-4 h-4" />
										Configurações
									</button>
								</div>
							)}
						</div>
					</div>

					<h1 className="text-xl sm:text-3xl font-black tracking-[-.035em] text-white leading-snug mb-1">
						{turma.nome}
					</h1>
					<p className="text-xs sm:text-sm text-white/85">
						{turma.sala} · {turma.professores.join(" e ")}
					</p>
				</div>
			</div>

			{/* Conteúdo */}
			<div className="min-h-0 flex-1 overflow-y-auto">
				{tab === "inicio" && (
					<InicioView turma={turma} avisos={avisos} setAvisos={setAvisos} eventos={eventos} />
				)}
				{tab === "materiais" && (
					<MateriaisView
						materiais={materiais}
						setMateriais={setMateriais}
						cor={turma.cor}
					/>
				)}
				{tab === "anotacoes" && (
					<AnotacoesView
						anotacoes={anotacoes}
						setAnotacoes={setAnotacoes}
						cor={turma.cor}
					/>
				)}
				{tab === "calendario" && (
					<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
						<div className="mb-4">
							<h3 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
								<CalendarDays className="w-5 h-5" style={{ color: turma.cor }} />
								Calendário de aulas e eventos
							</h3>
							<p className="text-xs sm:text-sm text-gray-500 mt-0.5">
								Acompanhe o cronograma de aulas, reposições e feriados do semestre.
							</p>
						</div>
						<CalendarioAulas eventos={eventos} cor={turma.cor} />
					</div>
				)}
				{tab === "presenca-alunos" && (
					<PresencaView
						titulo="Presença de alunos"
						pessoas={presencaAlunos}
						setPessoas={setPresencaAlunos}
						cor={turma.cor}
						eventos={eventos}
						onSalvar={salvarNaData}
					/>
				)}
				{tab === "presenca-monitores" && (
					<PresencaView
						titulo="Presença de monitores"
						pessoas={presencaMonitores}
						setPessoas={setPresencaMonitores}
						cor="#188038"
						eventos={eventos}
						onSalvar={salvarNaData}
					/>
				)}
				{tab === "presenca-professores" && (
					<PresencaView
						titulo="Presença de professores"
						pessoas={presencaProfessores}
						setPessoas={setPresencaProfessores}
						cor="#0284c7"
						eventos={eventos}
						onSalvar={salvarNaData}
					/>
				)}
			</div>

			{/* Bottom nav */}
			<nav className="flex-shrink-0 flex items-stretch border-t border-sky-100 bg-white shadow-[0_-8px_24px_rgba(15,23,42,.05)]">
				<div className="flex w-full max-w-6xl mx-auto items-stretch overflow-x-auto">
					{TABS.map((t) => {
						const Icon = t.icon;
						const active = tab === t.id;
						return (
							<button
								key={t.id}
								onClick={() => setTab(t.id)}
							className="flex min-w-20 flex-1 flex-col items-center justify-center gap-1 py-2.5 sm:py-3 relative transition-colors cursor-pointer"
							>
								{active && (
									<span
										className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-0.5 rounded-full"
										style={{ backgroundColor: "#f97316" }}
									/>
								)}
								<Icon
									className={`w-5 h-5 transition-colors ${active ? "" : "text-gray-400"}`}
									style={active ? { color: "#0284c7" } : undefined}
								/>
								<span
									className={`text-[10px] sm:text-xs transition-colors ${active ? "font-semibold" : "text-gray-400"}`}
									style={active ? { color: "#0284c7" } : undefined}
								>
									{t.label}
								</span>
							</button>
						);
					})}
				</div>
			</nav>

			{/* Modal de edição */}
			{editando && (
				<EditarTurmaModal
					turma={turma}
					onSalvar={salvarTurma}
					onFechar={() => setEditando(false)}
				/>
			)}
		</div>
	);
}
