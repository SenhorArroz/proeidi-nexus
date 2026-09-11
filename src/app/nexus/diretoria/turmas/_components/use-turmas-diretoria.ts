"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import {
	type TipoMaterial,
	type Turma,
	normalizarTurma,
	turmaVazia,
} from "./suporte";

export function useTurmasDiretoria() {
	const utils = api.useUtils();
	const [semestreSelecionadoId, setSemestreSelecionadoId] = useState("");
	const {
		data: semestres,
		isLoading: carregandoSemestres,
		error: erroSemestres,
		refetch: recarregarSemestres,
	} = api.diretoria.semestres.list.useQuery();
	const semestreSelecionado =
		semestres?.find((s) => s.id === semestreSelecionadoId) ??
		semestres?.find((s) => s.ativo) ??
		semestres?.[0];
	const {
		data: turmasDb,
		isLoading: carregandoTurmas,
		error: erroTurmas,
		refetch: recarregarTurmas,
	} = api.diretoria.turmas.list.useQuery(
		semestreSelecionado ? { semestreId: semestreSelecionado.id } : undefined,
		{ enabled: Boolean(semestreSelecionado) },
	);
	const { data: professoresDb, isLoading: carregandoProfessores } =
		api.diretoria.usuarios.list.useQuery({
			role: "PROFESSOR",
		});
	const { data: diretoresDb, isLoading: carregandoDiretores } =
		api.diretoria.usuarios.list.useQuery({
			role: "DIRETOR",
		});
	const { data: monitoresDb, isLoading: carregandoMonitores } =
		api.diretoria.usuarios.list.useQuery({
			role: "MONITOR",
		});
	const { data: alunosDb } = api.aluno.list.useQuery(
		{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestreSelecionado) },
	);
	const criar = api.diretoria.turmas.create.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const atualizar = api.diretoria.turmas.update.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const remover = api.diretoria.turmas.remove.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
	});
	const duplicar = api.diretoria.turmas.duplicate.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
		onError: (erro) =>
			alert(`Não foi possível duplicar a turma: ${erro.message}`),
	});
	const limparAlunos = api.diretoria.turmas.limparAlunos.useMutation({
		onSuccess: () => utils.diretoria.turmas.list.invalidate(),
		onError: (erro) =>
			alert(`Não foi possível limpar os alunos: ${erro.message}`),
	});
	const [turmas, setTurmas] = useState<Turma[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Turma>(turmaVazia());
	const docentesDb = [...(professoresDb ?? []), ...(diretoresDb ?? [])];

	useEffect(() => {
		if (!turmasDb) return;
		setTurmas(
			turmasDb.map((t) => ({
				id: t.id,
				semestreId: t.semestreId,
				limiteAlunos: t.limiteAlunos,
				titulo: t.titulo,
				sala: t.sala ?? "",
				horario: t.horario ?? "",
				cor: t.cor,
				corDestaque: t.corDestaque,
				corFundo: t.corFundo,
				corTexto: t.corTexto,
				corTitulo: t.corTitulo,
				corDescricao: t.corDescricao,
				fonte: t.fonte as Turma["fonte"],
				professores: t.professores.map((v) => v.user.nome),
				professorIds: t.professores.map((v) => v.user.id),
				monitores: t.monitores.map((v) => v.user.nome),
				monitorIds: t.monitores.map((v) => v.user.id),
				alunos: t.alunos.map((v) => v.aluno.nome),
				alunoIds: t.alunos.map((v) => v.aluno.id),
				materiais: t.materiais.map((m) => ({
					...m,
					tipo: m.tipo.toLowerCase() as TipoMaterial,
				})),
				notas: t._count?.anotacoes ?? 0,
				aulas: t.eventos.map((e) => ({
					id: e.id,
					titulo: e.titulo,
					data: e.data.toISOString().slice(0, 10),
					tipo: e.tipo,
				})),
			})),
		);
	}, [turmasDb]);

	useEffect(() => {
		if (!semestreSelecionadoId && semestreSelecionado)
			setSemestreSelecionadoId(semestreSelecionado.id);
	}, [semestreSelecionado, semestreSelecionadoId]);

	const abrirNova = () => {
		setEditandoId(null);
		setRascunho({ ...turmaVazia(), semestreId: semestreSelecionado?.id });
		setModo("form");
	};

	const abrirEdicao = (turma: Turma) => {
		setEditandoId(turma.id);
		setRascunho(normalizarTurma(turma));
		if (turma.semestreId) setSemestreSelecionadoId(turma.semestreId);
		setModo("form");
	};

	const cancelar = () => setModo("lista");
	const recarregar = async () => {
		await recarregarSemestres();
		await recarregarTurmas();
	};

	const salvar = async () => {
		if (
			!Number.isInteger(rascunho.limiteAlunos) ||
			rascunho.limiteAlunos < 1 ||
			rascunho.limiteAlunos > 300
		) {
			alert("Informe um limite entre 1 e 300 alunos.");
			return;
		}
		if (!rascunho.titulo.trim() || !rascunho.semestreId) return;
		const payload = {
			semestreId: rascunho.semestreId,
			limiteAlunos: rascunho.limiteAlunos,
			titulo: rascunho.titulo,
			sala: rascunho.sala.trim() || null,
			horario: rascunho.horario.trim() || null,
			cor: rascunho.cor,
			corDestaque: rascunho.corDestaque,
			corFundo: rascunho.corFundo,
			corTexto: rascunho.corTexto,
			corTitulo: rascunho.corTitulo,
			corDescricao: rascunho.corDescricao,
			fonte: rascunho.fonte,
			professorIds: rascunho.professorIds,
			monitorIds: rascunho.monitorIds,
			alunoIds: rascunho.alunoIds,
			materiais: rascunho.materiais.map((m) => ({
				titulo: m.titulo,
				tipo: m.tipo.toUpperCase() as "LINK" | "PDF" | "SLIDE" | "IMAGEM",
				url: m.url,
			})),
			aulas: rascunho.aulas.map((a) => ({
				titulo: a.titulo,
				data: new Date(`${a.data}T12:00:00`),
				tipo: a.tipo,
			})),
		};
		try {
			if (editandoId) {
				await atualizar.mutateAsync({ ...payload, id: editandoId });
				setTurmas((atuais) =>
					atuais.map((turma) =>
						turma.id === editandoId ? { ...rascunho, id: editandoId } : turma,
					),
				);
			} else {
				await criar.mutateAsync(payload);
			}
			await utils.diretoria.turmas.list.invalidate();
			setModo("lista");
		} catch (erro) {
			alert(
				`Não foi possível salvar a turma: ${
					erro instanceof Error ? erro.message : "tente novamente"
				}`,
			);
		}
	};

	const excluir = (id: string) => {
		if (confirm("Excluir esta turma? Essa ação não pode ser desfeita.")) {
			remover.mutate({ id });
		}
	};

	const duplicarTurma = (id: string) => duplicar.mutate({ id });
	const limparAlunosDaTurma = (turma: Turma) => {
		if (
			!confirm(
				`Remover os ${turma.alunos.length} aluno(s) desta turma? As presenças e o histórico serão preservados.`,
			)
		)
			return;
		limparAlunos.mutate({ turmaId: turma.id });
	};
	return {
		modo,
		rascunho,
		semestres,
		alunosDb,
		docentesDb,
		monitoresDb,
		setRascunho,
		cancelar,
		salvar,
		criar,
		atualizar,
		semestreSelecionado,
		setSemestreSelecionadoId,
		turmas,
		abrirNova,
		carregandoSemestres,
		carregandoTurmas,
		erroCarregamento: erroSemestres ?? erroTurmas,
		recarregar,
		abrirEdicao,
		duplicarTurma,
		limparAlunosDaTurma,
		excluir,
		duplicar,
		editandoId,
		carregandoProfessores,
		carregandoDiretores,
		carregandoMonitores,
	};
}
