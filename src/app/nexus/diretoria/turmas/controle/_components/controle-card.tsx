"use client";
import { DoorOpen } from "lucide-react";
import { type CSSProperties } from "react";
import { ordenarAlunos, type TurmaControle } from "~/lib/controle-turma";
export function ControleCard({ turma }: { turma: TurmaControle }) {
	const alunos = ordenarAlunos(turma);
	return (
		<article
			className="view-controle-card turma-card-tema min-w-0 overflow-hidden rounded-2xl"
			style={
				{
					backgroundColor: turma.corFundo,
					"--turma-texto": turma.corTexto,
					"--turma-descricao": turma.corDescricao,
					fontFamily:
						turma.fonte === "SERIF"
							? "Georgia, serif"
							: turma.fonte === "MONO"
								? "ui-monospace, monospace"
								: undefined,
					boxShadow: `0 16px 30px ${turma.cor}24`,
				} as CSSProperties
			}
		>
			<div
				className="turma-card-tema__cabecalho relative overflow-hidden px-5 py-4"
				style={{ backgroundColor: turma.cor }}
			>
				<div
					aria-hidden="true"
					className="absolute -right-6 -bottom-8 h-24 w-24 rounded-full"
					style={{ backgroundColor: turma.corDestaque }}
				/>
				<div className="relative flex items-center gap-2.5">
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/20">
						<DoorOpen className="h-5 w-5 text-white" />
					</div>
					<h2
						className="min-w-0 break-words text-sm font-semibold"
						style={{ color: turma.corTitulo }}
					>
						{turma.titulo}
					</h2>
				</div>
			</div>
			<div className="p-5">
				<div className="turma-card-descricao space-y-2 break-words text-sm !text-[color:var(--turma-descricao)]">
					<p>
						<strong>Sala:</strong> {turma.sala || "Não definida"}
					</p>
					<p>
						<strong>Horário:</strong> {turma.horario || "Não definido"}
					</p>
					<p>
						<strong>Professores:</strong>{" "}
						{turma.professores.map(({ user }) => user.nome).join(", ") ||
							"Não definidos"}
					</p>
					<p className="font-semibold tabular-nums">
						{alunos.length} alunos registrados · Limite: {turma.limiteAlunos}
					</p>
					{alunos.length > turma.limiteAlunos && (
						<p className="font-semibold">
							Acima do limite em {alunos.length - turma.limiteAlunos} aluno(s).
						</p>
					)}
				</div>
				{alunos.length ? (
					<ol
						className="mt-4 divide-y divide-slate-200"
						aria-label={`Alunos de ${turma.titulo}`}
					>
						{alunos.map((aluno, index) => (
							<li key={aluno.id} className="flex gap-3 py-3 text-sm">
								<span className="w-6 shrink-0 font-semibold tabular-nums text-[color:var(--turma-texto)]">
									{index + 1}.
								</span>
								<div className="min-w-0 flex-1 break-words">
									<p className="font-semibold text-[color:var(--turma-texto)]">
										{aluno.nome}
									</p>
								</div>
							</li>
						))}
					</ol>
				) : (
					<p className="turma-card-descricao mt-5 text-sm">
						Nenhum aluno registrado nesta turma.
					</p>
				)}
			</div>
		</article>
	);
}
