"use client";
import {
	CalendarDays,
	ClipboardCheck,
	FileText,
	FolderOpen,
	Users,
} from "lucide-react";
import type React from "react";
import type { RouterOutputs } from "~/trpc/react";
import type { GestaoTurmaProps } from "./janela-gestao-turma";
import { MateriaisEditor } from "./materiais-editor";
import type { Aula } from "./suporte";
import { formatarData, type Turma } from "./suporte";

type VisaoGeralGestaoTurmaProps = {
	turma: GestaoTurmaProps["turma"];
	registrosPresenca:
		| RouterOutputs["diretoria"]["presencas"]["list"]
		| undefined;
	mediaPresenca: number;
	corTexto: string;
	corDescricao: string;
	onChange: GestaoTurmaProps["onChange"];
	semestres: GestaoTurmaProps["semestres"];
	corFundo: string;
	proximasAulas: Aula[];
};
export function VisaoGeralGestaoTurma({
	turma,
	registrosPresenca,
	mediaPresenca,
	corTexto,
	corDescricao,
	onChange,
	semestres,
	corFundo,
	proximasAulas,
}: VisaoGeralGestaoTurmaProps) {
	const camposDeCor: Array<{
		campo:
			| "cor"
			| "corDestaque"
			| "corFundo"
			| "corTexto"
			| "corTitulo"
			| "corDescricao";
		label: string;
		descricao: string;
	}> = [
		{ campo: "cor", label: "Cor principal", descricao: "Fundo do cabeçalho" },
		{
			campo: "corDestaque",
			label: "Cor de destaque",
			descricao: "Bola, ícones e ações",
		},
		{
			campo: "corFundo",
			label: "Cor de fundo",
			descricao: "Áreas de apoio",
		},
		{ campo: "corTitulo", label: "Cor do título", descricao: "Nome da turma" },
		{
			campo: "corTexto",
			label: "Cor do texto",
			descricao: "Conteúdo principal",
		},
		{
			campo: "corDescricao",
			label: "Cor secundária",
			descricao: "Descrições e legendas",
		},
	];

	return (
		<div className="view-visao-geral-gestao-turma space-y-7">
			<section className="grid gap-px overflow-hidden rounded-xl bg-slate-200 sm:grid-cols-2 lg:grid-cols-5">
				{[
					["Alunos", turma.alunoIds.length, Users],
					[
						"Presença média",
						registrosPresenca?.length ? `${mediaPresenca}%` : "—",
						ClipboardCheck,
					],
					["Materiais", turma.materiais.length, FolderOpen],
					["Notas", turma.notas, FileText],
					["Aulas registradas", turma.aulas.length, CalendarDays],
				].map(([label, value, Icon]) => {
					const MetricaIcon = Icon as React.ElementType;
					return (
						<div key={String(label)} className="min-h-28 bg-white p-4">
							<MetricaIcon
								className="mb-3 h-4 w-4"
								style={{ color: turma.corDestaque }}
							/>
							<p className="text-2xl font-bold" style={{ color: corTexto }}>
								{String(value)}
							</p>
							<p
								className="mt-1 text-xs font-semibold"
								style={{ color: corDescricao }}
							>
								{String(label)}
							</p>
						</div>
					);
				})}
			</section>

			<div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_19rem]">
				<section>
					<h2 className="text-lg font-bold">Dados da turma</h2>
					<label className="mt-4 block text-sm font-semibold">
						Limite de alunos
						<input
							type="number"
							min={1}
							max={300}
							step={1}
							value={turma.limiteAlunos || ""}
							onChange={(event) =>
								onChange({ ...turma, limiteAlunos: Number(event.target.value) })
							}
							className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
						/>
					</label>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						<label className="text-sm font-semibold">
							Semestre
							<select
								value={turma.semestreId ?? ""}
								onChange={(event) =>
									onChange({ ...turma, semestreId: event.target.value })
								}
								className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
							>
								<option value="">Selecione</option>
								{semestres.map((semestre) => (
									<option key={semestre.id} value={semestre.id}>
										{semestre.codigo}
									</option>
								))}
							</select>
						</label>
						<label className="text-sm font-semibold">
							Sala
							<input
								value={turma.sala}
								onChange={(event) =>
									onChange({ ...turma, sala: event.target.value })
								}
								placeholder="Ex.: Laboratório 2"
								className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
							/>
						</label>
						<label className="text-sm font-semibold">
							Horário
							<input
								value={turma.horario}
								onChange={(event) =>
									onChange({ ...turma, horario: event.target.value })
								}
								placeholder="Ex.: Terças, 14h"
								className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
							/>
						</label>
						<label className="text-sm font-semibold">
							Fonte
							<select
								value={turma.fonte}
								onChange={(event) =>
									onChange({
										...turma,
										fonte: event.target.value as Turma["fonte"],
									})
								}
								className="mt-1.5 block min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal"
							>
								<option value="SANS">Sem serifa</option>
								<option value="SERIF">Com serifa</option>
								<option value="MONO">Monoespaçada</option>
							</select>
						</label>
					</div>
					<section
						className="mt-7 rounded-xl p-4"
						style={{ backgroundColor: corFundo }}
					>
						<h3 className="text-base font-bold" style={{ color: corTexto }}>
							Cores da turma
						</h3>
						<p className="mt-1 text-sm" style={{ color: corDescricao }}>
							Personalize o cabeçalho e os elementos visuais da turma.
						</p>
						<div className="mt-4 grid gap-3 sm:grid-cols-2">
							{camposDeCor.map(({ campo, label, descricao }) => (
								<label
									key={campo}
									className="flex min-h-16 items-center gap-3 rounded-lg bg-white/80 px-3 py-2"
								>
									<input
										type="color"
										value={turma[campo]}
										onChange={(event) =>
											onChange({ ...turma, [campo]: event.target.value })
										}
										className="h-10 w-10 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
										aria-label={label}
									/>
									<span className="min-w-0">
										<span
											className="block text-sm font-semibold"
											style={{ color: corTexto }}
										>
											{label}
										</span>
										<span
											className="block text-xs"
											style={{ color: corDescricao }}
										>
											{descricao} · {turma[campo].toUpperCase()}
										</span>
									</span>
								</label>
							))}
						</div>
					</section>
				</section>
				<section
					className="rounded-xl p-4"
					style={{ backgroundColor: corFundo }}
				>
					<h2 className="text-base font-bold" style={{ color: corTexto }}>
						Próximas aulas
					</h2>
					<div className="mt-3 space-y-2">
						{proximasAulas.length ? (
							proximasAulas.map((aula) => (
								<div
									key={aula.id}
									className="flex items-center justify-between gap-3 rounded-lg bg-white/70 px-3 py-2"
								>
									<span
										className="truncate text-sm font-semibold"
										style={{ color: corTexto }}
									>
										{aula.titulo}
									</span>
									<time
										className="shrink-0 text-xs font-bold"
										style={{ color: turma.corDestaque }}
									>
										{formatarData(aula.data)}
									</time>
								</div>
							))
						) : (
							<p className="text-sm" style={{ color: corDescricao }}>
								Nenhuma aula futura registrada.
							</p>
						)}
					</div>
				</section>
			</div>

			<section>
				<MateriaisEditor
					materiais={turma.materiais}
					onChange={(materiais) => onChange({ ...turma, materiais })}
				/>
			</section>
		</div>
	);
}
