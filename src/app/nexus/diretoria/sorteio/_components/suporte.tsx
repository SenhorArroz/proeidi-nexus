"use client";

export type Curso = "Smartphone" | "Computador";

export interface Candidato {
	id: string;
	ficha: string;
	nome: string;
	dataNascimento: string;
	cpf: string;
	telefone: string;
	emergencia: string;
	curso: Curso;
	criadoEm: string;
}
export { formatarCpf } from "~/app/_components/diretoria/cadastro-utils";

export function formatarTelefone(valor: string) {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
	if (digitos.length <= 6)
		return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
	if (digitos.length <= 10)
		return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
	return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export const CABECALHOS_PLANILHA = [
	"Carimbo de data/hora",
	"Nome Completo",
	"Número da ficha",
	"Data de Nascimento",
	"CPF",
	"Telefone para Contato",
	"Contato de Emergência",
	"Curso de interesse - Apenas uma opção",
];

export function dataDoCampo(valor: string) {
	const [ano, mes, dia] = valor.split("-").map(Number);
	return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, 12);
}

export function normalizarCabecalho(valor: string) {
	return valor
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.trim()
		.toLowerCase();
}

export function valorDaLinha(
	linha: Record<string, unknown>,
	cabecalhos: string[],
) {
	const chaves = new Set(cabecalhos.map(normalizarCabecalho));
	return Object.entries(linha).find(([chave]) =>
		chaves.has(normalizarCabecalho(chave)),
	)?.[1];
}

export function textoDaPlanilha(valor: unknown) {
	return String(valor ?? "").trim();
}

export function dataDaPlanilha(valor: unknown) {
	if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor;
	const texto = textoDaPlanilha(valor);
	const brasileira = texto.match(
		/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[\s,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/,
	);
	if (brasileira) {
		const [
			,
			primeiro,
			segundoDiaMes,
			ano,
			hora = "0",
			minuto = "0",
			segundo = "0",
		] = brasileira;
		const primeiroNumero = Number(primeiro);
		const segundoNumero = Number(segundoDiaMes);
		const [dia, mes] =
			primeiroNumero > 12
				? [primeiroNumero, segundoNumero]
				: segundoNumero > 12
					? [segundoNumero, primeiroNumero]
					: [primeiroNumero, segundoNumero];
		const data = new Date(
			Number(ano),
			mes - 1,
			dia,
			Number(hora),
			Number(minuto),
			Number(segundo),
		);
		return Number.isNaN(data.getTime()) ? null : data;
	}
	const data = new Date(texto);
	return Number.isNaN(data.getTime()) ? null : data;
}

export function cursoDaPlanilha(valor: unknown) {
	const curso = normalizarCabecalho(textoDaPlanilha(valor));
	if (curso === "smartphone") return "SMARTPHONE" as const;
	if (curso === "computador") return "COMPUTADOR" as const;
	return null;
}
