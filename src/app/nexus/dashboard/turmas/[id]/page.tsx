"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";
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

const UploadButton = generateUploadButton<OurFileRouter>();

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
	imagemUrl: string | null;
	linkUrl: string | null;
	quando: string;
	podeExcluir: boolean;
	podeFixar: boolean;
	podeEditar: boolean;
}

interface Anotacao {
	id: string;
	titulo: string;
	data: string;
	conteudo: string;
}

type EstadoPresenca = "presente" | "ausente" | "justificado" | "a_registrar";

const PRESENCA_CONFIG: Record<
	EstadoPresenca,
	{ label: string; curta: string; cor: string; fundo: string; icone: React.ElementType }
> = {
	presente: { label: "Presente", curta: "Presentes", cor: "#15803d", fundo: "#dcfce7", icone: Check },
	ausente: { label: "Ausente", curta: "Ausentes", cor: "#dc2626", fundo: "#fee2e2", icone: X },
	justificado: { label: "Justificado", curta: "Justificados", cor: "#b45309", fundo: "#fef3c7", icone: FileText },
	a_registrar: { label: "Não marcado", curta: "Em aberto", cor: "#64748b", fundo: "#e2e8f0", icone: Ban },
};

interface Pessoa {
	id: string;
	nome: string;
	presente: EstadoPresenca;
}

interface ConfirmacaoPresenca {
	data: string;
	total: number;
}

interface DadosTurma {
	nome: string;
	sala: string;
	horario: string;
	professores: string[];
	monitores: string[];
	alunos: string[];
	cor: string;
	corDestaque?: string;
	corFundo?: string;
	corTexto?: string;
	corTitulo?: string;
	corDescricao?: string;
	fonte?: "SANS" | "SERIF" | "MONO";
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

function hexParaRgb(cor: string) {
	const hex = cor.replace("#", "").trim();
	const valor = hex.length === 3 ? hex.split("").map((item) => item + item).join("") : hex;
	if (!/^[0-9a-f]{6}$/i.test(valor)) return null;
	return {
		r: Number.parseInt(valor.slice(0, 2), 16),
		g: Number.parseInt(valor.slice(2, 4), 16),
		b: Number.parseInt(valor.slice(4, 6), 16),
	};
}

function luminancia(cor: string) {
	const rgb = hexParaRgb(cor);
	if (!rgb) return 0;
	const canal = (valor: number) => {
		const normalizado = valor / 255;
		return normalizado <= 0.04045 ? normalizado / 12.92 : ((normalizado + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * canal(rgb.r) + 0.7152 * canal(rgb.g) + 0.0722 * canal(rgb.b);
}

function contraste(corA: string, corB: string) {
	const luminosidadeA = luminancia(corA);
	const luminosidadeB = luminancia(corB);
	const maisClara = Math.max(luminosidadeA, luminosidadeB);
	const maisEscura = Math.min(luminosidadeA, luminosidadeB);
	return (maisClara + 0.05) / (maisEscura + 0.05);
}

function misturarCores(corBase: string, corMistura: string, proporcaoMistura: number) {
	const base = hexParaRgb(corBase);
	const mistura = hexParaRgb(corMistura);
	if (!base || !mistura) return corBase;
	const canal = (nome: keyof typeof base) => Math.round(base[nome] * (1 - proporcaoMistura) + mistura[nome] * proporcaoMistura).toString(16).padStart(2, "0");
	return `#${canal("r")}${canal("g")}${canal("b")}`;
}

function corLegivel(corPreferida: string, fundo: string, minimo = 4.5) {
	if (contraste(corPreferida, fundo) >= minimo) return corPreferida;
	return luminancia(fundo) > 0.35 ? "#0f172a" : "#f8fafc";
}

function corDeAcaoLegivel(corPreferida: string, temaEscuro: boolean, superficie: string) {
	const brilho = luminancia(corPreferida);
	if (temaEscuro && brilho > 0.84) return "#38bdf8";
	if (temaEscuro && brilho < 0.16) return misturarCores(corPreferida, "#7dd3fc", 0.72);
	if (!temaEscuro && brilho > 0.88) return "#0369a1";
	if (!temaEscuro && brilho < 0.08) return "#0369a1";
	return contraste(corPreferida, superficie) >= 3
		? corPreferida
		: misturarCores(corPreferida, temaEscuro ? "#7dd3fc" : "#0369a1", 0.58);
}

function useTemaEscuro() {
	const [escuro, setEscuro] = useState(false);

	useEffect(() => {
		const html = document.documentElement;
		const atualizar = () => setEscuro(html.dataset.theme === "dark");
		atualizar();
		const observador = new MutationObserver(atualizar);
		observador.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
		return () => observador.disconnect();
	}, []);

	return escuro;
}

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
				{values.map((v, index) => (
					<span
						key={`${v}-${index}`}
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
		<div className="grid w-full min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-12">
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
	const [rascunho, setRascunho] = useState<DadosTurma>({ ...turma, corDestaque: turma.corDestaque ?? "#ea580c", corFundo: turma.corFundo ?? "#f8fafc", corTexto: turma.corTexto ?? "#0f172a", corTitulo: turma.corTitulo ?? "#ffffff", corDescricao: turma.corDescricao ?? "#64748b", fonte: turma.fonte ?? "SANS" });

	const salvar = () => {
		if (!rascunho.nome.trim()) return;
		onSalvar(rascunho);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={onFechar}
			/>

			<div className="relative z-10 flex max-h-[96dvh] w-full max-w-2xl min-w-0 flex-col rounded-t-3xl border border-gray-100 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
				{/* Header */}
				<div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
					<h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
						<Settings2 className="w-5 h-5 text-sky-600" />
						Editar turma
					</h3>
					<button
						onClick={onFechar}
						className="grid min-h-11 min-w-11 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<div className="min-w-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
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
					<div className="rounded-xl border border-sky-100 bg-sky-50 p-3"><p className="text-sm font-bold text-sky-900">Personalização da turma</p><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3"><label className="text-xs font-bold text-slate-700">Principal<input type="color" value={rascunho.cor} onChange={(e) => setRascunho({ ...rascunho, cor: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Destaque<input type="color" value={rascunho.corDestaque} onChange={(e) => setRascunho({ ...rascunho, corDestaque: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Fundo<input type="color" value={rascunho.corFundo} onChange={(e) => setRascunho({ ...rascunho, corFundo: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Texto<input type="color" value={rascunho.corTexto} onChange={(e) => setRascunho({ ...rascunho, corTexto: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Título do banner<input type="color" value={rascunho.corTitulo} onChange={(e) => setRascunho({ ...rascunho, corTitulo: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Descrição<input type="color" value={rascunho.corDescricao} onChange={(e) => setRascunho({ ...rascunho, corDescricao: e.target.value })} className="mt-1 h-10 w-full" /></label><label className="text-xs font-bold text-slate-700">Fonte<select value={rascunho.fonte} onChange={(e) => setRascunho({ ...rascunho, fonte: e.target.value as DadosTurma['fonte'] })} className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-2"><option value="SANS">Sem serifa</option><option value="SERIF">Com serifa</option><option value="MONO">Monoespaçada</option></select></label></div></div>

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
				<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:rounded-b-3xl sm:px-5">
					<button
						onClick={onFechar}
						className="min-h-11 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
					>
						Cancelar
					</button>
					<button
						onClick={salvar}
						disabled={!rascunho.nome.trim()}
						className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
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
	turmaId,
	avisos,
	eventos,
}: {
	turma: DadosTurma;
	turmaId: string;
	avisos: Aviso[];
	eventos: EventoCalendario[];
}) {
	const [criandoAviso, setCriandoAviso] = useState(false);
	const [novoAviso, setNovoAviso] = useState("");
	const [imagemAviso, setImagemAviso] = useState<string | null>(null);
	const [linkAviso, setLinkAviso] = useState("");
	const [editandoAviso, setEditandoAviso] = useState<Aviso | null>(null);
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarAviso = api.turma.avisos.create.useMutation({
		onSuccess: () => {
			setNovoAviso("");
			setImagemAviso(null);
			setLinkAviso("");
			setCriandoAviso(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const fixarAviso = api.turma.avisos.setFixado.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});
	const atualizarAviso = api.turma.avisos.update.useMutation({
		onSuccess: () => {
			setNovoAviso(""); setImagemAviso(null); setLinkAviso(""); setCriandoAviso(false); setEditandoAviso(null); setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerAviso = api.turma.avisos.remove.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});

	const adicionarAviso = () => {
		const texto = novoAviso.trim();
		if (!texto && !imagemAviso && !linkAviso.trim()) return;
		setErro(null);
		if (editandoAviso) atualizarAviso.mutate({ turmaId, id: editandoAviso.id, texto, imagemUrl: imagemAviso, linkUrl: linkAviso.trim() || null });
		else criarAviso.mutate({ turmaId, texto, imagemUrl: imagemAviso, linkUrl: linkAviso.trim() || null });
	};
	const iniciarEdicao = (aviso: Aviso) => { setEditandoAviso(aviso); setNovoAviso(aviso.texto); setImagemAviso(aviso.imagemUrl); setLinkAviso(aviso.linkUrl ?? ""); setCriandoAviso(true); setErro(null); };
	const cancelarEdicao = () => { setCriandoAviso(false); setEditandoAviso(null); setNovoAviso(""); setImagemAviso(null); setLinkAviso(""); };

	const toggleFixar = (aviso: Aviso) => {
		setErro(null);
		fixarAviso.mutate({ turmaId, id: aviso.id, fixado: !aviso.fixado });
	};

	const excluirAviso = (id: string) => {
		setErro(null);
		removerAviso.mutate({ turmaId, id });
	};

	// Organiza: fixados primeiro
	const avisosOrdenados = [...avisos].sort((a, b) =>
		a.fixado === b.fixado ? 0 : a.fixado ? -1 : 1,
	);

	return (
		<div className="mx-auto w-full max-w-6xl min-w-0 space-y-5 px-3 py-5 sm:px-6 lg:px-8">
			{/* Card info */}
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

			{/* Avisos */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-gray-700">Avisos</h3>
					<button
						onClick={() => criandoAviso ? cancelarEdicao() : setCriandoAviso(true)}
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
					<div className="mb-3 flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs">
						<input
							autoFocus
							value={novoAviso}
							onChange={(e) => setNovoAviso(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && adicionarAviso()}
							placeholder="Escreva um aviso para a turma..."
							className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
						<input value={linkAviso} onChange={(e) => setLinkAviso(e.target.value)} placeholder="https://... (link opcional)" type="url" className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm" />
						<div className="flex flex-wrap items-center gap-3">
							<UploadButton
								endpoint="avisoImagem"
								onClientUploadComplete={(arquivos) => { setImagemAviso(arquivos[0]?.ufsUrl ?? null); setErro(null); }}
								onUploadError={(causa) => setErro(`Não foi possível enviar a imagem: ${causa.message}`)}
								appearance={{ button: "min-h-11 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50", allowedContent: "hidden" }}
								content={{ button: imagemAviso ? "Trocar imagem" : "Adicionar imagem" }}
							/>
							{imagemAviso && <div className="flex min-w-0 items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 p-2"><img src={imagemAviso} alt="Miniatura da imagem selecionada" className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain" /><span className="min-w-0 flex-1 truncate text-xs font-semibold text-sky-800">Imagem pronta para publicar</span><button type="button" onClick={() => setImagemAviso(null)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sky-700 hover:bg-sky-100" aria-label="Remover imagem selecionada"><X className="h-4 w-4" /></button></div>}
							<button
								onClick={adicionarAviso}
								disabled={(!novoAviso.trim() && !imagemAviso && !linkAviso.trim()) || criarAviso.isPending}
								className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Check className="w-4 h-4" />
								{criarAviso.isPending || atualizarAviso.isPending ? "Salvando..." : editandoAviso ? "Salvar alterações" : "Publicar"}
							</button>
						</div>
					</div>
				)}
				{erro && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

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
									{aviso.podeEditar && <button onClick={() => iniciarEdicao(aviso)} className="p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-sky-600 transition-colors" title="Editar aviso"><Pencil className="w-3.5 h-3.5" /></button>}
									{aviso.podeFixar && <button
										onClick={() => toggleFixar(aviso)}
										disabled={fixarAviso.isPending}
										className={`p-1 rounded-full transition-colors ${aviso.fixado ? "text-amber-500" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-500"}`}
										title={aviso.fixado ? "Desafixar" : "Fixar"}
									>
										<Pin className="w-3.5 h-3.5" />
									</button>}
									{aviso.podeExcluir && <button
										onClick={() => excluirAviso(aviso.id)}
										disabled={removerAviso.isPending}
										className="p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors"
										title="Excluir"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</button>}
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								{aviso.texto}
							</p>
							{aviso.imagemUrl && <img src={aviso.imagemUrl} alt={`Imagem do aviso de ${aviso.autor}`} className="mt-3 max-h-72 w-full rounded-xl bg-slate-100 object-contain" />}
							{aviso.linkUrl && <a href={aviso.linkUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-sky-50 px-3 text-sm font-bold text-sky-700 hover:bg-sky-100">Abrir link</a>}
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
	turmaId,
	cor,
	podeGerenciar,
}: {
	materiais: Material[];
	turmaId: string;
	cor: string;
	podeGerenciar: boolean;
}) {
	const [criando, setCriando] = useState(false);
	const [nome, setNome] = useState("");
	const [url, setUrl] = useState("");
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarMaterial = api.turma.materiais.create.useMutation({
		onSuccess: () => {
			setNome("");
			setUrl("");
			setCriando(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerMaterial = api.turma.materiais.remove.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});

	const adicionar = () => {
		const titulo = nome.trim();
		const link = url.trim();
		if (!titulo || !link) return;
		setErro(null);
		criarMaterial.mutate({ turmaId, titulo, url: link, tipo: "LINK" });
	};

	const excluir = (id: string) => {
		setErro(null);
		removerMaterial.mutate({ turmaId, id });
	};

	return (
		<div className="mx-auto w-full max-w-6xl min-w-0 space-y-3 px-3 py-5 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between mb-1">
				<h3 className="turma-semantic-text text-sm font-semibold">
					Materiais da turma
				</h3>
				{podeGerenciar && <button
					onClick={() => setCriando((v) => !v)}
					className="turma-semantic-accent flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
				>
					{criando ? (
						<X className="w-3.5 h-3.5" />
					) : (
						<Plus className="w-3.5 h-3.5" />
					)}
					{criando ? "Cancelar" : "Adicionar"}
				</button>}
			</div>

			{/* Input novo material */}
			{podeGerenciar && criando && (
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
					{podeGerenciar && <button
						onClick={adicionar}
						disabled={!nome.trim() || !url.trim() || criarMaterial.isPending}
						className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Check className="w-4 h-4" />
						{criarMaterial.isPending ? "Salvando..." : "Salvar"}
					</button>}
				</div>
			)}
			{erro && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

			{materiais.map((m) => (
				<div
					key={m.id}
					className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 transition-all hover:border-gray-300 hover:shadow-xs sm:p-4"
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
							className="turma-semantic-accent text-sm font-medium hover:underline truncate block"
						>
							{m.nome}
						</a>
						<p className="turma-semantic-description text-xs truncate mt-0.5">{m.url}</p>
					</div>
					<button
						onClick={() => excluir(m.id)}
						disabled={removerMaterial.isPending}
						className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full text-gray-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 sm:min-h-0 sm:min-w-0 sm:p-1.5 sm:text-gray-300 sm:opacity-0 sm:group-hover:opacity-100"
						title="Remover"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			))}
			{materiais.length === 0 && (
				<p className="turma-semantic-description text-center py-12 text-sm">
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
	turmaId,
	cor,
}: {
	anotacoes: Anotacao[];
	turmaId: string;
	cor: string;
}) {
	const [criando, setCriando] = useState(false);
	const [titulo, setTitulo] = useState("");
	const [conteudo, setConteudo] = useState("");
	const [expandido, setExpandido] = useState<string | null>(null);
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarAnotacao = api.turma.anotacoes.create.useMutation({
		onSuccess: () => {
			setTitulo("");
			setConteudo("");
			setCriando(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerAnotacao = api.turma.anotacoes.remove.useMutation({
		onSuccess: () => {
			setExpandido(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});

	const adicionar = () => {
		const t = titulo.trim();
		if (!t) return;
		setErro(null);
		criarAnotacao.mutate({ turmaId, titulo: t, conteudo: conteudo.trim() });
	};

	const excluir = (id: string) => {
		setErro(null);
		removerAnotacao.mutate({ turmaId, id });
	};

	return (
		<div className="mx-auto w-full max-w-6xl min-w-0 space-y-3 px-3 py-5 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between mb-1">
				<h3 className="turma-semantic-text text-sm font-semibold">
					Minhas anotações
				</h3>
				<button
					onClick={() => setCriando((v) => !v)}
					className="turma-semantic-accent flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
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
							disabled={!titulo.trim() || criarAnotacao.isPending}
							className="flex min-h-11 items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Check className="w-4 h-4" />
							{criarAnotacao.isPending ? "Salvando..." : "Salvar"}
						</button>
					</div>
				</div>
			)}
			{erro && <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}

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
							<p className="turma-semantic-text text-sm font-medium truncate">
								{a.titulo}
							</p>
							<p className="turma-semantic-description text-xs">{a.data}</p>
						</div>
					</button>

					{/* Conteúdo expandido */}
					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${expandido === a.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
							}`}
					>
						<div className="overflow-hidden">
							<div className="px-4 pb-4 pt-1">
								<p className="turma-semantic-text text-sm leading-relaxed mb-3">
									{a.conteudo || "Sem conteúdo adicional."}
								</p>
								<button
									onClick={() => excluir(a.id)}
									disabled={removerAnotacao.isPending}
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
				<p className="turma-semantic-description text-center py-12 text-sm">
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
	erroSalvar,
	salvando,
	coresEstado,
}: {
	titulo: string;
	pessoas: Pessoa[];
	setPessoas: React.Dispatch<React.SetStateAction<Pessoa[]>>;
	cor: string;
	eventos: EventoCalendario[];
	onSalvar: (data: string) => void;
	erroSalvar: string | null;
	salvando: boolean;
	coresEstado: { presente: string; ausente: string; justificado: string };
}) {
	const configuracaoPresenca = {
		...PRESENCA_CONFIG,
		presente: { ...PRESENCA_CONFIG.presente, cor: coresEstado.presente, fundo: misturarCores(coresEstado.presente, "#ffffff", 0.86) },
		ausente: { ...PRESENCA_CONFIG.ausente, cor: coresEstado.ausente, fundo: misturarCores(coresEstado.ausente, "#ffffff", 0.86) },
		justificado: { ...PRESENCA_CONFIG.justificado, cor: coresEstado.justificado, fundo: misturarCores(coresEstado.justificado, "#ffffff", 0.12) },
	};
	const totais = useMemo(
		() =>
			pessoas.reduce(
				(acumulado, pessoa) => {
					acumulado[pessoa.presente] += 1;
					return acumulado;
				},
				{ presente: 0, ausente: 0, justificado: 0, a_registrar: 0 } as Record<EstadoPresenca, number>,
			),
		[pessoas],
	);
	const corTextoAcao = corLegivel("#ffffff", cor);
	const [dataSelecionada, setDataSelecionada] = useState("");

	const setPresenca = (id: string, valor: EstadoPresenca) =>
		setPessoas((prev) =>
			prev.map((p) => (p.id === id ? { ...p, presente: valor } : p)),
		);

	const marcarTodos = (valor: EstadoPresenca) =>
		setPessoas((prev) => prev.map((p) => ({ ...p, presente: valor })));

	const diasDeAula = useMemo(
		() => eventos.filter((evento) => evento.tipo === "aula").sort((a, b) => a.data.localeCompare(b.data)),
		[eventos],
	);

	useEffect(() => {
		setDataSelecionada((dataAtual) =>
			diasDeAula.some((aula) => aula.data === dataAtual)
				? dataAtual
				: (diasDeAula.at(-1)?.data ?? ""),
		);
	}, [diasDeAula]);

	return (
		<div className="mx-auto w-full max-w-6xl min-w-0 space-y-5 px-3 py-5 sm:px-6 lg:px-8">
			<section
				className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
				style={{ "--turma-secao-cor": cor } as React.CSSProperties}
			>
				<div className="border-b border-gray-200 p-4 sm:p-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<ClipboardList className="turma-presenca-icone h-5 w-5" />
								<h3 className="turma-presenca-titulo text-base font-bold sm:text-lg">{titulo}</h3>
							</div>
							<p className="turma-semantic-description mt-1 text-sm">
								Escolha uma data de aula, marque cada pessoa e então registre.
							</p>
						</div>
						<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
							<label className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm sm:w-[18rem]">
								<CalendarDays className="turma-presenca-icone h-4 w-4 shrink-0" />
								<span className="sr-only">Dia da presença</span>
								<select
									value={dataSelecionada}
									onChange={(e) => setDataSelecionada(e.target.value)}
									disabled={diasDeAula.length === 0}
									className="turma-semantic-text min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-medium outline-none"
								>
									{diasDeAula.length === 0 && <option value="">Nenhuma aula cadastrada</option>}
									{diasDeAula.map((aula) => (
										<option key={aula.id} value={aula.data}>
											{aula.data.split("-").reverse().join("/")} · {aula.titulo}
										</option>
									))}
								</select>
							</label>
							<button
								onClick={() => onSalvar(dataSelecionada)}
								disabled={!dataSelecionada || totais.a_registrar > 0 || salvando}
								style={{ backgroundColor: cor, color: corTextoAcao }}
								className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-bold transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							>
								<Check className="h-4 w-4" />
								{salvando ? "Salvando..." : "Salvar presença"}
							</button>
						</div>
					</div>

					<div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
						{(Object.entries(configuracaoPresenca) as [EstadoPresenca, (typeof configuracaoPresenca)[EstadoPresenca]][]).map(([estado, config]) => {
							const Icone = config.icone;
							return (
								<div key={estado} className="rounded-xl border px-3 py-2.5" style={{ backgroundColor: `${cor}0D`, borderColor: `${cor}30` }}>
									<div className="flex items-center justify-between gap-2 text-xs font-semibold" style={{ color: config.cor }}>
										<span>{config.curta}</span>
										<Icone className="h-3.5 w-3.5" aria-hidden="true" />
									</div>
									<p className="mt-1 text-2xl font-bold tabular-nums leading-none" style={{ color: cor }}>{totais[estado]}</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col gap-2 border-b border-gray-200 bg-gray-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="turma-semantic-description text-xs">
						{pessoas.length} {pessoas.length === 1 ? "pessoa na lista" : "pessoas na lista"} · selecione um estado para cada uma.
					</p>
					<div className="grid grid-cols-2 gap-2 sm:flex">
						<button onClick={() => marcarTodos("presente")} className="min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95" style={{ color: configuracaoPresenca.presente.cor, backgroundColor: configuracaoPresenca.presente.fundo }}>Todos presentes</button>
						<button onClick={() => marcarTodos("ausente")} className="min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95" style={{ color: configuracaoPresenca.ausente.cor, backgroundColor: configuracaoPresenca.ausente.fundo }}>Todos ausentes</button>
						<button onClick={() => marcarTodos("a_registrar")} className="col-span-2 min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95 sm:col-span-1" style={{ color: configuracaoPresenca.a_registrar.cor, backgroundColor: configuracaoPresenca.a_registrar.fundo }}>Limpar marcações</button>
					</div>
				</div>
				{erroSalvar && <p role="alert" className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:mx-5">{erroSalvar}</p>}

				<div className="divide-y divide-gray-100">
					{pessoas.map((p) => (
						<div
							key={p.id}
							className="flex min-w-0 flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50/50 sm:px-5 lg:flex-row lg:items-center"
						>
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold" style={{ backgroundColor: cor, color: corTextoAcao }}>{p.nome[0]}</div>
								<span className="turma-semantic-text min-w-0 truncate text-sm font-semibold">{p.nome}</span>
							</div>
							<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:w-[27rem]">
							{(Object.entries(configuracaoPresenca) as [EstadoPresenca, (typeof configuracaoPresenca)[EstadoPresenca]][]).map(([estado, config]) => {
									const Icone = config.icone;
									const selecionado = p.presente === estado;
									return (
										<button
											key={estado}
											onClick={() => setPresenca(p.id, estado)}
											aria-pressed={selecionado}
											className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											style={{ color: config.cor, backgroundColor: selecionado ? config.fundo : "transparent", borderColor: selecionado ? config.cor : `${config.cor}45`, boxShadow: selecionado ? `inset 0 0 0 1px ${config.cor}` : undefined }}
										>
											<Icone className="h-3.5 w-3.5" aria-hidden="true" />
											{config.label}
										</button>
									);
								})}
							</div>
						</div>
					))}
					{pessoas.length === 0 && (
						<p className="turma-semantic-description text-center py-10 text-sm">
							Nenhuma pessoa cadastrada
						</p>
					)}
				</div>
			</section>
		</div>
	);
}

function ConfirmacaoPresencaModal({
	confirmacao,
	onFechar,
}: {
	confirmacao: ConfirmacaoPresenca;
	onFechar: () => void;
}) {
	return (
		<div className="fixed inset-0 z-[70] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirmacao-presenca-titulo">
			<button className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-[1px]" onClick={onFechar} aria-label="Fechar confirmação" />
			<div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl">
				<div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
					<Check className="h-6 w-6" aria-hidden="true" />
				</div>
				<h2 id="confirmacao-presenca-titulo" className="mt-4 text-lg font-bold text-gray-900">Presença registrada</h2>
				<p className="mt-1 text-sm text-gray-600">{confirmacao.total === 1 ? "O registro de 1 pessoa foi salvo" : `Os registros de ${confirmacao.total} pessoas foram salvos`} para {confirmacao.data}.</p>
				<button onClick={onFechar} style={{ backgroundColor: "var(--turma-destaque, #ea580c)", color: "var(--turma-destaque-text, #fff)" }} className="mt-5 min-h-11 w-full rounded-lg px-4 text-sm font-bold transition hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2">Concluir</button>
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
	const utils = api.useUtils();
	const params = useParams<{ id: string }>();
	const turmaId = Array.isArray(params.id) ? params.id[0] : params.id;
	const { data: detalhe, isLoading: carregandoTurma } = api.turma.detalhe.useQuery({ id: turmaId }, { enabled: Boolean(turmaId) });
	const [erroPresenca, setErroPresenca] = useState<string | null>(null);
	const [confirmacaoPresenca, setConfirmacaoPresenca] = useState<ConfirmacaoPresenca | null>(null);
	const salvarPresencas = api.turma.presencas.salvar.useMutation({
		onSuccess: (_resultado, variaveis) => {
			setErroPresenca(null);
			setConfirmacaoPresenca({
				data: variaveis.data.toLocaleDateString("pt-BR"),
				total: variaveis.alunos.length + variaveis.monitores.length + variaveis.professores.length,
			});
			void utils.turma.presencas.list.invalidate({ turmaId });
		},
		onError: (erro) => setErroPresenca(erro.message),
	});
	const [tab, setTab] = useState<TabId>("inicio");
	const [turma, setTurma] = useState<DadosTurma>(TURMA_VAZIA);
	const [avisos, setAvisos] = useState<Aviso[]>([]);
	const [materiais, setMateriais] = useState<Material[]>([]);
	const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
	const [eventos, setEventos] = useState<EventoCalendario[]>([]);
	const [editando, setEditando] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
		if (todas.some((pessoa) => pessoa.presente === "a_registrar")) {
			setErroPresenca("Marque a presença de todas as pessoas antes de salvar.");
			return;
		}
		setErroPresenca(null);
		const estado = (pessoa: Pessoa) => pessoa.presente.toUpperCase() as "PRESENTE" | "AUSENTE" | "JUSTIFICADO";
		salvarPresencas.mutate({ turmaId, data: new Date(`${data}T12:00:00`), alunos: presencaAlunos.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })), monitores: presencaMonitores.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })), professores: presencaProfessores.map((pessoa) => ({ id: pessoa.id, estado: estado(pessoa) })) });
	};

	useEffect(() => {
		const dados = detalhe?.turma;
		if (!dados) return;
		setTurma({ nome: dados.titulo, sala: dados.sala ?? "Local a definir", horario: dados.horario ?? "Horário a definir", cor: dados.cor, corDestaque: dados.corDestaque, corFundo: dados.corFundo, corTexto: dados.corTexto, corTitulo: dados.corTitulo, corDescricao: dados.corDescricao, fonte: dados.fonte as DadosTurma['fonte'], professores: dados.professores.map((item) => item.user.nome), monitores: dados.monitores.map((item) => item.user.nome), alunos: dados.alunos.map((item) => item.aluno.nome) });
		setAvisos(dados.avisos.map((item) => ({ id: item.id, autor: item.autor.nome, fixado: item.fixado, texto: item.texto, imagemUrl: item.imagemUrl, linkUrl: item.linkUrl, quando: item.createdAt.toLocaleDateString("pt-BR"), podeExcluir: detalhe.role !== "MONITOR" || item.autorId === detalhe.usuarioId, podeFixar: detalhe.role !== "MONITOR", podeEditar: detalhe.role === "PROFESSOR" })));
		setMateriais(dados.materiais.map((item) => ({ id: item.id, nome: item.titulo, url: item.url, quando: item.createdAt.toLocaleDateString("pt-BR") })));
		setAnotacoes((dados.anotacoes ?? []).map((item) => ({ id: item.id, titulo: item.titulo, conteudo: item.conteudo, data: item.createdAt.toLocaleDateString("pt-BR") })));
		setEventos(dados.eventos.map((item) => ({ id: item.id, titulo: item.titulo, data: item.data.toISOString().slice(0, 10), tipo: item.tipo.toLowerCase() as TipoEvento })));
		setPresencaAlunos(dados.alunos.map((item) => ({ id: item.aluno.id, nome: item.aluno.nome, presente: "presente" })));
		setPresencaMonitores(dados.monitores.map((item) => ({ id: item.user.id, nome: item.user.nome, presente: "presente" })));
		setPresencaProfessores(dados.professores.map((item) => ({ id: item.user.id, nome: item.user.nome, presente: "presente" })));
	}, [detalhe]);

	// Atualiza presença quando turma muda (editor)
	const salvarTema = api.turma.configurarTema.useMutation({ onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }) });
	const salvarTurma = (novaTurma: DadosTurma) => {
		if (detalhe?.role === "MONITOR") return;
		void salvarTema.mutateAsync({ turmaId, cor: novaTurma.cor, corDestaque: novaTurma.corDestaque ?? "#ea580c", corFundo: novaTurma.corFundo ?? "#f8fafc", corTexto: novaTurma.corTexto ?? "#0f172a", corTitulo: novaTurma.corTitulo ?? "#ffffff", corDescricao: novaTurma.corDescricao ?? "#64748b", fonte: novaTurma.fonte ?? "SANS" });
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
	const tabAtual = TABS.find((item) => item.id === tab) ?? TABS[0];
	const IconeTabAtual = tabAtual?.icon ?? Home;
	const podeEditarTurma = detalhe?.role !== "MONITOR";
	const temaEscuro = useTemaEscuro();
	const fundoTurma = temaEscuro
		? misturarCores(turma.corFundo ?? "#f8fafc", "#0b1220", 0.82)
		: (turma.corFundo ?? "#f8fafc");
	const superficieDosCards = temaEscuro ? "#162033" : "#ffffff";
	const corTextoLegivel = corLegivel(turma.corTexto ?? "#0f172a", superficieDosCards);
	const corDescricaoLegivel = corLegivel(turma.corDescricao ?? "#64748b", superficieDosCards, 3);
	const corDestaqueLegivel = corDeAcaoLegivel(turma.corDestaque ?? "#ea580c", temaEscuro, superficieDosCards);
	const corTextoDestaque = corLegivel("#ffffff", corDestaqueLegivel);
	const corTituloLegivel = corLegivel(turma.corTitulo ?? "#ffffff", turma.cor, 3);
	const corDescricaoBannerLegivel = corLegivel(turma.corDescricao ?? "#64748b", turma.cor, 3);

	if (carregandoTurma) {
		return <div className="flex h-full min-h-0 flex-col animate-pulse bg-slate-50"><div className="h-40 shrink-0 bg-sky-200" /><div className="flex-1 space-y-5 p-6"><div className="h-7 w-48 rounded-lg bg-slate-200" /><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><div className="h-44 rounded-2xl bg-white" /><div className="h-44 rounded-2xl bg-white" /></div><div className="h-36 rounded-2xl bg-white" /></div><div className="h-16 shrink-0 border-t border-sky-100 bg-white" /></div>;
	}

	if (!detalhe) {
		return <div className="grid h-full place-items-center bg-slate-50 p-6 text-center"><div><AlertTriangle className="mx-auto h-8 w-8 text-orange-500" /><h1 className="mt-3 font-bold text-slate-800">Turma indisponível</h1><p className="mt-1 text-sm text-slate-500">Não foi possível carregar esta turma ou você não possui acesso a ela.</p></div></div>;
	}

	return (
		<div className={`turma-tema flex h-full min-h-0 min-w-0 flex-col overflow-x-clip text-slate-900 ${turma.fonte === "SERIF" ? "font-serif" : turma.fonte === "MONO" ? "font-mono" : "font-sans"}`} style={{ backgroundColor: fundoTurma, "--turma-destaque": corDestaqueLegivel, "--turma-destaque-text": corTextoDestaque, "--turma-texto": corTextoLegivel, "--turma-descricao": corDescricaoLegivel } as React.CSSProperties}>
			{/* Header da turma */}
			<div
				className="turma-tema__cabecalho relative min-w-0 flex-shrink-0 overflow-hidden px-3 pb-6 pt-5 shadow-[0_18px_35px_rgba(2,132,199,.2)] sm:px-6 sm:pt-6 lg:px-8"
				style={{ backgroundColor: turma.cor }}
			>
				<div className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full" style={{ backgroundColor: turma.corDestaque ?? "#ea580c" }} />
				<div className="absolute right-10 -top-8 w-20 h-20 rounded-full border-[11px] border-sky-200/80" />

				<div className="w-full max-w-6xl mx-auto relative">
					<div className="flex items-center justify-between mb-4">
						<div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
							<BookOpen className="w-4.5 h-4.5 text-white" />
						</div>
						{podeEditarTurma && <div ref={menuRef} className="relative">
							<button
								onClick={() => setMenuAberto((v) => !v)}
								aria-label="Abrir opções da turma"
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
										onClick={() => { setEditando(true); setMenuAberto(false); }}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
									>
										<Settings2 className="w-4 h-4" />
										Configurações
									</button>
								</div>
							)}
						</div>}
					</div>

					<h1 className="mb-1 break-words text-xl font-black leading-snug tracking-[-.035em] text-white sm:text-3xl" style={{ color: corTituloLegivel }}>
						{turma.nome}
					</h1>
					<p className="break-words text-xs text-white/85 sm:text-sm" style={{ color: corDescricaoBannerLegivel }}>
						{turma.sala} · {turma.professores.join(" e ")}
					</p>
				</div>
			</div>

			{/* Conteúdo */}
			<div className="turma-tema__conteudo min-h-0 flex-1 overflow-y-auto">
				{tab === "inicio" && (
					<InicioView turma={turma} turmaId={turmaId} avisos={avisos} eventos={eventos} />
				)}
				{tab === "materiais" && (
					<MateriaisView
						materiais={materiais}
						turmaId={turmaId}
						cor={corDestaqueLegivel}
						podeGerenciar={detalhe.role !== "MONITOR"}
					/>
				)}
				{tab === "anotacoes" && (
					<AnotacoesView
						anotacoes={anotacoes}
						turmaId={turmaId}
						cor={corDestaqueLegivel}
					/>
				)}
				{tab === "calendario" && (
					<div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
						<div className="mb-4">
							<h3 className="turma-semantic-text text-base sm:text-lg font-bold flex items-center gap-2">
								<CalendarDays className="turma-semantic-accent w-5 h-5" />
								Calendário de aulas e eventos
							</h3>
							<p className="turma-semantic-description text-xs sm:text-sm mt-0.5">
								Acompanhe o cronograma de aulas, reposições e feriados do semestre.
							</p>
						</div>
						<CalendarioAulas eventos={eventos} cor={corDestaqueLegivel} />
					</div>
				)}
				{tab === "presenca-alunos" && (
					<PresencaView
						titulo="Presença de alunos"
						pessoas={presencaAlunos}
						setPessoas={setPresencaAlunos}
						cor={corDestaqueLegivel}
						eventos={eventos}
						onSalvar={salvarNaData}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						coresEstado={{ presente: turma.cor, ausente: corDestaqueLegivel, justificado: fundoTurma }}
					/>
				)}
				{tab === "presenca-monitores" && (
					<PresencaView
						titulo="Presença de monitores"
						pessoas={presencaMonitores}
						setPessoas={setPresencaMonitores}
						cor={corDestaqueLegivel}
						eventos={eventos}
						onSalvar={salvarNaData}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						coresEstado={{ presente: turma.cor, ausente: corDestaqueLegivel, justificado: fundoTurma }}
					/>
				)}
				{tab === "presenca-professores" && (
					<PresencaView
						titulo="Presença de professores"
						pessoas={presencaProfessores}
						setPessoas={setPresencaProfessores}
						cor={corDestaqueLegivel}
						eventos={eventos}
						onSalvar={salvarNaData}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						coresEstado={{ presente: turma.cor, ausente: corDestaqueLegivel, justificado: fundoTurma }}
					/>
				)}
			</div>

			{confirmacaoPresenca && <ConfirmacaoPresencaModal confirmacao={confirmacaoPresenca} onFechar={() => setConfirmacaoPresenca(null)} />}

			{/* Navegação de turmas: menu flutuante no celular */}
			<div className="fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 sm:hidden">
				{mobileNavOpen && (
					<div className="absolute right-0 bottom-14 max-h-[min(24rem,calc(100dvh-6rem))] w-[min(14rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-sky-100 bg-white p-1.5 shadow-[0_14px_32px_rgb(15_23_42_/_0.2)]">
						{TABS.map((item) => {
							const Icon = item.icon;
							const active = tab === item.id;
							return (
								<button
									key={item.id}
									type="button"
									onClick={() => {
										setTab(item.id);
										setMobileNavOpen(false);
									}}
									className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${active ? "bg-sky-50 text-sky-700" : "text-gray-600 active:bg-slate-50"
										}`}
								>
									<Icon className="h-4 w-4" style={active ? { color: turma.cor } : undefined} />
									{item.label}
								</button>
							);
						})}
					</div>
				)}
				<button
					type="button"
					onClick={() => setMobileNavOpen((open) => !open)}
					className="flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_24px_rgb(2_132_199_/_0.34)] transition-transform active:scale-95"
					style={{ backgroundColor: corDestaqueLegivel, color: corTextoDestaque }}
					aria-label={mobileNavOpen ? "Fechar navegação da turma" : `Abrir navegação: ${tabAtual?.label ?? "Início"}`}
					aria-expanded={mobileNavOpen}
				>
					{mobileNavOpen ? <X className="h-5 w-5" /> : <IconeTabAtual className="h-5 w-5" />}
				</button>
			</div>

			{/* Bottom nav */}
			<nav className="hidden flex-shrink-0 items-stretch border-t border-sky-100 bg-white shadow-[0_-8px_24px_rgba(15,23,42,.05)] sm:flex">
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
			{editando && podeEditarTurma && (
				<EditarTurmaModal
					turma={turma}
					onSalvar={salvarTurma}
					onFechar={() => setEditando(false)}
				/>
			)}
		</div>
	);
}
