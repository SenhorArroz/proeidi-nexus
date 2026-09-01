"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
	BarChart3,
	ClipboardList,
	ExternalLink,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

export default function QuestionariosPage() {
	const utils = api.useUtils();
	const { data: formularios, isLoading } = api.formulario.list.useQuery();
	const [busca, setBusca] = useState("");
	const [confirmarExclusao, setConfirmarExclusao] = useState<{
		id: string;
		titulo: string;
		respostas: number;
	} | null>(null);
	const removerFormulario = api.formulario.remove.useMutation({
		onSuccess: async () => {
			await utils.formulario.list.invalidate();
			setConfirmarExclusao(null);
		},
	});
	const questionariosFiltrados = useMemo(() => {
		const termo = busca
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase();
		return (
			formularios?.filter((formulario) =>
				formulario.titulo
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
					.includes(termo),
			) ?? []
		);
	}, [busca, formularios]);
	return (
		<main className="min-h-full px-3 py-6 sm:px-4">
			<div className="mx-auto max-w-6xl">
				<DiretoriaBackLink />
				<DiretoriaPageIntro
					icon={ClipboardList}
					title="Questionários"
					description="Publique links públicos e acompanhe as respostas registradas."
					actions={
						<Link
							href="/nexus/diretoria/formularios"
							className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800"
						>
							<Plus className="h-4 w-4" />
							Novo questionário
						</Link>
					}
				/>
				<div className="relative mt-6">
					<Search
						aria-hidden="true"
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
					/>
					<input
						type="search"
						value={busca}
						onChange={(event) => setBusca(event.target.value)}
						placeholder="Buscar questionário por nome"
						className="min-h-11 w-full rounded-xl border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
					/>
				</div>
				<section className="mt-6 grid gap-4 md:grid-cols-2">
					{isLoading ? (
						<DataSkeleton cards={4} className="col-span-full" />
					) : questionariosFiltrados.length ? (
						questionariosFiltrados.map((formulario) => (
							<article
								key={formulario.id}
								className="min-w-0 rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,.06)] sm:p-5"
							>
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p
											className={`mb-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${formulario.publicado ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"}`}
										>
											{formulario.publicado ? "Publicado" : "Rascunho"}
										</p>
										{formulario.modoResposta === "IDENTIFICADO_POR_COOKIE" && (
											<p className="mb-2 ml-1 inline-flex rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-800">
												Identificado por navegador
											</p>
										)}
										<h2 className="break-words font-extrabold text-slate-900">
											{formulario.titulo}
										</h2>
										<p className="mt-1 break-words text-sm text-slate-500">
											{formulario.descricao || "Sem descrição"}
										</p>
									</div>
									<span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
										<BarChart3 className="h-5 w-5" />
									</span>
								</div>
								<div className="mt-5 flex flex-col items-stretch gap-3 border-t border-slate-100 pt-4 min-[420px]:flex-row min-[420px]:items-center min-[420px]:justify-between">
									<span className="text-sm font-semibold text-slate-600">
										{formulario._count.respostas} resposta(s)
									</span>
									<div className="flex flex-wrap gap-3">
										{formulario.publicado && (
											<Link
												href={`/questionarios/${formulario.slug}`}
												target="_blank"
												className="inline-flex items-center gap-1 text-sm font-bold text-sky-700"
											>
												<ExternalLink className="h-4 w-4" />
												Abrir link
											</Link>
										)}
										<Link
											href={`/nexus/diretoria/questionarios/${formulario.id}`}
											className="text-sm font-bold text-orange-700"
										>
											Estatísticas
										</Link>
										<Link
											href={`/nexus/diretoria/formularios?id=${formulario.id}`}
											className="inline-flex items-center gap-1 text-sm font-bold text-sky-700"
										>
											<Pencil className="h-4 w-4" />
											Editar
										</Link>
										<button
											type="button"
											onClick={() =>
												setConfirmarExclusao({
													id: formulario.id,
													titulo: formulario.titulo,
													respostas: formulario._count.respostas,
												})
											}
											className="inline-flex items-center gap-1 text-sm font-bold text-red-700"
										>
											<Trash2 className="h-4 w-4" />
											Excluir
										</button>
									</div>
								</div>
							</article>
						))
					) : formularios?.length ? (
						<p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
							Nenhum questionário encontrado para “{busca}”.
						</p>
					) : (
						<p className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-10 text-center text-sm text-sky-800">
							Ainda não há questionários. Crie o primeiro para gerar um link
							público.
						</p>
					)}
				</section>
				{confirmarExclusao && (
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="titulo-excluir-questionario"
						className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
					>
						<section className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2
										id="titulo-excluir-questionario"
										className="text-lg font-extrabold text-slate-900"
									>
										Excluir questionário?
									</h2>
									<p className="mt-2 text-sm text-slate-600">
										“{confirmarExclusao.titulo}” será apagado permanentemente
										{confirmarExclusao.respostas
											? `, incluindo ${confirmarExclusao.respostas} resposta(s)`
											: ""}
										.
									</p>
								</div>
								<button
									type="button"
									onClick={() => setConfirmarExclusao(null)}
									aria-label="Fechar"
									className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							{removerFormulario.error && (
								<p
									role="alert"
									className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
								>
									{removerFormulario.error.message}
								</p>
							)}
							<div className="mt-6 flex justify-end gap-3">
								<button
									type="button"
									onClick={() => setConfirmarExclusao(null)}
									className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-700 hover:bg-slate-100"
								>
									Cancelar
								</button>
								<button
									type="button"
									disabled={removerFormulario.isPending}
									onClick={() =>
										removerFormulario.mutate({ id: confirmarExclusao.id })
									}
									className="min-h-11 rounded-xl bg-red-600 px-4 text-sm font-extrabold text-white hover:bg-red-700 disabled:opacity-60"
								>
									{removerFormulario.isPending ? "Excluindo…" : "Excluir"}
								</button>
							</div>
						</section>
					</div>
				)}
			</div>
		</main>
	);
}
