"use client";

import {
	Briefcase,
	Building2,
	ClipboardCheck,
	Dices,
	DoorOpen,
	FileText,
	Printer,
	ShieldCheck,
	Users,
} from "lucide-react";
import React from "react";

export interface Ferramenta {
	id: string;
	nome: string;
	link: string;
	descricao: string;
	icon: React.ElementType;
	cor: string;
}

export const FERRAMENTAS: Ferramenta[] = [
	{
		id: "semestres",
		nome: "Gerenciar Semestres",
		descricao: "Períodos letivos, semestre ativo e equipes vinculadas",
		link: "/nexus/diretoria/semestres",
		icon: Briefcase,
		cor: "#0F766E",
	},
	{
		id: "turmas",
		nome: "Gerenciar Turmas",
		descricao: "Criar, editar e arquivar turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
		cor: "#0F766E",
	},
	{
		id: "professores",
		nome: "Gerenciar Professores",
		descricao: "Cadastro, turmas atribuídas e permissões",
		link: "/nexus/diretoria/professores",
		icon: Users,
		cor: "#9334E6",
	},
	{
		id: "diretores",
		nome: "Gerenciar Diretores",
		descricao: "Cadastro e controle de acesso dos diretores",
		link: "/nexus/diretoria/diretores",
		icon: Building2,
		cor: "#B06000",
	},
	{
		id: "monitores",
		nome: "Gerenciar Monitores",
		descricao: "Cadastro e vínculo com turmas",
		link: "/nexus/diretoria/monitores",
		icon: ShieldCheck,
		cor: "#188038",
	},
	{
		id: "alunos",
		nome: "Gerenciar Alunos",
		descricao: "Lista geral de alunos e seus dados",
		link: "/nexus/diretoria/alunos",
		icon: FileText,
		cor: "#999999",
	},
	{
		id: "presencas",
		nome: "Gerenciar Presenças",
		descricao: "Alunos, monitores, professores e diretores docentes",
		link: "/nexus/diretoria/presencas",
		icon: ClipboardCheck,
		cor: "#0F766E",
	},
	{
		id: "sorteio",
		nome: "Gerenciar Sorteio",
		descricao: "Sorteio de alunos para turmas",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
		cor: "#ff8400",
	},
	{
		id: "questionarios",
		nome: "Gerenciar Questionários",
		descricao: "Questionários aplicados aos alunos",
		link: "/nexus/diretoria/questionarios",
		icon: FileText,
		cor: "#999999",
	},
	{
		id: "impressao",
		nome: "Gerenciar Impressão de Apostilas",
		descricao: "Gerenciamento de impressões",
		link: "/nexus/diretoria/impressao",
		icon: Printer,
		cor: "#999999",
	},
	{
		id: "materiais",
		nome: "Atualização de Materiais",
		descricao: "Atualização dos Materiais",
		link: "/nexus/diretoria/materiais-atualizacao",
		icon: Printer,
		cor: "#999999",
	},
];
