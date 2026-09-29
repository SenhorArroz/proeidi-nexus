"use client";
import { Home } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type {
	EstadoPresenca,
	PessoaPresenca,
} from "~/app/_components/diretoria/presence-grid";
import { api } from "~/trpc/react";
import {
	type Anotacao,
	type Aviso,
	type ConfirmacaoPresenca,
	type DadosTurma,
	type EventoCalendario,
	type Material,
	type TabId,
	type TipoEvento,
	corDeAcaoLegivel,
	corLegivel,
	misturarCores,
	TABS,
	TABS_MONITOR,
	TURMA_VAZIA,
	useTemaEscuro,
} from "./suporte";

type GrupoPresenca = "ALUNOS" | "MONITORES" | "PROFESSORES";

export function useTurmaView() {
	const utils = api.useUtils();
	const params = useParams<{ id: string }>();
	const turmaId = Array.isArray(params.id) ? params.id[0] : params.id;
	const { data: detalhe, isLoading: carregandoTurma } =
		api.turma.detalhe.useQuery({ id: turmaId }, { enabled: Boolean(turmaId) });
	const { data: registrosPresenca, isLoading: carregandoPresencas } =
		api.turma.presencas.list.useQuery(
			{ turmaId },
			{
				enabled: Boolean(turmaId && detalhe && detalhe.role !== "MONITOR"),
			},
		);
	const [erroPresenca, setErroPresenca] = useState<string | null>(null);
	const [confirmacaoPresenca, setConfirmacaoPresenca] =
		useState<ConfirmacaoPresenca | null>(null);
	const salvarPresencas = api.turma.presencas.salvar.useMutation();
	const [tab, setTab] = useState<TabId>("inicio");
	const [turma, setTurma] = useState<DadosTurma>(TURMA_VAZIA);
	const [avisos, setAvisos] = useState<Aviso[]>([]);
	const [materiais, setMateriais] = useState<Material[]>([]);
	const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
	const [eventos, setEventos] = useState<EventoCalendario[]>([]);
	const [editando, setEditando] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);
	const tabsDisponiveis = detalhe?.role === "MONITOR" ? TABS_MONITOR : TABS;

	useEffect(() => {
		if (!tabsDisponiveis.some((item) => item.id === tab)) {
			setTab("inicio");
			setMobileNavOpen(false);
		}
	}, [tab, tabsDisponiveis]);

	const [presencaAlunos, setPresencaAlunos] = useState<PessoaPresenca[]>(
		turma.alunos.map((nome, i) => ({
			id: `aluno-${i}`,
			nome,
			estado: "PRESENTE",
		})),
	);
	const [presencaMonitores, setPresencaMonitores] = useState<PessoaPresenca[]>(
		turma.monitores.map((nome, i) => ({
			id: `monitor-${i}`,
			nome,
			estado: "PRESENTE",
		})),
	);
	const [presencaProfessores, setPresencaProfessores] = useState<
		PessoaPresenca[]
	>(
		turma.professores.map((nome, i) => ({
			id: `professor-${i}`,
			nome,
			estado: "PRESENTE",
		})),
	);
	const [rascunhosPresenca, setRascunhosPresenca] = useState<
		Record<string, EstadoPresenca>
	>({});
	const datasDeAula = useMemo(
		() =>
			eventos
				.filter((evento) => evento.tipo === "aula")
				.map((evento) => evento.data)
				.sort(),
		[eventos],
	);
	const chavePresenca = (grupo: GrupoPresenca, id: string, data: string) =>
		`${data}:${grupo}:${id}`;
	const estadoRegistrado = (
		grupo: GrupoPresenca,
		id: string,
		data: string,
	): EstadoPresenca => {
		const registro = registrosPresenca?.find(
			(item) => item.data.toISOString().slice(0, 10) === data,
		);
		if (grupo === "ALUNOS")
			return (
				registro?.alunos.find((item) => item.alunoId === id)?.estado ??
				"PRESENTE"
			);
		if (grupo === "MONITORES")
			return (
				registro?.monitores.find((item) => item.monitorId === id)?.estado ??
				"PRESENTE"
			);
		return (
			registro?.professores.find((item) => item.professorId === id)?.estado ??
			"PRESENTE"
		);
	};
	const estadoPresenca = (grupo: GrupoPresenca, id: string, data: string) =>
		rascunhosPresenca[chavePresenca(grupo, id, data)] ??
		estadoRegistrado(grupo, id, data);
	const alterarPresenca = (
		grupo: GrupoPresenca,
		id: string,
		data: string,
		estado: EstadoPresenca,
	) => {
		setErroPresenca(null);
		setRascunhosPresenca((rascunhos) => ({
			...rascunhos,
			[chavePresenca(grupo, id, data)]: estado,
		}));
	};
	const salvarAlteracoesPresenca = async () => {
		const datasAlteradas = [
			...new Set(
				Object.keys(rascunhosPresenca).map(
					(chave) => chave.split(":", 1)[0] ?? chave,
				),
			),
		];
		if (!datasAlteradas.length) return;

		setErroPresenca(null);
		try {
			await Promise.all(
				datasAlteradas.map((data) =>
					salvarPresencas.mutateAsync({
						turmaId,
						data: new Date(`${data}T12:00:00`),
						alunos: presencaAlunos.map((pessoa) => ({
							id: pessoa.id,
							estado: estadoPresenca("ALUNOS", pessoa.id, data),
						})),
						monitores: presencaMonitores.map((pessoa) => ({
							id: pessoa.id,
							estado: estadoPresenca("MONITORES", pessoa.id, data),
						})),
						professores: presencaProfessores.map((pessoa) => ({
							id: pessoa.id,
							estado: estadoPresenca("PROFESSORES", pessoa.id, data),
						})),
					}),
				),
			);
			await utils.turma.presencas.list.invalidate({ turmaId });
			setRascunhosPresenca({});
			setConfirmacaoPresenca({
				data:
					datasAlteradas.length === 1
						? new Date(`${datasAlteradas[0]}T12:00:00`).toLocaleDateString(
								"pt-BR",
							)
						: `${datasAlteradas.length} dias de aula`,
				total:
					datasAlteradas.length *
					(presencaAlunos.length +
						presencaMonitores.length +
						presencaProfessores.length),
			});
		} catch (erro) {
			setErroPresenca(
				erro instanceof Error
					? erro.message
					: "Não foi possível salvar as presenças. Tente novamente.",
			);
		}
	};

	useEffect(() => {
		const dados = detalhe?.turma;
		if (!dados) return;
		setTurma({
			nome: dados.titulo,
			sala: dados.sala ?? "Local a definir",
			horario: dados.horario ?? "Horário a definir",
			cor: dados.cor,
			corDestaque: dados.corDestaque,
			corFundo: dados.corFundo,
			corTexto: dados.corTexto,
			corTitulo: dados.corTitulo,
			corDescricao: dados.corDescricao,
			fonte: dados.fonte as DadosTurma["fonte"],
			professores: dados.professores.map((item) => item.user.nome),
			monitores: dados.monitores.map((item) => item.user.nome),
			alunos: dados.alunos.map((item) => item.aluno.nome),
		});
		setAvisos(
			dados.avisos.map((item) => ({
				id: item.id,
				autor: item.autor.nome,
				fixado: item.fixado,
				texto: item.texto,
				imagemUrl: item.imagemUrl,
				linkUrl: item.linkUrl,
				quando: item.createdAt.toLocaleDateString("pt-BR"),
				podeExcluir:
					detalhe.role !== "MONITOR" || item.autorId === detalhe.usuarioId,
				podeFixar: detalhe.role !== "MONITOR",
				podeEditar:
					detalhe.role === "PROFESSOR" && item.autorId === detalhe.usuarioId,
			})),
		);
		setMateriais(
			dados.materiais.map((item) => ({
				id: item.id,
				nome: item.titulo,
				url: item.url,
				quando: item.createdAt.toLocaleDateString("pt-BR"),
			})),
		);
		setAnotacoes(
			(dados.anotacoes ?? []).map((item) => ({
				id: item.id,
				titulo: item.titulo,
				conteudo: item.conteudo,
				data: item.createdAt.toLocaleDateString("pt-BR"),
			})),
		);
		setEventos(
			dados.eventos.map((item) => ({
				id: item.id,
				titulo: item.titulo,
				data: item.data.toISOString().slice(0, 10),
				tipo: item.tipo.toLowerCase() as TipoEvento,
			})),
		);
		setPresencaAlunos(
			dados.alunos.map((item) => ({
				id: item.aluno.id,
				nome: item.aluno.nome,
				estado: "PRESENTE",
			})),
		);
		setPresencaMonitores(
			dados.monitores.map((item) => ({
				id: item.user.id,
				nome: item.user.nome,
				estado: "PRESENTE",
			})),
		);
		setPresencaProfessores(
			dados.professores.map((item) => ({
				id: item.user.id,
				nome: item.user.nome,
				estado: "PRESENTE",
			})),
		);
		setRascunhosPresenca({});
	}, [detalhe]);

	// Atualiza presença quando turma muda (editor)
	const salvarTema = api.turma.configurarTema.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
	});
	const salvarTurma = (novaTurma: DadosTurma) => {
		if (detalhe?.role === "MONITOR") return;
		void salvarTema.mutateAsync({
			turmaId,
			cor: novaTurma.cor,
			corDestaque: novaTurma.corDestaque ?? "#ea580c",
			corFundo: novaTurma.corFundo ?? "#f8fafc",
			corTexto: novaTurma.corTexto ?? "#0f172a",
			corTitulo: novaTurma.corTitulo ?? "#ffffff",
			corDescricao: novaTurma.corDescricao ?? "#64748b",
			fonte: novaTurma.fonte ?? "SANS",
		});
		setTurma(novaTurma);
		setEditando(false);
	};

	// Menu do header
	const [menuAberto, setMenuAberto] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!menuAberto) return;
		const handler = (e: MouseEvent) => {
			if (menuRef.current && !menuRef.current.contains(e.target as Node))
				setMenuAberto(false);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [menuAberto]);
	const tabAtual =
		tabsDisponiveis.find((item) => item.id === tab) ?? tabsDisponiveis[0];
	const IconeTabAtual = tabAtual?.icon ?? Home;
	const podeEditarTurma = detalhe?.role !== "MONITOR";
	const temaEscuro = useTemaEscuro();
	const fundoTurma = temaEscuro
		? misturarCores(turma.corFundo ?? "#f8fafc", "#0b1220", 0.82)
		: (turma.corFundo ?? "#f8fafc");
	const superficieDosCards = temaEscuro ? "#162033" : "#ffffff";
	const corTextoLegivel = corLegivel(
		turma.corTexto ?? "#0f172a",
		superficieDosCards,
	);
	const corDescricaoLegivel = corLegivel(
		turma.corDescricao ?? "#64748b",
		superficieDosCards,
		3,
	);
	const corDestaqueLegivel = corDeAcaoLegivel(
		turma.corDestaque ?? "#ea580c",
		temaEscuro,
		superficieDosCards,
	);
	const corTextoDestaque = corLegivel("#ffffff", corDestaqueLegivel);
	const corTituloLegivel = corLegivel(
		turma.corTitulo ?? "#ffffff",
		turma.cor,
		3,
	);
	const corDescricaoBannerLegivel = corLegivel(
		turma.corDescricao ?? "#64748b",
		turma.cor,
		3,
	);
	return {
		carregandoTurma,
		detalhe,
		turma,
		fundoTurma,
		corDestaqueLegivel,
		corTextoDestaque,
		corTextoLegivel,
		corDescricaoLegivel,
		podeEditarTurma,
		menuRef,
		setMenuAberto,
		menuAberto,
		setEditando,
		corTituloLegivel,
		corDescricaoBannerLegivel,
		tab,
		turmaId,
		avisos,
		eventos,
		materiais,
		anotacoes,
		presencaAlunos,
		datasDeAula,
		estadoPresenca,
		alterarPresenca,
		salvarAlteracoesPresenca,
		temAlteracoesPresenca: Object.keys(rascunhosPresenca).length > 0,
		carregandoPresencas,
		erroPresenca,
		salvarPresencas,
		presencaMonitores,
		presencaProfessores,
		confirmacaoPresenca,
		setConfirmacaoPresenca,
		mobileNavOpen,
		tabsDisponiveis,
		setTab,
		setMobileNavOpen,
		tabAtual,
		IconeTabAtual,
		editando,
		salvarTurma,
	};
}
