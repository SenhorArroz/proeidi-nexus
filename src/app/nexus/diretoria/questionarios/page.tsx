"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import QRCode from "qrcode";
import {
	BarChart3,
	ClipboardList,
	ExternalLink,
	Pencil,
	Plus,
	QrCode,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

const nomeArquivoQr = (titulo: string) =>
	titulo
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "") || "questionario";

async function criarQrComAssinatura(url: string) {
	const qr = await QRCode.toDataURL(url, {
		width: 720,
		margin: 2,
		color: { dark: "#0f172a", light: "#ffffff" },
	});
	return await new Promise<string>((resolve, reject) => {
		const imagem = new Image();
		imagem.onload = () => {
			const margem = 30;
			const canvas = document.createElement("canvas");
			canvas.width = 780;
			canvas.height = 842;
			const contexto = canvas.getContext("2d");
			if (!contexto) return reject(new Error("Canvas indisponível"));
			contexto.fillStyle = "#ffffff";
			contexto.fillRect(0, 0, canvas.width, canvas.height);
			contexto.strokeStyle = "#0284c7";
			contexto.lineWidth = 10;
			contexto.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
			contexto.strokeStyle = "#d97706";
			contexto.lineWidth = 12;
			contexto.beginPath();
			contexto.moveTo(5, canvas.height - 5);
			contexto.lineTo(canvas.width - 5, canvas.height - 5);
			contexto.stroke();
			contexto.drawImage(imagem, margem, margem, 720, 720);
			contexto.fillStyle = "#64748b";
			contexto.font = "600 20px Arial, sans-serif";
			contexto.textAlign = "center";
			contexto.fillText("powered by: ProEIDI Nexus", canvas.width / 2, 790);
			resolve(canvas.toDataURL("image/png"));
		};
		imagem.onerror = () => reject(new Error("Imagem do QR Code indisponível"));
		imagem.src = qr;
	});
}

export default function QuestionariosPage() {
	const utils = api.useUtils();
	const { data: formularios, isLoading } = api.formulario.list.useQuery();
	const [busca, setBusca] = useState("");
	const [confirmarExclusao, setConfirmarExclusao] = useState<{
		id: string;
		titulo: string;
		respostas: number;
	} | null>(null);
	const [questionarioQr, setQuestionarioQr] = useState<{
		titulo: string;
		slug: string;
	} | null>(null);
	const [imagemQr, setImagemQr] = useState<string | null>(null);
	const [erroQr, setErroQr] = useState<string | null>(null);
	useEffect(() => {
		if (!questionarioQr) {
			setImagemQr(null);
			setErroQr(null);
			return;
		}
		let ativo = true;
		setImagemQr(null);
		setErroQr(null);
		void criarQrComAssinatura(
			`${window.location.origin}/questionarios/${questionarioQr.slug}`,
		)
			.then((imagem) => {
				if (ativo) setImagemQr(imagem);
			})
			.catch(() => {
				if (ativo) setErroQr("Não foi possível gerar o QR Code.");
			});
		return () => {
			ativo = false;
		};
	}, [questionarioQr]);
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
		const encontrados =
			formularios?.filter((formulario) =>
				formulario.titulo
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
					.includes(termo),
			) ?? [];
		return encontrados.sort((a, b) =>
			a.visibilidade === b.visibilidade
				? 0
				: a.visibilidade === "COMPARTILHADO"
					? -1
					: 1,
		);
	}, [busca, formularios]);
	return (
		<main className="min-h-full px-3 py-6 sm:px-4">
			<div className="mx-auto max-w-6xl">
				<Link
					href="/nexus/dashboard"
					className="text-sm font-bold text-sky-700"
				>
					← Voltar ao painel
				</Link>
				<DiretoriaPageIntro
					icon={ClipboardList}
					title="Questionários"
					description="Crie questionários para a equipe ou, quando autorizado, apenas para a Diretoria."
					actions={
						<Link
							href="/nexus/questionarios/editor"
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
											{formulario.modoResposta ===
												"IDENTIFICADO_POR_COOKIE" && (
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
							Ainda não há questionários. Crie o primeiro para gerar um link público.
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
				{questionarioQr && (
					<div
						role="dialog"
						aria-modal="true"
						aria-labelledby="titulo-qr-questionario"
						className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"
					>
						<section className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
							<div className="flex items-start justify-between gap-4 text-left">
								<div>
									<h2
										id="titulo-qr-questionario"
										className="text-lg font-extrabold text-slate-900"
									>
										QR Code do questionário
									</h2>
									<p className="mt-1 text-sm text-slate-600">
										{questionarioQr.titulo}
									</p>
								</div>
								<button
									type="button"
									onClick={() => setQuestionarioQr(null)}
									aria-label="Fechar"
									className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-500 hover:bg-slate-100"
								>
									<X className="h-5 w-5" />
								</button>
							</div>
							<div className="mt-5 grid min-h-64 place-items-center rounded-2xl border-4 border-sky-600 border-b-[7px] border-b-amber-600 bg-white p-3">
								{imagemQr ? (
									<img
										src={imagemQr}
										alt={`QR Code para ${questionarioQr.titulo}`}
										className="h-auto w-full max-w-64"
									/>
								) : erroQr ? (
									<p
										role="alert"
										className="text-sm font-semibold text-red-700"
									>
										{erroQr}
									</p>
								) : (
									<p className="text-sm text-slate-500">Gerando QR Code…</p>
								)}
							</div>
							{imagemQr && (
								<a
									href={imagemQr}
									download={`${nomeArquivoQr(questionarioQr.titulo)}-qr-code-proeidi-nexus.png`}
									className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-extrabold text-white hover:bg-sky-700"
								>
									Baixar QR Code
								</a>
							)}
						</section>
					</div>
				)}
			</div>
		</main>
	);
}
