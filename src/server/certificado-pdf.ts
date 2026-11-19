import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, type PDFFont, type PDFPage, type RGB } from "pdf-lib";

export async function carregarModeloCertificado(arquivo: string) {
	const modelo = await fs
		.readFile(path.join(process.cwd(), "public", arquivo))
		.catch(() => fs.readFile(path.join(process.cwd(), "models", arquivo)));
	return PDFDocument.load(modelo);
}

const formatoData = new Intl.DateTimeFormat("pt-BR", {
	dateStyle: "long",
	timeZone: "UTC",
});

export function periodoDasAulas(aulas: { data: Date }[]) {
	const datas = aulas.map(({ data }) => data.getTime()).sort((a, b) => a - b);
	const inicio = datas[0];
	const fim = datas.at(-1);
	if (inicio === undefined || fim === undefined) return null;
	return { inicio: formatoData.format(inicio), fim: formatoData.format(fim) };
}

export interface TextSpan {
	text: string;
	font: PDFFont;
	color: RGB;
	size?: number;
}

interface RichTextToken {
	text: string;
	font: PDFFont;
	color: RGB;
	size: number;
}

export function desenharParagrafoFormatado(
	pagina: PDFPage,
	spans: TextSpan[],
	options: {
		x: number;
		y: number;
		maxWidth: number;
		lineHeight: number;
		defaultSize?: number;
		justify?: boolean;
	},
) {
	const defaultSize = options.defaultSize ?? 16;
	const tokens: RichTextToken[] = [];

	// Separa cada span em palavras e espaços preservando estilo
	for (const span of spans) {
		if (!span.text) continue;
		const size = span.size ?? defaultSize;
		const regex = /(\s+|[^\s]+)/g;
		let match: RegExpExecArray | null;
		while (true) {
			match = regex.exec(span.text);
			if (match === null) break;
			tokens.push({
				text: match[0],
				font: span.font,
				color: span.color,
				size,
			});
		}
	}

	// Agrupa tokens em linhas respeitando o maxWidth
	const linhas: RichTextToken[][] = [];
	let linhaAtual: RichTextToken[] = [];
	let larguraAtual = 0;

	for (const token of tokens) {
		const larguraToken = token.font.widthOfTextAtSize(token.text, token.size);
		const ehEspaco = token.text.trim() === "";

		// Não adiciona espaço no início de linha vazia
		if (linhaAtual.length === 0 && ehEspaco) {
			continue;
		}

		if (
			larguraAtual + larguraToken <= options.maxWidth ||
			linhaAtual.length === 0
		) {
			linhaAtual.push(token);
			larguraAtual += larguraToken;
		} else {
			// Quebra de linha
			linhas.push(linhaAtual);
			if (!ehEspaco) {
				linhaAtual = [token];
				larguraAtual = larguraToken;
			} else {
				linhaAtual = [];
				larguraAtual = 0;
			}
		}
	}

	if (linhaAtual.length > 0) {
		linhas.push(linhaAtual);
	}

	// Desenha cada linha na página do PDF
	let yAtual = options.y;
	for (const [indiceLinha, linha] of linhas.entries()) {
		let xAtual = options.x;
		const deveJustificar = options.justify && indiceLinha < linhas.length - 1;
		const espacos = linha.filter((token) => token.text.trim() === "");
		const larguraLinha = linha.reduce(
			(total, token) =>
				total + token.font.widthOfTextAtSize(token.text, token.size),
			0,
		);
		const espacoExtra =
			deveJustificar && espacos.length > 0
				? Math.max(0, (options.maxWidth - larguraLinha) / espacos.length)
				: 0;
		for (const token of linha) {
			pagina.drawText(token.text, {
				x: xAtual,
				y: yAtual,
				size: token.size,
				font: token.font,
				color: token.color,
			});
			xAtual +=
				token.font.widthOfTextAtSize(token.text, token.size) +
				(token.text.trim() === "" ? espacoExtra : 0);
		}
		yAtual -= options.lineHeight;
	}
	return yAtual;
}
