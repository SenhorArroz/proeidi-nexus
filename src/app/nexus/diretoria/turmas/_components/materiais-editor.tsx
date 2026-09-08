"use client";

import { FolderOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Material, type TipoMaterial, ICONE_MATERIAL } from "./suporte";

export function MateriaisEditor({
	materiais = [],
	onChange,
}: {
	materiais: Material[] | undefined;
	onChange: (m: Material[]) => void;
}) {
	const [titulo, setTitulo] = useState("");
	const [tipo, setTipo] = useState<TipoMaterial>("link");
	const [url, setUrl] = useState("");

	const adicionar = () => {
		if (!titulo.trim()) return;
		const novo: Material = {
			id: Date.now().toString(),
			titulo: titulo.trim(),
			tipo,
			url: url.trim(),
		};
		onChange([...materiais, novo]);
		setTitulo("");
		setUrl("");
	};

	const remover = (id: string) =>
		onChange(materiais.filter((m) => m.id !== id));

	return (
		<div className="view-nexus-diretoria-turmas-materiais-editor">
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<FolderOpen className="w-3.5 h-3.5" />
				Materiais
				<span className="normal-case text-gray-400">
					(links, PDFs, etc — opcional)
				</span>
			</label>

			<div className="space-y-2 mb-3">
				{materiais.map((material) => {
					const Icone = ICONE_MATERIAL[material.tipo];
					return (
						<div
							key={material.id}
							className="flex items-center gap-3 bg-gray-50 rounded-lg border border-gray-200 px-3 py-2"
						>
							<div className="w-7 h-7 rounded-md bg-sky-50 flex items-center justify-center flex-shrink-0">
								<Icone className="w-3.5 h-3.5 text-sky-600" />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-gray-700 truncate">
									{material.titulo}
								</p>
								{material.url && (
									<p className="text-xs text-gray-400 truncate">
										{material.url}
									</p>
								)}
							</div>
							<button
								onClick={() => remover(material.id)}
								className="flex-shrink-0 p-1 rounded-md text-red-700 hover:bg-red-50 hover:text-red-800"
								aria-label="Remover material"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					);
				})}
				{materiais.length === 0 && (
					<p className="text-xs text-gray-400 py-1">
						Nenhum material adicionado
					</p>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
				<select
					value={tipo}
					onChange={(e) => setTipo(e.target.value as TipoMaterial)}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				>
					<option value="link">Link</option>
					<option value="pdf">PDF</option>
					<option value="slide">Slide</option>
					<option value="imagem">Imagem</option>
				</select>
				<input
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					placeholder="Título do material"
					className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<input
					value={url}
					onChange={(e) => setUrl(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && adicionar()}
					placeholder="URL (opcional)"
					className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<button
					onClick={adicionar}
					className="flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-medium hover:bg-gray-200 transition-colors"
				>
					<Plus className="w-4 h-4" />
					Adicionar
				</button>
			</div>
		</div>
	);
}
