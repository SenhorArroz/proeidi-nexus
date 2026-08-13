"use client";
import React, { useState } from "react";
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  Check,
  ArrowLeft,
  Mail,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  DoorOpen,
  Info,
  FileText,
  X,
  Loader2,
  IdCard,
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Helper — download base64 PDF
// ---------------------------------------------------------------------------

function downloadBase64Pdf(base64Data: string, filename: string) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Tipos e dados de exemplo
// ---------------------------------------------------------------------------

interface Professor {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  senha: string;
  turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
}

const PROFESSORES_INICIAIS: Professor[] = [
  {
    id: "1",
    nome: "Thales",
    matricula: "20230011221",
    email: "thales@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Smartphone mais do que Avançado"],
  },
  {
    id: "2",
    nome: "Paulo",
    matricula: "20230011222",
    email: "paulo@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Smartphone mais do que Avançado"],
  },
  {
    id: "3",
    nome: "Marina Alves",
    matricula: "20230011223",
    email: "marina.alves@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Excel para o dia a dia", "Introdução ao Word"],
  },
  {
    id: "4",
    nome: "Rafael Souza",
    matricula: "20230011224",
    email: "rafael.souza@proeidi.com.br",
    senha: "trocar123",
    turmas: [],
  },
];

const professorVazio = (): Professor => ({
  id: "",
  nome: "",
  matricula: "",
  email: "",
  senha: "",
  turmas: [],
});

function normalizarProfessor(p: Partial<Professor> & { id: string }): Professor {
  return {
    id: p.id,
    nome: p.nome ?? "",
    matricula: p.matricula ?? "",
    email: p.email ?? "",
    senha: p.senha ?? "",
    turmas: p.turmas ?? [],
  };
}

function gerarSenha() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let senha = "";
  for (let i = 0; i < 10; i++) {
    senha += chars[Math.floor(Math.random() * chars.length)];
  }
  return senha;
}

function iniciais(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// ---------------------------------------------------------------------------
// Interface do formulário de declaração
// ---------------------------------------------------------------------------

interface DeclaracaoForm {
  matricula: string;
  genero: "masculino" | "feminino";
  curso: string;
  dataInicio: string;
  dataFim: string;
  ano: string;
  cargaHoraria: string;
  nomeProjeto: string;
  codigoProjeto: string;
}

const declaracaoFormPadrao = (): DeclaracaoForm => ({
  matricula: "",
  genero: "masculino",
  curso: "",
  dataInicio: "11 de abril",
  dataFim: "20 de junho",
  ano: "2026",
  cargaHoraria: "54 horas",
  nomeProjeto: "Projeto de Extensão de Inclusão Digital para Pessoas Idosas",
  codigoProjeto: "PJ457-2026",
});

// ---------------------------------------------------------------------------
// Card de professor (lista)
// ---------------------------------------------------------------------------

function ProfessorCard({
  professor,
  onEditar,
  onExcluir,
  onDeclaracao,
}: {
  professor: Professor;
  onEditar: () => void;
  onExcluir: () => void;
  onDeclaracao: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-amber-500/20 text-sky-500 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {iniciais(professor.nome) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{professor.nome || "Sem nome"}</p>
            <p className="text-xs text-gray-500 truncate">{professor.email || "Sem e-mail cadastrado"}</p>
            {professor.matricula && (
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                Matrícula: {professor.matricula}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onDeclaracao}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600"
            aria-label="Gerar declaração"
            title="Gerar declaração"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEditar}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Editar professor"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExcluir}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Excluir professor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        {professor.turmas.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {professor.turmas.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700"
              >
                <DoorOpen className="w-3 h-3" />
                {t}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">Nenhuma turma atribuída</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Modal de Declaração
// ---------------------------------------------------------------------------

function ModalDeclaracao({
  professor,
  onClose,
}: {
  professor: Professor;
  onClose: () => void;
}) {
  const [form, setForm] = useState<DeclaracaoForm>({
    ...declaracaoFormPadrao(),
    matricula: professor.matricula || "",
    curso: professor.turmas.join(" e "),
  });

  const gerarMutation = api.declaracao.gerarIndividual.useMutation({
    onSuccess: (data) => {
      downloadBase64Pdf(
        data.arquivoBase64,
        data.nomeArquivo || "Declaracao.pdf",
      );
      onClose();
    },
    onError: (err) => {
      alert(`Erro ao gerar declaração: ${err.message}`);
    },
  });

  const handleGerar = () => {
    if (!form.matricula.trim() || !form.curso.trim()) return;
    gerarMutation.mutate({
      nome: professor.nome,
      matricula: form.matricula,
      curso: form.curso,
      dataInicio: form.dataInicio,
      dataFim: form.dataFim,
      ano: form.ano,
      cargaHoraria: form.cargaHoraria,
      tipo: "professor",
      genero: form.genero,
      nomeProjeto: form.nomeProjeto,
      codigoProjeto: form.codigoProjeto,
    });
  };

  const formValido = form.matricula.trim() && form.curso.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-semibold text-gray-900">Gerar Declaração — Professor</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nome (somente leitura) */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
              {iniciais(professor.nome) || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{professor.nome}</p>
              <p className="text-xs text-gray-500">{professor.email}</p>
            </div>
          </div>
        </div>

        {/* Campos */}
        <div className="px-6 py-5 space-y-4">
          {/* Linha: Matrícula + Gênero */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Matrícula *
              </label>
              <input
                value={form.matricula}
                onChange={(e) => setForm({ ...form, matricula: e.target.value })}
                placeholder="20250032396"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Gênero
              </label>
              <select
                value={form.genero}
                onChange={(e) => setForm({ ...form, genero: e.target.value as "masculino" | "feminino" })}
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              >
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
              </select>
            </div>
          </div>

          {/* Cursos */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Cursos ministrados *
            </label>
            <input
              value={form.curso}
              onChange={(e) => setForm({ ...form, curso: e.target.value })}
              placeholder="Pensamento Computacional e Computador"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
            />
            <p className="text-[11px] text-gray-400 mt-1">
              Use &quot;e&quot; para separar cursos. Ex: &quot;Smartphone Básico e Smartphone Avançado&quot;
            </p>
          </div>

          {/* Linha: Período */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Data Início
              </label>
              <input
                value={form.dataInicio}
                onChange={(e) => setForm({ ...form, dataInicio: e.target.value })}
                placeholder="11 de abril"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Data Fim
              </label>
              <input
                value={form.dataFim}
                onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
                placeholder="20 de junho"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Ano
              </label>
              <input
                value={form.ano}
                onChange={(e) => setForm({ ...form, ano: e.target.value })}
                placeholder="2026"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Carga Horária */}
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
              Carga Horária
            </label>
            <input
              value={form.cargaHoraria}
              onChange={(e) => setForm({ ...form, cargaHoraria: e.target.value })}
              placeholder="54 horas"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
            />
          </div>

          {/* Linha: Projeto */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Nome do Projeto
              </label>
              <input
                value={form.nomeProjeto}
                onChange={(e) => setForm({ ...form, nomeProjeto: e.target.value })}
                placeholder="Projeto de Extensão..."
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Código
              </label>
              <input
                value={form.codigoProjeto}
                onChange={(e) => setForm({ ...form, codigoProjeto: e.target.value })}
                placeholder="PJ457-2026"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Preview do texto */}
          <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">Prévia do texto</p>
            <p className="text-xs text-gray-600 leading-relaxed">
              Declaro, para os fins que se fizerem necessários, que{" "}
              <strong>{form.genero === "feminino" ? "a" : "o"} discente {professor.nome}</strong>
              , matrícula <strong>{form.matricula || "___"}</strong>
              , está {form.genero === "feminino" ? "vinculada" : "vinculado"} ao{" "}
              <strong>{form.nomeProjeto}</strong> (<strong>{form.codigoProjeto}</strong>)
              , no período de <strong>{form.dataInicio}</strong> a <strong>{form.dataFim}</strong> de{" "}
              <strong>{form.ano}</strong>, com uma carga horária total de{" "}
              <strong>{form.cargaHoraria}</strong>.{" "}
              {form.genero === "feminino" ? "A" : "O"} discente atuou como{" "}
              <strong>{form.genero === "feminino" ? "professora" : "professor"}</strong>{" "}
              {form.curso.includes(" e ") ? "dos cursos de" : "do curso de"}{" "}
              <strong>{form.curso || "___"}</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleGerar}
            disabled={!formValido || gerarMutation.isPending}
            className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 transition-colors"
          >
            {gerarMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            {gerarMutation.isPending ? "Gerando..." : "Gerar Declaração"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function ProfessoresDiretoria() {
  const [professores, setProfessores] = useState<Professor[]>(
    PROFESSORES_INICIAIS.map(normalizarProfessor)
  );
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Professor>(professorVazio());
  const [mostrarSenha, setMostrarSenha] = useState(false);

  // Estado do modal de declaração
  const [professorDeclaracao, setProfessorDeclaracao] = useState<Professor | null>(null);

  const abrirNovo = () => {
    setEditandoId(null);
    setRascunho({ ...professorVazio(), senha: gerarSenha() });
    setMostrarSenha(true);
    setModo("form");
  };

  const abrirEdicao = (professor: Professor) => {
    setEditandoId(professor.id);
    setRascunho(normalizarProfessor(professor));
    setMostrarSenha(false);
    setModo("form");
  };

  const cancelar = () => setModo("lista");

  const salvar = () => {
    if (
      !rascunho.nome.trim() ||
      !rascunho.matricula.trim() ||
      !rascunho.email.trim() ||
      !rascunho.senha.trim()
    )
      return;
    if (editandoId) {
      setProfessores((prev) =>
        prev.map((p) => (p.id === editandoId ? { ...rascunho, id: editandoId } : p))
      );
    } else {
      setProfessores((prev) => [{ ...rascunho, id: Date.now().toString() }, ...prev]);
    }
    setModo("lista");
  };

  const excluir = (id: string) => {
    if (confirm("Excluir este professor? O acesso dele será revogado imediatamente.")) {
      setProfessores((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const formValido =
    rascunho.nome.trim() &&
    rascunho.matricula.trim() &&
    rascunho.email.trim() &&
    rascunho.senha.trim();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
      <div className="w-full max-w-5xl">
        <BotaoVoltar href="/nexus/diretoria" label="Voltar para Diretoria" />
      </div>
      {/* Banner de topo */}
      <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden mb-8 px-8 py-8 bg-gradient-to-br from-amber-600 to-sky-500">
        <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <Users className="w-5 h-5 text-white" />
        </div>
        <h1 className="relative text-2xl font-semibold text-white leading-snug mb-1">Gerenciar professores</h1>
        <p className="relative text-sm text-white/80">Cadastro, acesso e turmas vinculadas</p>
      </div>

      <div className="w-full max-w-5xl">
        {modo === "lista" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                {professores.length} professores cadastrados
              </span>
              <button
                onClick={abrirNovo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo professor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {professores.map((professor) => (
                <ProfessorCard
                  key={professor.id}
                  professor={professor}
                  onEditar={() => abrirEdicao(professor)}
                  onExcluir={() => excluir(professor.id)}
                  onDeclaracao={() => setProfessorDeclaracao(professor)}
                />
              ))}
            </div>

            {professores.length === 0 && (
              <div className="text-center py-16 text-sm text-gray-400">
                Nenhum professor cadastrado ainda
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
                {editandoId ? "Editar professor" : "Novo professor"}
              </h2>
            </div>

            <div className="p-6 space-y-5">
              {/* Nome */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Nome
                </label>
                <input
                  value={rascunho.nome}
                  onChange={(e) => setRascunho({ ...rascunho, nome: e.target.value })}
                  placeholder="Nome completo"
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
                />
              </div>

              {/* Matrícula */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Matrícula
                </label>
                <div className="relative">
                  <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={rascunho.matricula}
                    onChange={(e) => setRascunho({ ...rascunho, matricula: e.target.value })}
                    placeholder="Ex: 20230011221"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Email de acesso */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  E-mail de acesso
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={rascunho.email}
                    onChange={(e) => setRascunho({ ...rascunho, email: e.target.value })}
                    placeholder="professor@proeidi.com.br"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Senha de acesso */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Senha de acesso
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={rascunho.senha}
                    onChange={(e) => setRascunho({ ...rascunho, senha: e.target.value })}
                    placeholder="Defina uma senha"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-20 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setRascunho({ ...rascunho, senha: gerarSenha() })}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      aria-label="Gerar senha aleatória"
                      title="Gerar senha aleatória"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((v) => !v)}
                      className="p-1.5 rounded-md text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                      aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {mostrarSenha ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Turmas (somente leitura) */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Turmas
                </label>
                {rascunho.turmas.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {rascunho.turmas.map((t) => (
                      <span
                        key={t}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sky-50 text-sky-700"
                      >
                        <DoorOpen className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">Este professor ainda não está em nenhuma turma</p>
                )}
                <p className="flex items-start gap-1.5 text-[11px] text-gray-400">
                  <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  O vínculo com turmas é feito na tela de Turmas, não aqui.
                </p>
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
                disabled={!formValido}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Salvar professor
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Declaração */}
      {professorDeclaracao && (
        <ModalDeclaracao
          professor={professorDeclaracao}
          onClose={() => setProfessorDeclaracao(null)}
        />
      )}
    </div>
  );
}