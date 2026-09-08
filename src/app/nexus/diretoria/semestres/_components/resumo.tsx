"use client";

import { Users } from "lucide-react";

export function Resumo({
	icon: Icon,
	valor,
	label,
}: {
	icon: typeof Users;
	valor: number;
	label: string;
}) {
	return (
		<div className="view-nexus-diretoria-semestres-resumo">
			<Icon className="mx-auto mb-1 h-4 w-4 text-amber-600" />
			<p className="text-lg font-bold text-gray-900">{valor}</p>
			<p className="text-[10px] uppercase tracking-wide text-gray-400">
				{label}
			</p>
		</div>
	);
}
