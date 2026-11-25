"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";
import { AcessibilidadeSidebar } from "./sidebar/acessibilidade-sidebar";
import { Collapsible } from "./sidebar/collapsible";
import { NavegacaoSidebar } from "./sidebar/navegacao-sidebar";

function firstName(name: string) {
	return name.trim().split(/\s+/)[0] || "Usuário(a)";
}

export default function Sidebar() {
	const [collapsed, setCollapsed] = useState(false);
	const [headerTextVisible, setHeaderTextVisible] = useState(true);
	const headerAnimationTimer = useRef<number | null>(null);
	const [userName, setUserName] = useState("Usuário(a)");
	const [podeVerDiretoria, setPodeVerDiretoria] = useState(false);
	const [podeVerQuestionarios, setPodeVerQuestionarios] = useState(false);
	const pathname = usePathname();

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
			.then(
				(
					session: { user?: { name?: string | null; role?: string } } | null,
				) => {
					if (session?.user?.name) setUserName(firstName(session.user.name));
					setPodeVerDiretoria(
						session?.user?.role === "DIRETOR" ||
							session?.user?.role === "COORDENADOR",
					);
					setPodeVerQuestionarios(
						session?.user?.role === "PROFESSOR" ||
							session?.user?.role === "DIRETOR" ||
							session?.user?.role === "COORDENADOR",
					);
				},
			)
			.catch(() => undefined);
	}, []);

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
				className={`nexus-sidebar fixed inset-y-0 left-0 z-40 flex min-h-0 flex-col border-r border-sky-100 bg-white/95 shadow-[10px_0_30px_rgba(14,165,233,0.05)] transition-all duration-500 ease-in-out dark:border-slate-700 dark:bg-slate-950 sm:relative sm:z-20 sm:h-full sm:shrink-0 ${
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
							<p className="text-sm font-medium text-slate-500 dark:text-slate-300">
								Bem-vindo,
							</p>
							<p className="sidebar-user-name break-all text-xl font-extrabold leading-7 text-sky-900 sm:text-2xl sm:leading-8">
								{userName}
								<span
									className="terminal-cursor ml-1 inline font-mono text-orange-500"
									aria-hidden="true"
								>
									|
								</span>
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={toggleSidebar}
						className={`z-10 grid min-h-11 min-w-11 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-sky-600 dark:text-slate-400 dark:hover:bg-slate-800 flex-shrink-0 transition-colors ${
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
				<NavegacaoSidebar
					collapsed={collapsed}
					pathname={pathname}
					podeVerDiretoria={podeVerDiretoria}
					podeVerQuestionarios={podeVerQuestionarios}
				/>

				{/* Footer do Menu */}
				<div className="p-3 border-t border-gray-200 space-y-3">
					<Link
						href="/nexus/configuracoes"
						title={collapsed ? "Configurações" : undefined}
						className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
							pathname.startsWith("/nexus/configuracoes")
								? "bg-sky-50 text-sky-600 shadow-sm ring-1 ring-sky-100"
								: "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
						}`}
					>
						<Settings className="w-5 h-5 flex-shrink-0 text-gray-400" />
						<Collapsible collapsed={collapsed}>
							<span>Configurações</span>
						</Collapsible>
					</Link>

					<AcessibilidadeSidebar collapsed={collapsed} />

					<div
						className={`flex items-center z-10 justify-center pt-2 pb-1 transition-all duration-500 ${collapsed ? "px-1" : "px-4"}`}
					>
						<Image
							src="/nexus_logo.png"
							alt="Logo ProEIDI Nexus"
							width={120}
							height={40}
							className={`object-contain transition-all duration-500 ease-in-out  ${
								collapsed ? "w-8 opacity-100" : "w-24 opacity-100"
							}`}
						/>
					</div>
				</div>
			</aside>
		</>
	);
}
