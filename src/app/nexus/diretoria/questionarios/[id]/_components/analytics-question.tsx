"use client";

import { CheckCircle2, MessageSquareText } from "lucide-react";
import { type Pergunta, type Respostas, lista } from "./suporte";

export function AnalyticsQuestion({
	pergunta,
	respostas,
}: {
	pergunta: Pergunta;
	respostas: Respostas[];
}) {
	const valores = respostas.flatMap((resposta) => lista(resposta[pergunta.id]));
	const opcoes = pergunta.opcoes?.map((opcao) => opcao.texto) ?? [];
	const corretas = lista(pergunta.respostaCorreta);
	const escolhas =
		pergunta.tipo === "multiple_choice" || pergunta.tipo === "checkbox";
	const totalRespondentes = respostas.filter(
		(resposta) => lista(resposta[pergunta.id]).length > 0,
	).length;
	const contagens = opcoes.map((opcao) => ({
		opcao,
		total: valores.filter((valor) => valor === opcao).length,
	}));
	const acertos = corretas.length
		? respostas.filter((resposta) => {
				const respostaOrdenada = lista(resposta[pergunta.id]).slice().sort();
				const corretaOrdenada = corretas.slice().sort();
				return (
					respostaOrdenada.length === corretaOrdenada.length &&
					respostaOrdenada.every(
						(item, indice) => item === corretaOrdenada[indice],
					)
				);
			}).length
		: null;
	return (
		<article className="view-diretoria-questionarios-id-analytics-question min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,.06)]">
			<div className="flex flex-col items-start gap-3 border-b border-sky-100 bg-sky-50/60 p-4 dark:border-sky-950 dark:bg-slate-900/90 min-[420px]:flex-row min-[420px]:justify-between sm:p-5">
				<div className="min-w-0">
					<h2 className="break-words font-extrabold text-slate-900">
						{pergunta.titulo}
					</h2>
					<p className="mt-1 text-sm text-slate-500">
						{totalRespondentes} de {respostas.length} pessoa(s) responderam
					</p>
				</div>
				{acertos !== null && (
					<span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">
						<CheckCircle2 className="h-3.5 w-3.5" />
						{acertos} acerto(s)
					</span>
				)}
			</div>
			{escolhas ? (
				<div className="overflow-x-auto p-4 sm:p-5">
					<div className="flex min-h-36 min-w-max items-end justify-center gap-3 border-b-2 border-sky-100 pb-1 sm:min-w-0">
						{contagens.map(({ opcao, total }, index) => {
							const percentual = totalRespondentes
								? Math.round((total / totalRespondentes) * 100)
								: 0;
							const cor = corretas.includes(opcao)
								? "bg-green-500"
								: index % 2
									? "bg-orange-500"
									: "bg-sky-500";
							return (
								<div
									key={opcao}
									className="flex min-w-0 max-w-24 flex-1 flex-col items-center gap-2"
								>
									<span className="text-xs font-black text-slate-700">
										{total}
									</span>
									<div
										className={`w-full max-w-12 rounded-t-xl ${cor} transition-[height] duration-500`}
										style={{
											height: `${Math.max(total ? 16 : 4, percentual * 1.2)}px`,
										}}
										title={`${opcao}: ${total} resposta(s), ${percentual}%`}
									/>
									<span
										className="w-full truncate text-center text-[10px] font-bold text-slate-500"
										title={opcao}
									>
										{opcao}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			) : (
				<div className="space-y-2 p-5">
					{valores.length ? (
						valores.map((valor, indice) => (
							<p
								key={`${valor}-${indice}`}
								className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700"
							>
								<MessageSquareText className="mr-2 inline h-4 w-4 text-sky-600" />
								{valor}
							</p>
						))
					) : (
						<p className="text-sm text-slate-500">Ainda não há respostas.</p>
					)}
				</div>
			)}
		</article>
	);
}
