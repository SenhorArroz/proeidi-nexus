"use client";

import React from "react";

export function CampoFichaAluno({
	label,
	valor,
}: {
	label: string;
	valor: React.ReactNode;
}) {
	return (
		<div className="view-nexus-diretoria-turmas-campo-ficha-aluno min-w-0">
			<dt className="text-xs font-semibold text-slate-500">{label}</dt>
			<dd className="mt-1 break-words text-sm font-medium text-slate-800">
				{valor || "Não informado"}
			</dd>
		</div>
	);
}
