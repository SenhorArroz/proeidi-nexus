"use client";

import { Check } from "lucide-react";
import { type ConfirmacaoPresenca } from "./suporte";

export function ConfirmacaoPresencaModal({
	confirmacao,
	onFechar,
}: {
	confirmacao: ConfirmacaoPresenca;
	onFechar: () => void;
}) {
	return (
		<div
			className="view-dashboard-turmas-id-confirmacao-presenca-modal fixed inset-0 z-[70] grid place-items-center p-4"
			role="dialog"
			aria-modal="true"
			aria-labelledby="confirmacao-presenca-titulo"
		>
			<button
				className="absolute inset-0 cursor-default bg-slate-950/55 backdrop-blur-[1px]"
				onClick={onFechar}
				aria-label="Fechar confirmação"
			/>
			<div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-2xl">
				<div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-green-100 text-green-700">
					<Check className="h-6 w-6" aria-hidden="true" />
				</div>
				<h2
					id="confirmacao-presenca-titulo"
					className="mt-4 text-lg font-bold text-gray-900"
				>
					Presença registrada
				</h2>
				<p className="mt-1 text-sm text-gray-600">
					{confirmacao.total === 1
						? "O registro de 1 pessoa foi salvo"
						: `Os registros de ${confirmacao.total} pessoas foram salvos`}{" "}
					para {confirmacao.data}.
				</p>
				<button
					onClick={onFechar}
					style={{
						backgroundColor: "var(--turma-destaque, #ea580c)",
						color: "var(--turma-destaque-text, #fff)",
					}}
					className="mt-5 min-h-11 w-full rounded-lg px-4 text-sm font-bold transition hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					Concluir
				</button>
			</div>
		</div>
	);
}
