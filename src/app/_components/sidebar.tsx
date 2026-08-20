"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAccessibility } from "~/app/_components/accessibility-preferences";
import {
	PanelLeftClose,
	PanelLeftOpen,
	LayoutDashboard,
	Users,
	Settings,
	ChevronDown,
	DoorOpen,
	FileText,
	GraduationCap,
	ShieldCheck,
	CalendarDays,
	Dices,
	ClipboardCheck,
	Contrast,
	Moon,
	Sun,
	Type,
} from "lucide-react";

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

const DIRETORIA_ITEMS: NavItem[] = [
	{
		id: "diretoria-inicio",
		label: "Painel da Diretoria",
		link: "/nexus/diretoria",
		icon: LayoutDashboard,
	},
	{
		id: "semestres",
		label: "Semestres",
		link: "/nexus/diretoria/semestres",
		icon: CalendarDays,
	},
	{
		id: "turmas",
		label: "Turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
	},
	{
		id: "alunos",
		label: "Alunos",
		link: "/nexus/diretoria/alunos",
		icon: GraduationCap,
	},
	{
		id: "professores",
		label: "Professores",
		link: "/nexus/diretoria/professores",
		icon: Users,
	},
	{
		id: "monitores",
		label: "Monitores",
		link: "/nexus/diretoria/monitores",
		icon: ShieldCheck,
	},
	{
		id: "presencas",
		label: "Presenças",
		link: "/nexus/diretoria/presencas",
		icon: ClipboardCheck,
	},
	{
		id: "questionarios",
		label: "Questionários",
		link: "/nexus/diretoria/questionarios",
		icon: FileText,
	},
	{
		id: "sorteio",
		label: "Sorteio",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
	},
];

function firstName(name: string) {
	return name.trim().split(/\s+/)[0] || "Usuário(a)";
}

// Componente utilitário para esconder/mostrar texto suavemente sem quebrar o layout
function Collapsible({
	collapsed,
	children,
}: {
	collapsed: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`grid transition-all duration-300 ease-in-out ${
				collapsed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
			}`}
		>
			<div className="overflow-hidden whitespace-nowrap flex items-center">
				{children}
			</div>
		</div>
	);
}

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const [headerTextVisible, setHeaderTextVisible] = useState(true);
	const headerAnimationTimer = useRef<number | null>(null);
	const [userName, setUserName] = useState("Usuário(a)");
	const pathname = usePathname();
	const [diretoriaAberta, setDiretoriaAberta] = useState(() =>
		pathname.startsWith("/nexus/diretoria"),
	);
	const [acessibilidadeAberta, setAcessibilidadeAberta] = useState(false);
	const {
		highContrast,
		setHighContrast,
		setTextScale,
		setTheme,
		textScale,
		theme,
	} = useAccessibility();

	useEffect(() => {
		const media = window.matchMedia("(max-width: 767px)");
		const atualizar = () => {
			setCollapsed(media.matches);
			setHeaderTextVisible(!media.matches);
		};
		atualizar();
		media.addEventListener("change", atualizar);
		return () => media.removeEventListener("change", atualizar);
	}, []);

	useEffect(() => {
		return () => {
			if (headerAnimationTimer.current) {
				window.clearTimeout(headerAnimationTimer.current);
			}
		};
	}, []);

	useEffect(() => {
		void fetch("/api/auth/session")
			.then((response) => (response.ok ? response.json() : null))
			.then((session: { user?: { name?: string | null } } | null) => {
				if (session?.user?.name) setUserName(firstName(session.user.name));
			})
			.catch(() => undefined);
	}, []);

	// Extrai o segmento após /nexus/ → ex: "/nexus/diretoria/algo" → "diretoria"
	const activeSegment = pathname.split("/")[2] ?? "dashboard";
	const toggleSidebar = () => {
		if (headerAnimationTimer.current) {
			window.clearTimeout(headerAnimationTimer.current);
		}

		if (collapsed) {
			setCollapsed(false);
			headerAnimationTimer.current = window.setTimeout(() => {
				setHeaderTextVisible(true);
			}, 500);
			return;
		}

		setHeaderTextVisible(false);
		headerAnimationTimer.current = window.setTimeout(() => {
			setCollapsed(true);
		}, 180);
	};

	return (
		<>
			{collapsed && (
				<button
					type="button"
					onClick={toggleSidebar}
					className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-30 flex h-12 w-12 items-center justify-center rounded-full bg-sky-600 text-white shadow-[0_10px_24px_rgb(2_132_199_/_0.34)] transition-transform active:scale-95 sm:hidden"
					aria-label="Abrir menu"
				>
					<PanelLeftOpen className="h-5 w-5" />
				</button>
			)}

			{!collapsed && (
				<button
					type="button"
					onClick={toggleSidebar}
					className="fixed inset-0 z-30 bg-slate-950/35 backdrop-blur-[1px] sm:hidden"
					aria-label="Fechar menu"
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-40 flex min-h-0 flex-col border-r border-sky-100 bg-white/95 shadow-[10px_0_30px_rgba(14,165,233,0.05)] transition-all duration-500 ease-in-out sm:relative sm:z-20 sm:h-full sm:shrink-0 ${
					collapsed
						? "w-0 -translate-x-full overflow-hidden sm:w-[72px] sm:translate-x-0 sm:overflow-visible"
						: "w-60 max-w-[calc(100vw-3.5rem)] translate-x-0 sm:w-64 sm:max-w-none"
				}`}
			>
			{/* Cabeçalho do Menu */}
			<div className="relative flex min-h-[5.75rem] items-start border-b border-sky-100 px-4 py-4">
				<div
					aria-hidden={!headerTextVisible}
					className={`pointer-events-none absolute top-4 right-12 left-4 overflow-hidden transition-opacity duration-[180ms] ease-out ${
						headerTextVisible ? "opacity-100" : "opacity-0"
					}`}
				>
					<div>
						<p className="text-sm font-medium text-slate-500">Bem-vindo,</p>
						<p className="sidebar-user-name break-all text-xl font-extrabold leading-7 text-sky-900 sm:text-2xl sm:leading-8">
							{userName}
							<span className="terminal-cursor ml-1 inline font-mono text-orange-500" aria-hidden="true">|</span>
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={toggleSidebar}
					className={`z-10 grid min-h-11 min-w-11 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-sky-600 flex-shrink-0 transition-colors ${
						collapsed ? "mx-auto" : "ml-auto"
					}`}
					aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
				>
					{collapsed ? (
						<PanelLeftOpen className="w-5 h-5" />
					) : (
						<PanelLeftClose className="w-5 h-5" />
					)}
				</button>
			</div>

			{/* Links de Navegação */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-1.5 custom-scrollbar">
				{NAV_ITEMS.map((item) => {
					const Icon = item.icon;
					const isActive = activeSegment === item.id;
					return (
						<Link
							key={item.id}
							href={item.link}
							title={collapsed ? item.label : undefined}
							className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
								isActive
									? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
									: "text-gray-600 hover:bg-gray-50 hover:text-sky-900"
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

				{!collapsed && (
					<p className="px-3 pt-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
						Área de gestão
					</p>
				)}
				{collapsed ? (
					<Link
						href="/nexus/diretoria"
						title="Diretoria"
						className={`flex min-h-11 w-full items-center justify-center rounded-xl px-3 py-2.5 transition-colors ${activeSegment === "diretoria" ? "bg-sky-50 text-sky-600" : "text-gray-600 hover:bg-gray-50"}`}
					>
						<Users className="w-5 h-5" />
					</Link>
				) : (
					<div className="space-y-1">
						<button
							type="button"
							onClick={() => setDiretoriaAberta((aberta) => !aberta)}
							className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${activeSegment === "diretoria" ? "bg-sky-600 text-white shadow-md shadow-sky-200" : "text-gray-700 hover:bg-sky-50 hover:text-sky-800"}`}
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
									const ativo = pathname === item.link;
									return (
										<Link
											key={item.id}
											href={item.link}
											className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${ativo ? "bg-orange-50 text-orange-800" : "text-gray-500 hover:bg-sky-50 hover:text-sky-900"}`}
										>
											<Icon className="h-3.5 w-3.5" />
											{item.label}
										</Link>
									);
								})}
							</div>
						)}
					</div>
				)}
			</nav>

			{/* Footer do Menu */}
			<div className="p-3 border-t border-gray-200 space-y-3">
				<Link
					href="/nexus/configuracoes"
					title={collapsed ? "Configurações" : undefined}
					className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
						pathname.startsWith("/nexus/configuracoes")
							? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
							: "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
					}`}
				>
					<Settings className="w-5 h-5 flex-shrink-0 text-gray-400" />
					<Collapsible collapsed={collapsed}>
						<span>Configurações</span>
					</Collapsible>
				</Link>

				<section
					aria-label="Acessibilidade"
					className="rounded-xl border border-sky-100 bg-sky-50/60 p-1.5"
				>
					<button
						type="button"
						onClick={() => setAcessibilidadeAberta((aberta) => !aberta)}
						aria-expanded={acessibilidadeAberta}
						aria-controls="opcoes-acessibilidade"
						title={collapsed ? "Acessibilidade" : undefined}
						className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold text-sky-800 transition-colors hover:bg-white ${collapsed ? "justify-center" : ""}`}
					>
						<Contrast className="h-4 w-4 shrink-0" />
						<Collapsible collapsed={collapsed}>
							<span className="flex-1">Acessibilidade</span>
						</Collapsible>
						{!collapsed && (
							<ChevronDown
								className={`h-4 w-4 transition-transform ${acessibilidadeAberta ? "rotate-180" : ""}`}
							/>
						)}
					</button>
					{acessibilidadeAberta && (
						<div
							id="opcoes-acessibilidade"
							className="space-y-1 border-t border-sky-100 pt-1.5"
						>
							<AccessibilityButton
								collapsed={collapsed}
								label={
									theme === "dark" ? "Usar tema claro" : "Usar tema escuro"
								}
								active={theme === "dark"}
								onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
								icon={theme === "dark" ? Moon : Sun}
							/>
							<AccessibilityButton
								collapsed={collapsed}
								label="Alto contraste"
								active={highContrast}
								onClick={() => setHighContrast(!highContrast)}
								icon={Contrast}
							/>
							<AccessibilityButton
								collapsed={collapsed}
								label="Aumentar letra"
								active={textScale > 0}
								onClick={() => setTextScale(textScale + 1)}
								icon={Type}
							/>
							<Link
								href="/nexus/acessibilidade"
								className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-sky-800 hover:bg-white ${collapsed ? "justify-center" : ""}`}
								title={collapsed ? "Personalizar acessibilidade" : undefined}
							>
								<Settings className="h-4 w-4 shrink-0" />
								<Collapsible collapsed={collapsed}>
									<span>Personalizar</span>
								</Collapsible>
							</Link>
						</div>
					)}
				</section>

				<div
					className={`flex items-center justify-center pt-2 pb-1 transition-all duration-500 ${collapsed ? "px-1" : "px-4"}`}
				>
					<Image
						src="/nexus_logo.png"
						alt="Logo ProEIDI Nexus"
						width={120}
						height={40}
						className={`object-contain transition-all duration-500 ease-in-out mix-blend-multiply ${
							collapsed ? "w-8 opacity-70" : "w-24 opacity-100"
						}`}
					/>
				</div>
			</div>
			</aside>
		</>
	);
}

function AccessibilityButton({
	active,
	collapsed,
	icon: Icon,
	label,
	onClick,
}: {
	active: boolean;
	collapsed: boolean;
	icon: React.ElementType;
	label: string;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			aria-pressed={active}
			title={collapsed ? label : undefined}
			className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-semibold transition-colors ${
				active
					? "bg-sky-600 text-white"
					: "text-gray-700 hover:bg-white hover:text-sky-800"
			} ${collapsed ? "justify-center" : ""}`}
		>
			<Icon className="h-4 w-4 shrink-0" />
			<Collapsible collapsed={collapsed}>
				<span className="flex-1">{label}</span>
			</Collapsible>
			{!collapsed && (
				<span className="text-[10px] font-bold" aria-hidden="true">
					{active ? "ATIVO" : ""}
				</span>
			)}
		</button>
	);
}
