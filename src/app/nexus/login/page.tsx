"use client";
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginProEIDINexus() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");
    const result = await signIn("credentials", { email, senha, redirect: false });
    setCarregando(false);
    if (result?.error) { setErro("E-mail ou senha inválidos."); return; }
    router.replace("/nexus/diretoria");
    router.refresh();
  };

  return (
    <div className="relative flex min-h-[100dvh] w-full min-w-0 items-center justify-center overflow-hidden px-3 py-6 font-sans sm:px-4 sm:py-10">
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
            className="h-28 max-w-full object-contain sm:h-36 md:h-40"
          />
        </div>

        {/* Card de login */}
        <div className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
			{erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}
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
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-base text-gray-800 placeholder-gray-400 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 sm:text-sm"
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
                  className="h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-12 text-base text-gray-800 placeholder-gray-400 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-100 sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
