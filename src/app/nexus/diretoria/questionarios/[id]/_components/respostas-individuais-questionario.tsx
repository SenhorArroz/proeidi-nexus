"use client";
import { Search, UserRound } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { type Pergunta, type Respostas, lista } from "./suporte";

type RespostasIndividuaisQuestionarioProps = {
	buscaIndividual: string;
	setBuscaIndividual: Dispatch<SetStateAction<string>>;
	respostasIndividuaisFiltradas: RouterOutputs["formulario"]["stats"]["formulario"]["respostas"];
	configuracao: { atribuirPontuacao?: boolean } | null;
	perguntas: Pergunta[];
};
export function RespostasIndividuaisQuestionario({
	buscaIndividual,
	setBuscaIndividual,
	respostasIndividuaisFiltradas,
	configuracao,
	perguntas,
}: RespostasIndividuaisQuestionarioProps) {
	return (
		<section className="view-respostas-individuais-questionario mt-6 overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,.06)]">
			<div className="border-b border-sky-100 bg-sky-50/60 p-4 dark:border-sky-950 dark:bg-slate-900/90 sm:p-5">
				<h2 className="flex items-center gap-2 font-extrabold text-slate-900">
					<UserRound className="h-5 w-5 text-sky-900" /> Respostas individuais
				</h2>
				<p className="mt-1 text-sm text-slate-600">
					Identificação informada pela pessoa no momento da resposta.
				</p>
				<div className="relative mt-4">
					<Search
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<input
						type="search"
						value={buscaIndividual}
						onChange={(event) => setBuscaIndividual(event.target.value)}
						placeholder="Buscar por nome"
						className="min-h-11 w-full rounded-xl border border-sky-100 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
					/>
				</div>
			</div>
			<div className="divide-y divide-slate-100">
				{respostasIndividuaisFiltradas.length === 0 ? (
					<p className="px-5 py-8 text-center text-sm text-slate-500">
						Nenhuma resposta encontrada para este nome.
					</p>
				) : (
					respostasIndividuaisFiltradas.map((resposta, indice) => (
						<details key={resposta.id} className="group p-4 sm:p-5">
							<summary className="flex cursor-pointer list-none items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="truncate font-bold text-slate-900">
										{resposta.nomeRespondente ||
											`Resposta ${respostasIndividuaisFiltradas.length - indice}`}
									</p>
									<p className="mt-1 text-xs text-slate-500">
										{new Intl.DateTimeFormat("pt-BR", {
											dateStyle: "medium",
											timeStyle: "short",
										}).format(resposta.createdAt)}
										{configuracao?.atribuirPontuacao &&
											` · ${resposta.pontuacao ?? 0} ponto(s)`}
									</p>
								</div>
								<span className="text-sm font-bold text-sky-700 group-open:hidden">
									Ver respostas
								</span>
								<span className="hidden text-sm font-bold text-sky-700 group-open:inline">
									Fechar
								</span>
							</summary>
							<dl className="mt-4 space-y-3 border-t border-slate-100 pt-4">
								{perguntas.map((pergunta) => {
									const valor = (resposta.respostas as Respostas)[pergunta.id];
									return (
										<div key={pergunta.id}>
											<dt className="text-sm font-bold text-slate-800">
												{pergunta.titulo}
											</dt>
											<dd className="mt-1 break-words text-sm text-slate-600">
												{lista(valor).join(", ") || "Não respondida"}
											</dd>
										</div>
									);
								})}
							</dl>
						</details>
					))
				)}
			</div>
		</section>
	);
}
