"use client";
import { useState, type FormEvent } from "react";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";
import type { Candidato } from "./suporte";
import { usePlanilhaInscricoes } from "./use-planilha-inscricoes";

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
	const candidatos = (candidatosDb ?? []).map((candidato) => ({
		...candidato,
		dataNascimento: candidato.dataNascimento.toISOString().slice(0, 10),
		criadoEm: candidato.createdAt.toISOString(),
		curso:
			candidato.curso === "SMARTPHONE"
				? ("Smartphone" as const)
				: ("Computador" as const),
	}));
	const planilha = usePlanilhaInscricoes(semestreSelecionado, candidatos);
	const [busca, setBusca] = useState("");
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

	const salvarCandidato = (e: FormEvent) => {
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

	return {
		...planilha,
		candidatos,
		semestreSelecionado,
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
