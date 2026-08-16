"use client";
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
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
  IdCard,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { PersonManagementCard } from "~/app/_components/diretoria/people-management-card";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface Monitor {
  id: string;
  nome: string;
  matricula: string;
  email: string;
  senha: string;
  turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
  turmasDetalhadas: { id: string; titulo: string; semestre: string }[];
}

const monitorVazio = (): Monitor => ({
  id: "",
  nome: "",
  matricula: "",
  email: "",
  senha: "",
  turmas: [],
  turmasDetalhadas: [],
});

function normalizarMonitor(m: Partial<Monitor> & { id: string }): Monitor {
  return {
    id: m.id,
    nome: m.nome ?? "",
    matricula: m.matricula ?? "",
    email: m.email ?? "",
    senha: m.senha ?? "",
    turmas: m.turmas ?? [],
    turmasDetalhadas: m.turmasDetalhadas ?? [],
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
// Card de monitor (lista)
// ---------------------------------------------------------------------------

function MonitorCard({
  monitor,
  onEditar,
  onExcluir,
  onDeclaracao,
}: {
  monitor: Monitor;
  onEditar: () => void;
  onExcluir: () => void;
  onDeclaracao: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {iniciais(monitor.nome) || "?"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{monitor.nome || "Sem nome"}</p>
            <p className="text-xs text-gray-500 truncate">{monitor.email || "Sem e-mail cadastrado"}</p>
            {monitor.matricula && (
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                Matrícula: {monitor.matricula}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={onDeclaracao}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-emerald-50 hover:text-emerald-700"
            aria-label="Gerar certificado PM"
            title="Gerar certificado PM"
          >
            <FileText className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onEditar}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Editar monitor"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onExcluir}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Excluir monitor"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100">
        {monitor.turmas.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {monitor.turmas.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
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

function downloadBase64Pdf(base64Data: string, filename: string) {
  const bytes = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
  const url = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function MonitoresDiretoria() {
	const utils = api.useUtils();
	const { data: monitoresDb, isLoading: carregandoMonitores } = api.diretoria.usuarios.list.useQuery({ role: "MONITOR" });
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
  const [monitores, setMonitores] = useState<Monitor[]>([]);
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Monitor>(monitorVazio());
  const [mostrarSenha, setMostrarSenha] = useState(false);

	useEffect(() => {
		if (!monitoresDb) return;
		setMonitores(monitoresDb.map((m) => ({ id: m.id, nome: m.nome, matricula: m.matricula, email: m.email, senha: "", turmas: m.turmasMonitor.map((v) => v.turma.titulo), turmasDetalhadas: m.turmasMonitor.map((v) => ({ id: v.turma.id, titulo: v.turma.titulo, semestre: v.turma.semestre.codigo })) })));
	}, [monitoresDb]);

	const gerarLote = () => {
		if (!monitores.length) return;
		gerarLoteDeclaracoes.mutate({ usuarioIds: monitores.map((monitor) => monitor.id), tipo: "monitor" });
	};

  const abrirNovo = () => {
    setEditandoId(null);
    setRascunho(monitorVazio());
    setMostrarSenha(true);
    setModo("form");
  };

  const abrirEdicao = (monitor: Monitor) => {
    setEditandoId(monitor.id);
    setRascunho(normalizarMonitor(monitor));
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
		atualizar.mutate({ id: editandoId, role: "MONITOR", nome: rascunho.nome, matricula: rascunho.matricula, email: rascunho.email });
    } else {
		criar.mutate({ role: "MONITOR", nome: rascunho.nome, matricula: rascunho.matricula, email: rascunho.email });
    }
    setModo("lista");
  };

  const excluir = (id: string) => {
    if (confirm("Excluir este monitor? O acesso dele será revogado imediatamente.")) {
		remover.mutate({ id, role: "MONITOR" });
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
		<div className="w-full max-w-5xl mb-6"><DiretoriaPageIntro icon={ShieldCheck} title="Gerenciar monitores" description="Cadastro, acesso e turmas vinculadas." /></div>

      <div className="w-full max-w-5xl">
        {modo === "lista" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                {monitores.length} monitores cadastrados
              </span>
			  <div className="flex items-center gap-2">
			  <button onClick={gerarLote} disabled={!monitores.length || gerarLoteDeclaracoes.isPending} className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60" title="Gera um único PDF com todos os certificados dos monitores listados.">
				{gerarLoteDeclaracoes.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
				{gerarLoteDeclaracoes.isPending ? "Gerando PDF..." : "Gerar lote"}
			  </button>
			  <button
                onClick={abrirNovo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-semibold shadow-sm shadow-sky-200 hover:bg-sky-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo monitor
              </button>
			  </div>
            </div>

			{carregandoMonitores ? <DataSkeleton cards={4} /> : <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {monitores.map((monitor) => (
                <PersonManagementCard key={monitor.id} person={monitor} role="monitor" onEdit={() => abrirEdicao(monitor)} onRemove={() => excluir(monitor.id)} onCertificate={() => gerarDeclaracao.mutate({ usuarioId: monitor.id, tipo: "monitor" })} />
              ))}
			</div>}

			{!carregandoMonitores && monitores.length === 0 && (
              <div className="text-center py-16 text-sm text-gray-400">
                Nenhum monitor cadastrado ainda
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
                {editandoId ? "Editar monitor" : "Novo monitor"}
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
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
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
                    placeholder="Ex: 20240012345"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
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
                    placeholder="monitor@proeidi.com.br"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
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
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
                      >
                        <DoorOpen className="w-3 h-3" />
                        {t}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">Este monitor ainda não está em nenhuma turma</p>
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
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold shadow-sm shadow-sky-200 hover:bg-sky-700 disabled:opacity-50 transition-colors"
              >
                <Check className="w-4 h-4" />
                Salvar monitor
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
