"use client";
import React, { useState } from "react";
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
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";

// ---------------------------------------------------------------------------
// Tipos e dados de exemplo
// ---------------------------------------------------------------------------

interface Monitor {
  id: string;
  nome: string;
  email: string;
  senha: string;
  turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
}

const MONITORES_INICIAIS: Monitor[] = [
  {
    id: "1",
    nome: "Beatriz Cardoso",
    email: "beatriz.cardoso@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Smartphone mais do que Avançado"],
  },
  {
    id: "2",
    nome: "Lucas Martins",
    email: "lucas.martins@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Excel para o dia a dia"],
  },
  {
    id: "3",
    nome: "Fernanda Dias",
    email: "fernanda.dias@proeidi.com.br",
    senha: "trocar123",
    turmas: ["Introdução ao Word", "Smartphone mais do que Avançado"],
  },
  {
    id: "4",
    nome: "Gabriel Rocha",
    email: "gabriel.rocha@proeidi.com.br",
    senha: "trocar123",
    turmas: [],
  },
];

const monitorVazio = (): Monitor => ({
  id: "",
  nome: "",
  email: "",
  senha: "",
  turmas: [],
});

function normalizarMonitor(m: Partial<Monitor> & { id: string }): Monitor {
  return {
    id: m.id,
    nome: m.nome ?? "",
    email: m.email ?? "",
    senha: m.senha ?? "",
    turmas: m.turmas ?? [],
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
}: {
  monitor: Monitor;
  onEditar: () => void;
  onExcluir: () => void;
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
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
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

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function MonitoresDiretoria() {
  const [monitores, setMonitores] = useState<Monitor[]>(
    MONITORES_INICIAIS.map(normalizarMonitor)
  );
  const [modo, setModo] = useState<"lista" | "form">("lista");
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [rascunho, setRascunho] = useState<Monitor>(monitorVazio());
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const abrirNovo = () => {
    setEditandoId(null);
    setRascunho({ ...monitorVazio(), senha: gerarSenha() });
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
    if (!rascunho.nome.trim() || !rascunho.email.trim() || !rascunho.senha.trim()) return;
    if (editandoId) {
      setMonitores((prev) =>
        prev.map((m) => (m.id === editandoId ? { ...rascunho, id: editandoId } : m))
      );
    } else {
      setMonitores((prev) => [{ ...rascunho, id: Date.now().toString() }, ...prev]);
    }
    setModo("lista");
  };

  const excluir = (id: string) => {
    if (confirm("Excluir este monitor? O acesso dele será revogado imediatamente.")) {
      setMonitores((prev) => prev.filter((m) => m.id !== id));
    }
  };

  const formValido = rascunho.nome.trim() && rascunho.email.trim() && rascunho.senha.trim();

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
      <div className="w-full max-w-5xl">
        <BotaoVoltar href="/nexus/diretoria" label="Voltar para Diretoria" />
      </div>
      {/* Banner de topo */}
      <div className="w-full max-w-5xl relative rounded-2xl overflow-hidden mb-8 px-8 py-8 bg-gradient-to-br from-emerald-600 to-teal-500">
        <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/10" />
        <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <h1 className="relative text-2xl font-semibold text-white leading-snug mb-1">Gerenciar monitores</h1>
        <p className="relative text-sm text-white/80">Cadastro, acesso e turmas vinculadas</p>
      </div>

      <div className="w-full max-w-5xl">
        {modo === "lista" ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700">
                {monitores.length} monitores cadastrados
              </span>
              <button
                onClick={abrirNovo}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Novo monitor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {monitores.map((monitor) => (
                <MonitorCard
                  key={monitor.id}
                  monitor={monitor}
                  onEditar={() => abrirEdicao(monitor)}
                  onExcluir={() => excluir(monitor.id)}
                />
              ))}
            </div>

            {monitores.length === 0 && (
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
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={mostrarSenha ? "text" : "password"}
                    value={rascunho.senha}
                    onChange={(e) => setRascunho({ ...rascunho, senha: e.target.value })}
                    placeholder="Defina uma senha"
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-20 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
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
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 transition-colors"
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