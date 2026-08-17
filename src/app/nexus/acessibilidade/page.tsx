"use client";

import { Contrast, Moon, RotateCcw, Settings2, Sun, Type } from "lucide-react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";

const scaleLabel = (scale: number) => {
	if (scale === 0) return "Padrão";
	return scale > 0 ? `+${scale} níveis` : `${scale} níveis`;
};

export default function AcessibilidadePage() {
	const {
		theme,
		highContrast,
		setHighContrast,
		setTextScale,
		setTheme,
		textScale,
	} = useAccessibility();
	const percent = 100 + textScale * 5;

	return (
		<div className="min-h-full overflow-y-auto bg-slate-50 px-4 py-6 font-sans">
			<div className="mx-auto w-full max-w-4xl">
				<div className="relative mb-6 overflow-hidden rounded-[1.75rem] bg-sky-700 px-6 py-8 text-white shadow-[0_20px_45px_rgba(3,105,161,.24)]">
					<div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-orange-500" />
					<div className="relative flex items-start gap-4">
						<div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
							<Settings2 className="h-6 w-6" />
						</div>
						<div>
							<h1 className="text-3xl font-black tracking-[-.03em]">
								Acessibilidade
							</h1>
							<p className="mt-1 max-w-xl text-sm text-sky-100">
								Ajuste a aparência do Nexus para uma leitura mais confortável e
								nítida.
							</p>
						</div>
					</div>
				</div>

				<div className="grid gap-5 lg:grid-cols-[1.25fr_.75fr]">
					<div className="space-y-5">
						<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,.06)]">
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
								className="mt-5 grid grid-cols-2 gap-3"
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

						<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,.06)]">
							<div className="flex items-center justify-between gap-4">
								<div className="flex items-center gap-3">
									<span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-700">
										<Contrast className="h-5 w-5" />
									</span>
									<div>
										<h2 className="text-lg font-bold text-slate-900">
											Alto contraste
										</h2>
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

						<section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,.06)]">
							<div className="flex items-center gap-3">
								<span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-100 text-violet-700">
									<Type className="h-5 w-5" />
								</span>
								<div>
									<h2 className="text-lg font-bold text-slate-900">
										Tamanho do texto
									</h2>
									<p className="text-sm text-slate-500">
										Ajuste até 10 níveis acima ou abaixo do padrão.
									</p>
								</div>
							</div>
							<div className="mt-6 flex items-center gap-2 sm:gap-3">
								<button
									type="button"
									onClick={() => setTextScale(textScale - 1)}
									disabled={textScale === -10}
									className="grid h-10 w-10 place-items-center rounded-xl border border-slate-300 text-lg font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
									aria-label="Diminuir tamanho do texto"
								>
									−
								</button>
								<fieldset className="flex min-w-0 flex-1 items-center justify-between gap-0 sm:gap-1">
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
									className="grid h-10 w-10 place-items-center rounded-xl border border-slate-300 text-lg font-bold text-slate-800 disabled:cursor-not-allowed disabled:opacity-40"
									aria-label="Aumentar tamanho do texto"
								>
									+
								</button>
							</div>
							<div className="mt-3 flex items-center justify-between">
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
					</div>

					<aside className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
						<h2 className="text-lg font-bold text-sky-950">Prévia</h2>
						<p className="mt-1 text-sm text-sky-800">
							Veja o resultado das preferências antes de continuar.
						</p>
						<div className="mt-5 rounded-xl border border-sky-200 bg-white p-4">
							<p className="text-base font-bold text-slate-900">
								Leitura confortável para todos
							</p>
							<p className="mt-2 text-sm text-slate-600">
								O ProEIDI Nexus adapta a interface às suas necessidades, sem
								alterar seus dados ou permissões.
								<br />
								A - a
								<br />
								1234567890!@#$%¨&*()_+-=
							</p>
							<button
								type="button"
								className="mt-4 rounded-lg bg-sky-700 px-3 py-2 text-sm font-bold text-white"
							>
								Exemplo de ação
							</button>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}

function ThemeOption({
	active,
	icon: Icon,
	label,
	onClick,
}: {
	active: boolean;
	icon: typeof Sun;
	label: string;
	onClick: () => void;
}) {
	return (
		<label
			className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-colors ${active ? "border-sky-700 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-700 hover:border-sky-300"}`}
		>
			<input
				type="radio"
				name="tema"
				checked={active}
				onChange={onClick}
				className="sr-only"
			/>
			<Icon className="h-5 w-5" />
			{label}
		</label>
	);
}
