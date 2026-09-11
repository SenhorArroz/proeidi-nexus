"use client";
import { EquipeGestaoTurma } from "./equipe-gestao-turma";
import { VisaoGeralGestaoTurma } from "./visao-geral-gestao-turma";
export type GestaoTurmaProps = {
	turma: Turma;
	semestres: Array<{ id: string; codigo: string }>;
	alunosDb: Array<{
		id: string;
		nome: string;
		email?: string | null;
		telefone?: string | null;
	}>;
	docentesDb: Array<{ id: string; nome: string; email?: string | null }>;
	monitoresDb: Array<{ id: string; nome: string; email?: string | null }>;
	onChange: (turma: Turma) => void;
	onVoltar: () => void;
	onSalvar: () => void | Promise<void>;
	salvando: boolean;
};

import {
	ArrowLeft,
	CalendarDays,
	Check,
	DoorOpen,
	ShieldCheck,
	TriangleAlert,
} from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";
import { api } from "~/trpc/react";
import { AulasEditor } from "./aulas-editor";
import { type AbaGestaoTurma, luminosidadeHex, type Turma } from "./suporte";

export function JanelaGestaoTurma({
	turma,
	semestres,
	alunosDb: _alunosDb,
	docentesDb,
	monitoresDb,
	onChange,
	onVoltar,
	onSalvar,
	salvando,
}: GestaoTurmaProps) {
	const { theme } = useAccessibility();
	const [aba, setAba] = useState<AbaGestaoTurma>("visao");
	const corTexto =
		theme === "dark" && luminosidadeHex(turma.corTexto) < 0.42
			? "#e5edf8"
			: turma.corTexto;
	const corDescricao =
		theme === "dark" && luminosidadeHex(turma.corDescricao) < 0.36
			? "#b9c9dd"
			: turma.corDescricao;
	const corFundo =
		theme === "dark" && luminosidadeHex(turma.corFundo) > 0.55
			? "#162033"
			: turma.corFundo;
	const { data: registrosPresenca } = api.diretoria.presencas.list.useQuery(
		{ turmaId: turma.id || "c0000000000000000000000000" },
		{ enabled: Boolean(turma.id) },
	);

	const estadosAlunos =
		registrosPresenca?.flatMap((registro) => registro.alunos) ?? [];
	const mediaPresenca = estadosAlunos.length
		? Math.round(
				(estadosAlunos.filter((presenca) => presenca.estado === "PRESENTE")
					.length /
					estadosAlunos.length) *
					100,
			)
		: 0;
	const hoje = new Date().toISOString().slice(0, 10);
	const proximasAulas = turma.aulas
		.filter((aula) => aula.data >= hoje)
		.slice(0, 4);
	const pessoaOptions = (
		pessoas: Array<{ id: string; nome: string; email?: string | null }>,
	) =>
		pessoas.map((pessoa) => ({
			id: pessoa.id,
			nome: pessoa.nome,
			detalhe: pessoa.email ?? undefined,
		}));
	const atualizarIds = (
		campo: "professorIds" | "monitorIds",
		ids: string[],
	) => {
		const fonte = campo === "professorIds" ? docentesDb : monitoresDb;
		const campoNomes = campo === "professorIds" ? "professores" : "monitores";
		onChange({
			...turma,
			[campo]: ids,
			[campoNomes]: ids
				.map((id) => fonte.find((pessoa) => pessoa.id === id)?.nome)
				.filter(Boolean) as string[],
		});
	};

	const abas: Array<{
		id: AbaGestaoTurma;
		label: string;
		Icon: React.ElementType;
	}> = [
		{ id: "visao", label: "Visão geral", Icon: DoorOpen },
		{ id: "equipe", label: "Equipe", Icon: ShieldCheck },
		{ id: "calendario", label: "Calendário", Icon: CalendarDays },
	];

	return (
		<div
			className="view-nexus-diretoria-turmas-janela-gestao-turma turma-tema diretoria-page-canvas min-h-full w-full px-3 py-3 text-slate-900 sm:px-6 sm:py-6"
			style={{ "--turma-destaque": turma.corDestaque } as React.CSSProperties}
		>
			<div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_55px_rgba(15,23,42,.14)]">
				<header
					className="relative overflow-hidden px-4 py-5 sm:px-7 sm:py-7"
					style={{ backgroundColor: turma.cor }}
				>
					<div
						className="absolute -right-10 -top-12 h-44 w-44 rounded-full opacity-70"
						style={{ backgroundColor: turma.corDestaque }}
					/>
					<div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div className="min-w-0">
							<button
								onClick={onVoltar}
								className="mb-4 inline-flex min-h-10 items-center gap-2 rounded-lg px-2 text-sm font-semibold hover:bg-white/15"
								style={{ color: turma.corTitulo }}
							>
								<ArrowLeft className="h-4 w-4" /> Voltar para turmas
							</button>
							<input
								value={turma.titulo}
								onChange={(event) =>
									onChange({ ...turma, titulo: event.target.value })
								}
								placeholder="Nome da turma"
								className="block w-full max-w-2xl border-0 bg-transparent p-0 text-2xl font-bold outline-none placeholder:text-white/70 sm:text-3xl"
								style={{ color: turma.corTitulo }}
							/>
							<div
								className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium"
								style={{ color: turma.corTitulo }}
							>
								<span>
									{semestres.find(
										(semestre) => semestre.id === turma.semestreId,
									)?.codigo ?? "Selecione o semestre"}
								</span>
								<span>{turma.sala || "Sala não definida"}</span>
								<span>{turma.horario || "Horário não definido"}</span>
							</div>
						</div>
						<button
							onClick={() => void onSalvar()}
							disabled={salvando || !turma.titulo.trim() || !turma.semestreId}
							className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-bold shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
							style={{ color: turma.cor }}
						>
							<Check className="h-4 w-4" />{" "}
							{salvando ? "Salvando…" : "Salvar alterações"}
						</button>
					</div>
				</header>

				<nav
					className="flex overflow-x-auto border-b border-slate-200 px-2"
					aria-label="Seções da turma"
				>
					{abas.map(({ id, label, Icon }) => (
						<button
							key={id}
							onClick={() => setAba(id)}
							className="flex min-h-13 shrink-0 items-center gap-2 border-b-2 px-4 text-sm font-semibold transition"
							style={{
								borderColor: aba === id ? turma.corDestaque : "transparent",
								color: aba === id ? turma.corDestaque : undefined,
							}}
						>
							<Icon className="h-4 w-4" />
							{label}
						</button>
					))}
				</nav>

				<div className="p-4 sm:p-7">
					{turma.limiteAlunos > 0 &&
						turma.alunoIds.length > turma.limiteAlunos && (
							<div
								role="alert"
								className="mb-6 flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
							>
								<TriangleAlert
									aria-hidden="true"
									className="mt-0.5 h-5 w-5 shrink-0"
								/>
								<div className="min-w-0">
									<p className="font-bold">Limite de alunos excedido</p>
									<p className="mt-1 text-sm">
										Esta turma tem limite de {turma.limiteAlunos}{" "}
										{turma.limiteAlunos === 1 ? "aluno" : "alunos"}, mas você
										selecionou {turma.alunoIds.length}. O limite foi excedido em{" "}
										{turma.alunoIds.length - turma.limiteAlunos}{" "}
										{turma.alunoIds.length - turma.limiteAlunos === 1
											? "aluno"
											: "alunos"}
										.
									</p>
									<p className="mt-2 text-sm">
										Ajuste os vínculos pela lista de alunos ou altere o limite
										na aba Visão geral.
									</p>
								</div>
							</div>
						)}
					{aba === "visao" && (
						<VisaoGeralGestaoTurma
							turma={turma}
							registrosPresenca={registrosPresenca}
							mediaPresenca={mediaPresenca}
							corTexto={corTexto}
							corDescricao={corDescricao}
							onChange={onChange}
							semestres={semestres}
							corFundo={corFundo}
							proximasAulas={proximasAulas}
						/>
					)}

					{aba === "equipe" && (
						<EquipeGestaoTurma
							turma={turma}
							atualizarIds={atualizarIds}
							pessoaOptions={pessoaOptions}
							docentesDb={docentesDb}
							monitoresDb={monitoresDb}
							corFundo={corFundo}
							corTexto={corTexto}
							corDescricao={corDescricao}
						/>
					)}

					{aba === "calendario" && (
						<div className="space-y-7">
							<section
								className="rounded-xl p-4"
								style={{ backgroundColor: corFundo }}
							>
								<h2 className="text-lg font-bold" style={{ color: corTexto }}>
									Calendário de aulas
								</h2>
								<p className="mt-1 text-sm" style={{ color: corDescricao }}>
									Cadastre as aulas e atualize datas ou títulos quando
									necessário.
								</p>
							</section>
							<AulasEditor
								aulas={turma.aulas}
								onChange={(aulas) => onChange({ ...turma, aulas })}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
