"use client";

import { CircleHelp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { api } from "~/trpc/react";
import {
	encontrarAlvo,
	encontrarVisivel,
	posicionarPainel,
	type Retangulo,
} from "./screen-tour/alvo-tour";
import { PainelTour } from "./screen-tour/painel-tour";
import { guiaParaRota, type TourRole, type TourStep } from "./tour-content";

type EstadoAtivo = { chave: string; indice: number };
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
	const irPara = (destino: number) => {
		fecharPrevia(guia.passos[destino]);
		setAtivo({ chave: guia.chave, indice: destino });
		setErro("");
	};

	const mostrarPrevia = () => {
		const previa = passoAtual?.previa;
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
	};
	const avancar = () => {
		setErro("");
		if (indice === guia.passos.length - 1)
			concluir.mutate({ tela: guia.chave });
		else irPara(indice + 1);
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
				<PainelTour
					guia={guia}
					passoAtual={passoAtual}
					indice={indice}
					retangulo={retangulo}
					painel={posicionarPainel(retangulo, alturaPainel)}
					dialogRef={dialogRef}
					textoRef={textoRef}
					podeMostrar={podeMostrar}
					alvoAusente={alvoAusente}
					erro={erro}
					salvando={concluir.isPending}
					irPara={irPara}
					mostrarPrevia={mostrarPrevia}
					avancar={avancar}
					pular={() => concluir.mutate({ tela: guia.chave })}
				/>
			)}
		</div>,
		document.body,
	);
}
