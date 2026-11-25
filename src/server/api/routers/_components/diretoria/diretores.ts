import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";
import { coordinatorProcedure, personInput, id } from "./procedures";

export const diretoresRouter = createTRPCRouter({
	list: coordinatorProcedure.query(({ ctx }) =>
		ctx.db.user.findMany({
			where: { role: "DIRETOR" },
			select: {
				id: true,
				nome: true,
				email: true,
				matricula: true,
				turmasProfessor: { select: { turma: { select: { titulo: true } } } },
			},
			orderBy: { nome: "asc" },
		}),
	),
	create: coordinatorProcedure
		.input(personInput.omit({ senha: true }))
		.mutation(async ({ ctx, input }) =>
			ctx.db.user.create({
				data: {
					nome: input.nome,
					email: input.email,
					matricula: input.matricula,
					senha: await hashPassword(input.matricula),
					role: "DIRETOR",
				},
				select: { id: true },
			}),
		),
	update: coordinatorProcedure
		.input(personInput.omit({ senha: true }).extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const exists = await ctx.db.user.findFirst({
				where: { id: input.id, role: "DIRETOR" },
				select: { id: true },
			});
			if (!exists) throw new TRPCError({ code: "NOT_FOUND" });
			return ctx.db.user.update({
				where: { id: input.id },
				data: {
					nome: input.nome,
					email: input.email,
					matricula: input.matricula,
				},
				select: { id: true },
			});
		}),
	remove: coordinatorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.user.deleteMany({
				where: { id: input.id, role: "DIRETOR" },
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
