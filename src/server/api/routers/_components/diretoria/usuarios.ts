import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";
import { directorProcedure, personInput, id } from "./procedures";

export const usuariosRouter = createTRPCRouter({
	list: directorProcedure
		.input(
			z.object({
				role: z.enum(["PROFESSOR", "MONITOR", "DIRETOR"]),
				busca: z.string().trim().max(80).optional(),
			}),
		)
		.query(({ ctx, input }) =>
			ctx.db.user.findMany({
				where: {
					role: input.role,
					...(input.busca
						? { nome: { contains: input.busca, mode: "insensitive" } }
						: {}),
				},
				select: {
					id: true,
					role: true,
					nome: true,
					email: true,
					matricula: true,
					turmasProfessor: {
						select: {
							turma: {
								select: {
									id: true,
									titulo: true,
									semestre: { select: { codigo: true } },
								},
							},
						},
					},
					turmasMonitor: {
						select: {
							turma: {
								select: {
									id: true,
									titulo: true,
									semestre: { select: { codigo: true } },
								},
							},
						},
					},
				},
				orderBy: { nome: "asc" },
				take: 100,
			}),
		),
	create: directorProcedure
		.input(
			personInput
				.omit({ senha: true })
				.extend({ role: z.enum(["PROFESSOR", "MONITOR"]) }),
		)
		.mutation(async ({ ctx, input }) =>
			ctx.db.user.create({
				data: {
					nome: input.nome,
					email: input.email.toLowerCase(),
					matricula: input.matricula,
					senha: await hashPassword(input.matricula),
					role: input.role,
				},
				select: { id: true, nome: true, email: true, matricula: true },
			}),
		),
	importMonitors: directorProcedure
		.input(
			z.object({
				monitores: z
					.array(personInput.omit({ senha: true }))
					.min(1, "Inclua pelo menos um monitor.")
					.max(500, "A importação aceita no máximo 500 monitores por vez."),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const monitores = input.monitores.map((monitor) => ({
				...monitor,
				email: monitor.email.toLowerCase(),
			}));
			const emails = monitores.map((monitor) => monitor.email);
			const matriculas = monitores.map((monitor) => monitor.matricula);

			if (new Set(emails).size !== emails.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A planilha possui e-mails duplicados.",
				});
			if (new Set(matriculas).size !== matriculas.length)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "A planilha possui matrículas duplicadas.",
				});

			const monitoresComSenha = await Promise.all(
				monitores.map(async (monitor) => ({
					...monitor,
					senha: await hashPassword(monitor.matricula),
					role: "MONITOR" as const,
				})),
			);

			return ctx.db.$transaction(async (tx) => {
				const existentes = await tx.user.findMany({
					where: {
						OR: [{ email: { in: emails } }, { matricula: { in: matriculas } }],
					},
					select: { email: true, matricula: true },
				});
				if (existentes.length)
					throw new TRPCError({
						code: "CONFLICT",
						message: `Já há usuário cadastrado com: ${existentes
							.map(
								(usuario: { email: string; matricula: string }) =>
									`${usuario.email} / ${usuario.matricula}`,
							)
							.join(", ")}.`,
					});
				await tx.user.createMany({ data: monitoresComSenha });
				return { total: monitores.length };
			});
		}),
	update: directorProcedure
		.input(
			personInput
				.omit({ senha: true })
				.extend({ id, role: z.enum(["PROFESSOR", "MONITOR"]) }),
		)
		.mutation(async ({ ctx, input }) => {
			const existing = await ctx.db.user.findFirst({
				where: { id: input.id, role: input.role },
				select: { id: true },
			});
			if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
			return ctx.db.user.update({
				where: { id: input.id },
				data: {
					nome: input.nome,
					email: input.email.toLowerCase(),
					matricula: input.matricula,
				},
				select: { id: true, nome: true, email: true, matricula: true },
			});
		}),
	remove: directorProcedure
		.input(z.object({ id, role: z.enum(["PROFESSOR", "MONITOR"]) }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db.user.deleteMany({
				where: { id: input.id, role: input.role },
			});
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
});
