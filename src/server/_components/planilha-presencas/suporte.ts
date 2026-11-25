import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { diaCalendario } from "~/lib/dia-calendario";
import type { MarcacoesDaTurma } from "~/server/presencas";
import type { Prisma } from "../../../../generated/prisma";

export const tipoPlanilhaPresencas = z.enum(["alunos", "equipe"]);
export type Tipo = z.infer<typeof tipoPlanilhaPresencas>;
export type Grupo = "alunos" | "monitores" | "professores";
export type Estado = MarcacoesDaTurma["alunos"][number]["estado"];
type Perfil = "Aluno" | "Monitor" | "Professor" | "Diretor docente";

export const assinatura = "Nexus:Chamada:1:";
export const formatoData = "dd/mm/yyyy";
export const formatoInvalido =
	"Use uma planilha-modelo de presenças baixada no Nexus.";

export function erroPlanilha(message: string): never {
	throw new TRPCError({ code: "BAD_REQUEST", message });
}

export async function dadosDoSemestre(
	db: Prisma.TransactionClient,
	semestreId: string,
) {
	const semestre = await db.semestre.findUnique({
		where: { id: semestreId },
		select: {
			codigo: true,
			turmas: {
				orderBy: [{ titulo: "asc" }, { id: "asc" }],
				select: {
					id: true,
					titulo: true,
					eventos: { where: { tipo: "AULA" }, select: { data: true } },
					alunos: {
						where: { aluno: { semestreId } },
						select: { aluno: { select: { id: true, nome: true } } },
					},
					monitores: {
						where: { user: { role: "MONITOR" } },
						select: { user: { select: { id: true, nome: true } } },
					},
					professores: {
						where: { user: { role: { in: ["PROFESSOR", "DIRETOR"] } } },
						select: { user: { select: { id: true, nome: true, role: true } } },
					},
				},
			},
		},
	});
	if (!semestre)
		throw new TRPCError({
			code: "NOT_FOUND",
			message: "Semestre não encontrado.",
		});
	return semestre;
}

export type Turma = Awaited<
	ReturnType<typeof dadosDoSemestre>
>["turmas"][number];

export function pessoasDaTurma(
	turma: Turma,
	tipo: Tipo,
): { id: string; nome: string; perfil: Perfil; grupo: Grupo }[] {
	const pessoas =
		tipo === "alunos"
			? turma.alunos.map(({ aluno }) => ({
					...aluno,
					perfil: "Aluno" as const,
					grupo: "alunos" as const,
				}))
			: [
					...turma.monitores.map(({ user }) => ({
						...user,
						perfil: "Monitor" as const,
						grupo: "monitores" as const,
					})),
					...turma.professores.map(({ user }) => ({
						id: user.id,
						nome: user.nome,
						perfil:
							user.role === "DIRETOR"
								? ("Diretor docente" as const)
								: ("Professor" as const),
						grupo: "professores" as const,
					})),
				];
	return pessoas.sort((a, b) =>
		a.perfil === "Monitor" && b.perfil !== "Monitor"
			? -1
			: b.perfil === "Monitor" && a.perfil !== "Monitor"
				? 1
				: a.nome.localeCompare(b.nome, "pt-BR"),
	);
}

export function diasDaTurma(turma: Turma) {
	return [
		...new Set(turma.eventos.map(({ data }) => diaCalendario(data))),
	].sort();
}
