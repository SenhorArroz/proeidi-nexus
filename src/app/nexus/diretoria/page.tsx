"use client";
import React from "react";
import Link from "next/link";
import {
	Building2,
	DoorOpen,
	Users,
	ShieldCheck,
	FileText,
	Dices,
	GraduationCap,
	Briefcase,
	Wifi,
	HeartPulse,
	UserX,
	ClipboardCheck,
} from "lucide-react";

import { api } from "~/trpc/react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";

// ---------------------------------------------------------------------------
// Tipos e dados
// ---------------------------------------------------------------------------

interface Ferramenta {
	id: string;
	nome: string;
	link: string;
	descricao: string;
	icon: React.ElementType;
	cor: string;
}

const FERRAMENTAS: Ferramenta[] = [
	{
		id: "semestres",
		nome: "Gerenciar semestres",
		descricao: "Períodos letivos, semestre ativo e equipes vinculadas",
		link: "/nexus/diretoria/semestres",
		icon: Briefcase,
		cor: "#0F766E",
	},
	{
		id: "turmas",
		nome: "Gerenciar turmas",
		descricao: "Criar, editar e arquivar turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
		cor: "#0F766E",
	},
	{
		id: "professores",
		nome: "Gerenciar professores",
		descricao: "Cadastro, turmas atribuídas e permissões",
		link: "/nexus/diretoria/professores",
		icon: Users,
		cor: "#9334E6",
	},
	{
		id: "diretores",
		nome: "Gerenciar diretores",
		descricao: "Cadastro e controle de acesso dos diretores",
		link: "/nexus/diretoria/diretores",
		icon: Building2,
		cor: "#B06000",
	},
	{
		id: "monitores",
		nome: "Gerenciar monitores",
		descricao: "Cadastro e vínculo com turmas",
		link: "/nexus/diretoria/monitores",
		icon: ShieldCheck,
		cor: "#188038",
	},
	{
		id: "alunos",
		nome: "Gerenciar alunos",
		descricao: "Lista geral de alunos e seus dados",
		link: "/nexus/diretoria/alunos",
		icon: FileText,
		cor: "#999999",
	},
	{
		id: "presencas",
		nome: "Gerenciar presenças",
		descricao: "Alunos, monitores, professores e diretores docentes",
		link: "/nexus/diretoria/presencas",
		icon: ClipboardCheck,
		cor: "#0F766E",
	},
	{
		id: "sorteio",
		nome: "Gerenciar sorteio",
		descricao: "Sorteio de alunos para turmas",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
		cor: "#ff8400",
	},
	{
		id: "questionarios",
		nome: "Gerenciar questionários",
		descricao: "Questionários aplicados aos alunos",
		link: "/nexus/diretoria/questionarios",
		icon: FileText,
		cor: "#999999",
	},
];

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------

function StatMini({
	icon: Icon,
	label,
	valor,
	cor,
}: {
	icon: React.ElementType;
	label: string;
	valor: number | string;
	cor: string;
}) {
	return (
		<div className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
			<div
				className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
				style={{ backgroundColor: `${cor}14` }}
			>
				<Icon className="w-5 h-5" style={{ color: cor }} />
			</div>
			<div className="min-w-0">
				<p className="text-xl font-bold text-gray-900 leading-none">{valor}</p>
				<p className="text-[11px] text-gray-400 mt-0.5 truncate">{label}</p>
			</div>
		</div>
	);
}

function AcessoRapido({ ferramenta, destaque = false }: { ferramenta: Ferramenta; destaque?: boolean }) {
	const Icon = ferramenta.icon;
	return (
		<Link href={ferramenta.link} className={`group flex min-w-0 items-center gap-3 rounded-2xl p-3.5 transition-all duration-200 focus-visible:outline-none ${destaque ? "bg-white text-sky-950 shadow-[0_16px_28px_rgba(2,132,199,0.18)] hover:-translate-y-0.5" : "bg-sky-950/10 text-white hover:bg-white/15"}`}>
			<span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${destaque ? "bg-orange-100 text-orange-700" : "bg-white/18 text-white"}`}><Icon className="h-5 w-5" /></span>
			<span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{ferramenta.nome.replace("Gerenciar ", "")}</span><span className={`mt-0.5 block truncate text-xs ${destaque ? "text-slate-500" : "text-sky-100"}`}>{ferramenta.descricao}</span></span>
		</Link>
	);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function PainelDiretor() {
	const { data: resumo, isLoading } = api.diretoria.overview.useQuery();
	return (
		<div className="min-h-full w-full px-4 py-6 sm:px-6 lg:px-8">
			{/* Banner de topo */}
			<div className="mx-auto w-full max-w-6xl space-y-6">
				<section className="relative overflow-hidden rounded-[1.75rem] bg-sky-600 px-5 py-6 text-white shadow-[0_20px_45px_rgba(2,132,199,0.25)] sm:px-7">
					<div className="absolute -right-10 -top-12 h-48 w-48 rounded-full bg-orange-500" />
					<div className="absolute bottom-0 right-32 h-20 w-20 rounded-t-full border-[14px] border-sky-300/70" />
					<div className="relative grid gap-6 lg:grid-cols-[minmax(15rem,0.75fr)_minmax(0,1.6fr)] lg:items-end">
						<div><div className="mb-4 grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-white"><Building2 className="h-6 w-6" /></div><h1 className="text-3xl font-black tracking-[-0.035em]">Painel da Diretoria</h1><p className="mt-2 max-w-sm text-sm leading-6 text-sky-100">O ponto de partida para organizar pessoas, turmas e os movimentos do semestre.</p></div>
						<div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
							{FERRAMENTAS.filter((f) => ["alunos", "turmas", "presencas", "semestres"].includes(f.id)).map((f, index) => <AcessoRapido key={f.id} ferramenta={f}  />)}
						</div>
					</div>
				</section>

				<section className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
					<div className="rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
						<div className="mb-4 flex items-end justify-between gap-4"><div><h2 className="text-lg font-extrabold tracking-[-0.02em] text-slate-900">Roteiro de gestão</h2><p className="mt-1 text-sm text-slate-500">Acesse os próximos espaços de trabalho sem perder o contexto.</p></div></div>
						<div className="grid gap-2 sm:grid-cols-2">
							{FERRAMENTAS.filter((f) => !["alunos", "turmas", "presencas", "semestres", "diretores"].includes(f.id)).map((f) => <AcessoRapido key={f.id} ferramenta={f} destaque />)}
							{resumo?.role === "COORDENADOR" && FERRAMENTAS.filter((f) => f.id === "diretores").map((f) => <AcessoRapido key={f.id} ferramenta={f} destaque />)}
						</div>
					</div>
					<div className="rounded-2xl bg-orange-50 p-5 text-slate-800 shadow-[0_12px_30px_rgba(234,88,12,0.08)]"><h2 className="text-lg font-extrabold tracking-[-0.02em]">Resumo do semestre</h2><p className="mt-1 text-sm leading-6 text-slate-600">Números atualizados a partir dos registros cadastrados.</p><div className="mt-5 grid gap-3">
						{isLoading ? <DataSkeleton rows={3} /> : <><StatMini icon={GraduationCap} label="Total de alunos" valor={resumo?.totalAlunos ?? 0} cor="#1A73E8" />
						<StatMini icon={Users} label="Professores" valor={resumo?.totalProfessores ?? 0} cor="#9334E6" />
						<StatMini icon={ShieldCheck} label="Monitores ativos" valor={resumo?.totalMonitores ?? 0} cor="#188038" /></>}
						</div></div>
				</section>
			</div>
		</div>
	);
}
