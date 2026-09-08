"use client";
import {
	Award,
	BookOpen,
	GitBranch,
	Loader2,
	Pencil,
	Smartphone,
	Trash2,
	User,
	Users,
} from "lucide-react";
import Link from "next/link";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type ListaAlunosProps = {
	carregandoSemestres: NonNullable<Estado["carregandoSemestres"]>;
	carregandoAlunos: NonNullable<Estado["carregandoAlunos"]>;
	carregandoTurmas: NonNullable<Estado["carregandoTurmas"]>;
	alunosFiltrados: NonNullable<Estado["alunosFiltrados"]>;
	alunosSelecionados: NonNullable<Estado["alunosSelecionados"]>;
	alternarSelecao: NonNullable<Estado["alternarSelecao"]>;
	abrirContinuidade: NonNullable<Estado["abrirContinuidade"]>;
	estiloVerInformacoes: Estado["estiloVerInformacoes"];
	handleGerarCertificadoIndividual: NonNullable<
		Estado["handleGerarCertificadoIndividual"]
	>;
	gerandoAlunoId: Estado["gerandoAlunoId"];
	abrirModalEdicao: NonNullable<Estado["abrirModalEdicao"]>;
	excluirAluno: NonNullable<Estado["excluirAluno"]>;
	estiloExcluirAluno: Estado["estiloExcluirAluno"];
};

export function ListaAlunos({
	carregandoSemestres,
	carregandoAlunos,
	carregandoTurmas,
	alunosFiltrados,
	alunosSelecionados,
	alternarSelecao,
	abrirContinuidade,
	estiloVerInformacoes,
	handleGerarCertificadoIndividual,
	gerandoAlunoId,
	abrirModalEdicao,
	excluirAluno,
	estiloExcluirAluno,
}: ListaAlunosProps) {
	return (
		<div className="view-diretoria-alunos-lista-alunos grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
			{carregandoSemestres || carregandoAlunos || carregandoTurmas ? (
				<DataSkeleton cards={6} className="col-span-full" />
			) : alunosFiltrados.length === 0 ? (
				<div className="col-span-full py-16 flex flex-col items-center justify-center text-gray-400 bg-white border border-dashed border-gray-300 rounded-2xl">
					<Users className="w-12 h-12 mb-3 opacity-20" />
					<p className="text-lg font-medium">
						Nenhum aluno encontrado neste semestre.
					</p>
				</div>
			) : (
				alunosFiltrados.map((aluno) => (
					<div
						key={aluno.id}
						className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)] dark:bg-slate-900 dark:shadow-[0_10px_24px_rgba(0,0,0,.24)]"
					>
						<label
							className="absolute right-4 top-4 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
							title="Selecionar para continuidade em lote"
						>
							<input
								type="checkbox"
								checked={alunosSelecionados.includes(aluno.id)}
								onChange={() => alternarSelecao(aluno.id)}
								className="h-4 w-4 accent-emerald-700"
							/>
							<span className="sr-only">Selecionar {aluno.nome}</span>
						</label>
						<div className="absolute left-0 top-0 h-1.5 w-24 rounded-br-full bg-sky-500" />
						<h3 className="mb-1 pr-14 text-lg font-extrabold text-slate-900 truncate dark:text-slate-100">
							{aluno.nome}
						</h3>
						<p className="mb-4 inline-block rounded-full bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800">
							{aluno.turma}
						</p>

						<div className="space-y-2 text-sm text-gray-600">
							<p className="flex items-center gap-2">
								<User className="w-4 h-4 text-gray-400" /> {aluno.cpf}
							</p>
							<p className="flex items-center gap-2">
								<Smartphone className="w-4 h-4 text-gray-400" />{" "}
								{aluno.telefone}
							</p>
							<p className="flex items-center gap-2">
								<BookOpen className="w-4 h-4 text-gray-400" />{" "}
								{aluno.escolaridade}
							</p>
						</div>
						<section className="mt-5 border-t border-slate-100 pt-4 dark:border-slate-800">
							<p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
								Ações do aluno
							</p>
							<div className="grid grid-cols-2 gap-2">
								<button
									onClick={() => abrirContinuidade([aluno])}
									className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 text-xs font-bold text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:hover:bg-emerald-900"
									title="Continuar em outro semestre"
								>
									<GitBranch className="w-4 h-4" /> Continuar
								</button>
								<Link
									href={`/nexus/diretoria/alunos/${aluno.id}`}
									className="aluno-card-action-info flex min-h-11 items-center justify-center gap-2 rounded-xl bg-violet-100 px-3 text-xs font-bold text-violet-900 hover:bg-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:hover:bg-violet-900"
									style={estiloVerInformacoes}
									title="Ver todas as informações e o histórico do aluno"
								>
									<User className="w-4 h-4" /> Ver informações
								</Link>
								<button
									onClick={() => handleGerarCertificadoIndividual(aluno)}
									disabled={gerandoAlunoId === aluno.id}
									className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-amber-50 px-3 text-xs font-bold text-amber-800 hover:bg-amber-100 disabled:cursor-wait disabled:opacity-60 dark:bg-amber-950/60 dark:text-amber-300 dark:hover:bg-amber-900"
									title="Gerar certificado PDF deste aluno"
								>
									{gerandoAlunoId === aluno.id ? (
										<>
											<Loader2 className="w-4 h-4 animate-spin" /> Gerando...
										</>
									) : (
										<>
											<Award className="w-4 h-4" /> Certificado
										</>
									)}
								</button>
								<button
									onClick={() => abrirModalEdicao(aluno)}
									className="flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-50 px-3 text-xs font-bold text-sky-800 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:hover:bg-sky-900"
									title="Editar aluno"
								>
									<Pencil className="w-4 h-4" /> Editar
								</button>
							</div>
							<button
								onClick={() => excluirAluno(aluno.id)}
								className="aluno-card-action-delete mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-100 text-xs font-bold text-red-800 hover:bg-red-200 dark:bg-red-950/60 dark:text-red-300 dark:hover:bg-red-900"
								style={estiloExcluirAluno}
								title="Excluir aluno"
							>
								<Trash2 className="w-4 h-4" /> Excluir aluno
							</button>
						</section>
					</div>
				))
			)}
		</div>
	);
}
