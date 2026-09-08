"use client";
import { Briefcase } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";
import { type SimNao } from "./suporte";

type CamposTrabalhoEstudoAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
};
export function CamposTrabalhoEstudoAluno({
	form,
	setForm,
}: CamposTrabalhoEstudoAlunoProps) {
	return (
		<div className="view-campos-trabalho-estudo-aluno space-y-4">
			<h4 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-200 pb-2">
				<Briefcase className="w-5 h-5 text-gray-400" /> Ocupação e Escolaridade
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1 md:col-span-2">
					<label className="text-sm font-semibold text-gray-700">
						Nível de Escolaridade
					</label>
					<select
						required
						value={form.escolaridade}
						onChange={(e) => setForm({ ...form, escolaridade: e.target.value })}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sem instrução">Sem instrução</option>
						<option value="Ensino Fundamental Incompleto">
							Ensino Fundamental Incompleto
						</option>
						<option value="Ensino Fundamental Completo">
							Ensino Fundamental Completo
						</option>
						<option value="Ensino Médio Incompleto">
							Ensino Médio Incompleto
						</option>
						<option value="Ensino Médio Completo">Ensino Médio Completo</option>
						<option value="Ensino Superior Incompleto">
							Ensino Superior Incompleto
						</option>
						<option value="Ensino Superior Completo">
							Ensino Superior Completo
						</option>
						<option value="Pós-graduação">Pós-graduação</option>
					</select>
				</div>

				{/* Trabalha? */}
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Trabalha atualmente?
					</label>
					<select
						required
						value={form.trabalha}
						onChange={(e) =>
							setForm({ ...form, trabalha: e.target.value as SimNao })
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>

				{/* Condicionais Trabalho */}
				{form.trabalha === "Sim" && (
					<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2">
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700">
								Onde trabalha?
							</label>
							<input
								required
								type="text"
								value={form.trabalhoLocal || ""}
								onChange={(e) =>
									setForm({ ...form, trabalhoLocal: e.target.value })
								}
								className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700">
								Qual a função?
							</label>
							<input
								required
								type="text"
								value={form.trabalhoFuncao || ""}
								onChange={(e) =>
									setForm({ ...form, trabalhoFuncao: e.target.value })
								}
								className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
							/>
						</div>
					</div>
				)}

				{/* Estuda? */}
				<div className="space-y-1">
					<label className="text-sm font-semibold text-gray-700">
						Estuda atualmente?
					</label>
					<select
						required
						value={form.estuda}
						onChange={(e) =>
							setForm({ ...form, estuda: e.target.value as SimNao })
						}
						className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:border-sky-500 outline-none"
					>
						<option value="">Selecione...</option>
						<option value="Sim">Sim</option>
						<option value="Não">Não</option>
					</select>
				</div>

				{/* Condicionais Estudo */}
				{form.estuda === "Sim" && (
					<div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl animate-in fade-in slide-in-from-top-2">
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700">
								Onde estuda?
							</label>
							<input
								required
								type="text"
								value={form.estudoLocal || ""}
								onChange={(e) =>
									setForm({ ...form, estudoLocal: e.target.value })
								}
								className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
							/>
						</div>
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700">
								Qual curso?
							</label>
							<input
								required
								type="text"
								value={form.estudoCurso || ""}
								onChange={(e) =>
									setForm({ ...form, estudoCurso: e.target.value })
								}
								className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 outline-none"
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
