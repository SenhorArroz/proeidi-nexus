"use client";
import { TABS } from "./suporte";
import { useTurmaView } from "./use-turma-view";

type Estado = ReturnType<typeof useTurmaView>;
type NavegacaoTurmaDesktopProps = {
	tab: NonNullable<Estado["tab"]>;
	setTab: NonNullable<Estado["setTab"]>;
};

export function NavegacaoTurmaDesktop({
	tab,
	setTab,
}: NavegacaoTurmaDesktopProps) {
	return (
		<nav className="view-dashboard-turmas-id-navegacao-turma-desktop hidden flex-shrink-0 items-stretch border-t border-sky-100 bg-white shadow-[0_-8px_24px_rgba(15,23,42,.05)] sm:flex">
			<div className="flex w-full max-w-6xl mx-auto items-stretch overflow-x-auto">
				{TABS.map((t) => {
					const Icon = t.icon;
					const active = tab === t.id;
					return (
						<button
							key={t.id}
							onClick={() => setTab(t.id)}
							className="flex min-w-20 flex-1 flex-col items-center justify-center gap-1 py-2.5 sm:py-3 relative transition-colors cursor-pointer"
						>
							{active && (
								<span
									className="absolute top-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-0.5 rounded-full"
									style={{ backgroundColor: "#f97316" }}
								/>
							)}
							<Icon
								className={`w-5 h-5 transition-colors ${active ? "" : "text-gray-400"}`}
								style={active ? { color: "#0284c7" } : undefined}
							/>
							<span
								className={`text-[10px] sm:text-xs transition-colors ${active ? "font-semibold" : "text-gray-400"}`}
								style={active ? { color: "#0284c7" } : undefined}
							>
								{t.label}
							</span>
						</button>
					);
				})}
			</div>
		</nav>
	);
}
