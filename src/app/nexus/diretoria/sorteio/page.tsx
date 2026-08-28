"use client";
import React, { useRef, useState } from "react";
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
	Download,
	Upload,
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
	criadoEm: string;
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

const CABECALHOS_PLANILHA = [
	"Carimbo de data/hora",
	"Nome Completo",
	"Número da ficha",
	"Data de Nascimento",
	"CPF",
	"Telefone para Contato",
	"Contato de Emergência",
	"Curso de interesse - Apenas uma opção",
];

function dataDoCampo(valor: string) {
	const [ano, mes, dia] = valor.split("-").map(Number);
	return new Date(ano ?? 0, (mes ?? 1) - 1, dia ?? 1, 12);
}

function normalizarCabecalho(valor: string) {
	return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

function valorDaLinha(linha: Record<string, unknown>, cabecalhos: string[]) {
	const chaves = new Set(cabecalhos.map(normalizarCabecalho));
	return Object.entries(linha).find(([chave]) => chaves.has(normalizarCabecalho(chave)))?.[1];
}

function textoDaPlanilha(valor: unknown) {
	return String(valor ?? "").trim();
}

function dataDaPlanilha(valor: unknown) {
	if (valor instanceof Date && !Number.isNaN(valor.getTime())) return valor;
	const texto = textoDaPlanilha(valor);
	const brasileira = texto.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[\s,]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
	if (brasileira) {
		const [, primeiro, segundoDiaMes, ano, hora = "0", minuto = "0", segundo = "0"] = brasileira;
		const primeiroNumero = Number(primeiro);
		const segundoNumero = Number(segundoDiaMes);
		const [dia, mes] = primeiroNumero > 12
			? [primeiroNumero, segundoNumero]
			: segundoNumero > 12
				? [segundoNumero, primeiroNumero]
				: [primeiroNumero, segundoNumero];
		const data = new Date(Number(ano), mes - 1, dia, Number(hora), Number(minuto), Number(segundo));
		return Number.isNaN(data.getTime()) ? null : data;
	}
	const data = new Date(texto);
	return Number.isNaN(data.getTime()) ? null : data;
}

function cursoDaPlanilha(valor: unknown) {
	const curso = normalizarCabecalho(textoDaPlanilha(valor));
	if (curso === "smartphone") return "SMARTPHONE" as const;
	if (curso === "computador") return "COMPUTADOR" as const;
	return null;
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
	const importar = api.diretoria.candidatos.importMany.useMutation({
		onSuccess: () => utils.diretoria.candidatos.list.invalidate(),
	});
	const candidatos = (candidatosDb ?? []).map((candidato) => ({
		...candidato,
		dataNascimento: candidato.dataNascimento.toISOString().slice(0, 10),
		criadoEm: candidato.createdAt.toISOString(),
		curso:
			candidato.curso === "SMARTPHONE"
				? ("Smartphone" as const)
				: ("Computador" as const),
	}));
	const [busca, setBusca] = useState("");
	const inputImportacaoRef = useRef<HTMLInputElement>(null);
	const [importando, setImportando] = useState(false);
	const [resultadoImportacao, setResultadoImportacao] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

	// Controle do Modal
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [candidatoEditando, setCandidatoEditando] = useState<Candidato | null>(
		null,
	);

	// Estado do formulário
	const [form, setForm] = useState<Omit<Candidato, "id" | "criadoEm">>({
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
		const { id: _id, criadoEm: _criadoEm, ...dados } = candidato;
		setForm(dados);
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

	const exportarInscricoes = async () => {
		if (!semestreSelecionado) return;

		const XLSX = await import("xlsx");
		const linhas = candidatos.map((candidato) => ({
			[CABECALHOS_PLANILHA[0]!]: new Date(candidato.criadoEm),
			[CABECALHOS_PLANILHA[1]!]: candidato.nome,
			[CABECALHOS_PLANILHA[2]!]: candidato.ficha,
			[CABECALHOS_PLANILHA[3]!]: dataDoCampo(candidato.dataNascimento),
			[CABECALHOS_PLANILHA[4]!]: formatarCpf(candidato.cpf),
			[CABECALHOS_PLANILHA[5]!]: candidato.telefone,
			[CABECALHOS_PLANILHA[6]!]: candidato.emergencia,
			[CABECALHOS_PLANILHA[7]!]: candidato.curso,
		}));
		const planilha = XLSX.utils.json_to_sheet(linhas, { header: CABECALHOS_PLANILHA });
		planilha["!cols"] = [
			{ wch: 22 }, { wch: 34 }, { wch: 16 }, { wch: 18 },
			{ wch: 16 }, { wch: 22 }, { wch: 35 }, { wch: 34 },
		];
		for (let linha = 2; linha <= linhas.length + 1; linha += 1) {
			if (planilha[`A${linha}`]) planilha[`A${linha}`].z = "dd/mm/yyyy hh:mm";
			if (planilha[`D${linha}`]) planilha[`D${linha}`].z = "dd/mm/yyyy";
		}
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Inscrições");
		const codigo = semestreSelecionado.codigo.replace(/[^a-zA-Z0-9_-]+/g, "_");
		XLSX.writeFile(arquivo, `Controle_de_Inscricoes_${codigo}.xlsx`, { compression: true });
	};

	const importarInscricoes = async (evento: React.ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestreSelecionado) return;
		setResultadoImportacao(null);

		try {
			setImportando(true);
			const XLSX = await import("xlsx");
			const livro = XLSX.read(await arquivo.arrayBuffer(), { type: "array", cellDates: true });
			const primeiraAba = livro.SheetNames[0];
			if (!primeiraAba || !livro.Sheets[primeiraAba]) throw new Error("A planilha não possui uma aba com dados.");
			const linhas = XLSX.utils.sheet_to_json<Record<string, unknown>>(livro.Sheets[primeiraAba], { defval: "", raw: true });
			if (!linhas.length) throw new Error("A planilha não possui inscrições para importar.");

			const erros: string[] = [];
			const registros = linhas.flatMap((linha, indice) => {
				const nome = textoDaPlanilha(valorDaLinha(linha, ["Nome Completo"]));
				const ficha = textoDaPlanilha(valorDaLinha(linha, ["Número da ficha", "Numero da ficha"]));
				const dataNascimento = dataDaPlanilha(valorDaLinha(linha, ["Data de Nascimento"]));
				const cpf = textoDaPlanilha(valorDaLinha(linha, ["CPF"])).replace(/\D/g, "");
				const telefone = textoDaPlanilha(valorDaLinha(linha, ["Telefone para Contato", "Telefone Pessoal"]));
				const emergencia = textoDaPlanilha(valorDaLinha(linha, ["Contato de Emergência", "Contato de Emergencia"]));
				const curso = cursoDaPlanilha(valorDaLinha(linha, ["Curso de interesse - Apenas uma opção", "Curso de Interesse"]));
				const createdAt = dataDaPlanilha(valorDaLinha(linha, ["Carimbo de data/hora"]));

				if (!nome || !ficha || !dataNascimento || cpf.length !== 11 || telefone.length < 8 || emergencia.length < 8 || !curso) {
					erros.push(`linha ${indice + 2}`);
					return [];
				}
				return [{ ficha, nome, dataNascimento, cpf, telefone, emergencia, curso, ...(createdAt ? { createdAt } : {}) }];
			});

			if (!registros.length) throw new Error(`Nenhuma linha válida foi encontrada. Revise ${erros.slice(0, 8).join(", ")}.`);
			const resultado = await importar.mutateAsync({ semestreId: semestreSelecionado.id, registros });
			const invalidas = erros.length ? ` ${erros.length} linha(s) inválida(s) não foram importadas.` : "";
			setResultadoImportacao({ tipo: "sucesso", texto: `${resultado.criados} inscrição(ões) importada(s). ${resultado.ignorados} já existia(m) neste semestre.${invalidas}` });
		} catch (erro) {
			setResultadoImportacao({ tipo: "erro", texto: erro instanceof Error ? erro.message : "Não foi possível importar a planilha." });
		} finally {
			setImportando(false);
		}
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8 pb-32">
			<div className="max-w-7xl w-full mx-auto space-y-6">
				<DiretoriaBackLink />
				<input ref={inputImportacaoRef} type="file" accept=".xlsx,.xls" className="sr-only" onChange={(evento) => void importarInscricoes(evento)} />
				<DiretoriaPageIntro icon={Ticket} title="Gerenciar sorteio" description={`Inscrições cadastradas: ${candidatos.length} fichas`} actions={<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row"><button type="button" onClick={() => inputImportacaoRef.current?.click()} disabled={importando || !semestreSelecionado} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"><Upload className="h-4 w-4" />{importando ? "Importando..." : "Importar planilha"}</button><button type="button" onClick={() => void exportarInscricoes()} disabled={candidatos.length === 0} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"><Download className="h-4 w-4" />Exportar inscrições</button><a href="/nexus/diretoria/sorteio/sorteador" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-sky-800 shadow-sm transition hover:bg-orange-50 hover:text-orange-800"><Dices className="h-4 w-4" />Ir para o Sorteador</a></div>} />
				{resultadoImportacao && <p role={resultadoImportacao.tipo === "erro" ? "alert" : "status"} className={`rounded-xl px-4 py-3 text-sm font-medium ${resultadoImportacao.tipo === "erro" ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-800"}`}>{resultadoImportacao.texto}</p>}

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
				<div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
					{/* Backdrop */}
					<div
						className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
						onClick={() => setIsModalOpen(false)}
					/>

					{/* Modal Content */}
					<div className="relative z-10 max-h-[96dvh] w-full max-w-2xl overflow-hidden rounded-t-3xl border border-gray-100 bg-white shadow-xl animate-in zoom-in-95 duration-200 sm:rounded-3xl">
						<div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50 p-4 sm:p-6">
							<h3 className="flex min-w-0 items-center gap-2 break-words text-lg font-bold text-gray-900">
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
								className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<form
							onSubmit={salvarCandidato}
							className="max-h-[calc(96dvh-5rem)] overflow-y-auto p-4 sm:max-h-[70vh] sm:p-6"
						>
							<p className="mb-5 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">A data e a hora do registro são preenchidas automaticamente.</p>
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
										<Ticket className="w-4 h-4 text-sky-500" /> Curso de interesse
									</label>
									<div className="flex flex-col gap-2 min-[400px]:flex-row">
										<button
											type="button"
											onClick={() => setForm({ ...form, curso: "Smartphone" })}
											className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Smartphone" ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm" : "bg-white border-gray-200 text-black/60 hover:bg-gray-50"}`}
										>
											<Smartphone className="w-4 h-4" /> Smartphone
										</button>
										<button
											type="button"
											onClick={() => setForm({ ...form, curso: "Computador" })}
											className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Computador" ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" : "bg-white border-gray-200 text-black/60 hover:bg-gray-50"}`}
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
										<Calendar className="w-4 h-4 text-sky-500" /> Data de Nascimento
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
										<Phone className="w-4 h-4 text-sky-500" /> Telefone para Contato
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
										<PhoneCall className="w-4 h-4 text-red-400" /> Contato de Emergência
									</label>
									<input
										required
										type="text"
										value={form.emergencia}
										onChange={(e) => setForm({ ...form, emergencia: e.target.value })}
										className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
										placeholder="Ex.: (84) 99999-9999 - Maria (filha)"
									/>
								</div>
							</div>

							{/* Rodapé do Modal */}
							<div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
								>
									Cancelar
								</button>
								<button
									type="submit"
									className="min-h-11 w-full rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md sm:w-auto"
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
					className="p-2 text-black/45 hover:bg-sky-50 hover:text-sky-600 rounded-lg transition-colors"
					title="Editar"
				>
					<Pencil className="w-4 h-4" />
				</button>
				<button
					onClick={onDelete}
					className="p-2 text-black/45 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
					title="Excluir"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}
