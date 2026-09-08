"use client";

import { FileText, Image as ImageIcon, Link2 } from "lucide-react";
import React from "react";

export interface Aula {
	id: string;
	data: string; // yyyy-mm-dd
	titulo: string;
	tipo: "AULA" | "FERIADO" | "CANCELADA" | "ESPECIAL";
}

export type TipoMaterial = "link" | "pdf" | "slide" | "imagem";

export interface Material {
	id: string;
	titulo: string;
	tipo: TipoMaterial;
	url: string;
}

export interface Turma {
	limiteAlunos: number;
	id: string;
	semestreId?: string;
	titulo: string;
	sala: string;
	horario: string;
	professores: string[];
	professorIds: string[];
	monitores: string[];
	monitorIds: string[];
	alunos: string[];
	alunoIds: string[];
	materiais: Material[];
	aulas: Aula[];
	notas: number;
	cor: string;
	corDestaque: string;
	corFundo: string;
	corTexto: string;
	corTitulo: string;
	corDescricao: string;
	fonte: "SANS" | "SERIF" | "MONO";
}

export function luminosidadeHex(cor: string) {
	const hex = cor.replace("#", "");
	if (!/^[0-9a-f]{6}$/i.test(hex)) return 0.5;
	const r = Number.parseInt(hex.slice(0, 2), 16) / 255;
	const g = Number.parseInt(hex.slice(2, 4), 16) / 255;
	const b = Number.parseInt(hex.slice(4, 6), 16) / 255;
	const linear = (canal: number) =>
		canal <= 0.03928 ? canal / 12.92 : ((canal + 0.055) / 1.055) ** 2.4;
	return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

export const turmaVazia = (): Turma => ({
	limiteAlunos: 14,
	id: "",
	titulo: "",
	sala: "",
	horario: "",
	professores: [],
	professorIds: [],
	monitores: [],
	monitorIds: [],
	alunos: [],
	alunoIds: [],
	materiais: [],
	aulas: [],
	notas: 0,
	cor: "#1A73E8",
	corDestaque: "#ea580c",
	corFundo: "#f8fafc",
	corTexto: "#0f172a",
	corTitulo: "#ffffff",
	corDescricao: "#64748b",
	fonte: "SANS",
});

export function normalizarTurma(t: Partial<Turma> & { id: string }): Turma {
	return {
		id: t.id,
		limiteAlunos: t.limiteAlunos ?? 14,
		semestreId: t.semestreId,
		titulo: t.titulo ?? "",
		sala: t.sala ?? "",
		horario: t.horario ?? "",
		professores: t.professores ?? [],
		professorIds: t.professorIds ?? [],
		monitores: t.monitores ?? [],
		monitorIds: t.monitorIds ?? [],
		alunos: t.alunos ?? [],
		alunoIds: t.alunoIds ?? [],
		materiais: t.materiais ?? [],
		aulas: t.aulas ?? [],
		notas: t.notas ?? 0,
		cor: t.cor ?? "#1A73E8",
		corDestaque: t.corDestaque ?? "#ea580c",
		corFundo: t.corFundo ?? "#f8fafc",
		corTexto: t.corTexto ?? "#0f172a",
		corTitulo: t.corTitulo ?? "#ffffff",
		corDescricao: t.corDescricao ?? "#64748b",
		fonte: t.fonte ?? "SANS",
	};
}

export function formatarData(iso: string) {
	if (!iso) return "";
	const [ano, mes, dia] = iso.split("-");
	return `${dia}/${mes}/${ano}`;
}

export const ICONE_MATERIAL: Record<TipoMaterial, React.ElementType> = {
	link: Link2,
	pdf: FileText,
	slide: FileText,
	imagem: ImageIcon,
};

export type OpcaoPessoa = { id: string; nome: string; detalhe?: string };

export type AbaGestaoTurma = "visao" | "equipe" | "alunos" | "calendario";
