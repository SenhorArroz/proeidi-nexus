import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure } from "./diretoria";
import { equipesProcedures } from "./_components/conecta/equipes";
import { itensProcedures } from "./_components/conecta/itens";
import { doacoesProcedures } from "./_components/conecta/doacoes";
import { provasProcedures } from "./_components/conecta/provas";
import { id, somarPontosDaDoacao } from "./_components/conecta/suporte";

export const conectaRouter = createTRPCRouter({
	dados: directorProcedure
		.input(z.object({ semestreId: id }))
		.query(async ({ ctx, input }) => {
			const [turmas, equipes, itens, registrosDoacoes, provas] =
				await Promise.all([
					ctx.db.turma.findMany({
						where: { semestreId: input.semestreId },
						select: {
							id: true,
							titulo: true,
							_count: { select: { alunos: true } },
						},
						orderBy: { titulo: "asc" },
					}),
					ctx.db.conectaEquipe.findMany({
						where: { turma: { semestreId: input.semestreId } },
						include: { turma: { select: { titulo: true } } },
					}),
					ctx.db.conectaItem.findMany({ orderBy: { nome: "asc" } }),
					ctx.db.conectaDoacao.findMany({
						where: { equipe: { turma: { semestreId: input.semestreId } } },
						include: {
							itens: { include: { item: { select: { nome: true } } } },
						},
						orderBy: { createdAt: "desc" },
					}),
					ctx.db.conectaProva.findMany({
						where: { semestreId: input.semestreId },
						orderBy: { createdAt: "desc" },
					}),
				]);
			const pessoasPorTurma = new Map(
				turmas.map((turma) => [turma.id, turma._count.alunos]),
			);
			const doacoesPorEquipe = new Map<string, number>();
			const doacoes = registrosDoacoes.map((doacao) => {
				const pontosBrutos = somarPontosDaDoacao(doacao.itens);
				doacoesPorEquipe.set(
					doacao.equipeId,
					(doacoesPorEquipe.get(doacao.equipeId) ?? 0) + pontosBrutos,
				);
				return { ...doacao, pontosBrutos };
			});
			const provasPorEquipe = new Map<string, number>();
			for (const prova of provas) {
				if (!prova.equipeId) continue;
				provasPorEquipe.set(
					prova.equipeId,
					(provasPorEquipe.get(prova.equipeId) ?? 0) + prova.pontos,
				);
			}
			const ranking = equipes
				.map((equipe) => {
					const pessoas = pessoasPorTurma.get(equipe.turmaId) ?? 0;
					const pontosBrutosDoacoes = doacoesPorEquipe.get(equipe.id) ?? 0;
					const pontosProvas = provasPorEquipe.get(equipe.id) ?? 0;
					const pontosDoacoes = pessoas > 0 ? pontosBrutosDoacoes / pessoas : pontosBrutosDoacoes;
					return {
						...equipe,
						pessoas,
						pontosBrutosDoacoes,
						pontosDoacoes,
						pontosProvas,
						pontos: pontosDoacoes + pontosProvas,
					};
				})
				.sort(
					(a, b) =>
						b.pontos - a.pontos || a.nome.localeCompare(b.nome, "pt-BR"),
				);
			return {
				turmas: turmas.map((turma) => ({
					id: turma.id,
					titulo: turma.titulo,
					pessoas: turma._count.alunos,
				})),
				equipes: ranking,
				itens,
				doacoes,
				provas,
			};
		}),
	...equipesProcedures,
	...itensProcedures,
	...doacoesProcedures,
	...provasProcedures,
});
