"use client";
import { X } from "lucide-react";
import { useQuestionariosPage } from "./use-questionarios-page";

type Estado = ReturnType<typeof useQuestionariosPage>;
type ModalExcluirQuestionarioProps = {
	confirmarExclusao: NonNullable<Estado["confirmarExclusao"]>;
	setConfirmarExclusao: NonNullable<Estado["setConfirmarExclusao"]>;
	removerFormulario: NonNullable<Estado["removerFormulario"]>;
};

export function ModalExcluirQuestionario({
	confirmarExclusao,
	setConfirmarExclusao,
	removerFormulario,
}: ModalExcluirQuestionarioProps) {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="titulo-excluir-questionario"
			className="view-diretoria-questionarios-modal-excluir-questionario fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
		>
			<section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2
							id="titulo-excluir-questionario"
							className="text-lg font-extrabold text-slate-900"
						>
							Excluir questionário?
						</h2>
						<p className="mt-2 text-sm text-slate-600">
							“{confirmarExclusao.titulo}” será apagado permanentemente
							{confirmarExclusao.respostas
								? `, incluindo ${confirmarExclusao.respostas} resposta(s)`
								: ""}
							.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setConfirmarExclusao(null)}
						aria-label="Fechar"
						className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				{removerFormulario.error && (
					<p
						role="alert"
						className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
					>
						{removerFormulario.error.message}
					</p>
				)}
				<div className="mt-6 flex justify-end gap-3">
					<button
						type="button"
						onClick={() => setConfirmarExclusao(null)}
						className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
					>
						Cancelar
					</button>
					<button
						type="button"
						disabled={removerFormulario.isPending}
						onClick={() =>
							removerFormulario.mutate({ id: confirmarExclusao.id })
						}
						className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white hover:bg-red-700 disabled:opacity-60"
					>
						{removerFormulario.isPending ? "Excluindo…" : "Excluir"}
					</button>
				</div>
			</section>
		</div>
	);
}
