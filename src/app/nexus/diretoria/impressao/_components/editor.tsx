"use client";

import { CheckCircle2, FileText, Users } from "lucide-react";
import { useEffect, useRef } from "react";
import styles from ".././impressao.module.css";
import { Campo } from "./campo";
import { type Formulario } from "./suporte";

export function Editor({
	formulario,
	setFormulario,
	responsaveis,
	onCancel,
	onSave,
	salvando,
}: {
	formulario: Formulario;
	setFormulario: (formulario: Formulario) => void;
	responsaveis: { id: string; nome: string }[];
	onCancel: () => void;
	onSave: () => void;
	salvando: boolean;
}) {
	const editorRef = useRef<HTMLElement>(null);
	useEffect(() => {
		editorRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
		editorRef.current?.focus({ preventScroll: true });
	}, [formulario.id]);
	const atualizar = <K extends keyof Formulario>(
		campo: K,
		valor: Formulario[K],
	) => setFormulario({ ...formulario, [campo]: valor });
	return (
		<section
			ref={editorRef}
			tabIndex={-1}
			aria-label={formulario.id ? "Editar apostila" : "Nova apostila"}
			className={`view-editor ${styles.editor}`}
		>
			<div className="mb-4 flex items-center gap-2 text-sky-900">
				<FileText className="h-5 w-5" />
				<h2 className="font-black">
					{formulario.id ? "Editar apostila" : "Nova apostila"}
				</h2>
			</div>
			<div className={styles.editorFields}>
				<Campo
					label="Semana"
					type="number"
					value={formulario.semana}
					onChange={(valor) => atualizar("semana", Number(valor))}
				/>
				<Campo
					label="Data da aula"
					type="date"
					value={formulario.dataAula}
					onChange={(valor) => atualizar("dataAula", valor)}
				/>
				<Campo
					label="Data de entrega"
					type="date"
					value={formulario.dataEntrega}
					onChange={(valor) => atualizar("dataEntrega", valor)}
				/>
				<Campo
					label="Apostila"
					value={formulario.titulo}
					onChange={(valor) => atualizar("titulo", valor)}
				/>
				<Campo
					label="Curso"
					value={formulario.curso}
					onChange={(valor) => atualizar("curso", valor)}
				/>
				<Campo
					label="Qtd. impressa"
					type="number"
					value={formulario.qtdImpressa}
					onChange={(valor) => atualizar("qtdImpressa", Number(valor))}
				/>
				<Campo
					label="Qtd. alvo"
					type="number"
					value={formulario.qtdAlvo}
					onChange={(valor) => atualizar("qtdAlvo", Number(valor))}
				/>
			</div>
			<fieldset className="mt-4">
				<legend className="text-sm font-bold text-sky-900">
					<Users className="mr-1 inline h-4 w-4" />
					Responsáveis
				</legend>
				<div className="mt-2 flex flex-wrap gap-2">
					{responsaveis.map((pessoa) => (
						<label
							key={pessoa.id}
							className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-slate-700"
						>
							<input
								type="checkbox"
								checked={formulario.responsavelIds.includes(pessoa.id)}
								onChange={(evento) =>
									atualizar(
										"responsavelIds",
										evento.target.checked
											? [...formulario.responsavelIds, pessoa.id]
											: formulario.responsavelIds.filter(
													(id) => id !== pessoa.id,
												),
									)
								}
							/>
							{pessoa.nome}
						</label>
					))}
					{!responsaveis.length && (
						<p className="text-sm text-slate-600">
							Nenhum responsável disponível.
						</p>
					)}
				</div>
			</fieldset>
			<div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
				<label>
					<input
						type="checkbox"
						checked={formulario.pronta}
						onChange={(evento) => atualizar("pronta", evento.target.checked)}
					/>{" "}
					Pronta
				</label>
				<label>
					<input
						type="checkbox"
						checked={formulario.impressa}
						onChange={(evento) => atualizar("impressa", evento.target.checked)}
					/>{" "}
					Impressa
				</label>
				<label>
					<input
						type="checkbox"
						checked={formulario.aulaRealizada}
						onChange={(evento) =>
							atualizar("aulaRealizada", evento.target.checked)
						}
					/>{" "}
					Aula realizada
				</label>
			</div>
			<div className="mt-5 flex justify-end gap-2">
				<button
					onClick={onCancel}
					disabled={salvando}
					className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-white"
				>
					Cancelar
				</button>
				<button
					onClick={onSave}
					disabled={
						salvando || !formulario.titulo.trim() || !formulario.curso.trim()
					}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-50"
				>
					<CheckCircle2 className="h-4 w-4" />
					{salvando ? "Salvando..." : "Salvar"}
				</button>
			</div>
		</section>
	);
}
