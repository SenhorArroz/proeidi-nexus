"use client";
import { Home } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
	type Anotacao,
	type Aviso,
	type ConfirmacaoPresenca,
	type DadosTurma,
	type EventoCalendario,
	type Material,
	type Pessoa,
	type TabId,
	type TipoEvento,
	corDeAcaoLegivel,
	corLegivel,
	misturarCores,
	TABS,
	TURMA_VAZIA,
	useTemaEscuro,
} from "./suporte";

export function useTurmaView() {
	const utils = api.useUtils();
	const params = useParams<{ id: string }>();
	const turmaId = Array.isArray(params.id) ? params.id[0] : params.id;
	const { data: detalhe, isLoading: carregandoTurma } =
		api.turma.detalhe.useQuery({ id: turmaId }, { enabled: Boolean(turmaId) });
	const [erroPresenca, setErroPresenca] = useState<string | null>(null);
	const [confirmacaoPresenca, setConfirmacaoPresenca] =
		useState<ConfirmacaoPresenca | null>(null);
	const salvarPresencas = api.turma.presencas.salvar.useMutation({
		onSuccess: (_resultado, variaveis) => {
			setErroPresenca(null);
			setConfirmacaoPresenca({
				data: variaveis.data.toLocaleDateString("pt-BR"),
				total:
					variaveis.alunos.length +
					variaveis.monitores.length +
					variaveis.professores.length,
			});
			void utils.turma.presencas.list.invalidate({ turmaId });
		},
		onError: (erro) => setErroPresenca(erro.message),
	});
	const [tab, setTab] = useState<TabId>("inicio");
	const [turma, setTurma] = useState<DadosTurma>(TURMA_VAZIA);
	const [avisos, setAvisos] = useState<Aviso[]>([]);
	const [materiais, setMateriais] = useState<Material[]>([]);
	const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
	const [eventos, setEventos] = useState<EventoCalendario[]>([]);
	const [editando, setEditando] = useState(false);
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	// Constroi lista de presença a partir dos nomes da turma
	const [presencaAlunos, setPresencaAlunos] = useState<Pessoa[]>(
		turma.alunos.map((nome, i) => ({
			id: `aluno-${i}`,
			nome,
			presente: "presente",
		})),
	);
	const [presencaMonitores, setPresencaMonitores] = useState<Pessoa[]>(
		turma.monitores.map((nome, i) => ({
			id: `monitor-${i}`,
			nome,
			presente: "presente",
		})),
	);
	const [presencaProfessores, setPresencaProfessores] = useState<Pessoa[]>(
		turma.professores.map((nome, i) => ({
			id: `professor-${i}`,
			nome,
			presente: "presente",
		})),
	);
	const salvarNaData = (data: string) => {
		const todas = [
			...presencaAlunos,
			...presencaMonitores,
			...presencaProfessores,
		];
		if (todas.some((pessoa) => pessoa.presente === "a_registrar")) {
			setErroPresenca("Marque a presença de todas as pessoas antes de salvar.");
			return;
		}
		setErroPresenca(null);
		const estado = (pessoa: Pessoa) =>
			pessoa.presente.toUpperCase() as "PRESENTE" | "AUSENTE" | "JUSTIFICADO";
		salvarPresencas.mutate({
			turmaId,
			data: new Date(`${data}T12:00:00`),
			alunos: presencaAlunos.map((pessoa) => ({
				id: pessoa.id,
				estado: estado(pessoa),
			})),
			monitores: presencaMonitores.map((pessoa) => ({
				id: pessoa.id,
				estado: estado(pessoa),
			})),
			professores: presencaProfessores.map((pessoa) => ({
				id: pessoa.id,
				estado: estado(pessoa),
			})),
		});
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
				presente: "presente",
			})),
		);
		setPresencaMonitores(
			dados.monitores.map((item) => ({
				id: item.user.id,
				nome: item.user.nome,
				presente: "presente",
			})),
		);
		setPresencaProfessores(
			dados.professores.map((item) => ({
				id: item.user.id,
				nome: item.user.nome,
				presente: "presente",
			})),
		);
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
		setPresencaAlunos(
			novaTurma.alunos.map((nome, i) => ({
				id: `aluno-${i}`,
				nome,
				presente:
					presencaAlunos.find((p) => p.nome === nome)?.presente ?? "presente",
			})),
		);
		setPresencaMonitores(
			novaTurma.monitores.map((nome, i) => ({
				id: `monitor-${i}`,
				nome,
				presente:
					presencaMonitores.find((p) => p.nome === nome)?.presente ??
					"presente",
			})),
		);
		setPresencaProfessores(
			novaTurma.professores.map((nome, i) => ({
				id: `professor-${i}`,
				nome,
				presente:
					presencaProfessores.find((p) => p.nome === nome)?.presente ??
					"presente",
			})),
		);
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
	const tabAtual = TABS.find((item) => item.id === tab) ?? TABS[0];
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
		setPresencaAlunos,
		salvarNaData,
		erroPresenca,
		salvarPresencas,
		presencaMonitores,
		setPresencaMonitores,
		presencaProfessores,
		setPresencaProfessores,
		confirmacaoPresenca,
		setConfirmacaoPresenca,
		mobileNavOpen,
		setTab,
		setMobileNavOpen,
		tabAtual,
		IconeTabAtual,
		editando,
		salvarTurma,
	};
}
