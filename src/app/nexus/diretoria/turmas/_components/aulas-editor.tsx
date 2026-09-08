"use client";

import { CalendarDays, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { type Aula, formatarData } from "./suporte";

export function AulasEditor({
	aulas = [],
	onChange,
}: {
	aulas: Aula[] | undefined;
	onChange: (a: Aula[]) => void;
}) {
	const [data, setData] = useState("");
	const [titulo, setTitulo] = useState("");
	const [tipo, setTipo] = useState<Aula["tipo"]>("AULA");

	const adicionar = () => {
		if (!data || !titulo.trim()) return;
		const nova: Aula = {
			id: Date.now().toString(),
			data,
			titulo: titulo.trim(),
			tipo,
		};
		const atualizadas = [...aulas, nova].sort((a, b) =>
			a.data.localeCompare(b.data),
		);
		onChange(atualizadas);
		setData("");
		setTitulo("");
		setTipo("AULA");
	};

	const remover = (id: string) => onChange(aulas.filter((a) => a.id !== id));
	const atualizar = (id: string, alteracoes: Partial<Omit<Aula, "id">>) =>
		onChange(
			aulas
				.map((aula) => (aula.id === id ? { ...aula, ...alteracoes } : aula))
				.sort((a, b) => a.data.localeCompare(b.data)),
		);

	return (
		<div className="view-nexus-diretoria-turmas-aulas-editor">
			<label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
				<CalendarDays className="w-3.5 h-3.5" />
				Aulas
			</label>

			<div className="space-y-2 mb-3">
				{aulas.map((aula) => (
					<div
						key={aula.id}
						className="min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2"
					>
						<div className="mb-2 flex min-w-0 flex-wrap items-center gap-2">
							<span className="rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-600">
								{formatarData(aula.data)}
							</span>
							<span className="min-w-0 flex-1 truncate text-sm text-gray-700">
								{aula.titulo}
							</span>
							<span className="rounded-full bg-orange-50 px-2 py-1 text-[10px] font-bold text-orange-800">
								{aula.tipo.charAt(0) + aula.tipo.slice(1).toLowerCase()}
							</span>
						</div>
						<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
							<input
								type="date"
								value={aula.data}
								onChange={(e) => atualizar(aula.id, { data: e.target.value })}
								className="min-h-9 w-full rounded-md border border-sky-200 bg-white px-2 text-xs font-semibold text-sky-700 outline-none focus:border-sky-500 sm:w-auto"
								aria-label={`Data de ${aula.titulo}`}
							/>
							<input
								value={aula.titulo}
								onChange={(e) => atualizar(aula.id, { titulo: e.target.value })}
								className="min-h-9 min-w-0 flex-1 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 outline-none focus:border-sky-500"
								aria-label="Nome da aula"
							/>
							<select
								value={aula.tipo}
								onChange={(e) =>
									atualizar(aula.id, { tipo: e.target.value as Aula["tipo"] })
								}
								className="min-h-9 rounded-md border border-orange-200 bg-white px-2 text-[10px] font-bold text-orange-800 outline-none focus:border-orange-500"
								aria-label="Tipo da aula"
							>
								<option value="AULA">Aula</option>
								<option value="FERIADO">Feriado</option>
								<option value="CANCELADA">Cancelada</option>
								<option value="ESPECIAL">Especial</option>
							</select>
							<button
								onClick={() => remover(aula.id)}
								className="grid min-h-9 min-w-9 place-items-center rounded-md text-red-700 hover:bg-red-50 hover:text-red-800"
								aria-label="Remover aula"
							>
								<Trash2 className="w-3.5 h-3.5" />
							</button>
						</div>
					</div>
				))}
				{aulas.length === 0 && (
					<p className="text-xs text-gray-400 py-1">Nenhuma aula cadastrada</p>
				)}
			</div>

			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
				<input
					type="date"
					value={data}
					onChange={(e) => setData(e.target.value)}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
				/>
				<select
					value={tipo}
					onChange={(e) => setTipo(e.target.value as Aula["tipo"])}
					className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-sky-300 focus:outline-none"
				>
					<option value="AULA">Aula</option>
					<option value="FERIADO">Feriado</option>
					<option value="CANCELADA">Cancelada</option>
					<option value="ESPECIAL">Especial</option>
				</select>
				<input
					value={titulo}
					onChange={(e) => setTitulo(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && adicionar()}
					placeholder="Título da aula"
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
