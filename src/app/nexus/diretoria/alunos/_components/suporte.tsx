"use client";
export {
	downloadBase64Pdf,
	formatarCpf,
} from "~/app/_components/diretoria/cadastro-utils";

export type SimNao = "Sim" | "Não" | "";

export interface Aluno {
	id: string;
	semestre: string;
	turma: string;

	// Geral
	nome: string;
	dataNascimento: string;
	cpf: string;
	corRaca: string;
	identidadeGenero: string;
	lgbtqiapn: string;
	telefone: string;
	contatoEmergencia: string;
	email: string;
	escolaridade: string;
	cuidaTerceiros: SimNao;

	// Condicionais Trabalho/Estudo
	trabalha: SimNao;
	trabalhoLocal?: string;
	trabalhoFuncao?: string;
	estuda: SimNao;
	estudoLocal?: string;
	estudoCurso?: string;

	// Saúde
	problemaSaude: SimNao;
	problemaSaudeQual?: string;
	necessidadeEspecial: SimNao;
	necessidadeEspecialQual?: string;

	// Infraestrutura
	acessoInternet: SimNao;
	temComputador: SimNao;
	temSmartphone: SimNao;
	sistemaSmartphone?: string;
}
