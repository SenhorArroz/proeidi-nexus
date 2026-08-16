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
} from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";

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
});

// Preenche com valores padrão qualquer campo ausente — protege contra dados
// vindos de uma API/formato antigo que não tenham todas as propriedades.
function normalizarTurma(t: Partial<Turma> & { id: string }): Turma {
	return {
		id: t.id,
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
	const selecionados = options.filter((opcao) => selectedIds.includes(opcao.id));
	const resultados = options
		.filter((opcao) => !selectedIds.includes(opcao.id))
		.filter((opcao) => !buscaNormalizada || normalizarBusca(`${opcao.nome} ${opcao.detalhe ?? ""}`).includes(buscaNormalizada))
		.slice(0, 6);

	const selecionar = (id: string) => {
		onChange([...selectedIds, id]);
		setQuery("");
		setOpen(false);
	};

	const remover = (id: string) => onChange(selectedIds.filter((value) => value !== id));

	return (
		<div>
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<Icon className="w-3.5 h-3.5" />
				{label}
			</label>

			<div className="flex flex-wrap gap-1.5 mb-2 min-h-[1.75rem]">
				{selecionados.map((opcao) => (
					<span
						key={opcao.id}
						className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
						style={{ backgroundColor: `${accent}1A`, color: accent }}
					>
						{opcao.nome}
						<button
							onClick={() => remover(opcao.id)}
							className="p-0.5 rounded-full hover:bg-black/10"
							aria-label={`Remover ${opcao.nome}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
				{selectedIds.length === 0 && (
					isLoading ? <span className="h-4 w-28 animate-pulse rounded bg-slate-200" /> : <span className="text-xs text-gray-400 py-1">Nenhum selecionado</span>
				)}
			</div>

			<div ref={containerRef} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
					<input
						disabled={isLoading}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setOpen(true)}
						onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}
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
									className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
								>
									<span className="block truncate">{opcao.nome}</span>
									{opcao.detalhe && <span className="mt-0.5 block truncate text-xs text-slate-500">{opcao.detalhe}</span>}
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
						className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2"
					>
						<span className="text-xs font-semibold text-sky-600 bg-sky-50 rounded-md px-2 py-1 flex-shrink-0">
							{formatarData(aula.data)}
						</span>
						<span className="flex-1 min-w-0 text-sm text-gray-700 truncate">
							{aula.titulo}
						</span>
						<span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-800">{aula.tipo.charAt(0) + aula.tipo.slice(1).toLowerCase()}</span>
						<button
							onClick={() => remover(aula.id)}
							className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
							aria-label="Remover aula"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
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
				<select value={tipo} onChange={(e) => setTipo(e.target.value as Aula["tipo"])} className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-sky-300 focus:outline-none">
					<option value="AULA">Aula</option><option value="FERIADO">Feriado</option><option value="CANCELADA">Cancelada</option><option value="ESPECIAL">Especial</option>
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
								className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
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
		<div className="group overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.14)]">
			<div className="relative overflow-hidden bg-sky-600 px-5 py-4">
				<div className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full bg-orange-500" />
				<div className="relative flex items-start justify-between gap-2">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
							<DoorOpen className="w-4.5 h-4.5 text-white" />
						</div>
						<span className="text-sm font-semibold text-white truncate">
							{turma.titulo}
						</span>
					</div>
					<div className="relative flex items-center gap-1 flex-shrink-0">
						<button
							onClick={onEditar}
							className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white"
							aria-label="Editar turma"
						>
							<Pencil className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onDuplicar}
							disabled={duplicando}
							className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-60"
							aria-label="Duplicar turma"
							title="Duplicar turma"
						>
							<Copy className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onExcluir}
							className="p-1.5 rounded-lg text-white/80 hover:bg-white/20 hover:text-white"
							aria-label="Excluir turma"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>

			<div className="p-5">
				<p className="mb-3 truncate text-xs font-medium text-slate-600">
					{turma.professores?.length > 0
						? turma.professores.join(", ")
						: "Sem professor definido"}
					{turma.monitores?.length > 0 &&
						` · ${turma.monitores.join(", ")} (monitor)`}
				</p>

				<div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
					<span className="flex items-center gap-1.5">
						<Users className="w-3.5 h-3.5" />
						{turma.alunos?.length ?? 0} alunos
					</span>
					<span className="flex items-center gap-1.5">
						<CalendarDays className="w-3.5 h-3.5" />
						{turma.aulas?.length ?? 0} aulas
					</span>
					{turma.materiais?.length > 0 && (
						<span className="flex items-center gap-1.5">
							<FolderOpen className="w-3.5 h-3.5" />
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

export default function TurmasDiretoria() {
	const utils = api.useUtils();
	const [semestreSelecionadoId, setSemestreSelecionadoId] = useState("");
	const { data: semestres, isLoading: carregandoSemestres } = api.diretoria.semestres.list.useQuery();
	const semestreSelecionado =
		semestres?.find((s) => s.id === semestreSelecionadoId) ??
		semestres?.find((s) => s.ativo) ??
		semestres?.[0];
	const { data: turmasDb, isLoading: carregandoTurmas } = api.diretoria.turmas.list.useQuery(
		semestreSelecionado ? { semestreId: semestreSelecionado.id } : undefined,
		{ enabled: Boolean(semestreSelecionado) },
	);
	const { data: professoresDb, isLoading: carregandoProfessores } = api.diretoria.usuarios.list.useQuery({
		role: "PROFESSOR",
	});
	const { data: diretoresDb, isLoading: carregandoDiretores } = api.diretoria.usuarios.list.useQuery({
		role: "DIRETOR",
	});
	const { data: monitoresDb, isLoading: carregandoMonitores } = api.diretoria.usuarios.list.useQuery({
		role: "MONITOR",
	});
	const { data: alunosDb, isLoading: carregandoAlunos } = api.aluno.list.useQuery(
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
		onError: (erro) => alert(`Não foi possível duplicar a turma: ${erro.message}`),
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

	const salvar = () => {
		if (!rascunho.titulo.trim() || !rascunho.semestreId) return;
		const payload = {
			semestreId: rascunho.semestreId,
			titulo: rascunho.titulo,
			sala: rascunho.sala.trim() || null,
			horario: rascunho.horario.trim() || null,
			cor: "#1A73E8",
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
		if (editandoId) {
			atualizar.mutate({ ...payload, id: editandoId });
		} else {
			criar.mutate(payload);
		}
		setModo("lista");
	};

	const excluir = (id: string) => {
		if (confirm("Excluir esta turma? Essa ação não pode ser desfeita.")) {
			remover.mutate({ id });
		}
	};

	const duplicarTurma = (id: string) => duplicar.mutate({ id });

	return (
		<div className="min-h-screen w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6"><DiretoriaPageIntro icon={DoorOpen} title="Gerenciar turmas" description="Cadastro de turmas, professores, monitores, alunos e aulas." /></div>

			<div className="w-full max-w-5xl">
				{modo === "lista" ? (
					<>
						<div className="flex items-center justify-between mb-4">
							<div className="flex items-center gap-3">
								<label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
									Semestre
								</label>
								<select
									value={semestreSelecionado?.id ?? ""}
									onChange={(e) => setSemestreSelecionadoId(e.target.value)}
									className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700"
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
								className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
							>
								<Plus className="w-4 h-4" />
								Nova turma
							</button>
						</div>

						{carregandoSemestres || carregandoTurmas ? <DataSkeleton cards={4} /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
						</div>}

						{!carregandoSemestres && !carregandoTurmas && turmas.length === 0 && (
							<div className="text-center py-16 text-sm text-gray-400">
								Nenhuma turma cadastrada ainda
							</div>
						)}
					</>
				) : (
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
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

						<div className="p-6 space-y-6">
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
										Ao trocar o semestre, os alunos vinculados à turma também serão movidos e seus vínculos com turmas do período anterior serão removidos.
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
								<div><label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">Local</label><input value={rascunho.sala} onChange={(e) => setRascunho({ ...rascunho, sala: e.target.value })} placeholder="Ex: Sala 204" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:border-sky-300 focus:bg-white focus:outline-none" /></div>
								<div><label className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500">Horário</label><input value={rascunho.horario} onChange={(e) => setRascunho({ ...rascunho, horario: e.target.value })} placeholder="Ex: Seg e Qua · 14:00 – 16:00" className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:border-sky-300 focus:bg-white focus:outline-none" /></div>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<SearchSelect
									label="Docentes (professores e diretores)"
									icon={GraduationCap}
									selectedIds={rascunho.professorIds}
									onChange={(ids) => setRascunho({ ...rascunho, professorIds: ids, professores: docentesDb.filter((p) => ids.includes(p.id)).map((p) => p.nome) })}
									options={docentesDb.map((p) => ({ id: p.id, nome: p.nome, detalhe: p.role === "DIRETOR" ? "Diretor" : "Professor" }))}
									placeholder="Buscar professor ou diretor..."
									accent="#1A73E8"
									isLoading={carregandoProfessores || carregandoDiretores}
								/>
								<SearchSelect
									label="Monitores"
									icon={ShieldCheck}
									selectedIds={rascunho.monitorIds}
									onChange={(ids) => setRascunho({ ...rascunho, monitorIds: ids, monitores: (monitoresDb ?? []).filter((monitor) => ids.includes(monitor.id)).map((monitor) => monitor.nome) })}
									options={(monitoresDb ?? []).map((monitor) => ({ id: monitor.id, nome: monitor.nome, detalhe: monitor.matricula }))}
									placeholder="Buscar monitor..."
									accent="#188038"
									isLoading={carregandoMonitores}
								/>
							</div>

							<SearchSelect
								label="Alunos"
								icon={Users}
								selectedIds={rascunho.alunoIds}
								onChange={(ids) => setRascunho({ ...rascunho, alunoIds: ids, alunos: (alunosDb ?? []).filter((aluno) => ids.includes(aluno.id)).map((aluno) => aluno.nome) })}
								options={(alunosDb ?? []).map((aluno) => ({ id: aluno.id, nome: aluno.nome, detalhe: aluno.cpf }))}
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

						<div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
							<button
								onClick={cancelar}
								className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors"
							>
								Cancelar
							</button>
							<button
								onClick={salvar}
								disabled={!rascunho.titulo.trim() || !rascunho.semestreId}
								className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 disabled:opacity-50 transition-colors"
							>
								<Check className="w-4 h-4" />
								Salvar turma
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
