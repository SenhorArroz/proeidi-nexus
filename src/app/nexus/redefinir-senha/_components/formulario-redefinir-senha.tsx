"use client";
import { LockKeyhole, Mail } from "lucide-react";
import { useRedefinirSenhaPage } from "./use-redefinir-senha-page";

type Estado = ReturnType<typeof useRedefinirSenhaPage>;
type FormularioRedefinirSenhaProps = {
	enviar: NonNullable<Estado["enviar"]>;
	digitosCodigo: NonNullable<Estado["digitosCodigo"]>;
	camposCodigo: NonNullable<Estado["camposCodigo"]>;
	alterarDigito: NonNullable<Estado["alterarDigito"]>;
	navegarCodigo: NonNullable<Estado["navegarCodigo"]>;
	colarCodigo: NonNullable<Estado["colarCodigo"]>;
	novaSenha: NonNullable<Estado["novaSenha"]>;
	setNovaSenha: NonNullable<Estado["setNovaSenha"]>;
	confirmacao: NonNullable<Estado["confirmacao"]>;
	setConfirmacao: NonNullable<Estado["setConfirmacao"]>;
	erro: Estado["erro"];
	redefinir: NonNullable<Estado["redefinir"]>;
};

export function FormularioRedefinirSenha({
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
	redefinir,
}: FormularioRedefinirSenhaProps) {
	return (
		<form
			onSubmit={enviar}
			className="view-redefinir-senha-formulario-redefinir-senha space-y-5"
			noValidate
		>
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
	);
}
