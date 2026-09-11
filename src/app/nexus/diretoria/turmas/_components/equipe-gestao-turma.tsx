"use client";
import { GraduationCap, ShieldCheck } from "lucide-react";
import type { GestaoTurmaProps } from "./janela-gestao-turma";
import { SearchSelect } from "./search-select";

type EquipeGestaoTurmaProps = {
	turma: GestaoTurmaProps["turma"];
	atualizarIds: (campo: "professorIds" | "monitorIds", ids: string[]) => void;
	pessoaOptions: (
		pessoas: Array<{ id: string; nome: string; email?: string | null }>,
	) => { id: string; nome: string; detalhe: string | undefined }[];
	docentesDb: GestaoTurmaProps["docentesDb"];
	monitoresDb: GestaoTurmaProps["monitoresDb"];
	corFundo: string;
	corTexto: string;
	corDescricao: string;
};
export function EquipeGestaoTurma({
	turma,
	atualizarIds,
	pessoaOptions,
	docentesDb,
	monitoresDb,
	corFundo,
	corTexto,
	corDescricao,
}: EquipeGestaoTurmaProps) {
	return (
		<div className="view-equipe-gestao-turma grid gap-7 lg:grid-cols-2">
			<SearchSelect
				label="Professores e diretores"
				icon={GraduationCap}
				selectedIds={turma.professorIds}
				onChange={(ids) => atualizarIds("professorIds", ids)}
				options={pessoaOptions(docentesDb)}
				placeholder="Buscar professor ou diretor"
				accent={turma.corDestaque}
			/>
			<SearchSelect
				label="Monitores"
				icon={ShieldCheck}
				selectedIds={turma.monitorIds}
				onChange={(ids) => atualizarIds("monitorIds", ids)}
				options={pessoaOptions(monitoresDb)}
				placeholder="Buscar monitor"
				accent={turma.corDestaque}
			/>
			<section
				className="lg:col-span-2 rounded-xl p-4"
				style={{ backgroundColor: corFundo }}
			>
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2 className="font-bold" style={{ color: corTexto }}>
							Presença da equipe
						</h2>
						<p className="mt-1 text-sm" style={{ color: corDescricao }}>
							Registre e consulte as presenças de professores e monitores por
							data de aula.
						</p>
					</div>
					{turma.id ? (
						<a
							href="/nexus/diretoria/presencas"
							className="inline-flex min-h-11 items-center justify-center rounded-lg px-4 text-sm font-bold text-white"
							style={{ backgroundColor: turma.corDestaque }}
						>
							Abrir controle de presença
						</a>
					) : (
						<span className="text-sm" style={{ color: corDescricao }}>
							Salve a turma para registrar presença.
						</span>
					)}
				</div>
			</section>
		</div>
	);
}
