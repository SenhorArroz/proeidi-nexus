"use client";
import { Users } from "lucide-react";
import React from "react";
import type { GestaoTurmaProps } from "./janela-gestao-turma";
import { SearchSelect } from "./search-select";

type AlunosGestaoTurmaProps = {
	turma: GestaoTurmaProps["turma"];
	atualizarIds: (
		campo: "professorIds" | "monitorIds" | "alunoIds",
		ids: string[],
	) => void;
	alunosOptions: { id: string; nome: string; detalhe: string | undefined }[];
	corDescricao: string;
	alunosDb: GestaoTurmaProps["alunosDb"];
	setAlunoSelecionadoId: React.Dispatch<React.SetStateAction<string | null>>;
	corFundo: string;
	corTexto: string;
};
export function AlunosGestaoTurma({
	turma,
	atualizarIds,
	alunosOptions,
	corDescricao,
	alunosDb,
	setAlunoSelecionadoId,
	corFundo,
	corTexto,
}: AlunosGestaoTurmaProps) {
	return (
		<div className="view-alunos-gestao-turma space-y-7">
			<SearchSelect
				label="Adicionar alunos à turma"
				icon={Users}
				selectedIds={turma.alunoIds}
				onChange={(ids) => atualizarIds("alunoIds", ids)}
				options={alunosOptions}
				placeholder="Buscar aluno por nome, e-mail ou telefone"
				accent={turma.corDestaque}
			/>
			<section>
				<div className="mb-4 flex items-baseline justify-between gap-3">
					<h2 className="text-lg font-bold">Alunos vinculados</h2>
					<span className="text-sm" style={{ color: corDescricao }}>
						{turma.alunoIds.length} no total
					</span>
				</div>
				{turma.alunoIds.length ? (
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{turma.alunoIds.map((id) => {
							const aluno = alunosDb.find((item) => item.id === id);
							return (
								<button
									key={id}
									onClick={() => setAlunoSelecionadoId(id)}
									className="min-w-0 rounded-xl p-4 text-left transition hover:-translate-y-0.5"
									style={{ backgroundColor: corFundo }}
								>
									<div className="flex items-center gap-3">
										<div
											className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
											style={{ backgroundColor: turma.corDestaque }}
										>
											{(aluno?.nome ?? "?").slice(0, 1).toUpperCase()}
										</div>
										<div className="min-w-0">
											<p
												className="truncate font-bold"
												style={{ color: corTexto }}
											>
												{aluno?.nome ??
													turma.alunos[turma.alunoIds.indexOf(id)] ??
													"Aluno"}
											</p>
											<p
												className="mt-0.5 truncate text-xs"
												style={{ color: corDescricao }}
											>
												{aluno?.email ??
													aluno?.telefone ??
													"Ver ficha e histórico"}
											</p>
										</div>
									</div>
								</button>
							);
						})}
					</div>
				) : (
					<p
						className="py-8 text-center text-sm"
						style={{ color: corDescricao }}
					>
						Adicione alunos para montar a turma.
					</p>
				)}
			</section>
		</div>
	);
}
