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
	const detalhes = elemento.closest("details:not([open])");
	if (
		detalhes &&
		!detalhes.querySelector(":scope > summary")?.contains(elemento)
	)
		return false;
	const rect = elemento.getBoundingClientRect();
	const estilo = window.getComputedStyle(elemento);
	return (
		rect.width > 0 &&
		rect.height > 0 &&
		estilo.visibility !== "hidden" &&
		estilo.display !== "none"
	);
}

function encontrarVisivel(raiz: ParentNode, seletor: string) {
	return Array.from(raiz.querySelectorAll<HTMLElement>(seletor)).find(visivel);
}

function encontrarAlvo(passo: TourStep): HTMLElement | null {
	if (!passo.alvo) return null;
	const conteudo =
		document.querySelector<HTMLElement>(".nexus-main") ?? document.body;
	if (passo.alvo.seletor) {
		const elemento = encontrarVisivel(conteudo, passo.alvo.seletor);
		if (elemento) return elemento;
		if (passo.alvo.seletor === ".nexus-sidebar")
			return encontrarVisivel(document, passo.alvo.seletor) ?? null;
	}
	if (!passo.alvo.rotulos?.length)
		return passo.alvo.alternativa
			? (encontrarVisivel(conteudo, passo.alvo.alternativa) ?? null)
			: null;
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
	const [podeMostrar, setPodeMostrar] = useState(false);
	const [alvoAusente, setAlvoAusente] = useState(false);
	const [alturaPainel, setAlturaPainel] = useState(0);
	const dialogRef = useRef<HTMLDivElement>(null);
	const textoRef = useRef<HTMLDivElement>(null);
	const fecharPreviaRef = useRef<{ pathname: string; seletor: string } | null>(
		null,
	);
	const ajudaRef = useRef<HTMLButtonElement>(null);
	const restaurarFocoRef = useRef(false);
	const role = estado.data?.role as TourRole | null | undefined;
	const guia = useMemo(
		() => (role ? guiaParaRota(pathname, role) : null),
		[pathname, role],
	);
	const chave = guia?.chave;
	const passo =
		guia && ativo?.chave === guia.chave ? guia.passos[ativo.indice] : undefined;
	const fecharPrevia = (proximo?: TourStep) => {
		const previa = fecharPreviaRef.current;
		if (!previa || previa.seletor === proximo?.previa?.fechar) return;
		fecharPreviaRef.current = null;
		if (previa.pathname === pathname) {
			encontrarVisivel(
				document.querySelector(".nexus-main") ?? document.body,
				previa.seletor,
			)?.click();
		}
	};

	const concluir = api.tour.concluir.useMutation({
		onSuccess: async (_resultado, variaveis) => {
			fecharPrevia();
			restaurarFocoRef.current = true;
			setConcluidosLocais((atual) => [...new Set([...atual, variaveis.tela])]);
			setAtivo((atual) => (atual?.chave === variaveis.tela ? null : atual));
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
		const elemento = encontrarAlvo(passoAtual);
		const conteudo = document.querySelector(".nexus-main") ?? document.body;
		const { previa, alvo } = passoAtual;
		const principal = alvo?.seletor && encontrarVisivel(conteudo, alvo.seletor);
		const abrir = previa && encontrarVisivel(conteudo, previa.abrir);
		const aberto = previa?.aberto && encontrarVisivel(conteudo, previa.aberto);
		setPodeMostrar(
			Boolean(abrir && !abrir.matches(":disabled") && !principal && !aberto),
		);
		setAlvoAusente(
			Boolean(alvo && !principal && (!elemento || elemento === abrir)),
		);
		if (!elemento) {
			setRetangulo(null);
			return false;
		}
		const rect = elemento.getBoundingClientRect();
		const top = Math.max(4, rect.top - 5);
		const left = Math.max(4, rect.left - 5);
		const right = Math.min(window.innerWidth - 4, rect.right + 5);
		const bottom = Math.min(window.innerHeight - 4, rect.bottom + 5);
		if (right <= left || bottom <= top) {
			setRetangulo(null);
			return false;
		}
		setRetangulo({
			top,
			left,
			width: right - left,
			height: bottom - top,
		});
		return true;
	}, []);

	useEffect(() => {
		if (!passo) return;
		let frame = 0;
		let alvo = encontrarAlvo(passo);
		const centralizar = (elemento: HTMLElement | null) =>
			elemento?.scrollIntoView({ block: "center", inline: "nearest" });
		centralizar(alvo);
		const atualizar = () => {
			window.cancelAnimationFrame(frame);
			frame = window.requestAnimationFrame(() => {
				const atual = encontrarAlvo(passo);
				if (atual !== alvo) {
					alvo = atual;
					centralizar(alvo);
				}
				atualizarAlvo(passo);
			});
		};
		atualizar();
		const observer = new MutationObserver(atualizar);
		const conteudo = document.querySelector(".nexus-main");
		if (conteudo)
			observer.observe(conteudo, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [
					"disabled",
					"hidden",
					"open",
					"aria-current",
					"aria-pressed",
				],
			});
		window.addEventListener("resize", atualizar);
		window.addEventListener("scroll", atualizar, true);
		const dialog = dialogRef.current;
		dialog?.focus({ preventScroll: true });
		textoRef.current?.scrollTo({ top: 0 });
		const tamanho = new ResizeObserver(() =>
			setAlturaPainel(dialog?.offsetHeight ?? 0),
		);
		if (dialog) tamanho.observe(dialog);
		return () => {
			observer.disconnect();
			tamanho.disconnect();
			window.cancelAnimationFrame(frame);
			window.removeEventListener("resize", atualizar);
			window.removeEventListener("scroll", atualizar, true);
		};
	}, [passo, atualizarAlvo]);

	useEffect(() => {
		if (!passo && restaurarFocoRef.current) {
			restaurarFocoRef.current = false;
			ajudaRef.current?.focus({ preventScroll: true });
		}
	}, [passo]);

	useEffect(() => {
		if (!passo) return;
		function teclado(event: KeyboardEvent) {
			if (event.key === "Escape" && chave && !concluir.isPending) {
				event.preventDefault();
				event.stopImmediatePropagation();
				concluir.mutate({ tela: chave });
			}
			if (event.key !== "Tab" || !dialogRef.current) return;
			const controles = Array.from(
				dialogRef.current.querySelectorAll<HTMLElement>(
					"button:not(:disabled), select:not(:disabled)",
				),
			);
			const primeiro = controles[0];
			const ultimo = controles.at(-1);
			if (!primeiro || !ultimo) return;
			if (
				event.shiftKey &&
				(document.activeElement === primeiro ||
					document.activeElement === dialogRef.current)
			) {
				event.preventDefault();
				ultimo.focus();
			} else if (!event.shiftKey && document.activeElement === ultimo) {
				event.preventDefault();
				primeiro.focus();
			}
		}
		function manterFoco(event: FocusEvent) {
			const dialog = dialogRef.current;
			if (
				dialog &&
				event.target instanceof Node &&
				!dialog.contains(event.target)
			)
				dialog.focus({ preventScroll: true });
		}
		document.addEventListener("keydown", teclado, true);
		document.addEventListener("focusin", manterFoco);
		return () => {
			document.removeEventListener("keydown", teclado, true);
			document.removeEventListener("focusin", manterFoco);
		};
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
	const pequeno = window.innerWidth < 640;
	const larguraPainel = 360;
	const painel: React.CSSProperties = {
		right: 16,
		bottom: 16,
		width: `min(${larguraPainel}px, calc(100vw - 2rem))`,
	};
	if (retangulo) {
		const direita = retangulo.left + retangulo.width + 14;
		const esquerda = retangulo.left - larguraPainel - 14;
		const cabeADireita = direita + larguraPainel <= window.innerWidth - 16;
		if (!pequeno && (cabeADireita || esquerda >= 16)) {
			delete painel.bottom;
			delete painel.right;
			painel.left = cabeADireita ? direita : esquerda;
			painel.top = Math.max(
				16,
				Math.min(retangulo.top, window.innerHeight - alturaPainel - 16),
			);
		} else {
			const abaixo = retangulo.top + retangulo.height + 14;
			const espacoAbaixo = window.innerHeight - abaixo - 16;
			const espacoAcima = retangulo.top - 14 - 16;
			const maiorEspaco = Math.max(espacoAbaixo, espacoAcima);
			if (maiorEspaco >= 200) {
				painel.maxHeight = maiorEspaco;
				if (espacoAbaixo >= espacoAcima) {
					delete painel.bottom;
					painel.top = abaixo;
				} else {
					painel.bottom = window.innerHeight - retangulo.top + 14;
				}
			}
		}
	}
	const irPara = (destino: number) => {
		fecharPrevia(guia.passos[destino]);
		setAtivo({ chave: guia.chave, indice: destino });
		setErro("");
	};

	return createPortal(
		<div data-tour-ui>
			{!passoAtual && (
				<button
					ref={ajudaRef}
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
								onClick={() => concluir.mutate({ tela: guia.chave })}
								disabled={concluir.isPending}
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
									onClick={() => {
										const previa = passoAtual.previa;
										if (!previa) return;
										const abrir = encontrarVisivel(
											document.querySelector(".nexus-main") ?? document.body,
											previa.abrir,
										);
										if (!abrir || abrir.matches(":disabled")) return;
										if (previa.fechar)
											fecharPreviaRef.current = {
												pathname,
												seletor: previa.fechar,
											};
										abrir.click();
										dialogRef.current?.focus({ preventScroll: true });
									}}
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
										onClick={() => irPara(indice - 1)}
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
										else irPara(indice + 1);
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
