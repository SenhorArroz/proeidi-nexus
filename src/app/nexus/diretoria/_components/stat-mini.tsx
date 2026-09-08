"use client";

import React from "react";

export function StatMini({
	icon: Icon,
	label,
	valor,
	cor,
}: {
	icon: React.ElementType;
	label: string;
	valor: number | string;
	cor: string;
}) {
	return (
		<div className="view-app-nexus-diretoria-stat-mini flex items-center gap-3 bg-white rounded-2xl border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
			<div
				className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
				style={{ backgroundColor: `${cor}14` }}
			>
				<Icon className="w-5 h-5" style={{ color: cor }} />
			</div>
			<div className="min-w-0">
				<p className="text-xl font-bold text-gray-900 leading-none">{valor}</p>
				<p className="text-[11px] text-gray-400 mt-0.5 truncate">{label}</p>
			</div>
		</div>
	);
}
