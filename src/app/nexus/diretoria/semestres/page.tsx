"use client";

import { useState } from "react";
import {
	CalendarDays,
	CheckCircle2,
	GraduationCap,
	Plus,
	ShieldCheck,
	Trash2,
	Users,
} from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

export default function SemestresDiretoria() {
	const utils = api.useUtils();
	const { data: semestres, isLoading } =
		api.diretoria.semestres.list.useQuery();
	const [codigo, setCodigo] = useState("");
	const [erro, setErro] = useState("");
	const atualizar = () => utils.diretoria.semestres.list.invalidate();
	const criar = api.diretoria.semestres.create.useMutation({
		onSuccess: () => {
			setCodigo("");
			setErro("");
			atualizar();
		},
		onError: (e) => setErro(e.message),
	});
	const ativar = api.diretoria.semestres.setAtivo.useMutation({
		onSuccess: atualizar,
	});
	const remover = api.diretoria.semestres.remove.useMutation({
		onSuccess: atualizar,
		onError: (e) => setErro(e.message),
	});

	return (
		<div className="min-h-screen w-full min-w-0 bg-gray-50 px-3 py-6 font-sans sm:px-4 sm:py-10">
			<div className="mx-auto w-full max-w-5xl">
				<DiretoriaBackLink />
				<div className="mb-6"><DiretoriaPageIntro icon={CalendarDays} title="Gerenciar semestres" description="Defina o período ativo e acompanhe as pessoas vinculadas pelas turmas." /></div>

				<div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
						<label className="min-w-0 flex-1">
							<span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
								Novo semestre
							</span>
							<input
								value={codigo}
								onChange={(e) => setCodigo(e.target.value)}
								placeholder="Ex.: 2027.1"
								pattern="\d{4}\.[12]"
								className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm outline-none focus:border-teal-500"
							/>
						</label>
						<button
							onClick={() => criar.mutate({ codigo })}
							disabled={criar.isPending || !codigo}
							className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-sky-200 hover:bg-sky-700 disabled:opacity-50"
						>
							<Plus className="h-4 w-4" />
							Adicionar
						</button>
					</div>
					{erro && (
						<p role="alert" className="mt-3 text-sm text-red-600">
							{erro}
						</p>
					)}
				</div>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{isLoading ? (
						<DataSkeleton cards={6} className="col-span-full" />
					) : (
						semestres?.map((semestre) => (
							<div
								key={semestre.id}
								className="group relative overflow-hidden rounded-2xl bg-white shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]"
							>
								<div className="relative flex items-center justify-between overflow-hidden bg-sky-600 px-5 py-4 text-white"><div className="absolute -right-5 -top-8 h-20 w-20 rounded-full bg-orange-500" />
									<div className="relative">
										<p className="text-lg font-semibold">{semestre.codigo}</p>
										{semestre.ativo && (
											<span className="mt-1 inline-flex items-center gap-1 text-xs text-white/90">
												<CheckCircle2 className="h-3.5 w-3.5" />
												Semestre ativo
											</span>
										)}
									</div>
									<CalendarDays className="relative h-5 w-5 text-white/75" />
								</div>
								<div className="grid grid-cols-1 gap-2 p-4 text-center min-[390px]:grid-cols-3 sm:p-5">
									<Resumo
										icon={GraduationCap}
										valor={semestre.totalAlunos}
										label="Alunos"
									/>
									<Resumo
										icon={Users}
										valor={semestre.totalProfessores}
										label="Professores"
									/>
									<Resumo
										icon={ShieldCheck}
										valor={semestre.totalMonitores}
										label="Monitores"
									/>
								</div>
								<p className="px-5 pb-3 text-center text-xs text-gray-500">
									{semestre.totalTurmas} turma(s) cadastrada(s)
								</p>
								<div className="flex flex-wrap gap-2 border-t border-gray-100 p-3">
									{!semestre.ativo && (
										<button
											onClick={() => ativar.mutate({ id: semestre.id })}
											className="min-h-11 min-w-32 flex-1 rounded-lg bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-100"
										>
											Tornar ativo
										</button>
									)}
									<button
										onClick={() => {
											if (confirm(`Excluir o semestre ${semestre.codigo}?`))
												remover.mutate({ id: semestre.id });
										}}
										disabled={
											semestre.ativo ||
											semestre.totalTurmas > 0 ||
											semestre.totalAlunos > 0
										}
										title={
											semestre.ativo
												? "Não é possível excluir o semestre ativo"
												: "Semestres com dados não podem ser excluídos"
										}
										className="grid min-h-11 min-w-11 place-items-center rounded-lg px-3 py-2 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</div>
	);
}

function Resumo({
	icon: Icon,
	valor,
	label,
}: {
	icon: typeof Users;
	valor: number;
	label: string;
}) {
	return (
		<div>
			<Icon className="mx-auto mb-1 h-4 w-4 text-amber-600" />
			<p className="text-lg font-bold text-gray-900">{valor}</p>
			<p className="text-[10px] uppercase tracking-wide text-gray-400">
				{label}
			</p>
		</div>
	);
}
