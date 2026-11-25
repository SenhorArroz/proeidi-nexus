import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import {
	baixarModeloPresencas,
	importarPlanilhaPresencas,
	tipoPlanilhaPresencas,
} from "~/server/planilha-presencas";
import {
	salvarPresencasDaTurma,
	salvarPresencasInput,
} from "~/server/presencas";
import { directorProcedure, id } from "./procedures";

export const presencasRouter = createTRPCRouter({
	baixarModelo: directorProcedure
		.input(z.object({ semestreId: id, tipo: tipoPlanilhaPresencas }))
		.mutation(({ ctx, input }) =>
			baixarModeloPresencas(ctx.db, input.semestreId, input.tipo),
		),
	importarPlanilha: directorProcedure
		.input(
			z.object({
				semestreId: id,
				arquivoBase64: z
					.string()
					.min(1)
					.max(2_796_204, "O arquivo XLSX deve ter até 2 MB."),
			}),
		)
		.mutation(({ ctx, input }) =>
			importarPlanilhaPresencas(ctx.db, input.semestreId, input.arquivoBase64),
		),
	list: directorProcedure
		.input(z.object({ turmaId: id }))
		.query(({ ctx, input }) =>
			ctx.db.registroPresenca.findMany({
				where: { turmaId: input.turmaId },
				orderBy: { data: "desc" },
				select: {
					id: true,
					data: true,
					alunos: {
						select: {
							alunoId: true,
							estado: true,
							aluno: { select: { nome: true } },
						},
					},
					monitores: {
						select: {
							monitorId: true,
							estado: true,
							monitor: { select: { nome: true, role: true } },
						},
					},
					professores: {
						select: {
							professorId: true,
							estado: true,
							professor: { select: { nome: true, role: true } },
						},
					},
				},
			}),
		),
	salvar: directorProcedure
		.input(salvarPresencasInput)
		.mutation(async ({ ctx, input }) => {
			return salvarPresencasDaTurma(ctx.db, input);
		}),
	remove: directorProcedure
		.input(z.object({ id, turmaId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.registroPresenca.deleteMany({
				where: { id: input.id, turmaId: input.turmaId },
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
