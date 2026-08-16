"use client";

import Link from "next/link";
import {
	CalendarDays,
	ChevronRight,
	Clock3,
	DoorOpen,
	GraduationCap,
	MapPin,
	ShieldCheck,
	Sparkles,
	Users,
} from "lucide-react";
import { api } from "~/trpc/react";

const dataFormatada = (data?: Date) =>
	data
		? new Intl.DateTimeFormat("pt-BR", {
				weekday: "short",
				day: "2-digit",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			}).format(data)
		: "Sem próxima aula";

export default function Dashboard() {
	const { data, isLoading } = api.turma.minhas.useQuery();
	const usuario = data?.usuario;
	const turmas = data?.turmas ?? [];
	const cargo =
		usuario?.role === "MONITOR"
			? "Monitor"
			: usuario?.role === "COORDENADOR"
				? "Coordenação"
				: usuario?.role === "DIRETOR"
					? "Diretoria"
					: "Professor";
	const IconeCargo = usuario?.role === "MONITOR" ? ShieldCheck : GraduationCap;
	return (
		<main className="min-h-full min-w-0 overflow-x-clip bg-[radial-gradient(circle_at_95%_0%,rgba(14,165,233,.14),transparent_25rem),radial-gradient(circle_at_76%_12rem,rgba(249,115,22,.1),transparent_19rem),#f8fafc] px-4 py-7 sm:px-7 lg:px-10">
			<div className="mx-auto max-w-6xl">
				<header className="relative overflow-hidden rounded-2xl bg-sky-600 px-6 py-7 text-white shadow-[0_20px_45px_rgba(2,132,199,.22)] sm:px-8">
					<div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-orange-500" />
					<div className="absolute right-36 bottom-[-3rem] h-28 w-28 rounded-full border-[14px] border-sky-200/80" />
					<div className="relative">
						<div className="mb-3 flex items-center gap-2 text-sm font-semibold text-sky-100">
							<Sparkles className="h-4 w-4 text-orange-200" />
							Seu espaço de trabalho
						</div>
						<h1 className="text-2xl font-black tracking-[-.035em] sm:text-3xl">
							Olá, {usuario?.nome ?? ""}
						</h1>
						<p className="mt-2 max-w-xl text-sm leading-6 text-sky-100">
							Acesse suas turmas, acompanhe as próximas aulas e continue o
							trabalho pedagógico de onde parou.
						</p>
						<span className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold">
							<IconeCargo className="h-4 w-4" />
							{cargo}
						</span>
					</div>
				</header>
				<section className="mt-8">
					<div className="mb-4 flex items-end justify-between gap-3">
						<div>
							<h2 className="text-lg font-black tracking-[-.025em] text-slate-900">
								Suas turmas
							</h2>
							<p className="mt-1 text-sm text-slate-500">
								Escolha uma turma para abrir seus materiais, calendário e
								atividades.
							</p>
						</div>
						<span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
							{turmas.length} {turmas.length === 1 ? "turma" : "turmas"}
						</span>
					</div>
					{isLoading ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{Array.from({ length: 3 }).map((_, index) => (
								<div
									key={index}
									className="h-52 animate-pulse rounded-2xl bg-sky-100"
								/>
							))}
						</div>
					) : turmas.length ? (
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{turmas.map((turma) => (
								<Link
									key={turma.id}
									href={`/nexus/dashboard/turmas/${turma.id}`}
									className="group overflow-hidden rounded-2xl bg-white shadow-[0_12px_27px_rgba(15,23,42,.07)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_35px_rgba(2,132,199,.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
								>
									<div className="relative bg-sky-600 px-5 py-5">
										<div className="absolute -right-6 -bottom-9 h-28 w-28 rounded-full bg-orange-500" />
										<div className="relative flex items-start justify-between gap-4">
											<span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
												<DoorOpen className="h-5 w-5 text-white" />
											</span>
											<ChevronRight className="mt-1 h-5 w-5 text-white/75 transition group-hover:translate-x-1" />
										</div>
										<h3 className="relative mt-5 truncate text-base font-black tracking-[-.02em] text-white">
											{turma.titulo}
										</h3>
										<p className="relative mt-1 text-xs font-semibold text-sky-100">
											{turma.semestre.codigo}
										</p>
									</div>
									<div className="space-y-3 p-5 text-sm text-slate-600">
										<p className="flex items-center gap-2">
											<MapPin className="h-4 w-4 text-orange-600" />
											{turma.sala || "Local a definir"}
										</p>
										<p className="flex items-center gap-2">
											<Users className="h-4 w-4 text-sky-600" />
											{turma.alunos.length} alunos
										</p>
										<p className="flex items-center gap-2 border-t border-slate-100 pt-3 font-semibold text-slate-700">
											<Clock3 className="h-4 w-4 text-sky-600" />
											{dataFormatada(turma.eventos[0]?.data)}
										</p>
									</div>
								</Link>
							))}
						</div>
					) : (
						<div className="rounded-2xl border border-dashed border-sky-200 bg-white px-6 py-14 text-center">
							<CalendarDays className="mx-auto h-8 w-8 text-orange-500" />
							<h3 className="mt-4 font-bold text-slate-800">
								Nenhuma turma disponível
							</h3>
							<p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
								Quando você for vinculado a uma turma, ela aparecerá aqui
								automaticamente.
							</p>
						</div>
					)}
				</section>
			</div>
		</main>
	);
}
