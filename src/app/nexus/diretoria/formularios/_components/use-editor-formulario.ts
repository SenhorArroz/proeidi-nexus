"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
	CONFIGURACAO_PADRAO,
	type ConfiguracaoFormulario,
	type ModoResposta,
	type Pergunta,
	type VisibilidadeFormulario,
} from "./suporte";

export function useEditorFormulario() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const [idPublicado, setIdPublicado] = useState<string | null>(null);
	const formularioId = searchParams.get("id") ?? idPublicado;
	const utils = api.useUtils();
	const [titulo, setTitulo] = useState("Pesquisa de Satisfação");
	const [descricao, setDescricao] = useState(
		"Deixe sua opinião sobre o módulo.",
	);
	const [modoResposta, setModoResposta] = useState<ModoResposta>("ANONIMO");
	const [visibilidade, setVisibilidade] =
		useState<VisibilidadeFormulario>("COMPARTILHADO");
	const [podeRestringirADiretoria, setPodeRestringirADiretoria] =
		useState(false);
	const [limitarPorNavegador, setLimitarPorNavegador] = useState(false);
	const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false);
	const [configuracao, setConfiguracao] =
		useState<ConfiguracaoFormulario>(CONFIGURACAO_PADRAO);
	const [ativoId, setAtivoId] = useState<string | null>("header");
	const { data: formularioExistente, isLoading: carregandoFormulario } =
		api.formulario.stats.useQuery(
			{ id: formularioId! },
			{ enabled: Boolean(formularioId) },
		);
	const criarFormulario = api.formulario.create.useMutation({
		onSuccess: async (formulario) => {
			setIdPublicado(formulario.id);
			router.replace(`/nexus/questionarios/editor?id=${formulario.id}`);
			await utils.formulario.list.invalidate();
		},
	});
	const atualizarFormulario = api.formulario.update.useMutation({
		onSuccess: () => utils.formulario.list.invalidate(),
	});

	const [perguntas, setPerguntas] = useState<Pergunta[]>([
		{
			id: "1",
			titulo: "Como você avalia a didática do professor?",
			tipo: "multiple_choice",
			opcoes: [
				{ id: "o1", texto: "Excelente" },
				{ id: "o2", texto: "Boa" },
				{ id: "o3", texto: "Regular" },
			],
			obrigatoria: true,
		},
	]);

	useEffect(() => {
		void fetch("/api/auth/session")
			.then((response) => (response.ok ? response.json() : null))
			.then((session: { user?: { role?: string } } | null) =>
				setPodeRestringirADiretoria(
					session?.user?.role === "DIRETOR" ||
						session?.user?.role === "COORDENADOR",
				),
			)
			.catch(() => undefined);
	}, []);

	useEffect(() => {
		if (!formularioExistente?.formulario) return;
		const formulario = formularioExistente.formulario;
		const conteudo = formulario.conteudo as { perguntas?: Pergunta[] };
		setTitulo(formulario.titulo);
		setDescricao(formulario.descricao ?? "");
		setModoResposta(formulario.modoResposta);
		setVisibilidade(formulario.visibilidade);
		setLimitarPorNavegador(formulario.limitarPorNavegador);
		setConfiguracao({
			...CONFIGURACAO_PADRAO,
			...(formulario.configuracao as Partial<ConfiguracaoFormulario> | null),
		});
		if (conteudo.perguntas?.length) setPerguntas(conteudo.perguntas);
		setAtivoId("header");
	}, [formularioExistente]);

	// Funções de manipulação
	const adicionarPergunta = () => {
		const nova: Pergunta = {
			id: Date.now().toString(),
			titulo: "",
			tipo: "multiple_choice",
			opcoes: [{ id: Date.now() + "o", texto: "Opção 1" }],
			obrigatoria: false,
		};
		setPerguntas([...perguntas, nova]);
		setAtivoId(nova.id);
	};

	const duplicarPergunta = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		const p = perguntas.find((x) => x.id === id);
		if (!p) return;
		const nova = {
			...p,
			id: Date.now().toString(),
			opcoes: p.opcoes.map((o) => ({
				...o,
				id: Date.now() + Math.random().toString(),
			})),
		};
		const index = perguntas.findIndex((x) => x.id === id);
		const arrayAtualizado = [...perguntas];
		arrayAtualizado.splice(index + 1, 0, nova);
		setPerguntas(arrayAtualizado);
		setAtivoId(nova.id);
	};

	const excluirPergunta = (id: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (perguntas.length === 1) return;
		const novas = perguntas.filter((p) => p.id !== id);
		setPerguntas(novas);
		if (ativoId === id) setAtivoId(null);
	};

	const atualizarPergunta = (id: string, campo: keyof Pergunta, valor: any) => {
		setPerguntas((prev) =>
			prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)),
		);
	};

	const adicionarOpcao = (perguntaId: string) => {
		setPerguntas((prev) =>
			prev.map((p) => {
				if (p.id !== perguntaId) return p;
				return {
					...p,
					opcoes: [
						...p.opcoes,
						{
							id: Date.now().toString(),
							texto: `Opção ${p.opcoes.length + 1}`,
						},
					],
				};
			}),
		);
	};

	const atualizarOpcao = (
		perguntaId: string,
		opcaoId: string,
		texto: string,
	) => {
		setPerguntas((prev) =>
			prev.map((p) => {
				if (p.id !== perguntaId) return p;
				return {
					...p,
					opcoes: p.opcoes.map((o) => (o.id === opcaoId ? { ...o, texto } : o)),
				};
			}),
		);
	};

	const removerOpcao = (perguntaId: string, opcaoId: string) => {
		setPerguntas((prev) =>
			prev.map((p) => {
				if (p.id !== perguntaId) return p;
				if (p.opcoes.length === 1) return p;
				return { ...p, opcoes: p.opcoes.filter((o) => o.id !== opcaoId) };
			}),
		);
	};

	const salvar = () => {
		const dados = {
			titulo: titulo.trim(),
			descricao: descricao.trim() || null,
			conteudo: {
				perguntas: perguntas
					.filter((pergunta) => pergunta.titulo.trim())
					.map((pergunta) => ({
						...pergunta,
						titulo: pergunta.titulo.trim(),
						opcoes: pergunta.opcoes
							.filter((opcao) => opcao.texto.trim())
							.map((opcao) => ({ ...opcao, texto: opcao.texto.trim() })),
					})),
			},
			publicado: true,
			modoResposta,
			limitarPorNavegador,
			configuracao,
			visibilidade,
		};
		if (formularioId)
			atualizarFormulario.mutate({ id: formularioId, ...dados });
		else criarFormulario.mutate(dados);
	};
	const salvando = criarFormulario.isPending || atualizarFormulario.isPending;
	const erroSalvar = criarFormulario.error ?? atualizarFormulario.error;
	const formularioSalvo = criarFormulario.data ?? atualizarFormulario.data;
	return {
		formularioId,
		setConfiguracoesAbertas,
		configuracoesAbertas,
		setAtivoId,
		ativoId,
		titulo,
		setTitulo,
		descricao,
		setDescricao,
		configuracao,
		setConfiguracao,
		limitarPorNavegador,
		modoResposta,
		setLimitarPorNavegador,
		setModoResposta,
		podeRestringirADiretoria,
		visibilidade,
		setVisibilidade,
		perguntas,
		atualizarPergunta,
		atualizarOpcao,
		removerOpcao,
		adicionarOpcao,
		duplicarPergunta,
		excluirPergunta,
		adicionarPergunta,
		carregandoFormulario,
		salvar,
		salvando,
		erroSalvar,
		formularioSalvo,
	};
}
