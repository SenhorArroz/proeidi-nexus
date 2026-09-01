"use client";
import React, { useState, useRef, useEffect } from "react";
import {
	DoorOpen,
	Plus,
	Pencil,
	Copy,
	Trash2,
	X,
	Check,
	Users,
	GraduationCap,
	Link2,
	FileText,
	Image as ImageIcon,
	CalendarDays,
	ArrowLeft,
	ShieldCheck,
	Search,
	FolderOpen,
	ClipboardCheck,
} from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface Aula {
	id: string;
	data: string; // yyyy-mm-dd
	titulo: string;
	tipo: "AULA" | "FERIADO" | "CANCELADA" | "ESPECIAL";
}

type TipoMaterial = "link" | "pdf" | "slide" | "imagem";

interface Material {
	id: string;
	titulo: string;
	tipo: TipoMaterial;
	url: string;
}

interface Turma {
	id: string;
	semestreId?: string;
	titulo: string;
	sala: string;
	horario: string;
	professores: string[];
	professorIds: string[];
	monitores: string[];
	monitorIds: string[];
	alunos: string[];
	alunoIds: string[];
	materiais: Material[];
	aulas: Aula[];
	notas: number;
	cor: string;
	corDestaque: string;
	corFundo: string;
	corTexto: string;
	corTitulo: string;
	corDescricao: string;
	fonte: "SANS" | "SERIF" | "MONO";
}

function luminosidadeHex(cor: string) {
	const hex = cor.replace("#", "");
	if (!/^[0-9a-f]{6}$/i.test(hex)) return 0.5;
	const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
	const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
	const b = Number.parseInt(hex.slice(4, 6), 16) / 255;
	const linear = (canal: number) =>
		canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

const turmaVazia = (): Turma => ({
	id: "",
	titulo: "",
	sala: "",
	horario: "",
	professores: [],
	professorIds: [],
	monitores: [],
	monitorIds: [],
	alunos: [],
	alunoIds: [],
	materiais: [],
	aulas: [],
	notas: 0,
	cor: "#1A73E8",
	corDestaque: "#ea580c",
	corFundo: "#f8fafc",
	corTexto: "#0f172a",
	corTitulo: "#ffffff",
	corDescricao: "#64748b",
	fonte: "SANS",
});

// Preenche com valores padrão qualquer campo ausente — protege contra dados
// vindos de uma API/formato antigo que não tenham todas as propriedades.
function normalizarTurma(t: Partial<Turma> & { id: string }): Turma {
	return {
		id: t.id,
		semestreId: t.semestreId,
		titulo: t.titulo ?? "",
		sala: t.sala ?? "",
		horario: t.horario ?? "",
		professores: t.professores ?? [],
		professorIds: t.professorIds ?? [],
		monitores: t.monitores ?? [],
		monitorIds: t.monitorIds ?? [],
		alunos: t.alunos ?? [],
		alunoIds: t.alunoIds ?? [],
		materiais: t.materiais ?? [],
		aulas: t.aulas ?? [],
		notas: t.notas ?? 0,
		cor: t.cor ?? "#1A73E8",
		corDestaque: t.corDestaque ?? "#ea580c",
		corFundo: t.corFundo ?? "#f8fafc",
		corTexto: t.corTexto ?? "#0f172a",
		corTitulo: t.corTitulo ?? "#ffffff",
		corDescricao: t.corDescricao ?? "#64748b",
		fonte: t.fonte ?? "SANS",
	};
}

function formatarData(iso: string) {
	if (!iso) return "";
	const [ano, mes, dia] = iso.split("-");
	return `${dia}/${mes}/${ano}`;
}

const ICONE_MATERIAL: Record<TipoMaterial, React.ElementType> = {
	link: Link2,
	pdf: FileText,
	slide: FileText,
	imagem: ImageIcon,
};

// ---------------------------------------------------------------------------
// Dropdown de busca (professores, monitores, alunos) — simula busca no banco
// ---------------------------------------------------------------------------

type OpcaoPessoa = { id: string; nome: string; detalhe?: string };

function SearchSelect({
	label,
	icon: Icon,
	selectedIds = [],
	onChange,
	options,
	placeholder,
	accent,
	isLoading = false,
}: {
	label: string;
	icon: React.ElementType;
	selectedIds: string[] | undefined;
	onChange: (ids: string[]) => void;
	options: OpcaoPessoa[];
	placeholder: string;
	accent: string;
	isLoading?: boolean;
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

	const buscaNormalizada = normalizarBusca(query);
	const selecionados = options.filter((opcao) =>
		selectedIds.includes(opcao.id),
	);
	const resultados = options
		.filter((opcao) => !selectedIds.includes(opcao.id))
		.filter(
			(opcao) =>
				!buscaNormalizada ||
				normalizarBusca(`${opcao.nome} ${opcao.detalhe ?? ""}`).includes(
					buscaNormalizada,
				),
		)
		.slice(0, 6);

	const selecionar = (id: string) => {
		onChange([...selectedIds, id]);
		setQuery("");
		setOpen(false);
	};

	const remover = (id: string) =>
		onChange(selectedIds.filter((value) => value !== id));

	return (
		<div className="min-w-0">
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<Icon className="w-3.5 h-3.5" />
				{label}
			</label>

			<div className="mb-2 flex min-h-[1.75rem] min-w-0 flex-wrap gap-1.5">
				{selecionados.map((opcao) => (
					<span
						key={opcao.id}
						className="flex max-w-full items-center gap-1.5 rounded-full py-1 pl-2.5 pr-1.5 text-xs font-medium"
						style={{ backgroundColor: `${accent}1A`, color: accent }}
					>
						<span className="truncate">{opcao.nome}</span>
						<button
							onClick={() => remover(opcao.id)}
							className="p-0.5 rounded-full hover:bg-black/10"
							aria-label={`Remover ${opcao.nome}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
				{selectedIds.length === 0 &&
					(isLoading ? (
						<span className="h-4 w-28 animate-pulse rounded bg-slate-200" />
					) : (
						<span className="text-xs text-gray-400 py-1">
							Nenhum selecionado
						</span>
					))}
			</div>

			<div ref={containerRef} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
					<input
						disabled={isLoading}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setOpen(true)}
						onKeyDown={(event) => {
							if (event.key === "Escape") setOpen(false);
						}}
						placeholder={placeholder}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
				</div>

				{open && (
					<div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
						{resultados.length > 0 ? (
							resultados.map((opcao) => (
								<button
									key={opcao.id}
									onClick={() => selecionar(opcao.id)}
									className="w-full text-left px-3 py-2 text-sm text-sky-900 hover:bg-sky-50 hover:text-sky-700 transition-colors"
								>
									<span className="block truncate">{opcao.nome}</span>
									{opcao.detalhe && (
										<span className="mt-0.5 block truncate text-xs text-slate-500">
											{opcao.detalhe}
										</span>
									)}
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
// Editor de aulas (data + título)
// ---------------------------------------------------------------------------

function AulasEditor({
	aulas = [],
	onChange,
}: {
	aulas: Aula[] | undefined;
	onChange: (a: Aula[]) => void;
}) {
	const [data, setData] = useState("");
	const [titulo, setTitulo] = useState("");
	const [tipo, setTipo] = useState<Aula["tipo"]>("AULA");

	const adicionar = () => {
		if (!data || !titulo.trim()) return;
		const nova: Aula = {
			id: Date.now().toString(),
			data,
			titulo: titulo.trim(),
			tipo,
		};
		const atualizadas = [...aulas, nova].sort((a, b) =>
			a.data.localeCompare(b.data),
		);
		onChange(atualizadas);
		setData("");
		setTitulo("");
		setTipo("AULA");
	};

	const remover = (id: string) => onChange(aulas.filter((a) => a.id !== id));
	const atualizar = (id: string, alteracoes: Partial<Omit<Aula, "id">>) =>
		onChange(
			aulas
				.map((aula) => (aula.id === id ? { ...aula, ...alteracoes } : aula))
				.sort((a, b) => a.data.localeCompare(b.data)),
		);

	return (
		<div>
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<CalendarDays className="w-3.5 h-3.5" />
				Aulas
			</label>

			<div className="space-y-2 mb-3">
				{aulas.map((aula) => (
					<div
						key={aula.id}
						className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
					>
						<div className="mb-2 flex min-w-0 flex-wrap items-center gap-2">
							<span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-600">
								{formatarData(aula.data)}
							</span>
							<span className="min-w-0 flex-1 truncate text-sm text-gray-700">
								{aula.titulo}
							</span>
							<span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-800">
								{aula.tipo.charAt(0) + aula.tipo.slice(1).toLowerCase()}
							</span>
						</div>
						<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
							<input
								type="date"
								value={aula.data}
								onChange={(e) => atualizar(aula.id, { data: e.target.value })}
								className="min-h-9 w-full rounded-md border border-sky-200 bg-white px-2 text-xs font-semibold text-sky-700 outline-none focus:border-sky-500 sm:w-auto"
								aria-label={`Data de ${aula.titulo}`}
							/>
							<input
								value={aula.titulo}
								onChange={(e) => atualizar(aula.id, { titulo: e.target.value })}
								className="min-h-9 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none focus:border-sky-500"
								aria-label="Nome da aula"
							/>
							<select
								value={aula.tipo}
								onChange={(e) =>
									atualizar(aula.id, { tipo: e.target.value as Aula["tipo"] })
								}
								className="min-h-9 rounded-md border border-orange-200 bg-white px-2 text-[10px] font-bold text-orange-800 outline-none focus:border-orange-500"
								aria-label="Tipo da aula"
							>
								<option value="AULA">Aula</option>
								<option value="FERIADO">Feriado</option>
								<option value="CANCELADA">Cancelada</option>
								<option value="ESPECIAL">Especial</option>
							</select>
							<button
								onClick={() => remover(aula.id)}
								className="grid min-h-9 min-w-9 place-items-center rounded-md text-red-700 hover:bg-red-50 hover:text-red-800"
								aria-label="Remover aula"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				))}
				{aulas.length === 0 && (
					<p className="text-xs text-gray-400 py-1">Nenhuma aula cadastrada</p>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
				<input
					type="date"
					value={data}
					onChange={(e) => setData(e.target.value)}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<select
					value={tipo}
					onChange={(e) => setTipo(e.target.value as Aula["tipo"])}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-sky-300 focus:outline-none"
				>
					<option value="AULA">Aula</option>
					<option value="FERIADO">Feriado</option>
					<option value="CANCELADA">Cancelada</option>
					<option value="ESPECIAL">Especial</option>
				</select>
				<input
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && adicionar()}
					placeholder="Título da aula"
					className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<button
					onClick={adicionar}
					className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Adicionar
				</button>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Editor de materiais (links, PDFs, slides, imagens)
// ---------------------------------------------------------------------------

function MateriaisEditor({
	materiais = [],
	onChange,
}: {
	materiais: Material[] | undefined;
	onChange: (m: Material[]) => void;
}) {
	const [titulo, setTitulo] = useState("");
	const [tipo, setTipo] = useState<TipoMaterial>("link");
	const [url, setUrl] = useState("");

	const adicionar = () => {
		if (!titulo.trim()) return;
		const novo: Material = {
			id: Date.now().toString(),
			titulo: titulo.trim(),
			tipo,
			url: url.trim(),
		};
		onChange([...materiais, novo]);
		setTitulo("");
		setUrl("");
	};

	const remover = (id: string) =>
		onChange(materiais.filter((m) => m.id !== id));

	return (
		<div>
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<FolderOpen className="w-3.5 h-3.5" />
				Materiais
				<span className="normal-case text-gray-400">
					(links, PDFs, etc — opcional)
				</span>
			</label>

			<div className="space-y-2 mb-3">
				{materiais.map((material) => {
					const Icone = ICONE_MATERIAL[material.tipo];
					return (
						<div
							key={material.id}
							className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2"
						>
							<div className="w-7 h-7 rounded-md bg-sky-50 flex items-center justify-center flex-shrink-0">
								<Icone className="w-3.5 h-3.5 text-sky-600" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-700 truncate">
									{material.titulo}
								</p>
								{material.url && (
									<p className="text-xs text-gray-400 truncate">
										{material.url}
									</p>
								)}
							</div>
							<button
								onClick={() => remover(material.id)}
								className="flex-shrink-0 p-1 rounded-md text-red-700 hover:bg-red-50 hover:text-red-800"
								aria-label="Remover material"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					);
				})}
				{materiais.length === 0 && (
					<p className="text-xs text-gray-400 py-1">
						Nenhum material adicionado
					</p>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
				<select
					value={tipo}
					onChange={(e) => setTipo(e.target.value as TipoMaterial)}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				>
					<option value="link">Link</option>
					<option value="pdf">PDF</option>
					<option value="slide">Slide</option>
					<option value="imagem">Imagem</option>
				</select>
				<input
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					placeholder="Título do material"
					className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && adicionar()}
					placeholder="URL (opcional)"
					className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<button
					onClick={adicionar}
					className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Adicionar
				</button>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Card de turma (lista)
// ---------------------------------------------------------------------------

function TurmaCard({
	turma,
	onEditar,
	onDuplicar,
	onExcluir,
	duplicando,
}: {
	turma: Turma;
	onEditar: () => void;
	onDuplicar: () => void;
	onExcluir: () => void;
	duplicando: boolean;
}) {
	return (
		<div
			className="turma-card-tema group min-w-0 overflow-hidden rounded-2xl shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5"
			style={
				{
					backgroundColor: turma.corFundo,
					"--turma-texto": turma.corTexto,
					"--turma-descricao": turma.corDescricao,
					fontFamily:
						turma.fonte === "SERIF"
							? "Georgia, serif"
							: turma.fonte === "MONO"
								? "ui-monospace, SFMono-Regular, Menlo, monospace"
								: undefined,
					boxShadow: `0 16px 30px ${turma.cor}24`,
				} as React.CSSProperties
			}
		>
			<div
				className="turma-card-tema__cabecalho relative overflow-hidden px-5 py-4"
				style={{ backgroundColor: turma.cor }}
			>
				<div
					className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full"
					style={{ backgroundColor: turma.corDestaque }}
				/>
				<div className="relative flex items-start justify-between gap-2">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
							<DoorOpen className="w-4.5 h-4.5 text-white" />
						</div>
						<span
							className="text-sm font-semibold text-white truncate"
							style={{ color: turma.corTitulo }}
						>
							{turma.titulo}
						</span>
					</div>
					<div className="relative flex shrink-0 items-center gap-0.5">
						<button
							onClick={onEditar}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Editar turma"
						>
							<Pencil className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onDuplicar}
							disabled={duplicando}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Duplicar turma"
							title="Duplicar turma"
						>
							<Copy className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onExcluir}
							className="grid min-h-11 min-w-11 place-items-center rounded-lg text-white/80 hover:bg-white/20 hover:text-white sm:min-h-0 sm:min-w-0 sm:p-1.5"
							aria-label="Excluir turma"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>

			<div className="p-5">
				<p className="turma-card-descricao mb-3 truncate text-xs font-medium !text-[color:var(--turma-descricao)]">
					{turma.professores?.length > 0
						? turma.professores.join(", ")
						: "Sem professor definido"}
					{turma.monitores?.length > 0 &&
						` · ${turma.monitores.join(", ")} (monitor)`}
				</p>

				<div className="turma-card-descricao flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">
					<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
						<Users
							className="w-3.5 h-3.5"
							style={{ color: turma.corDestaque }}
						/>
						{turma.alunos?.length ?? 0} alunos
					</span>
					<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
						<CalendarDays
							className="w-3.5 h-3.5"
							style={{ color: turma.corDestaque }}
						/>
						{turma.aulas?.length ?? 0} aulas
					</span>
					{turma.materiais?.length > 0 && (
						<span className="flex items-center gap-1.5 !text-[color:var(--turma-descricao)]">
							<FolderOpen
								className="w-3.5 h-3.5"
								style={{ color: turma.corDestaque }}
							/>
							{turma.materiais.length} materiais
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

type AbaGestaoTurma = "visao" | "equipe" | "alunos" | "calendario";

function CampoFichaAluno({
	label,
	valor,
}: {
	label: string;
	valor: React.ReactNode;
}) {
	return (
		<div className="min-w-0">
			<dt className="text-xs font-semibold text-slate-500">{label}</dt>
			<dd className="mt-1 break-words text-sm font-medium text-slate-800">
				{valor || "Não informado"}
			</dd>
		</div>
	);
}

function FichaAlunoCompleta({ aluno }: { aluno: any }) {
	const simNao = (valor: boolean) => (valor ? "Sim" : "Não");
	const dataNascimento = aluno.dataNascimento
		? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
				new Date(aluno.dataNascimento),
			)
		: "Não informada";

	return (
		<div className="mt-5 space-y-6">
			<section>
				<h3 className="font-bold text-slate-900">Dados pessoais</h3>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno label="Data de nascimento" valor={dataNascimento} />
					<CampoFichaAluno label="CPF" valor={aluno.cpf} />
					<CampoFichaAluno label="Cor ou raça" valor={aluno.corRaca} />
					<CampoFichaAluno
						label="Identidade de gênero"
						valor={aluno.identidadeGenero}
					/>
					<CampoFichaAluno label="LGBTQIAPN+" valor={aluno.lgbtqiapn} />
					<CampoFichaAluno label="Escolaridade" valor={aluno.escolaridade} />
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">Contato</h3>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno label="E-mail" valor={aluno.email} />
					<CampoFichaAluno label="Telefone" valor={aluno.telefone} />
					<CampoFichaAluno
						label="Contato de emergência"
						valor={aluno.contatoEmergencia}
					/>
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">
					Respostas da confirmação de inscrição
				</h3>
				<p className="mt-1 text-sm text-slate-500">
					Informações respondidas pelo aluno no momento da adição.
				</p>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno
						label="Cuida de terceiros?"
						valor={simNao(aluno.cuidaTerceiros)}
					/>
					<CampoFichaAluno label="Trabalha?" valor={simNao(aluno.trabalha)} />
					<CampoFichaAluno
						label="Local de trabalho"
						valor={aluno.trabalhoLocal}
					/>
					<CampoFichaAluno
						label="Função no trabalho"
						valor={aluno.trabalhoFuncao}
					/>
					<CampoFichaAluno label="Estuda?" valor={simNao(aluno.estuda)} />
					<CampoFichaAluno label="Local de estudo" valor={aluno.estudoLocal} />
					<CampoFichaAluno label="Curso" valor={aluno.estudoCurso} />
					<CampoFichaAluno
						label="Possui problema de saúde?"
						valor={simNao(aluno.problemaSaude)}
					/>
					<CampoFichaAluno
						label="Qual problema de saúde?"
						valor={aluno.problemaSaudeQual}
					/>
					<CampoFichaAluno
						label="Possui necessidade especial?"
						valor={simNao(aluno.necessidadeEspecial)}
					/>
					<CampoFichaAluno
						label="Qual necessidade especial?"
						valor={aluno.necessidadeEspecialQual}
					/>
					<CampoFichaAluno
						label="Acesso à internet?"
						valor={simNao(aluno.acessoInternet)}
					/>
					<CampoFichaAluno
						label="Possui computador?"
						valor={simNao(aluno.temComputador)}
					/>
					<CampoFichaAluno
						label="Possui smartphone?"
						valor={simNao(aluno.temSmartphone)}
					/>
					<CampoFichaAluno
						label="Sistema do smartphone"
						valor={aluno.sistemaSmartphone}
					/>
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">
					Histórico completo de turmas
				</h3>
				<div className="mt-3 space-y-2">
					{aluno.turmas?.length ? (
						aluno.turmas.map((vinculo: any) => (
							<div
								key={vinculo.turma.id}
								className="flex min-w-0 flex-col gap-2 rounded-lg bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-bold text-slate-900">
										{vinculo.turma.titulo}
									</p>
									<p className="mt-0.5 text-xs text-slate-500">
										{vinculo.turma.sala || "Sala não definida"}
										{vinculo.turma.horario ? ` · ${vinculo.turma.horario}` : ""}
									</p>
								</div>
								<span
									className="shrink-0 text-xs font-bold"
									style={{ color: vinculo.turma.cor }}
								>
									{vinculo.turma.semestre?.codigo ?? "Semestre não informado"}
								</span>
							</div>
						))
					) : (
						<p className="text-sm text-slate-500">Nenhuma turma registrada.</p>
					)}
				</div>
			</section>
		</div>
	);
}

function JanelaGestaoTurma({
	turma,
	semestres,
	alunosDb,
	docentesDb,
	monitoresDb,
	onChange,
	onVoltar,
	onSalvar,
	salvando,
}: {
	turma: Turma;
	semestres: Array<{ id: string; codigo: string }>;
	alunosDb: Array<{
		id: string;
		nome: string;
		email?: string | null;
		telefone?: string | null;
	}>;
	docentesDb: Array<{ id: string; nome: string; email?: string | null }>;
	monitoresDb: Array<{ id: string; nome: string; email?: string | null }>;
	onChange: (turma: Turma) => void;
	onVoltar: () => void;
	onSalvar: () => void | Promise<void>;
	salvando: boolean;
}) {
	const { theme } = useAccessibility();
	const [aba, setAba] = useState<AbaGestaoTurma>("visao");
	const corTexto =
		theme === "dark" && luminosidadeHex(turma.corTexto) < 0.42
			? "#e5edf8"
			: turma.corTexto;
	const corDescricao =
		theme === "dark" && luminosidadeHex(turma.corDescricao) < 0.36
			? "#b9c9dd"
			: turma.corDescricao;
	const corFundo =
		theme === "dark" && luminosidadeHex(turma.corFundo) > 0.55
			? "#162033"
			: turma.corFundo;
	const [alunoSelecionadoId, setAlunoSelecionadoId] = useState<string | null>(
		null,
	);
	const { data: historicoAluno, isLoading: carregandoHistorico } =
		api.aluno.detalhe.useQuery(
			{ id: alunoSelecionadoId ?? "c0000000000000000000000000" },
			{ enabled: Boolean(alunoSelecionadoId) },
		);
	const { data: registrosPresenca } = api.diretoria.presencas.list.useQuery(
		{ turmaId: turma.id || "c0000000000000000000000000" },
		{ enabled: Boolean(turma.id) },
	);

	const estadosAlunos =
		registrosPresenca?.flatMap((registro) => registro.alunos) ?? [];
	const mediaPresenca = estadosAlunos.length
		? Math.round(
				(estadosAlunos.filter((presenca) => presenca.estado === "PRESENTE")
					.length /
					estadosAlunos.length) *
					100,
			)
		: 0;
	const hoje = new Date().toISOString().slice(0, 10);
	const proximasAulas = turma.aulas
		.filter((aula) => aula.data >= hoje)
		.slice(0, 4);
	const pessoaOptions = (
		pessoas: Array<{ id: string; nome: string; email?: string | null }>,
	) =>
		pessoas.map((pessoa) => ({
			id: pessoa.id,
			nome: pessoa.nome,
			detalhe: pessoa.email ?? undefined,
		}));
	const alunosOptions = alunosDb.map((aluno) => ({
		id: aluno.id,
		nome: aluno.nome,
		detalhe: aluno.email ?? aluno.telefone ?? undefined,
	}));
	const atualizarIds = (
		campo: "professorIds" | "monitorIds" | "alunoIds",
		ids: string[],
	) => {
		const fonte =
			campo === "professorIds"
				? docentesDb
				: campo === "monitorIds"
					? monitoresDb
					: alunosDb;
		const campoNomes =
			campo === "professorIds"
				? "professores"
				: campo === "monitorIds"
					? "monitores"
					: "alunos";
		onChange({
			...turma,
			[campo]: ids,
			[campoNomes]: ids
				.map((id) => fonte.find((pessoa) => pessoa.id === id)?.nome)
				.filter(Boolean) as string[],
		});
	};

	const abas: Array<{
		id: AbaGestaoTurma;
		label: string;
		Icon: React.ElementType;
	}> = [
		{ id: "visao", label: "Visão geral", Icon: DoorOpen },
		{ id: "equipe", label: "Equipe", Icon: ShieldCheck },
		{ id: "alunos", label: "Alunos", Icon: Users },
		{ id: "calendario", label: "Calendário", Icon: CalendarDays },
	];

	return (
		<div
			className="turma-tema diretoria-page-canvas min-h-full w-full px-3 py-3 text-slate-900 sm:px-6 sm:py-6"
			style={{ "--turma-destaque": turma.corDestaque } as React.CSSProperties}
		>
			<div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_55px_rgba(15,23,42,.14)]">
				<header
					className="relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
					style={{ backgroundColor: turma.cor }}
				>
					<div
						className="absolute -right-10 -top-12 h-44 w-44 rounded-full opacity-70"
						style={{ backgroundColor: turma.corDestaque }}
					/>
					<div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="min-w-0">
							<button
								onClick={onVoltar}
								className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold hover:bg-white/15"
								style={{ color: turma.corTitulo }}
							>
								<ArrowLeft className="h-4 w-4" /> Voltar para turmas
							</button>
							<input
								value={turma.titulo}
								onChange={(event) =>
									onChange({ ...turma, titulo: event.target.value })
								}
								placeholder="Nome da turma"
								className="block w-full max-w-2xl border-0 bg-transparent p-0 text-2xl font-bold outline-none placeholder:text-white/70 sm:text-3xl"
								style={{ color: turma.corTitulo }}
							/>
							<div
								className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium"
								style={{ color: turma.corTitulo }}
							>
								<span>
									{semestres.find(
										(semestre) => semestre.id === turma.semestreId,
									)?.codigo ?? "Selecione o semestre"}
								</span>
								<span>{turma.sala || "Sala não definida"}</span>
								<span>{turma.horario || "Horário não definido"}</span>
							</div>
						</div>
						<button
							onClick={() => void onSalvar()}
							disabled={salvando || !turma.titulo.trim() || !turma.semestreId}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
							style={{ color: turma.cor }}
						>
							<Check className="h-4 w-4" />{" "}
							{salvando ? "Salvando…" : "Salvar alterações"}
						</button>
					</div>
				</header>

				<nav
					className="flex overflow-x-auto border-b border-slate-200 px-2"
					aria-label="Seções da turma"
				>
					{abas.map(({ id, label, Icon }) => (
						<button
							key={id}
							onClick={() => setAba(id)}
							className="flex min-h-13 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition"
							style={{
								borderColor: aba === id ? turma.corDestaque : "transparent",
								color: aba === id ? turma.corDestaque : undefined,
							}}
						>
							<Icon className="h-4 w-4" />
							{label}
						</button>
					))}
				</nav>

				<div className="p-4 sm:p-7">
					{aba === "visao" && (
						<div className="space-y-7">
							<section className="grid gap-px overflow-hidden rounded-xl bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
								{[
									["Alunos", turma.alunoIds.length, Users],
									[
										"Presença média",
										registrosPresenca?.length ? `${mediaPresenca}%` : "—",
										ClipboardCheck,
									],
									["Materiais", turma.materiais.length, FolderOpen],
									["Notas", turma.notas, FileText],
									["Aulas registradas", turma.aulas.length, CalendarDays],
								].map(([label, value, Icon]) => {
									const MetricaIcon = Icon as React.ElementType;
									return (
										<div key={String(label)} className="min-h-28 bg-white p-4">
											<MetricaIcon
												className="mb-3 h-4 w-4"
												style={{ color: turma.corDestaque }}
											/>
											<p
												className="text-2xl font-bold"
												style={{ color: corTexto }}
											>
												{String(value)}
											</p>
											<p
												className="mt-1 text-xs font-semibold"
												style={{ color: corDescricao }}
											>
												{String(label)}
											</p>
										</div>
									);
								})}
							</section>

							<div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
								<section>
									<h2 className="text-lg font-bold">Dados da turma</h2>
									<div className="mt-4 grid gap-4 sm:grid-cols-2">
										<label className="text-sm font-semibold">
											Semestre
											<select
												value={turma.semestreId ?? ""}
												onChange={(event) =>
													onChange({ ...turma, semestreId: event.target.value })
												}
												className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
											>
												<option value="">Selecione</option>
												{semestres.map((semestre) => (
													<option key={semestre.id} value={semestre.id}>
														{semestre.codigo}
													</option>
												))}
											</select>
										</label>
										<label className="text-sm font-semibold">
											Sala
											<input
												value={turma.sala}
												onChange={(event) =>
													onChange({ ...turma, sala: event.target.value })
												}
												placeholder="Ex.: Laboratório 2"
												className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
											/>
										</label>
										<label className="text-sm font-semibold">
											Horário
											<input
												value={turma.horario}
												onChange={(event) =>
													onChange({ ...turma, horario: event.target.value })
												}
												placeholder="Ex.: Terças, 14h"
												className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
											/>
										</label>
										<label className="text-sm font-semibold">
											Fonte
											<select
												value={turma.fonte}
												onChange={(event) =>
													onChange({
														...turma,
														fonte: event.target.value as Turma["fonte"],
													})
												}
												className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
											>
												<option value="SANS">Sem serifa</option>
												<option value="SERIF">Com serifa</option>
												<option value="MONO">Monoespaçada</option>
											</select>
										</label>
									</div>
								</section>
								<section
									className="rounded-xl p-4"
									style={{ backgroundColor: corFundo }}
								>
									<h2
										className="text-base font-bold"
										style={{ color: corTexto }}
									>
										Próximas aulas
									</h2>
									<div className="mt-3 space-y-2">
										{proximasAulas.length ? (
											proximasAulas.map((aula) => (
												<div
													key={aula.id}
													className="flex items-center justify-between gap-3 rounded-lg bg-white/70 px-3 py-2"
												>
													<span
														className="truncate text-sm font-semibold"
														style={{ color: corTexto }}
													>
														{aula.titulo}
													</span>
													<time
														className="shrink-0 text-xs font-bold"
														style={{ color: turma.corDestaque }}
													>
														{formatarData(aula.data)}
													</time>
												</div>
											))
										) : (
											<p className="text-sm" style={{ color: corDescricao }}>
												Nenhuma aula futura registrada.
											</p>
										)}
									</div>
								</section>
							</div>

							<section>
								<MateriaisEditor
									materiais={turma.materiais}
									onChange={(materiais) => onChange({ ...turma, materiais })}
								/>
							</section>
						</div>
					)}

					{aba === "equipe" && (
						<div className="grid gap-7 lg:grid-cols-2">
							<SearchSelect
								label="Professores e diretores"
								icon={GraduationCap}
								selectedIds={turma.professorIds}
								onChange={(ids) => atualizarIds("professorIds", ids)}
								options={pessoaOptions(docentesDb)}
								placeholder="Buscar professor ou diretor"
								accent={turma.corDestaque}
							/>
							<SearchSelect
								label="Monitores"
								icon={ShieldCheck}
								selectedIds={turma.monitorIds}
								onChange={(ids) => atualizarIds("monitorIds", ids)}
								options={pessoaOptions(monitoresDb)}
								placeholder="Buscar monitor"
								accent={turma.corDestaque}
							/>
							<section
								className="lg:col-span-2 rounded-xl p-4"
								style={{ backgroundColor: corFundo }}
							>
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<h2 className="font-bold" style={{ color: corTexto }}>
											Presença da equipe
										</h2>
										<p className="mt-1 text-sm" style={{ color: corDescricao }}>
											Registre e consulte as presenças de professores e
											monitores por data de aula.
										</p>
									</div>
									{turma.id ? (
										<a
											href="/nexus/diretoria/presencas"
											className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-bold text-white"
											style={{ backgroundColor: turma.corDestaque }}
										>
											Abrir controle de presença
										</a>
									) : (
										<span className="text-sm" style={{ color: corDescricao }}>
											Salve a turma para registrar presença.
										</span>
									)}
								</div>
							</section>
						</div>
					)}

					{aba === "alunos" && (
						<div className="space-y-7">
							<SearchSelect
								label="Adicionar alunos à turma"
								icon={Users}
								selectedIds={turma.alunoIds}
								onChange={(ids) => atualizarIds("alunoIds", ids)}
								options={alunosOptions}
								placeholder="Buscar aluno por nome, e-mail ou telefone"
								accent={turma.corDestaque}
							/>
							<section>
								<div className="mb-4 flex items-baseline justify-between gap-3">
									<h2 className="text-lg font-bold">Alunos vinculados</h2>
									<span className="text-sm" style={{ color: corDescricao }}>
										{turma.alunoIds.length} no total
									</span>
								</div>
								{turma.alunoIds.length ? (
									<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
										{turma.alunoIds.map((id) => {
											const aluno = alunosDb.find((item) => item.id === id);
											return (
												<button
													key={id}
													onClick={() => setAlunoSelecionadoId(id)}
													className="min-w-0 rounded-xl p-4 text-left transition hover:-translate-y-0.5"
													style={{ backgroundColor: corFundo }}
												>
													<div className="flex items-center gap-3">
														<div
															className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
															style={{ backgroundColor: turma.corDestaque }}
														>
															{(aluno?.nome ?? "?").slice(0, 1).toUpperCase()}
														</div>
														<div className="min-w-0">
															<p
																className="truncate font-bold"
																style={{ color: corTexto }}
															>
																{aluno?.nome ??
																	turma.alunos[turma.alunoIds.indexOf(id)] ??
																	"Aluno"}
															</p>
															<p
																className="mt-0.5 truncate text-xs"
																style={{ color: corDescricao }}
															>
																{aluno?.email ??
																	aluno?.telefone ??
																	"Ver ficha e histórico"}
															</p>
														</div>
													</div>
												</button>
											);
										})}
									</div>
								) : (
									<p
										className="py-8 text-center text-sm"
										style={{ color: corDescricao }}
									>
										Adicione alunos para montar a turma.
									</p>
								)}
							</section>
						</div>
					)}

					{aba === "calendario" && (
						<div className="space-y-7">
							<section
								className="rounded-xl p-4"
								style={{ backgroundColor: corFundo }}
							>
								<h2 className="text-lg font-bold" style={{ color: corTexto }}>
									Calendário de aulas
								</h2>
								<p className="mt-1 text-sm" style={{ color: corDescricao }}>
									Cadastre as aulas e atualize datas ou títulos quando
									necessário.
								</p>
							</section>
							<AulasEditor
								aulas={turma.aulas}
								onChange={(aulas) => onChange({ ...turma, aulas })}
							/>
						</div>
					)}
				</div>
			</div>

			{alunoSelecionadoId && (
				<div
					className="fixed inset-0 z-50 grid place-items-end bg-slate-950/45 p-0 sm:place-items-center sm:p-5"
					role="dialog"
					aria-modal="true"
					aria-label="Ficha completa do aluno"
				>
					<div className="max-h-[88vh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-2xl sm:rounded-2xl sm:p-6">
						<div className="flex items-start justify-between gap-4">
							<div>
								<p
									className="text-xs font-bold uppercase tracking-wide"
									style={{ color: turma.corDestaque }}
								>
									Ficha completa
								</p>
								<h2 className="mt-1 text-xl font-bold">
									{historicoAluno?.nome ?? "Carregando…"}
								</h2>
							</div>
							<button
								onClick={() => setAlunoSelecionadoId(null)}
								className="grid h-10 w-10 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
								aria-label="Fechar ficha"
							>
								<X className="h-5 w-5" />
							</button>
						</div>
						{carregandoHistorico ? (
							<p className="py-10 text-sm text-slate-500">
								Carregando informações do aluno…
							</p>
						) : historicoAluno ? (
							<FichaAlunoCompleta aluno={historicoAluno} />
						) : (
							<p className="py-10 text-sm text-slate-500">
								Não foi possível carregar a ficha do aluno.
							</p>
						)}
					</div>
				</div>
			)}
		</div>
	);
}

export default function TurmasDiretoria() {
	const utils = api.useUtils();
	const [semestreSelecionadoId, setSemestreSelecionadoId] = useState("");
	const { data: semestres, isLoading: carregandoSemestres } =
		api.diretoria.semestres.list.useQuery();
	const semestreSelecionado =
		semestres?.find((s) => s.id === semestreSelecionadoId) ??
		semestres?.find((s) => s.ativo) ??
		semestres?.[0];
	const { data: turmasDb, isLoading: carregandoTurmas } =
		api.diretoria.turmas.list.useQuery(
			semestreSelecionado ? { semestreId: semestreSelecionado.id } : undefined,
			{ enabled: Boolean(semestreSelecionado) },
		);
	const { data: professoresDb, isLoading: carregandoProfessores } =
		api.diretoria.usuarios.list.useQuery({
			role: "PROFESSOR",
		});
	const { data: diretoresDb, isLoading: carregandoDiretores } =
		api.diretoria.usuarios.list.useQuery({
			role: "DIRETOR",
		});
	const { data: monitoresDb, isLoading: carregandoMonitores } =
		api.diretoria.usuarios.list.useQuery({
			role: "MONITOR",
		});
	const { data: alunosDb, isLoading: carregandoAlunos } =
		api.aluno.list.useQuery(
			{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
			{ enabled: Boolean(semestreSelecionado) },
		);
	const criar = api.diretoria.turmas.create.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const atualizar = api.diretoria.turmas.update.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const remover = api.diretoria.turmas.remove.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const duplicar = api.diretoria.turmas.duplicate.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
		onError: (erro) =>
			alert(`Não foi possível duplicar a turma: ${erro.message}`),
	});
	const [turmas, setTurmas] = useState<Turma[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Turma>(turmaVazia());
	const docentesDb = [...(professoresDb ?? []), ...(diretoresDb ?? [])];

	useEffect(() => {
		if (!turmasDb) return;
		setTurmas(
			turmasDb.map((t) => ({
				id: t.id,
				semestreId: t.semestreId,
				titulo: t.titulo,
				sala: t.sala ?? "",
				horario: t.horario ?? "",
				cor: t.cor,
				corDestaque: t.corDestaque,
				corFundo: t.corFundo,
				corTexto: t.corTexto,
				corTitulo: t.corTitulo,
				corDescricao: t.corDescricao,
				fonte: t.fonte as Turma["fonte"],
				professores: t.professores.map((v) => v.user.nome),
				professorIds: t.professores.map((v) => v.user.id),
				monitores: t.monitores.map((v) => v.user.nome),
				monitorIds: t.monitores.map((v) => v.user.id),
				alunos: t.alunos.map((v) => v.aluno.nome),
				alunoIds: t.alunos.map((v) => v.aluno.id),
				materiais: t.materiais.map((m) => ({
					...m,
					tipo: m.tipo.toLowerCase() as TipoMaterial,
				})),
				notas: t._count.anotacoes,
				aulas: t.eventos.map((e) => ({
					id: e.id,
					titulo: e.titulo,
					data: e.data.toISOString().slice(0, 10),
					tipo: e.tipo,
				})),
			})),
		);
	}, [turmasDb]);

	useEffect(() => {
		if (!semestreSelecionadoId && semestreSelecionado)
			setSemestreSelecionadoId(semestreSelecionado.id);
	}, [semestreSelecionado, semestreSelecionadoId]);

	const abrirNova = () => {
		setEditandoId(null);
		setRascunho({ ...turmaVazia(), semestreId: semestreSelecionado?.id });
		setModo("form");
	};

	const abrirEdicao = (turma: Turma) => {
		setEditandoId(turma.id);
		setRascunho(normalizarTurma(turma));
		if (turma.semestreId) setSemestreSelecionadoId(turma.semestreId);
		setModo("form");
	};

	const cancelar = () => setModo("lista");

	const salvar = async () => {
		if (!rascunho.titulo.trim() || !rascunho.semestreId) return;
		const payload = {
			semestreId: rascunho.semestreId,
			titulo: rascunho.titulo,
			sala: rascunho.sala.trim() || null,
			horario: rascunho.horario.trim() || null,
			cor: rascunho.cor,
			corDestaque: rascunho.corDestaque,
			corFundo: rascunho.corFundo,
			corTexto: rascunho.corTexto,
			corTitulo: rascunho.corTitulo,
			corDescricao: rascunho.corDescricao,
			fonte: rascunho.fonte,
			professorIds: rascunho.professorIds,
			monitorIds: rascunho.monitorIds,
			alunoIds: rascunho.alunoIds,
			materiais: rascunho.materiais.map((m) => ({
				titulo: m.titulo,
				tipo: m.tipo.toUpperCase() as "LINK" | "PDF" | "SLIDE" | "IMAGEM",
				url: m.url,
			})),
			aulas: rascunho.aulas.map((a) => ({
				titulo: a.titulo,
				data: new Date(`${a.data}T12:00:00`),
				tipo: a.tipo,
			})),
		};
		try {
			if (editandoId) {
				await atualizar.mutateAsync({ ...payload, id: editandoId });
				setTurmas((atuais) =>
					atuais.map((turma) =>
						turma.id === editandoId ? { ...rascunho, id: editandoId } : turma,
					),
				);
			} else {
				await criar.mutateAsync(payload);
			}
			await utils.diretoria.turmas.list.invalidate();
			setModo("lista");
		} catch (erro) {
			alert(
				`Não foi possível salvar a turma: ${
					erro instanceof Error ? erro.message : "tente novamente"
				}`,
			);
		}
	};

	const excluir = (id: string) => {
		if (confirm("Excluir esta turma? Essa ação não pode ser desfeita.")) {
			remover.mutate({ id });
		}
	};

	const duplicarTurma = (id: string) => duplicar.mutate({ id });

	if (modo === "form") {
		return (
			<JanelaGestaoTurma
				turma={rascunho}
				semestres={semestres ?? []}
				alunosDb={alunosDb ?? []}
				docentesDb={docentesDb}
				monitoresDb={monitoresDb ?? []}
				onChange={setRascunho}
				onVoltar={cancelar}
				onSalvar={salvar}
				salvando={criar.isPending || atualizar.isPending}
			/>
		);
	}

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 flex flex-col items-center font-sans px-3 py-6 sm:px-4 sm:py-6">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6">
				<DiretoriaPageIntro
					icon={DoorOpen}
					title="Gerenciar turmas"
					description="Cadastro de turmas, professores, monitores, alunos e aulas."
				/>
			</div>

			<div className="w-full max-w-5xl">
				{modo === "lista" ? (
					<>
						<div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
								<label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
									Semestre
								</label>
								<select
									value={semestreSelecionado?.id ?? ""}
									onChange={(e) => setSemestreSelecionadoId(e.target.value)}
									className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-base font-semibold text-gray-700 sm:w-auto sm:text-sm"
								>
									{semestres?.map((semestre) => (
										<option key={semestre.id} value={semestre.id}>
											{semestre.codigo}
											{semestre.ativo ? " — ativo" : ""}
										</option>
									))}
								</select>
								<span className="text-sm font-medium text-gray-700">
									{turmas.length} turmas cadastradas
								</span>
							</div>
							<button
								onClick={abrirNova}
								className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 sm:w-auto"
							>
								<Plus className="w-4 h-4" />
								Nova turma
							</button>
						</div>

						{carregandoSemestres || carregandoTurmas ? (
							<DataSkeleton cards={4} />
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{turmas.map((turma) => (
									<TurmaCard
										key={turma.id}
										turma={turma}
										onEditar={() => abrirEdicao(turma)}
										onDuplicar={() => duplicarTurma(turma.id)}
										onExcluir={() => excluir(turma.id)}
										duplicando={duplicar.isPending}
									/>
								))}
							</div>
						)}

						{!carregandoSemestres &&
							!carregandoTurmas &&
							turmas.length === 0 && (
								<div className="text-center py-16 text-sm text-gray-400">
									Nenhuma turma cadastrada ainda
								</div>
							)}
					</>
				) : (
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
							<button
								onClick={cancelar}
								className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
								aria-label="Voltar"
							>
								<ArrowLeft className="w-4 h-4" />
							</button>
							<h2 className="text-sm font-semibold text-gray-900">
								{editandoId ? "Editar turma" : "Nova turma"}
							</h2>
						</div>

						<div className="min-w-0 space-y-6 p-4 sm:p-6">
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
									Semestre da turma
								</label>
								<select
									value={rascunho.semestreId ?? ""}
									onChange={(e) => {
										setRascunho({
											...rascunho,
											semestreId: e.target.value,
										});
										setSemestreSelecionadoId(e.target.value);
									}}
									className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium"
								>
									<option value="">Selecione um semestre</option>
									{semestres?.map((semestre) => (
										<option key={semestre.id} value={semestre.id}>
											{semestre.codigo}
											{semestre.ativo ? " — ativo" : ""}
										</option>
									))}
								</select>
								{editandoId && (
									<p className="mt-1 text-xs text-amber-700">
										Ao trocar o semestre, os alunos vinculados à turma também
										serão movidos e seus vínculos com turmas do período anterior
										serão removidos.
									</p>
								)}
							</div>
							{/* Título */}
							<div>
								<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
									Título da turma
								</label>
								<input
									value={rascunho.titulo}
									onChange={(e) =>
										setRascunho({ ...rascunho, titulo: e.target.value })
									}
									placeholder="Ex: Smartphone mais do que Avançado"
									className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
								/>
							</div>

							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								<div>
									<label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
										Local
									</label>
									<input
										value={rascunho.sala}
										onChange={(e) =>
											setRascunho({ ...rascunho, sala: e.target.value })
										}
										placeholder="Ex: Sala 204"
										className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:border-sky-300 focus:bg-white focus:outline-none"
									/>
								</div>
								<div>
									<label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">
										Horário
									</label>
									<input
										value={rascunho.horario}
										onChange={(e) =>
											setRascunho({ ...rascunho, horario: e.target.value })
										}
										placeholder="Ex: Seg e Qua · 14:00 – 16:00"
										className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:border-sky-300 focus:bg-white focus:outline-none"
									/>
								</div>
							</div>

							<section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
								<h3 className="text-sm font-semibold text-gray-900">
									Personalização da turma
								</h3>
								<p className="mt-1 text-xs text-gray-500">
									Essas cores aparecem nos cards da Dashboard, da Diretoria e
									dentro da turma.
								</p>
								<div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
									{(
										[
											["cor", "Cor principal"],
											["corDestaque", "Cor de destaque"],
											["corFundo", "Fundo do card"],
											["corTexto", "Cor do texto"],
											["corTitulo", "Título do banner"],
											["corDescricao", "Descrição"],
										] as const
									).map(([campo, label]) => (
										<label
											key={campo}
											className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-600"
										>
											<input
												type="color"
												value={rascunho[campo]}
												onChange={(e) =>
													setRascunho({ ...rascunho, [campo]: e.target.value })
												}
												className="h-8 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
												aria-label={label}
											/>
											<span>{label}</span>
										</label>
									))}
									<label className="rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs font-medium text-gray-600">
										<span className="block">Fonte</span>
										<select
											value={rascunho.fonte}
											onChange={(e) =>
												setRascunho({
													...rascunho,
													fonte: e.target.value as Turma["fonte"],
												})
											}
											className="mt-1 w-full bg-transparent text-sm text-gray-800 outline-none"
										>
											<option value="SANS">Sem serifa</option>
											<option value="SERIF">Com serifa</option>
											<option value="MONO">Monoespaçada</option>
										</select>
									</label>
								</div>
							</section>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<SearchSelect
									label="Docentes (professores e diretores)"
									icon={GraduationCap}
									selectedIds={rascunho.professorIds}
									onChange={(ids) =>
										setRascunho({
											...rascunho,
											professorIds: ids,
											professores: docentesDb
												.filter((p) => ids.includes(p.id))
												.map((p) => p.nome),
										})
									}
									options={docentesDb.map((p) => ({
										id: p.id,
										nome: p.nome,
										detalhe: p.role === "DIRETOR" ? "Diretor" : "Professor",
									}))}
									placeholder="Buscar professor ou diretor..."
									accent="#1A73E8"
									isLoading={carregandoProfessores || carregandoDiretores}
								/>
								<SearchSelect
									label="Monitores"
									icon={ShieldCheck}
									selectedIds={rascunho.monitorIds}
									onChange={(ids) =>
										setRascunho({
											...rascunho,
											monitorIds: ids,
											monitores: (monitoresDb ?? [])
												.filter((monitor) => ids.includes(monitor.id))
												.map((monitor) => monitor.nome),
										})
									}
									options={(monitoresDb ?? []).map((monitor) => ({
										id: monitor.id,
										nome: monitor.nome,
										detalhe: monitor.matricula,
									}))}
									placeholder="Buscar monitor..."
									accent="#188038"
									isLoading={carregandoMonitores}
								/>
							</div>

							<SearchSelect
								label="Alunos"
								icon={Users}
								selectedIds={rascunho.alunoIds}
								onChange={(ids) =>
									setRascunho({
										...rascunho,
										alunoIds: ids,
										alunos: (alunosDb ?? [])
											.filter((aluno) => ids.includes(aluno.id))
											.map((aluno) => aluno.nome),
									})
								}
								options={(alunosDb ?? []).map((aluno) => ({
									id: aluno.id,
									nome: aluno.nome,
									detalhe: aluno.cpf,
								}))}
								placeholder="Buscar aluno..."
								accent="#9334E6"
								isLoading={carregandoAlunos}
							/>

							<div className="pt-2 border-t border-gray-100">
								<MateriaisEditor
									materiais={rascunho.materiais}
									onChange={(m) => setRascunho({ ...rascunho, materiais: m })}
								/>
							</div>

							<div className="pt-2 border-t border-gray-100">
								<AulasEditor
									aulas={rascunho.aulas}
									onChange={(a) => setRascunho({ ...rascunho, aulas: a })}
								/>
							</div>
						</div>

						<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
							<button
								onClick={cancelar}
								className="min-h-11 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
							>
								Cancelar
							</button>
							<button
								onClick={salvar}
								disabled={
									!rascunho.titulo.trim() ||
									!rascunho.semestreId ||
									criar.isPending ||
									atualizar.isPending
								}
								className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
							>
								<Check className="w-4 h-4" />
								{criar.isPending || atualizar.isPending
									? "Salvando..."
									: "Salvar turma"}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
