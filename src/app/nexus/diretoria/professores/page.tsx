"use client";
import React, { useEffect, useState } from "react";
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
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { PersonManagementCard } from "~/app/_components/diretoria/people-management-card";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
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
// Tipos
// ---------------------------------------------------------------------------

interface Professor {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  senha: string;
	role: "PROFESSOR" | "DIRETOR";
  turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
	 turmasDetalhadas: { id: string; titulo: string; semestre: string }[];
}

const professorVazio = (): Professor => ({
  id: "",
  nome: "",
  matricula: "",
  email: "",
  senha: "",
	role: "PROFESSOR",
  turmas: [],
	 turmasDetalhadas: [],
});

function normalizarProfessor(p: Partial<Professor> & { id: string }): Professor {
  return {
    id: p.id,
    nome: p.nome ?? "",
    matricula: p.matricula ?? "",
    email: p.email ?? "",
    senha: p.senha ?? "",
	role: p.role ?? "PROFESSOR",
    turmas: p.turmas ?? [],
	 turmasDetalhadas: p.turmasDetalhadas ?? [],
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
            aria-label="Gerar certificado PM"
            title="Gerar certificado PM"
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
	const [turmaId, setTurmaId] = useState(professor.turmasDetalhadas[0]?.id ?? "");
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
		usuarioId: professor.id,
		turmaId,
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

  const formValido = form.matricula.trim() && form.curso.trim() && turmaId;

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
			  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Turma de referência *</label>
			  <select value={turmaId} onChange={(e) => setTurmaId(e.target.value)} className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors">
				  <option value="">Selecione uma turma</option>
				  {professor.turmasDetalhadas.map((turma) => <option key={turma.id} value={turma.id}>{turma.titulo} — {turma.semestre}</option>)}
			  </select>
			  <p className="mt-1 text-[11px] text-gray-400">O semestre e as datas serão calculados pela primeira e última aula desta turma.</p>
		  </div>
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
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Data Fim
              </label>
              <input
                value={form.dataFim}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                Ano
              </label>
              <input
                value={form.ano}
                readOnly
                className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
              />
            </div>
          </div>
		  <p className="-mt-2 text-[11px] text-sky-700">As datas e o ano do documento são definidos automaticamente pelas aulas cadastradas na turma selecionada.</p>

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
	const utils = api.useUtils();
	const { data: professoresDb, isLoading: carregandoProfessores } = api.diretoria.usuarios.list.useQuery({ role: "PROFESSOR" });
	const { data: diretoresDb, isLoading: carregandoDiretores } = api.diretoria.usuarios.list.useQuery({ role: "DIRETOR" });
	const criar = api.diretoria.usuarios.create.useMutation({ onSuccess: () => utils.diretoria.usuarios.list.invalidate() });
	const atualizar = api.diretoria.usuarios.update.useMutation({ onSuccess: () => utils.diretoria.usuarios.list.invalidate() });
	const remover = api.diretoria.usuarios.remove.useMutation({ onSuccess: () => utils.diretoria.usuarios.list.invalidate() });
	const gerarDeclaracao = api.declaracao.gerarIndividual.useMutation({
		onSuccess: (data) => downloadBase64Pdf(data.arquivoBase64, data.nomeArquivo || "Certificado_PM.pdf"),
		onError: (err) => alert(`Erro ao gerar certificado PM: ${err.message}`),
	});
	const gerarLoteDeclaracoes = api.declaracao.gerarLoteUsuarios.useMutation({
		onSuccess: (data) => downloadBase64Pdf(data.arquivoBase64, data.nomeArquivo),
		onError: (err) => alert(`Erro ao gerar o lote de certificados: ${err.message}`),
	});
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Professor>(professorVazio());
  const [mostrarSenha, setMostrarSenha] = useState(false);

	useEffect(() => {
		if (!professoresDb || !diretoresDb) return;
		setProfessores([...professoresDb, ...diretoresDb].map((p) => ({ id: p.id, nome: p.nome, matricula: p.matricula, email: p.email, senha: "", role: p.role as "PROFESSOR" | "DIRETOR", turmas: p.turmasProfessor.map((v) => v.turma.titulo), turmasDetalhadas: p.turmasProfessor.map((v) => ({ id: v.turma.id, titulo: v.turma.titulo, semestre: v.turma.semestre.codigo })) })));
	}, [professoresDb, diretoresDb]);

	const gerarLote = () => {
		if (!professores.length) return;
		gerarLoteDeclaracoes.mutate({ usuarioIds: professores.map((professor) => professor.id), tipo: "professor" });
	};

  const abrirNovo = () => {
    setEditandoId(null);
    setRascunho(professorVazio());
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
      !rascunho.email.trim()
    )
      return;
    if (editandoId) {
		atualizar.mutate({ id: editandoId, role: "PROFESSOR", nome: rascunho.nome, matricula: rascunho.matricula, email: rascunho.email });
    } else {
		criar.mutate({ role: "PROFESSOR", nome: rascunho.nome, matricula: rascunho.matricula, email: rascunho.email });
    }
    setModo("lista");
  };

  const excluir = (id: string) => {
    if (confirm("Excluir este professor? O acesso dele será revogado imediatamente.")) {
		remover.mutate({ id, role: "PROFESSOR" });
    }
  };

  const formValido =
    rascunho.nome.trim() &&
    rascunho.matricula.trim() &&
    rascunho.email.trim();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
      <div className="w-full max-w-5xl">
		<DiretoriaBackLink />
      </div>
      {/* Banner de topo */}
		<div className="w-full max-w-5xl mb-6"><DiretoriaPageIntro icon={Users} title="Gerenciar professores" description="Cadastro, acesso e turmas vinculadas." /></div>

      <div className="w-full max-w-5xl">
        {modo === "lista" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                {professores.length} docentes cadastrados
              </span>
			  <div className="flex items-center gap-2">
			  <button onClick={gerarLote} disabled={!professores.length || gerarLoteDeclaracoes.isPending} className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" title="Gera um único PDF com todos os certificados dos docentes listados.">
				{gerarLoteDeclaracoes.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
				{gerarLoteDeclaracoes.isPending ? "Gerando PDF..." : "Gerar lote"}
			  </button>
			  <button
                onClick={abrirNovo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo professor
              </button>
			  </div>
            </div>

			{carregandoProfessores || carregandoDiretores ? <DataSkeleton cards={4} /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {professores.map((professor) => (
                <PersonManagementCard key={professor.id} person={professor} role="professor" roleLabel={professor.role === "DIRETOR" ? "Diretor · docente" : undefined} onEdit={professor.role === "PROFESSOR" ? () => abrirEdicao(professor) : undefined} onRemove={professor.role === "PROFESSOR" ? () => excluir(professor.id) : undefined} onCertificate={() => gerarDeclaracao.mutate({ usuarioId: professor.id, tipo: "professor" })} />
              ))}
			</div>}

			{!carregandoProfessores && !carregandoDiretores && professores.length === 0 && (
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
				<p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">A senha de acesso é a matrícula informada acima. Alterar a matrícula redefine a senha.</p>
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
    </div>
  );
}
