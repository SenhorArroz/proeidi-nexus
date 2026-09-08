"use client";

import {
	Check,
	GraduationCap,
	Settings2,
	ShieldCheck,
	Users,
	X,
} from "lucide-react";
import { useState } from "react";
import { SearchSelect } from "./search-select";
import { type DadosTurma } from "./suporte";

export function EditarTurmaModal({
	turma,
	onSalvar,
	onFechar,
}: {
	turma: DadosTurma;
	onSalvar: (t: DadosTurma) => void;
	onFechar: () => void;
}) {
	const [rascunho, setRascunho] = useState<DadosTurma>({
		...turma,
		corDestaque: turma.corDestaque ?? "#ea580c",
		corFundo: turma.corFundo ?? "#f8fafc",
		corTexto: turma.corTexto ?? "#0f172a",
		corTitulo: turma.corTitulo ?? "#ffffff",
		corDescricao: turma.corDescricao ?? "#64748b",
		fonte: turma.fonte ?? "SANS",
	});

	const salvar = () => {
		if (!rascunho.nome.trim()) return;
		onSalvar(rascunho);
	};

	return (
		<div className="view-dashboard-turmas-id-editar-turma-modal fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
			<div
				className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"
				onClick={onFechar}
			/>

			<div className="relative z-10 flex max-h-[96dvh] w-full max-w-2xl min-w-0 flex-col rounded-t-3xl border border-gray-100 bg-white shadow-2xl sm:max-h-[90vh] sm:rounded-3xl">
				{/* Header */}
				<div className="flex min-w-0 items-center justify-between gap-3 border-b border-gray-100 p-4 sm:p-5">
					<h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
						<Settings2 className="w-5 h-5 text-sky-600" />
						Editar turma
					</h3>
					<button
						onClick={onFechar}
						className="grid min-h-11 min-w-11 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Form */}
				<div className="min-w-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-5">
					{/* Título */}
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
							Nome da turma
						</label>
						<input
							value={rascunho.nome}
							onChange={(e) =>
								setRascunho({ ...rascunho, nome: e.target.value })
							}
							placeholder="Ex: Smartphone mais do que Avançado"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
					</div>
					<div className="rounded-xl border border-sky-100 bg-sky-50 p-3">
						<p className="text-sm font-bold text-sky-900">
							Personalização da turma
						</p>
						<div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
							<label className="text-xs font-bold text-slate-700">
								Principal
								<input
									type="color"
									value={rascunho.cor}
									onChange={(e) =>
										setRascunho({ ...rascunho, cor: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Destaque
								<input
									type="color"
									value={rascunho.corDestaque}
									onChange={(e) =>
										setRascunho({ ...rascunho, corDestaque: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Fundo
								<input
									type="color"
									value={rascunho.corFundo}
									onChange={(e) =>
										setRascunho({ ...rascunho, corFundo: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Texto
								<input
									type="color"
									value={rascunho.corTexto}
									onChange={(e) =>
										setRascunho({ ...rascunho, corTexto: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Título do banner
								<input
									type="color"
									value={rascunho.corTitulo}
									onChange={(e) =>
										setRascunho({ ...rascunho, corTitulo: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Descrição
								<input
									type="color"
									value={rascunho.corDescricao}
									onChange={(e) =>
										setRascunho({ ...rascunho, corDescricao: e.target.value })
									}
									className="mt-1 h-10 w-full"
								/>
							</label>
							<label className="text-xs font-bold text-slate-700">
								Fonte
								<select
									value={rascunho.fonte}
									onChange={(e) =>
										setRascunho({
											...rascunho,
											fonte: e.target.value as DadosTurma["fonte"],
										})
									}
									className="mt-1 h-10 w-full rounded-lg border border-sky-200 bg-white px-2"
								>
									<option value="SANS">Sem serifa</option>
									<option value="SERIF">Com serifa</option>
									<option value="MONO">Monoespaçada</option>
								</select>
							</label>
						</div>
					</div>

					{/* Sala e Horário */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
								Sala
							</label>
							<input
								value={rascunho.sala}
								onChange={(e) =>
									setRascunho({ ...rascunho, sala: e.target.value })
								}
								placeholder="Ex: Sala 204"
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
								Horário
							</label>
							<input
								value={rascunho.horario}
								onChange={(e) =>
									setRascunho({ ...rascunho, horario: e.target.value })
								}
								placeholder="Ex: Seg e Qua · 14:00 – 16:00"
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
					</div>

					{/* Professores e Monitores */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<SearchSelect
							label="Professores"
							icon={GraduationCap}
							values={rascunho.professores}
							onChange={(v) => setRascunho({ ...rascunho, professores: v })}
							options={turma.professores}
							placeholder="Buscar professor..."
							accent="#1A73E8"
						/>
						<SearchSelect
							label="Monitores"
							icon={ShieldCheck}
							values={rascunho.monitores}
							onChange={(v) => setRascunho({ ...rascunho, monitores: v })}
							options={turma.monitores}
							placeholder="Buscar monitor..."
							accent="#188038"
						/>
					</div>

					{/* Alunos */}
					<SearchSelect
						label="Alunos"
						icon={Users}
						values={rascunho.alunos}
						onChange={(v) => setRascunho({ ...rascunho, alunos: v })}
						options={turma.alunos}
						placeholder="Buscar aluno..."
						accent="#9334E6"
					/>
				</div>

				{/* Footer */}
				<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:rounded-b-3xl sm:px-5">
					<button
						onClick={onFechar}
						className="min-h-11 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
					>
						Cancelar
					</button>
					<button
						onClick={salvar}
						disabled={!rascunho.nome.trim()}
						className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
					>
						<Check className="w-4 h-4" />
						Salvar
					</button>
				</div>
			</div>
		</div>
	);
}
