"use client";

import { Search, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { normalizarBusca } from "~/lib/texto";
import { type OpcaoPessoa } from "./suporte";

export function SearchSelect({
	label,
	icon: Icon,
	selectedIds = [],
	onChange,
	options,
	placeholder,
	accent,
	isLoading = false,
}: {
	label: string;
	icon: React.ElementType;
	selectedIds: string[] | undefined;
	onChange: (ids: string[]) => void;
	options: OpcaoPessoa[];
	placeholder: string;
	accent: string;
	isLoading?: boolean;
}) {
	const [query, setQuery] = useState("");
	const [open, setOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const buscaNormalizada = normalizarBusca(query);
	const selecionados = options.filter((opcao) =>
		selectedIds.includes(opcao.id),
	);
	const resultados = options
		.filter((opcao) => !selectedIds.includes(opcao.id))
		.filter(
			(opcao) =>
				!buscaNormalizada ||
				normalizarBusca(`${opcao.nome} ${opcao.detalhe ?? ""}`).includes(
					buscaNormalizada,
				),
		)
		.slice(0, 6);

	const selecionar = (id: string) => {
		onChange([...selectedIds, id]);
		setQuery("");
		setOpen(false);
	};

	const remover = (id: string) =>
		onChange(selectedIds.filter((value) => value !== id));

	return (
		<div className="view-nexus-diretoria-turmas-search-select min-w-0">
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<Icon className="w-3.5 h-3.5" />
				{label}
			</label>

			<div className="mb-2 flex min-h-[1.75rem] min-w-0 flex-wrap gap-1.5">
				{selecionados.map((opcao) => (
					<span
						key={opcao.id}
						className="flex max-w-full items-center gap-1.5 rounded-full py-1 pl-2.5 pr-1.5 text-xs font-medium"
						style={{ backgroundColor: `${accent}1A`, color: accent }}
					>
						<span className="truncate">{opcao.nome}</span>
						<button
							onClick={() => remover(opcao.id)}
							className="p-0.5 rounded-full hover:bg-black/10"
							aria-label={`Remover ${opcao.nome}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
				{selectedIds.length === 0 &&
					(isLoading ? (
						<span className="h-4 w-28 animate-pulse rounded bg-slate-200" />
					) : (
						<span className="text-xs text-gray-400 py-1">
							Nenhum selecionado
						</span>
					))}
			</div>

			<div ref={containerRef} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
					<input
						disabled={isLoading}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setOpen(true)}
						onKeyDown={(event) => {
							if (event.key === "Escape") setOpen(false);
						}}
						placeholder={placeholder}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
				</div>

				{open && (
					<div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
						{resultados.length > 0 ? (
							resultados.map((opcao) => (
								<button
									key={opcao.id}
									onClick={() => selecionar(opcao.id)}
									className="w-full text-left px-3 py-2 text-sm text-sky-900 hover:bg-sky-50 hover:text-sky-700 transition-colors"
								>
									<span className="block truncate">{opcao.nome}</span>
									{opcao.detalhe && (
										<span className="mt-0.5 block truncate text-xs text-slate-500">
											{opcao.detalhe}
										</span>
									)}
								</button>
							))
						) : (
							<p className="px-3 py-2.5 text-xs text-gray-400">
								Nenhum resultado na busca
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
