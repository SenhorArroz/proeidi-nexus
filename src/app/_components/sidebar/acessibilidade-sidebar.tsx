import { ChevronDown, Contrast, Moon, Settings, Sun, Type } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useAccessibility } from "../accessibility-preferences";
import { Collapsible } from "./collapsible";

export function AcessibilidadeSidebar({ collapsed }: { collapsed: boolean }) {
	const [acessibilidadeAberta, setAcessibilidadeAberta] = useState(false);
	const {
		highContrast,
		setHighContrast,
		setTextScale,
		setTheme,
		textScale,
		theme,
	} = useAccessibility();

	return (
		<section
			aria-label="Acessibilidade"
			className="rounded-xl border border-sky-100 bg-sky-50/60 p-1.5 dark:border-sky-950 dark:bg-slate-900/90"
		>
			<button
				type="button"
				onClick={() => setAcessibilidadeAberta((aberta) => !aberta)}
				aria-expanded={acessibilidadeAberta}
				aria-controls="opcoes-acessibilidade"
				title={collapsed ? "Acessibilidade" : undefined}
				className={`flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-bold text-sky-800 transition-colors hover:bg-white dark:text-sky-200 dark:hover:bg-slate-800 ${collapsed ? "justify-center" : ""}`}
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
					className="space-y-1 border-t border-sky-100 pt-1.5 dark:border-sky-950"
				>
					<AccessibilityButton
						collapsed={collapsed}
						label={theme === "dark" ? "Usar tema claro" : "Usar tema escuro"}
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
						className={`flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-sky-800 hover:bg-white dark:text-sky-200 dark:hover:bg-slate-800 ${collapsed ? "justify-center" : ""}`}
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
					: "text-gray-700 hover:bg-white hover:text-sky-800 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-sky-200"
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
