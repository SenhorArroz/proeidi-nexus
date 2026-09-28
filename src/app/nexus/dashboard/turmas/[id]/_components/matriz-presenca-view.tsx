"use client";

import { CalendarDays, Check, ClipboardList } from "lucide-react";
import {
	PresenceGrid,
	type EstadoPresenca,
	type PessoaPresenca,
} from "~/app/_components/diretoria/presence-grid";
import { corLegivel } from "./suporte";

export function MatrizPresencaView({
	titulo,
	pessoas,
	datas,
	estadoNaData,
	onAlterar,
	cor,
	onSalvar,
	temAlteracoes,
	erroSalvar,
	salvando,
	carregando,
	coresEstado,
}: {
	titulo: string;
	pessoas: PessoaPresenca[];
	datas: string[];
	estadoNaData: (id: string, data: string) => EstadoPresenca;
	onAlterar: (id: string, data: string, estado: EstadoPresenca) => void;
	cor: string;
	onSalvar: () => void;
	temAlteracoes: boolean;
	erroSalvar: string | null;
	salvando: boolean;
	carregando: boolean;
	coresEstado: { presente: string; ausente: string; justificado: string };
}) {
	const corTextoAcao = corLegivel("#ffffff", cor);

	return (
		<div className="view-dashboard-turmas-id-matriz-presenca mx-auto w-full max-w-6xl min-w-0 space-y-4 px-3 py-5 sm:px-6 lg:px-8">
			<section
				className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] sm:p-5 lg:flex-row lg:items-center lg:justify-between"
				style={{ "--turma-secao-cor": cor } as React.CSSProperties}
			>
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<ClipboardList className="turma-presenca-icone h-5 w-5" />
						<h3 className="turma-presenca-titulo text-base font-bold sm:text-lg">
							{titulo}
						</h3>
					</div>
					<p className="turma-semantic-description mt-1 max-w-2xl text-sm">
						Cada coluna representa um dia de aula. Ajuste os estados necessários
						e salve todas as alterações de uma vez.
					</p>
				</div>
				<button
					type="button"
					onClick={onSalvar}
					disabled={!temAlteracoes || salvando || carregando}
					style={{ backgroundColor: cor, color: corTextoAcao }}
					className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
				>
					<Check className="h-4 w-4" aria-hidden="true" />
					{salvando ? "Salvando..." : "Salvar alterações"}
				</button>
			</section>

			{erroSalvar && (
				<p
					role="alert"
					className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
				>
					{erroSalvar}
				</p>
			)}

			{!datas.length && !carregando && (
				<div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					<CalendarDays
						className="mt-0.5 h-4 w-4 shrink-0"
						aria-hidden="true"
					/>
					<p>
						Cadastre ao menos uma aula no calendário para registrar presenças.
					</p>
				</div>
			)}

			{carregando ? (
				<div
					role="status"
					className="space-y-3 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,.06)]"
					aria-busy="true"
					aria-label="Carregando presenças"
				>
					<div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
					<div className="h-12 animate-pulse rounded-lg bg-slate-100" />
					<div className="h-12 animate-pulse rounded-lg bg-slate-100" />
					<div className="h-12 animate-pulse rounded-lg bg-slate-100" />
				</div>
			) : (
				<PresenceGrid
					titulo={titulo}
					pessoas={pessoas}
					datas={datas}
					estadoNaData={estadoNaData}
					onAlterar={onAlterar}
					cores={coresEstado}
				/>
			)}
		</div>
	);
}
