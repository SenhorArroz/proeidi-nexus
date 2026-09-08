"use client";
import { School } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";

type CamposTurmaAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
	semestresDb: ModalCadastroAlunoProps["semestresDb"];
	turmasDb: ModalCadastroAlunoProps["turmasDb"];
};
export function CamposTurmaAluno({
	form,
	setForm,
	semestresDb,
	turmasDb,
}: CamposTurmaAlunoProps) {
	return (
		<div className="view-campos-turma-aluno bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-4">
			<h4 className="font-bold text-sky-800 flex items-center gap-2 mb-2">
				<School className="w-5 h-5" /> Seleção de Turma
			</h4>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-1">
					<label className="text-sm font-bold text-gray-700">
						Semestre Letivo
					</label>
					<select
						required
						value={form.semestre}
						onChange={(e) => setForm({ ...form, semestre: e.target.value })}
						className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
					>
						{(semestresDb?.map((s) => s.codigo) ?? []).map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>
				<div className="space-y-1">
					<label className="text-sm font-bold text-gray-700">
						Turma Registrada
					</label>
					<select
						required
						value={form.turma}
						onChange={(e) => setForm({ ...form, turma: e.target.value })}
						className="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none"
					>
						<option value="">Selecione uma turma...</option>
						{(turmasDb?.map((t) => t.titulo) ?? []).map((t) => (
							<option key={t} value={t}>
								{t}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
