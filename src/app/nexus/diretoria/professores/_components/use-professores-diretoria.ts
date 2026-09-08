"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
	downloadBase64Pdf,
	normalizarProfessor,
	type Professor,
	professorVazio,
} from "./suporte";

export function useProfessoresDiretoria() {
	const utils = api.useUtils();
	const { data: professoresDb, isLoading: carregandoProfessores } =
		api.diretoria.usuarios.list.useQuery({ role: "PROFESSOR" });
	const { data: diretoresDb, isLoading: carregandoDiretores } =
		api.diretoria.usuarios.list.useQuery({ role: "DIRETOR" });
	const criar = api.diretoria.usuarios.create.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const atualizar = api.diretoria.usuarios.update.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const remover = api.diretoria.usuarios.remove.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const solicitarRedefinicao = api.conta.solicitarRedefinicao.useMutation({
		onSuccess: () => alert("Código de redefinição enviado por e-mail."),
		onError: (causa) => alert(causa.message),
	});
	const [professores, setProfessores] = useState<Professor[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Professor>(professorVazio());
	const [mostrarSenha, setMostrarSenha] = useState(false);
	const [professorParaCertificado, setProfessorParaCertificado] =
		useState<Professor | null>(null);
	const [modalLoteAberto, setModalLoteAberto] = useState(false);
	const gerarLoteDeclaracoes = api.declaracao.gerarLoteUsuarios.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(data.arquivoBase64, data.nomeArquivo);
			setModalLoteAberto(false);
		},
		onError: (err) =>
			alert(`Erro ao gerar o lote de certificados: ${err.message}`),
	});

	useEffect(() => {
		if (!professoresDb || !diretoresDb) return;
		setProfessores(
			[...professoresDb, ...diretoresDb].map((p) => ({
				id: p.id,
				nome: p.nome,
				matricula: p.matricula,
				email: p.email,
				senha: "",
				role: p.role as "PROFESSOR" | "DIRETOR",
				turmas: p.turmasProfessor.map((v) => v.turma.titulo),
				turmasDetalhadas: p.turmasProfessor.map((v) => ({
					id: v.turma.id,
					titulo: v.turma.titulo,
					semestre: v.turma.semestre.codigo,
				})),
			})),
		);
	}, [professoresDb, diretoresDb]);

	const gerarLote = () => {
		if (!professores.length) return;
		setModalLoteAberto(true);
	};

	const confirmarLote = (codigoProjeto: string) => {
		gerarLoteDeclaracoes.mutate({
			usuarioIds: professores.map((professor) => professor.id),
			tipo: "professor",
			codigoProjeto,
		});
	};

	const abrirNovo = () => {
		setEditandoId(null);
		setRascunho(professorVazio());
		setMostrarSenha(true);
		setModo("form");
	};

	const abrirEdicao = (professor: Professor) => {
		setEditandoId(professor.id);
		setRascunho(normalizarProfessor(professor));
		setMostrarSenha(false);
		setModo("form");
	};

	const cancelar = () => setModo("lista");

	const salvar = () => {
		if (
			!rascunho.nome.trim() ||
			!rascunho.matricula.trim() ||
			!rascunho.email.trim()
		)
			return;
		if (editandoId) {
			atualizar.mutate({
				id: editandoId,
				role: "PROFESSOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		} else {
			criar.mutate({
				role: "PROFESSOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		}
		setModo("lista");
	};

	const excluir = (id: string) => {
		if (
			confirm(
				"Excluir este professor? O acesso dele será revogado imediatamente.",
			)
		) {
			remover.mutate({ id, role: "PROFESSOR" });
		}
	};

	const formValido =
		rascunho.nome.trim() && rascunho.matricula.trim() && rascunho.email.trim();
	return {
		modo,
		professores,
		gerarLote,
		gerarLoteDeclaracoes,
		abrirNovo,
		carregandoProfessores,
		carregandoDiretores,
		abrirEdicao,
		excluir,
		solicitarRedefinicao,
		setProfessorParaCertificado,
		cancelar,
		editandoId,
		rascunho,
		setRascunho,
		salvar,
		formValido,
		professorParaCertificado,
		modalLoteAberto,
		setModalLoteAberto,
		confirmarLote,
	};
}
