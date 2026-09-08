"use client";
import { History } from "lucide-react";
import { useSorteadorOrganico } from "./use-sorteador-organico";

type Estado = ReturnType<typeof useSorteadorOrganico>;
type HistoricoSorteadorProps = {
	smartphoneHistory: NonNullable<Estado["smartphoneHistory"]>;
	modo: NonNullable<Estado["modo"]>;
	deviceType: NonNullable<Estado["deviceType"]>;
	getNomeCandidato: NonNullable<Estado["getNomeCandidato"]>;
	computerHistory: NonNullable<Estado["computerHistory"]>;
};

export function HistoricoSorteador({
	smartphoneHistory,
	modo,
	deviceType,
	getNomeCandidato,
	computerHistory,
}: HistoricoSorteadorProps) {
	return (
		<div className="view-diretoria-sorteio-sorteador-historico-sorteador sorteador-card sorteador-history-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
			{/* Cabeçalho do card */}
			<div className="sorteador-card-header relative shrink-0 overflow-hidden bg-orange-600 px-4 py-3 sm:px-5">
				<div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-sky-300/50" />
				<div className="relative flex items-center gap-2.5">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/20 bg-white/20 backdrop-blur-sm">
						<History className="w-[55%] h-[55%] text-white" />
					</div>
					<span className="truncate text-sm font-semibold text-white">
						Histórico de sorteios
					</span>
				</div>
			</div>

			{/* Corpo do card */}
			<div className="flex-1 flex flex-col divide-y divide-gray-100 min-h-0">
				{/* Seção Smartphone */}
				<div className="sorteador-history-section flex min-h-0 flex-1 flex-col p-3 sm:p-4">
					<div className="mb-2 flex shrink-0 items-center justify-between gap-2">
						<span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
							Smartphone
						</span>
						<span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
							{smartphoneHistory.length}{" "}
							{modo === "vinculado" ? "Pessoas" : "IDs"}
						</span>
					</div>
					<div className="sorteador-history-list flex min-h-0 min-w-0 flex-1 flex-wrap content-start gap-1.5 overflow-x-hidden overflow-y-auto pr-1">
						{smartphoneHistory.map((num, i) => {
							const isLast = i === 0 && deviceType === "Smartphone";

							// Renderização Condicional: Modo Vinculado vs Simples
							if (modo === "vinculado") {
								const nome = getNomeCandidato(num, "Smartphone");
								return (
									<div
										key={num}
										className={`flex min-w-0 w-full items-center gap-2 rounded-xl border px-2 py-1.5 transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-gray-50 border-gray-100"}`}
									>
										<div
											className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-white border border-gray-200 text-black"}`}
										>
											{num}
										</div>
										{nome ? (
											<span
												className={`min-w-0 truncate text-sm font-semibold ${isLast ? "text-amber-800" : "text-gray-700"}`}
											>
												{nome}
											</span>
										) : (
											<span className="text-sm font-medium italic text-gray-400">
												Ficha sem registro
											</span>
										)}
									</div>
								);
							}

							// Original Mode (Apenas quadrados)
							return (
								<div
									key={num}
									className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
										isLast
											? "bg-amber-500 text-white scale-110 shadow-md"
											: "bg-sky-600 text-white"
									}`}
								>
									{num}
								</div>
							);
						})}
						{smartphoneHistory.length === 0 && (
							<span className="mx-auto py-4 text-sm font-medium text-gray-400">
								Sem entradas
							</span>
						)}
					</div>
				</div>

				{/* Seção Computador */}
				<div className="sorteador-history-section flex min-h-0 flex-1 flex-col bg-gray-50/50 p-3 sm:p-4">
					<div className="mb-2 flex shrink-0 items-center justify-between gap-2">
						<span className="text-sm font-semibold uppercase tracking-wide text-gray-700">
							Computador
						</span>
						<span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-600">
							{computerHistory.length}{" "}
							{modo === "vinculado" ? "Pessoas" : "IDs"}
						</span>
					</div>
					<div className="sorteador-history-list flex min-h-0 min-w-0 flex-1 flex-wrap content-start gap-1.5 overflow-x-hidden overflow-y-auto pr-1">
						{computerHistory.map((num, i) => {
							const isLast = i === 0 && deviceType === "Computador";

							// Renderização Condicional: Modo Vinculado vs Simples
							if (modo === "vinculado") {
								const nome = getNomeCandidato(num, "Computador");
								return (
									<div
										key={num}
										className={`flex min-w-0 w-full items-center gap-2 rounded-xl border px-2 py-1.5 transition-all ${isLast ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100 shadow-sm"}`}
									>
										<div
											className={`w-8 h-7 flex items-center justify-center rounded-lg font-bold text-xs flex-shrink-0 ${isLast ? "bg-amber-500 text-white" : "bg-gray-100 border border-gray-200 text-black"}`}
										>
											{num}
										</div>
										{nome ? (
											<span
												className={`min-w-0 truncate text-sm font-semibold ${isLast ? "text-amber-800" : "text-gray-700"}`}
											>
												{nome}
											</span>
										) : (
											<span className="text-sm font-medium italic text-gray-400">
												Ficha sem registro
											</span>
										)}
									</div>
								);
							}

							// Original Mode (Apenas quadrados)
							return (
								<div
									key={num}
									className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-all ${
										isLast
											? "bg-amber-500 text-white scale-110 shadow-md"
											: "bg-sky-600 text-white"
									}`}
								>
									{num}
								</div>
							);
						})}
						{computerHistory.length === 0 && (
							<span className="mx-auto py-4 text-sm font-medium text-gray-400">
								Sem entradas
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
