import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { avisosRouter } from "./_components/turma/avisos";
import { conteudoProcedures } from "./_components/turma/conteudo";
import { presencasRouter } from "./_components/turma/presencas";
import { turmaId, acessoTurma } from "./_components/turma/suporte";

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
	avisos: avisosRouter,
	...conteudoProcedures,
	presencas: presencasRouter,
});
