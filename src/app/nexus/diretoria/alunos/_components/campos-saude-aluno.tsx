"use client";
import { HeartPulse } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";
import { type SimNao } from "./suporte";

type CamposSaudeAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
};
export function CamposSaudeAluno({ form, setForm }: CamposSaudeAlunoProps) {
	return (
		<div className="view-campos-saude-aluno space-y-4">
			<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
				<HeartPulse className="w-5 h-5 text-gray-400" /> Saúde e Acessibilidade
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Possui algum problema de saúde?
					</label>
					<select
						required
						value={form.problemaSaude}
						onChange={(e) =>
							setForm({
								...form,
								problemaSaude: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>
				{form.problemaSaude === "Sim" && (
					<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
						<label className="text-sm font-semibold text-gray-700">
							Se sim, qual?
						</label>
						<input
							required
							type="text"
							value={form.problemaSaudeQual || ""}
							onChange={(e) =>
								setForm({
									...form,
									problemaSaudeQual: e.target.value,
								})
							}
							className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
						/>
					</div>
				)}

				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Tem alguma necessidade especial?
					</label>
					<select
						required
						value={form.necessidadeEspecial}
						onChange={(e) =>
							setForm({
								...form,
								necessidadeEspecial: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>
				{form.necessidadeEspecial === "Sim" && (
					<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
						<label className="text-sm font-semibold text-gray-700">
							Se sim, qual é a necessidade?
						</label>
						<input
							required
							type="text"
							placeholder="Ex: baixa visão, surdez..."
							value={form.necessidadeEspecialQual || ""}
							onChange={(e) =>
								setForm({
									...form,
									necessidadeEspecialQual: e.target.value,
								})
							}
							className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
						/>
					</div>
				)}
			</div>
		</div>
	);
}
