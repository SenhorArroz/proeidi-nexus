"use client";

import { Trophy } from "lucide-react";
import { useState } from "react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { api } from "~/trpc/react";
import { ConectaSemestre } from "./_components/conecta-semestre";
import { campo, type Aba } from "./_components/suporte";

const abas: { id: Aba; label: string }[] = [
	{ id: "ranking", label: "Ranking" },
	{ id: "equipes", label: "Equipes" },
	{ id: "doacoes", label: "Doações" },
	{ id: "provas", label: "Provas e apresentações" },
	{ id: "itens", label: "Itens" },
];
export default function ConectaPage() {
	const semestresQuery = api.diretoria.semestres.list.useQuery();
	const semestres = semestresQuery.data ?? [];
	const [semestreEscolhido, setSemestreEscolhido] = useState("");
	const [aba, setAba] = useState<Aba>("ranking");
	const semestreId =
		semestres.find((semestre) => semestre.id === semestreEscolhido)?.id ||
		semestres.find((semestre) => semestre.ativo)?.id ||
		semestres[0]?.id ||
		"";

	return (
		<div className="diretoria-page-canvas mx-auto w-full max-w-6xl space-y-5 px-3 py-4 text-[var(--nexus-ink)] sm:px-6 sm:py-5 dark:[&_.diretoria-back-link]:text-sky-300 max-sm:[&_div[class$=orb]]:opacity-25">
			<DiretoriaBackLink />
			<DiretoriaPageIntro
				icon={Trophy}
				title="Conecta View"
				description="Acompanhe a gincana e gerencie equipes, doações e provas por semestre."
			/>
			<div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-3 sm:p-4">
				<nav
					aria-label="Áreas do Conecta View"
					className="flex flex-wrap gap-1"
				>
					{abas.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setAba(item.id)}
							data-tour={`conecta-${item.id}`}
							aria-current={aba === item.id ? "true" : undefined}
							className={`min-h-11 rounded-xl px-3 py-2 text-sm font-semibold ${aba === item.id ? "bg-sky-700 text-white" : "hover:bg-[var(--nexus-hover)]"}`}
						>
							{item.label}
						</button>
					))}
				</nav>
				<label className="w-full text-sm font-semibold sm:w-44">
					Semestre
					<select
						className={`${campo} mt-1`}
						value={semestreId}
						disabled={!semestres.length}
						onChange={(event) => setSemestreEscolhido(event.target.value)}
					>
						{semestres.length === 0 && <option value="">—</option>}
						{semestres.map((semestre) => (
							<option key={semestre.id} value={semestre.id}>
								{semestre.codigo}
								{semestre.ativo ? " · ativo" : ""}
							</option>
						))}
					</select>
				</label>
			</div>
			{semestresQuery.isPending ? (
				<p role="status">Carregando semestres…</p>
			) : semestresQuery.isError ? (
				<p role="alert">
					Não foi possível carregar os semestres. {semestresQuery.error.message}
				</p>
			) : semestreId ? (
				<ConectaSemestre key={semestreId} semestreId={semestreId} aba={aba} />
			) : (
				<p>Cadastre um semestre para começar.</p>
			)}
		</div>
	);
}
