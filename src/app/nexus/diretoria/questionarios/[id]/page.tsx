"use client";
import { AnalyticsQuestion } from "./_components/analytics-question";
import { RespostasIndividuaisQuestionario } from "./_components/respostas-individuais-questionario";
import { type Pergunta, type Respostas } from "./_components/suporte";

import { BarChart3 } from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

export default function EstatisticasQuestionario({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data, isLoading } = api.formulario.stats.useQuery({ id });
	const [painel, setPainel] = useState<"gerais" | "individuais">("gerais");
	const [buscaIndividual, setBuscaIndividual] = useState("");
	if (isLoading)
		return (
			<main className="min-h-full px-4 py-8" aria-busy="true">
				<div className="mx-auto max-w-4xl">
					<DataSkeleton cards={3} />
				</div>
			</main>
		);
	if (!data) return null;
	const perguntas =
		(data.formulario.conteudo as { perguntas?: Pergunta[] }).perguntas ?? [];
	const respostas = data.formulario.respostas.map(
		(item) => item.respostas as Respostas,
	);
	const respostasIndividuais = data.formulario.respostas;
	const termoBusca = buscaIndividual
		.trim()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase();
	const respostasIndividuaisFiltradas = respostasIndividuais.filter(
		(resposta) =>
			(resposta.nomeRespondente ?? "")
				.normalize("NFD")
				.replace(/[\u0300-\u036f]/g, "")
				.toLowerCase()
				.includes(termoBusca),
	);
	const configuracao = data.formulario.configuracao as {
		atribuirPontuacao?: boolean;
	} | null;
	const identificado =
		data.formulario.modoResposta === "IDENTIFICADO_POR_COOKIE";
	return (
		<main className="min-h-full px-3 py-6 sm:px-4 sm:py-8">
			<div className="mx-auto max-w-4xl">
				<Link
					href="/nexus/questionarios"
					className="text-sm font-bold text-sky-700"
				>
					← Questionários
				</Link>
				<header className="mt-3 min-w-0 rounded-3xl bg-sky-600 p-5 text-white shadow-[0_20px_45px_rgba(2,132,199,.22)] sm:p-7">
					<BarChart3 className="h-7 w-7 text-orange-300" />
					<h1 className="mt-3 break-words text-2xl font-black">
						{data.formulario.titulo}
					</h1>
					<p className="mt-1 text-sky-100">
						{data.totalRespostas} resposta(s) recebida(s)
					</p>
				</header>
				<div
					className="mt-5 flex flex-wrap gap-2"
					role="tablist"
					aria-label="Painéis de respostas"
				>
					<button
						role="tab"
						aria-selected={painel === "gerais"}
						onClick={() => setPainel("gerais")}
						className={`min-h-11 rounded-xl px-4 text-sm font-extrabold transition ${painel === "gerais" ? "bg-sky-600 text-white" : "bg-white text-sky-800 shadow-sm"}`}
					>
						Métricas gerais
					</button>
					{identificado && (
						<button
							role="tab"
							aria-selected={painel === "individuais"}
							onClick={() => setPainel("individuais")}
							className={`min-h-11 rounded-xl px-4 text-sm font-extrabold transition ${painel === "individuais" ? "bg-sky-600 text-white" : "bg-white text-sky-800 shadow-sm"}`}
						>
							Respostas individuais
						</button>
					)}
				</div>
				{painel === "gerais" && (
					<section className="mt-5 space-y-4">
						{perguntas.map((pergunta) => (
							<AnalyticsQuestion
								key={pergunta.id}
								pergunta={pergunta}
								respostas={respostas}
							/>
						))}
					</section>
				)}
				{identificado && painel === "individuais" && (
					<RespostasIndividuaisQuestionario
						buscaIndividual={buscaIndividual}
						setBuscaIndividual={setBuscaIndividual}
						respostasIndividuaisFiltradas={respostasIndividuaisFiltradas}
						configuracao={configuracao}
						perguntas={perguntas}
					/>
				)}
			</div>
		</main>
	);
}
