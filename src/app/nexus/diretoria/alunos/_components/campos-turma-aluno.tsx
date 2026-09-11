"use client";
import { CalendarDays } from "lucide-react";
import type { ModalCadastroAlunoProps } from "./modal-cadastro-aluno";

type CamposTurmaAlunoProps = {
	form: ModalCadastroAlunoProps["form"];
	setForm: ModalCadastroAlunoProps["setForm"];
	semestresDb: ModalCadastroAlunoProps["semestresDb"];
};
export function CamposTurmaAluno({
	form,
	setForm,
	semestresDb,
}: CamposTurmaAlunoProps) {
	return (
		<div className="view-campos-turma-aluno bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-4">
			<h4 className="font-bold text-sky-800 flex items-center gap-2 mb-2">
				<CalendarDays className="w-5 h-5" /> Semestre letivo
			</h4>
			<div className="max-w-md space-y-1">
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
			</div>
			<p className="text-sm text-sky-700">
				O vínculo com turmas é feito em lote na lista de alunos, para que uma
				mesma seleção possa entrar em mais de uma turma.
			</p>
		</div>
	);
}
