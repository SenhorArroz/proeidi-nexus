"use client";
import React, { useState } from "react";
import {
	Ticket,
	Smartphone,
	Monitor,
	Search,
	Plus,
	Pencil,
	Trash2,
	X,
	User,
	Calendar,
	Phone,
	PhoneCall,
	FileDigit,
	Dices,
} from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { normalizarBusca } from "~/lib/texto";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type Curso = "Smartphone" | "Computador";

interface Candidato {
	id: string;
	ficha: string;
	nome: string;
	dataNascimento: string;
	cpf: string;
	telefone: string;
	emergencia: string;
	curso: Curso;
}

function formatarCpf(valor: string) {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 3) return digitos;
	if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
	if (digitos.length <= 9) return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
	return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

function formatarTelefone(valor: string) {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
	if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
	if (digitos.length <= 10) return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
	return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function GerenciarSorteio() {
	const utils = api.useUtils();
	const { data: semestres, isLoading: carregandoSemestres } = api.diretoria.semestres.list.useQuery();
	const [semestreId, setSemestreId] = useState("");
	const semestreSelecionado =
		semestres?.find((semestre) => semestre.id === semestreId) ??
		semestres?.find((semestre) => semestre.ativo) ??
		semestres?.[0];
	const { data: candidatosDb, isLoading: carregandoCandidatos } = api.diretoria.candidatos.list.useQuery(
		{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestreSelecionado) },
	);
	const criar = api.diretoria.candidatos.create.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const atualizar = api.diretoria.candidatos.update.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const remover = api.diretoria.candidatos.remove.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const candidatos = (candidatosDb ?? []).map((candidato) => ({
		...candidato,
		dataNascimento: candidato.dataNascimento.toISOString().slice(0, 10),
		curso:
			candidato.curso === "SMARTPHONE"
				? ("Smartphone" as const)
				: ("Computador" as const),
	}));
	const [busca, setBusca] = useState("");

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [candidatoEditando, setCandidatoEditando] = useState<Candidato | null>(
		null,
	);

	// Estado do formulário
	const [form, setForm] = useState<Omit<Candidato, "id">>({
		ficha: "",
		nome: "",
		dataNascimento: "",
		cpf: "",
		telefone: "",
		emergencia: "",
		curso: "Smartphone",
	});

	// Filtros e Separação
	const buscaNormalizada = normalizarBusca(busca);
	const candidatosFiltrados = candidatos.filter((candidato) => !buscaNormalizada || normalizarBusca(candidato.nome).includes(buscaNormalizada) || candidato.ficha.includes(busca.trim()));

	const listaSmartphone = candidatosFiltrados.filter(
		(c) => c.curso === "Smartphone",
	);
	const listaComputador = candidatosFiltrados.filter(
		(c) => c.curso === "Computador",
	);

	// Ações do CRUD
	const abrirModalNovo = () => {
		setForm({
			ficha: "",
			nome: "",
			dataNascimento: "",
			cpf: "",
			telefone: "",
			emergencia: "",
			curso: "Smartphone",
		});
		setCandidatoEditando(null);
		setIsModalOpen(true);
	};

	const abrirModalEdicao = (candidato: Candidato) => {
		setForm({ ...candidato });
		setCandidatoEditando(candidato);
		setIsModalOpen(true);
	};

	const excluirCandidato = (id: string) => {
		if (confirm("Tem certeza que deseja remover este candidato do sorteio?")) {
			if (semestreSelecionado)
				remover.mutate({ id, semestreId: semestreSelecionado.id });
		}
	};

	const salvarCandidato = (e: React.FormEvent) => {
		e.preventDefault();

		if (!semestreSelecionado) return;
		const dados = {
			semestreId: semestreSelecionado.id,
			ficha: form.ficha,
			nome: form.nome,
			dataNascimento: new Date(`${form.dataNascimento}T12:00:00`),
			cpf: form.cpf.replace(/\D/g, ""),
			telefone: form.telefone,
			emergencia: form.emergencia,
			curso:
				form.curso === "Smartphone"
					? ("SMARTPHONE" as const)
					: ("COMPUTADOR" as const),
		};
		const opcoes = {
			onSuccess: () => setIsModalOpen(false),
			onError: (erro: { message: string }) => alert(`Não foi possível salvar a ficha: ${erro.message}`),
		};
		if (candidatoEditando) atualizar.mutate({ ...dados, id: candidatoEditando.id }, opcoes);
		else criar.mutate(dados, opcoes);
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8 pb-32">
			<div className="max-w-7xl w-full mx-auto space-y-6">
				<DiretoriaBackLink />
				<DiretoriaPageIntro icon={Ticket} title="Gerenciar sorteio" description={`Inscrições cadastradas: ${candidatos.length} fichas`} actions={<a href="/nexus/diretoria/sorteio/sorteador" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-orange-50 hover:text-orange-800"><Dices className="h-4 w-4" />Ir para o Sorteador</a>} />

				{/* Barra de Controles (Semestre, busca e adicionar) */}
				<div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-gray-200 shadow-sm">
					<label className="flex w-full items-center gap-2 px-2 text-sm font-medium text-gray-600 lg:w-48">
						Semestre
						<select
							value={semestreSelecionado?.id ?? ""}
							onChange={(e) => setSemestreId(e.target.value)}
							className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-sm text-gray-700 focus:border-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-100"
						>
							{semestres?.map((semestre) => (
								<option key={semestre.id} value={semestre.id}>
									{semestre.codigo}{semestre.ativo ? " — ativo" : ""}
								</option>
							))}
						</select>
					</label>
					<div className="flex items-center gap-3 w-full sm:w-96">
						<Search className="w-5 h-5 text-gray-400 shrink-0" />
						<input
							type="text"
							placeholder="Buscar por nome ou ficha..."
							value={busca}
							onChange={(e) => setBusca(e.target.value)}
							className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 py-2"
						/>
					</div>
					<button
						onClick={abrirModalNovo}
						className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md transition-all shrink-0"
					>
						<Plus className="w-4 h-4" />
						Adicionar Ficha
					</button>
				</div>

				{/* Duas Colunas: Smartphone vs Computador */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					{/* COLUNA: SMARTPHONE */}
					<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
						<div className="bg-sky-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
									<Smartphone className="w-5 h-5" />
								</div>
								<h2 className="font-bold text-gray-800">Curso de Smartphone</h2>
							</div>
							<span className="bg-white border border-sky-100 text-sky-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
								{listaSmartphone.length} fichas
							</span>
						</div>

						<div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
							{carregandoSemestres || carregandoCandidatos ? <DataSkeleton rows={4} /> : listaSmartphone.length === 0 ? (
								<p className="text-center text-sm text-gray-400 py-10">
									Nenhum candidato encontrado.
								</p>
							) : (
								listaSmartphone.map((candidato) => (
									<CardCandidato
										key={candidato.id}
										candidato={candidato}
										onEdit={() => abrirModalEdicao(candidato)}
										onDelete={() => excluirCandidato(candidato.id)}
									/>
								))
							)}
						</div>
					</div>

					{/* COLUNA: COMPUTADOR */}
					<div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
						<div className="bg-amber-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
									<Monitor className="w-5 h-5" />
								</div>
								<h2 className="font-bold text-gray-800">Curso de Computador</h2>
							</div>
							<span className="bg-white border border-amber-100 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
								{listaComputador.length} fichas
							</span>
						</div>

						<div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
							{carregandoSemestres || carregandoCandidatos ? <DataSkeleton rows={4} /> : listaComputador.length === 0 ? (
								<p className="text-center text-sm text-gray-400 py-10">
									Nenhum candidato encontrado.
								</p>
							) : (
								listaComputador.map((candidato) => (
									<CardCandidato
										key={candidato.id}
										candidato={candidato}
										onEdit={() => abrirModalEdicao(candidato)}
										onDelete={() => excluirCandidato(candidato.id)}
									/>
								))
							)}
						</div>
					</div>
				</div>
			</div>

			{/* MODAL DE CRUD */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
						onClick={() => setIsModalOpen(false)}
					/>

					{/* Modal Content */}
					<div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
						<div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
							<h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
								{candidatoEditando ? (
									<Pencil className="w-5 h-5 text-sky-600" />
								) : (
									<Plus className="w-5 h-5 text-sky-600" />
								)}
								{candidatoEditando
									? "Editar Candidato"
									: "Nova Ficha de Inscrição"}
							</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form
							onSubmit={salvarCandidato}
							className="p-6 overflow-y-auto max-h-[70vh]"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								{/* Ficha */}
								<div className="space-y-1 md:col-span-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<FileDigit className="w-4 h-4 text-sky-500" /> Número da
										Ficha
									</label>
									<input
										required
										type="text"
										value={form.ficha}
										onChange={(e) =>
											setForm({ ...form, ficha: e.target.value })
										}
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
										placeholder="Ex: 042"
									/>
								</div>

								{/* Curso de Interesse */}
								<div className="space-y-1 md:col-span-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<Ticket className="w-4 h-4 text-sky-500" /> Curso de
										Interesse
									</label>
									<div className="flex gap-2">
										<button
											type="button"
											onClick={() => setForm({ ...form, curso: "Smartphone" })}
											className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Smartphone" ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
										>
											<Smartphone className="w-4 h-4" /> Smartphone
										</button>
										<button
											type="button"
											onClick={() => setForm({ ...form, curso: "Computador" })}
											className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Computador" ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
										>
											<Monitor className="w-4 h-4" /> Computador
										</button>
									</div>
								</div>

								{/* Nome Completo */}
								<div className="space-y-1 md:col-span-2">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<User className="w-4 h-4 text-sky-500" /> Nome Completo
									</label>
									<input
										required
										type="text"
										value={form.nome}
										onChange={(e) => setForm({ ...form, nome: e.target.value })}
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
										placeholder="Digite o nome completo"
									/>
								</div>

								{/* Nascimento */}
								<div className="space-y-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<Calendar className="w-4 h-4 text-sky-500" /> Data de Nasc.
									</label>
									<input
										required
										type="date"
										value={form.dataNascimento}
										onChange={(e) =>
											setForm({ ...form, dataNascimento: e.target.value })
										}
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
									/>
								</div>

								{/* CPF */}
								<div className="space-y-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<FileDigit className="w-4 h-4 text-sky-500" /> CPF
									</label>
									<input
										required
										type="text"
										value={form.cpf}
										onChange={(e) => setForm({ ...form, cpf: formatarCpf(e.target.value) })}
										inputMode="numeric"
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
										placeholder="000.000.000-00"
									/>
								</div>

								{/* Telefone */}
								<div className="space-y-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<Phone className="w-4 h-4 text-sky-500" /> Telefone Pessoal
									</label>
									<input
										required
										type="text"
										value={form.telefone}
										onChange={(e) =>
											setForm({ ...form, telefone: formatarTelefone(e.target.value) })
										}
										inputMode="numeric"
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
										placeholder="(00) 00000-0000"
									/>
								</div>

								{/* Contato de Emergência */}
								<div className="space-y-1">
									<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
										<PhoneCall className="w-4 h-4 text-red-400" /> Contato
										Emergência
									</label>
									<input
										required
										type="text"
										value={form.emergencia}
										onChange={(e) =>
											setForm({ ...form, emergencia: formatarTelefone(e.target.value) })
										}
										inputMode="numeric"
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
										placeholder="(00) 00000-0000"
									/>
								</div>
							</div>

							{/* Rodapé do Modal */}
							<div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md transition-all"
								>
									{candidatoEditando
										? "Salvar Alterações"
										: "Adicionar ao Sorteio"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// Sub-Componente: Card de Candidato (Lista)
// ---------------------------------------------------------------------------

function CardCandidato({
	candidato,
	onEdit,
	onDelete,
}: {
	candidato: Candidato;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const isSmartphone = candidato.curso === "Smartphone";

	return (
		<div className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4">
			{/* Ficha Badge */}
			<div
				className={`w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center border border-dashed ${isSmartphone ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-amber-50 border-amber-200 text-amber-700"}`}
			>
				<span className="text-[10px] font-bold uppercase tracking-wider opacity-60 -mb-1">
					Ficha
				</span>
				<span className="text-lg font-black">{candidato.ficha}</span>
			</div>

			{/* Infos */}
			<div className="flex-1 min-w-0">
				<h4
					className="text-sm font-bold text-gray-900 truncate"
					title={candidato.nome}
				>
					{candidato.nome}
				</h4>
				<div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
					<span className="flex items-center gap-1">
						<FileDigit className="w-3 h-3" /> {formatarCpf(candidato.cpf)}
					</span>
					<span className="flex items-center gap-1">
						<Phone className="w-3 h-3" /> {candidato.telefone}
					</span>
				</div>
			</div>

			{/* Ações */}
			<div className="flex flex-col sm:flex-row gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
				<button
					onClick={onEdit}
					className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
					title="Editar"
				>
					<Pencil className="w-4 h-4" />
				</button>
				<button
					onClick={onDelete}
					className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
					title="Excluir"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
