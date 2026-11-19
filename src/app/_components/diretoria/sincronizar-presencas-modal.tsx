"use client";

import { useEffect, useId, useRef } from "react";
import type { ModoEquipe } from "./use-salvamento-presencas";

export function SincronizarPresencasModal({
	onCancelar,
	onConfirmar,
}: {
	onCancelar: () => void;
	onConfirmar: (modoEquipe: ModoEquipe) => void;
}) {
	const ref = useRef<HTMLDialogElement>(null);
	const tituloId = useId();
	const descricaoId = useId();

	useEffect(() => {
		const dialogo = ref.current;
		dialogo?.showModal();
		return () => dialogo?.close();
	}, []);

	return (
		<dialog
			ref={ref}
			aria-labelledby={tituloId}
			aria-describedby={descricaoId}
			onCancel={(event) => {
				event.preventDefault();
				onCancelar();
			}}
			className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl bg-white p-5 text-slate-900 shadow-2xl backdrop:bg-slate-950/55 dark:bg-slate-900 dark:text-slate-100 sm:p-6"
		>
			<h2 id={tituloId} className="text-lg font-bold">
				Sincronizar presenças da equipe?
			</h2>
			<p
				id={descricaoId}
				className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
			>
				Nas outras turmas vinculadas com aula no mesmo dia, você pode copiar a
				marcação de cada professor ou monitor alterado ou registrar ausência.
			</p>
			<div className="mt-5 flex flex-col gap-2">
				<button
					type="button"
					onClick={() => onConfirmar("sincronizar")}
					className="min-h-11 rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
				>
					Sincronizar marcações
				</button>
				<button
					type="button"
					onClick={() => onConfirmar("somente-turma")}
					className="min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:border-slate-600 dark:hover:bg-slate-800"
				>
					Salvar nesta turma e marcar falta nas outras
				</button>
				<button
					type="button"
					onClick={onCancelar}
					className="min-h-11 rounded-lg px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 dark:text-slate-300 dark:hover:bg-slate-800"
				>
					Cancelar
				</button>
			</div>
		</dialog>
	);
}
