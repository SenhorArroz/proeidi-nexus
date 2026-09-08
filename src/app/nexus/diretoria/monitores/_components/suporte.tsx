"use client";

export interface Monitor {
	id: string;
	nome: string;
	matricula: string;
	email: string;
	senha: string;
	turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
	turmasDetalhadas: { id: string; titulo: string; semestre: string }[];
}

export const monitorVazio = (): Monitor => ({
	id: "",
	nome: "",
	matricula: "",
	email: "",
	senha: "",
	turmas: [],
	turmasDetalhadas: [],
});

export function normalizarMonitor(
	m: Partial<Monitor> & { id: string },
): Monitor {
	return {
		id: m.id,
		nome: m.nome ?? "",
		matricula: m.matricula ?? "",
		email: m.email ?? "",
		senha: m.senha ?? "",
		turmas: m.turmas ?? [],
		turmasDetalhadas: m.turmasDetalhadas ?? [],
	};
}

export function normalizarCabecalho(cabecalho: unknown) {
	return String(cabecalho ?? "")
		.trim()
		.toLocaleLowerCase("pt-BR")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, "");
}
export { iniciais } from "~/app/_components/diretoria/cadastro-utils";

export { downloadBase64Pdf } from "~/app/_components/diretoria/cadastro-utils";
