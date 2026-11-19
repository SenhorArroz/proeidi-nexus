"use client";
export {
	downloadBase64Pdf,
	iniciais,
} from "~/app/_components/diretoria/cadastro-utils";

export interface Professor {
	id: string;
	nome: string;
	matricula: string;
	email: string;
	senha: string;
	role: "PROFESSOR" | "DIRETOR";
	turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
}

export const professorVazio = (): Professor => ({
	id: "",
	nome: "",
	matricula: "",
	email: "",
	senha: "",
	role: "PROFESSOR",
	turmas: [],
});

export function normalizarProfessor(
	p: Partial<Professor> & { id: string },
): Professor {
	return {
		id: p.id,
		nome: p.nome ?? "",
		matricula: p.matricula ?? "",
		email: p.email ?? "",
		senha: p.senha ?? "",
		role: p.role ?? "PROFESSOR",
		turmas: p.turmas ?? [],
	};
}

export function gerarSenha() {
	const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
	let senha = "";
	for (let i = 0; i < 10; i++) {
		senha += chars[Math.floor(Math.random() * chars.length)];
	}
	return senha;
}
