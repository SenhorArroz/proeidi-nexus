import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const turmaId = z.string().cuid();
const texto = z.string().trim().min(1).max(1000);

async function acessoTurma(ctx: { db: any; session: { user: { id: string } } }, id: string) {
	const usuario = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, select: { role: true } });
	if (!usuario) throw new TRPCError({ code: "UNAUTHORIZED" });
	if (usuario.role === "COORDENADOR" || usuario.role === "DIRETOR") return usuario.role;
	const vinculo = usuario.role === "MONITOR"
		? await ctx.db.monitorTurma.findUnique({ where: { userId_turmaId: { userId: ctx.session.user.id, turmaId: id } }, select: { userId: true } })
		: await ctx.db.professorTurma.findUnique({ where: { userId_turmaId: { userId: ctx.session.user.id, turmaId: id } }, select: { userId: true } });
	if (!vinculo) throw new TRPCError({ code: "FORBIDDEN", message: "Você não possui vínculo com esta turma." });
	return usuario.role;
}

/** Turmas disponíveis ao usuário autenticado, filtradas no servidor por vínculo e cargo. */
export const turmaRouter = createTRPCRouter({
	minhas: protectedProcedure.query(async ({ ctx }) => {
		const usuario = await ctx.db.user.findUnique({ where: { id: ctx.session.user.id }, select: { nome: true, role: true } });
		if (!usuario) return { usuario: null, turmas: [] };
		const where = usuario.role === "COORDENADOR" ? {} : usuario.role === "MONITOR" ? { monitores: { some: { userId: ctx.session.user.id } } } : { professores: { some: { userId: ctx.session.user.id } } };
		const turmas = await ctx.db.turma.findMany({
			where,
			select: { id: true, titulo: true, sala: true, horario: true, cor: true, corDestaque: true, corFundo: true, corTexto: true, corTitulo: true, corDescricao: true, fonte: true, semestre: { select: { codigo: true } }, alunos: { select: { alunoId: true } }, eventos: { where: { data: { gte: new Date() }, tipo: "AULA" }, orderBy: { data: "asc" }, take: 1, select: { data: true } } },
			orderBy: [{ semestre: { codigo: "desc" } }, { titulo: "asc" }],
		});
		return { usuario, turmas };
	}),
		detalhe: protectedProcedure.input(z.object({ id: turmaId })).query(async ({ ctx, input }) => {
		const role = await acessoTurma(ctx, input.id);
		const turma = await ctx.db.turma.findUnique({ where: { id: input.id }, select: {
			id: true, titulo: true, sala: true, horario: true, cor: true, corDestaque: true, corFundo: true, corTexto: true, corTitulo: true, corDescricao: true, fonte: true, semestre: { select: { codigo: true } },
			professores: { select: { user: { select: { id: true, nome: true } } } }, monitores: { select: { user: { select: { id: true, nome: true } } } }, alunos: { select: { aluno: { select: { id: true, nome: true } } } },
			materiais: { orderBy: { createdAt: "desc" }, select: { id: true, titulo: true, tipo: true, url: true, createdAt: true } }, eventos: { orderBy: { data: "asc" }, select: { id: true, titulo: true, data: true, tipo: true } },
			avisos: { orderBy: [{ fixado: "desc" }, { createdAt: "desc" }], select: { id: true, autorId: true, texto: true, imagemUrl: true, linkUrl: true, fixado: true, createdAt: true, autor: { select: { nome: true } } } },
			...(role === "MONITOR" ? {} : { anotacoes: { where: { autorId: ctx.session.user.id }, orderBy: { createdAt: "desc" }, select: { id: true, titulo: true, conteudo: true, createdAt: true } } }),
		} });
		if (!turma) throw new TRPCError({ code: "NOT_FOUND" });
		return { turma, role, usuarioId: ctx.session.user.id };
	}),
	configurarTema: protectedProcedure.input(z.object({ turmaId, cor: z.string().regex(/^#[0-9a-fA-F]{6}$/), corDestaque: z.string().regex(/^#[0-9a-fA-F]{6}$/), corFundo: z.string().regex(/^#[0-9a-fA-F]{6}$/), corTexto: z.string().regex(/^#[0-9a-fA-F]{6}$/), corTitulo: z.string().regex(/^#[0-9a-fA-F]{6}$/), corDescricao: z.string().regex(/^#[0-9a-fA-F]{6}$/), fonte: z.enum(["SANS", "SERIF", "MONO"]) })).mutation(async ({ ctx, input }) => { if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN", message: "Monitores não podem editar a turma." }); return ctx.db.turma.update({ where: { id: input.turmaId }, data: { cor: input.cor, corDestaque: input.corDestaque, corFundo: input.corFundo, corTexto: input.corTexto, corTitulo: input.corTitulo, corDescricao: input.corDescricao, fonte: input.fonte } }); }),
	avisos: createTRPCRouter({
		create: protectedProcedure.input(z.object({ turmaId, texto: z.string().trim().max(4000).optional().default(""), imagemUrl: z.string().url().max(2048).optional().nullable(), linkUrl: z.string().trim().url().max(2048).optional().nullable() })).mutation(async ({ ctx, input }) => { await acessoTurma(ctx, input.turmaId); if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl) throw new TRPCError({ code: "BAD_REQUEST", message: "Escreva um aviso, envie uma imagem ou adicione um link." }); return ctx.db.aviso.create({ data: { ...input, texto: input.texto.trim(), imagemUrl: input.imagemUrl ?? null, linkUrl: input.linkUrl ?? null, autorId: ctx.session.user.id }, select: { id: true } }); }),
		update: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid(), texto: z.string().trim().max(4000).optional().default(""), imagemUrl: z.string().url().max(2048).optional().nullable(), linkUrl: z.string().trim().url().max(2048).optional().nullable() })).mutation(async ({ ctx, input }) => {
			if (await acessoTurma(ctx, input.turmaId) !== "PROFESSOR") throw new TRPCError({ code: "FORBIDDEN", message: "Somente professores podem editar avisos." });
			if (!input.texto.trim() && !input.imagemUrl && !input.linkUrl) throw new TRPCError({ code: "BAD_REQUEST", message: "Escreva um aviso, envie uma imagem ou adicione um link." });
			const result = await ctx.db.aviso.updateMany({ where: { id: input.id, turmaId: input.turmaId, autorId: ctx.session.user.id }, data: { texto: input.texto.trim(), imagemUrl: input.imagemUrl ?? null, linkUrl: input.linkUrl ?? null } });
			if (!result.count) throw new TRPCError({ code: "NOT_FOUND" });
			return { id: input.id };
		}),
		setFixado: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid(), fixado: z.boolean() })).mutation(async ({ ctx, input }) => { const role = await acessoTurma(ctx, input.turmaId); if (role === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" }); return ctx.db.aviso.updateMany({ where: { id: input.id, turmaId: input.turmaId }, data: { fixado: input.fixado } }); }),
		remove: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid() })).mutation(async ({ ctx, input }) => { const role = await acessoTurma(ctx, input.turmaId); const result = await ctx.db.aviso.deleteMany({ where: { id: input.id, turmaId: input.turmaId, ...(role === "MONITOR" ? { autorId: ctx.session.user.id } : {}) } }); if (!result.count) throw new TRPCError({ code: "NOT_FOUND" }); return { id: input.id }; }),
	}),
	materiais: createTRPCRouter({
		create: protectedProcedure.input(z.object({ turmaId, titulo: texto.max(160), url: z.string().trim().url().max(2048), tipo: z.enum(["LINK", "PDF", "SLIDE", "IMAGEM"]).default("LINK") })).mutation(async ({ ctx, input }) => { if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN", message: "Monitores não podem criar materiais." }); return ctx.db.material.create({ data: input, select: { id: true } }); }),
		remove: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid() })).mutation(async ({ ctx, input }) => { if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN", message: "Monitores não podem remover materiais." }); const result = await ctx.db.material.deleteMany({ where: { id: input.id, turmaId: input.turmaId } }); if (!result.count) throw new TRPCError({ code: "NOT_FOUND" }); return { id: input.id }; }),
	}),
	anotacoes: createTRPCRouter({
		create: protectedProcedure.input(z.object({ turmaId, titulo: texto.max(160), conteudo: z.string().trim().max(4000) })).mutation(async ({ ctx, input }) => { if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" }); return ctx.db.anotacao.create({ data: { ...input, autorId: ctx.session.user.id }, select: { id: true } }); }),
		remove: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid() })).mutation(async ({ ctx, input }) => { if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" }); const result = await ctx.db.anotacao.deleteMany({ where: { id: input.id, turmaId: input.turmaId, autorId: ctx.session.user.id } }); if (!result.count) throw new TRPCError({ code: "NOT_FOUND" }); return { id: input.id }; }),
	}),
	calendario: createTRPCRouter({
		create: protectedProcedure.input(z.object({ turmaId, titulo: texto.max(160), data: z.coerce.date(), tipo: z.enum(["AULA", "FERIADO", "CANCELADA", "ESPECIAL"]) })).mutation(async ({ ctx, input }) => { await acessoTurma(ctx, input.turmaId); return ctx.db.eventoCalendario.create({ data: input, select: { id: true } }); }),
		remove: protectedProcedure.input(z.object({ turmaId, id: z.string().cuid() })).mutation(async ({ ctx, input }) => { await acessoTurma(ctx, input.turmaId); const result = await ctx.db.eventoCalendario.deleteMany({ where: { id: input.id, turmaId: input.turmaId } }); if (!result.count) throw new TRPCError({ code: "NOT_FOUND" }); return { id: input.id }; }),
	}),
	presencas: createTRPCRouter({
		list: protectedProcedure.input(z.object({ turmaId })).query(async ({ ctx, input }) => {
			if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" });
			return ctx.db.registroPresenca.findMany({ where: { turmaId: input.turmaId }, orderBy: { data: "asc" }, select: { id: true, data: true, alunos: { select: { alunoId: true, estado: true } }, monitores: { select: { monitorId: true, estado: true } }, professores: { select: { professorId: true, estado: true } } } });
		}),
		salvar: protectedProcedure.input(z.object({ turmaId, data: z.coerce.date(), alunos: z.array(z.object({ id: z.string().cuid(), estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]) })).max(300), monitores: z.array(z.object({ id: z.string().cuid(), estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]) })).max(50), professores: z.array(z.object({ id: z.string().cuid(), estado: z.enum(["PRESENTE", "AUSENTE", "JUSTIFICADO"]) })).max(50) })).mutation(async ({ ctx, input }) => {
			if (await acessoTurma(ctx, input.turmaId) === "MONITOR") throw new TRPCError({ code: "FORBIDDEN" });
			const turma = await ctx.db.turma.findUnique({ where: { id: input.turmaId }, select: { alunos: { select: { alunoId: true } }, monitores: { select: { userId: true } }, professores: { select: { userId: true } }, eventos: { where: { tipo: "AULA" }, select: { data: true } } } });
			if (!turma) throw new TRPCError({ code: "NOT_FOUND" });
			const inicio = new Date(input.data); inicio.setUTCHours(0, 0, 0, 0); const fim = new Date(inicio); fim.setUTCDate(fim.getUTCDate() + 1);
			if (!turma.eventos.some((evento: { data: Date }) => evento.data >= inicio && evento.data < fim)) throw new TRPCError({ code: "BAD_REQUEST", message: "A presença só pode ser registrada em uma data de aula." });
			const conferir = (ids: string[], permitidos: string[]) => ids.every((id) => permitidos.includes(id));
			if (!conferir(input.alunos.map((p) => p.id), turma.alunos.map((p: { alunoId: string }) => p.alunoId)) || !conferir(input.monitores.map((p) => p.id), turma.monitores.map((p: { userId: string }) => p.userId)) || !conferir(input.professores.map((p) => p.id), turma.professores.map((p: { userId: string }) => p.userId))) throw new TRPCError({ code: "BAD_REQUEST", message: "Há pessoas sem vínculo com a turma." });
			return ctx.db.$transaction(async (tx: any) => { const registro = await tx.registroPresenca.upsert({ where: { turmaId_data: { turmaId: input.turmaId, data: input.data } }, create: { turmaId: input.turmaId, data: input.data }, update: {} }); await tx.presencaAluno.deleteMany({ where: { registroId: registro.id } }); await tx.presencaMonitor.deleteMany({ where: { registroId: registro.id } }); await tx.presencaProfessor.deleteMany({ where: { registroId: registro.id } }); if (input.alunos.length) await tx.presencaAluno.createMany({ data: input.alunos.map((p) => ({ registroId: registro.id, alunoId: p.id, estado: p.estado })) }); if (input.monitores.length) await tx.presencaMonitor.createMany({ data: input.monitores.map((p) => ({ registroId: registro.id, monitorId: p.id, estado: p.estado })) }); if (input.professores.length) await tx.presencaProfessor.createMany({ data: input.professores.map((p) => ({ registroId: registro.id, professorId: p.id, estado: p.estado })) }); return { id: registro.id }; });
		}),
	}),
});
