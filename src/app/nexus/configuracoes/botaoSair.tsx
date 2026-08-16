"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function BotaoSair() {
	return (
		<button
			type="button"
			onClick={() => {
				if (window.confirm("Deseja sair da sua conta?")) void signOut({ callbackUrl: "/nexus/login" });
			}}
			className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
		>
			<LogOut className="h-4 w-4" />
			Sair da conta
		</button>
	);
}
