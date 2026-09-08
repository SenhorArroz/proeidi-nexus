"use client";
import { Contrast } from "lucide-react";

type PainelContrasteProps = {
	highContrast: boolean;
	setHighContrast: (enabled: boolean) => void;
};
export function PainelContraste({
	highContrast,
	setHighContrast,
}: PainelContrasteProps) {
	return (
		<section className="view-painel-contraste min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] sm:p-6">
			<div className="flex flex-col items-start gap-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
				<div className="flex items-center gap-3">
					<span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-700">
						<Contrast className="h-5 w-5" />
					</span>
					<div>
						<h2 className="text-lg font-bold text-slate-900">Alto contraste</h2>
						<p className="text-sm text-slate-500">
							Reforça cores, textos, bordas e foco.
						</p>
					</div>
				</div>
				<button
					type="button"
					role="switch"
					aria-checked={highContrast}
					onClick={() => setHighContrast(!highContrast)}
					className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${highContrast ? "bg-sky-700" : "bg-slate-300"}`}
				>
					<span
						className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${highContrast ? "translate-x-6" : "translate-x-1"}`}
					/>
				</button>
			</div>
		</section>
	);
}
