import {
	Boxes,
	CalendarDays,
	ChevronDown,
	ClipboardCheck,
	Dices,
	DoorOpen,
	FileText,
	GraduationCap,
	LayoutDashboard,
	Printer,
	ShieldCheck,
	Trophy,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Collapsible } from "./collapsible";

interface NavItem {
	id: string;
	label: string;
	link: string;
	icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		link: "/nexus/dashboard",
		icon: LayoutDashboard,
	},
];

const QUESTIONARIOS_ITEM: NavItem = {
	id: "questionarios",
	label: "Questionários",
	link: "/nexus/questionarios",
	icon: FileText,
};

const DIRETORIA_ITEMS: NavItem[] = [
	{
		id: "alunos",
		label: "Alunos",
		link: "/nexus/diretoria/alunos",
		icon: GraduationCap,
	},
	{
		id: "materiais-atualizacao",
		label: "Atualização de materiais",
		link: "/nexus/diretoria/materiais-atualizacao",
		icon: Wrench,
	},
	{
		id: "conecta",
		label: "Conecta View",
		link: "/nexus/diretoria/conecta",
		icon: Trophy,
	},
	{
		id: "estoque",
		label: "Estoque",
		link: "/nexus/diretoria/estoque",
		icon: Boxes,
	},
	{
		id: "impressao",
		label: "Impressão de apostilas",
		link: "/nexus/diretoria/impressao",
		icon: Printer,
	},
	{
		id: "monitores",
		label: "Monitores",
		link: "/nexus/diretoria/monitores",
		icon: ShieldCheck,
	},
	{
		id: "diretoria-inicio",
		label: "Painel da Diretoria",
		link: "/nexus/diretoria",
		icon: LayoutDashboard,
	},
	{
		id: "presencas",
		label: "Presenças",
		link: "/nexus/diretoria/presencas",
		icon: ClipboardCheck,
	},
	{
		id: "professores",
		label: "Professores",
		link: "/nexus/diretoria/professores",
		icon: Users,
	},
	{
		id: "semestres",
		label: "Semestres",
		link: "/nexus/diretoria/semestres",
		icon: CalendarDays,
	},
	{
		id: "sorteio",
		label: "Sorteio",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
	},
	{
		id: "turmas",
		label: "Turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
	},
];

export function NavegacaoSidebar({
	collapsed,
	pathname,
	podeVerDiretoria,
	podeVerQuestionarios,
}: {
	collapsed: boolean;
	pathname: string;
	podeVerDiretoria: boolean;
	podeVerQuestionarios: boolean;
}) {
	const [diretoriaAberta, setDiretoriaAberta] = useState(() =>
		pathname.startsWith("/nexus/diretoria"),
	);

	useEffect(() => {
		if (pathname.startsWith("/nexus/diretoria")) setDiretoriaAberta(true);
	}, [pathname]);

	const diretoriaAtiva = pathname.startsWith("/nexus/diretoria");
	const itemEstaAtivo = (link: string) => {
		if (link === "/nexus/diretoria") return pathname === link;
		if (link === "/nexus/diretoria/questionarios")
			return (
				pathname.startsWith(link) ||
				pathname.startsWith("/nexus/diretoria/formularios")
			);
		return pathname === link || pathname.startsWith(`${link}/`);
	};

	return (
		<nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1.5 custom-scrollbar">
			{[
				...NAV_ITEMS,
				...(podeVerQuestionarios ? [QUESTIONARIOS_ITEM] : []),
			].map((item) => {
				const Icon = item.icon;
				const isActive =
					pathname === item.link || pathname.startsWith(`${item.link}/`);
				return (
					<Link
						key={item.id}
						href={item.link}
						title={collapsed ? item.label : undefined}
						className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
							isActive
								? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
								: "text-gray-600 hover:bg-gray-50 hover:text-sky-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-sky-200"
						}`}
					>
						<Icon
							className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? "text-sky-600" : "text-gray-400"}`}
						/>
						<Collapsible collapsed={collapsed}>
							<span>{item.label}</span>
						</Collapsible>
					</Link>
				);
			})}

			{podeVerDiretoria && !collapsed && (
				<p className="px-3 pt-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
					Área de gestão
				</p>
			)}
			{podeVerDiretoria &&
				(collapsed ? (
					<Link
						href="/nexus/diretoria"
						title="Diretoria"
						className={`flex min-h-11 w-full items-center justify-center rounded-xl px-3 py-2.5 transition-colors ${diretoriaAtiva ? "bg-sky-50 text-sky-600" : "text-sky-800 hover:bg-sky-50"}`}
					>
						<Users className="w-5 h-5" />
					</Link>
				) : (
					<div className="space-y-1">
						<button
							type="button"
							onClick={() => setDiretoriaAberta((aberta) => !aberta)}
							className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${diretoriaAtiva ? "bg-sky-600 text-white shadow-md shadow-sky-200" : "text-sky-800 hover:bg-sky-50 hover:text-sky-950"}`}
							aria-expanded={diretoriaAberta}
						>
							<Users className="w-5 h-5 flex-shrink-0" />
							<span className="flex-1 text-left">Diretoria</span>
							<ChevronDown
								className={`h-4 w-4 transition-transform ${diretoriaAberta ? "rotate-180" : ""}`}
							/>
						</button>
						{diretoriaAberta && (
							<div className="ml-4 mt-1 space-y-0.5 border-l-2 border-orange-200 pl-2">
								{DIRETORIA_ITEMS.map((item) => {
									const Icon = item.icon;
									const ativo = itemEstaAtivo(item.link);
									return (
										<Link
											key={item.id}
											href={item.link}
											className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${ativo ? "bg-orange-50 text-orange-800" : "text-sky-800 hover:bg-sky-50 hover:text-sky-950"}`}
										>
											<Icon className="h-3.5 w-3.5" />
											{item.label}
										</Link>
									);
								})}
							</div>
						)}
					</div>
				))}
		</nav>
	);
}
