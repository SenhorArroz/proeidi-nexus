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
		<div className="diretoria-workspace relative isolate min-h-full overflow-hidden">
			<span aria-hidden="true" className="pointer-events-none absolute -right-32 -top-24 h-96 w-96 rounded-full bg-sky-600/25 blur-3xl" />
			<span aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full bg-amber-600/20 blur-3xl" />
			<div className="relative z-10">
				<header className="diretoria-workspace__bar">
					<div className="min-w-0">
						<p className="diretoria-workspace__crumb">Diretoria <ArrowUpRight aria-hidden="true" /> {area}</p>
					</div>
				</header>
				<div className="diretoria-workspace__content">{children}</div>
			</div>
		</div>
	);
}
