"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { type GrupoPresenca, useSalvamentoPresencas } from "~/app/_components/diretoria/use-salvamento-presencas";

export function useGerenciarPresencas() {
	const utils = api.useUtils();
	const { data: semestres, isLoading: carregandoSemestres } =
		api.diretoria.semestres.list.useQuery();
	const [semestreId, setSemestreId] = useState("");
	const semestre =
		semestres?.find((item) => item.id === semestreId) ??
		semestres?.find((item) => item.ativo) ??
		semestres?.[0];
	const { data: turmas, isLoading: carregandoTurmas } =
		api.diretoria.turmas.list.useQuery(
			semestre ? { semestreId: semestre.id } : undefined,
			{ enabled: Boolean(semestre) },
		);
	const [turmaId, setTurmaId] = useState("");
	const turma = turmas?.find((item) => item.id === turmaId) ?? turmas?.[0];
	const { data: registros, isLoading: carregandoRegistros } =
		api.diretoria.presencas.list.useQuery(
			{ turmaId: turma?.id ?? "c0000000000000000000000000" },
			{ enabled: Boolean(turma) },
		);
	const salvar = api.diretoria.presencas.salvar.useMutation();
	const remover = api.diretoria.presencas.remove.useMutation({
		onSuccess: () => utils.diretoria.presencas.list.invalidate(),
	});
	const [grupoAtivo, setGrupoAtivo] = useState<
		"ALUNOS" | "MONITORES" | "PROFESSORES"
	>("ALUNOS");
	const datasDeAula = useMemo(
		() =>
			(turma?.eventos ?? [])
				.filter((evento) => evento.tipo === "AULA")
				.map((evento) => evento.data.toISOString().slice(0, 10))
				.sort(),
		[turma],
	);

	useEffect(() => {
		if (!semestreId && semestre) setSemestreId(semestre.id);
	}, [semestre, semestreId]);
	useEffect(() => {
		if (!turmaId && turma) setTurmaId(turma.id);
	}, [turma, turmaId]);
	const chamada = useSalvamentoPresencas({
		turmaId: turma?.id,
		salvarDia: salvar.mutateAsync,
		atualizarListas: () => Promise.all([
			utils.diretoria.presencas.list.invalidate(),
			utils.turma.presencas.list.invalidate(),
		]),
	});

	const registrosOrdenados = registros ?? [];
	const estadoExibido = (grupo: GrupoPresenca, id: string, dia: string) => {
		const pendente = chamada.estadoRascunho(grupo, id, dia);
		if (pendente) return pendente;

		const registrosDoDia = registrosOrdenados.filter(
			(item) => item.data.toISOString().slice(0, 10) === dia,
		).reverse();
		if (grupo === "alunos")
			return registrosDoDia.flatMap((item) => item.alunos)
				.find((item) => item.alunoId === id)?.estado;
		if (grupo === "monitores")
			return registrosDoDia.flatMap((item) => item.monitores)
				.find((item) => item.monitorId === id)?.estado;
		return registrosDoDia.flatMap((item) => item.professores)
			.find((item) => item.professorId === id)?.estado;
	};
	return {
		carregandoSemestres,
		carregandoTurmas,
		carregandoRegistros,
		semestre,
		setSemestreId,
		setTurmaId,
		semestres,
		turma,
		turmas,
		chamada,
		datasDeAula,
		setGrupoAtivo,
		grupoAtivo,
		estadoExibido,
		registrosOrdenados,
		remover,
	};
}
