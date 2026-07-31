"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginProEIDINexus() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    // Simulação visual de carregamento — sem chamada real de API
    setTimeout(() => setCarregando(false), 1200);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center font-sans px-4 py-10 relative overflow-hidden">
      {/* Decoração de fundo */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200 blur-3xl " />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200 blur-3xl " />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-sky-200 blur-3xl " />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-200 blur-3xl " />

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/nexus_logo.png"
            alt="ProEIDI Nexus"
            className="h-40 md:h-120 w-auto object-contain"
          />
        </div>

        {/* Card de login */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@proeidi.com.br"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Senha
                </label>

              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 placeholder-gray-400 focus:bg-white focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-sky-600 focus:ring-sky-300"
              />
              <span className="text-sm text-gray-600">Lembrar de mim</span>
            </label>

            <button
              type="submit"
              disabled={carregando}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 active:translate-y-0 hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 shadow-sm hover:shadow-md transition-all"
            >
              {carregando ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Não tem uma conta?{" "}
          <a href="#" className="font-medium text-sky-600 hover:text-sky-700">
            Fale com o administrador
          </a>
        </p>
      </div>
    </div>
  );
}