"use client";
import { X } from "lucide-react";
import { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type ModalContinuidadeAlunoProps = {
	semestreDestinoId: NonNullable<Estado["semestreDestinoId"]>;
	turmaDestinoIds: NonNullable<Estado["turmaDestinoIds"]>;
	alunosParaContinuar: NonNullable<Estado["alunosParaContinuar"]>;
	continuarAluno: NonNullable<Estado["continuarAluno"]>;
	etapaTrilha: NonNullable<Estado["etapaTrilha"]>;
	setAlunosSelecionados: NonNullable<Estado["setAlunosSelecionados"]>;
	setAlunosParaContinuar: NonNullable<Estado["setAlunosParaContinuar"]>;
	setSemestreDestinoId: NonNullable<Estado["setSemestreDestinoId"]>;
	setTurmaDestinoIds: NonNullable<Estado["setTurmaDestinoIds"]>;
	semestresDb: Estado["semestresDb"];
	semestreSelecionado: Estado["semestreSelecionado"];
	setEtapaTrilha: NonNullable<Estado["setEtapaTrilha"]>;
	semestreDestino: Estado["semestreDestino"];
	turmasDestino: Estado["turmasDestino"];
};

export function ModalContinuidadeAluno({
	semestreDestinoId,
	turmaDestinoIds,
	alunosParaContinuar,
	continuarAluno,
	etapaTrilha,
	setAlunosSelecionados,
	setAlunosParaContinuar,
	setSemestreDestinoId,
	setTurmaDestinoIds,
	semestresDb,
	semestreSelecionado,
	setEtapaTrilha,
	semestreDestino,
	turmasDestino,
}: ModalContinuidadeAlunoProps) {
	return (
		<div className="view-diretoria-alunos-modal-continuidade-aluno fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-5">
			<form
				onSubmit={async (event) => {
					event.preventDefault();
					if (semestreDestinoId && turmaDestinoIds.length) {
						for (const aluno of alunosParaContinuar)
							await continuarAluno.mutateAsync({
								alunoId: aluno.id,
								semestreDestinoId,
								turmaIds: turmaDestinoIds,
								etapaTrilha: etapaTrilha.trim() || null,
							});
						setAlunosSelecionados([]);
					}
				}}
				className="w-full max-w-lg rounded-t-2xl bg-white p-5 shadow-2xl sm:rounded-2xl"
			>
				<div className="flex items-start justify-between gap-4">
					<div>
						<h2 className="text-lg font-bold text-slate-900">
							Continuar {alunosParaContinuar.length} aluno(s)
						</h2>
						<p className="mt-1 text-sm text-slate-600">
							Cria matrículas no novo semestre, preservando o histórico atual.
						</p>
					</div>
					<button
						type="button"
						onClick={() => setAlunosParaContinuar([])}
						className="grid h-11 w-11 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
						aria-label="Fechar"
					>
						<X className="h-5 w-5" />
					</button>
				</div>
				<label className="mt-5 block text-sm font-semibold text-slate-800">
					Semestre de destino
					<select
						required
						value={semestreDestinoId}
						onChange={(event) => {
							setSemestreDestinoId(event.target.value);
							setTurmaDestinoIds([]);
						}}
						className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
					>
						<option value="">Selecione o semestre</option>
						{semestresDb
							?.filter((semestre) => semestre.id !== semestreSelecionado?.id)
							.map((semestre) => (
								<option key={semestre.id} value={semestre.id}>
									{semestre.codigo}
								</option>
							))}
					</select>
				</label>
				<label className="mt-4 block text-sm font-semibold text-slate-800">
					Etapa da trilha
					<input
						value={etapaTrilha}
						onChange={(event) => setEtapaTrilha(event.target.value)}
						placeholder="Ex.: Intermediária"
						className="mt-2 min-h-11 w-full rounded-xl border border-slate-300 px-3 text-sm"
					/>
				</label>
				<fieldset className="mt-4">
					<legend className="text-sm font-semibold text-slate-800">
						Turma(s) de destino
					</legend>
					<div className="mt-2 space-y-2">
						{semestreDestino && !turmasDestino?.length && (
							<p className="text-sm text-amber-800">
								Não há turmas neste semestre.
							</p>
						)}
						{turmasDestino?.map((turma) => (
							<label
								key={turma.id}
								className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 text-sm text-slate-700"
							>
								<input
									type="checkbox"
									checked={turmaDestinoIds.includes(turma.id)}
									onChange={(event) =>
										setTurmaDestinoIds((ids) =>
											event.target.checked
												? [...ids, turma.id]
												: ids.filter((id) => id !== turma.id),
										)
									}
								/>
								{turma.titulo}
							</label>
						))}
					</div>
				</fieldset>
				<div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
					<button
						type="button"
						onClick={() => setAlunosParaContinuar([])}
						className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
					>
						Cancelar
					</button>
					<button
						type="submit"
						disabled={
							!semestreDestinoId ||
							!turmaDestinoIds.length ||
							continuarAluno.isPending
						}
						className="min-h-11 rounded-xl bg-emerald-700 px-5 text-sm font-bold text-white hover:bg-emerald-800 disabled:opacity-50"
					>
						{continuarAluno.isPending ? "Salvando..." : "Criar continuidades"}
					</button>
				</div>
			</form>
		</div>
	);
}
