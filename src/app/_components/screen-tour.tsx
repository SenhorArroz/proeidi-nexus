"use client";

import { ChevronLeft, ChevronRight, CircleHelp, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import { guiaParaRota, type TourRole, type TourStep } from "./tour-content";

type EstadoAtivo = { chave: string; indice: number };
type Retangulo = { top: number; left: number; width: number; height: number };

function normalizar(texto: string) {
	return texto
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/\s+/g, " ")
		.trim()
		.toLowerCase();
}

function visivel(elemento: HTMLElement) {
	const rect = elemento.getBoundingClientRect();
	const estilo = window.getComputedStyle(elemento);
	return (
		rect.width > 0 &&
		rect.height > 0 &&
		estilo.visibility !== "hidden" &&
		estilo.display !== "none"
	);
}

function encontrarAlvo(passo: TourStep): HTMLElement | null {
	if (!passo.alvo) return null;
	const conteudo =
		document.querySelector<HTMLElement>(".nexus-main") ?? document.body;
	if (passo.alvo.seletor) {
		const elemento = (
			passo.alvo.seletor === ".nexus-sidebar" ? document : conteudo
		).querySelector<HTMLElement>(passo.alvo.seletor);
		if (elemento && visivel(elemento)) return elemento;
	}
	if (!passo.alvo.rotulos?.length) return null;
	const candidatos = Array.from(
		conteudo.querySelectorAll<HTMLElement>("button, a, [role='button']"),
	);
	for (const rotulo of passo.alvo.rotulos) {
		const esperado = normalizar(rotulo);
		const alvo = candidatos.find((elemento) => {
			if (!visivel(elemento)) return false;
			const nome = normalizar(
				elemento.getAttribute("aria-label") ??
					elemento.getAttribute("title") ??
					elemento.textContent ??
					"",
			);
			return nome.includes(esperado);
		});
		if (alvo) return alvo;
	}
	return null;
}

export function ScreenTour() {
	const pathname = usePathname();
	const deveConsultar = !["/nexus/login", "/nexus/redefinir-senha"].includes(
		pathname,
	);
	const estado = api.tour.estado.useQuery(undefined, {
		enabled: deveConsultar,
		retry: false,
	});
	const utils = api.useUtils();
	const [ativo, setAtivo] = useState<EstadoAtivo | null>(null);
	const [concluidosLocais, setConcluidosLocais] = useState<string[]>([]);
	const [erro, setErro] = useState("");
	const [retangulo, setRetangulo] = useState<Retangulo | null>(null);
	const [largura, setLargura] = useState(0);
	const dialogRef = useRef<HTMLDivElement>(null);
	const role = estado.data?.role as TourRole | null | undefined;
	const guia = useMemo(
		() => (role ? guiaParaRota(pathname, role) : null),
		[pathname, role],
	);
	const chave = guia?.chave;
	const passo =
		guia && ativo?.chave === guia.chave ? guia.passos[ativo.indice] : undefined;

	const concluir = api.tour.concluir.useMutation({
		onSuccess: async (_resultado, variaveis) => {
			setConcluidosLocais((atual) => [...new Set([...atual, variaveis.tela])]);
			setAtivo(null);
			setErro("");
			await utils.tour.estado.invalidate();
		},
		onError: () =>
			setErro("Não foi possível salvar sua escolha. Tente novamente."),
	});

	useEffect(() => {
		if (!chave || !estado.data || estado.data.senhaPendente) {
			setAtivo(null);
			return;
		}
		if (ativo?.chave === chave) return;
		if (
			estado.data.concluidos.includes(chave) ||
			concluidosLocais.includes(chave)
		) {
			setAtivo(null);
			return;
		}
		setAtivo({ chave, indice: 0 });
		setErro("");
	}, [ativo?.chave, chave, concluidosLocais, estado.data]);

	const atualizarAlvo = useCallback((passoAtual: TourStep) => {
		setLargura(window.innerWidth);
		const elemento = encontrarAlvo(passoAtual);
		if (!elemento) {
			setRetangulo(null);
			return false;
		}
		const rect = elemento.getBoundingClientRect();
		setRetangulo({
			top: Math.max(4, rect.top - 5),
			left: Math.max(4, rect.left - 5),
			width: Math.min(
				window.innerWidth - Math.max(4, rect.left - 5) - 4,
				rect.width + 10,
			),
			height: rect.height + 10,
		});
		return true;
	}, []);

	useEffect(() => {
		if (!passo) return;
		let frame = 0;
		let alvo = encontrarAlvo(passo);
		alvo?.scrollIntoView({ block: "center", behavior: "smooth" });
		const atualizar = () => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(() => {
				atualizarAlvo(passo);
			});
		};
		atualizar();
		const observer = new MutationObserver(() => {
			if (!alvo?.isConnected) {
				alvo = encontrarAlvo(passo);
				if (alvo) alvo.scrollIntoView({ block: "center", behavior: "smooth" });
			}
			atualizar();
		});
		const conteudo = document.querySelector(".nexus-main");
		if (conteudo)
			observer.observe(conteudo, { childList: true, subtree: true });
		window.addEventListener("resize", atualizar);
		window.addEventListener("scroll", atualizar, true);
		dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
		return () => {
			observer.disconnect();
			window.cancelAnimationFrame(frame);
			window.removeEventListener("resize", atualizar);
			window.removeEventListener("scroll", atualizar, true);
		};
	}, [passo, atualizarAlvo]);

	useEffect(() => {
		if (!passo) return;
		function teclado(event: KeyboardEvent) {
			if (event.key === "Escape" && chave && !concluir.isPending) {
				event.preventDefault();
				concluir.mutate({ tela: chave });
			}
			if (event.key !== "Tab" || !dialogRef.current) return;
			const botoes = Array.from(
				dialogRef.current.querySelectorAll<HTMLButtonElement>(
					"button:not(:disabled)",
				),
			);
			const primeiro = botoes[0];
			const ultimo = botoes[botoes.length - 1];
			if (!primeiro || !ultimo) return;
			if (event.shiftKey && document.activeElement === primeiro) {
				event.preventDefault();
				ultimo.focus();
			} else if (!event.shiftKey && document.activeElement === ultimo) {
				event.preventDefault();
				primeiro.focus();
			}
		}
		document.addEventListener("keydown", teclado);
		return () => document.removeEventListener("keydown", teclado);
	}, [chave, concluir, passo]);

	if (
		!deveConsultar ||
		!guia ||
		!estado.data ||
		estado.data.senhaPendente ||
		typeof document === "undefined"
	)
		return null;

	const indice = ativo?.chave === guia.chave ? ativo.indice : -1;
	const passoAtual = indice >= 0 ? guia.passos[indice] : undefined;
	const pequeno = largura > 0 && largura < 640;
	const larguraPainel = 360;
	let painel: React.CSSProperties = {
		right: 16,
		bottom: 16,
		width: `min(${larguraPainel}px, calc(100vw - 2rem))`,
	};
	if (retangulo && !pequeno) {
		const abaixo = retangulo.top + retangulo.height + 14;
		const topo =
			abaixo + 300 < window.innerHeight
				? abaixo
				: Math.max(16, retangulo.top - 310);
		painel = {
			top: topo,
			left: Math.max(
				16,
				Math.min(retangulo.left, window.innerWidth - larguraPainel - 16),
			),
			width: larguraPainel,
		};
	}

	return createPortal(
		<div data-tour-ui>
			{!passoAtual && (
				<button
					type="button"
					onClick={() => {
						setAtivo({ chave: guia.chave, indice: 0 });
						setErro("");
					}}
					className="fixed bottom-[max(5rem,env(safe-area-inset-bottom))] right-4 z-[60] inline-flex min-h-11 items-center gap-2 rounded-full bg-sky-700 px-4 text-sm font-bold text-white shadow-[0_12px_28px_rgba(2,132,199,.28)] hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
					aria-label={`Ver tour da tela ${guia.titulo}`}
				>
					<CircleHelp className="h-4 w-4" />
					Ajuda desta tela
				</button>
			)}
			{passoAtual && (
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
						aria-modal="true"
						aria-labelledby="tour-titulo"
						aria-describedby="tour-descricao"
						className="fixed z-[72] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-2xl bg-white p-5 text-slate-900 shadow-[0_24px_60px_rgba(2,6,23,.32)] dark:bg-slate-900 dark:text-slate-100"
						style={painel}
					>
						<div className="flex items-start justify-between gap-3">
							<p className="text-xs font-extrabold text-sky-700 dark:text-sky-300">
								{guia.titulo} · {indice + 1} de {guia.passos.length}
							</p>
							<button
								type="button"
								onClick={() => concluir.mutate({ tela: guia.chave })}
								disabled={concluir.isPending}
								className="-mr-1 -mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-slate-300 dark:hover:bg-slate-800"
								aria-label="Pular tour"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
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
						<div className="mt-5 h-1.5 overflow-hidden rounded-full bg-sky-100 dark:bg-slate-700">
							<div
								className="h-full rounded-full bg-orange-500 transition-[width] duration-200"
								style={{
									width: `${((indice + 1) / guia.passos.length) * 100}%`,
								}}
							/>
						</div>
						{erro && (
							<p
								role="alert"
								className="mt-3 text-sm font-semibold text-red-700 dark:text-red-300"
							>
								{erro}
							</p>
						)}
						<div className="mt-5 flex flex-wrap items-center justify-between gap-2">
							<button
								type="button"
								onClick={() => concluir.mutate({ tela: guia.chave })}
								disabled={concluir.isPending}
								className="min-h-11 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-slate-200 dark:hover:bg-slate-800"
							>
								Pular tour
							</button>
							<div className="flex gap-2">
								{indice > 0 && (
									<button
										type="button"
										onClick={() => {
											setAtivo({ chave: guia.chave, indice: indice - 1 });
											setErro("");
										}}
										className="inline-flex min-h-11 items-center gap-1 rounded-xl px-3 text-sm font-bold text-sky-800 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600 dark:text-sky-200 dark:hover:bg-slate-800"
									>
										<ChevronLeft className="h-4 w-4" />
										Voltar
									</button>
								)}
								<button
									type="button"
									disabled={concluir.isPending}
									onClick={() => {
										setErro("");
										if (indice === guia.passos.length - 1)
											concluir.mutate({ tela: guia.chave });
										else setAtivo({ chave: guia.chave, indice: indice + 1 });
									}}
									className="inline-flex min-h-11 items-center gap-1 rounded-xl bg-sky-700 px-4 text-sm font-bold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-sky-400 disabled:opacity-50"
								>
									{indice === guia.passos.length - 1
										? concluir.isPending
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
			)}
		</div>,
		document.body,
	);
}
