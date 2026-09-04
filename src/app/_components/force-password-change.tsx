"use client";

import { Eye, EyeOff, KeyRound, LockKeyhole } from "lucide-react";
import { useState } from "react";

import { api } from "~/trpc/react";

export function ForcePasswordChange() {
	const [novaSenha, setNovaSenha] = useState("");
	const [confirmacao, setConfirmacao] = useState("");
	const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
	const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
	const [tentouSalvar, setTentouSalvar] = useState(false);
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const status = api.conta.senhaObrigatoria.useQuery(undefined, {
		retry: false,
	});
	const alterar = api.conta.alterarMinhaSenha.useMutation({
		onSuccess: async () => {
			setNovaSenha("");
			setConfirmacao("");
			await utils.conta.senhaObrigatoria.invalidate();
		},
		onError: (causa) => setErro(causa.message),
	});
	const requisitosSenha = [
		{ texto: "Pelo menos 8 caracteres", completo: novaSenha.length >= 8 },
		{ texto: "Uma letra maiúscula", completo: /[A-Z]/.test(novaSenha) },
		{
			texto: "Um caractere especial",
			completo: /[^A-Za-z0-9]/.test(novaSenha),
		},
		{
			texto: "As senhas devem ser iguais",
			completo: Boolean(confirmacao) && novaSenha === confirmacao,
		},
	];
	const pendenciasSenha = requisitosSenha
		.filter((requisito) => !requisito.completo)
		.map((requisito) => requisito.texto);
	const pendenciasNovaSenha = pendenciasSenha.slice(0, 3);
	const senhasDiferentes = pendenciasSenha.includes(
		"As senhas devem ser iguais",
	);

	if (!status.data?.obrigatoria) return null;
	const enviar = (event: React.FormEvent) => {
		event.preventDefault();
		setTentouSalvar(true);
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
		alterar.mutate({ novaSenha, confirmacao });
	};

	return (
		<div
			className="fixed inset-0 z-[100] overflow-y-auto bg-sky-950/60 p-3 backdrop-blur-sm sm:grid sm:place-items-center sm:p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="senha-inicial-titulo"
		>
			<form
				onSubmit={enviar}
				autoComplete="off"
				className="relative mx-auto my-3 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-[0_24px_56px_rgba(2,70,110,.34)] sm:my-0"
			>
				<div className="relative overflow-hidden bg-sky-600 px-6 py-7 text-white sm:px-8 sm:py-8">
					<div
						aria-hidden="true"
						className="absolute -bottom-10 -right-8 h-32 w-32 rounded-full bg-orange-500"
					/>
					<div
						aria-hidden="true"
						className="absolute -right-1 top-5 h-16 w-16 rounded-full border-[9px] border-sky-200/80"
					/>
					<div className="relative grid h-12 w-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
						<LockKeyhole className="h-6 w-6" />
					</div>
					<h1
						id="senha-inicial-titulo"
						className="relative mt-5 text-2xl font-black tracking-[-.03em]"
					>
						Proteja sua conta
					</h1>
					<p className="relative mt-1.5 max-w-[32rem] text-sm leading-6 text-sky-50">
						Este é seu primeiro acesso. Escolha uma senha pessoal e anote-a em
						um local seguro.
					</p>
				</div>
				<div className="space-y-4 p-6 sm:p-8">
					<label className="block text-sm font-bold text-slate-700">
						Nova senha
						<div className="relative mt-1.5">
							<input
								required
								minLength={8}
								type={mostrarNovaSenha ? "text" : "password"}
								autoComplete="new-password"
								value={novaSenha}
								onChange={(event) => {
									setNovaSenha(event.target.value);
									setErro(null);
								}}
								className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-12 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
							/>
							<button
								type="button"
								onClick={() => setMostrarNovaSenha((visivel) => !visivel)}
								className="absolute inset-y-0 right-0 grid min-h-11 min-w-11 place-items-center rounded-r-xl text-slate-500 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
								aria-label={
									mostrarNovaSenha ? "Ocultar nova senha" : "Mostrar nova senha"
								}
								title={mostrarNovaSenha ? "Ocultar senha" : "Mostrar senha"}
							>
								{mostrarNovaSenha ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{tentouSalvar && pendenciasNovaSenha.length > 0 && (
							<span
								role="alert"
								className="mt-1.5 block rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold leading-5 text-orange-800"
							>
								Falta: {pendenciasNovaSenha.join(", ")}.
							</span>
						)}
					</label>
					<label className="block text-sm font-bold text-slate-700">
						Confirme a nova senha
						<div className="relative mt-1.5">
							<input
								required
								minLength={8}
								type={mostrarConfirmacao ? "text" : "password"}
								autoComplete="new-password"
								value={confirmacao}
								onChange={(event) => {
									setConfirmacao(event.target.value);
									setErro(null);
								}}
								className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-3 pr-12 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
							/>
							<button
								type="button"
								onClick={() => setMostrarConfirmacao((visivel) => !visivel)}
								className="absolute inset-y-0 right-0 grid min-h-11 min-w-11 place-items-center rounded-r-xl text-slate-500 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500"
								aria-label={
									mostrarConfirmacao
										? "Ocultar confirmação de senha"
										: "Mostrar confirmação de senha"
								}
								title={mostrarConfirmacao ? "Ocultar senha" : "Mostrar senha"}
							>
								{mostrarConfirmacao ? (
									<EyeOff className="h-4 w-4" />
								) : (
									<Eye className="h-4 w-4" />
								)}
							</button>
						</div>
						{tentouSalvar && senhasDiferentes && (
							<span
								role="alert"
								className="mt-1.5 block rounded-lg bg-orange-50 px-3 py-2 text-sm font-semibold leading-5 text-orange-800"
							>
								Falta: as senhas devem ser iguais.
							</span>
						)}
					</label>
					{erro && pendenciasSenha.length === 0 && (
						<p
							role="alert"
							className="rounded-xl bg-red-50 px-3 py-2 text-center text-sm font-medium text-red-700"
						>
							{erro}
						</p>
					)}
					<button
						disabled={alterar.isPending}
						className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white shadow-[0_8px_18px_rgba(2,132,199,.24)] transition hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-60"
					>
						<KeyRound className="h-4 w-4" />
						{alterar.isPending ? "Salvando..." : "Salvar minha nova senha"}
					</button>
				</div>
			</form>
		</div>
	);
}
