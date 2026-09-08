"use client";
import { RotateCcw, Type } from "lucide-react";
import { scaleLabel } from "./suporte";

type PainelTamanhoTextoProps = {
	setTextScale: (scale: number) => void;
	textScale: number;
	percent: number;
};
export function PainelTamanhoTexto({
	setTextScale,
	textScale,
	percent,
}: PainelTamanhoTextoProps) {
	return (
		<section className="view-painel-tamanho-texto min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,.06)] sm:p-6">
			<div className="flex items-center gap-3">
				<span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
					<Type className="h-5 w-5" />
				</span>
				<div>
					<h2 className="text-lg font-bold text-slate-900">Tamanho do texto</h2>
					<p className="text-sm text-slate-500">
						Ajuste até 10 níveis acima ou abaixo do padrão.
					</p>
				</div>
			</div>
			<div className="mt-6 grid min-w-0 grid-cols-2 gap-3 sm:flex sm:items-center">
				<button
					type="button"
					onClick={() => setTextScale(textScale - 1)}
					disabled={textScale === -10}
					className="order-2 grid min-h-11 w-full place-items-center rounded-xl border border-slate-300 text-lg font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:order-1 sm:h-10 sm:w-10 sm:shrink-0"
					aria-label="Diminuir tamanho do texto"
				>
					−
				</button>
				<fieldset className="order-1 col-span-2 grid min-w-0 flex-1 grid-cols-7 place-items-center gap-2 sm:order-2 sm:flex sm:items-center sm:justify-between sm:gap-1">
					<legend className="sr-only">Níveis de tamanho do texto</legend>
					{Array.from({ length: 21 }, (_, index) => index - 10).map((scale) => (
						<button
							key={scale}
							type="button"
							onClick={() => setTextScale(scale)}
							aria-pressed={textScale === scale}
							aria-label={`${scale === 0 ? "Tamanho padrão" : `Tamanho ${scale > 0 ? "+" : ""}${scale} níveis`}${textScale === scale ? ", selecionado" : ""}`}
							className={`h-2 w-2 shrink-0 rounded-full transition-transform hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 sm:h-3 sm:w-3 ${textScale === scale ? "scale-125 bg-sky-700 ring-2 ring-sky-200" : scale === 0 ? "bg-orange-400" : "bg-slate-300 hover:bg-sky-400"}`}
						/>
					))}
				</fieldset>
				<button
					type="button"
					onClick={() => setTextScale(textScale + 1)}
					disabled={textScale === 10}
					className="order-3 grid min-h-11 w-full place-items-center rounded-xl border border-slate-300 text-lg font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10 sm:shrink-0"
					aria-label="Aumentar tamanho do texto"
				>
					+
				</button>
			</div>
			<div className="mt-3 flex flex-col items-start gap-2 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
				<span className="text-sm font-semibold text-sky-800">
					{scaleLabel(textScale)} · {percent}%
				</span>
				<button
					type="button"
					onClick={() => setTextScale(0)}
					disabled={textScale === 0}
					className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 underline underline-offset-4 disabled:opacity-40"
				>
					<RotateCcw className="h-4 w-4" />
					Restaurar padrão
				</button>
			</div>
		</section>
	);
}
