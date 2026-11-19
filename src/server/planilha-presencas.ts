import { TRPCError } from "@trpc/server";
import * as XLSX from "xlsx";
import { z } from "zod";
import { diaCalendario } from "~/lib/dia-calendario";
import { normalizarBusca } from "~/lib/texto";
import { escreverPlanilhaDeChamada } from "~/server/planilha-chamada-xlsx";
import {
	type MarcacoesDaTurma,
	salvarMarcacoesDaTurma,
	transacaoPresencas,
} from "~/server/presencas";
import type { Prisma, PrismaClient } from "../../generated/prisma";

export const tipoPlanilhaPresencas = z.enum(["alunos", "equipe"]);
type Tipo = z.infer<typeof tipoPlanilhaPresencas>;
type Grupo = "alunos" | "monitores" | "professores";
type Estado = MarcacoesDaTurma["alunos"][number]["estado"];
type Perfil = "Aluno" | "Monitor" | "Professor" | "Diretor docente";

const assinatura = "Nexus:Chamada:1:";
const formatoData = "dd/mm/yyyy";
const formatoInvalido =
	"Use uma planilha-modelo de presenças baixada no Nexus.";

function erroPlanilha(message: string): never {
	throw new TRPCError({ code: "BAD_REQUEST", message });
}

async function dadosDoSemestre(
	db: Prisma.TransactionClient,
	semestreId: string,
) {
	const semestre = await db.semestre.findUnique({
		where: { id: semestreId },
		select: {
			codigo: true,
			turmas: {
				orderBy: [{ titulo: "asc" }, { id: "asc" }],
				select: {
					id: true,
					titulo: true,
					eventos: { where: { tipo: "AULA" }, select: { data: true } },
					alunos: {
						where: { aluno: { semestreId } },
						select: { aluno: { select: { id: true, nome: true } } },
					},
					monitores: {
						where: { user: { role: "MONITOR" } },
						select: { user: { select: { id: true, nome: true } } },
					},
					professores: {
						where: { user: { role: { in: ["PROFESSOR", "DIRETOR"] } } },
						select: { user: { select: { id: true, nome: true, role: true } } },
					},
				},
			},
		},
	});
	if (!semestre)
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Semestre não encontrado.",
		});
	return semestre;
}

type Turma = Awaited<ReturnType<typeof dadosDoSemestre>>["turmas"][number];

function pessoasDaTurma(
	turma: Turma,
	tipo: Tipo,
): { id: string; nome: string; perfil: Perfil; grupo: Grupo }[] {
	const pessoas =
		tipo === "alunos"
			? turma.alunos.map(({ aluno }) => ({
					...aluno,
					perfil: "Aluno" as const,
					grupo: "alunos" as const,
				}))
			: [
					...turma.monitores.map(({ user }) => ({
						...user,
						perfil: "Monitor" as const,
						grupo: "monitores" as const,
					})),
					...turma.professores.map(({ user }) => ({
						id: user.id,
						nome: user.nome,
						perfil:
							user.role === "DIRETOR"
								? ("Diretor docente" as const)
								: ("Professor" as const),
						grupo: "professores" as const,
					})),
				];
	return pessoas.sort((a, b) =>
		a.perfil === "Monitor" && b.perfil !== "Monitor"
			? -1
			: b.perfil === "Monitor" && a.perfil !== "Monitor"
				? 1
				: a.nome.localeCompare(b.nome, "pt-BR"),
	);
}

function diasDaTurma(turma: Turma) {
	return [
		...new Set(turma.eventos.map(({ data }) => diaCalendario(data))),
	].sort();
}

export async function baixarModeloPresencas(
	db: PrismaClient,
	semestreId: string,
	tipo: Tipo,
) {
	const semestre = await dadosDoSemestre(db, semestreId);
	if (!semestre.turmas.length)
		erroPlanilha("O semestre selecionado ainda não tem turmas.");

	const livro = XLSX.utils.book_new();
	const abas = semestre.turmas.map((turma, indice) => {
		const dias = diasDaTurma(turma);
		const pessoas = pessoasDaTurma(turma, tipo);
		const legenda = !dias.length
			? "Esta turma não tem aulas cadastradas."
			: !pessoas.length
				? "Esta turma não tem pessoas vinculadas a este modelo."
				: "1 Presente · 0 Falta · J Justificado · Vazio mantém a chamada.";
		const aba = XLSX.utils.aoa_to_sheet([
			[turma.id, turma.titulo, semestre.codigo],
			[assinatura + tipo, legenda, "", ""],
			[
				semestreId,
				"Nome",
				"Perfil",
				...dias.map(
					(dia) => Date.parse(`${dia}T00:00:00Z`) / 86_400_000 + 25_569,
				),
			],
			...pessoas.map(({ id, nome, perfil }) => [
				id,
				nome,
				perfil,
				...dias.map(() => ""),
			]),
		]);
		for (const [c] of dias.entries()) {
			const celula = aba[XLSX.utils.encode_cell({ r: 2, c: c + 3 })];
			if (celula) celula.z = formatoData;
		}
		aba["!cols"] = [
			{ hidden: true },
			{
				wch: Math.min(
					65,
					Math.max(
						46,
						turma.titulo.length + 8,
						...pessoas.map(({ nome }) => nome.length + 6),
					),
				),
			},
			{ wch: 19 },
			...dias.map(() => ({ wch: 14 })),
		];
		aba["!rows"] = [{ hpt: 26 }, { hpt: 22 }, { hpt: 22 }];
		aba["!merges"] = [XLSX.utils.decode_range("B2:C2")];
		const nomeAba =
			`${indice + 1} ${turma.titulo.replace(/[\\/:?*[\]']/g, " ")}`
				.trim()
				.slice(0, 31);
		XLSX.utils.book_append_sheet(livro, aba, nomeAba);
		return {
			totalDatas: dias.length,
			perfis: pessoas.map(({ perfil }) => perfil),
		};
	});

	return {
		arquivoBase64: escreverPlanilhaDeChamada(livro, abas).toString("base64"),
		nomeArquivo: `Chamada_${tipo}_${semestre.codigo}.xlsx`,
	};
}

function diaDaColuna(celula: XLSX.CellObject | undefined, date1904?: boolean) {
	if (celula?.f || typeof celula?.v !== "number") return undefined;
	const data = XLSX.SSF.parse_date_code(celula.v, { date1904 });
	if (!data) return undefined;
	return `${data.y}-${String(data.m).padStart(2, "0")}-${String(data.d).padStart(2, "0")}`;
}

const estados: Record<string, Estado> = {
	"1": "PRESENTE",
	p: "PRESENTE",
	presente: "PRESENTE",
	"0": "AUSENTE",
	a: "AUSENTE",
	f: "AUSENTE",
	falta: "AUSENTE",
	ausente: "AUSENTE",
	j: "JUSTIFICADO",
	justificado: "JUSTIFICADO",
	"falta justificada": "JUSTIFICADO",
};

function lerPlanilha(arquivoBase64: string) {
	const bytes = Buffer.from(arquivoBase64, "base64");
	if (bytes.subarray(0, 4).toString("hex") !== "504b0304")
		erroPlanilha(formatoInvalido);
	try {
		const livro = XLSX.read(bytes, { type: "buffer", cellFormula: true });
		if (livro.SheetNames.length) return livro;
	} catch {
		erroPlanilha(
			"Não foi possível ler o arquivo XLSX. Abra e salve a planilha no Excel ou no LibreOffice.",
		);
	}
	return erroPlanilha(formatoInvalido);
}

function validarMarcacoes(
	livro: XLSX.WorkBook,
	semestre: Awaited<ReturnType<typeof dadosDoSemestre>>,
	semestreId: string,
) {
	const turmas = new Map(semestre.turmas.map((turma) => [turma.id, turma]));
	const turmasDaPlanilha = new Set<string>();
	const diasMarcados: MarcacoesDaTurma[] = [];
	const turmasComMarcacao = new Set<string>();
	const hoje = diaCalendario(new Date());
	let tipoPlanilha: Tipo | undefined;
	let totalMarcacoes = 0;

	for (const nome of livro.SheetNames) {
		const aba = livro.Sheets[nome];
		if (!aba?.["!ref"]) erroPlanilha(formatoInvalido);
		const marcador = aba.A2?.v;
		const tipo =
			typeof marcador === "string" && marcador.startsWith(assinatura)
				? tipoPlanilhaPresencas.safeParse(marcador.slice(assinatura.length))
				: undefined;
		if (!tipo?.success || (tipoPlanilha && tipo.data !== tipoPlanilha))
			erroPlanilha(
				`A aba “${nome}” não pertence a este modelo. ${formatoInvalido}`,
			);
		tipoPlanilha = tipo.data;
		if (aba.A3?.v !== semestreId)
			erroPlanilha(
				`A aba “${nome}” é de outro semestre. Selecione o semestre correto antes de importar.`,
			);
		const turmaId = aba.A1?.v;
		const turma = typeof turmaId === "string" ? turmas.get(turmaId) : undefined;
		if (!turma || turmasDaPlanilha.has(turma.id))
			erroPlanilha(
				`A aba “${nome}” tem uma turma inválida ou repetida. Baixe um modelo atualizado.`,
			);
		turmasDaPlanilha.add(turma.id);

		const pessoas = new Map(
			pessoasDaTurma(turma, tipoPlanilha).map((pessoa) => [pessoa.id, pessoa]),
		);
		const calendario = new Set(diasDaTurma(turma));
		const chamadas = new Map<string, MarcacoesDaTurma>();
		const pessoasMarcadas = new Set<string>();
		const { e: fim } = XLSX.utils.decode_range(aba["!ref"]);
		if (fim.r > 1_000 || fim.c > 370)
			erroPlanilha(
				`A aba “${nome}” tem linhas ou colunas fora do modelo. Baixe uma cópia nova.`,
			);

		const datas = Array.from({ length: Math.max(0, fim.c - 2) }, (_, index) =>
			diaDaColuna(
				aba[XLSX.utils.encode_cell({ r: 2, c: index + 3 })],
				livro.Workbook?.WBProps?.date1904,
			),
		);
		const datasValidas = datas.filter(Boolean);
		if (new Set(datasValidas).size !== datasValidas.length)
			erroPlanilha(`A aba “${nome}” tem uma data de aula repetida.`);
		for (let r = 3; r <= fim.r; r++) {
			const celula = (c: number) =>
				aba[XLSX.utils.encode_cell({ r, c })] as XLSX.CellObject | undefined;
			const id = celula(0)?.v;
			const pessoa = typeof id === "string" ? pessoas.get(id) : undefined;
			let linhaMarcada = false;
			for (const [index, dia] of datas.entries()) {
				const codigo = celula(index + 3);
				if (
					!codigo?.f &&
					(codigo?.v == null ||
						(typeof codigo.v === "string" && !codigo.v.trim()))
				)
					continue;
				const local = `“${nome}” · ${XLSX.utils.encode_cell({ r, c: index + 3 })}`;
				const chave =
					typeof codigo?.v === "number" || typeof codigo?.v === "string"
						? normalizarBusca(String(codigo.v))
						: "";
				const estado = Object.hasOwn(estados, chave)
					? estados[chave]
					: undefined;
				if (!estado || codigo?.f || codigo?.t === "e")
					erroPlanilha(`${local}: use 1, 0 ou J.`);
				if (!dia || !calendario.has(dia))
					erroPlanilha(
						`${local}: a coluna não corresponde a uma aula cadastrada nesta turma.`,
					);
				if (dia > hoje) erroPlanilha(`${local}: a aula ainda não ocorreu.`);
				if (
					!pessoa ||
					celula(2)?.v !== pessoa.perfil ||
					normalizarBusca(String(celula(1)?.v ?? "")) !==
						normalizarBusca(pessoa.nome)
				)
					erroPlanilha(
						`${local}: pessoa ou perfil não corresponde ao vínculo da turma. Baixe um modelo atualizado.`,
					);
				if (!linhaMarcada && pessoasMarcadas.has(pessoa.id))
					erroPlanilha(
						`${local}: a mesma pessoa foi marcada em duas linhas da aba.`,
					);
				linhaMarcada = true;
				pessoasMarcadas.add(pessoa.id);
				let chamada = chamadas.get(dia);
				if (!chamada) {
					chamada = {
						turmaId: turma.id,
						data: new Date(`${dia}T12:00:00Z`),
						alunos: [],
						monitores: [],
						professores: [],
					};
					chamadas.set(dia, chamada);
				}
				chamada[pessoa.grupo].push({ id: pessoa.id, estado });
				totalMarcacoes++;
			}
		}
		if (chamadas.size) turmasComMarcacao.add(turma.id);
		diasMarcados.push(...chamadas.values());
	}

	if (!totalMarcacoes)
		erroPlanilha(
			"A planilha está sem marcações. Preencha ao menos uma presença, falta ou justificativa.",
		);
	return { diasMarcados, totalMarcacoes, totalTurmas: turmasComMarcacao.size };
}

export async function importarPlanilhaPresencas(
	db: PrismaClient,
	semestreId: string,
	arquivoBase64: string,
) {
	const livro = lerPlanilha(arquivoBase64);
	return transacaoPresencas(
		db,
		async (tx) => {
			const semestre = await dadosDoSemestre(tx, semestreId);
			const { diasMarcados, totalMarcacoes, totalTurmas } = validarMarcacoes(
				livro,
				semestre,
				semestreId,
			);
			diasMarcados.sort(
				(a, b) =>
					a.turmaId.localeCompare(b.turmaId) ||
					a.data.getTime() - b.data.getTime(),
			);
			for (const chamada of diasMarcados)
				await salvarMarcacoesDaTurma(tx, chamada);
			return {
				totalMarcacoes,
				totalTurmas,
				totalChamadas: diasMarcados.length,
			};
		},
		60_000,
	);
}
