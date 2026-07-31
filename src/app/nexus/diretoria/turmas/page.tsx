"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  DoorOpen,
  Plus,
  Pencil,
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
import BotaoVoltar from "~/app/_components/botaoVoltar";

// ---------------------------------------------------------------------------
// "Banco de dados" mock — em produção isso viria de uma busca via API
// ---------------------------------------------------------------------------

const PROFESSORES_DB = [
  "Thales",
  "Paulo",
  "Marina Alves",
  "Rafael Souza",
  "Camila Ferreira",
  "Eduardo Lima",
  "Patrícia Gomes",
];

const MONITORES_DB = ["Beatriz Cardoso", "Lucas Martins", "Fernanda Dias", "Gabriel Rocha"];

const ALUNOS_DB = [
  "Maria Helena Souza",
  "João Carlos Pereira",
  "Antônia Ferreira Lima",
  "José Roberto Alves",
  "Francisca Nunes Costa",
  "Carlos Eduardo Ramos",
  "Juliana Prado",
  "Marcos Vinícius",
  "Larissa Martins",
  "Pedro Henrique Souza",
];

// ---------------------------------------------------------------------------
// Tipos e dados de exemplo
// ---------------------------------------------------------------------------

interface Aula {
  id: string;
  data: string; // yyyy-mm-dd
  titulo: string;
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
  titulo: string;
  professores: string[];
  monitores: string[];
  alunos: string[];
  materiais: Material[];
  aulas: Aula[];
}

const TURMAS_INICIAIS: Turma[] = [
  {
    id: "1",
    titulo: "Smartphone mais do que Avançado",
    professores: ["Thales", "Paulo"],
    monitores: ["Beatriz Cardoso"],
    alunos: ["Maria Helena Souza", "João Carlos Pereira", "Antônia Ferreira Lima"],
    materiais: [
      { id: "m1", titulo: "Apostila — Configurações de segurança", tipo: "pdf", url: "" },
      { id: "m2", titulo: "Vídeo — Backup na nuvem", tipo: "link", url: "https://youtube.com" },
    ],
    aulas: [
      { id: "a1", data: "2026-07-14", titulo: "Introdução ao sistema Android" },
      { id: "a2", data: "2026-07-21", titulo: "Configurações de segurança" },
    ],
  },
  {
    id: "2",
    titulo: "Excel para o dia a dia",
    professores: ["Marina Alves"],
    monitores: [],
    alunos: ["José Roberto Alves", "Francisca Nunes Costa"],
    materiais: [],
    aulas: [{ id: "a3", data: "2026-07-15", titulo: "Fórmulas básicas" }],
  },
];

const turmaVazia = (): Turma => ({
  id: "",
  titulo: "",
  professores: [],
  monitores: [],
  alunos: [],
  materiais: [],
  aulas: [],
});

// Preenche com valores padrão qualquer campo ausente — protege contra dados
// vindos de uma API/formato antigo que não tenham todas as propriedades.
function normalizarTurma(t: Partial<Turma> & { id: string }): Turma {
  return {
    id: t.id,
    titulo: t.titulo ?? "",
    professores: t.professores ?? [],
    monitores: t.monitores ?? [],
    alunos: t.alunos ?? [],
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
  values: string[] | undefined;
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
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
        {values.length === 0 && <span className="text-xs text-gray-400 py-1">Nenhum selecionado</span>}
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
              resultados.map((opt) => (
                <button
                  key={opt}
                  onClick={() => selecionar(opt)}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                >
                  {opt}
                </button>
              ))
            ) : (
              <p className="px-3 py-2.5 text-xs text-gray-400">Nenhum resultado na busca</p>
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

function AulasEditor({ aulas = [], onChange }: { aulas: Aula[] | undefined; onChange: (a: Aula[]) => void }) {
  const [data, setData] = useState("");
  const [titulo, setTitulo] = useState("");

  const adicionar = () => {
    if (!data || !titulo.trim()) return;
    const nova: Aula = { id: Date.now().toString(), data, titulo: titulo.trim() };
    const atualizadas = [...aulas, nova].sort((a, b) => a.data.localeCompare(b.data));
    onChange(atualizadas);
    setData("");
    setTitulo("");
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
            <span className="flex-1 min-w-0 text-sm text-gray-700 truncate">{aula.titulo}</span>
            <button
              onClick={() => remover(aula.id)}
              className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:bg-red-50 hover:text-red-500"
              aria-label="Remover aula"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {aulas.length === 0 && <p className="text-xs text-gray-400 py-1">Nenhuma aula cadastrada</p>}
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
        />
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
    const novo: Material = { id: Date.now().toString(), titulo: titulo.trim(), tipo, url: url.trim() };
    onChange([...materiais, novo]);
    setTitulo("");
    setUrl("");
  };

  const remover = (id: string) => onChange(materiais.filter((m) => m.id !== id));

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        <FolderOpen className="w-3.5 h-3.5" />
        Materiais
        <span className="normal-case text-gray-400">(links, PDFs, etc — opcional)</span>
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
                <p className="text-sm text-gray-700 truncate">{material.titulo}</p>
                {material.url && <p className="text-xs text-gray-400 truncate">{material.url}</p>}
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
        {materiais.length === 0 && <p className="text-xs text-gray-400 py-1">Nenhum material adicionado</p>}
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
  onExcluir,
}: {
  turma: Turma;
  onEditar: () => void;
  onExcluir: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="relative px-5 py-4 bg-gradient-to-br from-sky-600 to-sky-500 overflow-hidden">
        <div className="absolute -right-6 -bottom-8 w-24 h-24 rounded-full bg-white/10" />
        <div className="relative flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <DoorOpen className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white truncate">{turma.titulo}</span>
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
        <p className="text-xs text-gray-500 mb-3 truncate">
          {turma.professores?.length > 0 ? turma.professores.join(", ") : "Sem professor definido"}
          {turma.monitores?.length > 0 && ` · ${turma.monitores.join(", ")} (monitor)`}
        </p>

        <div className="flex items-center gap-4 text-xs text-gray-500">
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
  const [turmas, setTurmas] = useState<Turma[]>(TURMAS_INICIAIS.map(normalizarTurma));
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Turma>(turmaVazia());

  const abrirNova = () => {
    setEditandoId(null);
    setRascunho(turmaVazia());
    setModo("form");
  };

  const abrirEdicao = (turma: Turma) => {
    setEditandoId(turma.id);
    setRascunho(normalizarTurma(turma));
    setModo("form");
  };

  const cancelar = () => setModo("lista");

  const salvar = () => {
    if (!rascunho.titulo.trim()) return;
    if (editandoId) {
      setTurmas((prev) => prev.map((t) => (t.id === editandoId ? { ...rascunho, id: editandoId } : t)));
    } else {
      setTurmas((prev) => [{ ...rascunho, id: Date.now().toString() }, ...prev]);
    }
    setModo("lista");
  };

  const excluir = (id: string) => {
    if (confirm("Excluir esta turma? Essa ação não pode ser desfeita.")) {
      setTurmas((prev) => prev.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
      <div className="w-full max-w-5xl">
        <BotaoVoltar href="/nexus/diretoria" label="Voltar para Diretoria" />
      </div>
      {/* Banner de topo */}
      <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden mb-8 px-8 py-8 bg-gradient-to-br from-sky-600 to-sky-500">
        <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <DoorOpen className="w-5 h-5 text-white" />
        </div>
        <h1 className="relative text-2xl font-semibold text-white leading-snug mb-1">Gerenciar turmas</h1>
        <p className="relative text-sm text-white/80">Cadastro de turmas, professores, monitores, alunos e aulas</p>
      </div>

      <div className="w-full max-w-5xl">
        {modo === "lista" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">{turmas.length} turmas cadastradas</span>
              <button
                onClick={abrirNova}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nova turma
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {turmas.map((turma) => (
                <TurmaCard
                  key={turma.id}
                  turma={turma}
                  onEditar={() => abrirEdicao(turma)}
                  onExcluir={() => excluir(turma.id)}
                />
              ))}
            </div>

            {turmas.length === 0 && (
              <div className="text-center py-16 text-sm text-gray-400">Nenhuma turma cadastrada ainda</div>
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
              {/* Título */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Título da turma
                </label>
                <input
                  value={rascunho.titulo}
                  onChange={(e) => setRascunho({ ...rascunho, titulo: e.target.value })}
                  placeholder="Ex: Smartphone mais do que Avançado"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SearchSelect
                  label="Professores"
                  icon={GraduationCap}
                  values={rascunho.professores}
                  onChange={(v) => setRascunho({ ...rascunho, professores: v })}
                  options={PROFESSORES_DB}
                  placeholder="Buscar professor..."
                  accent="#1A73E8"
                />
                <SearchSelect
                  label="Monitores"
                  icon={ShieldCheck}
                  values={rascunho.monitores}
                  onChange={(v) => setRascunho({ ...rascunho, monitores: v })}
                  options={MONITORES_DB}
                  placeholder="Buscar monitor..."
                  accent="#188038"
                />
              </div>

              <SearchSelect
                label="Alunos"
                icon={Users}
                values={rascunho.alunos}
                onChange={(v) => setRascunho({ ...rascunho, alunos: v })}
                options={ALUNOS_DB}
                placeholder="Buscar aluno..."
                accent="#9334E6"
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
                disabled={!rascunho.titulo.trim()}
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