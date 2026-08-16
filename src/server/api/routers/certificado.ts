import { z } from "zod";
import {
	type PDFPage,
	PDFDocument,
	type PDFFont,
	type RGB,
	rgb,
	StandardFonts,
} from "pdf-lib";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure } from "~/server/api/routers/diretoria";
import fs from "node:fs/promises";
import path from "node:path";

async function carregarModeloCertificado(): Promise<PDFDocument> {
	let modeloBuffer: Buffer;
	try {
		modeloBuffer = await fs.readFile(
			path.join(process.cwd(), "public", "modelo-certificado.pdf"),
		);
	} catch {
		modeloBuffer = await fs.readFile(
			path.join(process.cwd(), "models", "modelo-certificado.pdf"),
		);
	}
	return PDFDocument.load(modeloBuffer);
}

function calcularCargaHoraria(
	presencas?: { estado: string }[] | number,
): string {
	if (typeof presencas === "number") {
		return `${Math.min(presencas * 1.5, 12)} horas`;
	}

	if (!presencas || presencas.length === 0) {
		return "0 horas";
	}

	// Contabiliza apenas as presenças confirmadas (PRESENTE)
	const totalPresencas = presencas.filter(
		(p) => p.estado === "PRESENTE",
	).length;

	return `${Math.min(totalPresencas * 1.5, 12)} horas`;
}

interface FormatoPeriodo {
	inicio: string;
	fim: string;
	ano: string;
}

const meses = [
	"janeiro", "fevereiro", "março", "abril", "maio", "junho",
	"julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

function periodoDasAulas(aulas: { data: Date }[]): FormatoPeriodo | null {
	if (!aulas.length) return null;
	const ordenadas = [...aulas].sort((a, b) => a.data.getTime() - b.data.getTime());
	const primeira = ordenadas[0]?.data;
	const ultima = ordenadas.at(-1)?.data;
	if (!primeira || !ultima) return null;
	const formatarData = (data: Date) => `${data.getUTCDate()} de ${meses[data.getUTCMonth()]}`;
	return { inicio: formatarData(primeira), fim: formatarData(ultima), ano: String(ultima.getUTCFullYear()) };
}

function formatarPeriodo(
	periodoStr?: string,
	dataInicio?: string,
	dataFim?: string,
	anoParam?: string,
): FormatoPeriodo {
	const defaultAno = anoParam || "2026";
	if (dataInicio && dataFim) {
		return {
			inicio: dataInicio,
			fim: dataFim,
			ano: defaultAno,
		};
	}

	if (!periodoStr) {
		return { inicio: "10 de março", fim: "20 de junho", ano: defaultAno };
	}

	// Se vier no formato "2026.1" ou "2025.2"
	const semMatch = periodoStr.match(/^(\d{4})\.([12])$/);
	if (semMatch?.[1] && semMatch[2]) {
		const ano = semMatch[1];
		const sem = semMatch[2];
		if (sem === "1") {
			return { inicio: "10 de março", fim: "20 de junho", ano };
		}
		return { inicio: "10 de agosto", fim: "20 de novembro", ano };
	}

	// Se vier no formato "DD de Mês até DD de Mês de AAAA" ou "DD de Mês a DD de Mês de AAAA"
	const fullMatch = periodoStr.match(
		/(.+?)(?:\s+(?:até|a)\s+)(.+?)(?:\s+de\s+(\d{4}))$/i,
	);
	if (fullMatch?.[1] && fullMatch[2] && fullMatch[3]) {
		return {
			inicio: fullMatch[1].trim(),
			fim: fullMatch[2].trim(),
			ano: fullMatch[3].trim(),
		};
	}

	// Se tiver ano no final
	const anoMatch = periodoStr.match(/\b(\d{4})\b/);
	const ano = anoMatch?.[1] ? anoMatch[1] : defaultAno;

	return {
		inicio: "10 de março",
		fim: "20 de junho",
		ano,
	};
}

interface TextSpan {
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

function desenharParagrafoFormatado(
	pagina: PDFPage,
	spans: TextSpan[],
	options: {
		x: number;
		y: number;
		maxWidth: number;
		lineHeight: number;
		defaultSize?: number;
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
	for (const linha of linhas) {
		let xAtual = options.x;
		for (const token of linha) {
			pagina.drawText(token.text, {
				x: xAtual,
				y: yAtual,
				size: token.size,
				font: token.font,
				color: token.color,
			});
			xAtual += token.font.widthOfTextAtSize(token.text, token.size);
		}
		yAtual -= options.lineHeight;
	}
}

export const certificadoRouter = createTRPCRouter({
	gerarIndividual: directorProcedure
		.input(
			z.object({
				alunoId: z.string().optional(),
				nome: z.string().optional(),
				curso: z.string().optional(),
				periodo: z.string().optional(),
				dataInicio: z.string().optional(),
				dataFim: z.string().optional(),
				ano: z.string().optional(),
				cargaHoraria: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let nome = input.nome ?? "";
			let curso = input.curso ?? "Inclusão Digital";
			let periodo = input.periodo ?? "2026.1";
			let cargaHoraria = input.cargaHoraria ?? "12 horas";
			let periodoAulas: FormatoPeriodo | null = null;
			const localInfo = "Universidade Federal do Rio Grande do Norte (UFRN)";

			if (input.alunoId) {
				const aluno = await ctx.db.aluno.findFirst({
					where: {
						OR: [{ id: input.alunoId }, { cpf: input.alunoId }],
					},
					include: {
						semestre: true,
						turmas: {
							include: {
								turma: { include: { eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } },
							},
						},
						presencas: {
							include: {
								registro: {
									include: {
										turma: true,
									},
								},
							},
						},
					},
				});

				if (aluno) {
					nome = aluno.nome;
					cargaHoraria = calcularCargaHoraria(aluno.presencas);
					const turma = aluno.turmas.find((vinculo) => vinculo.turma.eventos.length > 0) ?? aluno.turmas[0];
					curso = turma?.turma.titulo || curso;
					periodoAulas = periodoDasAulas(turma?.turma.eventos ?? []);
					periodo = aluno.semestre?.codigo || periodo;
				}
			}

			if (!nome) {
				throw new Error("Nome do aluno não informado.");
			}

			const pdfFinal = await PDFDocument.create();
			const fontBold = await pdfFinal.embedFont(StandardFonts.HelveticaBold);
			const fontNormal = await pdfFinal.embedFont(StandardFonts.Helvetica);
			const modeloDoc = await carregarModeloCertificado();

			const [paginaCopiada] = await pdfFinal.copyPages(modeloDoc, [0]);
			if (!paginaCopiada) {
				throw new Error("Não foi possível carregar a página do modelo.");
			}
			pdfFinal.addPage(paginaCopiada);

			// Nome do Aluno
			paginaCopiada.drawText(nome, {
				x: 95,
				y: 380,
				size: 35,
				font: fontBold,
				color: rgb(26 / 255, 82 / 255, 155 / 255),
				maxWidth: 700,
				lineHeight: 30,
			});

			// Cores
			const corPadrao = rgb(34 / 255, 34 / 255, 34 / 255); // #222222
			const corAzulUfrn = rgb(0 / 255, 74 / 255, 173 / 255); // #004aad

			// Período formatado
			const { inicio, fim, ano } = periodoAulas ?? formatarPeriodo(periodo, input.dataInicio, input.dataFim, input.ano);

			// Texto descritivo com formatação rica:
			// - Curso: Negrito
			// - Carga Horária: Negrito
			// - Universidade: Negrito e #004aad
			// - Período de ... até ... de ...: Negrito no início, fim e ano
			const spans: TextSpan[] = [
				{ text: "Concluiu o curso de ", font: fontNormal, color: corPadrao },
				{ text: curso, font: fontBold, color: corPadrao },
				{ text: " com carga horária de ", font: fontNormal, color: corPadrao },
				{ text: cargaHoraria, font: fontBold, color: corPadrao },
				{ text: ", ministrado na ", font: fontNormal, color: corPadrao },
				{ text: localInfo, font: fontBold, color: corAzulUfrn },
				{ text: " no período de ", font: fontNormal, color: corPadrao },
				{ text: inicio, font: fontBold, color: corPadrao },
				{ text: " até ", font: fontNormal, color: corPadrao },
				{ text: fim, font: fontBold, color: corPadrao },
				{ text: " de ", font: fontNormal, color: corPadrao },
				{ text: ano, font: fontBold, color: corPadrao },
				{ text: ".", font: fontNormal, color: corPadrao },
			];

			desenharParagrafoFormatado(paginaCopiada, spans, {
				x: 96,
				y: 340,
				maxWidth: 650,
				lineHeight: 24,
				defaultSize: 16,
			});

			const pdfBytes = await pdfFinal.saveAsBase64();
			return {
				arquivoBase64: pdfBytes,
				nomeArquivo: `Certificado_${nome.replace(/\s+/g, "_")}.pdf`,
			};
		}),

	gerarLote: directorProcedure
		.input(
			z.object({
				semestreId: z.string(),
				turmaId: z.string().optional(),
				dataInicio: z.string().optional(),
				dataFim: z.string().optional(),
				ano: z.string().optional(),
				alunoIds: z.array(z.string().cuid()).max(200).optional(),
				alunosManuais: z
					.array(
						z.object({
							nome: z.string(),
							turma: z.string().optional(),
							curso: z.string().optional(),
							cargaHoraria: z.string().optional(),
							presencasCount: z.number().optional(),
						}),
					)
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let listaAlunos: {
				nome: string;
				curso: string;
				periodo: string;
				cargaHoraria: string;
				periodoAulas: FormatoPeriodo | null;
			}[] = [];

			// 1. Se foi enviada uma lista manual da tela
			if (input.alunosManuais && input.alunosManuais.length > 0) {
				listaAlunos = input.alunosManuais.map((a) => ({
					nome: a.nome,
					curso: a.curso || a.turma || "Inclusão Digital",
					periodo: input.semestreId,
					periodoAulas: null,
					cargaHoraria:
						a.cargaHoraria ||
						(a.presencasCount !== undefined
							? calcularCargaHoraria(a.presencasCount)
							: "12 horas"),
				}));
			} else {
				// 2. Busca no banco de dados com Prisma
				const alunosDb = await ctx.db.aluno.findMany({
					where: {
						OR: [
							{ semestreId: input.semestreId },
							{ semestre: { codigo: input.semestreId } },
						],
						...(input.turmaId
							? {
									turmas: {
										some: {
											OR: [
												{ turmaId: input.turmaId },
												{ turma: { titulo: input.turmaId } },
											],
										},
									},
								}
							: {}),
						...(input.alunoIds?.length ? { id: { in: input.alunoIds } } : {}),
					},
					include: {
						semestre: true,
						turmas: {
							include: {
								turma: { include: { eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } },
							},
						},
						presencas: {
							include: {
								registro: {
									include: {
										turma: true,
									},
								},
							},
						},
					},
				});

				listaAlunos = alunosDb.map((aluno) => {
					const turma = aluno.turmas.find((vinculo) => vinculo.turma.eventos.length > 0) ?? aluno.turmas[0];
					return { nome: aluno.nome, curso: turma?.turma.titulo || "Inclusão Digital", periodo: aluno.semestre?.codigo || input.semestreId, cargaHoraria: calcularCargaHoraria(aluno.presencas), periodoAulas: periodoDasAulas(turma?.turma.eventos ?? []) };
				});
			}

			if (listaAlunos.length === 0) {
				throw new Error(
					`Nenhum aluno encontrado para o semestre ${input.semestreId}.`,
				);
			}

			const pdfFinal = await PDFDocument.create();
			const fontBold = await pdfFinal.embedFont(StandardFonts.HelveticaBold);
			const fontNormal = await pdfFinal.embedFont(StandardFonts.Helvetica);
			const modeloDoc = await carregarModeloCertificado();
			const localInfo = "Universidade Federal do Rio Grande do Norte (UFRN)";

			// Cores
			const corPadrao = rgb(34 / 255, 34 / 255, 34 / 255); // #222222
			const corAzulUfrn = rgb(0 / 255, 74 / 255, 173 / 255); // #004aad

			// Itera sobre os alunos para gerar as páginas
			for (const aluno of listaAlunos) {
				const [paginaCopiada] = await pdfFinal.copyPages(modeloDoc, [0]);
				if (!paginaCopiada) {
					continue;
				}
				pdfFinal.addPage(paginaCopiada);

				// Adição do Nome
				paginaCopiada.drawText(aluno.nome, {
					x: 95,
					y: 380,
					size: 35,
					font: fontBold,
					color: rgb(26 / 255, 82 / 255, 155 / 255),
					maxWidth: 700,
					lineHeight: 30,
				});

				// Período formatado
				const { inicio, fim, ano } = aluno.periodoAulas ?? formatarPeriodo(aluno.periodo, input.dataInicio, input.dataFim, input.ano);

				// Texto descritivo com formatação rica
				const spans: TextSpan[] = [
					{ text: "Concluiu o curso de ", font: fontNormal, color: corPadrao },
					{ text: aluno.curso, font: fontBold, color: corPadrao },
					{
						text: " com carga horária de ",
						font: fontNormal,
						color: corPadrao,
					},
					{ text: aluno.cargaHoraria, font: fontBold, color: corPadrao },
					{ text: ", ministrado na ", font: fontNormal, color: corPadrao },
					{ text: localInfo, font: fontBold, color: corAzulUfrn },
					{ text: " no período de ", font: fontNormal, color: corPadrao },
					{ text: inicio, font: fontBold, color: corPadrao },
					{ text: " até ", font: fontNormal, color: corPadrao },
					{ text: fim, font: fontBold, color: corPadrao },
					{ text: " de ", font: fontNormal, color: corPadrao },
					{ text: ano, font: fontBold, color: corPadrao },
					{ text: ".", font: fontNormal, color: corPadrao },
				];

				desenharParagrafoFormatado(paginaCopiada, spans, {
					x: 96,
					y: 340,
					maxWidth: 650,
					lineHeight: 24,
					defaultSize: 16,
				});
			}

			// Salva e retorna arquivo único em Base64 com todas as páginas geradas
			const pdfBytes = await pdfFinal.saveAsBase64();
			return {
				arquivoBase64: pdfBytes,
				totalCertificados: listaAlunos.length,
				nomeArquivo: `Certificados_${input.semestreId}.pdf`,
			};
		}),
});
