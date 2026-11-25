import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { CSSProperties, Ref } from "react";
import type { Retangulo } from "./alvo-tour";
import type { TourGuide, TourStep } from "./guias";

export function PainelTour({
	guia,
	passoAtual,
	indice,
	retangulo,
	painel,
	dialogRef,
	textoRef,
	podeMostrar,
	alvoAusente,
	erro,
	salvando,
	irPara,
	mostrarPrevia,
	avancar,
	pular,
}: {
	guia: TourGuide;
	passoAtual: TourStep;
	indice: number;
	retangulo: Retangulo | null;
	painel: CSSProperties;
	dialogRef: Ref<HTMLDivElement>;
	textoRef: Ref<HTMLDivElement>;
	podeMostrar: boolean;
	alvoAusente: boolean;
	erro: string;
	salvando: boolean;
	irPara: (destino: number) => void;
	mostrarPrevia: () => void;
	avancar: () => void;
	pular: () => void;
}) {
	return (
		<>
			<div
				className={`fixed inset-0 z-[70] ${retangulo ? "" : "bg-slate-950/65"}`}
				aria-hidden="true"
			/>
			{retangulo && (
				<div
					className="pointer-events-none fixed z-[71] rounded-xl outline outline-[3px] outline-orange-400"
					style={{
						top: retangulo.top,
						left: retangulo.left,
						width: retangulo.width,
						height: retangulo.height,
						boxShadow: "0 0 0 100vmax rgba(2, 6, 23, 0.68)",
					}}
					aria-hidden="true"
				/>
			)}
			<div
				ref={dialogRef}
				role="dialog"
				tabIndex={-1}
				aria-modal="true"
				aria-labelledby="tour-titulo"
				aria-describedby="tour-descricao"
				className="fixed z-[72] flex max-h-[calc(100dvh-2rem)] flex-col rounded-2xl bg-white p-4 text-slate-900 shadow-[0_24px_60px_rgba(2,6,23,.32)] sm:p-5 dark:bg-slate-900 dark:text-slate-100"
				style={painel}
			>
				<div className="flex shrink-0 items-start justify-between gap-3">
					<p className="text-xs font-extrabold text-sky-700 dark:text-sky-300">
						{guia.titulo} · {indice + 1} de {guia.passos.length}
					</p>
					<button
						type="button"
						onClick={pular}
						disabled={salvando}
						className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-slate-300 dark:hover:bg-slate-800"
						aria-label="Pular tour"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<div
					ref={textoRef}
					className="min-h-0 overflow-y-auto overscroll-contain"
				>
					<h2
						id="tour-titulo"
						className="mt-2 text-xl font-extrabold tracking-[-.02em]"
					>
						{passoAtual.titulo}
					</h2>
					<p
						id="tour-descricao"
						className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200"
					>
						{passoAtual.descricao}
					</p>
					{podeMostrar && passoAtual.previa && (
						<button
							type="button"
							className="mt-3 min-h-11 rounded-lg border border-[var(--nexus-line)] px-3 text-sm font-semibold text-sky-800 hover:bg-sky-50 dark:text-sky-200 dark:hover:bg-slate-800"
							onClick={mostrarPrevia}
						>
							Mostrar na tela
						</button>
					)}
					{alvoAusente && !podeMostrar && (
						<p className="mt-2 text-xs text-[var(--nexus-muted)]">
							O controle aparece quando os dados ou a seção correspondente
							estiverem disponíveis.
						</p>
					)}
					<div className="mt-5 hidden h-1.5 overflow-hidden rounded-full bg-sky-100 sm:block dark:bg-slate-700">
						<div
							className="h-full rounded-full bg-orange-500 transition-[width] duration-200"
							style={{
								width: `${((indice + 1) / guia.passos.length) * 100}%`,
							}}
						/>
					</div>
					{guia.passos.length > 7 && (
						<label className="mt-3 block text-xs font-semibold">
							Ir para uma etapa
							<select
								value={indice}
								onChange={(event) => irPara(Number(event.target.value))}
								className="mt-1 block min-h-10 w-full rounded-lg border border-[var(--nexus-line)] bg-[var(--nexus-surface)] px-2 text-sm text-[var(--nexus-ink)]"
							>
								{guia.passos.map((etapa, numero) => (
									<option key={etapa.titulo} value={numero}>
										{numero + 1}. {etapa.titulo}
									</option>
								))}
							</select>
						</label>
					)}
					{erro && (
						<p
							role="alert"
							className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300"
						>
							{erro}
						</p>
					)}
				</div>
				<div className="mt-3 flex shrink-0 flex-wrap items-center justify-between gap-2 sm:mt-5">
					<button
						type="button"
						onClick={pular}
						disabled={salvando}
						className="min-h-11 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-slate-200 dark:hover:bg-slate-800"
					>
						Pular tour
					</button>
					<div className="flex gap-2">
						{indice > 0 && (
							<button
								type="button"
								onClick={() => irPara(indice - 1)}
								className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-bold text-sky-800 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-sky-200 dark:hover:bg-slate-800"
							>
								<ChevronLeft className="h-4 w-4" />
								Voltar
							</button>
						)}
						<button
							type="button"
							disabled={salvando}
							onClick={avancar}
							className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-sky-700 px-4 text-sm font-bold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:opacity-50"
						>
							{indice === guia.passos.length - 1
								? salvando
									? "Salvando..."
									: "Concluir"
								: "Próximo"}
							{indice < guia.passos.length - 1 && (
								<ChevronRight className="h-4 w-4" />
							)}
						</button>
					</div>
				</div>
			</div>
		</>
	);
}
