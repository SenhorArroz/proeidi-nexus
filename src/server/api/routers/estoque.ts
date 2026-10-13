import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { directorProcedure } from "~/server/api/routers/diretoria";
import { createTRPCRouter } from "~/server/api/trpc";
import type { db as database } from "~/server/db";

const id = z.string().cuid();
const nome = z.string().trim().min(1, "Informe o nome.").max(160);
const data = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, "Informe uma data válida.")
	.refine(
		(value) =>
			!Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) &&
			new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value,
		"Informe uma data válida.",
	);
const itemInput = z.object({
	nome,
	qtd: z.number().int().min(0, "A quantidade não pode ser negativa."),
	validade: data,
	categoriaIds: z.array(id).min(1, "Selecione ao menos uma categoria."),
});

async function validarCategorias(db: typeof database, categoriaIds: string[]) {
	const ids = [...new Set(categoriaIds)];
	const total = await db.categoriaItemEstoque.count({
		where: { id: { in: ids } },
	});
	if (total !== ids.length)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "Uma das categorias selecionadas não existe.",
		});
	return ids;
}

export const estoqueRouter = createTRPCRouter({
	listar: directorProcedure.query(({ ctx }) =>
		ctx.db.itemEstoque.findMany({
			include: { categorias: { orderBy: { nome: "asc" } } },
			orderBy: [{ validade: "asc" }, { nome: "asc" }],
		}),
	),
	listarCategorias: directorProcedure.query(({ ctx }) =>
		ctx.db.categoriaItemEstoque.findMany({ orderBy: { nome: "asc" } }),
	),
	criarCategoria: directorProcedure
		.input(z.object({ nome }))
		.mutation(async ({ ctx, input }) => {
			const existente = await ctx.db.categoriaItemEstoque.findFirst({
				where: { nome: { equals: input.nome, mode: "insensitive" } },
			});
			if (existente)
				throw new TRPCError({
					code: "CONFLICT",
					message: "Essa categoria já existe.",
				});
			return ctx.db.categoriaItemEstoque.create({ data: { nome: input.nome } });
		}),
	criar: directorProcedure.input(itemInput).mutation(async ({ ctx, input }) => {
		const ids = await validarCategorias(ctx.db, input.categoriaIds);
		return ctx.db.itemEstoque.create({
			data: {
				nome: input.nome,
				qtd: input.qtd,
				validade: new Date(`${input.validade}T00:00:00.000Z`),
				categorias: { connect: ids.map((id) => ({ id })) },
			},
		});
	}),
	atualizar: directorProcedure
		.input(itemInput.extend({ id }))
		.mutation(async ({ ctx, input }) => {
			const ids = await validarCategorias(ctx.db, input.categoriaIds);
			return ctx.db.itemEstoque.update({
				where: { id: input.id },
				data: {
					nome: input.nome,
					qtd: input.qtd,
					validade: new Date(`${input.validade}T00:00:00.000Z`),
					categorias: { set: ids.map((id) => ({ id })) },
				},
			});
		}),
	excluir: directorProcedure
		.input(z.object({ id }))
		.mutation(({ ctx, input }) =>
			ctx.db.itemEstoque.delete({ where: { id: input.id } }),
		),
});
