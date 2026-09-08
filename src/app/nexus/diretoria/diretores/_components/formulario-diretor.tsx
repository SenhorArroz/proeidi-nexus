"use client";
import { ArrowLeft, Check } from "lucide-react";
import { DiretoriaFormField } from "~/app/_components/diretoria/form-field";
import { useDiretoresDiretoria } from "./use-diretores-diretoria";

type Estado = ReturnType<typeof useDiretoresDiretoria>;
type FormularioDiretorProps = {
	setModo: NonNullable<Estado["setModo"]>;
	editando: Estado["editando"];
	form: NonNullable<Estado["form"]>;
	setForm: NonNullable<Estado["setForm"]>;
	erro: NonNullable<Estado["erro"]>;
	salvar: NonNullable<Estado["salvar"]>;
	criar: NonNullable<Estado["criar"]>;
	atualizar: NonNullable<Estado["atualizar"]>;
};

export function FormularioDiretor({
	setModo,
	editando,
	form,
	setForm,
	erro,
	salvar,
	criar,
	atualizar,
}: FormularioDiretorProps) {
	return (
		<div className="view-diretoria-diretores-formulario-diretor min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
			<div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
				<button
					onClick={() => setModo("lista")}
					className="grid min-h-11 min-w-11 place-items-center rounded-lg text-gray-400 hover:bg-gray-100"
				>
					<ArrowLeft className="h-4 w-4" />
				</button>
				<h2 className="text-sm font-semibold">
					{editando ? "Editar diretor" : "Novo diretor"}
				</h2>
			</div>
			<div className="min-w-0 space-y-5 p-4 sm:p-6">
				<DiretoriaFormField
					label="Nome"
					value={form.nome}
					onChange={(nome) => setForm({ ...form, nome })}
				/>
				<DiretoriaFormField
					label="Matrícula"
					value={form.matricula}
					onChange={(matricula) => setForm({ ...form, matricula })}
				/>
				<DiretoriaFormField
					label="E-mail"
					type="email"
					value={form.email}
					onChange={(email) => setForm({ ...form, email })}
				/>
				<p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
					A senha de acesso é sempre a matrícula informada acima. Alterar a
					matrícula redefine a senha.
				</p>
				{erro && (
					<p
						role="alert"
						className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
					>
						{erro}
					</p>
				)}
			</div>
			<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:justify-end sm:gap-3 sm:px-6">
				<button
					onClick={() => setModo("lista")}
					className="min-h-11 rounded-lg px-4 py-2 text-sm text-gray-500"
				>
					Cancelar
				</button>
				<button
					onClick={salvar}
					disabled={criar.isPending || atualizar.isPending}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
				>
					<Check className="h-4 w-4" />
					Salvar diretor
				</button>
			</div>
		</div>
	);
}
