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

const nomeProjeto =
	"Projeto de Extensão de Inclusão Digital para Pessoas Idosas";
const codigoProjetoPadrao = "PJ457-2026";
const tipoCertificado = z.enum(["professor", "monitor"]);
type TipoCertificado = z.infer<typeof tipoCertificado>;

const turmas = {
	select: {
		turma: {
			select: {
				id: true,
				titulo: true,
				eventos: { where: { tipo: "AULA" }, select: { data: true } },
			},
		},
	},
} as const;
const presencas = {
	select: { estado: true, registro: { select: { turmaId: true, data: true } } },
} as const;
const selecaoUsuario = {
	nome: true,
	matricula: true,
	turmasProfessor: turmas,
	turmasMonitor: turmas,
	presencasProfessor: presencas,
	presencasMonitor: presencas,
} as const satisfies Prisma.UserSelect;

type Usuario = Prisma.UserGetPayload<{ select: typeof selecaoUsuario }>;

function filtroCargo(tipo: TipoCertificado): Prisma.UserWhereInput {
	return {
		role: tipo === "monitor" ? "MONITOR" : { in: ["PROFESSOR", "DIRETOR"] },
	};
}

function nomeParaCertificado(titulo: string) {
	return titulo
		.replace(/\s*(?:[-–—,:]\s*)?\bT[123]\b(?:\s*[-–—,:])?\s*/gi, " ")
		.replace(/\s{2,}/g, " ")
		.trim();
}

function dadosCertificado(usuario: Usuario, tipo: TipoCertificado) {
	const monitor = tipo === "monitor";
	const turmasVinculadas = (
		monitor ? usuario.turmasMonitor : usuario.turmasProfessor
	).map(({ turma }) => turma);
	const periodo = periodoDasAulas(
		turmasVinculadas.flatMap((turma) => turma.eventos),
	);
	if (!periodo) return null;

	const turmaIds = new Set(turmasVinculadas.map(({ id }) => id));
	const diasPresentes = new Set(
		(monitor ? usuario.presencasMonitor : usuario.presencasProfessor)
			.filter(
				({ estado, registro }) =>
					estado === "PRESENTE" && turmaIds.has(registro.turmaId),
			)
			.map(({ registro }) => diaCalendario(registro.data)),
	);
	const cursos = [
		...new Set(
			turmasVinculadas
				.map(({ titulo }) => nomeParaCertificado(titulo))
				.filter(Boolean),
		),
	].sort();

	return {
		nome: usuario.nome,
		matricula: usuario.matricula,
		cursos: cursos.length ? cursos : ["Inclusão Digital"],
		cargaHoraria: diasPresentes.size * 6,
		...periodo,
	};
}

async function gerarPdf(
	certificados: NonNullable<ReturnType<typeof dadosCertificado>>[],
	tipo: TipoCertificado,
	codigoProjeto: string,
) {
	const pdf = await PDFDocument.create();
	const normal = await pdf.embedFont(StandardFonts.Helvetica);
	const negrito = await pdf.embedFont(StandardFonts.HelveticaBold);
	const modelo = await carregarModeloCertificado(
		"certificado_monitor-professor.pdf",
	);
	const cor = rgb(34 / 255, 34 / 255, 34 / 255);
	const funcao = tipo === "professor" ? "professor(a)" : "monitor(a)";
	const hoje = new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "long",
		timeZone: "America/Fortaleza",
	}).format(new Date());
	const data = `Natal-RN, ${hoje}`;
	const paginas = await pdf.copyPages(
		modelo,
		certificados.map(() => 0),
	);

	for (const [indice, certificado] of certificados.entries()) {
		const pagina = paginas[indice];
		if (!pagina) throw new Error("Não foi possível copiar a página do modelo.");
		pdf.addPage(pagina);
		const preposicaoCurso =
			certificado.cursos.length > 1 ? "dos cursos de" : "do curso de";
		const spans: TextSpan[] = [
			{
				text: "Declaro, para os fins que se fizerem necessários, que o(a) discente ",
				font: normal,
				color: cor,
			},
			{ text: certificado.nome, font: negrito, color: cor },
			{ text: ", matrícula ", font: normal, color: cor },
			{ text: certificado.matricula, font: negrito, color: cor },
			{ text: ", está vinculado(a) ao ", font: normal, color: cor },
			{ text: nomeProjeto, font: negrito, color: cor },
			{ text: " (", font: normal, color: cor },
			{ text: codigoProjeto, font: negrito, color: cor },
			{ text: "), no período de ", font: normal, color: cor },
			{ text: certificado.inicio, font: negrito, color: cor },
			{ text: " a ", font: normal, color: cor },
			{ text: certificado.fim, font: negrito, color: cor },
			{ text: ", com uma carga horária total de ", font: normal, color: cor },
			{ text: `${certificado.cargaHoraria} horas`, font: negrito, color: cor },
			{ text: ". O(a) discente atuou como ", font: normal, color: cor },
			{ text: funcao, font: negrito, color: cor },
			{ text: ` ${preposicaoCurso} `, font: normal, color: cor },
			{ text: certificado.cursos.join(" e "), font: negrito, color: cor },
			{ text: ".", font: normal, color: cor },
		];
		const yAposTexto = desenharParagrafoFormatado(pagina, spans, {
			x: 50,
			y: 600,
			maxWidth: 500,
			lineHeight: 24,
			defaultSize: 14,
			justify: true,
		});
		pagina.drawText(data, {
			x: (pagina.getWidth() - normal.widthOfTextAtSize(data, 14)) / 2,
			y: yAposTexto - 16,
			size: 14,
			font: normal,
			color: cor,
		});
	}

	return pdf.saveAsBase64();
}

export const certificadoRouter = createTRPCRouter({
	gerarIndividual: directorProcedure
		.input(z.object({ usuarioId: z.string().cuid(), tipo: tipoCertificado }))
		.mutation(async ({ ctx, input }) => {
			const usuario = await ctx.db.user.findFirst({
				where: { id: input.usuarioId, ...filtroCargo(input.tipo) },
				select: selecaoUsuario,
			});
			if (!usuario)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Professor ou monitor não encontrado.",
				});

			const certificado = dadosCertificado(usuario, input.tipo);
			if (!certificado)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"O usuário precisa ter uma turma vinculada com aulas cadastradas.",
				});

			return {
				arquivoBase64: await gerarPdf(
					[certificado],
					input.tipo,
					codigoProjetoPadrao,
				),
				nomeArquivo: `Certificado_PM_${usuario.nome.replace(/\s+/g, "_")}.pdf`,
			};
		}),

	gerarLoteUsuarios: directorProcedure
		.input(
			z.object({
				usuarioIds: z.array(z.string().cuid()).min(1).max(100),
				tipo: tipoCertificado,
				codigoProjeto: z.string().trim().min(1, "Informe o código do projeto."),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const usuarios = await ctx.db.user.findMany({
				where: { id: { in: input.usuarioIds }, ...filtroCargo(input.tipo) },
				select: selecaoUsuario,
				orderBy: { nome: "asc" },
			});
			if (usuarios.length !== new Set(input.usuarioIds).size)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message:
						"Um ou mais usuários não foram encontrados ou não pertencem ao cargo selecionado.",
				});

			const certificados: NonNullable<ReturnType<typeof dadosCertificado>>[] =
				[];
			const semDados: string[] = [];
			for (const usuario of usuarios) {
				const certificado = dadosCertificado(usuario, input.tipo);
				if (certificado) certificados.push(certificado);
				else semDados.push(usuario.nome);
			}
			if (semDados.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Não é possível gerar certificados sem turmas e aulas cadastradas para: ${semDados.join(", ")}.`,
				});

			return {
				arquivoBase64: await gerarPdf(
					certificados,
					input.tipo,
					input.codigoProjeto,
				),
				totalCertificados: certificados.length,
				nomeArquivo: `Certificados_${input.tipo === "professor" ? "Professores" : "Monitores"}.pdf`,
			};
		}),
});
