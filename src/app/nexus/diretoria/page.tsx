"use client";
import { AcessoRapido } from "./_components/acesso-rapido";
import { StatMini } from "./_components/stat-mini";
import { FERRAMENTAS } from "./_components/suporte";

import { Building2, GraduationCap, ShieldCheck, Users } from "lucide-react";

import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function PainelDiretor() {
	const { data: resumo, isLoading } = api.diretoria.overview.useQuery();
	return (
		<div className="min-h-full w-full px-4 py-5 sm:px-6 lg:px-8">
			{/* Banner de topo */}
			<div className="mx-auto w-full max-w-6xl space-y-6">
				<section className="relative overflow-hidden rounded-[1.75rem] bg-sky-600 px-5 py-6 text-white shadow-[0_20px_45px_rgba(2,132,199,0.25)] sm:px-7">
					<div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-orange-500" />
					<div className="absolute bottom-0 right-32 h-20 w-20 rounded-t-full border-[14px] border-sky-300/70" />
					<div className="relative grid gap-6 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.6fr)] lg:items-end">
						<div>
							<div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white">
								<Building2 className="h-6 w-6" />
							</div>
							<h1 className="text-3xl font-black tracking-[-0.035em]">
								Painel da Diretoria
							</h1>
							<p className="mt-2 max-w-sm text-sm leading-6 text-sky-100">
								O nexus para organizar pessoas, turmas e os movimentos do
								semestre.
							</p>
						</div>
						<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
							{FERRAMENTAS.filter((f) =>
								["alunos", "turmas", "presencas", "semestres"].includes(f.id),
							).map((f, index) => (
								<AcessoRapido key={f.id} ferramenta={f} />
							))}
						</div>
					</div>
				</section>

				<section className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
					<div className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
						<div className="mb-4 flex items-end justify-between gap-4">
							<div>
								<h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-900">
									Ferramentas de Gestão
								</h2>
								<p className="mt-1 text-sm text-slate-500">
									Acesse os espaços de trabalho do Nexus.
								</p>
							</div>
						</div>
						<div className="grid gap-2 sm:grid-cols-2">
							{FERRAMENTAS.filter(
								(f) =>
									![
										"alunos",
										"turmas",
										"presencas",
										"semestres",
										"diretores",
									].includes(f.id),
							).map((f) => (
								<AcessoRapido key={f.id} ferramenta={f} destaque />
							))}
							{resumo?.role === "COORDENADOR" &&
								FERRAMENTAS.filter((f) => f.id === "diretores").map((f) => (
									<AcessoRapido key={f.id} ferramenta={f} destaque />
								))}
						</div>
					</div>
					<div className="rounded-2xl bg-orange-50 p-5 text-slate-800 shadow-[0_12px_30px_rgba(234,88,12,0.08)]">
						<h2 className="text-lg font-extrabold tracking-[-0.02em]">
							Resumo do semestre
						</h2>
						<p className="mt-1 text-sm leading-6 text-slate-600">
							Números atualizados a partir dos registros cadastrados.
						</p>
						<div className="mt-5 grid gap-3">
							{isLoading ? (
								<DataSkeleton rows={3} />
							) : (
								<>
									<StatMini
										icon={GraduationCap}
										label="Total de alunos"
										valor={resumo?.totalAlunos ?? 0}
										cor="#1A73E8"
									/>
									<StatMini
										icon={Users}
										label="Professores"
										valor={resumo?.totalProfessores ?? 0}
										cor="#9334E6"
									/>
									<StatMini
										icon={ShieldCheck}
										label="Monitores ativos"
										valor={resumo?.totalMonitores ?? 0}
										cor="#188038"
									/>
								</>
							)}
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
