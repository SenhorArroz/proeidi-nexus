"use client";

import { Check, NotebookPen, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { type Anotacao } from "./suporte";

export function AnotacoesView({
	anotacoes,
	turmaId,
	cor,
}: {
	anotacoes: Anotacao[];
	turmaId: string;
	cor: string;
}) {
	const [criando, setCriando] = useState(false);
	const [titulo, setTitulo] = useState("");
	const [conteudo, setConteudo] = useState("");
	const [expandido, setExpandido] = useState<string | null>(null);
	const [erro, setErro] = useState<string | null>(null);
	const utils = api.useUtils();
	const criarAnotacao = api.turma.anotacoes.create.useMutation({
		onSuccess: () => {
			setTitulo("");
			setConteudo("");
			setCriando(false);
			setErro(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});
	const removerAnotacao = api.turma.anotacoes.remove.useMutation({
		onSuccess: () => {
			setExpandido(null);
			void utils.turma.detalhe.invalidate({ id: turmaId });
		},
		onError: (causa) => setErro(causa.message),
	});

	const adicionar = () => {
		const t = titulo.trim();
		if (!t) return;
		setErro(null);
		criarAnotacao.mutate({ turmaId, titulo: t, conteudo: conteudo.trim() });
	};

	const excluir = (id: string) => {
		setErro(null);
		removerAnotacao.mutate({ turmaId, id });
	};

	return (
		<div className="view-dashboard-turmas-id-anotacoes-view mx-auto w-full max-w-6xl min-w-0 space-y-3 px-3 py-5 sm:px-6 lg:px-8">
			<div className="flex items-center justify-between mb-1">
				<h3 className="turma-semantic-text text-sm font-semibold">
					Minhas anotações
				</h3>
				<button
					onClick={() => setCriando((v) => !v)}
					className="turma-semantic-accent flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
				>
					{criando ? (
						<X className="w-3.5 h-3.5" />
					) : (
						<Plus className="w-3.5 h-3.5" />
					)}
					{criando ? "Cancelar" : "Nova nota"}
				</button>
			</div>

			{/* Input nova nota */}
			{criando && (
				<div className="bg-white rounded-2xl border border-gray-200 p-3.5 space-y-2 shadow-xs">
					<input
						autoFocus
						value={titulo}
						onChange={(e) => setTitulo(e.target.value)}
						placeholder="Título da anotação"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
					<textarea
						value={conteudo}
						onChange={(e) => setConteudo(e.target.value)}
						placeholder="Conteúdo (opcional)"
						rows={3}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors resize-none"
					/>
					<div className="flex justify-end">
						<button
							onClick={adicionar}
							disabled={!titulo.trim() || criarAnotacao.isPending}
							className="flex min-h-11 items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<Check className="w-4 h-4" />
							{criarAnotacao.isPending ? "Salvando..." : "Salvar"}
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

			{anotacoes.map((a) => (
				<div
					key={a.id}
					className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-gray-300 hover:shadow-xs transition-all group"
				>
					<button
						onClick={() => setExpandido(expandido === a.id ? null : a.id)}
						className="w-full flex items-center gap-3 p-3.5 sm:p-4 text-left"
					>
						<div
							className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
							style={{ backgroundColor: `${cor}1A` }}
						>
							<NotebookPen className="w-5 h-5" style={{ color: cor }} />
						</div>
						<div className="flex-1 min-w-0">
							<p className="turma-semantic-text text-sm font-medium truncate">
								{a.titulo}
							</p>
							<p className="turma-semantic-description text-xs">{a.data}</p>
						</div>
					</button>

					{/* Conteúdo expandido */}
					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
							expandido === a.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
						}`}
					>
						<div className="overflow-hidden">
							<div className="px-4 pb-4 pt-1">
								<p className="turma-semantic-text text-sm leading-relaxed mb-3">
									{a.conteudo || "Sem conteúdo adicional."}
								</p>
								<button
									onClick={() => excluir(a.id)}
									disabled={removerAnotacao.isPending}
									className="flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-colors"
								>
									<Trash2 className="w-3 h-3" />
									Excluir nota
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
			{anotacoes.length === 0 && (
				<p className="turma-semantic-description text-center py-12 text-sm">
					Nenhuma anotação criada ainda
				</p>
			)}
		</div>
	);
}
