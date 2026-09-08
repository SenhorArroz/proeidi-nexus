"use client";

import Link from "next/link";
import { type Ferramenta } from "./suporte";

export function AcessoRapido({
	ferramenta,
	destaque = false,
}: {
	ferramenta: Ferramenta;
	destaque?: boolean;
}) {
	const Icon = ferramenta.icon;
	return (
		<Link
			href={ferramenta.link}
			className={`group flex min-w-0 items-center gap-3 rounded-2xl p-3.5 transition-all duration-200 focus-visible:outline-none ${destaque ? "bg-white text-white-950 shadow-[0_16px_28px_rgba(2,132,199,0.18)] hover:-translate-y-0.5" : "bg-sky-950/10 text-white hover:bg-white/15"}`}
		>
			<span
				className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${destaque ? "bg-orange-100 text-orange-700" : "bg-white/18 text-white"}`}
			>
				<Icon className="h-5 w-5" />
			</span>
			<span className="min-w-0 flex-1">
				<span className="block truncate text-sm font-bold">
					{ferramenta.nome.replace("Gerenciar ", "")}
				</span>
				<span
					className={`mt-0.5 block truncate text-xs ${destaque ? "text-slate-500" : "text-sky-100"}`}
				>
					{ferramenta.descricao}
				</span>
			</span>
		</Link>
	);
}
