"use client";

import { type FormEvent, useState } from "react";
import {
	ArrowRight,
	Eye,
	EyeOff,
	LockKeyhole,
	Mail,
	ShieldCheck,
	UsersRound,
} from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginProEIDINexus() {
	const [email, setEmail] = useState("");
	const [senha, setSenha] = useState("");
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [carregando, setCarregando] = useState(false);
	const [erro, setErro] = useState("");
	const router = useRouter();

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setCarregando(true);
		setErro("");
		const result = await signIn("credentials", {
			email,
			senha,
			redirect: false,
		});
		setCarregando(false);
		if (result?.error) {
			setErro(
				"E-mail ou senha inválidos. Revise seus dados e tente novamente.",
			);
			return;
		}
		router.replace("/nexus/diretoria");
		router.refresh();
	};

	return (
		<main className="relative min-h-[100dvh] overflow-hidden bg-slate-50 font-sans sm:p-5 lg:p-7">
			<div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl overflow-hidden bg-white sm:min-h-[calc(100dvh-2.5rem)] sm:rounded-[1.75rem] sm:shadow-[0_24px_64px_rgba(15,23,42,.14)] lg:min-h-[calc(100dvh-3.5rem)]">
				<section className="relative hidden min-w-0 overflow-hidden bg-sky-600 p-8 text-white lg:flex lg:w-[52%] lg:flex-col lg:justify-between xl:p-12">
					<div
						className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500"
						aria-hidden="true"
					/>
					<div
						className="absolute bottom-14 right-12 h-48 w-48 rounded-full border-[18px] border-sky-300/60"
						aria-hidden="true"
					/>
					<div
						className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-orange-400/90"
						aria-hidden="true"
					/>
					<div className="relative flex items-center gap-3">
						<Image
							src="/nexus_logo.png"
							alt="ProEIDI Nexus"
							width={200}
							height={100}
							className="h-30 w-auto object-contain"
						/>
						<span className="h-7 w-px bg-white/35" aria-hidden="true" />
						<span className="text-sm font-bold tracking-wide text-sky-50">
							Área do projeto
						</span>
					</div>
					<div className="relative max-w-lg py-14 xl:py-20">
						<div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 shadow-[0_12px_24px_rgba(234,88,12,.3)]">
							<ShieldCheck className="h-7 w-7" aria-hidden="true" />
						</div>
						<h1 className="max-w-md text-4xl font-black tracking-[-.035em] text-white xl:text-5xl">
							A rotina do ProEIDI, conectada.
						</h1>
						<p className="mt-5 max-w-md text-base leading-7 text-sky-100 xl:text-lg">
							Gerencie turmas, pessoas, atividades e presença em um só lugar.
						</p>
					</div>
					<div className="relative flex max-w-md items-center gap-3 border-t border-white/20 pt-6 text-sm text-sky-100">
						<UsersRound
							className="h-5 w-5 shrink-0 text-orange-200"
							aria-hidden="true"
						/>
						<span>
							Acesso para coordenação, diretoria, professores e monitores.
						</span>
					</div>
				</section>

				<section className="relative flex w-full min-w-0 items-start justify-center px-5 py-8 sm:items-center sm:px-10 sm:py-10 lg:w-[48%] lg:px-12 xl:px-16">
					<div
						className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-orange-100 lg:hidden"
						aria-hidden="true"
					/>
					<div
						className="absolute -left-14 bottom-0 h-44 w-44 rounded-full bg-sky-100 lg:hidden"
						aria-hidden="true"
					/>
					<div className="relative w-full max-w-md">
						<div className="mb-7 flex justify-center sm:mb-9 lg:hidden">
							<Image
								src="/nexus_logo.png"
								alt="ProEIDI Nexus"
								width={256}
								height={96}
								className="h-20 w-auto object-contain sm:h-24"
							/>
						</div>
						<div className="mb-7 sm:mb-8 text-center">
							<h2 className="text-2xl font-black tracking-[-.03em] text-slate-900 sm:text-3xl">
								Acesse sua conta
							</h2>
							<p className="mt-2 text-sm leading-6 text-slate-600">
								Entre com as credenciais cadastradas pela administração do
								projeto.
							</p>
						</div>
						<form onSubmit={handleSubmit} className="space-y-5">
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
										aria-label={
											mostrarSenha ? "Ocultar senha" : "Mostrar senha"
										}
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
						<p className="mt-8 text-sm leading-6 text-slate-600 text-center">
							Precisa de acesso?{" "}
							<span className="font-bold text-sky-800">
								Fale com a administração do projeto.
							</span>
						</p>
					</div>
				</section>
			</div>
		</main>
	);
}
