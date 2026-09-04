"use client";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import * as XLSX from "xlsx";
import {
	ShieldCheck,
	Plus,
	Pencil,
	Trash2,
	Check,
	ArrowLeft,
	Mail,
	DoorOpen,
	Info,
	IdCard,
	FileText,
	Loader2,
	Download,
	Upload,
} from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { PersonManagementCard } from "~/app/_components/diretoria/people-management-card";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { ProjectCodeModal } from "~/app/_components/diretoria/project-code-modal";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

interface Monitor {
	id: string;
	nome: string;
	matricula: string;
	email: string;
	senha: string;
	turmas: string[]; // somente leitura aqui — vínculo é feito na tela de Turmas
	turmasDetalhadas: { id: string; titulo: string; semestre: string }[];
}

const monitorVazio = (): Monitor => ({
	id: "",
	nome: "",
	matricula: "",
	email: "",
	senha: "",
	turmas: [],
	turmasDetalhadas: [],
});

function normalizarMonitor(m: Partial<Monitor> & { id: string }): Monitor {
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

function normalizarCabecalho(cabecalho: unknown) {
	return String(cabecalho ?? "")
		.trim()
		.toLocaleLowerCase("pt-BR")
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]/g, "");
}

function iniciais(nome: string) {
	return nome
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((p) => p[0]?.toUpperCase())
		.join("");
}

// ---------------------------------------------------------------------------
// Card de monitor (lista)
// ---------------------------------------------------------------------------

function _MonitorCard({
	monitor,
	onEditar,
	onExcluir,
	onDeclaracao,
}: {
	monitor: Monitor;
	onEditar: () => void;
	onExcluir: () => void;
	onDeclaracao: () => void;
}) {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all">
			<div className="flex items-start justify-between gap-3 mb-4">
				<div className="flex items-center gap-3 min-w-0">
					<div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
						{iniciais(monitor.nome) || "?"}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold text-gray-900 truncate">
							{monitor.nome || "Sem nome"}
						</p>
						<p className="text-xs text-gray-500 truncate">
							{monitor.email || "Sem e-mail cadastrado"}
						</p>
						{monitor.matricula && (
							<p className="text-[11px] text-gray-400 font-mono mt-0.5">
								Matrícula: {monitor.matricula}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-1 flex-shrink-0">
					<button
						type="button"
						onClick={onDeclaracao}
						className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50"
						aria-label="Gerar certificado PM"
						title="Gerar certificado PM"
					>
						<FileText className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={onEditar}
						className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
						aria-label="Editar monitor"
					>
						<Pencil className="w-3.5 h-3.5" />
					</button>
					<button
						type="button"
						onClick={onExcluir}
						className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
						aria-label="Excluir monitor"
					>
						<Trash2 className="w-3.5 h-3.5" />
					</button>
				</div>
			</div>

			<div className="pt-3 border-t border-gray-100">
				{monitor.turmas.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{monitor.turmas.map((t) => (
							<span
								key={t}
								className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700"
							>
								<DoorOpen className="w-3 h-3" />
								{t}
							</span>
						))}
					</div>
				) : (
					<p className="text-xs text-gray-400">Nenhuma turma atribuída</p>
				)}
			</div>
		</div>
	);
}

function downloadBase64Pdf(base64Data: string, filename: string) {
	const bytes = Uint8Array.from(atob(base64Data), (char) => char.charCodeAt(0));
	const url = URL.createObjectURL(
		new Blob([bytes], { type: "application/pdf" }),
	);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function MonitoresDiretoria() {
	const utils = api.useUtils();
	const { data: monitoresDb, isLoading: carregandoMonitores } =
		api.diretoria.usuarios.list.useQuery({ role: "MONITOR" });
	const criar = api.diretoria.usuarios.create.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const atualizar = api.diretoria.usuarios.update.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const remover = api.diretoria.usuarios.remove.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const importarMonitores = api.diretoria.usuarios.importMonitors.useMutation({
		onSuccess: () => utils.diretoria.usuarios.list.invalidate(),
	});
	const solicitarRedefinicao = api.conta.solicitarRedefinicao.useMutation({
		onSuccess: () => alert("Código de redefinição enviado por e-mail."),
		onError: (causa) => alert(causa.message),
	});
	const gerarDeclaracao = api.declaracao.gerarIndividual.useMutation({
		onSuccess: (data) =>
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || "Certificado_PM.pdf",
			),
		onError: (err) => alert(`Erro ao gerar certificado PM: ${err.message}`),
	});
	const [monitores, setMonitores] = useState<Monitor[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Monitor>(monitorVazio());
	const [modalLoteAberto, setModalLoteAberto] = useState(false);
	const inputImportacaoRef = useRef<HTMLInputElement>(null);
	const [resultadoImportacao, setResultadoImportacao] = useState<{
		tipo: "sucesso" | "erro";
		texto: string;
	} | null>(null);
	const gerarLoteDeclaracoes = api.declaracao.gerarLoteUsuarios.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(data.arquivoBase64, data.nomeArquivo);
			setModalLoteAberto(false);
		},
		onError: (err) =>
			alert(`Erro ao gerar o lote de certificados: ${err.message}`),
	});

	useEffect(() => {
		if (!monitoresDb) return;
		setMonitores(
			monitoresDb.map((m) => ({
				id: m.id,
				nome: m.nome,
				matricula: m.matricula,
				email: m.email,
				senha: "",
				turmas: m.turmasMonitor.map((v) => v.turma.titulo),
				turmasDetalhadas: m.turmasMonitor.map((v) => ({
					id: v.turma.id,
					titulo: v.turma.titulo,
					semestre: v.turma.semestre.codigo,
				})),
			})),
		);
	}, [monitoresDb]);

	const gerarLote = () => {
		if (!monitores.length) return;
		setModalLoteAberto(true);
	};

	const confirmarLote = (codigoProjeto: string) => {
		gerarLoteDeclaracoes.mutate({
			usuarioIds: monitores.map((monitor) => monitor.id),
			tipo: "monitor",
			codigoProjeto,
		});
	};

	const exportarMonitores = () => {
		if (!monitores.length) {
			setResultadoImportacao({
				tipo: "erro",
				texto: "Não há monitores para exportar.",
			});
			return;
		}
		const planilha = XLSX.utils.json_to_sheet(
			monitores.map(({ nome, email, matricula }) => ({
				Nome: nome,
				Email: email,
				Matrícula: matricula,
			})),
			{ header: ["Nome", "Email", "Matrícula"] },
		);
		planilha["!cols"] = [{ wch: 38 }, { wch: 38 }, { wch: 18 }];
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Monitores");
		XLSX.writeFile(arquivo, "Monitores.xlsx", { compression: true });
	};

	const importarArquivo = async (event: ChangeEvent<HTMLInputElement>) => {
		const arquivo = event.target.files?.[0];
		event.target.value = "";
		if (!arquivo) return;
		setResultadoImportacao(null);
		try {
			const livro = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				raw: false,
			});
			const nomeAba = livro.SheetNames[0];
			if (!nomeAba || !livro.Sheets[nomeAba])
				throw new Error("A planilha não possui uma aba acessível.");
			const linhas = XLSX.utils.sheet_to_json<unknown[]>(
				livro.Sheets[nomeAba],
				{ header: 1, defval: "", raw: false },
			);
			const cabecalhos = linhas[0]?.map(normalizarCabecalho) ?? [];
			const indiceNome = cabecalhos.indexOf("nome");
			const indiceEmail = cabecalhos.indexOf("email");
			const indiceMatricula = cabecalhos.indexOf("matricula");
			if (indiceNome < 0 || indiceEmail < 0 || indiceMatricula < 0)
				throw new Error(
					"Use os cabeçalhos Nome, Email e Matrícula da planilha-base.",
				);

			const vistos = new Set<string>();
			const registros = linhas.slice(1).flatMap((linha, indice) => {
				if (linha.every((valor) => !String(valor).trim())) return [];
				const nome = String(linha[indiceNome] ?? "").trim();
				const email = String(linha[indiceEmail] ?? "")
					.trim()
					.toLowerCase();
				const matricula = String(linha[indiceMatricula] ?? "").trim();
				const linhaPlanilha = indice + 2;
				if (!nome || !email || !matricula)
					throw new Error(
						`Linha ${linhaPlanilha}: Nome, Email e Matrícula são obrigatórios.`,
					);
				if (!/^\S+@\S+\.\S+$/.test(email))
					throw new Error(`Linha ${linhaPlanilha}: informe um e-mail válido.`);
				if (matricula.length < 3)
					throw new Error(
						`Linha ${linhaPlanilha}: a matrícula deve ter pelo menos 3 caracteres.`,
					);
				const chaveEmail = `email:${email}`;
				const chaveMatricula = `matricula:${matricula}`;
				if (vistos.has(chaveEmail) || vistos.has(chaveMatricula))
					throw new Error(
						`Linha ${linhaPlanilha}: e-mail ou matrícula duplicado na planilha.`,
					);
				vistos.add(chaveEmail);
				vistos.add(chaveMatricula);
				return [{ nome, email, matricula }];
			});
			if (!registros.length)
				throw new Error("A planilha não possui monitores para importar.");
			const resultado = await importarMonitores.mutateAsync({
				monitores: registros,
			});
			setResultadoImportacao({
				tipo: "sucesso",
				texto: `${resultado.total} monitor(es) importado(s). A senha inicial de cada conta é a matrícula.`,
			});
		} catch (erro) {
			setResultadoImportacao({
				tipo: "erro",
				texto:
					erro instanceof Error
						? erro.message
						: "Não foi possível importar a planilha.",
			});
		}
	};

	const abrirNovo = () => {
		setEditandoId(null);
		setRascunho(monitorVazio());
		setModo("form");
	};

	const abrirEdicao = (monitor: Monitor) => {
		setEditandoId(monitor.id);
		setRascunho(normalizarMonitor(monitor));
		setModo("form");
	};

	const cancelar = () => setModo("lista");

	const salvar = () => {
		if (
			!rascunho.nome.trim() ||
			!rascunho.matricula.trim() ||
			!rascunho.email.trim()
		)
			return;
		if (editandoId) {
			atualizar.mutate({
				id: editandoId,
				role: "MONITOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		} else {
			criar.mutate({
				role: "MONITOR",
				nome: rascunho.nome,
				matricula: rascunho.matricula,
				email: rascunho.email,
			});
		}
		setModo("lista");
	};

	const excluir = (id: string) => {
		if (
			confirm(
				"Excluir este monitor? O acesso dele será revogado imediatamente.",
			)
		) {
			remover.mutate({ id, role: "MONITOR" });
		}
	};

	const formValido =
		rascunho.nome.trim() && rascunho.matricula.trim() && rascunho.email.trim();

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 flex flex-col items-center font-sans px-3 py-6 sm:px-4 sm:py-4">
			<div className="w-full max-w-5xl">
				<DiretoriaBackLink />
			</div>
			{/* Banner de topo */}
			<div className="w-full max-w-5xl mb-6">
				<DiretoriaPageIntro
					icon={ShieldCheck}
					title="Gerenciar monitores"
					description="Cadastro, acesso e turmas vinculadas."
				/>
			</div>

			<div className="w-full max-w-5xl">
				{modo === "lista" ? (
					<>
						<div className="mb-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
							<span className="text-sm font-medium text-gray-700">
								{monitores.length} monitores cadastrados
							</span>
							<div className="grid grid-cols-1 gap-2 sm:flex sm:items-center">
								<input
									ref={inputImportacaoRef}
									type="file"
									accept=".xlsx,.xls,.csv"
									className="sr-only"
									onChange={(event) => void importarArquivo(event)}
								/>
								<button
									type="button"
									onClick={() => inputImportacaoRef.current?.click()}
									disabled={importarMonitores.isPending}
									className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
								>
									{importarMonitores.isPending ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Upload className="w-4 h-4" />
									)}
									{importarMonitores.isPending
										? "Importando..."
										: "Importar planilha"}
								</button>
								<button
									type="button"
									onClick={exportarMonitores}
									disabled={!monitores.length}
									className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 transition-colors hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
								>
									<Download className="w-4 h-4" />
									Exportar
								</button>
								<button
									type="button"
									onClick={gerarLote}
									disabled={!monitores.length || gerarLoteDeclaracoes.isPending}
									className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-800 transition-colors hover:bg-orange-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
									title="Gera um único PDF com todos os certificados dos monitores listados."
								>
									{gerarLoteDeclaracoes.isPending ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<FileText className="w-4 h-4" />
									)}
									{gerarLoteDeclaracoes.isPending
										? "Gerando PDF..."
										: "Gerar lote"}
								</button>
								<button
									type="button"
									onClick={abrirNovo}
									className="flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-colors hover:bg-sky-700"
								>
									<Plus className="w-4 h-4" />
									Novo monitor
								</button>
							</div>
						</div>
						{resultadoImportacao && (
							<p
								role={resultadoImportacao.tipo === "erro" ? "alert" : "status"}
								className={`mb-4 rounded-xl px-4 py-3 text-sm font-medium ${resultadoImportacao.tipo === "erro" ? "bg-red-50 text-red-700" : "bg-sky-50 text-sky-800"}`}
							>
								{resultadoImportacao.texto}
							</p>
						)}

						{carregandoMonitores ? (
							<DataSkeleton cards={4} />
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								{monitores.map((monitor) => (
									<PersonManagementCard
										key={monitor.id}
										person={monitor}
										personRole="monitor"
										onEdit={() => abrirEdicao(monitor)}
										onRemove={() => excluir(monitor.id)}
										onResetPassword={() => solicitarRedefinicao.mutate({ usuarioId: monitor.id })}
										onCertificate={() =>
											gerarDeclaracao.mutate({
												usuarioId: monitor.id,
												tipo: "monitor",
											})
										}
									/>
								))}
							</div>
						)}

						{!carregandoMonitores && monitores.length === 0 && (
							<div className="text-center py-16 text-sm text-gray-400">
								Nenhum monitor cadastrado ainda
							</div>
						)}
					</>
				) : (
					<div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
						<div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
							<button
								type="button"
								onClick={cancelar}
								className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
								aria-label="Voltar"
							>
								<ArrowLeft className="w-4 h-4" />
							</button>
							<h2 className="text-sm font-semibold text-gray-900">
								{editandoId ? "Editar monitor" : "Novo monitor"}
							</h2>
						</div>

						<div className="min-w-0 space-y-5 p-4 sm:p-6">
							{/* Nome */}
							<div>
								<label
									htmlFor="monitor-nome"
									className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
								>
									Nome
								</label>
								<input
									id="monitor-nome"
									value={rascunho.nome}
									onChange={(e) =>
										setRascunho({ ...rascunho, nome: e.target.value })
									}
									placeholder="Nome completo"
									className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
								/>
							</div>

							{/* Matrícula */}
							<div>
								<label
									htmlFor="monitor-matricula"
									className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
								>
									Matrícula
								</label>
								<div className="relative">
									<IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										id="monitor-matricula"
										value={rascunho.matricula}
										onChange={(e) =>
											setRascunho({ ...rascunho, matricula: e.target.value })
										}
										placeholder="Ex: 20240012345"
										className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
									/>
								</div>
							</div>

							{/* Email de acesso */}
							<div>
								<label
									htmlFor="monitor-email"
									className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2"
								>
									E-mail de acesso
								</label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
									<input
										id="monitor-email"
										type="email"
										value={rascunho.email}
										onChange={(e) =>
											setRascunho({ ...rascunho, email: e.target.value })
										}
										placeholder="monitor@proeidi.com.br"
										className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-emerald-300 focus:outline-none transition-colors"
									/>
								</div>
							</div>

							{/* Senha de acesso */}
							<div>
								<p className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
									Senha de acesso
								</p>
								<p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
									A senha inicial é a matrícula. Depois do primeiro acesso, a
									redefinição é feita por código enviado por e-mail.
								</p>
							</div>

							{/* Turmas (somente leitura) */}
							<div>
								<p className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
									Turmas
								</p>
								{rascunho.turmas.length > 0 ? (
									<div className="flex flex-wrap gap-1.5 mb-2">
										{rascunho.turmas.map((t) => (
											<span
												key={t}
												className="flex max-w-full items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
											>
												<DoorOpen className="w-3 h-3" />
												<span className="truncate">{t}</span>
											</span>
										))}
									</div>
								) : (
									<p className="text-xs text-gray-400 mb-2">
										Este monitor ainda não está em nenhuma turma
									</p>
								)}
								<p className="flex items-start gap-1.5 text-[11px] text-gray-400">
									<Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />O vínculo
									com turmas é feito na tela de Turmas, não aqui.
								</p>
							</div>
						</div>

						<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
							<button
								type="button"
								onClick={cancelar}
								className="min-h-11 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
							>
								Cancelar
							</button>
							<button
								type="button"
								onClick={salvar}
								disabled={!formValido}
								className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-sky-200 transition-colors hover:bg-sky-700 disabled:opacity-50"
							>
								<Check className="w-4 h-4" />
								Salvar monitor
							</button>
						</div>
					</div>
				)}
			</div>
			<ProjectCodeModal
				isOpen={modalLoteAberto}
				isSubmitting={gerarLoteDeclaracoes.isPending}
				personLabel="monitores"
				totalCertificates={monitores.length}
				onClose={() => setModalLoteAberto(false)}
				onConfirm={confirmarLote}
			/>
		</div>
	);
}
