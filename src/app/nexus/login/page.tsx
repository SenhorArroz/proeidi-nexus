"use client";
import { ApresentacaoLogin } from "./_components/apresentacao-login";
import { FormularioLogin } from "./_components/formulario-login";
import { useLoginProEIDINexus } from "./_components/use-login-pro-eidinexus";

import Image from "next/image";

export default function LoginProEIDINexus() {
	const {
		handleSubmit,
		erro,
		email,
		setEmail,
		mostrarSenha,
		senha,
		setSenha,
		setMostrarSenha,
		carregando,
	} = useLoginProEIDINexus();

	return (
		<main className="relative min-h-[100dvh] overflow-hidden bg-slate-50 font-sans sm:p-5 lg:p-7">
			<div className="relative mx-auto flex min-h-[100dvh] w-full max-w-7xl overflow-hidden bg-white sm:min-h-[calc(100dvh-2.5rem)] sm:rounded-[1.75rem] sm:shadow-[0_24px_64px_rgba(15,23,42,.14)] lg:min-h-[calc(100dvh-3.5rem)]">
				<ApresentacaoLogin />

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
						<FormularioLogin
							handleSubmit={handleSubmit}
							erro={erro}
							email={email}
							setEmail={setEmail}
							mostrarSenha={mostrarSenha}
							senha={senha}
							setSenha={setSenha}
							setMostrarSenha={setMostrarSenha}
							carregando={carregando}
						/>
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
