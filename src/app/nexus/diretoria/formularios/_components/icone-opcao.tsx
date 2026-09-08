"use client";

import { CheckSquare, CircleDot } from "lucide-react";
import { type TipoPergunta } from "./suporte";

export function IconeOpcao({
	tipo,
	className,
}: {
	tipo: TipoPergunta;
	className?: string;
}) {
	if (tipo === "multiple_choice")
		return <CircleDot className={`w-4 h-4 ${className}`} />;
	if (tipo === "checkbox")
		return <CheckSquare className={`w-4 h-4 ${className}`} />;
	return (
		<div
			className={`view-icone-opcao ${`w-4 h-4 rounded-full bg-gray-200 ${className}`}`}
		/>
	);
}
