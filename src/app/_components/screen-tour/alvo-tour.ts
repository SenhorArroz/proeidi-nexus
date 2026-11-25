import type { TourStep } from "./guias";

export type Retangulo = {
	top: number;
	left: number;
	width: number;
	height: number;
};

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

export function encontrarVisivel(raiz: ParentNode, seletor: string) {
	return Array.from(raiz.querySelectorAll<HTMLElement>(seletor)).find(visivel);
}

export function encontrarAlvo(passo: TourStep): HTMLElement | null {
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

export function posicionarPainel(
	retangulo: Retangulo | null,
	alturaPainel: number,
): React.CSSProperties {
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
	return painel;
}
