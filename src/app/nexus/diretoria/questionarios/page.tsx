"use client";
import Link from "next/link";
import { BarChart3, ClipboardList, ExternalLink, Plus } from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

export default function QuestionariosPage() {
	const { data: formularios, isLoading } = api.formulario.list.useQuery();
	return (
		<main className="min-h-full px-4 py-6">
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
				<section className="mt-6 grid gap-4 md:grid-cols-2">
					{isLoading ? (
						<DataSkeleton cards={4} className="col-span-full" />
					) : formularios?.length ? (
						formularios.map((formulario) => (
							<article
								key={formulario.id}
								className="rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,.06)]"
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p
											className={`mb-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${formulario.publicado ? "bg-green-50 text-green-800" : "bg-orange-50 text-orange-800"}`}
										>
											{formulario.publicado ? "Publicado" : "Rascunho"}
										</p>
										<h2 className="font-extrabold text-slate-900">
											{formulario.titulo}
										</h2>
										<p className="mt-1 text-sm text-slate-500">
											{formulario.descricao || "Sem descrição"}
										</p>
									</div>
									<span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
										<BarChart3 className="h-5 w-5" />
									</span>
								</div>
								<div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
									<span className="text-sm font-semibold text-slate-600">
										{formulario._count.respostas} resposta(s)
									</span>
									<div className="flex gap-3">
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
									</div>
								</div>
							</article>
						))
					) : (
						<p className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-10 text-center text-sm text-sky-800">
							Ainda não há questionários. Crie o primeiro para gerar um link
							público.
						</p>
					)}
				</section>
			</div>
		</main>
	);
}
