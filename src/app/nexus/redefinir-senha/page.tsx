"use client";
import { FormularioRedefinirSenha } from "./_components/formulario-redefinir-senha";
import { useRedefinirSenhaPage } from "./_components/use-redefinir-senha-page";

import Image from "next/image";
import Link from "next/link";

export default function RedefinirSenhaPage() {
	const {
		redefinir,
		enviar,
		digitosCodigo,
		camposCodigo,
		alterarDigito,
		navegarCodigo,
		colarCodigo,
		novaSenha,
		setNovaSenha,
		confirmacao,
		setConfirmacao,
		erro,
	} = useRedefinirSenhaPage();

	return (
		<main className="relative min-h-[100dvh] overflow-hidden bg-slate-50 font-sans">
			<div
				className="absolute -right-12 top-0 h-36 w-36 rounded-full bg-orange-100"
				aria-hidden="true"
			/>
			<div
				className="absolute -bottom-16 -left-14 h-48 w-48 rounded-full bg-sky-100"
				aria-hidden="true"
			/>
			<section className="relative mx-auto flex min-h-[100dvh] w-full max-w-md items-start px-5 py-8 sm:items-center sm:px-8 sm:py-10">
				<div className="w-full">
					<div className="mb-7 flex justify-center sm:mb-9">
						<Image
							src="/nexus_logo.png"
							alt="ProEIDI Nexus"
							width={256}
							height={96}
							className="h-20 w-auto object-contain sm:h-24"
						/>
					</div>

					{redefinir.isSuccess ? (
						<div className="rounded-2xl bg-white px-6 py-8 text-center shadow-[0_18px_42px_rgba(15,23,42,.1)] sm:px-8">
							<h1 className="mt-5 text-2xl font-black tracking-[-.03em] text-slate-900">
								Senha atualizada
							</h1>
							<p className="mt-2 text-sm leading-6 text-slate-600">
								Sua nova senha já pode ser usada para entrar.
							</p>
							<Link
								href="/nexus/login"
								className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-sky-600 px-5 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(2,132,199,.24)] transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2"
							>
								Ir para o login
							</Link>
						</div>
					) : (
						<>
							<div className="mb-7 text-center sm:mb-8">
								<h1 className="text-2xl font-black tracking-[-.03em] text-slate-900 sm:text-3xl">
									Redefinir senha
								</h1>
								<p className="mt-2 text-sm leading-6 text-slate-600">
									Confira seu e-mail e crie uma nova senha segura para sua
									conta.
								</p>
							</div>

							<FormularioRedefinirSenha
								enviar={enviar}
								digitosCodigo={digitosCodigo}
								camposCodigo={camposCodigo}
								alterarDigito={alterarDigito}
								navegarCodigo={navegarCodigo}
								colarCodigo={colarCodigo}
								novaSenha={novaSenha}
								setNovaSenha={setNovaSenha}
								confirmacao={confirmacao}
								setConfirmacao={setConfirmacao}
								erro={erro}
								redefinir={redefinir}
							/>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
