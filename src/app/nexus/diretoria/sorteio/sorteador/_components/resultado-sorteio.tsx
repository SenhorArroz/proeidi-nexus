import { Loader2, UserCircle2 } from "lucide-react";

export function ResultadoSorteio({
	isAnimating,
	numero,
	ganhadorAtual,
	deviceType,
}: {
	isAnimating: boolean;
	numero: number | undefined;
	ganhadorAtual: string | null | undefined;
	deviceType: string;
}) {
	return (
		<div className="sorteador-result relative flex min-h-[clamp(7rem,16vh,11rem)] min-w-0 flex-1 flex-col items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-sky-50/50 px-3 py-3 sm:px-4">
			{isAnimating ? (
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-sky-600/50" />
					<div className="flex flex-col items-center text-center">
						<span className="animate-pulse text-xs font-semibold tracking-[0.25em] text-sky-600">
							PROCESSANDO
						</span>
						<span className="mt-1 font-mono text-xs text-sky-600/60">
							Entropy shift...
						</span>
					</div>
				</div>
			) : numero !== undefined ? (
				<div className="text-center animate-in zoom-in duration-500 w-full flex flex-col items-center justify-center">
					<div className="text-6xl font-black leading-none tracking-tighter text-sky-600 sm:text-7xl">
						{numero}
					</div>

					{/* Badge do dispositivo e Nome do Candidato */}
					{ganhadorAtual ? (
						<div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-full shadow-sm max-w-full">
							<UserCircle2 className="h-4 w-4 shrink-0" />
							<span className="min-w-0 truncate text-sm font-bold">
								{ganhadorAtual}
							</span>
						</div>
					) : (
						<div className="mt-3 inline-block rounded-full bg-amber-500 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white">
							{deviceType} registrado
						</div>
					)}
				</div>
			) : (
				<div className="flex flex-col items-center opacity-20">
					<div className="w-16 h-1 bg-gray-400 mb-2 rounded-full" />
					<span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
						Standby
					</span>
				</div>
			)}
		</div>
	);
}
