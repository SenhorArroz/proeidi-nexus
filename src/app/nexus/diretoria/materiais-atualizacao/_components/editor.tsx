"use client";

import { CheckCircle2 } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from ".././materiais.module.css";
import { type Formulario } from "./suporte";

export function Editor({
	form,
	setForm,
	responsaveis,
	salvar,
	cancelar,
	pendente,
}: {
	form: Formulario;
	setForm: (f: Formulario) => void;
	responsaveis: { id: string; nome: string }[];
	salvar: () => void;
	cancelar: () => void;
	pendente: boolean;
}) {
	const editor = useRef<HTMLElement>(null);
	useEffect(() => {
		editor.current?.scrollIntoView({ behavior: "instant", block: "start" });
		editor.current?.focus({ preventScroll: true });
	}, [form.id]);
	const set = <K extends keyof Formulario>(k: K, v: Formulario[K]) =>
		setForm({ ...form, [k]: v });
	return (
		<section
			ref={editor}
			tabIndex={-1}
			aria-label={form.id ? "Editar material" : "Novo material"}
			className={`view-editor ${styles.editor}`}
		>
			<h2>{form.id ? "Editar material" : "Novo material"}</h2>
			<div className={styles.editorFields}>
				{(
					[
						["Curso", "curso", "text"],
						["Material", "titulo", "text"],
						["Data de entrega", "dataEntrega", "date"],
					] as const
				).map(([l, k, t]) => (
					<label key={k}>
						{l}
						<input
							type={t}
							value={form[k] as string}
							onChange={(e) => set(k, e.target.value)}
						/>
					</label>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
				{(
					[
						["revisado", "Revisado"],
						["precisaAjuste", "Precisa de ajuste"],
						["ajustado", "Ajustado"],
					] as const
				).map(([k, l]) => (
					<label key={k}>
						<input
							type="checkbox"
							checked={form[k]}
							onChange={(e) => set(k, e.target.checked)}
						/>{" "}
						{l}
					</label>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-2">
				{responsaveis.map((r) => (
					<label key={r.id} className={styles.chip}>
						<input
							type="checkbox"
							checked={form.responsavelIds.includes(r.id)}
							onChange={(e) =>
								set(
									"responsavelIds",
									e.target.checked
										? [...form.responsavelIds, r.id]
										: form.responsavelIds.filter((id) => id !== r.id),
								)
							}
						/>{" "}
						{r.nome}
					</label>
				))}
			</div>
			<div className="mt-5 flex justify-end gap-2">
				<button
					onClick={cancelar}
					className={styles.secondary}
					disabled={pendente}
				>
					Cancelar
				</button>
				<button
					onClick={salvar}
					disabled={pendente || !form.curso || !form.titulo}
					className={styles.primary}
				>
					<CheckCircle2 className="mr-2 inline h-4 w-4" />
					{pendente ? "Salvando…" : "Salvar"}
				</button>
			</div>
		</section>
	);
}
