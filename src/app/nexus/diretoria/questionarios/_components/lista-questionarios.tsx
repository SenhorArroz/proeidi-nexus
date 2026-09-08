"use client";
import { BarChart3, ExternalLink, Pencil, QrCode, Trash2 } from "lucide-react";
import Link from "next/link";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { useQuestionariosPage } from "./use-questionarios-page";

type Estado = ReturnType<typeof useQuestionariosPage>;
type ListaQuestionariosProps = {
	isLoading: NonNullable<Estado["isLoading"]>;
	questionariosFiltrados: NonNullable<Estado["questionariosFiltrados"]>;
	setQuestionarioQr: NonNullable<Estado["setQuestionarioQr"]>;
	setConfirmarExclusao: NonNullable<Estado["setConfirmarExclusao"]>;
	formularios: Estado["formularios"];
	busca: NonNullable<Estado["busca"]>;
};

export function ListaQuestionarios({
	isLoading,
	questionariosFiltrados,
	setQuestionarioQr,
	setConfirmarExclusao,
	formularios,
	busca,
}: ListaQuestionariosProps) {
	return (
		<section className="view-diretoria-questionarios-lista-questionarios mt-6 grid gap-4 md:grid-cols-2">
			{isLoading ? (
				<DataSkeleton cards={4} className="col-span-full" />
			) : questionariosFiltrados.length ? (
				questionariosFiltrados.map((formulario, indice) => (
					<div key={formulario.id} className="contents">
						{(indice === 0 ||
							questionariosFiltrados[indice - 1]?.visibilidade !==
								formulario.visibilidade) && (
							<h2 className="col-span-full mt-2 text-sm font-extrabold text-sky-900">
								{formulario.visibilidade === "DIRETORIA"
									? "Somente Diretoria"
									: "Compartilhados com a equipe"}
							</h2>
						)}
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
									{formulario.visibilidade === "DIRETORIA" && (
										<p className="mb-2 ml-1 inline-flex rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800">
											Somente Diretoria
										</p>
									)}
									<h2 className="break-words font-extrabold text-slate-900">
										{formulario.titulo}
									</h2>
									<p className="mt-1 break-words text-sm text-slate-500">
										{formulario.descricao || "Sem descrição"}
									</p>
									{formulario.autor && (
										<p className="mt-2 text-xs font-semibold text-sky-800">
											Criado por {formulario.autor.nome}
										</p>
									)}
								</div>
								<span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-100 text-sky-700">
									<BarChart3 className="h-5 w-5" />
								</span>
							</div>
							<div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
								<span className="text-sm font-semibold text-slate-600">
									{formulario._count.respostas} resposta(s)
								</span>
								<div className="flex shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white">
									{formulario.publicado &&
										formulario.visibilidade === "COMPARTILHADO" && (
											<>
												<Link
													href={`/questionarios/${formulario.slug}`}
													target="_blank"
													className="grid min-h-11 min-w-11 place-items-center bg-sky-100 text-sky-800 transition hover:bg-sky-200"
													aria-label="Abrir questionário"
													title="Abrir questionário"
												>
													<ExternalLink className="h-4 w-4" />
												</Link>
												<button
													type="button"
													onClick={() =>
														setQuestionarioQr({
															titulo: formulario.titulo,
															slug: formulario.slug,
														})
													}
													className="grid min-h-11 min-w-11 place-items-center border-l border-slate-200 bg-sky-100 text-sky-800 transition hover:bg-sky-200"
													aria-label="Gerar QR Code"
													title="Gerar QR Code"
												>
													<QrCode className="h-4 w-4" />
												</button>
											</>
										)}
									{formulario.podeGerenciar && (
										<>
											<Link
												href={`/nexus/questionarios/${formulario.id}`}
												className="grid min-h-11 min-w-11 place-items-center border-l border-slate-200 bg-orange-100 text-orange-800 transition hover:bg-orange-200"
												aria-label="Ver estatísticas"
												title="Estatísticas"
											>
												<BarChart3 className="h-4 w-4" />
											</Link>
											<Link
												href={`/nexus/questionarios/editor?id=${formulario.id}`}
												className="grid min-h-11 min-w-11 place-items-center border-l border-slate-200 bg-sky-100 text-sky-800 transition hover:bg-sky-200"
												aria-label="Editar questionário"
												title="Editar"
											>
												<Pencil className="h-4 w-4" />
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
												className="grid min-h-11 min-w-11 place-items-center border-l border-slate-200 bg-red-100 text-red-800 transition hover:bg-red-200"
												aria-label="Excluir questionário"
												title="Excluir"
											>
												<Trash2 className="h-4 w-4" />
											</button>
										</>
									)}
								</div>
							</div>
						</article>
					</div>
				))
			) : formularios?.length ? (
				<p className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-600">
					Nenhum questionário encontrado para “{busca}”.
				</p>
			) : (
				<p className="rounded-2xl col-span-full border border-dashed border-sky-200 bg-sky-50 p-10 text-center text-sm text-sky-800">
					Ainda não há questionários. Crie o primeiro para gerar um link
					público.
				</p>
			)}
		</section>
	);
}
