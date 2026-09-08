"use client";
import React, { useRef, useState } from "react";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
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

export function useGerenciarSorteio() {
	const utils = api.useUtils();
	const { data: semestres, isLoading: carregandoSemestres } =
		api.diretoria.semestres.list.useQuery();
	const [semestreId, setSemestreId] = useState("");
	const semestreSelecionado =
		semestres?.find((semestre) => semestre.id === semestreId) ??
		semestres?.find((semestre) => semestre.ativo) ??
		semestres?.[0];
	const { data: candidatosDb, isLoading: carregandoCandidatos } =
		api.diretoria.candidatos.list.useQuery(
			{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
			{ enabled: Boolean(semestreSelecionado) },
		);
	const criar = api.diretoria.candidatos.create.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const atualizar = api.diretoria.candidatos.update.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const remover = api.diretoria.candidatos.remove.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const importar = api.diretoria.candidatos.importMany.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const candidatos = (candidatosDb ?? []).map((candidato) => ({
		...candidato,
		dataNascimento: candidato.dataNascimento.toISOString().slice(0, 10),
		criadoEm: candidato.createdAt.toISOString(),
		curso:
			candidato.curso === "SMARTPHONE"
				? ("Smartphone" as const)
				: ("Computador" as const),
	}));
	const [busca, setBusca] = useState("");
	const inputImportacaoRef = useRef<HTMLInputElement>(null);
	const [importando, setImportando] = useState(false);
	const [resultadoImportacao, setResultadoImportacao] = useState<{
		tipo: "sucesso" | "erro";
		texto: string;
	} | null>(null);

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [candidatoEditando, setCandidatoEditando] = useState<Candidato | null>(
		null,
	);

	// Estado do formulário
	const [form, setForm] = useState<Omit<Candidato, "id" | "criadoEm">>({
		ficha: "",
		nome: "",
		dataNascimento: "",
		cpf: "",
		telefone: "",
		emergencia: "",
		curso: "Smartphone",
	});

	// Filtros e Separação
	const buscaNormalizada = normalizarBusca(busca);
	const candidatosFiltrados = candidatos.filter(
		(candidato) =>
			!buscaNormalizada ||
			normalizarBusca(candidato.nome).includes(buscaNormalizada) ||
			candidato.ficha.includes(busca.trim()),
	);

	const listaSmartphone = candidatosFiltrados.filter(
		(c) => c.curso === "Smartphone",
	);
	const listaComputador = candidatosFiltrados.filter(
		(c) => c.curso === "Computador",
	);

	// Ações do CRUD
	const abrirModalNovo = () => {
		setForm({
			ficha: "",
			nome: "",
			dataNascimento: "",
			cpf: "",
			telefone: "",
			emergencia: "",
			curso: "Smartphone",
		});
		setCandidatoEditando(null);
		setIsModalOpen(true);
	};

	const abrirModalEdicao = (candidato: Candidato) => {
		const { id: _id, criadoEm: _criadoEm, ...dados } = candidato;
		setForm(dados);
		setCandidatoEditando(candidato);
		setIsModalOpen(true);
	};

	const excluirCandidato = (id: string) => {
		if (confirm("Tem certeza que deseja remover este candidato do sorteio?")) {
			if (semestreSelecionado)
				remover.mutate({ id, semestreId: semestreSelecionado.id });
		}
	};

	const salvarCandidato = (e: React.FormEvent) => {
		e.preventDefault();

		if (!semestreSelecionado) return;
		const dados = {
			semestreId: semestreSelecionado.id,
			ficha: form.ficha,
			nome: form.nome,
			dataNascimento: new Date(`${form.dataNascimento}T12:00:00`),
			cpf: form.cpf.replace(/\D/g, ""),
			telefone: form.telefone,
			emergencia: form.emergencia,
			curso:
				form.curso === "Smartphone"
					? ("SMARTPHONE" as const)
					: ("COMPUTADOR" as const),
		};
		const opcoes = {
			onSuccess: () => setIsModalOpen(false),
			onError: (erro: { message: string }) =>
				alert(`Não foi possível salvar a ficha: ${erro.message}`),
		};
		if (candidatoEditando)
			atualizar.mutate({ ...dados, id: candidatoEditando.id }, opcoes);
		else criar.mutate(dados, opcoes);
	};

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

	const importarInscricoes = async (
		evento: React.ChangeEvent<HTMLInputElement>,
	) => {
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
		candidatos,
		importando,
		semestreSelecionado,
		exportarInscricoes,
		resultadoImportacao,
		setSemestreId,
		semestres,
		busca,
		setBusca,
		abrirModalNovo,
		listaSmartphone,
		carregandoSemestres,
		carregandoCandidatos,
		abrirModalEdicao,
		excluirCandidato,
		listaComputador,
		isModalOpen,
		setIsModalOpen,
		candidatoEditando,
		salvarCandidato,
		form,
		setForm,
	};
}
