"use client";

import { CheckCircle2, KeyRound, LockKeyhole, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
	type ChangeEvent,
	type ClipboardEvent,
	type FormEvent,
	type KeyboardEvent,
	useRef,
	useState,
} from "react";

import { api } from "~/trpc/react";

const TAMANHO_CODIGO = 6;

export default function RedefinirSenhaPage() {
	const params = useSearchParams();
	const solicitacaoId = params.get("solicitacao") ?? "";
	const [digitosCodigo, setDigitosCodigo] = useState<string[]>(
		Array(TAMANHO_CODIGO).fill(""),
	);
	const [novaSenha, setNovaSenha] = useState("");
	const [confirmacao, setConfirmacao] = useState("");
	const [erro, setErro] = useState<string | null>(null);
	const camposCodigo = useRef<Array<HTMLInputElement | null>>([]);
	const codigo = digitosCodigo.join("");
	const redefinir = api.conta.confirmarRedefinicao.useMutation({
		onError: (causa) => setErro(causa.message),
	});

	const preencherCodigo = (valor: string, inicio = 0) => {
		const somenteDigitos = valor
			.replace(/\D/g, "")
			.slice(0, TAMANHO_CODIGO - inicio);
		if (!somenteDigitos) return;

		setDigitosCodigo((atual) => {
			const proximo = [...atual];
			somenteDigitos.split("").forEach((digito, indice) => {
				proximo[inicio + indice] = digito;
			});
			return proximo;
		});

		const proximoCampo = Math.min(
			inicio + somenteDigitos.length,
			TAMANHO_CODIGO - 1,
		);
		requestAnimationFrame(() => camposCodigo.current[proximoCampo]?.focus());
	};

	const alterarDigito = (
		indice: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const valor = event.target.value;
		if (valor.length > 1) {
			preencherCodigo(valor, indice);
			return;
		}

		setDigitosCodigo((atual) => {
			const proximo = [...atual];
			proximo[indice] = valor.replace(/\D/g, "");
			return proximo;
		});
		if (valor && indice < TAMANHO_CODIGO - 1) {
			camposCodigo.current[indice + 1]?.focus();
		}
	};

	const navegarCodigo = (
		indice: number,
		event: KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Backspace" && !digitosCodigo[indice] && indice > 0) {
			camposCodigo.current[indice - 1]?.focus();
		}
		if (event.key === "ArrowLeft" && indice > 0) {
			event.preventDefault();
			camposCodigo.current[indice - 1]?.focus();
		}
		if (event.key === "ArrowRight" && indice < TAMANHO_CODIGO - 1) {
			event.preventDefault();
			camposCodigo.current[indice + 1]?.focus();
		}
	};

	const colarCodigo = (
		indice: number,
		event: ClipboardEvent<HTMLInputElement>,
	) => {
		event.preventDefault();
		preencherCodigo(event.clipboardData.getData("text"), indice);
	};

	const enviar = (event: FormEvent) => {
		event.preventDefault();
		if (!solicitacaoId) return setErro("Este link de redefinição é inválido.");
		if (codigo.length !== TAMANHO_CODIGO)
			return setErro("Digite os seis números enviados por e-mail.");
		if (novaSenha !== confirmacao)
			return setErro("A confirmação de senha não confere.");
		if (
			novaSenha.length < 8 ||
			!/[A-Z]/.test(novaSenha) ||
			!/[^A-Za-z0-9]/.test(novaSenha)
		)
			return setErro(
				"Use ao menos 8 caracteres, uma letra maiúscula e um caractere especial.",
			);
		setErro(null);
		redefinir.mutate({ solicitacaoId, codigo, novaSenha, confirmacao });
	};

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
									Confira seu e-mail e crie uma nova senha segura para sua conta.
								</p>
							</div>

							<form onSubmit={enviar} className="space-y-5" noValidate>
								<div>
									<div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
										<Mail className="h-4 w-4 text-sky-700" aria-hidden="true" />
										Código de confirmação
									</div>
									<div className="flex justify-between gap-2 sm:gap-3">
										{digitosCodigo.map((digito, indice) => (
											<input
												key={indice}
												ref={(elemento) => {
													camposCodigo.current[indice] = elemento;
												}}
												value={digito}
												onChange={(event) => alterarDigito(indice, event)}
												onKeyDown={(event) => navegarCodigo(indice, event)}
												onPaste={(event) => colarCodigo(indice, event)}
												type="text"
												inputMode="numeric"
												pattern="[0-9]*"
												autoComplete={indice === 0 ? "one-time-code" : "off"}
												aria-label={`Dígito ${indice + 1} do código`}
												className="h-12 min-w-0 flex-1 rounded-xl border border-slate-200 bg-white text-center text-lg font-black tabular-nums text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
											/>
										))}
									</div>
									<p className="mt-2 text-center text-xs leading-5 text-slate-500">
										São seis números. Você também pode colar o código completo.
									</p>
								</div>

								<label className="block">
									<span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
										<LockKeyhole className="h-4 w-4 text-sky-700" aria-hidden="true" />
										Nova senha
									</span>
									<input
										required
										minLength={8}
										type="password"
										autoComplete="new-password"
										value={novaSenha}
										onChange={(event) => setNovaSenha(event.target.value)}
										placeholder="Digite sua nova senha"
										className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-sm"
									/>
								</label>

								<label className="block">
									<span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-600">
										Confirme a nova senha
									</span>
									<input
										required
										minLength={8}
										type="password"
										autoComplete="new-password"
										value={confirmacao}
										onChange={(event) => setConfirmacao(event.target.value)}
										placeholder="Digite novamente"
										className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:text-sm"
									/>
								</label>

								<p className="text-center text-xs leading-5 text-slate-500">
									Use ao menos 8 caracteres, uma letra maiúscula e um caractere especial.
								</p>
								{erro && (
									<p
										role="alert"
										className="rounded-xl bg-orange-50 px-4 py-3 text-center text-sm font-medium leading-5 text-orange-800"
									>
										{erro}
									</p>
								)}
								<button
									type="submit"
									disabled={redefinir.isPending}
									className="flex h-12 w-full items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white shadow-[0_12px_22px_rgba(2,132,199,.24)] transition hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-[0_16px_28px_rgba(2,132,199,.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
								>
									{redefinir.isPending ? "Confirmando..." : "Confirmar e trocar senha"}
								</button>
							</form>
						</>
					)}
				</div>
			</section>
		</main>
	);
}
