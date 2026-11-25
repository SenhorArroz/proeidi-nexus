import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
	salvarPresencasDaTurma,
	salvarPresencasInput,
} from "~/server/presencas";
import { turmaId, acessoTurma } from "./suporte";

export const presencasRouter = createTRPCRouter({
	list: protectedProcedure
		.input(z.object({ turmaId }))
		.query(async ({ ctx, input }) => {
			if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
				throw new TRPCError({ code: "FORBIDDEN" });
			return ctx.db.registroPresenca.findMany({
				where: { turmaId: input.turmaId },
				orderBy: { data: "asc" },
				select: {
					id: true,
					data: true,
					alunos: { select: { alunoId: true, estado: true } },
					monitores: { select: { monitorId: true, estado: true } },
					professores: { select: { professorId: true, estado: true } },
				},
			});
		}),
	salvar: protectedProcedure
		.input(salvarPresencasInput)
		.mutation(async ({ ctx, input }) => {
			if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
				throw new TRPCError({ code: "FORBIDDEN" });
			return salvarPresencasDaTurma(ctx.db, input);
		}),
});
