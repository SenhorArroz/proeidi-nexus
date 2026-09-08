"use client";
import { TurmaDashboardCard } from "./_components/turma-dashboard-card";

import { CalendarDays, GraduationCap, ShieldCheck } from "lucide-react";
import { api } from "~/trpc/react";

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
		<main className="nexus-dashboard relative isolate min-h-full min-w-0 overflow-hidden bg-[radial-gradient(circle_at_95%_0%,rgba(14,165,233,.14),transparent_25rem),radial-gradient(circle_at_76%_12rem,rgba(249,115,22,.1),transparent_19rem),#f8fafc] px-3 py-5 sm:px-7 sm:py-7 lg:px-10">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 overflow-hidden"
			>
				<span className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-sky-600/25 blur-3xl" />
				<span className="absolute -bottom-40 -left-28 h-[28rem] w-[28rem] rounded-full bg-amber-600/20 blur-3xl" />
			</div>
			<div className="relative z-10 mx-auto max-w-6xl">
				<header className="relative min-w-0 overflow-hidden rounded-2xl bg-sky-600 px-4 py-6 text-white shadow-[0_20px_45px_rgba(2,132,199,.22)] sm:px-8 sm:py-7">
					<div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-orange-500" />
					<div className="absolute right-36 bottom-[-3rem] h-28 w-28 rounded-full border-[14px] border-sky-200/80" />
					<div className="relative">
						<h1 className="break-words text-2xl font-black tracking-[-.035em] sm:text-3xl">
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
					<div className="mb-4 flex min-w-0 flex-col items-start gap-3 min-[420px]:flex-row min-[420px]:items-end min-[420px]:justify-between">
						<div>
							<h2 className="text-lg font-black tracking-[-.025em] text-slate-900">
								Suas turmas
							</h2>
							<p className="mt-1 text-sm text-slate-500">
								Escolha uma turma para abrir seus materiais, calendário e
								atividades.
							</p>
						</div>
						<span className="shrink-0 rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-800">
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
								<TurmaDashboardCard key={turma.id} turma={turma} />
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
