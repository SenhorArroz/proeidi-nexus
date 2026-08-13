"use client";
import React from "react";
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
} from "lucide-react";

import FerramentaCard from "~/app/_components/ferramentaCerd";

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
		id: "turmas",
		nome: "Gerenciar turmas",
		descricao: "Criar, editar e arquivar turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
		cor: "#1A73E8",
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
		id: "sorteio",
		nome: "Gerenciar sorteio",
		descricao: "Sorteio de alunos para turmas",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
		cor: "#ff8400",
	},
];

// Dados mock do semestre
const RESUMO_SEMESTRE = {
	totalAlunos: 55,
	totalProfessores: 4,
	totalMonitores: 5,
	alunosQueTrabalham: 31,
	alunosSemInternet: 6,
	alunosComProblemaSaude: 9,
	evasao: 3,
};

interface TurmaResumo {
	nome: string;
	alunos: number;
	professores: string[];
	monitores: string[];
	cor: string;
}

const TURMAS_RESUMO: TurmaResumo[] = [
	{
		nome: "Turma A — Manhã",
		alunos: 22,
		professores: ["Thales", "Mariana"],
		monitores: ["Lucas"],
		cor: "#1A73E8",
	},
	{
		nome: "Turma B — Tarde",
		alunos: 18,
		professores: ["Renata"],
		monitores: ["Camila", "Pedro"],
		cor: "#9334E6",
	},
	{
		nome: "Turma C — Noite (Avançado)",
		alunos: 15,
		professores: ["Fábio"],
		monitores: ["Ana", "João"],
		cor: "#188038",
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

function TurmaRow({ turma }: { turma: TurmaResumo }) {
	return (
		<div className="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
			{/* Bolinha com cor da turma */}
			<div
				className="w-3 h-3 rounded-full flex-shrink-0"
				style={{ backgroundColor: turma.cor }}
			/>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-gray-800 truncate">{turma.nome}</p>
				<div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
					<span className="flex items-center gap-1">
						<GraduationCap className="w-3 h-3" />
						{turma.alunos} alunos
					</span>
					<span className="flex items-center gap-1">
						<Users className="w-3 h-3" />
						{turma.professores.join(", ")}
					</span>
					<span className="flex items-center gap-1">
						<ShieldCheck className="w-3 h-3" />
						{turma.monitores.join(", ")}
					</span>
				</div>
			</div>

			{/* Barra proporcional de alunos */}
			<div className="hidden sm:flex items-center gap-2 w-32 flex-shrink-0">
				<div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
					<div
						className="h-full rounded-full transition-all duration-500 ease-out"
						style={{
							width: `${(turma.alunos / RESUMO_SEMESTRE.totalAlunos) * 100}%`,
							backgroundColor: turma.cor,
						}}
					/>
				</div>
				<span className="text-xs font-medium text-gray-500 w-8 text-right">
					{Math.round((turma.alunos / RESUMO_SEMESTRE.totalAlunos) * 100)}%
				</span>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function PainelDiretor() {
	return (
		<div className="min-h-full w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
			{/* Banner de topo */}
			<div className="w-full max-w-5xl relative rounded-2xl overflow-hidden mb-8 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] bg-gradient-to-br from-sky-600 to-sky-500">
				<div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-600 " />
				<div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-amber-600 mix-blend-overlay" />

				<div className="relative flex items-center gap-3">
					<div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg border-3 border-amber-600 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						<Building2 className="w-[80%] h-[80%] text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="text-[clamp(1rem,1.8vw,1.375rem)] font-semibold text-white leading-tight truncate">
							Painel do Diretor
						</h1>
						<p className="text-[clamp(0.65rem,1vw,0.8rem)] text-white/70 truncate">
							Ferramentas de gestão e visão geral das turmas
						</p>
					</div>
				</div>
			</div>

			<div className="w-full max-w-5xl space-y-8">
				{/* Ferramentas */}
				<section>
					<h2 className="text-sm font-medium text-gray-700 mb-3">Ferramentas</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{FERRAMENTAS.map((f) => (
							<FerramentaCard key={f.id} ferramenta={f} />
						))}
					</div>
				</section>

				{/* Resumo numérico do semestre */}
				<section>
					<h2 className="text-sm font-medium text-gray-700 mb-3 text-center">Resumo do Semestre</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
						<StatMini icon={GraduationCap} label="Total de alunos" valor={RESUMO_SEMESTRE.totalAlunos} cor="#1A73E8" />
						<StatMini icon={Users} label="Professores" valor={RESUMO_SEMESTRE.totalProfessores} cor="#9334E6" />
						<StatMini icon={ShieldCheck} label="Monitores ativos" valor={RESUMO_SEMESTRE.totalMonitores} cor="#188038" />
					</div>
				</section>
			</div>
		</div>
	);
}
