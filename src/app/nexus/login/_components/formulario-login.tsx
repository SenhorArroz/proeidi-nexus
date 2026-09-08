"use client";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { type FormEvent } from "react";

type FormularioLoginProps = {
	handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
	erro: string;
	email: string;
	setEmail: Dispatch<SetStateAction<string>>;
	mostrarSenha: boolean;
	senha: string;
	setSenha: Dispatch<SetStateAction<string>>;
	setMostrarSenha: Dispatch<SetStateAction<boolean>>;
	carregando: boolean;
};
export function FormularioLogin({
	handleSubmit,
	erro,
	email,
	setEmail,
	mostrarSenha,
	senha,
	setSenha,
	setMostrarSenha,
	carregando,
}: FormularioLoginProps) {
	return (
		<form onSubmit={handleSubmit} className="view-formulario-login space-y-5">
			{erro && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium leading-5 text-red-700"
				>
					{erro}
				</p>
			)}
			<label className="block">
				<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
					E-mail
				</span>
				<span className="relative block">
					<Mail
						className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-700"
						aria-hidden="true"
					/>
					<input
						type="email"
						value={email}
						onChange={(event) => setEmail(event.target.value)}
						placeholder="voce@proeidi.com.br"
						autoComplete="email"
						required
						className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
					/>
				</span>
			</label>
			<label className="block">
				<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
					Senha
				</span>
				<span className="relative block">
					<LockKeyhole
						className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-700"
						aria-hidden="true"
					/>
					<input
						type={mostrarSenha ? "text" : "password"}
						value={senha}
						onChange={(event) => setSenha(event.target.value)}
						placeholder="Digite sua senha"
						autoComplete="current-password"
						required
						className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100 sm:text-sm"
					/>
					<button
						type="button"
						onClick={() => setMostrarSenha((visivel) => !visivel)}
						className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-sky-700 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
						aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
					>
						{mostrarSenha ? (
							<EyeOff className="h-4 w-4" />
						) : (
							<Eye className="h-4 w-4" />
						)}
					</button>
				</span>
			</label>
			<button
				type="submit"
				disabled={carregando}
				className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(2,132,199,.24)] transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-[0_16px_28px_rgba(2,132,199,.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
			>
				{carregando ? (
					<>
						<span
							className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
							aria-hidden="true"
						/>
						<span>Entrando...</span>
					</>
				) : (
					<>
						Entrar no Nexus{" "}
						<ArrowRight className="h-4 w-4" aria-hidden="true" />
					</>
				)}
			</button>
		</form>
	);
}
