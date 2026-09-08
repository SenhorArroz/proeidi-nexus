"use client";

import {
	CalendarDays,
	Check,
	MapPin,
	Pencil,
	Pin,
	Plus,
	ShieldCheck,
	Trash2,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import {
	type Aviso,
	type DadosTurma,
	type EventoCalendario,
	UploadButton,
} from "./suporte";

export function InicioView({
	turma,
	turmaId,
	avisos,
	eventos,
}: {
	turma: DadosTurma;
	turmaId: string;
	avisos: Aviso[];
	eventos: EventoCalendario[];
}) {
	const [criandoAviso, setCriandoAviso] = useState(false);
	const [novoAviso, setNovoAviso] = useState("");
	const [imagemAviso, setImagemAviso] = useState<string | null>(null);
	const [linkAviso, setLinkAviso] = useState("");
	const [editandoAviso, setEditandoAviso] = useState<Aviso | null>(null);
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarAviso = api.turma.avisos.create.useMutation({
		onSuccess: () => {
			setNovoAviso("");
			setImagemAviso(null);
			setLinkAviso("");
			setCriandoAviso(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const fixarAviso = api.turma.avisos.setFixado.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});
	const atualizarAviso = api.turma.avisos.update.useMutation({
		onSuccess: () => {
			setNovoAviso("");
			setImagemAviso(null);
			setLinkAviso("");
			setCriandoAviso(false);
			setEditandoAviso(null);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerAviso = api.turma.avisos.remove.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});

	const adicionarAviso = () => {
		const texto = novoAviso.trim();
		if (!texto && !imagemAviso && !linkAviso.trim()) return;
		setErro(null);
		if (editandoAviso)
			atualizarAviso.mutate({
				turmaId,
				id: editandoAviso.id,
				texto,
				imagemUrl: imagemAviso,
				linkUrl: linkAviso.trim() || null,
			});
		else
			criarAviso.mutate({
				turmaId,
				texto,
				imagemUrl: imagemAviso,
				linkUrl: linkAviso.trim() || null,
			});
	};
	const iniciarEdicao = (aviso: Aviso) => {
		setEditandoAviso(aviso);
		setNovoAviso(aviso.texto);
		setImagemAviso(aviso.imagemUrl);
		setLinkAviso(aviso.linkUrl ?? "");
		setCriandoAviso(true);
		setErro(null);
	};
	const cancelarEdicao = () => {
		setCriandoAviso(false);
		setEditandoAviso(null);
		setNovoAviso("");
		setImagemAviso(null);
		setLinkAviso("");
	};

	const toggleFixar = (aviso: Aviso) => {
		setErro(null);
		fixarAviso.mutate({ turmaId, id: aviso.id, fixado: !aviso.fixado });
	};

	const excluirAviso = (id: string) => {
		setErro(null);
		removerAviso.mutate({ turmaId, id });
	};

	// Organiza: fixados primeiro
	const avisosOrdenados = [...avisos].sort((a, b) =>
		a.fixado === b.fixado ? 0 : a.fixado ? -1 : 1,
	);

	return (
		<div className="view-dashboard-turmas-id-inicio-view mx-auto w-full max-w-6xl min-w-0 space-y-5 px-3 py-5 sm:px-6 lg:px-8">
			{/* Card info */}
			<div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-xs">
				<div className="mb-3 flex min-w-0 flex-wrap items-center gap-2">
					<div
						className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white"
						style={{ backgroundColor: turma.cor }}
					>
						{turma.professores
							.map((p) => p[0])
							.join("")
							.slice(0, 2)}
					</div>
					<p className="min-w-0 break-words text-sm font-medium text-gray-700">
						{turma.professores.join(" e ")}
					</p>
					<span className="text-gray-300">·</span>
					<span className="flex items-center gap-1 text-xs text-gray-500">
						<MapPin className="w-3.5 h-3.5" />
						{turma.sala}
					</span>
				</div>
				<div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-gray-500">
					<span className="flex items-center gap-1.5">
						<Users className="w-4 h-4 text-gray-400" />
						{turma.alunos.length} alunos
					</span>
					<span className="flex items-center gap-1.5">
						<ShieldCheck className="w-4 h-4 text-gray-400" />
						{turma.monitores.length} monitores
					</span>
					<span className="flex items-center gap-1.5">
						<CalendarDays className="w-4 h-4 text-gray-400" />
						{turma.horario}
					</span>
				</div>
			</div>

			{/* Avisos */}
			<div>
				<div className="flex items-center justify-between mb-3">
					<h3 className="text-sm font-semibold text-gray-700">Avisos</h3>
					<button
						onClick={() =>
							criandoAviso ? cancelarEdicao() : setCriandoAviso(true)
						}
						className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
					>
						{criandoAviso ? (
							<X className="w-3.5 h-3.5" />
						) : (
							<Plus className="w-3.5 h-3.5" />
						)}
						{criandoAviso ? "Cancelar" : "Novo aviso"}
					</button>
				</div>

				{/* Input novo aviso */}
				{criandoAviso && (
					<div className="mb-3 flex min-w-0 flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-xs">
						<input
							autoFocus
							value={novoAviso}
							onChange={(e) => setNovoAviso(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && adicionarAviso()}
							placeholder="Escreva um aviso para a turma..."
							className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
						<input
							value={linkAviso}
							onChange={(e) => setLinkAviso(e.target.value)}
							placeholder="https://... (link opcional)"
							type="url"
							className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
						/>
						<div className="flex flex-wrap items-center gap-3">
							<UploadButton
								endpoint="avisoImagem"
								onClientUploadComplete={(arquivos) => {
									setImagemAviso(arquivos[0]?.ufsUrl ?? null);
									setErro(null);
								}}
								onUploadError={(causa) =>
									setErro(`Não foi possível enviar a imagem: ${causa.message}`)
								}
								appearance={{
									button:
										"min-h-11 rounded-lg bg-sky-600 px-3 py-2 text-xs font-bold text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50",
									allowedContent: "hidden",
								}}
								content={{
									button: imagemAviso ? "Trocar imagem" : "Adicionar imagem",
								}}
							/>
							{imagemAviso && (
								<div className="flex min-w-0 items-center gap-2 rounded-xl border border-sky-100 bg-sky-50 p-2">
									<img
										src={imagemAviso}
										alt="Miniatura da imagem selecionada"
										className="h-10 w-10 shrink-0 rounded-lg bg-white object-contain"
									/>
									<span className="min-w-0 flex-1 truncate text-xs font-semibold text-sky-800">
										Imagem pronta para publicar
									</span>
									<button
										type="button"
										onClick={() => setImagemAviso(null)}
										className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-sky-700 hover:bg-sky-100"
										aria-label="Remover imagem selecionada"
									>
										<X className="h-4 w-4" />
									</button>
								</div>
							)}
							<button
								onClick={adicionarAviso}
								disabled={
									(!novoAviso.trim() && !imagemAviso && !linkAviso.trim()) ||
									criarAviso.isPending
								}
								className="flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
							>
								<Check className="w-4 h-4" />
								{criarAviso.isPending || atualizarAviso.isPending
									? "Salvando..."
									: editandoAviso
										? "Salvar alterações"
										: "Publicar"}
							</button>
						</div>
					</div>
				)}
				{erro && (
					<p
						role="alert"
						className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700"
					>
						{erro}
					</p>
				)}

				<div className="space-y-3">
					{avisosOrdenados.map((aviso) => (
						<div
							key={aviso.id}
							className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 group shadow-xs"
						>
							<div className="flex items-start justify-between gap-2 mb-2">
								<div className="flex items-center gap-2">
									<div
										className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
										style={{ backgroundColor: turma.cor }}
									>
										{aviso.autor[0]}
									</div>
									<div>
										<p className="text-sm font-medium text-gray-900">
											{aviso.autor}
										</p>
										<p className="text-[11px] text-gray-400">{aviso.quando}</p>
									</div>
								</div>
								<div className="flex items-center gap-1">
									{aviso.podeEditar && (
										<button
											onClick={() => iniciarEdicao(aviso)}
											className={`p-1 rounded-full transition-colors text-gray-300 opacity-0 group-hover:opacity-100 hover:text-sky-500`}
											title="Editar aviso"
											aria-label="Editar aviso"
										>
											<Pencil className="w-3.5 h-3.5" />
										</button>
									)}
									{aviso.podeFixar && (
										<button
											onClick={() => toggleFixar(aviso)}
											disabled={fixarAviso.isPending}
											className={`p-1 rounded-full transition-colors ${aviso.fixado ? "text-amber-500" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-500"}`}
											title={aviso.fixado ? "Desafixar" : "Fixar"}
										>
											<Pin className="w-3.5 h-3.5" />
										</button>
									)}
									{aviso.podeExcluir && (
										<button
											onClick={() => excluirAviso(aviso.id)}
											disabled={removerAviso.isPending}
											className="p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors"
											title="Excluir"
										>
											<Trash2 className="w-3.5 h-3.5" />
										</button>
									)}
								</div>
							</div>
							<p className="text-sm text-gray-600 leading-relaxed">
								{aviso.texto}
							</p>
							{aviso.imagemUrl && (
								<img
									src={aviso.imagemUrl}
									alt={`Imagem do aviso de ${aviso.autor}`}
									className="mt-3 max-h-72 w-full rounded-xl bg-slate-100 object-contain"
								/>
							)}
							{aviso.linkUrl && (
								<a
									href={aviso.linkUrl}
									target="_blank"
									rel="noreferrer"
									className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-sky-50 px-3 text-sm font-bold text-sky-700 hover:bg-sky-100"
								>
									Abrir link
								</a>
							)}
						</div>
					))}
					{avisos.length === 0 && (
						<p className="text-center py-8 text-sm text-gray-400">
							Nenhum aviso publicado ainda
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
