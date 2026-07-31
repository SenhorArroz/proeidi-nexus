'use client';

import { useState } from "react";
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
} from "lucide-react";

// ---------------------------------------------------------------------------
// Tipos e dados de exemplo
// ---------------------------------------------------------------------------

type TabId = "inicio" | "materiais" | "anotacoes" | "presenca-alunos" | "presenca-monitores";

const TURMA = {
  nome: "Smartphone mais do que Avançado",
  sala: "Sala 204",
  professores: "Thales e Paulo",
  cor: "#1A73E8",
  alunos: 28,
};

const AVISOS = [
  { id: "1", autor: "Thales", fixado: true, texto: "Próxima aula traremos os próprios celulares para praticarmos configuração de segurança.", quando: "Hoje, 09:12" },
  { id: "2", autor: "Paulo", fixado: false, texto: "Turma, o material da última aula já está disponível na aba Materiais.", quando: "Ontem, 17:30" },
  { id: "3", autor: "Thales", fixado: false, texto: "Não haverá aula na próxima sexta-feira (feriado municipal).", quando: "Seg, 08:00" },
];

const MATERIAIS = [
  { id: "1", nome: "Apostila — Módulo 1", tipo: "pdf" as const, quando: "12/07" },
  { id: "2", nome: "Slides — Configurações de segurança", tipo: "slide" as const, quando: "15/07" },
  { id: "3", nome: "Vídeo tutorial — Backup na nuvem", tipo: "link" as const, quando: "18/07" },
  { id: "4", nome: "Prints do exercício em sala", tipo: "imagem" as const, quando: "22/07" },
];

const ANOTACOES = [
  { id: "1", titulo: "Dúvidas recorrentes sobre Wi-Fi", data: "22/07" },
  { id: "2", titulo: "Alunos com dificuldade — acompanhar", data: "18/07" },
  { id: "3", titulo: "Ideia para próxima dinâmica em grupo", data: "10/07" },
];

const ALUNOS = [
  { id: "1", nome: "Maria Helena Souza", presente: true },
  { id: "2", nome: "João Carlos Pereira", presente: true },
  { id: "3", nome: "Antônia Ferreira Lima", presente: false },
  { id: "4", nome: "José Roberto Alves", presente: true },
  { id: "5", nome: "Francisca Nunes Costa", presente: true },
];

const MONITORES = [
  { id: "1", nome: "Beatriz Cardoso", presente: true },
  { id: "2", nome: "Lucas Martins", presente: false },
];

const MATERIAL_ICON: Record<string, React.ElementType> = {
  pdf: FileText,
  slide: FileText,
  link: Link2,
  imagem: ImageIcon,
};

// ---------------------------------------------------------------------------
// Sub-telas
// ---------------------------------------------------------------------------

function InicioView() {
  return (
    <div className="px-4 py-5 space-y-5">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ backgroundColor: TURMA.cor }}>
            TP
          </div>
          <p className="text-xs text-gray-500">{TURMA.professores}</p>
          <span className="text-gray-300">·</span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            {TURMA.sala}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Users className="w-3.5 h-3.5" />
          {TURMA.alunos} alunos matriculados
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Avisos</h3>
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
          <Plus className="w-3.5 h-3.5" />
          Novo aviso
        </button>
      </div>

      <div className="space-y-3">
        {AVISOS.map((aviso) => (
          <div key={aviso.id} className="bg-white rounded-2xl border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0" style={{ backgroundColor: TURMA.cor }}>
                  {aviso.autor[0]}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{aviso.autor}</p>
                  <p className="text-[11px] text-gray-400">{aviso.quando}</p>
                </div>
              </div>
              {aviso.fixado && <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{aviso.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MateriaisView() {
  return (
    <div className="px-4 py-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">Materiais da turma</h3>
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
          <Plus className="w-3.5 h-3.5" />
          Adicionar
        </button>
      </div>

      {MATERIAIS.map((m) => {
        const Icon = MATERIAL_ICON[m.tipo];
        return (
          <div key={m.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-3.5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TURMA.cor}1A` }}>
              <Icon className="w-5 h-5" style={{ color: TURMA.cor }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{m.nome}</p>
              <p className="text-xs text-gray-400">Adicionado em {m.quando}</p>
            </div>
            <button className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 flex-shrink-0">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function AnotacoesView() {
  return (
    <div className="px-4 py-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">Minhas anotações</h3>
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
          <Plus className="w-3.5 h-3.5" />
          Nova nota
        </button>
      </div>

      {ANOTACOES.map((a) => (
        <div key={a.id} className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-3.5 hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${TURMA.cor}1A` }}>
            <NotebookPen className="w-5 h-5" style={{ color: TURMA.cor }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{a.titulo}</p>
            <p className="text-xs text-gray-400">{a.data}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PresencaView({
  titulo,
  pessoas,
}: {
  titulo: string;
  pessoas: { id: string; nome: string; presente: boolean }[];
}) {
  const [lista, setLista] = useState(pessoas);
  const presentes = lista.filter((p) => p.presente).length;

  const toggle = (id: string) =>
    setLista((prev) => prev.map((p) => (p.id === id ? { ...p, presente: !p.presente } : p)));

  return (
    <div className="px-4 py-5 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-medium text-gray-700">{titulo}</h3>
        <span className="text-xs text-gray-500">{presentes}/{lista.length} presentes</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {lista.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0" style={{ backgroundColor: TURMA.cor }}>
              {p.nome[0]}
            </div>
            <span className="flex-1 text-sm text-gray-800 truncate">{p.nome}</span>
            <button
              onClick={() => toggle(p.id)}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                p.presente ? "bg-green-100 text-green-600" : "bg-red-50 text-red-400"
              }`}
              aria-label={p.presente ? "Marcar ausente" : "Marcar presente"}
            >
              {p.presente ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
            </button>
          </div>
        ))}
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
  { id: "presenca-alunos", label: "Alunos", icon: ClipboardList },
  { id: "presenca-monitores", label: "Monitores", icon: ShieldCheck },
];

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function TurmaView() {
  const [tab, setTab] = useState<TabId>("inicio");

  return (
    <div className="flex flex-col h-screen w-full mx-auto text-gray-900 border-x border-gray-200">
      {/* Header da turma */}
      <div
        className="relative flex-shrink-0 px-4 pt-6 pb-5 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${TURMA.cor} 0%, ${TURMA.cor}CC 100%)` }}
      >
        <div className="absolute -right-8 -bottom-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute right-10 -top-8 w-20 h-20 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between mb-4">
          <div className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <BookOpen className="w-4.5 h-4.5 text-white" />
          </div>
          <button className="p-1.5 rounded-full text-white/80 hover:bg-white/20">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        <h1 className="relative text-lg font-semibold text-white leading-snug mb-1">{TURMA.nome}</h1>
        <p className="relative text-xs text-white/80">{TURMA.sala} · {TURMA.professores}</p>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 overflow-y-auto">
        {tab === "inicio" && <InicioView />}
        {tab === "materiais" && <MateriaisView />}
        {tab === "anotacoes" && <AnotacoesView />}
        {tab === "presenca-alunos" && <PresencaView titulo="Presença de alunos" pessoas={ALUNOS} />}
        {tab === "presenca-monitores" && <PresencaView titulo="Presença de monitores" pessoas={MONITORES} />}
      </div>

      {/* Bottom nav */}
      <nav className="flex-shrink-0 flex items-stretch bg-white border-t border-gray-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 relative"
            >
              {active && (
                <span
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                  style={{ backgroundColor: TURMA.cor }}
                />
              )}
              <Icon className={`w-5 h-5 ${active ? "" : "text-gray-400"}`} style={active ? { color: TURMA.cor } : undefined} />
              <span className={`text-[10px] ${active ? "font-medium" : "text-gray-400"}`} style={active ? { color: TURMA.cor } : undefined}>
                {t.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}