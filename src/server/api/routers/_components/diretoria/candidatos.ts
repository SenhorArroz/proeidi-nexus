import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id, text } from "./procedures";

const candidatoInput = z.object({
	semestreId: id,
	ficha: z.string().trim().min(1).max(40),
	nome: text,
	dataNascimento: z.coerce.date(),
	cpf: z
		.string()
		.trim()
		.regex(/^\d{11}$/),
	telefone: z.string().trim().min(8).max(160),
	emergencia: z.string().trim().min(8).max(160),
	curso: z.enum(["SMARTPHONE", "COMPUTADOR"]),
});

export const candidatosRouter = createTRPCRouter({
	list: directorProcedure
		.input(z.object({ semestreId: id }))
		.query(({ ctx, input }) =>
			ctx.db.candidato.findMany({
				where: { semestreId: input.semestreId },
				select: {
					id: true,
					ficha: true,
					nome: true,
					dataNascimento: true,
					cpf: true,
					telefone: true,
					emergencia: true,
					curso: true,
					createdAt: true,
				},
				orderBy: [{ curso: "asc" }, { ficha: "asc" }],
			}),
		),
	create: directorProcedure
		.input(candidatoInput)
		.mutation(({ ctx, input }) =>
			ctx.db.candidato.create({ data: input, select: { id: true } }),
		),
	update: directorProcedure
		.input(candidatoInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const { id: candidatoId, ...data } = input;
			const exists = await ctx.db.candidato.findFirst({
				where: { id: candidatoId, semestreId: input.semestreId },
				select: { id: true },
			});
			if (!exists) throw new TRPCError({ code: "NOT_FOUND" });
			return ctx.db.candidato.update({
				where: { id: candidatoId },
				data,
				select: { id: true },
			});
		}),
	importMany: directorProcedure
		.input(
			z.object({
				semestreId: id,
				registros: z
					.array(
						candidatoInput.omit({ semestreId: true }).extend({
							createdAt: z.coerce.date().optional(),
						}),
					)
					.min(1)
					.max(1000),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const existentes = await ctx.db.candidato.findMany({
				where: { semestreId: input.semestreId },
				select: { ficha: true, curso: true },
			});
			const chaves = new Set(
				existentes.map(
					(candidato) => `${candidato.ficha.trim()}::${candidato.curso}`,
				),
			);
			const novos = input.registros
				.filter((registro) => {
					const chave = `${registro.ficha.trim()}::${registro.curso}`;
					if (chaves.has(chave)) return false;
					chaves.add(chave);
					return true;
				})
				.map(({ createdAt, ...registro }) => ({
					...registro,
					semestreId: input.semestreId,
					...(createdAt ? { createdAt } : {}),
				}));
			if (novos.length) await ctx.db.candidato.createMany({ data: novos });
			return {
				criados: novos.length,
				ignorados: input.registros.length - novos.length,
			};
		}),
	remove: directorProcedure
		.input(z.object({ id, semestreId: id }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.candidato.deleteMany({ where: input });
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
