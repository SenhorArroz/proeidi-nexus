"use client";
import { Moon, Sun } from "lucide-react";
import { ThemeOption } from "./theme-option";

type PainelTemaProps = {
	theme: "light" | "dark";
	setTheme: (theme: "light" | "dark") => void;
};
export function PainelTema({ theme, setTheme }: PainelTemaProps) {
	return (
		<section className="view-painel-tema min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] sm:p-6">
			<div className="flex items-center gap-3">
				<span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
					<Sun className="h-5 w-5" />
				</span>
				<div>
					<h2 className="text-lg font-bold text-slate-900">Tema</h2>
					<p className="text-sm text-slate-500">
						Escolha a luminosidade da interface.
					</p>
				</div>
			</div>
			<div
				className="mt-5 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2"
				role="radiogroup"
				aria-label="Tema de cores"
			>
				<ThemeOption
					active={theme === "light"}
					icon={Sun}
					label="Claro"
					onClick={() => setTheme("light")}
				/>
				<ThemeOption
					active={theme === "dark"}
					icon={Moon}
					label="Escuro"
					onClick={() => setTheme("dark")}
				/>
			</div>
		</section>
	);
}
