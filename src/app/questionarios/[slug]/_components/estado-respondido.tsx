"use client";

import { CheckCircle2, Pencil } from "lucide-react";
import { type ConfiguracaoFormulario } from "./suporte";

export function EstadoRespondido({
	fonte,
	configuracao,
	onEditar,
}: {
	fonte: string;
	configuracao: ConfiguracaoFormulario;
	onEditar: () => void;
}) {
	return (
		<main
			className={`view-estado-respondido ${`grid min-h-screen place-items-center p-6 text-center ${fonte}`}`}
			style={{ backgroundColor: configuracao.corFundo }}
		>
			<div className="max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.12)] sm:p-8">
				<CheckCircle2
					className="mx-auto h-10 w-10"
					style={{ color: configuracao.corDestaque }}
				/>
				<h1 className="mt-4 text-2xl font-black text-slate-900">
					Você já respondeu
				</h1>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					Este questionário aceita apenas uma resposta por navegador. Sua
					participação está registrada.
				</p>
				<button
					onClick={onEditar}
					style={{ backgroundColor: configuracao.corDestaque }}
					className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-white"
				>
					<Pencil className="h-4 w-4" /> Editar minha última resposta
				</button>
			</div>
		</main>
	);
}
