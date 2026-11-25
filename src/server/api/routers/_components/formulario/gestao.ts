import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { protectedProcedure } from "~/server/api/trpc";
import {
	conteudoSchema,
	modoRespostaSchema,
	visibilidadeSchema,
	configuracaoSchema,
} from "./suporte";

const questionarioProcedure = protectedProcedure.use(({ ctx, next }) => {
	if (!["PROFESSOR", "DIRETOR", "COORDENADOR"].includes(ctx.session.user.role))
		throw new TRPCError({
			code: "FORBIDDEN",
			message: "Monitores não têm acesso à gestão de questionários.",
		});
	return next();
});

const podeGerirTudo = (role: string) =>
	role === "DIRETOR" || role === "COORDENADOR";

function garantirVisibilidadePermitida(
	role: string,
	visibilidade: z.infer<typeof visibilidadeSchema>,
) {
	if (visibilidade === "DIRETORIA" && !podeGerirTudo(role))
		throw new TRPCError({
			code: "FORBIDDEN",
			message:
				"Somente diretores e a coordenação podem criar questionários restritos à Diretoria.",
		});
}

const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.slice(0, 72);

export const gestaoProcedures = {
	list: questionarioProcedure.query(async ({ ctx }) => {
		const lideranca = podeGerirTudo(ctx.session.user.role);
		const formularios = await ctx.db.formulario.findMany({
			where: lideranca ? {} : { visibilidade: "COMPARTILHADO" },
			orderBy: { updatedAt: "desc" },
			include: {
				autor: { select: { id: true, nome: true, role: true } },
				_count: { select: { respostas: true } },
			},
		});
		return formularios.map((formulario) => ({
			...formulario,
			podeGerenciar: lideranca || formulario.autorId === ctx.session.user.id,
		}));
	}),
	create: questionarioProcedure
		.input(
			z.object({
				titulo: z.string().min(3).max(160),
				descricao: z.string().max(1000).nullable().optional(),
				conteudo: conteudoSchema,
				publicado: z.boolean().default(false),
				modoResposta: modoRespostaSchema.default("ANONIMO"),
				limitarPorNavegador: z.boolean().default(false),
				configuracao: configuracaoSchema.default({}),
				visibilidade: visibilidadeSchema.default("COMPARTILHADO"),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			garantirVisibilidadePermitida(ctx.session.user.role, input.visibilidade);
			const base = slugify(input.titulo) || "questionario";
			let slug = base;
			let attempt = 2;
			while (
				await ctx.db.formulario.findUnique({
					where: { slug },
					select: { id: true },
				})
			)
				slug = `${base}-${attempt++}`;
			return ctx.db.formulario.create({
				data: {
					...input,
					descricao: input.descricao || null,
					slug,
					autorId: ctx.session.user.id,
				},
			});
		}),
	update: questionarioProcedure
		.input(
			z.object({
				id: z.string().cuid(),
				titulo: z.string().min(3).max(160),
				descricao: z.string().max(1000).nullable().optional(),
				conteudo: conteudoSchema,
				publicado: z.boolean(),
				modoResposta: modoRespostaSchema,
				limitarPorNavegador: z.boolean(),
				configuracao: configuracaoSchema,
				visibilidade: visibilidadeSchema,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { id: input.id },
				select: { autorId: true },
			});
			if (!formulario) throw new TRPCError({ code: "NOT_FOUND" });
			if (
				!podeGerirTudo(ctx.session.user.role) &&
				formulario.autorId !== ctx.session.user.id
			)
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você só pode editar os seus próprios questionários.",
				});
			garantirVisibilidadePermitida(ctx.session.user.role, input.visibilidade);
			return ctx.db.formulario.update({
				where: { id: input.id },
				data: {
					titulo: input.titulo,
					descricao: input.descricao || null,
					conteudo: input.conteudo,
					publicado: input.publicado,
					modoResposta: input.modoResposta,
					limitarPorNavegador: input.limitarPorNavegador,
					configuracao: input.configuracao,
					visibilidade: input.visibilidade,
				},
			});
		}),
	remove: questionarioProcedure
		.input(z.object({ id: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { id: input.id },
				select: { autorId: true },
			});
			if (!formulario) throw new TRPCError({ code: "NOT_FOUND" });
			if (
				!podeGerirTudo(ctx.session.user.role) &&
				formulario.autorId !== ctx.session.user.id
			)
				throw new TRPCError({
					code: "FORBIDDEN",
					message: "Você só pode excluir os seus próprios questionários.",
				});
			return ctx.db.formulario.delete({ where: { id: input.id } });
		}),
	stats: questionarioProcedure
		.input(z.object({ id: z.string().cuid() }))
		.query(async ({ ctx, input }) => {
			const formulario = await ctx.db.formulario.findUnique({
				where: { id: input.id },
				include: { respostas: { orderBy: { createdAt: "desc" } } },
			});
			if (!formulario) throw new TRPCError({ code: "NOT_FOUND" });
			if (
				!podeGerirTudo(ctx.session.user.role) &&
				formulario.autorId !== ctx.session.user.id
			)
				throw new TRPCError({
					code: "FORBIDDEN",
					message:
						"Você só pode acessar as respostas dos seus próprios questionários.",
				});
			return { formulario, totalRespostas: formulario.respostas.length };
		}),
};
