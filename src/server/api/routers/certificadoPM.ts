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
			path.join(process.cwd(), "public", "certificado_monitor-professor.pdf"),
		);
	} catch {
		modeloBuffer = await fs.readFile(
			path.join(process.cwd(), "models", "certificado_monitor-professor.pdf"),
		);
	}
	return PDFDocument.load(modeloBuffer);
}

function calcularCargaHoraria(
	presencas?: { estado: string }[] | number,
): string {
	if (typeof presencas === "number") {
		return `${presencas * 6} horas`;
	}

	if (!presencas || presencas.length === 0) {
		return "0 horas";
	}

	// Contabiliza apenas as presenças confirmadas (PRESENTE)
	const totalPresencas = presencas.filter(
		(p) => p.estado === "PRESENTE",
	).length;

	return `${totalPresencas * 6} horas`;
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

function dataDeEmissao() {
	const partes = new Intl.DateTimeFormat("pt-BR", {
		timeZone: "America/Fortaleza",
		day: "numeric",
		month: "numeric",
		year: "numeric",
	}).formatToParts(new Date());
	const valor = (tipo: Intl.DateTimeFormatPartTypes) => partes.find((parte) => parte.type === tipo)?.value ?? "";
	return `Natal-RN, ${valor("day")} de ${meses[Number(valor("month")) - 1]} de ${valor("year")}`;
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
		const larguraLinha = linha.reduce((total, token) => total + token.font.widthOfTextAtSize(token.text, token.size), 0);
		const espacoExtra = deveJustificar && espacos.length > 0
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
			xAtual += token.font.widthOfTextAtSize(token.text, token.size) + (token.text.trim() === "" ? espacoExtra : 0);
		}
		yAtual -= options.lineHeight;
	}
	return yAtual;
}

export const certificadoRouter = createTRPCRouter({
	gerarIndividual: directorProcedure
		.input(
			z.object({
				usuarioId: z.string().cuid().optional(),
				turmaId: z.string().cuid().optional(),
				alunoId: z.string().optional(),
				nome: z.string().optional(),
				matricula: z.string().optional(),
				curso: z.string().optional(),
				periodo: z.string().optional(),
				dataInicio: z.string().optional(),
				dataFim: z.string().optional(),
				ano: z.string().optional(),
				cargaHoraria: z.string().optional(),
				tipo: z.enum(["professor", "monitor"]).default("professor"),
				genero: z.enum(["masculino", "feminino"]).default("masculino"),
				nomeProjeto: z.string().optional(),
				codigoProjeto: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			let nome = input.nome ?? "";
			let matricula = input.matricula ?? "";
			let curso = input.curso ?? "Inclusão Digital";
			let periodo = input.periodo ?? "2026.1";
			let cargaHoraria = input.cargaHoraria ?? "54 horas";
			const tipo = input.tipo;
			const genero = input.genero;
			const nomeProjeto =
				input.nomeProjeto ??
				"Projeto de Extensão de Inclusão Digital para Pessoas Idosas";
			const codigoProjeto = input.codigoProjeto ?? "PJ457-2026";
			let periodoAulas: FormatoPeriodo | null = null;

			if (input.usuarioId) {
				const usuario = await ctx.db.user.findFirst({
					where: {
						id: input.usuarioId,
						role: input.tipo === "monitor" ? "MONITOR" : { in: ["PROFESSOR", "DIRETOR"] },
					},
					select: {
						nome: true,
						matricula: true,
						presencasMonitor: { select: { estado: true } },
						presencasProfessor: { select: { estado: true } },
						turmasProfessor: { select: { turma: { select: { id: true, titulo: true, semestre: { select: { codigo: true } }, eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } } } },
						turmasMonitor: { select: { turma: { select: { id: true, titulo: true, semestre: { select: { codigo: true } }, eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } } } },
					},
				});
				if (!usuario) throw new Error("Professor ou monitor não encontrado.");
				const vinculos = input.tipo === "monitor" ? usuario.turmasMonitor : usuario.turmasProfessor;
				const turmas = input.turmaId
					? vinculos.filter((vinculo) => vinculo.turma.id === input.turmaId).map((vinculo) => vinculo.turma)
					: vinculos.map((vinculo) => vinculo.turma);
				if (!turmas.length) throw new Error("Este usuário não possui turmas vinculadas.");
				periodoAulas = periodoDasAulas(turmas.flatMap((turma) => turma.eventos));
				if (!periodoAulas) throw new Error("As turmas vinculadas ainda não possuem aulas cadastradas.");
				nome = usuario.nome;
				matricula = usuario.matricula;
				curso = [...new Set(turmas.map((turma) => turma.titulo))].join(" e ");
				periodo = turmas.at(-1)?.semestre.codigo || periodo;
				cargaHoraria = calcularCargaHoraria(
					input.tipo === "monitor" ? usuario.presencasMonitor : usuario.presencasProfessor,
				);
			} else if (input.alunoId) {
				const aluno = await ctx.db.aluno.findFirst({
					where: {
						OR: [{ id: input.alunoId }, { cpf: input.alunoId }],
					},
					include: {
						semestre: true,
						turmas: {
							include: {
								turma: true,
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
					curso = aluno.turmas[0]?.turma?.titulo || curso;
					periodo = aluno.semestre?.codigo || periodo;
				}
			}

			if (!nome) {
				throw new Error("Nome do discente não informado.");
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

			// Cores
			const corPadrao = rgb(34 / 255, 34 / 255, 34 / 255); // #222222

			// Período formatado
			const { inicio, fim, ano } = periodoAulas ?? formatarPeriodo(
				periodo,
				input.dataInicio,
				input.dataFim,
				input.ano,
			);

			// Concordância de gênero
			const artigo = genero === "feminino" ? "a" : "o";
			const artigoMaiusculo = genero === "feminino" ? "A" : "O";
			const vinculado = genero === "feminino" ? "vinculada" : "vinculado";
			const funcao =
				tipo === "professor"
					? genero === "feminino"
						? "professora"
						: "professor"
					: genero === "feminino"
						? "monitora"
						: "monitor";
			const preposicaoCurso = curso.includes(" e ")
				? "dos cursos de "
				: "do curso de ";

			// Texto da declaração com formatação rica
			const spans: TextSpan[] = [
				{
					text: "Declaro, para os fins que se fizerem necessários, que ",
					font: fontNormal,
					color: corPadrao,
				},
				{ text: `${artigo} discente `, font: fontNormal, color: corPadrao },
				{ text: nome, font: fontBold, color: corPadrao },
				{ text: ", matrícula ", font: fontNormal, color: corPadrao },
				{ text: matricula, font: fontBold, color: corPadrao },
				{
					text: `, está ${vinculado} ao `,
					font: fontNormal,
					color: corPadrao,
				},
				{ text: nomeProjeto, font: fontBold, color: corPadrao },
				{ text: " (", font: fontNormal, color: corPadrao },
				{ text: codigoProjeto, font: fontBold, color: corPadrao },
				{ text: "), no período de ", font: fontNormal, color: corPadrao },
				{ text: inicio, font: fontBold, color: corPadrao },
				{ text: " a ", font: fontNormal, color: corPadrao },
				{ text: fim, font: fontBold, color: corPadrao },
				{ text: " de ", font: fontNormal, color: corPadrao },
				{ text: ano, font: fontBold, color: corPadrao },
				{
					text: ", com uma carga horária total de ",
					font: fontNormal,
					color: corPadrao,
				},
				{ text: cargaHoraria, font: fontBold, color: corPadrao },
				{
					text: `. ${artigoMaiusculo} discente atuou como `,
					font: fontNormal,
					color: corPadrao,
				},
				{ text: funcao, font: fontBold, color: corPadrao },
				{ text: ` ${preposicaoCurso}`, font: fontNormal, color: corPadrao },
				{ text: curso, font: fontBold, color: corPadrao },
				{ text: ".", font: fontNormal, color: corPadrao },
			];

			const yAposTexto = desenharParagrafoFormatado(paginaCopiada, spans, {
				x: 50,
				y: 600,
				maxWidth: 500,
				lineHeight: 24,
				defaultSize: 14,
				justify: true,
			});
			const data = dataDeEmissao();
			paginaCopiada.drawText(data, { x: (paginaCopiada.getWidth() - fontNormal.widthOfTextAtSize(data, 14)) / 2, y: yAposTexto - 16, size: 14, font: fontNormal, color: corPadrao });

			const pdfBytes = await pdfFinal.saveAsBase64();
			return {
				arquivoBase64: pdfBytes,
				nomeArquivo: `Certificado_PM_${nome.replace(/\s+/g, "_")}.pdf`,
			};
		}),

	gerarLoteUsuarios: directorProcedure
		.input(
			z.object({
				usuarioIds: z.array(z.string().cuid()).min(1).max(100),
				tipo: z.enum(["professor", "monitor"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const usuarios = await ctx.db.user.findMany({
				where: {
					id: { in: input.usuarioIds },
					role: input.tipo === "monitor" ? "MONITOR" : { in: ["PROFESSOR", "DIRETOR"] },
				},
				select: {
					id: true,
					nome: true,
					matricula: true,
					presencasMonitor: { select: { estado: true } },
					presencasProfessor: { select: { estado: true } },
					turmasProfessor: { select: { turma: { select: { titulo: true, semestre: { select: { codigo: true } }, eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } } } },
					turmasMonitor: { select: { turma: { select: { titulo: true, semestre: { select: { codigo: true } }, eventos: { where: { tipo: "AULA" }, orderBy: { data: "asc" }, select: { data: true } } } } } },
				},
				orderBy: { nome: "asc" },
			});

			if (usuarios.length !== new Set(input.usuarioIds).size) {
				throw new Error("Um ou mais usuários não foram encontrados ou não pertencem ao cargo selecionado.");
			}

			const dados = usuarios.map((usuario) => {
				const turmas = (input.tipo === "monitor" ? usuario.turmasMonitor : usuario.turmasProfessor).map((vinculo) => vinculo.turma);
				const periodoAulas = periodoDasAulas(turmas.flatMap((turma) => turma.eventos));
				return { usuario, turmas, periodoAulas };
			});
			const semDados = dados.filter(({ turmas, periodoAulas }) => !turmas.length || !periodoAulas).map(({ usuario }) => usuario.nome);
			if (semDados.length) {
				throw new Error(`Não é possível gerar certificados sem turmas e aulas cadastradas para: ${semDados.join(", ")}.`);
			}

			const pdfFinal = await PDFDocument.create();
			const fontBold = await pdfFinal.embedFont(StandardFonts.HelveticaBold);
			const fontNormal = await pdfFinal.embedFont(StandardFonts.Helvetica);
			const modeloDoc = await carregarModeloCertificado();
			const corPadrao = rgb(34 / 255, 34 / 255, 34 / 255);

			for (const { usuario, turmas, periodoAulas } of dados) {
				const [pagina] = await pdfFinal.copyPages(modeloDoc, [0]);
				if (!pagina || !periodoAulas) continue;
				pdfFinal.addPage(pagina);
				const curso = [...new Set(turmas.map((turma) => turma.titulo))].join(" e ");
				const cargaHoraria = calcularCargaHoraria(input.tipo === "monitor" ? usuario.presencasMonitor : usuario.presencasProfessor);
				const funcao = input.tipo === "professor" ? "professor" : "monitor";
				const preposicaoCurso = curso.includes(" e ") ? "dos cursos de " : "do curso de ";
				const spans: TextSpan[] = [
					{ text: "Declaro, para os fins que se fizerem necessários, que o discente ", font: fontNormal, color: corPadrao },
					{ text: usuario.nome, font: fontBold, color: corPadrao },
					{ text: ", matrícula ", font: fontNormal, color: corPadrao },
					{ text: usuario.matricula, font: fontBold, color: corPadrao },
					{ text: ", está vinculado ao ", font: fontNormal, color: corPadrao },
					{ text: "Projeto de Extensão de Inclusão Digital para Pessoas Idosas", font: fontBold, color: corPadrao },
					{ text: " (", font: fontNormal, color: corPadrao },
					{ text: "PJ457-2026", font: fontBold, color: corPadrao },
					{ text: "), no período de ", font: fontNormal, color: corPadrao },
					{ text: periodoAulas.inicio, font: fontBold, color: corPadrao },
					{ text: " a ", font: fontNormal, color: corPadrao },
					{ text: periodoAulas.fim, font: fontBold, color: corPadrao },
					{ text: " de ", font: fontNormal, color: corPadrao },
					{ text: periodoAulas.ano, font: fontBold, color: corPadrao },
					{ text: ", com uma carga horária total de ", font: fontNormal, color: corPadrao },
					{ text: cargaHoraria, font: fontBold, color: corPadrao },
					{ text: `. O discente atuou como ${funcao} ${preposicaoCurso}`, font: fontNormal, color: corPadrao },
					{ text: curso, font: fontBold, color: corPadrao },
					{ text: ".", font: fontNormal, color: corPadrao },
				];
				const yAposTexto = desenharParagrafoFormatado(pagina, spans, { x: 50, y: 600, maxWidth: 500, lineHeight: 24, defaultSize: 14, justify: true });
				const data = dataDeEmissao();
				pagina.drawText(data, { x: (pagina.getWidth() - fontNormal.widthOfTextAtSize(data, 14)) / 2, y: yAposTexto - 16, size: 14, font: fontNormal, color: corPadrao });
			}

			return {
				arquivoBase64: await pdfFinal.saveAsBase64(),
				totalCertificados: usuarios.length,
				nomeArquivo: `Certificados_${input.tipo === "professor" ? "Professores" : "Monitores"}.pdf`,
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
				tipo: z.enum(["professor", "monitor"]).default("professor"),
				genero: z.enum(["masculino", "feminino"]).default("masculino"),
				nomeProjeto: z.string().optional(),
				codigoProjeto: z.string().optional(),
				alunosManuais: z
					.array(
						z.object({
							nome: z.string(),
							matricula: z.string().optional(),
							turma: z.string().optional(),
							curso: z.string().optional(),
							cargaHoraria: z.string().optional(),
							presencasCount: z.number().optional(),
							tipo: z.enum(["professor", "monitor"]).optional(),
							genero: z.enum(["masculino", "feminino"]).optional(),
						}),
					)
					.optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const nomeProjeto =
				input.nomeProjeto ??
				"Projeto de Extensão de Inclusão Digital para Pessoas Idosas";
			const codigoProjeto = input.codigoProjeto ?? "PJ457-2026";

			let listaAlunos: {
				nome: string;
				matricula: string;
				curso: string;
				periodo: string;
				cargaHoraria: string;
				tipo: "professor" | "monitor";
				genero: "masculino" | "feminino";
			}[] = [];

			// 1. Se foi enviada uma lista manual da tela
			if (input.alunosManuais && input.alunosManuais.length > 0) {
				listaAlunos = input.alunosManuais.map((a) => ({
					nome: a.nome,
					matricula: a.matricula ?? "",
					curso: a.curso || a.turma || "Inclusão Digital",
					periodo: input.semestreId,
					cargaHoraria:
						a.cargaHoraria ||
						(a.presencasCount !== undefined
							? calcularCargaHoraria(a.presencasCount)
							: "54 horas"),
					tipo: a.tipo ?? input.tipo,
					genero: a.genero ?? input.genero,
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
					},
					include: {
						semestre: true,
						turmas: {
							include: {
								turma: true,
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

				listaAlunos = alunosDb.map((aluno) => ({
					nome: aluno.nome,
					matricula: aluno.cpf ?? "",
					curso: aluno.turmas[0]?.turma?.titulo || "Inclusão Digital",
					periodo: aluno.semestre?.codigo || input.semestreId,
					cargaHoraria: calcularCargaHoraria(aluno.presencas),
					tipo: input.tipo,
					genero: input.genero,
				}));
			}

			if (listaAlunos.length === 0) {
				throw new Error(
					`Nenhum discente encontrado para o semestre ${input.semestreId}.`,
				);
			}

			const pdfFinal = await PDFDocument.create();
			const fontBold = await pdfFinal.embedFont(StandardFonts.HelveticaBold);
			const fontNormal = await pdfFinal.embedFont(StandardFonts.Helvetica);
			const modeloDoc = await carregarModeloCertificado();
			// Cores
			const corPadrao = rgb(34 / 255, 34 / 255, 34 / 255); // #222222

			// Itera sobre os discentes para gerar as páginas
			for (const aluno of listaAlunos) {
				const [paginaCopiada] = await pdfFinal.copyPages(modeloDoc, [0]);
				if (!paginaCopiada) {
					continue;
				}
				pdfFinal.addPage(paginaCopiada);

				// Período formatado
				const { inicio, fim, ano } = formatarPeriodo(
					aluno.periodo,
					input.dataInicio,
					input.dataFim,
					input.ano,
				);

				// Concordância de gênero
				const artigo = aluno.genero === "feminino" ? "a" : "o";
				const artigoMaiusculo = aluno.genero === "feminino" ? "A" : "O";
				const vinculado = aluno.genero === "feminino" ? "vinculada" : "vinculado";
				const funcao =
					aluno.tipo === "professor"
						? aluno.genero === "feminino"
							? "professora"
							: "professor"
						: aluno.genero === "feminino"
							? "monitora"
							: "monitor";
				const preposicaoCurso = aluno.curso.includes(" e ")
					? "dos cursos de "
					: "do curso de ";

				// Texto da declaração com formatação rica
				const spans: TextSpan[] = [
					{
						text: "Declaro, para os fins que se fizerem necessários, que ",
						font: fontNormal,
						color: corPadrao,
					},
					{ text: `${artigo} discente `, font: fontNormal, color: corPadrao },
					{ text: aluno.nome, font: fontBold, color: corPadrao },
					{ text: ", matrícula ", font: fontNormal, color: corPadrao },
					{ text: aluno.matricula, font: fontBold, color: corPadrao },
					{
						text: `, está ${vinculado} ao `,
						font: fontNormal,
						color: corPadrao,
					},
					{ text: nomeProjeto, font: fontBold, color: corPadrao },
					{ text: " (", font: fontNormal, color: corPadrao },
					{ text: codigoProjeto, font: fontBold, color: corPadrao },
					{ text: "), no período de ", font: fontNormal, color: corPadrao },
					{ text: inicio, font: fontBold, color: corPadrao },
					{ text: " a ", font: fontNormal, color: corPadrao },
					{ text: fim, font: fontBold, color: corPadrao },
					{ text: " de ", font: fontNormal, color: corPadrao },
					{ text: ano, font: fontBold, color: corPadrao },
					{
						text: ", com uma carga horária total de ",
						font: fontNormal,
						color: corPadrao,
					},
					{ text: aluno.cargaHoraria, font: fontBold, color: corPadrao },
					{
						text: `. ${artigoMaiusculo} discente atuou como `,
						font: fontNormal,
						color: corPadrao,
					},
					{ text: funcao, font: fontBold, color: corPadrao },
					{ text: ` ${preposicaoCurso}`, font: fontNormal, color: corPadrao },
					{ text: aluno.curso, font: fontBold, color: corPadrao },
					{ text: ".", font: fontNormal, color: corPadrao },
				];

				const yAposTexto = desenharParagrafoFormatado(paginaCopiada, spans, {
					x: 50,
					y: 600,
					maxWidth: 500,
					lineHeight: 24,
					defaultSize: 14,
					justify: true,
				});
				const data = dataDeEmissao();
				paginaCopiada.drawText(data, { x: (paginaCopiada.getWidth() - fontNormal.widthOfTextAtSize(data, 14)) / 2, y: yAposTexto - 16, size: 14, font: fontNormal, color: corPadrao });
			}

			// Salva e retorna arquivo único em Base64 com todas as páginas geradas
			const pdfBytes = await pdfFinal.saveAsBase64();
			return {
				arquivoBase64: pdfBytes,
				totalCertificados: listaAlunos.length,
				nomeArquivo: `Certificados_PM_${input.semestreId}.pdf`,
			};
		}),
});
