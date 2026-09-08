import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { folhasControle, type TurmaControle } from "./controle-turma";

function textoSeguro(texto: string, font: PDFFont) {
	return Array.from(texto.replace(/\s+/g, " "))
		.map((c) => {
			try {
				font.encodeText(c);
				return c;
			} catch {
				return "?";
			}
		})
		.join("");
}

function linhas(texto: string, font: PDFFont, size: number, width: number) {
	const result: string[] = [];
	let line = "";
	const safe = textoSeguro(texto, font);
	for (const word of safe.split(" ")) {
		const next = line ? `${line} ${word}` : word;
		if (font.widthOfTextAtSize(next, size) <= width) {
			line = next;
			continue;
		}
		if (line) result.push(line);
		line = "";
		for (const char of word) {
			if (font.widthOfTextAtSize(line + char, size) > width) {
				result.push(line);
				line = "";
			}
			line += char;
		}
	}
	if (line) result.push(line);
	return result.length ? result : ["—"];
}

function linhaUnica(texto: string, font: PDFFont, size: number, width: number) {
	const safe = textoSeguro(texto, font);
	if (font.widthOfTextAtSize(safe, size) <= width) return safe;
	let resultado = "";
	for (const caractere of Array.from(safe)) {
		if (font.widthOfTextAtSize(`${resultado}${caractere}...`, size) > width)
			return `${resultado.trimEnd()}...`;
		resultado += caractere;
	}
	return resultado;
}

function cor(hex: string) {
	const value = /^#[\da-f]{6}$/i.test(hex) ? hex.slice(1) : "1a73e8";
	return rgb(
		Number.parseInt(value.slice(0, 2), 16) / 255,
		Number.parseInt(value.slice(2, 4), 16) / 255,
		Number.parseInt(value.slice(4, 6), 16) / 255,
	);
}

export async function gerarControleTurmaPdf(turmas: TurmaControle[]) {
	const doc = await PDFDocument.create();
	const font = await doc.embedFont(StandardFonts.Helvetica);
	const bold = await doc.embedFont(StandardFonts.HelveticaBold);
	const logoResponse = await fetch("/logo_semFundo.png");
	const logo = logoResponse.ok
		? await doc.embedPng(await logoResponse.arrayBuffer())
		: null;
	const folhas = folhasControle(turmas);
	const width = 841.89,
		height = 595.28,
		margin = 24,
		gap = 18;
	const colWidth = (width - margin * 2 - gap) / 2;
	for (const [indice, partes] of folhas.entries()) {
		const page = doc.addPage([width, height]);
		if (logo) {
			const logoHeight = 100;
			const logoWidth = (logo.width / logo.height) * logoHeight;
			page.drawImage(logo, {
				x: (width - logoWidth) / 2,
				y: height - logoHeight - 10,
				width: logoWidth,
				height: logoHeight,
			});
		}
		page.drawText(`Folha ${indice + 1} de ${folhas.length}`, {
			x: width - 105,
			y: 15,
			size: 8,
			font,
		});
		for (const [col, parte] of partes.entries()) {
			const { turma, alunos, inicio } = parte;
			const x = margin + col * (colWidth + gap),
				top = height - 120;
			const title = linhaUnica(turma.titulo, bold, 13, colWidth - 76);
			const detalhes = linhaUnica(
				`Sala: ${turma.sala || "Não definida"} / Horário: ${turma.horario || "Não definido"}`,
				font,
				7.5,
				colWidth - 28,
			);
			const professores = linhaUnica(
				`Professores: ${turma.professores.map(({ user }) => user.nome).join(", ") || "Não definidos"}`,
				font,
				7.5,
				colWidth - 28,
			);
			const resumo = linhaUnica(
				`${turma.alunos.length} alunos / Limite: ${turma.limiteAlunos}${turma.alunos.length > turma.limiteAlunos ? " / Acima do limite" : ""}${parte.partes > 1 ? ` / Continuação ${parte.parte}/${parte.partes}` : ""}`,
				font,
				7.5,
				colWidth - 78,
			);
			const titleHeight = 78;
			page.drawRectangle({
				x,
				y: top - titleHeight,
				width: colWidth,
				height: titleHeight,
				color: cor(turma.cor),
			});
			page.drawRectangle({
				x: x + colWidth - 6,
				y: top - titleHeight,
				width: 6,
				height: titleHeight,
				color: cor(turma.corDestaque),
			});
			page.drawCircle({
				x: x + colWidth - 44,
				y: top - 35,
				size: 20,
				borderColor: cor(turma.corFundo),
				borderOpacity: 0.5,
				borderWidth: 5,
			});
			page.drawCircle({
				x: x + colWidth - 34,
				y: top - 45,
				size: 26,
				color: cor(turma.corDestaque),
			});
			page.drawText(title, {
				x: x + 14,
				y: top - 20,
				font: bold,
				size: 13,
				color: rgb(1, 1, 1),
			});
			page.drawText(detalhes, {
				x: x + 14,
				y: top - 34,
				font,
				size: 7.5,
				color: rgb(1, 1, 1),
			});
			page.drawText(professores, {
				x: x + 14,
				y: top - 46,
				font,
				size: 7.5,
				color: rgb(1, 1, 1),
			});
			page.drawCircle({
				x: x + 17,
				y: top - 61,
				size: 3,
				color: cor(turma.corDestaque),
			});
			page.drawText(resumo, {
				x: x + 25,
				y: top - 64,
				font: bold,
				size: 7.5,
				color: rgb(1, 1, 1),
			});
			let y = top - titleHeight - 14;
			const widths = [28, 156, 82, colWidth - 266];
			const labels = ["Nº", "Aluno", "Telefone", "Emergência"];
			let dx = x;
			labels.forEach((label, n) => {
				page.drawText(label, { x: dx + 4, y, size: 8, font: bold });
				dx += widths[n] ?? 0;
			});
			y -= 8;
			if (!alunos.length) {
				page.drawText(
					inicio
						? "Lista concluída na folha anterior."
						: "Nenhum aluno registrado.",
					{ x: x + 8, y: y - 20, font, size: 9 },
				);
				continue;
			}
			const rowHeight = Math.min(24, (y - 35) / alunos.length);
			for (const [n, aluno] of alunos.entries()) {
				const cells = [
					String(inicio + n + 1),
					aluno.nome,
					aluno.telefone || "—",
					aluno.contatoEmergencia || "—",
				];
				page.drawRectangle({
					x,
					y: y - rowHeight,
					width: colWidth,
					height: rowHeight,
					color: n % 2 ? rgb(1, 1, 1) : rgb(0.95, 0.96, 0.97),
				});
				dx = x;
				cells.forEach((cell, j) => {
					let size = j === 1 ? 10 : 8;
					const cellFont = j === 1 ? bold : font;
					const cellWidth = widths[j] ?? 0;
					const wrap = () =>
						cell
							.split("\n")
							.flatMap((s) => linhas(s, font, size, cellWidth - 8));
					while (wrap().length * (size + 1) > rowHeight - 4 && size > 3)
						size -= 0.25;
					wrap().forEach((line, k) => {
						page.drawText(line, {
							x: dx + 4,
							y: y - size - 2 - k * (size + 1),
							font: cellFont,
							size,
						});
					});
					dx += cellWidth;
				});
				y -= rowHeight;
			}
		}
	}
	return doc.save();
}
