"use client";

import { CheckCircle2, Pencil, Plus } from "lucide-react";
import { type ConfiguracaoFormulario } from "./suporte";

export function EstadoEnviado({
	fonte,
	configuracao,
	pontuacao,
	editando,
	respostaUnica,
	onContinuar,
}: {
	fonte: string;
	configuracao: ConfiguracaoFormulario;
	pontuacao: number | null | undefined;
	editando: boolean;
	respostaUnica: boolean;
	onContinuar: () => void;
}) {
	return (
		<main
			className={`view-estado-enviado ${`grid min-h-screen place-items-center p-6 text-center ${fonte}`}`}
			style={{ backgroundColor: configuracao.corFundo }}
		>
			<div className="max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.12)] sm:p-8">
				<CheckCircle2
					className="mx-auto h-10 w-10"
					style={{ color: configuracao.corDestaque }}
				/>
				<h1 className="mt-4 text-2xl font-black text-slate-900">
					{editando ? "Resposta atualizada!" : "Resposta enviada!"}
				</h1>
				<p className="mt-2 text-slate-600">Agradecemos sua participação.</p>
				{configuracao.atribuirPontuacao && (
					<p
						className="mt-3 font-bold"
						style={{ color: configuracao.corPrimaria }}
					>
						Pontuação: {pontuacao ?? 0} ponto(s)
					</p>
				)}
				<button
					onClick={onContinuar}
					style={{ backgroundColor: configuracao.corDestaque }}
					className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-white"
				>
					{respostaUnica ? (
						<>
							<Pencil className="h-4 w-4" /> Editar última resposta
						</>
					) : (
						<>
							<Plus className="h-4 w-4" /> Responder mais uma vez
						</>
					)}
				</button>
			</div>
		</main>
	);
}
