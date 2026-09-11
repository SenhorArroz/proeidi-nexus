"use client";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { useAccessibility } from "~/app/_components/accessibility-preferences";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
import { type Aluno, downloadBase64Pdf, formatarCpf } from "./suporte";

type SugestaoTurmaImportacao = {
	turmaPlanilha: string;
	turmaId: string | null;
	turmaSistema: string | null;
	confianca: number;
	totalAlunos: number;
};

const PALAVRAS_GENERICAS_TURMA = new Set([
	"a",
	"ao",
	"basica",
	"basico",
	"curso",
	"da",
	"de",
	"do",
	"em",
	"introducao",
	"na",
	"no",
	"o",
	"para",
]);

function normalizarNomeTurma(valor: string) {
	return valor
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/\([^)]*\)/g, " ")
		.replace(/turma\s*0*(\d+)/g, "t$1")
		.replace(/\bt\s*0*(\d+)\b/g, "t$1");
}

function tokensDaTurma(valor: string) {
	return new Set(
		(normalizarNomeTurma(valor).match(/[a-z]+\d*|\d+/g) ?? [])
			.filter(
				(token) =>
					!PALAVRAS_GENERICAS_TURMA.has(token) && !/^t0*\d+$/.test(token),
			),
	);
}

function codigoDaTurma(valor: string) {
	const codigo = normalizarNomeTurma(valor).match(/\bt(\d+)\b/);
	return codigo ? Number(codigo[1]) : null;
}

function nivelDaTurma(valor: string) {
	const normalizado = normalizarNomeTurma(valor);
	if (/\bavancad[oa]?\b/.test(normalizado)) return "AVANCADO";
	if (/\b(introducao|basico|basica|iniciante)\b/.test(normalizado))
		return "BASICO";
	return null;
}

function pontuarSemelhancaTurma(origem: string, destino: string) {
	const origemTokens = tokensDaTurma(origem);
	const destinoTokens = tokensDaTurma(destino);
	const emComum = [...origemTokens].filter((token) => destinoTokens.has(token));
	const limite = Math.max(origemTokens.size, destinoTokens.size, 1);
	let nota = (emComum.length / limite) * 0.65;
	const codigoOrigem = codigoDaTurma(origem);
	const codigoDestino = codigoDaTurma(destino);
	if (codigoOrigem !== null && codigoDestino !== null)
		nota += codigoOrigem === codigoDestino ? 0.2 : -0.55;
	const nivelOrigem = nivelDaTurma(origem);
	const nivelDestino = nivelDaTurma(destino);
	if (nivelOrigem && nivelDestino)
		nota += nivelOrigem === nivelDestino ? 0.15 : -0.55;
	if (normalizarNomeTurma(destino).includes(normalizarNomeTurma(origem)))
		nota += 0.1;
	return Math.max(0, Math.min(1, nota));
}

export function useGerenciarAlunos() {
	const { theme } = useAccessibility();
	const utils = api.useUtils();
	const [semestreFiltro, setSemestreFiltro] = useState<string>("2026.1");
	const [busca, setBusca] = useState("");
	const { data: semestresDb, isLoading: carregandoSemestres } =
		api.diretoria.semestres.list.useQuery();
	const semestreSelecionado =
		semestresDb?.find((s) => s.codigo === semestreFiltro) ??
		semestresDb?.find((s) => s.ativo) ??
		semestresDb?.[0];
	const { data: alunosDb, isLoading: carregandoAlunos } =
		api.aluno.list.useQuery(
			{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
			{ enabled: Boolean(semestreSelecionado) },
		);
	const { data: turmasDb, isLoading: carregandoTurmas } =
		api.diretoria.turmas.list.useQuery(
			semestreSelecionado ? { semestreId: semestreSelecionado.id } : undefined,
			{ enabled: Boolean(semestreSelecionado) },
		);
	const criarAluno = api.aluno.create.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const atualizarAluno = api.aluno.update.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const removerAluno = api.aluno.remove.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const importarAlunos = api.aluno.import.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const vincularTurmasEmLote = api.aluno.vincularTurmasEmLote.useMutation({
		onSuccess: async () => {
			await Promise.all([
				utils.aluno.list.invalidate(),
				utils.diretoria.turmas.list.invalidate(),
			]);
		},
	});
	const [alunos, setAlunos] = useState<Aluno[]>([]);
	const [alunosParaContinuar, setAlunosParaContinuar] = useState<Aluno[]>([]);
	const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
	const [semestreDestinoId, setSemestreDestinoId] = useState("");
	const [turmaDestinoIds, setTurmaDestinoIds] = useState<string[]>([]);
	const [turmaIdsParaVinculo, setTurmaIdsParaVinculo] = useState<string[]>([]);
	const [isVinculoTurmasModalOpen, setIsVinculoTurmasModalOpen] =
		useState(false);
	const [etapaTrilha, setEtapaTrilha] = useState("");
	const semestreDestino = semestresDb?.find(
		(semestre) => semestre.id === semestreDestinoId,
	);
	const { data: turmasDestino } = api.diretoria.turmas.list.useQuery(
		semestreDestino ? { semestreId: semestreDestino.id } : undefined,
		{ enabled: Boolean(semestreDestino) },
	);
	const continuarAluno = api.diretoria.alunos.continuar.useMutation({
		onSuccess: () => {
			utils.aluno.list.invalidate();
			utils.diretoria.semestres.list.invalidate();
			setAlunosParaContinuar([]);
		},
		onError: (erro) =>
			alert(`Não foi possível continuar o aluno: ${erro.message}`),
	});

	// Controle de Geração de Certificados
	const [gerandoAlunoId, setGerandoAlunoId] = useState<string | null>(null);

	const gerarIndividualMutation = api.certificado.gerarIndividual.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || "Certificado.pdf",
			);
			setGerandoAlunoId(null);
		},
		onError: (err) => {
			alert(`Erro ao gerar certificado: ${err.message}`);
			setGerandoAlunoId(null);
		},
	});

	const gerarLoteMutation = api.certificado.gerarLote.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || `Certificados_${semestreFiltro}.pdf`,
			);
		},
		onError: (err) => {
			alert(`Erro ao gerar certificados em lote: ${err.message}`);
		},
	});

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [alunoEditando, setAlunoEditando] = useState<Aluno | null>(null);

	// Estado do formulário inicial
	const stateInicial: Aluno = {
		id: "",
		semestre: "2026.1",
		turma: "",
		nome: "",
		dataNascimento: "",
		cpf: "",
		corRaca: "",
		identidadeGenero: "",
		lgbtqiapn: "",
		telefone: "",
		contatoEmergencia: "",
		email: "",
		escolaridade: "",
		cuidaTerceiros: "",
		trabalha: "",
		estuda: "",
		problemaSaude: "",
		necessidadeEspecial: "",
		acessoInternet: "",
		temComputador: "",
		temSmartphone: "",
		sistemaSmartphone: "",
	};

	const [form, setForm] = useState<Aluno>(stateInicial);

	useEffect(() => {
		if (!alunosDb || !semestreSelecionado) return;
		setAlunos(
			alunosDb.map((a) => ({
				id: a.id,
				semestre: semestreSelecionado.codigo,
				turma: a.turmas.map((v) => v.turma.titulo).join(", "),
				nome: a.nome,
				dataNascimento: a.dataNascimento.toISOString().slice(0, 10),
				cpf: formatarCpf(a.cpf),
				corRaca: a.corRaca,
				identidadeGenero: a.identidadeGenero,
				lgbtqiapn: a.lgbtqiapn,
				telefone: a.telefone ?? "",
				contatoEmergencia: a.contatoEmergencia ?? "",
				email: a.email ?? "",
				escolaridade: a.escolaridade,
				cuidaTerceiros: a.cuidaTerceiros ? "Sim" : "Não",
				trabalha: a.trabalha ? "Sim" : "Não",
				trabalhoLocal: a.trabalhoLocal ?? "",
				trabalhoFuncao: a.trabalhoFuncao ?? "",
				estuda: a.estuda ? "Sim" : "Não",
				estudoLocal: a.estudoLocal ?? "",
				estudoCurso: a.estudoCurso ?? "",
				problemaSaude: a.problemaSaude ? "Sim" : "Não",
				problemaSaudeQual: a.problemaSaudeQual ?? "",
				necessidadeEspecial: a.necessidadeEspecial ? "Sim" : "Não",
				necessidadeEspecialQual: a.necessidadeEspecialQual ?? "",
				acessoInternet: a.acessoInternet ? "Sim" : "Não",
				temComputador: a.temComputador ? "Sim" : "Não",
				temSmartphone: a.temSmartphone ? "Sim" : "Não",
				sistemaSmartphone: a.sistemaSmartphone ?? "",
			})),
		);
	}, [alunosDb, semestreSelecionado]);

	useEffect(() => {
		if (
			semestreSelecionado &&
			!semestresDb?.some((semestre) => semestre.codigo === semestreFiltro)
		)
			setSemestreFiltro(semestreSelecionado.codigo);
	}, [semestreFiltro, semestreSelecionado, semestresDb]);

	// Importação e Exportação
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

	const processImportedData = (lines: any[][]) => {
		if (lines.length < 2) {
			alert(
				"Dados inválidos. Certifique-se de que a planilha possui cabeçalho e pelo menos uma linha de dados.",
			);
			return;
		}

		const firstLine = lines[0] ?? [];
		const headers = firstLine.map((h) => String(h).trim().toLowerCase());

		// Mapeamento esperado baseado nas colunas do Forms
		const colMap: Record<string, keyof Aluno | "ignorar"> = {
			"carimbo de data/hora": "ignorar",
			"nome - completo e sem abreviações": "nome",
			turma: "turma",
			"data de nascimento": "dataNascimento",
			cpf: "cpf",
			"qual é sua cor ou raça?": "corRaca",
			"qual sua identidade de gênero?": "identidadeGenero",
			"você se identifica como uma pessoa lgbtqiapn+?": "lgbtqiapn",
			telefone: "telefone",
			"contato de emergência": "contatoEmergencia",
			"e-mail": "email",
			"responsável pelo cuidado de terceiros?": "cuidaTerceiros",
			escolaridade: "escolaridade",
			"você trabalha atualmente?": "trabalha",
			"se sim na questão anterior: onde trabalha e qual a função?":
				"trabalhoLocal",
			"você estuda atualmente?": "estuda",
			"se sim na questão anterior: onde estuda e qual o curso?": "estudoLocal",
			"possui algum problema de saúde": "problemaSaude",
			"qual?": "problemaSaudeQual",
			"você tem alguma necessidade especial?": "necessidadeEspecial",
			"qual é a sua necessidade especial?": "necessidadeEspecialQual",
			"você tem acesso à internet?": "acessoInternet",
			"você tem computador ou notebook?": "temComputador",
			"você tem smartphone?": "temSmartphone",
			"informe o sistema operacional do seu smartphone": "sistemaSmartphone",
		};

		const newAlunos: Aluno[] = [];

		for (let i = 1; i < lines.length; i++) {
			const row = lines[i];
			if (!row || row.length === 0 || row.every((cell) => !cell)) continue; // Pular linhas vazias

			const novoAluno: Partial<Aluno> = {
				id: (Date.now() + i).toString(),
				semestre: semestreFiltro,
				turma: "",
			};

			headers.forEach((header, index) => {
				const targetField = colMap[header];
				if (targetField && targetField !== "ignorar") {
					const rawVal = row[index];
					let val =
						rawVal instanceof Date
							? rawVal.toISOString().slice(0, 10)
							: rawVal !== undefined && rawVal !== null
								? String(rawVal).trim()
								: "";

					// Tratamento simples para Sim/Não
					if (
						[
							"cuidaTerceiros",
							"trabalha",
							"estuda",
							"problemaSaude",
							"necessidadeEspecial",
							"acessoInternet",
							"temComputador",
							"temSmartphone",
						].includes(targetField)
					) {
						val = val.toLowerCase().startsWith("s") ? "Sim" : "Não";
					}

					// Formatar dataNascimento de DD/MM/YYYY para YYYY-MM-DD
					if (targetField === "dataNascimento" && val.includes("/")) {
						const parts = val.split("/");
						if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
							val = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
						}
					}
					if (targetField === "dataNascimento" && val.includes("T"))
						val = val.split("T")[0] ?? "";

					(novoAluno as any)[targetField] = val;
				}
			});

			// Só adiciona se tiver pelo menos o nome preenchido
			if (novoAluno.nome) {
				newAlunos.push(novoAluno as Aluno);
			}
		}

		if (!semestreSelecionado) {
			alert("Nenhum semestre disponível para receber a importação.");
			return;
		}
		if (!turmasDb) {
			alert("As turmas do semestre ainda estão carregando. Aguarde um instante e selecione a planilha novamente.");
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
			const melhorTurma = (turmasDb ?? [])
				.map((turma) => ({
					turma,
					confianca: pontuarSemelhancaTurma(turmaPlanilha, turma.titulo),
				}))
				.sort((a, b) => b.confianca - a.confianca)[0];
			const encontrouTurma = Boolean(melhorTurma && melhorTurma.confianca >= 0.55);
			const chave = turmaPlanilha.toLocaleLowerCase("pt-BR");
			const anterior = sugestoes.get(chave);
			sugestoes.set(chave, {
				turmaPlanilha,
				turmaId: encontrouTurma ? melhorTurma?.turma.id ?? null : null,
				turmaSistema: encontrouTurma ? melhorTurma?.turma.titulo ?? null : null,
				confianca: encontrouTurma ? Math.round((melhorTurma?.confianca ?? 0) * 100) : 0,
				totalAlunos: (anterior?.totalAlunos ?? 0) + 1,
			});
			if (encontrouTurma && melhorTurma)
				vinculosAutomaticos.set(melhorTurma.turma.id, [
					...(vinculosAutomaticos.get(melhorTurma.turma.id) ?? []),
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
		if (!semestreSelecionado || !alunosParaImportar.length) return;
		const turmasPorAluno = new Map<string, Set<string>>();
		for (const vinculo of vinculosImportacao) {
			for (const alunoId of vinculo.alunoIds) {
				const turmas = turmasPorAluno.get(alunoId) ?? new Set<string>();
				vinculo.turmaIds.forEach((turmaId) => turmas.add(turmaId));
				turmasPorAluno.set(alunoId, turmas);
			}
		}
		importarAlunos.mutate(
			{
				semestreId: semestreSelecionado.id,
				alunos: alunosParaImportar.map((aluno) => ({
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
					turmaIds: [...(turmasPorAluno.get(aluno.id) ?? [])],
				})),
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
		setTurmaIdsImportacao((ids) =>
			ids.includes(turmaId)
				? ids.filter((id) => id !== turmaId)
				: [...ids, turmaId],
		);
	const adicionarVinculoImportacao = () => {
		if (!alunosSelecionadosImportacao.length || !turmaIdsImportacao.length) return;
		const paresExistentes = new Set(
			vinculosImportacao.flatMap((vinculo) =>
				vinculo.turmaIds.flatMap((turmaId) =>
					vinculo.alunoIds.map((alunoId) => `${alunoId}:${turmaId}`),
				),
			),
		);
		const atualizados = [...vinculosImportacao];
		const repetidos = turmaIdsImportacao.flatMap((turmaId) =>
			alunosSelecionadosImportacao
				.filter((alunoId) => paresExistentes.has(`${alunoId}:${turmaId}`))
				.map((alunoId) => ({ alunoId, turmaId })),
		);
		for (const turmaId of turmaIdsImportacao) {
			const alunosNovos = alunosSelecionadosImportacao.filter(
				(alunoId) => !paresExistentes.has(`${alunoId}:${turmaId}`),
			);
			if (!alunosNovos.length) continue;
			const indiceExistente = atualizados.findIndex(
				(vinculo) =>
					vinculo.turmaIds.length === 1 && vinculo.turmaIds[0] === turmaId,
			);
			if (indiceExistente >= 0) {
				const existente = atualizados[indiceExistente]!;
				atualizados[indiceExistente] = {
					...existente,
					alunoIds: [...existente.alunoIds, ...alunosNovos],
				};
			} else atualizados.push({ alunoIds: alunosNovos, turmaIds: [turmaId] });
		}
		setVinculosImportacao(atualizados);
		setAvisosVinculoImportacao(repetidos);
		setAlunosSelecionadosImportacao([]);
		setTurmaIdsImportacao([]);
	};

	const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
				const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

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

	const handleExport = () => {
		if (alunosFiltrados.length === 0) {
			alert("Nenhum aluno encontrado para exportar neste semestre.");
			return;
		}

		// Ordem dos campos conforme pedidos no formulário, com cabeçalhos legíveis
		const colunasOrdenadas: { chave: keyof Aluno; cabecalho: string }[] = [
			// Turma e Semestre
			{ chave: "semestre", cabecalho: "Semestre Letivo" },
			{ chave: "turma", cabecalho: "Turma" },
			// Dados Gerais
			{ chave: "nome", cabecalho: "Nome - completo e sem abreviações" },
			{ chave: "dataNascimento", cabecalho: "Data de nascimento" },
			{ chave: "cpf", cabecalho: "CPF" },
			{ chave: "corRaca", cabecalho: "Qual é sua cor ou raça?" },
			{
				chave: "identidadeGenero",
				cabecalho: "Qual sua identidade de gênero?",
			},
			{
				chave: "lgbtqiapn",
				cabecalho: "Você se identifica como uma pessoa LGBTQIAPN+?",
			},
			{ chave: "telefone", cabecalho: "Telefone" },
			{ chave: "contatoEmergencia", cabecalho: "Contato de emergência" },
			{ chave: "email", cabecalho: "E-mail" },
			{
				chave: "cuidaTerceiros",
				cabecalho: "Responsável pelo cuidado de terceiros?",
			},
			// Ocupação e Escolaridade
			{ chave: "escolaridade", cabecalho: "Escolaridade" },
			{ chave: "trabalha", cabecalho: "Você trabalha atualmente?" },
			{
				chave: "trabalhoLocal",
				cabecalho: "Se sim na questão anterior: onde trabalha e qual a função?",
			},
			{ chave: "estuda", cabecalho: "Você estuda atualmente?" },
			{
				chave: "estudoLocal",
				cabecalho: "Se sim na questão anterior: onde estuda e qual o curso?",
			},
			// Saúde
			{ chave: "problemaSaude", cabecalho: "Possui algum problema de saúde" },
			{ chave: "problemaSaudeQual", cabecalho: "Qual?" },
			{
				chave: "necessidadeEspecial",
				cabecalho: "Você tem alguma necessidade especial?",
			},
			{
				chave: "necessidadeEspecialQual",
				cabecalho: "Qual é a sua necessidade especial?",
			},
			// Infraestrutura
			{ chave: "acessoInternet", cabecalho: "Você tem acesso à internet?" },
			{ chave: "temComputador", cabecalho: "Você tem computador ou notebook?" },
			{ chave: "temSmartphone", cabecalho: "Você tem smartphone?" },
			{
				chave: "sistemaSmartphone",
				cabecalho: "Informe o sistema operacional do seu smartphone",
			},
		];

		// Montar array de objetos com cabeçalhos legíveis na ordem correta
		const dadosFormatados = alunosFiltrados.map((aluno) => {
			const linha: Record<string, string> = {};
			colunasOrdenadas.forEach(({ chave, cabecalho }) => {
				linha[cabecalho] = (aluno as any)[chave] ?? "";
			});
			return linha;
		});

		// Criar planilha com os cabeçalhos na ordem definida
		const cabecalhos = colunasOrdenadas.map((c) => c.cabecalho);
		const worksheet = XLSX.utils.json_to_sheet(dadosFormatados, {
			header: cabecalhos,
		});
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");

		XLSX.writeFile(workbook, `Alunos_${semestreFiltro}.xlsx`);
	};

	// Ações de Certificado
	const handleGerarLoteCertificados = () => {
		if (!semestreSelecionado || alunosFiltrados.length === 0) {
			alert("Nenhum aluno encontrado para gerar certificados neste semestre.");
			return;
		}

		gerarLoteMutation.mutate({
			semestreId: semestreSelecionado.id,
			alunoIds: alunosFiltrados.map((aluno) => aluno.id),
		});
	};

	const handleGerarCertificadoIndividual = (aluno: Aluno) => {
		setGerandoAlunoId(aluno.id);
		gerarIndividualMutation.mutate({
			alunoId: aluno.id,
			nome: aluno.nome,
			curso: aluno.turma,
			periodo: aluno.semestre,
		});
	};

	// Filtros
	const buscaNormalizada = normalizarBusca(busca);
	const cpfBuscado = busca.replace(/\D/g, "");
	const alunosFiltrados = alunos.filter(
		(aluno) =>
			aluno.semestre === semestreFiltro &&
			(!buscaNormalizada ||
				normalizarBusca(aluno.nome).includes(buscaNormalizada) ||
				(cpfBuscado.length > 0 &&
					aluno.cpf.replace(/\D/g, "").includes(cpfBuscado))),
	);
	const todosSelecionados =
		alunosFiltrados.length > 0 &&
		alunosFiltrados.every((aluno) => alunosSelecionados.includes(aluno.id));
	const estiloVerInformacoes =
		theme === "dark"
			? { backgroundColor: "#3b0764", color: "#ede9fe" }
			: undefined;
	const estiloExcluirAluno =
		theme === "dark"
			? { backgroundColor: "#7f1d1d", color: "#fee2e2" }
			: undefined;

	// Ações CRUD
	const abrirModalNovo = () => {
		setForm({ ...stateInicial, semestre: semestreFiltro });
		setAlunoEditando(null);
		setIsModalOpen(true);
	};

	const abrirModalEdicao = (aluno: Aluno) => {
		setForm({ ...aluno });
		setAlunoEditando(aluno);
		setIsModalOpen(true);
	};
	const abrirContinuidade = (alunosSelecionadosParaContinuar: Aluno[]) => {
		setAlunosParaContinuar(alunosSelecionadosParaContinuar);
		setSemestreDestinoId("");
		setTurmaDestinoIds([]);
		setEtapaTrilha("");
	};
	const alternarSelecao = (alunoId: string) =>
		setAlunosSelecionados((ids) =>
			ids.includes(alunoId)
				? ids.filter((id) => id !== alunoId)
				: [...ids, alunoId],
		);
	const alternarTodos = () =>
		setAlunosSelecionados(
			todosSelecionados ? [] : alunosFiltrados.map((aluno) => aluno.id),
		);
	const abrirContinuidadeEmLote = () =>
		abrirContinuidade(
			alunosFiltrados.filter((aluno) => alunosSelecionados.includes(aluno.id)),
		);
	const abrirVinculoTurmasEmLote = () => {
		if (!alunosSelecionados.length) return;
		setTurmaIdsParaVinculo([]);
		setIsVinculoTurmasModalOpen(true);
	};
	const salvarVinculoTurmasEmLote = () => {
		if (!semestreSelecionado || !turmaIdsParaVinculo.length) return;
		vincularTurmasEmLote.mutate(
			{
				semestreId: semestreSelecionado.id,
				alunoIds: alunosSelecionados,
				turmaIds: turmaIdsParaVinculo,
			},
			{
				onSuccess: (result) => {
					setIsVinculoTurmasModalOpen(false);
					alert(
						`${alunosSelecionados.length} aluno(s) vinculados a ${turmaIdsParaVinculo.length} turma(s). ${result.total} novo(s) vínculo(s) criado(s).`,
					);
				},
				onError: (error) =>
					alert(`Não foi possível vincular as turmas: ${error.message}`),
			},
		);
	};

	const excluirAluno = (id: string) => {
		if (confirm("Tem certeza que deseja remover este aluno?")) {
			if (semestreSelecionado)
				removerAluno.mutate({ id, semestreId: semestreSelecionado.id });
		}
	};

	const salvarAluno = (e: React.FormEvent) => {
		e.preventDefault();

		// Limpeza de campos condicionais caso o usuário tenha mudado para "Não" depois de preencher
		const formProcessado = { ...form };
		if (formProcessado.trabalha !== "Sim") {
			delete formProcessado.trabalhoLocal;
			delete formProcessado.trabalhoFuncao;
		}
		if (formProcessado.estuda !== "Sim") {
			delete formProcessado.estudoLocal;
			delete formProcessado.estudoCurso;
		}
		if (formProcessado.problemaSaude !== "Sim")
			delete formProcessado.problemaSaudeQual;
		if (formProcessado.necessidadeEspecial !== "Sim")
			delete formProcessado.necessidadeEspecialQual;

		if (!semestreSelecionado) return;
		const payload = {
			semestreId: semestreSelecionado.id,
			nome: formProcessado.nome,
			dataNascimento: new Date(`${formProcessado.dataNascimento}T12:00:00`),
			cpf: formProcessado.cpf.replace(/\D/g, ""),
			corRaca: formProcessado.corRaca,
			identidadeGenero: formProcessado.identidadeGenero,
			lgbtqiapn: formProcessado.lgbtqiapn,
			telefone: formProcessado.telefone?.trim() || null,
			contatoEmergencia: formProcessado.contatoEmergencia?.trim() || null,
			email: formProcessado.email?.trim() || null,
			escolaridade: formProcessado.escolaridade,
			cuidaTerceiros: formProcessado.cuidaTerceiros === "Sim",
			trabalha: formProcessado.trabalha === "Sim",
			trabalhoLocal: formProcessado.trabalhoLocal || null,
			trabalhoFuncao: formProcessado.trabalhoFuncao || null,
			estuda: formProcessado.estuda === "Sim",
			estudoLocal: formProcessado.estudoLocal || null,
			estudoCurso: formProcessado.estudoCurso || null,
			problemaSaude: formProcessado.problemaSaude === "Sim",
			problemaSaudeQual: formProcessado.problemaSaudeQual || null,
			necessidadeEspecial: formProcessado.necessidadeEspecial === "Sim",
			necessidadeEspecialQual: formProcessado.necessidadeEspecialQual || null,
			acessoInternet: formProcessado.acessoInternet === "Sim",
			temComputador: formProcessado.temComputador === "Sim",
			temSmartphone: formProcessado.temSmartphone === "Sim",
			sistemaSmartphone: formProcessado.sistemaSmartphone || null,
		};
		const options = {
			onSuccess: () => setIsModalOpen(false),
			onError: (error: { message: string }) =>
				alert(`Não foi possível salvar o aluno: ${error.message}`),
		};
		if (alunoEditando)
			atualizarAluno.mutate({ ...payload, id: alunoEditando.id }, options);
		else criarAluno.mutate(payload, options);
	};
	return {
		semestreFiltro,
		setBusca,
		setSemestreFiltro,
		semestresDb,
		busca,
		handleGerarLoteCertificados,
		gerarLoteMutation,
		setIsImportModalOpen,
		semestreSelecionado,
		handleExport,
		abrirModalNovo,
		alternarTodos,
		alunosFiltrados,
		todosSelecionados,
		alunosSelecionados,
		abrirContinuidadeEmLote,
		carregandoSemestres,
		carregandoAlunos,
		carregandoTurmas,
		alternarSelecao,
		abrirContinuidade,
		estiloVerInformacoes,
		handleGerarCertificadoIndividual,
		gerandoAlunoId,
		abrirModalEdicao,
		excluirAluno,
		estiloExcluirAluno,
		alunosParaContinuar,
		semestreDestinoId,
		turmaDestinoIds,
		continuarAluno,
		etapaTrilha,
		setAlunosSelecionados,
		setAlunosParaContinuar,
		setSemestreDestinoId,
		setTurmaDestinoIds,
		turmaIdsParaVinculo,
		setTurmaIdsParaVinculo,
		isVinculoTurmasModalOpen,
		setIsVinculoTurmasModalOpen,
		abrirVinculoTurmasEmLote,
		salvarVinculoTurmasEmLote,
		vincularTurmasEmLote,
		setEtapaTrilha,
		semestreDestino,
		turmasDestino,
		isModalOpen,
		setIsModalOpen,
		alunoEditando,
		salvarAluno,
		form,
		setForm,
		turmasDb,
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
	};
}
