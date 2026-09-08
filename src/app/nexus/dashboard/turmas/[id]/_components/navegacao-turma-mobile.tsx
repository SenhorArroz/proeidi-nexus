"use client";
import { X } from "lucide-react";
import { TABS } from "./suporte";
import { useTurmaView } from "./use-turma-view";

type Estado = ReturnType<typeof useTurmaView>;
type NavegacaoTurmaMobileProps = {
	mobileNavOpen: NonNullable<Estado["mobileNavOpen"]>;
	tab: NonNullable<Estado["tab"]>;
	setTab: NonNullable<Estado["setTab"]>;
	setMobileNavOpen: NonNullable<Estado["setMobileNavOpen"]>;
	turma: NonNullable<Estado["turma"]>;
	corDestaqueLegivel: NonNullable<Estado["corDestaqueLegivel"]>;
	corTextoDestaque: NonNullable<Estado["corTextoDestaque"]>;
	tabAtual: Estado["tabAtual"];
	IconeTabAtual: NonNullable<Estado["IconeTabAtual"]>;
};

export function NavegacaoTurmaMobile({
	mobileNavOpen,
	tab,
	setTab,
	setMobileNavOpen,
	turma,
	corDestaqueLegivel,
	corTextoDestaque,
	tabAtual,
	IconeTabAtual,
}: NavegacaoTurmaMobileProps) {
	return (
		<div className="view-dashboard-turmas-id-navegacao-turma-mobile fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-30 sm:hidden">
			{mobileNavOpen && (
				<div className="absolute right-0 bottom-14 max-h-[min(24rem,calc(100dvh-6rem))] w-[min(14rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-sky-100 bg-white p-1.5 shadow-[0_14px_32px_rgb(15_23_42_/_0.2)]">
					{TABS.map((item) => {
						const Icon = item.icon;
						const active = tab === item.id;
						return (
							<button
								key={item.id}
								type="button"
								onClick={() => {
									setTab(item.id);
									setMobileNavOpen(false);
								}}
								className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
									active
										? "bg-sky-50 text-sky-700"
										: "text-gray-600 active:bg-slate-50"
								}`}
							>
								<Icon
									className="h-4 w-4"
									style={active ? { color: turma.cor } : undefined}
								/>
								{item.label}
							</button>
						);
					})}
				</div>
			)}
			<button
				type="button"
				onClick={() => setMobileNavOpen((open) => !open)}
				className="flex h-12 w-12 items-center justify-center rounded-full shadow-[0_10px_24px_rgb(2_132_199_/_0.34)] transition-transform active:scale-95"
				style={{
					backgroundColor: corDestaqueLegivel,
					color: corTextoDestaque,
				}}
				aria-label={
					mobileNavOpen
						? "Fechar navegação da turma"
						: `Abrir navegação: ${tabAtual?.label ?? "Início"}`
				}
				aria-expanded={mobileNavOpen}
			>
				{mobileNavOpen ? (
					<X className="h-5 w-5" />
				) : (
					<IconeTabAtual className="h-5 w-5" />
				)}
			</button>
		</div>
	);
}
