"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ClipboardCheck, Trash2, Users } from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { PresenceGrid, type EstadoPresenca, type PessoaPresenca } from "~/app/_components/diretoria/presence-grid";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

type Estado = EstadoPresenca;
type Pessoa = PessoaPresenca;
const hoje = () => new Date().toISOString().slice(0, 10);

export default function GerenciarPresencas() {
	const utils = api.useUtils();
	const { data: semestres, isLoading: carregandoSemestres } = api.diretoria.semestres.list.useQuery();
	const [semestreId, setSemestreId] = useState("");
	const semestre = semestres?.find((item) => item.id === semestreId) ?? semestres?.find((item) => item.ativo) ?? semestres?.[0];
	const { data: turmas, isLoading: carregandoTurmas } = api.diretoria.turmas.list.useQuery(semestre ? { semestreId: semestre.id } : undefined, { enabled: Boolean(semestre) });
	const [turmaId, setTurmaId] = useState("");
	const turma = turmas?.find((item) => item.id === turmaId) ?? turmas?.[0];
	const { data: registros, isLoading: carregandoRegistros } = api.diretoria.presencas.list.useQuery({ turmaId: turma?.id ?? "c0000000000000000000000000" }, { enabled: Boolean(turma) });
	const salvar = api.diretoria.presencas.salvar.useMutation({ onSuccess: () => utils.diretoria.presencas.list.invalidate() });
	const remover = api.diretoria.presencas.remove.useMutation({ onSuccess: () => utils.diretoria.presencas.list.invalidate() });
	const [data, setData] = useState(hoje());
	const [grupoAtivo, setGrupoAtivo] = useState<"ALUNOS" | "MONITORES" | "PROFESSORES">("ALUNOS");
	const [rascunhos, setRascunhos] = useState<Record<string, Estado>>({});
	const datasDeAula = useMemo(() => (turma?.eventos ?? []).filter((evento) => evento.tipo === "AULA").map((evento) => evento.data.toISOString().slice(0, 10)).sort(), [turma]);
	const [alunos, setAlunos] = useState<Pessoa[]>([]);
	const [monitores, setMonitores] = useState<Pessoa[]>([]);
	const [professores, setProfessores] = useState<Pessoa[]>([]);

	useEffect(() => { if (!semestreId && semestre) setSemestreId(semestre.id); }, [semestre, semestreId]);
	useEffect(() => { if (!turmaId && turma) setTurmaId(turma.id); }, [turma, turmaId]);
	useEffect(() => { if (datasDeAula.length && !datasDeAula.includes(data)) setData(datasDeAula[0]!); }, [datasDeAula, data]);
	useEffect(() => {
		if (!turma) return;
		const registro = registros?.find((item) => item.data.toISOString().slice(0, 10) === data);
		setAlunos(registro ? registro.alunos.map((item) => ({ id: item.alunoId, nome: item.aluno.nome, estado: item.estado })) : turma.alunos.map((item) => ({ id: item.aluno.id, nome: item.aluno.nome, estado: "PRESENTE" })));
		setMonitores(registro ? registro.monitores.map((item) => ({ id: item.monitorId, nome: item.monitor.nome, role: item.monitor.role, estado: item.estado })) : turma.monitores.map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" })));
		setProfessores(registro ? registro.professores.map((item) => ({ id: item.professorId, nome: item.professor.nome, role: item.professor.role, estado: item.estado })) : turma.professores.map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" })));
	}, [turma, registros, data]);

	const registrosOrdenados = useMemo(() => registros ?? [], [registros]);
	const pessoasDaData = (dia: string, grupo: "ALUNOS" | "MONITORES" | "PROFESSORES"): Pessoa[] => {
		const registro = registros?.find((item) => item.data.toISOString().slice(0, 10) === dia);
		if (grupo === "ALUNOS") return registro ? registro.alunos.map((item) => ({ id: item.alunoId, nome: item.aluno.nome, estado: item.estado })) : (turma?.alunos ?? []).map((item) => ({ id: item.aluno.id, nome: item.aluno.nome, estado: "PRESENTE" }));
		if (grupo === "MONITORES") return registro ? registro.monitores.map((item) => ({ id: item.monitorId, nome: item.monitor.nome, role: item.monitor.role, estado: item.estado })) : (turma?.monitores ?? []).map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" }));
		return registro ? registro.professores.map((item) => ({ id: item.professorId, nome: item.professor.nome, role: item.professor.role, estado: item.estado })) : (turma?.professores ?? []).map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" }));
	};
	const chaveRascunho = (grupo: "ALUNOS" | "MONITORES" | "PROFESSORES", id: string, dia: string) => `${dia}:${grupo}:${id}`;
	const estadoExibido = (grupo: "ALUNOS" | "MONITORES" | "PROFESSORES", id: string, dia: string) => rascunhos[chaveRascunho(grupo, id, dia)] ?? pessoasDaData(dia, grupo).find((item) => item.id === id)?.estado ?? "PRESENTE";
	const alterarPresenca = (grupo: "ALUNOS" | "MONITORES" | "PROFESSORES", id: string, dia: string, estado: Estado) => setRascunhos((atual) => ({ ...atual, [chaveRascunho(grupo, id, dia)]: estado }));
	const salvarPresencas = async () => { if (!turma || !Object.keys(rascunhos).length) return; const dias = [...new Set(Object.keys(rascunhos).map((chave) => chave.split(":")[0]!))]; await Promise.all(dias.map((dia) => salvar.mutateAsync({ turmaId: turma.id, data: new Date(`${dia}T12:00:00`), alunos: pessoasDaData(dia, "ALUNOS").map((item) => ({ id: item.id, estado: estadoExibido("ALUNOS", item.id, dia) })), monitores: pessoasDaData(dia, "MONITORES").map((item) => ({ id: item.id, estado: estadoExibido("MONITORES", item.id, dia) })), professores: pessoasDaData(dia, "PROFESSORES").map((item) => ({ id: item.id, estado: estadoExibido("PROFESSORES", item.id, dia) })) }))); setRascunhos({}); };

	if (carregandoSemestres || carregandoTurmas || carregandoRegistros) return <main className="min-h-full px-4 py-6" aria-busy="true"><div className="mx-auto max-w-6xl space-y-6"><DiretoriaBackLink /><DiretoriaPageIntro icon={ClipboardCheck} title="Gerenciar presenças" description="Controle oficial de alunos, monitores, professores e diretores docentes." /><DataSkeleton rows={7} /></div></main>;

	return <main className="min-h-full px-4 py-6"><div className="mx-auto max-w-6xl space-y-6"><DiretoriaBackLink />
		<DiretoriaPageIntro icon={ClipboardCheck} title="Gerenciar presenças" description="Controle oficial de alunos, monitores, professores e diretores docentes." />
		<section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2"><label className="text-sm font-medium text-gray-600">Semestre<select value={semestre?.id ?? ""} onChange={(e) => { setSemestreId(e.target.value); setTurmaId(""); }} className="mt-1 block w-full rounded-lg border border-gray-200 p-2">{semestres?.map((item) => <option key={item.id} value={item.id}>{item.codigo}</option>)}</select></label><label className="text-sm font-medium text-gray-600">Turma<select value={turma?.id ?? ""} onChange={(e) => setTurmaId(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-200 p-2">{turmas?.map((item) => <option key={item.id} value={item.id}>{item.titulo}</option>)}</select></label></section>
		{turma ? <><div className="flex items-center justify-between gap-3 text-sm text-gray-600"><div className="flex items-center gap-2"><Users className="h-4 w-4" />{turma.titulo}</div><button onClick={() => void salvarPresencas()} disabled={!Object.keys(rascunhos).length || salvar.isPending} className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check className="h-4 w-4" />{salvar.isPending ? "Salvando..." : "Salvar presenças"}</button></div>{!datasDeAula.length && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">Cadastre ao menos uma aula na turma para registrar presenças.</p>}<div className="flex flex-wrap gap-2 border-b border-gray-200"><button onClick={() => setGrupoAtivo("ALUNOS")} className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "ALUNOS" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Alunos ({alunos.length})</button><button onClick={() => setGrupoAtivo("MONITORES")} className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "MONITORES" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Monitores ({monitores.length})</button><button onClick={() => setGrupoAtivo("PROFESSORES")} className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "PROFESSORES" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}>Professores e diretores ({professores.length})</button></div>{grupoAtivo === "ALUNOS" ? <PresenceGrid titulo="Alunos" pessoas={turma.alunos.map((item) => ({ id: item.aluno.id, nome: item.aluno.nome, estado: "PRESENTE" }))} datas={datasDeAula} estadoNaData={(id, dia) => estadoExibido("ALUNOS", id, dia)} onAlterar={(id, dia, estado) => alterarPresenca("ALUNOS", id, dia, estado)} /> : grupoAtivo === "MONITORES" ? <PresenceGrid titulo="Monitores" pessoas={turma.monitores.map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" }))} datas={datasDeAula} estadoNaData={(id, dia) => estadoExibido("MONITORES", id, dia)} onAlterar={(id, dia, estado) => alterarPresenca("MONITORES", id, dia, estado)} /> : <PresenceGrid titulo="Professores e diretores" pessoas={turma.professores.map((item) => ({ id: item.user.id, nome: item.user.nome, role: item.user.role, estado: "PRESENTE" }))} datas={datasDeAula} estadoNaData={(id, dia) => estadoExibido("PROFESSORES", id, dia)} onAlterar={(id, dia, estado) => alterarPresenca("PROFESSORES", id, dia, estado)} />}
			<section className="rounded-2xl border border-gray-200 bg-white"><div className="flex items-center gap-2 border-b border-gray-100 px-5 py-3"><CalendarDays className="h-4 w-4 text-sky-600" /><h2 className="font-semibold text-gray-800">Registros desta turma</h2></div><div className="divide-y divide-gray-100">{registrosOrdenados.length ? registrosOrdenados.map((registro) => <div key={registro.id} className="flex items-center justify-between px-5 py-3"><button onClick={() => setData(registro.data.toISOString().slice(0, 10))} className="text-sm font-medium text-sky-700 hover:underline">{registro.data.toLocaleDateString("pt-BR")}</button><span className="text-xs text-gray-500">{registro.alunos.length} alunos · {registro.monitores.length} monitores · {registro.professores.length} docentes</span><button onClick={() => { if (confirm("Excluir este registro de presença?")) remover.mutate({ id: registro.id, turmaId: turma.id }); }} className="rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></button></div>) : <p className="px-5 py-6 text-sm text-gray-400">Nenhuma presença registrada para esta turma.</p>}</div></section></> : <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">Selecione um semestre e uma turma para gerenciar as presenças.</p>}</div></main>;
}
