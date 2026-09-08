"use client";

import { generateUploadButton } from "@uploadthing/react";
import {
	AlertTriangle,
	Ban,
	BookOpen,
	CalendarDays,
	Check,
	ClipboardList,
	FileText,
	FolderOpen,
	GraduationCap,
	Home,
	NotebookPen,
	ShieldCheck,
	Star,
	X,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { OurFileRouter } from "~/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<OurFileRouter>();

export type TabId =
	| "inicio"
	| "materiais"
	| "anotacoes"
	| "calendario"
	| "presenca-alunos"
	| "presenca-monitores"
	| "presenca-professores";

export type TipoEvento = "aula" | "feriado" | "cancelada" | "especial";

export interface EventoCalendario {
	id: string;
	data: string; // yyyy-mm-dd
	titulo: string;
	tipo: TipoEvento;
}

export interface Material {
	id: string;
	nome: string;
	url: string;
	quando: string;
}

export interface Aviso {
	id: string;
	autor: string;
	fixado: boolean;
	texto: string;
	imagemUrl: string | null;
	linkUrl: string | null;
	quando: string;
	podeExcluir: boolean;
	podeFixar: boolean;
	podeEditar: boolean;
}

export interface Anotacao {
	id: string;
	titulo: string;
	data: string;
	conteudo: string;
}

export type EstadoPresenca =
	| "presente"
	| "ausente"
	| "justificado"
	| "a_registrar";

export const PRESENCA_CONFIG: Record<
	EstadoPresenca,
	{
		label: string;
		curta: string;
		cor: string;
		fundo: string;
		icone: React.ElementType;
	}
> = {
	presente: {
		label: "Presente",
		curta: "Presentes",
		cor: "#15803d",
		fundo: "#dcfce7",
		icone: Check,
	},
	ausente: {
		label: "Ausente",
		curta: "Ausentes",
		cor: "#dc2626",
		fundo: "#fee2e2",
		icone: X,
	},
	justificado: {
		label: "Justificado",
		curta: "Justificados",
		cor: "#b45309",
		fundo: "#fef3c7",
		icone: FileText,
	},
	a_registrar: {
		label: "Não marcado",
		curta: "Em aberto",
		cor: "#64748b",
		fundo: "#e2e8f0",
		icone: Ban,
	},
};

export interface Pessoa {
	id: string;
	nome: string;
	presente: EstadoPresenca;
}

export interface ConfirmacaoPresenca {
	data: string;
	total: number;
}

export interface DadosTurma {
	nome: string;
	sala: string;
	horario: string;
	professores: string[];
	monitores: string[];
	alunos: string[];
	cor: string;
	corDestaque?: string;
	corFundo?: string;
	corTexto?: string;
	corTitulo?: string;
	corDescricao?: string;
	fonte?: "SANS" | "SERIF" | "MONO";
}

export const TURMA_VAZIA: DadosTurma = {
	nome: "",
	sala: "",
	horario: "",
	professores: [],
	monitores: [],
	alunos: [],
	cor: "#0284c7",
};

export const EVENTO_CONFIG: Record<
	TipoEvento,
	{ cor: string; corBg: string; label: string; icon: React.ElementType }
> = {
	aula: { cor: "#1A73E8", corBg: "#EBF3FE", label: "Aula", icon: BookOpen },
	feriado: {
		cor: "#D93025",
		corBg: "#FDECEB",
		label: "Feriado",
		icon: AlertTriangle,
	},
	cancelada: {
		cor: "#80868B",
		corBg: "#F1F3F4",
		label: "Cancelada",
		icon: Ban,
	},
	especial: { cor: "#F9AB00", corBg: "#FEF7E0", label: "Especial", icon: Star },
};

export const NOMES_MES = [
	"Janeiro",
	"Fevereiro",
	"Março",
	"Abril",
	"Maio",
	"Junho",
	"Julho",
	"Agosto",
	"Setembro",
	"Outubro",
	"Novembro",
	"Dezembro",
];

export function hexParaRgb(cor: string) {
	const hex = cor.replace("#", "").trim();
	const valor =
		hex.length === 3
			? hex
					.split("")
					.map((item) => item + item)
					.join("")
			: hex;
	if (!/^[0-9a-f]{6}$/i.test(valor)) return null;
	return {
		r: Number.parseInt(valor.slice(0, 2), 16),
		g: Number.parseInt(valor.slice(2, 4), 16),
		b: Number.parseInt(valor.slice(4, 6), 16),
	};
}

export function luminancia(cor: string) {
	const rgb = hexParaRgb(cor);
	if (!rgb) return 0;
	const canal = (valor: number) => {
		const normalizado = valor / 255;
		return normalizado <= 0.04045
			? normalizado / 12.92
			: ((normalizado + 0.055) / 1.055) ** 2.4;
	};
	return 0.2126 * canal(rgb.r) + 0.7152 * canal(rgb.g) + 0.0722 * canal(rgb.b);
}

export function contraste(corA: string, corB: string) {
	const luminosidadeA = luminancia(corA);
	const luminosidadeB = luminancia(corB);
	const maisClara = Math.max(luminosidadeA, luminosidadeB);
	const maisEscura = Math.min(luminosidadeA, luminosidadeB);
	return (maisClara + 0.05) / (maisEscura + 0.05);
}

export function misturarCores(
	corBase: string,
	corMistura: string,
	proporcaoMistura: number,
) {
	const base = hexParaRgb(corBase);
	const mistura = hexParaRgb(corMistura);
	if (!base || !mistura) return corBase;
	const canal = (nome: keyof typeof base) =>
		Math.round(
			base[nome] * (1 - proporcaoMistura) + mistura[nome] * proporcaoMistura,
		)
			.toString(16)
			.padStart(2, "0");
	return `#${canal("r")}${canal("g")}${canal("b")}`;
}

export function corLegivel(corPreferida: string, fundo: string, minimo = 4.5) {
	if (contraste(corPreferida, fundo) >= minimo) return corPreferida;
	return luminancia(fundo) > 0.35 ? "#0f172a" : "#f8fafc";
}

export function corDeAcaoLegivel(
	corPreferida: string,
	temaEscuro: boolean,
	superficie: string,
) {
	const brilho = luminancia(corPreferida);
	if (temaEscuro && brilho > 0.84) return "#38bdf8";
	if (temaEscuro && brilho < 0.16)
		return misturarCores(corPreferida, "#7dd3fc", 0.72);
	if (!temaEscuro && brilho > 0.88) return "#0369a1";
	if (!temaEscuro && brilho < 0.08) return "#0369a1";
	return contraste(corPreferida, superficie) >= 3
		? corPreferida
		: misturarCores(corPreferida, temaEscuro ? "#7dd3fc" : "#0369a1", 0.58);
}

export function useTemaEscuro() {
	const [escuro, setEscuro] = useState(false);

	useEffect(() => {
		const html = document.documentElement;
		const atualizar = () => setEscuro(html.dataset.theme === "dark");
		atualizar();
		const observador = new MutationObserver(atualizar);
		observador.observe(html, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});
		return () => observador.disconnect();
	}, []);

	return escuro;
}

export const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function pad(n: number) {
	return n.toString().padStart(2, "0");
}

export function toISO(ano: number, mes: number, dia: number) {
	return `${ano}-${pad(mes + 1)}-${pad(dia)}`;
}

export function gerarDiasMes(ano: number, mes: number) {
	const primeiroDia = new Date(ano, mes, 1).getDay();
	const totalDias = new Date(ano, mes + 1, 0).getDate();
	return { primeiroDia, totalDias };
}

export const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
	{ id: "inicio", label: "Início", icon: Home },
	{ id: "materiais", label: "Materiais", icon: FolderOpen },
	{ id: "anotacoes", label: "Notas", icon: NotebookPen },
	{ id: "calendario", label: "Calendário", icon: CalendarDays },
	{ id: "presenca-alunos", label: "Alunos", icon: ClipboardList },
	{ id: "presenca-monitores", label: "Monitores", icon: ShieldCheck },
	{ id: "presenca-professores", label: "Professores", icon: GraduationCap },
];
