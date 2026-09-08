"use client";
import { Monitor, Smartphone, Wifi } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";
import { type SimNao } from "./suporte";

type CamposInfraestruturaAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
};
export function CamposInfraestruturaAluno({
	form,
	setForm,
}: CamposInfraestruturaAlunoProps) {
	return (
		<div className="view-campos-infraestrutura-aluno space-y-4">
			<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
				<Wifi className="w-5 h-5 text-gray-400" /> Infraestrutura e Equipamentos
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Tem acesso à internet?
					</label>
					<select
						required
						value={form.acessoInternet}
						onChange={(e) =>
							setForm({
								...form,
								acessoInternet: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
						<Monitor className="w-4 h-4" /> Tem computador ou notebook em casa?
					</label>
					<select
						required
						value={form.temComputador}
						onChange={(e) =>
							setForm({
								...form,
								temComputador: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
						<Smartphone className="w-4 h-4" /> Tem smartphone?
					</label>
					<select
						required
						value={form.temSmartphone}
						onChange={(e) =>
							setForm({
								...form,
								temSmartphone: e.target.value as SimNao,
							})
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>

				{form.temSmartphone === "Sim" && (
					<div className="space-y-1 animate-in fade-in slide-in-from-right-2">
						<label className="text-sm font-semibold text-gray-700">
							Sistema do Smartphone
						</label>
						<select
							required
							value={form.sistemaSmartphone || ""}
							onChange={(e) =>
								setForm({
									...form,
									sistemaSmartphone: e.target.value,
								})
							}
							className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
						>
							<option value="">Selecione...</option>
							<option value="Android">Android</option>
							<option value="iOS">iOS (iPhone)</option>
							<option value="Outro">Outro</option>
						</select>
					</div>
				)}
			</div>
		</div>
	);
}
