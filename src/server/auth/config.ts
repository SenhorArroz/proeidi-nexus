import type { DefaultSession, NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { db } from "~/server/db";
import { verifyPassword } from "~/server/auth/password";

type UserRole = "COORDENADOR" | "DIRETOR" | "PROFESSOR" | "MONITOR";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: {
			id: string;
			role: UserRole;
		} & DefaultSession["user"];
	}

	interface User {
		role: UserRole;
	}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
	providers: [
		Credentials({
			credentials: { email: {}, senha: {} },
			authorize: async (credentials) => {
				const parsed = z.object({ email: z.string().email(), senha: z.string().min(1) }).safeParse(credentials);
				if (!parsed.success) return null;
				const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, select: { id: true, nome: true, email: true, senha: true, role: true } });
				if (!user || !(await verifyPassword(parsed.data.senha, user.senha))) return null;
				return { id: user.id, name: user.nome, email: user.email, role: user.role };
			},
		}),
	],
	// Credentials users are stateless: sessions must be JWTs, not adapter-backed sessions.
	session: { strategy: "jwt" },
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		session: ({ session, token }) => {
			const userId = typeof token.id === "string" ? token.id : token.sub ?? "";
			return {
				...session,
				user: {
					...session.user,
					id: userId,
					role: token.role as UserRole,
				},
			};
		},
	},
} satisfies NextAuthConfig;
