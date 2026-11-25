"use client";

import { useRef, useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import { api, type RouterOutputs } from "~/trpc/react";
import { lerAlunosPlanilha } from "./ler-alunos-planilha";
import { encontrarTurmaDaPlanilha } from "./mapeamento-turmas-importacao";
import type { Aluno } from "./suporte";

type SugestaoTurmaImportacao = {
	turmaPlanilha: string;
	turmaId: string | null;
	turmaSistema: string | null;
	confianca: number;
	totalAlunos: number;
};

export function useImportarAlunos({
	semestreId,
	semestreFiltro,
	turmasDb,
}: {
	semestreId: string | undefined;
	semestreFiltro: string;
	turmasDb: RouterOutputs["diretoria"]["turmas"]["list"] | undefined;
}) {
	const utils = api.useUtils();
	const importarAlunos = api.aluno.import.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const [isImportModalOpen, setIsImportModalOpen] = useState(false);
	const [alunosParaImportar, setAlunosParaImportar] = useState<Aluno[]>([]);
	const [alunosSelecionadosImportacao, setAlunosSelecionadosImportacao] =
		useState<string[]>([]);
	const [turmaIdsImportacao, setTurmaIdsImportacao] = useState<string[]>([]);
	const [vinculosImportacao, setVinculosImportacao] = useState<
		Array<{ alunoIds: string[]; turmaIds: string[] }>
	>([]);
	const [avisosVinculoImportacao, setAvisosVinculoImportacao] = useState<
		Array<{ alunoId: string; turmaId: string }>
	>([]);
	const [sugestoesTurmaImportacao, setSugestoesTurmaImportacao] = useState<
		SugestaoTurmaImportacao[]
	>([]);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const processImportedData = (lines: unknown[][]) => {
		if (lines.length < 2) {
			alert(
				"Dados inválidos. Certifique-se de que a planilha possui cabeçalho e pelo menos uma linha de dados.",
			);
			return;
		}

		const newAlunos = lerAlunosPlanilha(lines, semestreFiltro);

		if (!semestreId) {
			alert("Nenhum semestre disponível para receber a importação.");
			return;
		}
		if (!turmasDb) {
			alert(
				"As turmas do semestre ainda estão carregando. Aguarde um instante e selecione a planilha novamente.",
			);
			return;
		}
		if (!newAlunos.length) {
			alert(
				"Nenhum aluno válido foi encontrado na planilha. Verifique se há linhas preenchidas e se a coluna de nome usa o cabeçalho esperado.",
			);
			return;
		}

		const obrigatorios: { campo: keyof Aluno; nome: string }[] = [
			{ campo: "nome", nome: "Nome" },
			{ campo: "dataNascimento", nome: "Data de nascimento" },
			{ campo: "cpf", nome: "CPF" },
			{ campo: "corRaca", nome: "Cor ou raça" },
			{ campo: "identidadeGenero", nome: "Identidade de gênero" },
			{ campo: "lgbtqiapn", nome: "LGBTQIAPN+" },
			{ campo: "escolaridade", nome: "Escolaridade" },
			{ campo: "cuidaTerceiros", nome: "Cuida de terceiros" },
			{ campo: "trabalha", nome: "Trabalha" },
			{ campo: "estuda", nome: "Estuda" },
			{ campo: "problemaSaude", nome: "Problema de saúde" },
			{ campo: "necessidadeEspecial", nome: "Necessidade especial" },
			{ campo: "acessoInternet", nome: "Acesso à internet" },
			{ campo: "temComputador", nome: "Computador" },
			{ campo: "temSmartphone", nome: "Smartphone" },
		];
		const erroLinha = newAlunos
			.map((aluno, index) => {
				const ausentes = obrigatorios
					.filter(({ campo }) => !String(aluno[campo] ?? "").trim())
					.map(({ nome }) => nome);
				return ausentes.length ? { index, ausentes } : null;
			})
			.find(Boolean);
		if (erroLinha) {
			const detalhes = [
				erroLinha.ausentes.length
					? `campos ausentes: ${erroLinha.ausentes.join(", ")}`
					: "",
			]
				.filter(Boolean)
				.join("; ");
			alert(`Linha ${erroLinha.index + 2}: ${detalhes}.`);
			return;
		}

		const sugestoes = new Map<string, SugestaoTurmaImportacao>();
		const vinculosAutomaticos = new Map<string, string[]>();
		for (const aluno of newAlunos) {
			const turmaPlanilha = aluno.turma.trim();
			if (!turmaPlanilha) continue;
			const correspondencia = encontrarTurmaDaPlanilha(turmaPlanilha, turmasDb);
			const encontrouTurma = Boolean(correspondencia.turma);
			const chave = turmaPlanilha.toLocaleLowerCase("pt-BR");
			const anterior = sugestoes.get(chave);
			sugestoes.set(chave, {
				turmaPlanilha,
				turmaId: correspondencia.turma?.id ?? null,
				turmaSistema: correspondencia.turma?.titulo ?? null,
				confianca: correspondencia.confianca,
				totalAlunos: (anterior?.totalAlunos ?? 0) + 1,
			});
			if (encontrouTurma && correspondencia.turma)
				vinculosAutomaticos.set(correspondencia.turma.id, [
					...(vinculosAutomaticos.get(correspondencia.turma.id) ?? []),
					aluno.id,
				]);
		}

		setAlunosParaImportar(newAlunos);
		setAlunosSelecionadosImportacao([]);
		setTurmaIdsImportacao([]);
		setVinculosImportacao(
			[...vinculosAutomaticos.entries()].map(([turmaId, alunoIds]) => ({
				alunoIds,
				turmaIds: [turmaId],
			})),
		);
		setAvisosVinculoImportacao([]);
		setSugestoesTurmaImportacao([...sugestoes.values()]);
	};

	const confirmarImportacao = () => {
		if (!semestreId || !alunosParaImportar.length) return;
		const turmaPorAluno = new Map<string, string>();
		for (const vinculo of vinculosImportacao) {
			for (const alunoId of vinculo.alunoIds) {
				const turmaId = vinculo.turmaIds[0];
				if (turmaId) turmaPorAluno.set(alunoId, turmaId);
			}
		}
		importarAlunos.mutate(
			{
				semestreId,
				alunos: alunosParaImportar.map((aluno) => {
					const turmaId = turmaPorAluno.get(aluno.id);
					return {
						nome: aluno.nome.trim(),
						dataNascimento: new Date(`${aluno.dataNascimento}T12:00:00`),
						cpf: aluno.cpf.replace(/\D/g, ""),
						corRaca: aluno.corRaca.trim(),
						identidadeGenero: aluno.identidadeGenero.trim(),
						lgbtqiapn: aluno.lgbtqiapn.trim(),
						telefone: aluno.telefone?.trim() || null,
						contatoEmergencia: aluno.contatoEmergencia?.trim() || null,
						email: aluno.email?.trim() || null,
						escolaridade: aluno.escolaridade.trim(),
						cuidaTerceiros: aluno.cuidaTerceiros === "Sim",
						trabalha: aluno.trabalha === "Sim",
						trabalhoLocal: aluno.trabalhoLocal || null,
						trabalhoFuncao: aluno.trabalhoFuncao || null,
						estuda: aluno.estuda === "Sim",
						estudoLocal: aluno.estudoLocal || null,
						estudoCurso: aluno.estudoCurso || null,
						problemaSaude: aluno.problemaSaude === "Sim",
						problemaSaudeQual: aluno.problemaSaudeQual || null,
						necessidadeEspecial: aluno.necessidadeEspecial === "Sim",
						necessidadeEspecialQual: aluno.necessidadeEspecialQual || null,
						acessoInternet: aluno.acessoInternet === "Sim",
						temComputador: aluno.temComputador === "Sim",
						temSmartphone: aluno.temSmartphone === "Sim",
						sistemaSmartphone: aluno.sistemaSmartphone || null,
						turmaIds: turmaId ? [turmaId] : [],
					};
				}),
			},
			{
				onSuccess: (result) => {
					setIsImportModalOpen(false);
					setAlunosParaImportar([]);
					alert(
						`${result.total} aluno(s) importado(s) com sucesso.${result.ignorados ? ` ${result.ignorados} linha(s) duplicada(s) foram ignoradas.` : ""}`,
					);
				},
				onError: (error) =>
					alert(`A importação não foi salva: ${error.message}`),
			},
		);
	};
	const alternarSelecaoImportacao = (alunoId: string) =>
		setAlunosSelecionadosImportacao((ids) =>
			ids.includes(alunoId)
				? ids.filter((id) => id !== alunoId)
				: [...ids, alunoId],
		);
	const alternarTurmaImportacao = (turmaId: string) =>
		setTurmaIdsImportacao((ids) => (ids[0] === turmaId ? [] : [turmaId]));
	const adicionarVinculoImportacao = () => {
		if (!alunosSelecionadosImportacao.length || !turmaIdsImportacao.length)
			return;
		const turmaSelecionada = turmaIdsImportacao[0];
		if (!turmaSelecionada) return;
		const turmaAtualPorAluno = new Map<string, string>();
		for (const vinculo of vinculosImportacao) {
			const turmaId = vinculo.turmaIds[0];
			if (!turmaId) continue;
			for (const alunoId of vinculo.alunoIds)
				turmaAtualPorAluno.set(alunoId, turmaId);
		}
		const substituidos = alunosSelecionadosImportacao.flatMap((alunoId) => {
			const turmaAnterior = turmaAtualPorAluno.get(alunoId);
			return turmaAnterior && turmaAnterior !== turmaSelecionada
				? [{ alunoId, turmaId: turmaAnterior }]
				: [];
		});
		for (const alunoId of alunosSelecionadosImportacao)
			turmaAtualPorAluno.set(alunoId, turmaSelecionada);
		const alunosPorTurma = new Map<string, string[]>();
		for (const [alunoId, turmaId] of turmaAtualPorAluno) {
			alunosPorTurma.set(turmaId, [
				...(alunosPorTurma.get(turmaId) ?? []),
				alunoId,
			]);
		}
		setVinculosImportacao(
			[...alunosPorTurma].map(([turmaId, alunoIds]) => ({
				alunoIds,
				turmaIds: [turmaId],
			})),
		);
		setAvisosVinculoImportacao(substituidos);
		setAlunosSelecionadosImportacao([]);
		setTurmaIdsImportacao([]);
	};

	const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (evt) => {
			try {
				const bstr = evt.target?.result;
				const wb = XLSX.read(bstr, { type: "binary", cellDates: true });
				const wsname = wb.SheetNames[0];
				if (!wsname) {
					alert("A planilha selecionada está vazia.");
					return;
				}
				const ws = wb.Sheets[wsname];
				if (!ws) {
					alert("A aba da planilha está inacessível.");
					return;
				}

				// Converte a aba da planilha para um array de arrays
				const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as unknown[][];

				processImportedData(data);
			} catch (err) {
				console.error(err);
				alert("Erro ao ler o arquivo Excel. Verifique se o formato é válido.");
			}
		};
		reader.readAsBinaryString(file);

		// Limpar o input para permitir enviar o mesmo arquivo novamente se necessário
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return {
		setIsImportModalOpen,
		isImportModalOpen,
		alunosParaImportar,
		alunosSelecionadosImportacao,
		turmaIdsImportacao,
		vinculosImportacao,
		avisosVinculoImportacao,
		sugestoesTurmaImportacao,
		alternarSelecaoImportacao,
		alternarTurmaImportacao,
		adicionarVinculoImportacao,
		confirmarImportacao,
		fileInputRef,
		handleFileUpload,
		importandoAlunos: importarAlunos.isPending,
	};
}
