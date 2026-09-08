"use client";
import { PainelContraste } from "./_components/painel-contraste";
import { PainelTamanhoTexto } from "./_components/painel-tamanho-texto";
import { PainelTema } from "./_components/painel-tema";
import { PreviaAcessibilidade } from "./_components/previa-acessibilidade";

import { Settings2 } from "lucide-react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";

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
		<div className="min-h-full min-w-0 overflow-y-auto bg-slate-50 px-3 py-5 font-sans sm:px-4 sm:py-6">
			<div className="mx-auto w-full max-w-4xl">
				<div className="relative mb-6 min-w-0 overflow-hidden rounded-[1.75rem] bg-sky-700 px-4 py-6 text-white shadow-[0_20px_45px_rgba(3,105,161,.24)] sm:px-6 sm:py-8">
					<div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-orange-500" />
					<div className="relative flex items-start gap-4">
						<div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15">
							<Settings2 className="h-6 w-6" />
						</div>
						<div className="min-w-0">
							<h1 className="break-words text-[clamp(1.5rem,8vw,1.875rem)] font-black tracking-[-.03em]">
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
						<PainelTema theme={theme} setTheme={setTheme} />

						<PainelContraste
							highContrast={highContrast}
							setHighContrast={setHighContrast}
						/>

						<PainelTamanhoTexto
							setTextScale={setTextScale}
							textScale={textScale}
							percent={percent}
						/>
					</div>

					<PreviaAcessibilidade />
				</div>
			</div>
		</div>
	);
}
