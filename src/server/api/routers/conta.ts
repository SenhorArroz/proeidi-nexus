import { randomBytes, randomInt } from "node:crypto";

import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { directorProcedure } from "~/server/api/routers/diretoria";
import {
	createTRPCRouter,
	protectedProcedure,
	publicProcedure,
} from "~/server/api/trpc";
import { hashPassword, verifyPassword } from "~/server/auth/password";
import { sendPasswordResetEmail } from "~/server/email";

const passwordInput = z.object({
	novaSenha: z
		.string()
		.min(8, "A senha deve ter ao menos 8 caracteres.")
		.max(128)
		.regex(/[A-Z]/, "A senha deve incluir ao menos uma letra maiúscula.")
		.regex(
			/[^A-Za-z0-9]/,
			"A senha deve incluir ao menos um caractere especial.",
		),
	confirmacao: z.string().max(128),
});

function validarConfirmacao(input: z.infer<typeof passwordInput>) {
	if (input.novaSenha !== input.confirmacao)
		throw new TRPCError({
			code: "BAD_REQUEST",
			message: "A confirmação de senha não confere.",
		});
}

export const contaRouter = createTRPCRouter({
	senhaObrigatoria: publicProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) return { obrigatoria: false };
		// Consulta escalar para manter a verificação funcional também enquanto o
		// servidor de desenvolvimento ainda possui o cliente Prisma anterior em memória.
		const [user] = await ctx.db.$queryRaw<
			Array<{ senhaAlteradaEm: Date | null }>
		>`
			SELECT "senhaAlteradaEm" FROM "User" WHERE "id" = ${ctx.session.user.id} LIMIT 1
		`;
		return { obrigatoria: Boolean(user && !user.senhaAlteradaEm) };
	}),
	alterarMinhaSenha: protectedProcedure
		.input(passwordInput)
		.mutation(async ({ ctx, input }) => {
			validarConfirmacao(input);
			const senhaHash = await hashPassword(input.novaSenha);
			await ctx.db.$executeRaw`
			UPDATE "User" SET "senha" = ${senhaHash}, "senhaAlteradaEm" = NOW() WHERE "id" = ${ctx.session.user.id}
		`;
			return { ok: true };
		}),
	solicitarRedefinicao: directorProcedure
		.input(z.object({ usuarioId: z.string().cuid() }))
		.mutation(async ({ ctx, input }) => {
			const [solicitante, destinatario] = await Promise.all([
				ctx.db.user.findUnique({
					where: { id: ctx.session.user.id },
					select: { role: true },
				}),
				ctx.db.user.findUnique({
					where: { id: input.usuarioId },
					select: { id: true, nome: true, email: true, role: true },
				}),
			]);
			if (!solicitante || !destinatario)
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Pessoa não encontrada.",
				});
			if (
				solicitante.role === "DIRETOR" &&
				!["PROFESSOR", "MONITOR"].includes(destinatario.role)
			)
				throw new TRPCError({
					code: "FORBIDDEN",
					message:
						"Diretores só podem solicitar redefinição para professores e monitores.",
				});

			const [recente] = await ctx.db.$queryRaw<Array<{ id: string }>>`
			SELECT "id" FROM "PasswordResetRequest"
			WHERE "userId" = ${destinatario.id} AND "createdAt" >= NOW() - INTERVAL '1 minute'
			LIMIT 1
		`;
			if (recente)
				throw new TRPCError({
					code: "TOO_MANY_REQUESTS",
					message: "Aguarde um minuto antes de enviar outro código.",
				});
			const codigo = randomInt(100000, 1_000_000).toString();
			const requestId = `c${Date.now().toString(36)}${randomBytes(12).toString("hex")}`;
			const codigoHash = await hashPassword(codigo);
			await ctx.db.$transaction(async (tx) => {
				await tx.$executeRaw`UPDATE "PasswordResetRequest" SET "usedAt" = NOW() WHERE "userId" = ${destinatario.id} AND "usedAt" IS NULL`;
				await tx.$executeRaw`
				INSERT INTO "PasswordResetRequest" ("id", "userId", "requestedById", "codigoHash", "expiresAt", "createdAt")
				VALUES (${requestId}, ${destinatario.id}, ${ctx.session.user.id}, ${codigoHash}, NOW() + INTERVAL '15 minutes', NOW())
			`;
			});
			try {
				const url = `${process.env.APP_URL}/nexus/redefinir-senha?solicitacao=${requestId}`;
				await sendPasswordResetEmail({
					to: destinatario.email,
					nome: destinatario.nome,
					codigo,
					url,
				});
			} catch (error) {
				await ctx.db
					.$executeRaw`UPDATE "PasswordResetRequest" SET "usedAt" = NOW() WHERE "id" = ${requestId}`;
				throw new TRPCError({
					code: "PRECONDITION_FAILED",
					message:
						error instanceof Error
							? error.message
							: "Não foi possível enviar o e-mail.",
				});
			}
			return { ok: true };
		}),
	confirmarRedefinicao: publicProcedure
		.input(
			z.object({
				solicitacaoId: z.string().cuid(),
				codigo: z
					.string()
					.regex(/^\d{6}$/, "Informe o código de seis dígitos."),
				...passwordInput.shape,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			validarConfirmacao(input);
			const [request] = await ctx.db.$queryRaw<
				Array<{ id: string; userId: string; codigoHash: string }>
			>`
			SELECT "id", "userId", "codigoHash" FROM "PasswordResetRequest"
			WHERE "id" = ${input.solicitacaoId} AND "usedAt" IS NULL AND "expiresAt" >= NOW()
			LIMIT 1
		`;
			if (!request || !(await verifyPassword(input.codigo, request.codigoHash)))
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "O código é inválido, expirou ou já foi utilizado.",
				});
			const senhaHash = await hashPassword(input.novaSenha);
			await ctx.db.$transaction(async (tx) => {
				await tx.$executeRaw`
				UPDATE "User" SET "senha" = ${senhaHash}, "senhaAlteradaEm" = NOW() WHERE "id" = ${request.userId}
			`;
				await tx.$executeRaw`UPDATE "PasswordResetRequest" SET "usedAt" = NOW() WHERE "id" = ${request.id}`;
			});
			return { ok: true };
		}),
});
