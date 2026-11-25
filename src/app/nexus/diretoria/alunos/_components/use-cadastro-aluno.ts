"use client";

import { useState, type FormEvent } from "react";
import { api } from "~/trpc/react";
import type { Aluno } from "./suporte";

export function useCadastroAluno({
	semestreId,
	semestreFiltro,
}: {
	semestreId: string | undefined;
	semestreFiltro: string;
}) {
	const utils = api.useUtils();
	const criarAluno = api.aluno.create.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});
	const atualizarAluno = api.aluno.update.useMutation({
		onSuccess: () => utils.aluno.list.invalidate(),
	});

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [alunoEditando, setAlunoEditando] = useState<Aluno | null>(null);

	// Estado do formulário inicial
	const stateInicial: Aluno = {
		id: "",
		semestre: "2026.1",
		turma: "",
		turmasVinculadas: [],
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

	const salvarAluno = (e: FormEvent) => {
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

		if (!semestreId) return;
		const payload = {
			semestreId,
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
		isModalOpen,
		setIsModalOpen,
		alunoEditando,
		salvarAluno,
		form,
		setForm,
		abrirModalNovo,
		abrirModalEdicao,
	};
}
