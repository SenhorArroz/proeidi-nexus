import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { hashPassword } from "~/server/auth/password";

const id = z.string().cuid();
const text = z.string().trim().min(1).max(160);

export const directorProcedure = protectedProcedure.use(
	async ({ ctx, next }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!user || (user.role !== "DIRETOR" && user.role !== "COORDENADOR")) {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Acesso restrito à diretoria.",
			});
		}
		return next();
	},
);

export const coordinatorProcedure = protectedProcedure.use(
	async ({ ctx, next }) => {
		const user = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!user || user.role !== "COORDENADOR") {
			throw new TRPCError({
				code: "FORBIDDEN",
				message: "Acesso restrito ao coordenador.",
			});
		}
		return next();
	},
);

export const personInput = z.object({
	nome: text,
	email: z.string().trim().email().max(254),
	matricula: z.string().trim().min(3).max(40),
	senha: z.string().min(10).max(128).optional(),
});

const alunoInput = z.object({
	semestreId: id,
	nome: text,
	dataNascimento: z.coerce.date(),
	cpf: z
		.string()
		.trim()
		.regex(/^\d{11}$/),
	corRaca: z.string().trim().min(1).max(80),
	identidadeGenero: z.string().trim().min(1).max(80),
	lgbtqiapn: z.string().trim().min(1).max(30),
	telefone: z.string().trim().min(8).max(30),
	contatoEmergencia: z.string().trim().min(8).max(160),
	email: z.string().trim().email().max(254),
	escolaridade: z.string().trim().min(1).max(120),
	cuidaTerceiros: z.boolean(),
	trabalha: z.boolean(),
	trabalhoLocal: z.string().trim().max(160).nullable().optional(),
	trabalhoFuncao: z.string().trim().max(160).nullable().optional(),
	estuda: z.boolean(),
	estudoLocal: z.string().trim().max(160).nullable().optional(),
	estudoCurso: z.string().trim().max(160).nullable().optional(),
	problemaSaude: z.boolean(),
	problemaSaudeQual: z.string().trim().max(240).nullable().optional(),
	necessidadeEspecial: z.boolean(),
	necessidadeEspecialQual: z.string().trim().max(240).nullable().optional(),
	acessoInternet: z.boolean(),
	temComputador: z.boolean(),
	temSmartphone: z.boolean(),
	sistemaSmartphone: z.string().trim().max(60).nullable().optional(),
	turmaIds: z.array(id).max(20),
});

const turmaInput = z.object({
	semestreId: id,
	titulo: text,
	sala: z.string().trim().max(80).nullable().optional(),
	horario: z.string().trim().max(80).nullable().optional(),
	cor: z
		.string()
		.regex(/^#[0-9a-fA-F]{6}$/)
		.default("#1A73E8"),
	professorIds: z.array(id).max(20),
	monitorIds: z.array(id).max(30),
	alunoIds: z.array(id).max(300),
	materiais: z
		.array(
			z.object({
				titulo: text,
				tipo: z.enum(["LINK", "PDF", "SLIDE", "IMAGEM"]),
				url: z.union([z.string().trim().url().max(2048), z.literal("")]),
			}),
		)
		.max(100),
	aulas: z.array(z.object({ data: z.coerce.date(), titulo: text, tipo: z.enum(["AULA", "FERIADO", "CANCELADA", "ESPECIAL"]).default("AULA") })).max(200),
});

async function validateTurmaRelations(
	ctx: { db: any },
	input: z.infer<typeof turmaInput>,
) {
	const [professores, monitores, alunos] = await Promise.all([
		ctx.db.user.findMany({
			where: {
				id: { in: input.professorIds },
				role: { in: ["PROFESSOR", "DIRETOR"] },
			},
			select: { id: true },
		}),
		ctx.db.user.findMany({
			where: { id: { in: input.monitorIds }, role: "MONITOR" },
			select: { id: true },
		}),
		ctx.db.aluno.findMany({
			where: { id: { in: input.alunoIds }, semestreId: input.semestreId },
			select: { id: true },
		}),
	]);
	if (
		professores.length !== new Set(input.professorIds).size ||
		monitores.length !== new Set(input.monitorIds).size ||
		alunos.length !== new Set(input.alunoIds).size
	) {
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Uma ou mais seleções não são válidas para esta turma.",
		});
	}
}

export const diretoriaRouter = createTRPCRouter({
	overview: directorProcedure.query(async ({ ctx }) => {
		const semestre = await ctx.db.semestre.findFirst({
			where: { ativo: true },
			select: { id: true, codigo: true },
		});
		const usuario = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!semestre)
			return {
				semestre: null,
				totalAlunos: 0,
				totalProfessores: 0,
				totalMonitores: 0,
				role: usuario?.role ?? null,
			};
		const [totalAlunos, totalProfessores, totalMonitores] = await Promise.all([
			ctx.db.aluno.count({ where: { semestreId: semestre.id } }),
			ctx.db.user.count({ where: { role: "PROFESSOR" } }),
			ctx.db.user.count({ where: { role: "MONITOR" } }),
		]);
		return {
			semestre,
			totalAlunos,
			totalProfessores,
			totalMonitores,
			role: usuario?.role ?? null,
		};
	}),

	semestres: createTRPCRouter({
		list: directorProcedure.query(async ({ ctx }) => {
			const semestres = await ctx.db.semestre.findMany({
				select: {
					id: true,
					codigo: true,
					ativo: true,
					turmas: {
						select: {
							alunos: { select: { alunoId: true } },
							professores: { select: { userId: true } },
							monitores: { select: { userId: true } },
						},
					},
				},
				orderBy: { createdAt: "asc" },
			});
			return semestres.map(({ turmas, ...semestre }) => ({
				...semestre,
				totalTurmas: turmas.length,
				totalAlunos: new Set(
					turmas.flatMap((turma) => turma.alunos.map((aluno) => aluno.alunoId)),
				).size,
				totalProfessores: new Set(
					turmas.flatMap((turma) =>
						turma.professores.map((professor) => professor.userId),
					),
				).size,
				totalMonitores: new Set(
					turmas.flatMap((turma) =>
						turma.monitores.map((monitor) => monitor.userId),
					),
				).size,
			}));
		}),
		create: directorProcedure
			.input(
				z.object({
					codigo: z
						.string()
						.regex(/^\d{4}\.[12]$/, "Use o formato AAAA.1 ou AAAA.2."),
				}),
			)
			.mutation(({ ctx, input }) =>
				ctx.db.semestre.create({
					data: { codigo: input.codigo },
					select: { id: true },
				}),
			),
		setAtivo: directorProcedure
			.input(z.object({ id }))
			.mutation(async ({ ctx, input }) =>
				ctx.db.$transaction(async (tx) => {
					await tx.semestre.updateMany({ data: { ativo: false } });
					return tx.semestre.update({
						where: { id: input.id },
						data: { ativo: true },
						select: { id: true },
					});
				}),
			),
		remove: directorProcedure
			.input(z.object({ id }))
			.mutation(async ({ ctx, input }) => {
				const semestre = await ctx.db.semestre.findUnique({
					where: { id: input.id },
					select: {
						_count: {
							select: { turmas: true, alunos: true, candidatos: true },
						},
					},
				});
				if (!semestre) throw new TRPCError({ code: "NOT_FOUND" });
				if (
					semestre._count.turmas ||
					semestre._count.alunos ||
					semestre._count.candidatos
				)
					throw new TRPCError({
						code: "CONFLICT",
						message:
							"Não é possível excluir um semestre que possui turmas, alunos ou candidatos.",
					});
				await ctx.db.semestre.delete({ where: { id: input.id } });
				return { id: input.id };
			}),
	}),

	usuarios: createTRPCRouter({
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
							select: { turma: { select: { id: true, titulo: true, semestre: { select: { codigo: true } } } } },
						},
						turmasMonitor: {
							select: { turma: { select: { id: true, titulo: true, semestre: { select: { codigo: true } } } } },
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
		update: directorProcedure
			.input(personInput.extend({ id, role: z.enum(["PROFESSOR", "MONITOR"]) }))
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
						senha: await hashPassword(input.matricula),
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
	}),

	diretores: createTRPCRouter({
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
			.input(personInput.extend({ senha: z.string().min(10).max(128) }))
			.mutation(async ({ ctx, input }) =>
				ctx.db.user.create({
					data: {
						nome: input.nome,
						email: input.email,
						matricula: input.matricula,
						senha: await hashPassword(input.senha),
						role: "DIRETOR",
					},
					select: { id: true },
				}),
			),
		update: coordinatorProcedure
			.input(personInput.extend({ id }))
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
						...(input.senha ? { senha: await hashPassword(input.senha) } : {}),
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
	}),

	candidatos: createTRPCRouter({
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
					},
					orderBy: [{ curso: "asc" }, { ficha: "asc" }],
				}),
			),
		create: directorProcedure
			.input(
				z.object({
					semestreId: id,
					ficha: z.string().trim().min(1).max(40),
					nome: text,
					dataNascimento: z.coerce.date(),
					cpf: z
						.string()
						.trim()
						.regex(/^\d{11}$/),
					telefone: z.string().trim().min(8).max(30),
					emergencia: z.string().trim().min(8).max(160),
					curso: z.enum(["SMARTPHONE", "COMPUTADOR"]),
				}),
			)
			.mutation(({ ctx, input }) =>
				ctx.db.candidato.create({ data: input, select: { id: true } }),
			),
		update: directorProcedure
			.input(
				z.object({
					id,
					semestreId: id,
					ficha: z.string().trim().min(1).max(40),
					nome: text,
					dataNascimento: z.coerce.date(),
					cpf: z
						.string()
						.trim()
						.regex(/^\d{11}$/),
					telefone: z.string().trim().min(8).max(30),
					emergencia: z.string().trim().min(8).max(160),
					curso: z.enum(["SMARTPHONE", "COMPUTADOR"]),
				}),
			)
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
		remove: directorProcedure
			.input(z.object({ id, semestreId: id }))
			.mutation(async ({ ctx, input }) => {
				const result = await ctx.db.candidato.deleteMany({ where: input });
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),

	presencas: createTRPCRouter({
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
			.input(
				z.object({
					turmaId: id,
					data: z.coerce.date(),
					alunos: z
						.array(
							z.object({
								id,
								estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]),
							}),
						)
						.max(300),
					monitores: z
						.array(
							z.object({
								id,
								estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]),
							}),
						)
						.max(50),
					professores: z
						.array(
							z.object({
								id,
								estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]),
							}),
						)
						.max(50),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				const turma = await ctx.db.turma.findUnique({
					where: { id: input.turmaId },
					select: {
						alunos: { select: { alunoId: true } },
						monitores: { select: { userId: true } },
						professores: { select: { userId: true } },
						eventos: { where: { tipo: "AULA" }, select: { data: true } },
					},
				});
				if (!turma) throw new TRPCError({ code: "NOT_FOUND" });
				const inicioDoDia = new Date(input.data);
				inicioDoDia.setUTCHours(0, 0, 0, 0);
				const fimDoDia = new Date(inicioDoDia);
				fimDoDia.setUTCDate(fimDoDia.getUTCDate() + 1);
				if (!turma.eventos.some((evento) => evento.data >= inicioDoDia && evento.data < fimDoDia))
					throw new TRPCError({ code: "BAD_REQUEST", message: "A presença só pode ser registrada em uma data de aula da turma." });
				const conferir = (
					enviados: { id: string }[],
					permitidos: { alunoId?: string; userId?: string }[],
				) =>
					enviados.every((pessoa) =>
						permitidos.some(
							(vinculo) => (vinculo.alunoId ?? vinculo.userId) === pessoa.id,
						),
					);
				if (
					!conferir(input.alunos, turma.alunos) ||
					!conferir(input.monitores, turma.monitores) ||
					!conferir(input.professores, turma.professores)
				)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Há pessoas que não pertencem a esta turma.",
					});
				return ctx.db.$transaction(async (tx) => {
					const registro = await tx.registroPresenca.upsert({
						where: {
							turmaId_data: { turmaId: input.turmaId, data: input.data },
						},
						create: { turmaId: input.turmaId, data: input.data },
						update: {},
					});
					await Promise.all([
						tx.presencaAluno.deleteMany({ where: { registroId: registro.id } }),
						tx.presencaMonitor.deleteMany({
							where: { registroId: registro.id },
						}),
						tx.presencaProfessor.deleteMany({
							where: { registroId: registro.id },
						}),
					]);
					await Promise.all([
						input.alunos.length
							? tx.presencaAluno.createMany({
									data: input.alunos.map((pessoa) => ({
										registroId: registro.id,
										alunoId: pessoa.id,
										estado: pessoa.estado,
									})),
								})
							: undefined,
						input.monitores.length
							? tx.presencaMonitor.createMany({
									data: input.monitores.map((pessoa) => ({
										registroId: registro.id,
										monitorId: pessoa.id,
										estado: pessoa.estado,
									})),
								})
							: undefined,
						input.professores.length
							? tx.presencaProfessor.createMany({
									data: input.professores.map((pessoa) => ({
										registroId: registro.id,
										professorId: pessoa.id,
										estado: pessoa.estado,
									})),
								})
							: undefined,
					]);
					return { id: registro.id };
				});
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
	}),

	turmas: createTRPCRouter({
		list: directorProcedure
			.input(z.object({ semestreId: id.optional() }).optional())
			.query(({ ctx, input }) =>
				ctx.db.turma.findMany({
					where: input?.semestreId ? { semestreId: input.semestreId } : {},
					select: {
						id: true,
						titulo: true,
						sala: true,
						horario: true,
						cor: true,
						semestreId: true,
						professores: {
							select: {
								user: { select: { id: true, nome: true, role: true } },
							},
						},
						monitores: {
							select: {
								user: { select: { id: true, nome: true, role: true } },
							},
						},
						alunos: { select: { aluno: { select: { id: true, nome: true } } } },
						materiais: {
							select: { id: true, titulo: true, tipo: true, url: true },
						},
						eventos: { select: { id: true, data: true, titulo: true, tipo: true } },
					},
					orderBy: { titulo: "asc" },
				}),
			),
		create: directorProcedure
			.input(turmaInput)
			.mutation(async ({ ctx, input }) => {
				await validateTurmaRelations(ctx, input);
				return ctx.db.turma.create({
					data: {
						semestreId: input.semestreId,
						titulo: input.titulo,
						sala: input.sala,
						horario: input.horario,
						cor: input.cor,
						professores: {
							create: input.professorIds.map((userId) => ({ userId })),
						},
						monitores: {
							create: input.monitorIds.map((userId) => ({ userId })),
						},
						alunos: { create: input.alunoIds.map((alunoId) => ({ alunoId })) },
						materiais: { create: input.materiais },
						eventos: {
							create: input.aulas,
						},
					},
					select: { id: true },
				});
			}),
		duplicate: directorProcedure
			.input(z.object({ id }))
			.mutation(async ({ ctx, input }) => {
				const origem = await ctx.db.turma.findUnique({
					where: { id: input.id },
					select: {
						semestreId: true,
						titulo: true,
						sala: true,
						horario: true,
						cor: true,
						professores: { select: { userId: true } },
						monitores: { select: { userId: true } },
						materiais: { select: { titulo: true, tipo: true, url: true } },
						eventos: { select: { titulo: true, data: true, tipo: true } },
					},
				});
				if (!origem) throw new TRPCError({ code: "NOT_FOUND" });
				const titulo = `${origem.titulo}-copia`;
				const jaExiste = await ctx.db.turma.findFirst({
					where: { semestreId: origem.semestreId, titulo },
					select: { id: true },
				});
				if (jaExiste) {
					throw new TRPCError({
						code: "CONFLICT",
						message: `Já existe uma turma com o nome \"${titulo}\" neste semestre. Renomeie a cópia existente antes de duplicar novamente.`,
					});
				}
				return ctx.db.turma.create({
					data: {
						semestreId: origem.semestreId,
						titulo,
						sala: origem.sala,
						horario: origem.horario,
						cor: origem.cor,
						professores: { create: origem.professores.map(({ userId }) => ({ userId })) },
						monitores: { create: origem.monitores.map(({ userId }) => ({ userId })) },
						materiais: { create: origem.materiais },
						eventos: { create: origem.eventos },
					},
					select: { id: true, titulo: true },
				});
			}),
		update: directorProcedure
			.input(turmaInput.extend({ id }))
			.mutation(async ({ ctx, input }) => {
				await validateTurmaRelations(ctx, input);
				const [existing, semestreDestino] = await Promise.all([
					ctx.db.turma.findUnique({
						where: { id: input.id },
						select: {
							id: true,
							semestreId: true,
							alunos: { select: { alunoId: true } },
						},
					}),
					ctx.db.semestre.findUnique({
						where: { id: input.semestreId },
						select: { id: true },
					}),
				]);
				if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
				if (!semestreDestino) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Semestre de destino inválido.",
					});
				}
				const mudouSemestre = existing.semestreId !== input.semestreId;
				const alunosVinculados = existing.alunos.map((aluno) => aluno.alunoId);
				const alunoIds = Array.from(
					new Set([
						...input.alunoIds,
						...(mudouSemestre ? alunosVinculados : []),
					]),
				);
				return ctx.db.$transaction(async (tx: any) => {
					if (mudouSemestre && alunosVinculados.length) {
						await tx.aluno.updateMany({
							where: {
								id: { in: alunosVinculados },
								semestreId: existing.semestreId,
							},
							data: { semestreId: input.semestreId },
						});
						await tx.alunoTurma.deleteMany({
							where: {
								alunoId: { in: alunosVinculados },
								turmaId: { not: input.id },
								turma: { semestreId: { not: input.semestreId } },
							},
						});
					}
					await tx.professorTurma.deleteMany({ where: { turmaId: input.id } });
					await tx.monitorTurma.deleteMany({ where: { turmaId: input.id } });
					await tx.alunoTurma.deleteMany({ where: { turmaId: input.id } });
					await tx.material.deleteMany({ where: { turmaId: input.id } });
					await tx.eventoCalendario.deleteMany({
						where: { turmaId: input.id },
					});
					return tx.turma.update({
						where: { id: input.id },
						data: {
							semestreId: input.semestreId,
							titulo: input.titulo,
							sala: input.sala,
							horario: input.horario,
							cor: input.cor,
							professores: {
								create: input.professorIds.map((userId) => ({ userId })),
							},
							monitores: {
								create: input.monitorIds.map((userId) => ({ userId })),
							},
							alunos: {
								create: alunoIds.map((alunoId) => ({ alunoId })),
							},
							materiais: { create: input.materiais },
							eventos: {
							create: input.aulas,
							},
						},
						select: { id: true },
					});
				});
			}),
		remove: directorProcedure
			.input(z.object({ id }))
			.mutation(async ({ ctx, input }) => {
				const result = await ctx.db.turma.deleteMany({
					where: { id: input.id },
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),

	alunos: createTRPCRouter({
		list: directorProcedure
			.input(
				z.object({
					semestreId: id,
					busca: z.string().trim().max(80).optional(),
				}),
			)
			.query(({ ctx, input }) =>
				ctx.db.aluno.findMany({
					where: {
						semestreId: input.semestreId,
						...(input.busca
							? { nome: { contains: input.busca, mode: "insensitive" } }
							: {}),
					},
					select: {
						id: true,
						nome: true,
						dataNascimento: true,
						cpf: true,
						corRaca: true,
						identidadeGenero: true,
						lgbtqiapn: true,
						telefone: true,
						contatoEmergencia: true,
						email: true,
						escolaridade: true,
						cuidaTerceiros: true,
						trabalha: true,
						trabalhoLocal: true,
						trabalhoFuncao: true,
						estuda: true,
						estudoLocal: true,
						estudoCurso: true,
						problemaSaude: true,
						problemaSaudeQual: true,
						necessidadeEspecial: true,
						necessidadeEspecialQual: true,
						acessoInternet: true,
						temComputador: true,
						temSmartphone: true,
						sistemaSmartphone: true,
						turmas: {
							select: { turma: { select: { id: true, titulo: true } } },
						},
					},
					orderBy: { nome: "asc" },
					take: 200,
				}),
			),
		create: directorProcedure
			.input(alunoInput)
			.mutation(async ({ ctx, input }) => {
				const { turmaIds, ...aluno } = input;
				const valid = await ctx.db.turma.count({
					where: { id: { in: turmaIds }, semestreId: input.semestreId },
				});
				if (valid !== new Set(turmaIds).size)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Turma inválida para o semestre.",
					});
				return ctx.db.aluno.create({
					data: {
						...aluno,
						turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
					},
					select: { id: true },
				});
			}),
		update: directorProcedure
			.input(alunoInput.extend({ id }))
			.mutation(async ({ ctx, input }) => {
				const { id: alunoId, turmaIds, ...aluno } = input;
				const valid = await ctx.db.turma.count({
					where: { id: { in: turmaIds }, semestreId: input.semestreId },
				});
				if (valid !== new Set(turmaIds).size)
					throw new TRPCError({ code: "BAD_REQUEST" });
				const existing = await ctx.db.aluno.findFirst({
					where: { id: alunoId, semestreId: input.semestreId },
					select: { id: true },
				});
				if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
				return ctx.db.$transaction(async (tx: any) => {
					await tx.alunoTurma.deleteMany({ where: { alunoId } });
					return tx.aluno.update({
						where: { id: alunoId },
						data: {
							...aluno,
							turmas: { create: turmaIds.map((turmaId) => ({ turmaId })) },
						},
						select: { id: true },
					});
				});
			}),
		remove: directorProcedure
			.input(z.object({ id, semestreId: id }))
			.mutation(async ({ ctx, input }) => {
				const result = await ctx.db.aluno.deleteMany({ where: input });
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
});
