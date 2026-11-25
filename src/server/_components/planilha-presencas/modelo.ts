import * as XLSX from "xlsx";
import { escreverPlanilhaDeChamada } from "~/server/planilha-chamada-xlsx";
import type { PrismaClient } from "../../../../generated/prisma";
import {
	assinatura,
	erroPlanilha,
	dadosDoSemestre,
	pessoasDaTurma,
	diasDaTurma,
	formatoData,
	type Tipo,
} from "./suporte";

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
