"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { hoje, type Estado, type Pessoa } from "./suporte";

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
	const salvar = api.diretoria.presencas.salvar.useMutation({
		onSuccess: () => utils.diretoria.presencas.list.invalidate(),
	});
	const remover = api.diretoria.presencas.remove.useMutation({
		onSuccess: () => utils.diretoria.presencas.list.invalidate(),
	});
	const [data, setData] = useState(hoje());
	const [grupoAtivo, setGrupoAtivo] = useState<
		"ALUNOS" | "MONITORES" | "PROFESSORES"
	>("ALUNOS");
	const [rascunhos, setRascunhos] = useState<Record<string, Estado>>({});
	const datasDeAula = useMemo(
		() =>
			(turma?.eventos ?? [])
				.filter((evento) => evento.tipo === "AULA")
				.map((evento) => evento.data.toISOString().slice(0, 10))
				.sort(),
		[turma],
	);
	const [alunos, setAlunos] = useState<Pessoa[]>([]);
	const [monitores, setMonitores] = useState<Pessoa[]>([]);
	const [professores, setProfessores] = useState<Pessoa[]>([]);

	useEffect(() => {
		if (!semestreId && semestre) setSemestreId(semestre.id);
	}, [semestre, semestreId]);
	useEffect(() => {
		if (!turmaId && turma) setTurmaId(turma.id);
	}, [turma, turmaId]);
	useEffect(() => {
		if (datasDeAula.length && !datasDeAula.includes(data))
			setData(datasDeAula[0]!);
	}, [datasDeAula, data]);
	useEffect(() => {
		if (!turma) return;
		const registro = registros?.find(
			(item) => item.data.toISOString().slice(0, 10) === data,
		);
		setAlunos(
			registro
				? registro.alunos.map((item) => ({
						id: item.alunoId,
						nome: item.aluno.nome,
						estado: item.estado,
					}))
				: turma.alunos.map((item) => ({
						id: item.aluno.id,
						nome: item.aluno.nome,
						estado: "PRESENTE",
					})),
		);
		setMonitores(
			registro
				? registro.monitores.map((item) => ({
						id: item.monitorId,
						nome: item.monitor.nome,
						role: item.monitor.role,
						estado: item.estado,
					}))
				: turma.monitores.map((item) => ({
						id: item.user.id,
						nome: item.user.nome,
						role: item.user.role,
						estado: "PRESENTE",
					})),
		);
		setProfessores(
			registro
				? registro.professores.map((item) => ({
						id: item.professorId,
						nome: item.professor.nome,
						role: item.professor.role,
						estado: item.estado,
					}))
				: turma.professores.map((item) => ({
						id: item.user.id,
						nome: item.user.nome,
						role: item.user.role,
						estado: "PRESENTE",
					})),
		);
	}, [turma, registros, data]);

	const registrosOrdenados = useMemo(() => registros ?? [], [registros]);
	const pessoasDaData = (
		dia: string,
		grupo: "ALUNOS" | "MONITORES" | "PROFESSORES",
	): Pessoa[] => {
		const registro = registros?.find(
			(item) => item.data.toISOString().slice(0, 10) === dia,
		);
		if (grupo === "ALUNOS")
			return registro
				? registro.alunos.map((item) => ({
						id: item.alunoId,
						nome: item.aluno.nome,
						estado: item.estado,
					}))
				: (turma?.alunos ?? []).map((item) => ({
						id: item.aluno.id,
						nome: item.aluno.nome,
						estado: "PRESENTE",
					}));
		if (grupo === "MONITORES")
			return registro
				? registro.monitores.map((item) => ({
						id: item.monitorId,
						nome: item.monitor.nome,
						role: item.monitor.role,
						estado: item.estado,
					}))
				: (turma?.monitores ?? []).map((item) => ({
						id: item.user.id,
						nome: item.user.nome,
						role: item.user.role,
						estado: "PRESENTE",
					}));
		return registro
			? registro.professores.map((item) => ({
					id: item.professorId,
					nome: item.professor.nome,
					role: item.professor.role,
					estado: item.estado,
				}))
			: (turma?.professores ?? []).map((item) => ({
					id: item.user.id,
					nome: item.user.nome,
					role: item.user.role,
					estado: "PRESENTE",
				}));
	};
	const chaveRascunho = (
		grupo: "ALUNOS" | "MONITORES" | "PROFESSORES",
		id: string,
		dia: string,
	) => `${dia}:${grupo}:${id}`;
	const estadoExibido = (
		grupo: "ALUNOS" | "MONITORES" | "PROFESSORES",
		id: string,
		dia: string,
	) =>
		rascunhos[chaveRascunho(grupo, id, dia)] ??
		pessoasDaData(dia, grupo).find((item) => item.id === id)?.estado ??
		"PRESENTE";
	const alterarPresenca = (
		grupo: "ALUNOS" | "MONITORES" | "PROFESSORES",
		id: string,
		dia: string,
		estado: Estado,
	) =>
		setRascunhos((atual) => ({
			...atual,
			[chaveRascunho(grupo, id, dia)]: estado,
		}));
	const salvarPresencas = async () => {
		if (!turma || !Object.keys(rascunhos).length) return;
		const dias = [
			...new Set(Object.keys(rascunhos).map((chave) => chave.split(":")[0]!)),
		];
		await Promise.all(
			dias.map((dia) =>
				salvar.mutateAsync({
					turmaId: turma.id,
					data: new Date(`${dia}T12:00:00`),
					alunos: pessoasDaData(dia, "ALUNOS").map((item) => ({
						id: item.id,
						estado: estadoExibido("ALUNOS", item.id, dia),
					})),
					monitores: pessoasDaData(dia, "MONITORES").map((item) => ({
						id: item.id,
						estado: estadoExibido("MONITORES", item.id, dia),
					})),
					professores: pessoasDaData(dia, "PROFESSORES").map((item) => ({
						id: item.id,
						estado: estadoExibido("PROFESSORES", item.id, dia),
					})),
				}),
			),
		);
		setRascunhos({});
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
		salvarPresencas,
		rascunhos,
		salvar,
		datasDeAula,
		setGrupoAtivo,
		grupoAtivo,
		alunos,
		monitores,
		professores,
		estadoExibido,
		alterarPresenca,
		registrosOrdenados,
		setData,
		remover,
	};
}
