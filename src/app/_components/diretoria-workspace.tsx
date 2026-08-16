"use client";

import { ArrowUpRight, CalendarDays, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { api } from "~/trpc/react";

const ROTAS: Record<string, string> = {
	"/nexus/diretoria": "Visão geral",
	"/nexus/diretoria/alunos": "Alunos",
	"/nexus/diretoria/turmas": "Turmas",
	"/nexus/diretoria/professores": "Professores",
	"/nexus/diretoria/monitores": "Monitores",
	"/nexus/diretoria/presencas": "Presenças",
	"/nexus/diretoria/semestres": "Semestres",
	"/nexus/diretoria/formularios": "Formulários",
	"/nexus/diretoria/sorteio": "Sorteio",
	"/nexus/diretoria/diretores": "Diretores",
};

export default function DiretoriaWorkspace({ children }: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const area = ROTAS[pathname] ?? "Diretoria";
	const { data: semestres } = api.diretoria.semestres.list.useQuery();
	const semestre = semestres?.find((item) => item.ativo) ?? semestres?.[0];

	return (
		<div className="diretoria-workspace min-h-full">
			<header className="diretoria-workspace__bar">
				<div className="min-w-0">
					<p className="diretoria-workspace__crumb">Diretoria <ArrowUpRight aria-hidden="true" /> {area}</p>
				</div>
			</header>
			{children}
		</div>
	);
}
