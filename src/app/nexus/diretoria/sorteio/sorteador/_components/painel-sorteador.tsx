"use client";
import {
	ChevronDown,
	Download,
	Hash,
	Loader2,
	Monitor,
	SlidersHorizontal,
	Smartphone,
	Trash2,
	UserCircle2,
	Users,
} from "lucide-react";
import { exportarResultados, LIMITE_DE_EXCLUSOES } from "./suporte";
import { useSorteadorOrganico } from "./use-sorteador-organico";

type Estado = ReturnType<typeof useSorteadorOrganico>;
type PainelSorteadorProps = {
	semestreSelecionado: Estado["semestreSelecionado"];
	setSemestreId: NonNullable<Estado["setSemestreId"]>;
	semestres: Estado["semestres"];
	setModo: NonNullable<Estado["setModo"]>;
	modo: NonNullable<Estado["modo"]>;
	setDeviceType: NonNullable<Estado["setDeviceType"]>;
	deviceType: NonNullable<Estado["deviceType"]>;
	candidatosDoModulo: NonNullable<Estado["candidatosDoModulo"]>;
	min: NonNullable<Estado["min"]>;
	setMin: NonNullable<Estado["setMin"]>;
	max: NonNullable<Estado["max"]>;
	setMax: NonNullable<Estado["setMax"]>;
	setExclusoesAbertas: NonNullable<Estado["setExclusoesAbertas"]>;
	exclusoesAbertas: NonNullable<Estado["exclusoesAbertas"]>;
	numerosExcluidos: NonNullable<Estado["numerosExcluidos"]>;
	exclusoes: NonNullable<Estado["exclusoes"]>;
	setNumerosExcluidos: NonNullable<Estado["setNumerosExcluidos"]>;
	isAnimating: NonNullable<Estado["isAnimating"]>;
	results: NonNullable<Estado["results"]>;
	ganhadorAtual: Estado["ganhadorAtual"];
	sortear: NonNullable<Estado["sortear"]>;
	smartphoneHistory: NonNullable<Estado["smartphoneHistory"]>;
	computerHistory: NonNullable<Estado["computerHistory"]>;
	candidatos: NonNullable<Estado["candidatos"]>;
	resetar: NonNullable<Estado["resetar"]>;
};

export function PainelSorteador({
	semestreSelecionado,
	setSemestreId,
	semestres,
	setModo,
	modo,
	setDeviceType,
	deviceType,
	candidatosDoModulo,
	min,
	setMin,
	max,
	setMax,
	setExclusoesAbertas,
	exclusoesAbertas,
	numerosExcluidos,
	exclusoes,
	setNumerosExcluidos,
	isAnimating,
	results,
	ganhadorAtual,
	sortear,
	smartphoneHistory,
	computerHistory,
	candidatos,
	resetar,
}: PainelSorteadorProps) {
	return (
		<div className="view-diretoria-sorteio-sorteador-painel-sorteador sorteador-card sorteador-action-card flex min-w-0 max-w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.07)]">
			{/* Cabeçalho do card */}
			<div className="sorteador-card-header relative shrink-0 overflow-hidden bg-sky-600 px-4 py-3 sm:px-5">
				<div className="absolute -right-6 -bottom-8 h-28 w-28 rounded-full bg-orange-500" />
				<div className="relative flex items-center gap-2.5">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
						<SlidersHorizontal className="w-[55%] h-[55%] text-white" />
					</div>
					<span className="truncate text-sm font-semibold text-white">
						Configuração do sorteio
					</span>
				</div>
			</div>

			{/* Corpo do card */}
			<div className="sorteador-action-body flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-3 p-3 sm:p-4">
				<div className="sorteador-controls grid shrink-0 gap-3">
					<div className="sorteador-control sorteador-semester min-w-0">
						<label
							htmlFor="semestre-sorteio"
							className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500"
						>
							Semestre
						</label>
						<select
							id="semestre-sorteio"
							value={semestreSelecionado?.id ?? ""}
							onChange={(e) => setSemestreId(e.target.value)}
							className="min-h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-base font-medium text-gray-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100 sm:text-sm"
						>
							{semestres?.map((semestre) => (
								<option key={semestre.id} value={semestre.id}>
									{semestre.codigo}
									{semestre.ativo ? " — ativo" : ""}
								</option>
							))}
						</select>
					</div>

					{/* Seletor de Modo (Vinculado vs Simples) */}
					<div className="sorteador-control min-w-0">
						<span className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500">
							Modo de Sorteio
						</span>
						<div className="grid min-w-0 grid-cols-2 rounded-xl bg-gray-100 p-1">
							<button
								type="button"
								onClick={() => setModo("vinculado")}
								className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
									modo === "vinculado"
										? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								<Users className="w-3.5 h-3.5 flex-shrink-0" />
								<span className="truncate">VINCULADO</span>
							</button>
							<button
								type="button"
								onClick={() => setModo("simples")}
								className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
									modo === "simples"
										? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								<Hash className="w-3.5 h-3.5 flex-shrink-0" />
								<span className="truncate">SIMPLES</span>
							</button>
						</div>
					</div>

					{/* Seletor de Módulo de Destino */}
					<div className="sorteador-control min-w-0">
						<span className="mb-2 block text-center text-xs font-medium uppercase tracking-wider text-gray-500">
							Módulo de destino
						</span>
						<div className="grid min-w-0 grid-cols-2 rounded-xl bg-gray-100 p-1">
							<button
								type="button"
								onClick={() => setDeviceType("Smartphone")}
								className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
									deviceType === "Smartphone"
										? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								<Smartphone className="w-3.5 h-3.5 flex-shrink-0" />
								<span className="truncate">SMARTPHONE</span>
							</button>
							<button
								type="button"
								onClick={() => setDeviceType("Computador")}
								className={`flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg px-1 py-2 text-xs font-semibold tracking-wide transition-all ${
									deviceType === "Computador"
										? "bg-white shadow-sm text-sky-600 ring-1 ring-gray-200"
										: "text-gray-400 hover:text-gray-600"
								}`}
							>
								<Monitor className="w-3.5 h-3.5 flex-shrink-0" />
								<span className="truncate">COMPUTADOR</span>
							</button>
						</div>
					</div>

					{modo === "vinculado" && (
						<div className="sorteador-availability rounded-xl border border-sky-100 bg-sky-50 px-3 py-2.5 text-center">
							<p className="text-xs font-semibold text-sky-800">
								{candidatosDoModulo.length} ficha(s) de {deviceType}{" "}
								disponível(is)
							</p>
							<p className="mt-1 text-xs text-sky-700">
								As fichas são carregadas do cadastro deste semestre.
							</p>
							{candidatosDoModulo.length === 0 && (
								<a
									href="/nexus/diretoria/sorteio"
									className="mt-2 inline-block text-xs font-semibold text-sky-700 underline"
								>
									Cadastrar candidatos
								</a>
							)}
						</div>
					)}

					{modo === "simples" && (
						<div className="sorteador-range grid min-w-0 grid-cols-2 gap-2 sm:gap-3">
							<div className="min-w-0">
								<label
									htmlFor="range-inicial"
									className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500"
								>
									Range inicial
								</label>
								<input
									id="range-inicial"
									type="number"
									value={min}
									onChange={(e) => setMin(Number(e.target.value) || 1)}
									className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-base font-semibold text-sky-700 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none sm:px-3 sm:text-sm"
								/>
							</div>
							<div className="min-w-0">
								<label
									htmlFor="range-final"
									className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500"
								>
									Range final
								</label>
								<input
									id="range-final"
									type="number"
									value={max}
									onChange={(e) => setMax(Number(e.target.value) || 1)}
									className="min-h-11 w-full min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-center text-base font-semibold text-sky-700 transition-colors focus:border-sky-300 focus:bg-white focus:outline-none sm:px-3 sm:text-sm"
								/>
							</div>
						</div>
					)}

					<div className="sorteador-exclusions min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-2">
						<button
							type="button"
							onClick={() => setExclusoesAbertas((abertas) => !abertas)}
							aria-expanded={exclusoesAbertas}
							aria-controls="painel-numeros-excluidos"
							className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3 rounded-lg px-1.5 text-left transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-sky-200"
						>
							<span className="min-w-0">
								<span className="block text-xs font-medium uppercase tracking-wide text-gray-500">
									Tirar números do sorteio
								</span>
								{numerosExcluidos && (
									<span
										className={`mt-0.5 block truncate text-xs font-semibold ${exclusoes.invalidos.length > 0 ? "text-red-600" : "text-sky-700"}`}
									>
										{exclusoes.invalidos.length > 0
											? "Há números para revisar"
											: `${exclusoes.numeros.size} número(s) excluído(s)`}
									</span>
								)}
							</span>
							<ChevronDown
								className={`h-5 w-5 shrink-0 text-sky-600 transition-transform duration-200 ${exclusoesAbertas ? "rotate-180" : ""}`}
								aria-hidden="true"
							/>
						</button>

						{exclusoesAbertas && (
							<div
								id="painel-numeros-excluidos"
								className="mt-2 border-t border-gray-200 px-1.5 pt-3"
							>
								<div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
									<label
										htmlFor="numeros-excluidos"
										className="min-w-0 text-xs font-medium text-gray-600"
									>
										Números e intervalos a ignorar
									</label>
									{numerosExcluidos && (
										<button
											type="button"
											onClick={() => setNumerosExcluidos("")}
											className="min-h-11 shrink-0 px-2 text-xs font-semibold text-sky-600 hover:text-sky-700"
										>
											Limpar
										</button>
									)}
								</div>
								<input
									id="numeros-excluidos"
									type="text"
									value={numerosExcluidos}
									onChange={(e) => setNumerosExcluidos(e.target.value)}
									placeholder="Ex.: 1-10, 13-14, 22"
									aria-describedby="ajuda-numeros-excluidos"
									aria-invalid={exclusoes.invalidos.length > 0}
									className={`min-h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-base font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 ${exclusoes.invalidos.length > 0 ? "border-red-300 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-sky-300 focus:ring-sky-100"}`}
								/>
								<p
									id="ajuda-numeros-excluidos"
									className={`mt-1.5 break-words text-xs leading-snug ${exclusoes.invalidos.length > 0 ? "text-red-600" : "text-gray-500"}`}
								>
									{exclusoes.invalidos.length > 0
										? `Formato inválido: ${exclusoes.invalidos.join(", ")}. Use vírgulas e intervalos de até ${LIMITE_DE_EXCLUSOES.toLocaleString("pt-BR")} números.`
										: exclusoes.numeros.size > 0
											? `${exclusoes.numeros.size} número(s) será(ão) ignorado(s). “14-13” exclui 13 e 14.`
											: "Use vírgulas e intervalos. “14-13” também exclui 13 e 14."}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Área de resultado (Modificada para exibir o nome) */}
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
					) : results.length > 0 ? (
						<div className="text-center animate-in zoom-in duration-500 w-full flex flex-col items-center justify-center">
							<div className="text-6xl font-black leading-none tracking-tighter text-sky-600 sm:text-7xl">
								{results[0]}
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

				{/* Ação principal */}
				<button
					type="button"
					onClick={sortear}
					disabled={isAnimating}
					className="min-h-11 w-full shrink-0 rounded-2xl bg-orange-600 px-4 py-3 text-sm font-extrabold tracking-wide text-white shadow-[0_12px_24px_rgba(234,88,12,.24)] transition-all hover:-translate-y-0.5 hover:bg-orange-700 disabled:opacity-50 disabled:hover:translate-y-0"
				>
					EXECUTAR SORTEIO
				</button>

				{/* Ações secundárias */}
				<div className="grid min-w-0 shrink-0 grid-cols-[minmax(0,1fr)_2.75rem] items-center gap-3">
					<button
						type="button"
						onClick={() =>
							void exportarResultados(
								smartphoneHistory,
								computerHistory,
								modo,
								candidatos,
								semestreSelecionado?.codigo ?? "semestre",
							)
						}
						className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-2 text-sm font-medium text-sky-600 transition-colors hover:border-sky-200 hover:bg-sky-50"
					>
						<Download className="w-4 h-4 flex-shrink-0" />
						<span className="truncate">Exportar Planilha</span>
					</button>
					<button
						type="button"
						onClick={resetar}
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition-colors hover:border-red-200 hover:text-red-500"
						aria-label="Resetar banco de dados"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			</div>
		</div>
	);
}
