import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { sendPostTurmaEmail } from "~/server/email";
import { salvarPresencasDaTurma, salvarPresencasInput } from "~/server/presencas";

const turmaId = z.string().cuid();
const texto = z.string().trim().min(1).max(1000);

async function acessoTurma(
	ctx: { db: any; session: { user: { id: string } } },
	id: string,
) {
	const usuario = await ctx.db.user.findUnique({
		where: { id: ctx.session.user.id },
		select: { role: true },
	});
	if (!usuario) throw new TRPCError({ code: "UNAUTHORIZED" });
	if (usuario.role === "COORDENADOR" || usuario.role === "DIRETOR")
		return usuario.role;
	const vinculo =
		usuario.role === "MONITOR"
			? await ctx.db.monitorTurma.findUnique({
					where: {
						userId_turmaId: { userId: ctx.session.user.id, turmaId: id },
					},
					select: { userId: true },
				})
			: await ctx.db.professorTurma.findUnique({
					where: {
						userId_turmaId: { userId: ctx.session.user.id, turmaId: id },
					},
					select: { userId: true },
				});
	if (!vinculo)
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Você não possui vínculo com esta turma.",
		});
	return usuario.role;
}

/** Turmas disponíveis ao usuário autenticado, filtradas no servidor por vínculo e cargo. */
export const turmaRouter = createTRPCRouter({
	minhas: protectedProcedure.query(async ({ ctx }) => {
		const usuario = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { nome: true, role: true },
		});
		if (!usuario) return { usuario: null, turmas: [] };
		const where =
			usuario.role === "COORDENADOR"
				? {}
				: usuario.role === "MONITOR"
					? { monitores: { some: { userId: ctx.session.user.id } } }
					: { professores: { some: { userId: ctx.session.user.id } } };
		const turmas = await ctx.db.turma.findMany({
			where,
			select: {
				id: true,
				titulo: true,
				sala: true,
				horario: true,
				cor: true,
				corDestaque: true,
				corFundo: true,
				corTexto: true,
				corTitulo: true,
				corDescricao: true,
				fonte: true,
				semestre: { select: { codigo: true } },
				alunos: { select: { alunoId: true } },
				eventos: {
					where: { data: { gte: new Date() }, tipo: "AULA" },
					orderBy: { data: "asc" },
					take: 1,
					select: { data: true },
				},
			},
			orderBy: [{ semestre: { codigo: "desc" } }, { titulo: "asc" }],
		});
		return { usuario, turmas };
	}),
	detalhe: protectedProcedure
		.input(z.object({ id: turmaId }))
		.query(async ({ ctx, input }) => {
			const role = await acessoTurma(ctx, input.id);
			const turma = await ctx.db.turma.findUnique({
				where: { id: input.id },
				select: {
					id: true,
					titulo: true,
					sala: true,
					horario: true,
					cor: true,
					corDestaque: true,
					corFundo: true,
					corTexto: true,
					corTitulo: true,
					corDescricao: true,
					fonte: true,
					semestre: { select: { codigo: true } },
					professores: {
						select: { user: { select: { id: true, nome: true } } },
					},
					monitores: { select: { user: { select: { id: true, nome: true } } } },
					alunos: { select: { aluno: { select: { id: true, nome: true } } } },
					materiais: {
						orderBy: { createdAt: "desc" },
						select: {
							id: true,
							titulo: true,
							tipo: true,
							url: true,
							createdAt: true,
						},
					},
					eventos: {
						orderBy: { data: "asc" },
						select: { id: true, titulo: true, data: true, tipo: true },
					},
					avisos: {
						orderBy: [{ fixado: "desc" }, { createdAt: "desc" }],
						select: {
							id: true,
							autorId: true,
							texto: true,
							imagemUrl: true,
							linkUrl: true,
							fixado: true,
							createdAt: true,
							autor: { select: { nome: true } },
						},
					},
					...(role === "MONITOR"
						? {}
						: {
								anotacoes: {
									where: { autorId: ctx.session.user.id },
									orderBy: { createdAt: "desc" },
									select: {
										id: true,
										titulo: true,
										conteudo: true,
										createdAt: true,
									},
								},
							}),
				},
			});
			if (!turma) throw new TRPCError({ code: "NOT_FOUND" });
			return { turma, role, usuarioId: ctx.session.user.id };
		}),
	configurarTema: protectedProcedure
		.input(
			z.object({
				turmaId,
				cor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				corDestaque: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				corFundo: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				corTexto: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				corTitulo: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				corDescricao: z.string().regex(/^#[0-9a-fA-F]{6}$/),
				fonte: z.enum(["SANS", "SERIF", "MONO"]),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Monitores não podem editar a turma.",
				});
			return ctx.db.turma.update({
				where: { id: input.turmaId },
				data: {
					cor: input.cor,
					corDestaque: input.corDestaque,
					corFundo: input.corFundo,
					corTexto: input.corTexto,
					corTitulo: input.corTitulo,
					corDescricao: input.corDescricao,
					fonte: input.fonte,
				},
			});
		}),
	avisos: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					texto: z.string().trim().max(4000).optional().default(""),
					imagemUrl: z.string().url().max(2048).optional().nullable(),
					linkUrl: z.string().trim().url().max(2048).optional().nullable(),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				await acessoTurma(ctx, input.turmaId);
				if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Escreva um aviso, envie uma imagem ou adicione um link.",
					});

				const [turmaData, autorData, monitoresData, professoresData] = await Promise.all([
					ctx.db.turma.findUniqueOrThrow({
						where: { id: input.turmaId },
						select: { titulo: true },
					}),
					ctx.db.user.findUniqueOrThrow({
						where: { id: ctx.session.user.id },
						select: { nome: true },
					}),
					ctx.db.monitorTurma.findMany({
						where: { turmaId: input.turmaId },
						select: { user: { select: { id: true, email: true, nome: true } } },
					}),
					ctx.db.professorTurma.findMany({
						where: { turmaId: input.turmaId },
						select: { user: { select: { id: true, email: true, nome: true } } },
					}),
				]);

				const aviso = await ctx.db.aviso.create({
					data: {
						...input,
						texto: input.texto.trim(),
						imagemUrl: input.imagemUrl ?? null,
						linkUrl: input.linkUrl ?? null,
						autorId: ctx.session.user.id,
					},
					select: { id: true },
				});

				const pessoas = [...monitoresData, ...professoresData]
					.filter(
						(a): a is { user: { id: string; email: string; nome: string } } =>
							a.user.email !== null,
					)
					.filter((a) => ctx.session.user.id !== a.user.id)
					.map((a) => ({
						email: a.user.email,
						nome: a.user.nome,
					}));

				if (pessoas.length > 0) {
					sendPostTurmaEmail({
						turma: turmaData.titulo,
						post: input.texto.trim(),
						imagemUrl: input.imagemUrl ?? null,
						linkUrl: input.linkUrl ?? null,
						autor: autorData.nome,
						pessoas,
						turmaId: input.turmaId,
					}).catch((err) => console.error("Falha ao enviar e-mail de aviso:", err));
				}

				return aviso;
			}),
		update: protectedProcedure
			.input(
				z.object({
					turmaId,
					id: z.string().cuid(),
					texto: z.string().trim().max(4000).optional().default(""),
					imagemUrl: z.string().url().max(2048).optional().nullable(),
					linkUrl: z.string().trim().url().max(2048).optional().nullable(),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) !== "PROFESSOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Somente professores podem editar avisos.",
					});
				if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl)
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Escreva um aviso, envie uma imagem ou adicione um link.",
					});
				const result = await ctx.db.aviso.updateMany({
					where: {
						id: input.id,
						turmaId: input.turmaId,
						autorId: ctx.session.user.id,
					},
					data: {
						texto: input.texto.trim(),
						imagemUrl: input.imagemUrl ?? null,
						linkUrl: input.linkUrl ?? null,
					},
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
		setFixado: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid(), fixado: z.boolean() }))
			.mutation(async ({ ctx, input }) => {
				const role = await acessoTurma(ctx, input.turmaId);
				if (role === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" });
				return ctx.db.aviso.updateMany({
					where: { id: input.id, turmaId: input.turmaId },
					data: { fixado: input.fixado },
				});
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				const role = await acessoTurma(ctx, input.turmaId);
				const result = await ctx.db.aviso.deleteMany({
					where: {
						id: input.id,
						turmaId: input.turmaId,
						...(role === "MONITOR" ? { autorId: ctx.session.user.id } : {}),
					},
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	materiais: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					url: z.string().trim().url().max(2048),
					tipo: z.enum(["LINK", "PDF", "SLIDE", "IMAGEM"]).default("LINK"),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem criar materiais.",
					});
				return ctx.db.material.create({ data: input, select: { id: true } });
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem remover materiais.",
					});
				const result = await ctx.db.material.deleteMany({
					where: { id: input.id, turmaId: input.turmaId },
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	anotacoes: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					conteudo: z.string().trim().max(4000),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({ code: "FORBIDDEN" });
				return ctx.db.anotacao.create({
					data: { ...input, autorId: ctx.session.user.id },
					select: { id: true },
				});
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({ code: "FORBIDDEN" });
				const result = await ctx.db.anotacao.deleteMany({
					where: {
						id: input.id,
						turmaId: input.turmaId,
						autorId: ctx.session.user.id,
					},
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	calendario: createTRPCRouter({
		create: protectedProcedure
			.input(
				z.object({
					turmaId,
					titulo: texto.max(160),
					data: z.coerce.date(),
					tipo: z.enum(["AULA", "FERIADO", "CANCELADA", "ESPECIAL"]),
				}),
			)
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem gerenciar o calendário.",
					});
				return ctx.db.eventoCalendario.create({
					data: input,
					select: { id: true },
				});
			}),
		remove: protectedProcedure
			.input(z.object({ turmaId, id: z.string().cuid() }))
			.mutation(async ({ ctx, input }) => {
				if ((await acessoTurma(ctx, input.turmaId)) === "MONITOR")
					throw new TRPCError({
						code: "FORBIDDEN",
						message: "Monitores não podem gerenciar o calendário.",
					});
				const result = await ctx.db.eventoCalendario.deleteMany({
					where: { id: input.id, turmaId: input.turmaId },
				});
				if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
				return { id: input.id };
			}),
	}),
	presencas: createTRPCRouter({
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
	}),
});
