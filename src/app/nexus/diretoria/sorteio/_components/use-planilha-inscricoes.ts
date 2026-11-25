"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { api, type RouterOutputs } from "~/trpc/react";
import {
	type Candidato,
	CABECALHOS_PLANILHA,
	cursoDaPlanilha,
	dataDaPlanilha,
	dataDoCampo,
	formatarCpf,
	textoDaPlanilha,
	valorDaLinha,
} from "./suporte";

export function usePlanilhaInscricoes(
	semestreSelecionado:
		| RouterOutputs["diretoria"]["semestres"]["list"][number]
		| undefined,
	candidatos: Candidato[],
) {
	const utils = api.useUtils();
	const importar = api.diretoria.candidatos.importMany.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const inputImportacaoRef = useRef<HTMLInputElement>(null);
	const [importando, setImportando] = useState(false);
	const [resultadoImportacao, setResultadoImportacao] = useState<{
		tipo: "sucesso" | "erro";
		texto: string;
	} | null>(null);

	const exportarInscricoes = async () => {
		if (!semestreSelecionado) return;

		const XLSX = await import("xlsx");
		const linhas = candidatos.map((candidato) => ({
			[CABECALHOS_PLANILHA[0]!]: new Date(candidato.criadoEm),
			[CABECALHOS_PLANILHA[1]!]: candidato.nome,
			[CABECALHOS_PLANILHA[2]!]: candidato.ficha,
			[CABECALHOS_PLANILHA[3]!]: dataDoCampo(candidato.dataNascimento),
			[CABECALHOS_PLANILHA[4]!]: formatarCpf(candidato.cpf),
			[CABECALHOS_PLANILHA[5]!]: candidato.telefone,
			[CABECALHOS_PLANILHA[6]!]: candidato.emergencia,
			[CABECALHOS_PLANILHA[7]!]: candidato.curso,
		}));
		const planilha = XLSX.utils.json_to_sheet(linhas, {
			header: CABECALHOS_PLANILHA,
		});
		planilha["!cols"] = [
			{ wch: 22 },
			{ wch: 34 },
			{ wch: 16 },
			{ wch: 18 },
			{ wch: 16 },
			{ wch: 22 },
			{ wch: 35 },
			{ wch: 34 },
		];
		for (let linha = 2; linha <= linhas.length + 1; linha += 1) {
			if (planilha[`A${linha}`]) planilha[`A${linha}`].z = "dd/mm/yyyy hh:mm";
			if (planilha[`D${linha}`]) planilha[`D${linha}`].z = "dd/mm/yyyy";
		}
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Inscrições");
		const codigo = semestreSelecionado.codigo.replace(/[^a-zA-Z0-9_-]+/g, "_");
		XLSX.writeFile(arquivo, `Controle_de_Inscricoes_${codigo}.xlsx`, {
			compression: true,
		});
	};

	const importarInscricoes = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestreSelecionado) return;
		setResultadoImportacao(null);

		try {
			setImportando(true);
			const XLSX = await import("xlsx");
			const livro = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				cellDates: true,
			});
			const primeiraAba = livro.SheetNames[0];
			if (!primeiraAba || !livro.Sheets[primeiraAba])
				throw new Error("A planilha não possui uma aba com dados.");
			const linhas = XLSX.utils.sheet_to_json<Record<string, unknown>>(
				livro.Sheets[primeiraAba],
				{ defval: "", raw: true },
			);
			if (!linhas.length)
				throw new Error("A planilha não possui inscrições para importar.");

			const erros: string[] = [];
			const registros = linhas.flatMap((linha, indice) => {
				const nome = textoDaPlanilha(valorDaLinha(linha, ["Nome Completo"]));
				const ficha = textoDaPlanilha(
					valorDaLinha(linha, ["Número da ficha", "Numero da ficha"]),
				);
				const dataNascimento = dataDaPlanilha(
					valorDaLinha(linha, ["Data de Nascimento"]),
				);
				const cpf = textoDaPlanilha(valorDaLinha(linha, ["CPF"])).replace(
					/\D/g,
					"",
				);
				const telefone = textoDaPlanilha(
					valorDaLinha(linha, ["Telefone para Contato", "Telefone Pessoal"]),
				);
				const emergencia = textoDaPlanilha(
					valorDaLinha(linha, [
						"Contato de Emergência",
						"Contato de Emergencia",
					]),
				);
				const curso = cursoDaPlanilha(
					valorDaLinha(linha, [
						"Curso de interesse - Apenas uma opção",
						"Curso de Interesse",
					]),
				);
				const createdAt = dataDaPlanilha(
					valorDaLinha(linha, ["Carimbo de data/hora"]),
				);

				if (
					!nome ||
					!ficha ||
					!dataNascimento ||
					cpf.length !== 11 ||
					telefone.length < 8 ||
					emergencia.length < 8 ||
					!curso
				) {
					erros.push(`linha ${indice + 2}`);
					return [];
				}
				return [
					{
						ficha,
						nome,
						dataNascimento,
						cpf,
						telefone,
						emergencia,
						curso,
						...(createdAt ? { createdAt } : {}),
					},
				];
			});

			if (!registros.length)
				throw new Error(
					`Nenhuma linha válida foi encontrada. Revise ${erros.slice(0, 8).join(", ")}.`,
				);
			const resultado = await importar.mutateAsync({
				semestreId: semestreSelecionado.id,
				registros,
			});
			const invalidas = erros.length
				? ` ${erros.length} linha(s) inválida(s) não foram importadas.`
				: "";
			setResultadoImportacao({
				tipo: "sucesso",
				texto: `${resultado.criados} inscrição(ões) importada(s). ${resultado.ignorados} já existia(m) neste semestre.${invalidas}`,
			});
		} catch (erro) {
			setResultadoImportacao({
				tipo: "erro",
				texto:
					erro instanceof Error
						? erro.message
						: "Não foi possível importar a planilha.",
			});
		} finally {
			setImportando(false);
		}
	};

	return {
		inputImportacaoRef,
		importarInscricoes,
		importando,
		exportarInscricoes,
		resultadoImportacao,
	};
}
