"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function SearchSelect({
	label,
	icon: Icon,
	values = [],
	onChange,
	options,
	placeholder,
	accent,
}: {
	label: string;
	icon: React.ElementType;
	values: string[];
	onChange: (v: string[]) => void;
	options: string[];
	placeholder: string;
	accent: string;
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

	const resultados = options
		.filter((o) => !values.includes(o))
		.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
		.slice(0, 6);

	const selecionar = (nome: string) => {
		onChange([...values, nome]);
		setQuery("");
	};

	const remover = (nome: string) => onChange(values.filter((v) => v !== nome));

	return (
		<div className="view-dashboard-turmas-id-search-select">
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<Icon className="w-3.5 h-3.5" />
				{label}
			</label>

			<div className="flex flex-wrap gap-1.5 mb-2 min-h-[1.75rem]">
				{values.map((v, index) => (
					<span
						key={`${v}-${index}`}
						className="flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium"
						style={{ backgroundColor: `${accent}1A`, color: accent }}
					>
						{v}
						<button
							onClick={() => remover(v)}
							className="p-0.5 rounded-full hover:bg-black/10"
							aria-label={`Remover ${v}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}
				{values.length === 0 && (
					<span className="text-xs text-gray-400 py-1">Nenhum selecionado</span>
				)}
			</div>

			<div ref={containerRef} className="relative">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onFocus={() => setOpen(true)}
						placeholder={placeholder}
						className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
					/>
				</div>

				{open && (
					<div className="absolute z-20 mt-1.5 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-52 overflow-y-auto">
						{resultados.length > 0 ? (
							resultados.map((opt, index) => (
								<button
									key={`${opt}-${index}`}
									onClick={() => selecionar(opt)}
									className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
								>
									{opt}
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
