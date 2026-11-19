import { TRPCError } from "@trpc/server";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { z } from "zod";
import { diaCalendario } from "~/lib/dia-calendario";
import { directorProcedure } from "~/server/api/routers/diretoria";
import { createTRPCRouter } from "~/server/api/trpc";
import {
	carregarModeloCertificado,
	desenharParagrafoFormatado,
	periodoDasAulas,
	type TextSpan,
} from "~/server/certificado-pdf";
import type { Prisma } from "../../../../generated/prisma";

const selecaoAluno = {
	nome: true,
	semestreId: true,
	turmas: {
		select: {
			turma: {
				select: {
					id: true,
					titulo: true,
					semestreId: true,
					eventos: { where: { tipo: "AULA" }, select: { data: true } },
				},
			},
		},
	},
	presencas: {
		select: {
			estado: true,
			registro: { select: { turmaId: true, data: true } },
		},
	},
} as const satisfies Prisma.AlunoSelect;

type Aluno = Prisma.AlunoGetPayload<{ select: typeof selecaoAluno }>;
type Turma = Aluno["turmas"][number]["turma"];

function dadosCertificado(aluno: Aluno, turma: Turma) {
	const presencas = aluno.presencas.filter(
		({ registro }) => registro.turmaId === turma.id,
	);
	const diasPresentes = new Set(
		presencas
			.filter(({ estado }) => estado === "PRESENTE")
			.map(({ registro }) => diaCalendario(registro.data)),
	);
	if (!diasPresentes.size) return null;

	const diasDeFalta = new Set(
		presencas
			.filter(({ estado }) => estado === "AUSENTE")
			.map(({ registro }) => diaCalendario(registro.data))
			.filter((dia) => !diasPresentes.has(dia)),
	);
	const cargaHoraria = Math.max(
		0,
		12 - Math.max(0, diasDeFalta.size - 3) * 1.5,
	);
	const periodo =
		periodoDasAulas(turma.eventos) ??
		periodoDasAulas(presencas.map(({ registro }) => registro));
	if (!periodo) return null;

	return {
		nome: aluno.nome,
		curso: turma.titulo,
		cargaHoraria: `${cargaHoraria.toLocaleString("pt-BR")} horas`,
		...periodo,
	};
}

async function gerarPdf(
	certificados: NonNullable<ReturnType<typeof dadosCertificado>>[],
) {
	const pdf = await PDFDocument.create();
	const normal = await pdf.embedFont(StandardFonts.Helvetica);
	const negrito = await pdf.embedFont(StandardFonts.HelveticaBold);
	const modelo = await carregarModeloCertificado("modelo-certificado.pdf");
	const cor = rgb(34 / 255, 34 / 255, 34 / 255);
	const azulUfrn = rgb(0, 74 / 255, 173 / 255);
	const paginas = await pdf.copyPages(
		modelo,
		certificados.map(() => 0),
	);

	for (const [indice, certificado] of certificados.entries()) {
		const pagina = paginas[indice];
		if (!pagina) throw new Error("Não foi possível copiar a página do modelo.");
		pdf.addPage(pagina);
		pagina.drawText(certificado.nome, {
			x: 95,
			y: 380,
			size: 35,
			font: negrito,
			color: rgb(26 / 255, 82 / 255, 155 / 255),
			maxWidth: 700,
			lineHeight: 30,
		});

		const spans: TextSpan[] = [
			{ text: "Concluiu o curso de ", font: normal, color: cor },
			{ text: certificado.curso, font: negrito, color: cor },
			{ text: " com carga horária de ", font: normal, color: cor },
			{ text: certificado.cargaHoraria, font: negrito, color: cor },
			{ text: ", ministrado na ", font: normal, color: cor },
			{
				text: "Universidade Federal do Rio Grande do Norte (UFRN)",
				font: negrito,
				color: azulUfrn,
			},
			{ text: " no período de ", font: normal, color: cor },
			{ text: certificado.inicio, font: negrito, color: cor },
			{ text: " a ", font: normal, color: cor },
			{ text: certificado.fim, font: negrito, color: cor },
			{ text: ".", font: normal, color: cor },
		];
		desenharParagrafoFormatado(pagina, spans, {
			x: 96,
			y: 340,
			maxWidth: 650,
			lineHeight: 24,
			defaultSize: 16,
		});
	}

	return pdf.saveAsBase64();
}

export const certificadoRouter = createTRPCRouter({
	gerarIndividual: directorProcedure
		.input(z.object({ alunoId: z.string().cuid(), turmaId: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const aluno = await ctx.db.aluno.findUnique({
				where: { id: input.alunoId },
				select: selecaoAluno,
			});
			const turma = aluno?.turmas.find(
				({ turma }) =>
					turma.id === input.turmaId && turma.semestreId === aluno.semestreId,
			)?.turma;
			if (!aluno || !turma)
				throw new TRPCError({
					code: "NOT_FOUND",
					message:
						"A turma selecionada não pertence à matrícula do aluno neste semestre.",
				});

			const certificado = dadosCertificado(aluno, turma);
			if (!certificado)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"O aluno precisa ter pelo menos uma presença nesta turma para receber o certificado.",
				});

			return {
				arquivoBase64: await gerarPdf([certificado]),
				nomeArquivo: `Certificado_${aluno.nome.replace(/\s+/g, "_")}_${turma.titulo.replace(/[^\p{L}\p{N}._-]+/gu, "_")}.pdf`,
			};
		}),

	gerarLote: directorProcedure
		.input(
			z.object({
				semestreId: z.string(),
				turmaId: z.string().cuid().optional(),
				alunoIds: z.array(z.string().cuid()).min(1).max(200).optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const alunos = await ctx.db.aluno.findMany({
				where: {
					OR: [
						{ semestreId: input.semestreId },
						{ semestre: { codigo: input.semestreId } },
					],
					id: input.alunoIds ? { in: input.alunoIds } : undefined,
					turmas: input.turmaId
						? { some: { turmaId: input.turmaId } }
						: undefined,
				},
				select: selecaoAluno,
				orderBy: { nome: "asc" },
			});

			const certificados = alunos.flatMap((aluno) =>
				aluno.turmas
					.filter(
						({ turma }) =>
							turma.semestreId === aluno.semestreId &&
							(!input.turmaId || turma.id === input.turmaId),
					)
					.flatMap(({ turma }) => {
						const certificado = dadosCertificado(aluno, turma);
						return certificado ? [certificado] : [];
					}),
			);

			if (!certificados.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Nenhum aluno tem presença confirmada nas turmas selecionadas.",
				});

			return {
				arquivoBase64: await gerarPdf(certificados),
				totalCertificados: certificados.length,
				nomeArquivo: `Certificados_${input.semestreId}.pdf`,
			};
		}),
});
