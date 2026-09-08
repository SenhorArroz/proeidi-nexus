"use client";

import { Check, Link2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type Material } from "./suporte";

export function MateriaisView({
	materiais,
	turmaId,
	cor,
	podeGerenciar,
}: {
	materiais: Material[];
	turmaId: string;
	cor: string;
	podeGerenciar: boolean;
}) {
	const [criando, setCriando] = useState(false);
	const [nome, setNome] = useState("");
	const [url, setUrl] = useState("");
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarMaterial = api.turma.materiais.create.useMutation({
		onSuccess: () => {
			setNome("");
			setUrl("");
			setCriando(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerMaterial = api.turma.materiais.remove.useMutation({
		onSuccess: () => void utils.turma.detalhe.invalidate({ id: turmaId }),
		onError: (causa) => setErro(causa.message),
	});

	const adicionar = () => {
		const titulo = nome.trim();
		const link = url.trim();
		if (!titulo || !link) return;
		setErro(null);
		criarMaterial.mutate({ turmaId, titulo, url: link, tipo: "LINK" });
	};

	const excluir = (id: string) => {
		setErro(null);
		removerMaterial.mutate({ turmaId, id });
	};

	return (
		<div className="view-dashboard-turmas-id-materiais-view mx-auto w-full max-w-6xl min-w-0 space-y-3 px-3 py-5 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between mb-1">
				<h3 className="turma-semantic-text text-sm font-semibold">
					Materiais da turma
				</h3>
				{podeGerenciar && (
					<button
						onClick={() => setCriando((v) => !v)}
						className="turma-semantic-accent flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
					>
						{criando ? (
							<X className="w-3.5 h-3.5" />
						) : (
							<Plus className="w-3.5 h-3.5" />
						)}
						{criando ? "Cancelar" : "Adicionar"}
					</button>
				)}
			</div>

			{/* Input novo material */}
			{podeGerenciar && criando && (
				<div className="flex flex-col gap-2 bg-white rounded-2xl border border-gray-200 p-3.5 shadow-xs">
					<input
						autoFocus
						value={nome}
						onChange={(e) => setNome(e.target.value)}
						placeholder="Título do material"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					<input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && adicionar()}
						placeholder="URL do link (ex: https://...)"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					{podeGerenciar && (
						<button
							onClick={adicionar}
							disabled={!nome.trim() || !url.trim() || criarMaterial.isPending}
							className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Check className="w-4 h-4" />
							{criarMaterial.isPending ? "Salvando..." : "Salvar"}
						</button>
					)}
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

			{materiais.map((m) => (
				<div
					key={m.id}
					className="group flex min-w-0 items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3.5 transition-all hover:border-gray-300 hover:shadow-xs sm:p-4"
				>
					<div
						className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
						style={{ backgroundColor: `${cor}1A` }}
					>
						<Link2 className="w-5 h-5" style={{ color: cor }} />
					</div>
					<div className="flex-1 min-w-0">
						<a
							href={m.url}
							target="_blank"
							rel="noopener noreferrer"
							className="turma-semantic-accent text-sm font-medium hover:underline truncate block"
						>
							{m.nome}
						</a>
						<p className="turma-semantic-description text-xs truncate mt-0.5">
							{m.url}
						</p>
					</div>
					<button
						onClick={() => excluir(m.id)}
						disabled={removerMaterial.isPending}
						className="grid min-h-11 min-w-11 shrink-0 place-items-center rounded-full text-gray-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-500 sm:min-h-0 sm:min-w-0 sm:p-1.5 sm:text-gray-300 sm:opacity-0 sm:group-hover:opacity-100"
						title="Remover"
					>
						<Trash2 className="w-4 h-4" />
					</button>
				</div>
			))}
			{materiais.length === 0 && (
				<p className="turma-semantic-description text-center py-12 text-sm">
					Nenhum material adicionado ainda
				</p>
			)}
		</div>
	);
}
