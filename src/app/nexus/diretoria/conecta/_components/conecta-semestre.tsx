import { useState } from "react";
import { api } from "~/trpc/react";
import { Equipes } from "./equipes";
import { Itens } from "./itens";
import { Doacoes } from "./doacoes";
import { Provas } from "./provas";
import { Ranking } from "./ranking";
import { pontos, type Aba } from "./suporte";

export function ConectaSemestre({
	semestreId,
	aba,
}: {
	semestreId: string;
	aba: Aba;
}) {
	const utils = api.useUtils();
	const { data, isLoading, error } = api.conecta.dados.useQuery(
		{ semestreId },
		{ refetchInterval: 15000 },
	);
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");
	const atualizar = async (mensagem: string) => {
		await utils.conecta.dados.invalidate();
		setErro("");
		setSucesso(mensagem);
	};
	const falha = (error: { message: string }) => {
		setSucesso("");
		setErro(error.message);
	};

	return (
		<div className="space-y-5">
			{(erro || error) && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800 dark:bg-red-950 dark:text-red-200"
				>
					{erro || error?.message}
				</p>
			)}
			{sucesso && (
				<p
					role="status"
					className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
				>
					{sucesso}
				</p>
			)}
			{isLoading && (
				<p role="status" className="py-8 text-[var(--nexus-muted)]">
					Carregando dados da gincana…
				</p>
			)}
			{data && aba === "ranking" && (
				<Ranking dados={data} formatarPontos={pontos} />
			)}
			{/* As abas permanecem montadas para preservar os formulários ao alternar. */}
			<Equipes
				ativa={aba === "equipes"}
				dados={data}
				atualizar={atualizar}
				falha={falha}
			/>
			<Itens
				ativa={aba === "itens"}
				dados={data}
				atualizar={atualizar}
				falha={falha}
			/>
			<Doacoes
				ativa={aba === "doacoes"}
				dados={data}
				atualizar={atualizar}
				falha={falha}
				informarErro={setErro}
			/>
			<Provas
				ativa={aba === "provas"}
				dados={data}
				atualizar={atualizar}
				falha={falha}
				semestreId={semestreId}
			/>
		</div>
	);
}
