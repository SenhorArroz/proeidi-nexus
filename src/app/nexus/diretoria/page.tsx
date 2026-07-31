"use client";
import React, { useState } from "react";
import {
	Building2,
	DoorOpen,
	Users,
	ShieldCheck,
	FileText,
	Plus,
	Pencil,
	Trash2,
	BarChart3,
	X,
	Check,
	Dices,
} from "lucide-react";


import FerramentaCard from "~/app/_components/ferramentaCerd";

// ---------------------------------------------------------------------------
// Tipos e dados de exemplo
// ---------------------------------------------------------------------------

interface Ferramenta {
	id: string;
	nome: string;
	link: string;
	descricao: string;
	icon: React.ElementType;
	cor: string;
}

interface OpcaoResposta {
	label: string;
	votos: number;
}

interface Formulario {
	id: string;
	titulo: string;
	descricao: string;
	respostas: number;
	status: "ativo" | "encerrado";
	opcoes: OpcaoResposta[];
}

const FERRAMENTAS: Ferramenta[] = [
	{
		id: "turmas",
		nome: "Gerenciar turmas",
		descricao: "Criar, editar e arquivar turmas",
		link: "/nexus/diretoria/turmas",
		icon: DoorOpen,
		cor: "#1A73E8",
	},
	{
		id: "professores",
		nome: "Gerenciar professores",
		descricao: "Cadastro, turmas atribuídas e permissões",
		link: "/nexus/diretoria/professores",
		icon: Users,
		cor: "#9334E6",
	},
	{
		id: "monitores",
		nome: "Gerenciar monitores",
		descricao: "Cadastro e vínculo com turmas",
		link: "/nexus/diretoria/monitores",
		icon: ShieldCheck,
		cor: "#188038",
	},
	{
		id: "alunos",
		nome: "Gerenciar alunos",
		descricao: "Lista geral de alunos e seus dados",
		link: "/nexus/diretoria/alunos",
		icon: FileText,
		cor: "#999999",
	},
	{
		id: "sorteio",
		nome: "Gerenciar sorteio",
		descricao: "Sorteio de alunos para turmas",
		link: "/nexus/diretoria/sorteio",
		icon: Dices,
		cor: "#ff8400",
	},

];

const FORMULARIOS_INICIAIS: Formulario[] = [
	{
		id: "1",
		titulo: "Satisfação — Módulo Smartphone Avançado",
		descricao: "Avaliação da turma sobre o módulo concluído",
		respostas: 24,
		status: "ativo",
		opcoes: [
			{ label: "Muito satisfeito", votos: 14 },
			{ label: "Satisfeito", votos: 7 },
			{ label: "Neutro", votos: 2 },
			{ label: "Insatisfeito", votos: 1 },
		],
	},
	{
		id: "2",
		titulo: "Interesse em novos cursos — 2º semestre",
		descricao: "Levantamento de interesse para grade futura",
		respostas: 41,
		status: "ativo",
		opcoes: [
			{ label: "Fotografia com celular", votos: 18 },
			{ label: "Redes sociais seguras", votos: 15 },
			{ label: "Edição de vídeo", votos: 8 },
		],
	},
	{
		id: "3",
		titulo: "Avaliação de infraestrutura das salas",
		descricao: "Feedback sobre salas e equipamentos",
		respostas: 12,
		status: "encerrado",
		opcoes: [
			{ label: "Adequada", votos: 9 },
			{ label: "Precisa de melhorias", votos: 3 },
		],
	},
];

// ---------------------------------------------------------------------------
// Sub-componentes
// ---------------------------------------------------------------------------


function BarraResposta({
	opcao,
	total,
}: {
	opcao: OpcaoResposta;
	total: number;
}) {
	const pct = total > 0 ? Math.round((opcao.votos / total) * 100) : 0;
	return (
		<div>
			<div className="flex items-center justify-between text-xs mb-1">
				<span className="text-gray-700">{opcao.label}</span>
				<span className="font-medium text-gray-500">
					{pct}% · {opcao.votos}
				</span>
			</div>
			<div className="h-2 rounded-full bg-gray-100 overflow-auto">
				<div
					className="h-full rounded-full bg-sky-600 transition-all"
					style={{ width: `${pct}%` }}
				/>
			</div>
		</div>
	);
}

function FormularioCard({
	formulario,
	isOpen,
	onToggleRespostas,
	onExcluir,
}: {
	formulario: Formulario;
	isOpen: boolean;
	onToggleRespostas: () => void;
	onExcluir: () => void;
}) {
	const total = formulario.opcoes.reduce((acc, o) => acc + o.votos, 0);

	return (
		<div className="bg-white rounded-2xl border border-gray-200 overflow-auto hover:border-gray-300 hover:shadow-sm transition-all duration-200">
			<div className="p-5">
				<div className="flex items-start justify-between gap-3 mb-3">
					<div className="flex items-start gap-3 min-w-0">
						<div className="w-10 h-10 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
							<FileText className="w-5 h-5 text-sky-600" />
						</div>
						<div className="min-w-0">
							<p className="text-sm font-semibold text-gray-900 truncate">
								{formulario.titulo}
							</p>
							<p className="text-xs text-gray-500 mt-0.5">
								{formulario.descricao}
							</p>
						</div>
					</div>
					<span
						className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
							formulario.status === "ativo"
								? "bg-green-50 text-green-700"
								: "bg-gray-100 text-gray-500"
						}`}
					>
						{formulario.status === "ativo" ? "Ativo" : "Encerrado"}
					</span>
				</div>

				<div className="flex items-center justify-between pt-3 border-t border-gray-100">
					<span className="text-xs text-gray-500">
						{formulario.respostas} respostas
					</span>
					<div className="flex items-center gap-1">
						<button
							onClick={onToggleRespostas}
							className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
								isOpen
									? "bg-sky-50 text-sky-600"
									: "text-gray-500 hover:bg-gray-100"
							}`}
						>
							<BarChart3 className="w-3.5 h-3.5" />
							Ver respostas
						</button>
						<button
							className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-90"
							aria-label="Editar formulário"
							title="Editar formulário"
						>
							<Pencil className="w-3.5 h-3.5" />
						</button>
						<button
							onClick={onExcluir}
							className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-90"
							aria-label="Excluir formulário"
							title="Excluir formulário"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
					</div>
				</div>
			</div>

			{/* Painel de respostas (colapsável) */}
			<div
				className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
					isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
				}`}
			>
				<div className="overflow-auto">
					<div className="px-5 pb-5 pt-1 space-y-3 bg-gray-50/60 border-t border-gray-100">
						{formulario.opcoes.map((opcao, i) => (
							<BarraResposta key={i} opcao={opcao} total={total} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function PainelDiretor() {
	const [formularios, setFormularios] =
		useState<Formulario[]>(FORMULARIOS_INICIAIS);
	const [abertoId, setAbertoId] = useState<string | null>(null);
	const [criando, setCriando] = useState(false);
	const [novoTitulo, setNovoTitulo] = useState("");

	const toggleRespostas = (id: string) =>
		setAbertoId((prev) => (prev === id ? null : id));

	const excluirFormulario = (id: string) => {
		if (confirm("Excluir este formulário e todas as suas respostas?")) {
			setFormularios((prev) => prev.filter((f) => f.id !== id));
			if (abertoId === id) setAbertoId(null);
		}
	};

	const criarFormulario = () => {
		const titulo = novoTitulo.trim();
		if (!titulo) return;
		const novo: Formulario = {
			id: Date.now().toString(),
			titulo,
			descricao: "Sem respostas ainda",
			respostas: 0,
			status: "ativo",
			opcoes: [],
		};
		setFormularios((prev) => [novo, ...prev]);
		setNovoTitulo("");
		setCriando(false);
	};

	return (
		<div className="min-h-full w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
			{/* Banner de topo */}
			<div className="w-full max-w-5xl relative rounded-2xl overflow-hidden mb-8 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] bg-gradient-to-br from-sky-600 to-sky-500">
				<div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-600 " />
				<div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-amber-600 mix-blend-overlay" />

				<div className="relative flex items-center gap-3">
					<div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg border-3 border-amber-600 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
						<Building2 className="w-[80%] h-[80%] text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="text-[clamp(1rem,1.8vw,1.375rem)] font-semibold text-white leading-tight truncate">
							Painel do Diretor
						</h1>
						<p className="text-[clamp(0.65rem,1vw,0.8rem)] text-white/70 truncate">
							Ferramentas de gestão e formulários da unidade
						</p>
					</div>
				</div>
			</div>

			<div className="w-full max-w-5xl space-y-10">
				{/* Ferramentas */}
				<section>
					<h2 className="text-sm font-medium text-gray-700 mb-3">
						Ferramentas
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						{FERRAMENTAS.map((f) => (
							<FerramentaCard key={f.id} ferramenta={f} />
						))}
					</div>
				</section>

				{/* Formulários */}
				<section className="overflow-auto">
					<div className="flex items-center justify-between mb-3">
						<h2 className="text-sm font-medium text-gray-700">Formulários</h2>
						<button
							onClick={() => setCriando((v) => !v)}
							className="flex items-center gap-1.5 text-xs font-medium text-sky-600 hover:text-sky-700 transition-all duration-200 hover:scale-105 active:scale-95"
						>
							{criando ? (
								<X className="w-3.5 h-3.5 transition-transform duration-200" />
							) : (
								<Plus className="w-3.5 h-3.5 transition-transform duration-200" />
							)}
							{criando ? "Cancelar" : "Novo formulário"}
						</button>
					</div>

					{/* Criação inline */}
					<div
						className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
							criando ? "grid-rows-[1fr] mb-4" : "grid-rows-[0fr]"
						}`}
					>
						<div className="overflow-auto">
							<div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 p-3">
								<input
									autoFocus
									value={novoTitulo}
									onChange={(e) => setNovoTitulo(e.target.value)}
									onKeyDown={(e) => e.key === "Enter" && criarFormulario()}
									placeholder="Título do novo formulário"
									className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
								/>
								<button
									onClick={criarFormulario}
									className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200 flex-shrink-0"
								>
									<Check className="w-4 h-4" />
									Criar
								</button>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						{formularios.map((f) => (
							<FormularioCard
								key={f.id}
								formulario={f}
								isOpen={abertoId === f.id}
								onToggleRespostas={() => toggleRespostas(f.id)}
								onExcluir={() => excluirFormulario(f.id)}
							/>
						))}
						{formularios.length === 0 && (
							<div className="text-center py-12 text-sm text-gray-400">
								Nenhum formulário criado ainda
							</div>
						)}
					</div>
				</section>
			</div>
		</div>
	);
}
