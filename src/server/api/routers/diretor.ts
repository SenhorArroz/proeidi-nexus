import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { coordinatorProcedure, personInput } from "~/server/api/routers/diretoria";
import { hashPassword } from "~/server/auth/password";

const id = z.string().cuid();

export const diretorRouter = createTRPCRouter({
	list: coordinatorProcedure.query(({ ctx }) => ctx.db.user.findMany({
		where: { role: "DIRETOR" },
		select: { id: true, nome: true, email: true, matricula: true, turmasProfessor: { select: { turma: { select: { titulo: true } } } } },
		orderBy: { nome: "asc" },
	})),
	create: coordinatorProcedure.input(personInput.omit({ senha: true })).mutation(async ({ ctx, input }) => ctx.db.user.create({
		data: { nome: input.nome, email: input.email.toLowerCase(), matricula: input.matricula, senha: await hashPassword(input.matricula), role: "DIRETOR" }, select: { id: true },
	})),
	update: coordinatorProcedure.input(personInput.extend({ id })).mutation(async ({ ctx, input }) => {
		const found = await ctx.db.user.findFirst({ where: { id: input.id, role: "DIRETOR" }, select: { id: true } });
		if (!found) throw new TRPCError({ code: "NOT_FOUND", message: "Diretor não encontrado." });
		return ctx.db.user.update({ where: { id: input.id }, data: { nome: input.nome, email: input.email.toLowerCase(), matricula: input.matricula, senha: await hashPassword(input.matricula) }, select: { id: true, updatedAt: true } });
	}),
	remove: coordinatorProcedure.input(z.object({ id })).mutation(async ({ ctx, input }) => {
		const result = await ctx.db.user.deleteMany({ where: { id: input.id, role: "DIRETOR" } });
		if (!result.count) throw new TRPCError({ code: "NOT_FOUND", message: "Diretor não encontrado." });
		return { id: input.id };
	}),
});
