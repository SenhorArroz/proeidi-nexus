import type { db } from "~/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const turmaId = z.string().cuid();

export const texto = z.string().trim().min(1).max(1000);

export async function acessoTurma(
	ctx: { db: typeof db; session: { user: { id: string } } },
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
