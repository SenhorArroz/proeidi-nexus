"use client";
import { useEffect, useState } from "react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
import { exportarAlunos } from "./exportar-alunos";
import { useCadastroAluno } from "./use-cadastro-aluno";
import { useImportarAlunos } from "./use-importar-alunos";
import { type Aluno, downloadBase64Pdf, formatarCpf } from "./suporte";

export function useGerenciarAlunos() {
	const { theme } = useAccessibility();
	const utils = api.useUtils();
	const [semestreFiltro, setSemestreFiltro] = useState<string>("");
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
	const removerAluno = api.aluno.remove.useMutation({
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

	useEffect(() => {
		if (!alunosDb || !semestreSelecionado) return;
		setAlunos(
			alunosDb.map((a) => ({
				id: a.id,
				semestre: semestreSelecionado.codigo,
				turma: a.turmas.map((v) => v.turma.titulo).join(", "),
				turmasVinculadas: a.turmas.map(({ turma }) => turma),
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

	const cadastro = useCadastroAluno({
		semestreId: semestreSelecionado?.id,
		semestreFiltro,
	});
	const importacao = useImportarAlunos({
		semestreId: semestreSelecionado?.id,
		semestreFiltro,
		turmasDb,
	});

	const handleExport = () => exportarAlunos(alunosFiltrados, semestreFiltro);

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

	const handleGerarCertificadoIndividual = (aluno: Aluno, turmaId: string) => {
		setGerandoAlunoId(aluno.id);
		gerarIndividualMutation.mutate({ alunoId: aluno.id, turmaId });
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

	return {
		semestreFiltro,
		setBusca,
		setSemestreFiltro,
		semestresDb,
		busca,
		handleGerarLoteCertificados,
		gerarLoteMutation,
		semestreSelecionado,
		handleExport,
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
		turmasDb,
		...cadastro,
		...importacao,
	};
}
