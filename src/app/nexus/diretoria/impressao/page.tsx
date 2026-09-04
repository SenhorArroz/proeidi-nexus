"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
	CalendarDays,
	CheckCircle2,
	Download,
	FileText,
	Pencil,
	Plus,
	Printer,
	Trash2,
	Upload,
	Users,
	Search,
	Check,
	LoaderCircle,
} from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";
import styles from "./impressao.module.css";

const CABECALHOS = [
	"Semana",
	"Data da aula",
	"Data de entrega",
	"Apostila",
	"Curso",
	"Responsáveis",
	"Pronta?",
	"Impressa?",
	"Quantidade impressa",
	"Quantidade alvo",
	"Aula realizada?",
];

type Formulario = {
	id?: string;
	semana: number;
	dataAula: string;
	dataEntrega: string;
	aulaRealizada: boolean;
	titulo: string;
	curso: string;
	pronta: boolean;
	impressa: boolean;
	qtdImpressa: number;
	qtdAlvo: number;
	responsavelIds: string[];
};
const formularioVazio = (semana = 1): Formulario => ({
	semana,
	dataAula: "",
	dataEntrega: "",
	aulaRealizada: false,
	titulo: "",
	curso: "",
	pronta: false,
	impressa: false,
	qtdImpressa: 0,
	qtdAlvo: 0,
	responsavelIds: [],
});
const texto = (valor: unknown) => String(valor ?? "").trim();
const normalizar = (valor: unknown) =>
	texto(valor)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase();
const sim = (valor: unknown) =>
	["sim", "s", "true", "1", "x"].includes(normalizar(valor));

export default function ControleImpressao() {
	const utils = api.useUtils();
	const [semestreId, setSemestreId] = useState("");
	const {
		data: semestres,
		isLoading: carregandoSemestres,
		error: erroSemestres,
	} = api.diretoria.semestres.list.useQuery();
	const semestre =
		semestres?.find((item) => item.id === semestreId) ??
		semestres?.find((item) => item.ativo) ??
		semestres?.[0];
	const {
		data: semanas,
		isLoading,
		error: erroSemanas,
	} = api.diretoria.impressao.list.useQuery(
		{ semestreId: semestre?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestre) },
	);
	const { data: responsaveis = [] } =
		api.diretoria.impressao.responsaveis.useQuery();
	const [formulario, setFormulario] = useState<Formulario | null>(null);
	const [mensagem, setMensagem] = useState<string | null>(null);
	const [busca, setBusca] = useState("");
	const [importando, setImportando] = useState(false);
	const inputImportacao = useRef<HTMLInputElement>(null);
	const salvar = api.diretoria.impressao.salvarApostila.useMutation({
		onSuccess: () => {
			setFormulario(null);
			setMensagem("Apostila salva.");
			void utils.diretoria.impressao.list.invalidate();
		},
		onError: (erro) => setMensagem(erro.message),
	});
	const salvarSemana = api.diretoria.impressao.salvarSemana.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const salvarStatus = api.diretoria.impressao.salvarApostila.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const remover = api.diretoria.impressao.removerApostila.useMutation({
		onSuccess: () => utils.diretoria.impressao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});

	const abrirEdicao = (
		semana: NonNullable<typeof semanas>[number],
		apostila: NonNullable<typeof semanas>[number]["apostilas"][number],
	) =>
		setFormulario({
			id: apostila.id,
			semana: semana.numero,
			dataAula: semana.dataAula
				? semana.dataAula.toISOString().slice(0, 10)
				: "",
			dataEntrega: apostila.dataEntrega
				? apostila.dataEntrega.toISOString().slice(0, 10)
				: "",
			aulaRealizada: semana.aulaRealizada,
			titulo: apostila.titulo,
			curso: apostila.curso,
			pronta: apostila.pronta,
			impressa: apostila.impressa,
			qtdImpressa: apostila.qtdImpressa,
			qtdAlvo: apostila.qtdAlvo,
			responsavelIds: apostila.responsaveis.map((item) => item.userId),
		});
	const enviar = () => {
		if (!semestre || !formulario) return;
		const { semana, ...dados } = formulario;
		salvar.mutate({
			...dados,
			semestreId: semestre.id,
			semanaNumero: semana,
			dataAula: formulario.dataAula
				? new Date(`${formulario.dataAula}T12:00:00`)
				: null,
			dataEntrega: formulario.dataEntrega
				? new Date(`${formulario.dataEntrega}T12:00:00`)
				: null,
		});
	};
	const alternarStatus = (
		semana: NonNullable<typeof semanas>[number],
		apostila: NonNullable<typeof semanas>[number]["apostilas"][number],
		campo: "pronta" | "impressa",
	) => {
		if (!semestre) return;
		salvarStatus.mutate({
			id: apostila.id,
			semestreId: semestre.id,
			semanaNumero: semana.numero,
			dataAula: semana.dataAula,
			dataEntrega: apostila.dataEntrega,
			aulaRealizada: semana.aulaRealizada,
			titulo: apostila.titulo,
			curso: apostila.curso,
			pronta: campo === "pronta" ? !apostila.pronta : apostila.pronta,
			impressa: campo === "impressa" ? !apostila.impressa : apostila.impressa,
			qtdImpressa: apostila.qtdImpressa,
			qtdAlvo: apostila.qtdAlvo,
			responsavelIds: apostila.responsaveis.map((item) => item.userId),
		});
	};
	const exportarModelo = async () => {
		const XLSX = await import("xlsx");
		const planilha = XLSX.utils.json_to_sheet(
			[
				{
					Semana: 1,
					"Data da aula": "2026-09-11",
					"Data de entrega": "2026-09-08",
					Apostila: "Nome da apostila",
					Curso: "Nome do curso",
					Responsáveis: "Nome do diretor",
					"Pronta?": "NÃO",
					"Impressa?": "NÃO",
					"Quantidade impressa": 0,
					"Quantidade alvo": 0,
					"Aula realizada?": "NÃO",
				},
			],
			{ header: CABECALHOS },
		);
		planilha["!cols"] = CABECALHOS.map((cabecalho) => ({
			wch: Math.max(16, cabecalho.length + 4),
		}));
		const arquivo = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(arquivo, planilha, "Controle de impressão");
		XLSX.writeFile(arquivo, "Modelo_controle_de_impressao.xlsx", {
			compression: true,
		});
	};
	const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestre) return;
		setImportando(true);
		try {
			const XLSX = await import("xlsx");
			const livro = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				cellDates: true,
			});
			const aba = livro.SheetNames[0];
			const planilha = aba ? livro.Sheets[aba] : undefined;
			if (!planilha) throw new Error("A planilha não possui uma aba de dados.");
			const matriz = XLSX.utils.sheet_to_json<unknown[]>(planilha, {
				header: 1,
				defval: "",
			});
			const metasPorCurso = new Map<string, number>();
			const abaDados = livro.SheetNames.find(
				(nome) => normalizar(nome) === "dados",
			);
			if (abaDados && livro.Sheets[abaDados]) {
				for (const linha of XLSX.utils.sheet_to_json<unknown[]>(
					livro.Sheets[abaDados],
					{ header: 1, defval: "" },
				)) {
					if (texto(linha[0]))
						metasPorCurso.set(
							normalizar(linha[0]),
							Math.max(0, Number(linha[1]) || 0),
						);
				}
			}
			const linhas: Array<Record<string, unknown>> = [];
			const ehModeloPadrao = normalizar(matriz[0]?.[0]) === "semana";
			if (ehModeloPadrao) {
				const cabecalhos =
					matriz[0]?.map((cabecalho) => texto(cabecalho)) ?? [];
				for (const valores of matriz.slice(1))
					linhas.push(
						Object.fromEntries(
							cabecalhos.map((cabecalho, indice) => [
								cabecalho,
								valores[indice] ?? "",
							]),
						),
					);
			} else {
				let semanaAtual = 0;
				for (const valores of matriz) {
					const cabecalhoAula = texto(valores[0]).match(/^aula\s+(\d+)$/i);
					if (cabecalhoAula) {
						semanaAtual = Number(cabecalhoAula[1]);
						continue;
					}
					const titulo = texto(valores[0]);
					const curso = texto(valores[1]);
					if (
						!semanaAtual ||
						!titulo ||
						!curso ||
						normalizar(titulo) === "apostila"
					)
						continue;
					linhas.push({
						Semana: semanaAtual,
						"Data de entrega": valores[3],
						Apostila: titulo,
						Curso: curso,
						Responsáveis: valores[2],
						"Pronta?": valores[4],
						"Impressa?": valores[5],
						"Quantidade impressa": valores[6],
						"Quantidade alvo": metasPorCurso.get(normalizar(curso)) ?? 0,
						"Aula realizada?": valores[8],
					});
				}
			}
			const existentes = new Map<string, string>(
				(semanas ?? []).flatMap((semana) =>
					semana.apostilas.map(
						(apostila) =>
							[
								`${semana.numero}:${apostila.titulo.toLocaleLowerCase()}:${apostila.curso.toLocaleLowerCase()}`,
								apostila.id,
							] as const,
					),
				),
			);
			let importadas = 0;
			for (const linha of linhas) {
				const semana = Number(linha["Semana"]);
				const titulo = texto(linha["Apostila"]);
				const curso = texto(linha["Curso"]);
				if (!Number.isInteger(semana) || semana < 1 || !titulo || !curso)
					continue;
				const nomes = texto(linha["Responsáveis"])
					.split(",")
					.map(normalizar)
					.filter(Boolean);
				const responsavelIds = (
					nomes.includes("todos")
						? responsaveis
						: responsaveis.filter((pessoa) =>
								nomes.includes(normalizar(pessoa.nome)),
							)
				).map((pessoa) => pessoa.id);
				const data =
					linha["Data da aula"] instanceof Date
						? (linha["Data da aula"] as Date)
						: texto(linha["Data da aula"])
							? new Date(`${texto(linha["Data da aula"])}T12:00:00`)
							: null;
				const dataEntrega =
					linha["Data de entrega"] instanceof Date
						? (linha["Data de entrega"] as Date)
						: texto(linha["Data de entrega"])
							? new Date(`${texto(linha["Data de entrega"])}T12:00:00`)
							: null;
				const chave = `${semana}:${titulo.toLocaleLowerCase()}:${curso.toLocaleLowerCase()}`;
				const resultado = await salvar.mutateAsync({
					id: existentes.get(chave),
					semestreId: semestre.id,
					semanaNumero: semana,
					dataAula: data && !Number.isNaN(data.getTime()) ? data : null,
					dataEntrega:
						dataEntrega && !Number.isNaN(dataEntrega.getTime())
							? dataEntrega
							: null,
					aulaRealizada: sim(linha["Aula realizada?"]),
					titulo,
					curso,
					pronta: sim(linha["Pronta?"]),
					impressa: sim(linha["Impressa?"]),
					qtdImpressa: Math.max(0, Number(linha["Quantidade impressa"]) || 0),
					qtdAlvo: Math.max(0, Number(linha["Quantidade alvo"]) || 0),
					responsavelIds,
				});
				existentes.set(chave, resultado.id);
				importadas += 1;
			}
			setMensagem(`${importadas} apostila(s) importada(s).`);
			void utils.diretoria.impressao.list.invalidate();
		} catch (erro) {
			setMensagem(
				erro instanceof Error
					? erro.message
					: "Não foi possível importar a planilha.",
			);
		} finally {
			setImportando(false);
		}
	};

	const ocupado =
		salvar.isPending ||
		salvarStatus.isPending ||
		importando ||
		remover.isPending;
	const filtro = normalizar(busca);
	const semanasVisiveis = (semanas ?? [])
		.map((semana) => ({
			...semana,
			apostilas: semana.apostilas.filter((apostila) =>
				normalizar(
					[
						apostila.titulo,
						apostila.curso,
						...apostila.responsaveis.map((r) => r.user.nome),
					].join(" "),
				).includes(filtro),
			),
		}))
		.filter((semana) => !filtro || semana.apostilas.length);
	const erroConsulta = erroSemestres ?? erroSemanas;

	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<DiretoriaBackLink />
				<DiretoriaPageIntro
					icon={Printer}
					title="Controle de impressão"
					description="Organize as apostilas de cada aula e acompanhe a preparação e a impressão."
				/>
				<input
					ref={inputImportacao}
					type="file"
					accept=".xlsx,.xls"
					className="sr-only"
					aria-label="Selecionar planilha de impressão"
					onChange={(evento) => void importar(evento)}
					disabled={ocupado}
				/>
				<div className={styles.toolbar}>
					<div className={styles.filters}>
						<label className={styles.semester}>
							Semestre
							<select
								value={semestre?.id ?? ""}
								disabled={ocupado || carregandoSemestres}
								onChange={(evento) => {
									setSemestreId(evento.target.value);
									setFormulario(null);
									setMensagem(null);
								}}
							>
								{!semestres?.length && <option value="">Selecione</option>}
								{semestres?.map((item) => (
									<option key={item.id} value={item.id}>
										{item.codigo}
									</option>
								))}
							</select>
						</label>
						<label className={styles.search}>
							<Search size={18} aria-hidden="true" />
							<span className="sr-only">
								Buscar apostila, curso ou responsável
							</span>
							<input
								type="search"
								value={busca}
								onChange={(evento) => setBusca(evento.target.value)}
								placeholder="Buscar apostila, curso ou responsável"
							/>
						</label>
					</div>
					<div className={styles.toolbarActions}>
						<button
							type="button"
							className={styles.secondary}
							disabled={ocupado || !semestre || !!erroConsulta}
							onClick={() => inputImportacao.current?.click()}
						>
							{importando ? (
								<LoaderCircle size={17} className={styles.spinner} />
							) : (
								<Upload size={17} />
							)}
							{importando ? "Importando…" : "Importar planilha"}
						</button>
						<button
							type="button"
							className={styles.secondary}
							onClick={() =>
								void exportarModelo().catch(() =>
									setMensagem(
										"Não foi possível baixar o modelo. Tente novamente.",
									),
								)
							}
						>
							<Download size={17} /> Baixar modelo
						</button>
						<button
							type="button"
							className={styles.primary}
							disabled={!semestre || ocupado || !!erroConsulta}
							onClick={() =>
								setFormulario(
									formularioVazio(
										Math.min((semanas?.at(-1)?.numero ?? 0) + 1, 99),
									),
								)
							}
						>
							<Plus size={18} /> Nova apostila
						</button>
					</div>
				</div>
				{mensagem && (
					<p role="status" className={styles.notice}>
						{mensagem}
					</p>
				)}
				{formulario && (
					<Editor
						formulario={formulario}
						setFormulario={setFormulario}
						responsaveis={responsaveis}
						onCancel={() => setFormulario(null)}
						onSave={enviar}
						salvando={salvar.isPending}
					/>
				)}
				{erroConsulta ? (
					<div role="alert" className={styles.empty}>
						<h2>Não foi possível carregar as apostilas</h2>
						<p>{erroConsulta.message}</p>
						<button
							className={styles.secondary}
							onClick={() => {
								void utils.diretoria.semestres.list.invalidate();
								void utils.diretoria.impressao.list.invalidate();
							}}
						>
							Tentar novamente
						</button>
					</div>
				) : carregandoSemestres || isLoading ? (
					<DataSkeleton cards={4} />
				) : semanasVisiveis.length ? (
					<div className={styles.weeks}>
						{semanasVisiveis.map((semana) => (
							<section
								key={semana.id}
								className={styles.week}
								aria-label={`Aula ${semana.numero}`}
							>
								<header className={styles.weekHeader}>
									<div className={styles.weekTitle}>
										<span className={styles.weekIcon}>
											<CalendarDays size={22} />
										</span>
										<div>
											<h2>Aula {semana.numero}</h2>
											<p>
												{semana.dataAula
													? semana.dataAula.toLocaleDateString("pt-BR")
													: "Data da aula a definir"}{" "}
												· {semana.apostilas.length} apostila(s)
											</p>
										</div>
									</div>
									<label className={styles.lessonCheck}>
										<input
											type="checkbox"
											checked={semana.aulaRealizada}
											disabled={salvarSemana.isPending || ocupado}
											onChange={(evento) =>
												salvarSemana.mutate({
													semestreId: semestre!.id,
													numero: semana.numero,
													dataAula: semana.dataAula,
													aulaRealizada: evento.target.checked,
												})
											}
										/>
										Aula realizada
									</label>
								</header>
								<div className={styles.columns} aria-hidden="true">
									<span>Apostila / curso</span>
									<span>Responsáveis</span>
									<span>Entrega</span>
									<span>Impressos / meta</span>
									<span>Preparação e impressão</span>
									<span>Ações</span>
								</div>
								{semana.apostilas.map((apostila) => {
									const status =
										apostila.qtdAlvo === 0
											? "Meta a definir"
											: apostila.qtdImpressa >= apostila.qtdAlvo
												? "Meta atingida"
												: apostila.qtdImpressa
													? "Em andamento"
													: "Pendente";
									const pendente =
										salvarStatus.isPending &&
										salvarStatus.variables?.id === apostila.id;
									return (
										<article
											key={apostila.id}
											className={styles.row}
											aria-label={apostila.titulo}
										>
											<div className={styles.identity}>
												<h3>{apostila.titulo}</h3>
												<p>{apostila.curso}</p>
											</div>
											<div className={styles.people}>
												<span className={styles.mobileLabel}>Responsáveis</span>
												<div className={styles.chips}>
													{apostila.responsaveis.length ? (
														apostila.responsaveis.map((item) => (
															<span key={item.userId} className={styles.chip}>
																{item.user.nome}
															</span>
														))
													) : (
														<span className={styles.unassigned}>
															Sem responsável
														</span>
													)}
												</div>
											</div>
											<div className={styles.delivery}>
												<span className={styles.mobileLabel}>Entrega</span>
												<span>
													{apostila.dataEntrega ? (
														<time
															dateTime={apostila.dataEntrega
																.toISOString()
																.slice(0, 10)}
														>
															{apostila.dataEntrega.toLocaleDateString("pt-BR")}
														</time>
													) : (
														"A definir"
													)}
												</span>
											</div>
											<div className={styles.quantity}>
												<span className={styles.mobileLabel}>
													Impressos / meta
												</span>
												<strong>
													{apostila.qtdImpressa}{" "}
													<span>/ {apostila.qtdAlvo}</span>
												</strong>
												<span className={styles.quantityStatus}>{status}</span>
											</div>
											<div className={styles.statusControls}>
												<StatusButton
													label="Pronta"
													checked={apostila.pronta}
													disabled={
														ocupado || salvarSemana.isPending || !!formulario
													}
													busy={pendente}
													onClick={() =>
														alternarStatus(semana, apostila, "pronta")
													}
												/>
												<StatusButton
													label="Impressa"
													checked={apostila.impressa}
													disabled={
														ocupado || salvarSemana.isPending || !!formulario
													}
													busy={pendente}
													onClick={() =>
														alternarStatus(semana, apostila, "impressa")
													}
												/>
											</div>
											<div className={styles.rowActions}>
												<button
													type="button"
													className={styles.edit}
													disabled={ocupado}
													onClick={() => abrirEdicao(semana, apostila)}
													aria-label={`Editar ${apostila.titulo}`}
												>
													<Pencil size={17} />
													<span>Editar</span>
												</button>
												<button
													type="button"
													className={styles.remove}
													disabled={ocupado}
													onClick={() =>
														confirm(`Remover ${apostila.titulo}?`) &&
														remover.mutate({
															id: apostila.id,
															semestreId: semestre!.id,
														})
													}
													aria-label={`Remover ${apostila.titulo}`}
												>
													<Trash2 size={17} />
													<span>Remover</span>
												</button>
											</div>
										</article>
									);
								})}
								{!semana.apostilas.length && (
									<p className={styles.weekEmpty}>
										Nenhuma apostila nesta aula.
									</p>
								)}
							</section>
						))}
					</div>
				) : (
					<section className={styles.empty}>
						<FileText size={30} />
						<h2>
							{filtro
								? "Nenhuma apostila encontrada"
								: "Nenhuma apostila cadastrada"}
						</h2>
						<p>
							{filtro
								? "Tente outro título, curso ou responsável."
								: semestre
									? "Cadastre uma apostila ou importe sua planilha para começar."
									: "Cadastre um semestre na Diretoria para começar."}
						</p>
						{filtro && (
							<button className={styles.secondary} onClick={() => setBusca("")}>
								Limpar busca
							</button>
						)}
					</section>
				)}
			</div>
		</div>
	);
}

function StatusButton({
	label,
	checked,
	disabled,
	busy,
	onClick,
}: {
	label: string;
	checked: boolean;
	disabled: boolean;
	busy: boolean;
	onClick: () => void;
}) {
	return (
		<button
			type="button"
			className={styles.statusButton}
			data-checked={checked}
			aria-pressed={checked}
			aria-label={`${label}: ${checked ? "sim" : "não"}. Clique para alterar.`}
			disabled={disabled}
			onClick={onClick}
		>
			<span>{label}</span>
			<span className={styles.statusValue}>
				{busy ? (
					<LoaderCircle size={14} className={styles.spinner} />
				) : checked ? (
					<Check size={14} />
				) : null}
				{checked ? "Sim" : "Não"}
			</span>
		</button>
	);
}

function Editor({
	formulario,
	setFormulario,
	responsaveis,
	onCancel,
	onSave,
	salvando,
}: {
	formulario: Formulario;
	setFormulario: (formulario: Formulario) => void;
	responsaveis: { id: string; nome: string }[];
	onCancel: () => void;
	onSave: () => void;
	salvando: boolean;
}) {
	const editorRef = useRef<HTMLElement>(null);
	useEffect(() => {
		editorRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
		editorRef.current?.focus({ preventScroll: true });
	}, [formulario.id]);
	const atualizar = <K extends keyof Formulario>(
		campo: K,
		valor: Formulario[K],
	) => setFormulario({ ...formulario, [campo]: valor });
	return (
		<section
			ref={editorRef}
			tabIndex={-1}
			aria-label={formulario.id ? "Editar apostila" : "Nova apostila"}
			className={styles.editor}
		>
			<div className="mb-4 flex items-center gap-2 text-sky-900">
				<FileText className="h-5 w-5" />
				<h2 className="font-black">
					{formulario.id ? "Editar apostila" : "Nova apostila"}
				</h2>
			</div>
			<div className={styles.editorFields}>
				<Campo
					label="Semana"
					type="number"
					value={formulario.semana}
					onChange={(valor) => atualizar("semana", Number(valor))}
				/>
				<Campo
					label="Data da aula"
					type="date"
					value={formulario.dataAula}
					onChange={(valor) => atualizar("dataAula", valor)}
				/>
				<Campo
					label="Data de entrega"
					type="date"
					value={formulario.dataEntrega}
					onChange={(valor) => atualizar("dataEntrega", valor)}
				/>
				<Campo
					label="Apostila"
					value={formulario.titulo}
					onChange={(valor) => atualizar("titulo", valor)}
				/>
				<Campo
					label="Curso"
					value={formulario.curso}
					onChange={(valor) => atualizar("curso", valor)}
				/>
				<Campo
					label="Qtd. impressa"
					type="number"
					value={formulario.qtdImpressa}
					onChange={(valor) => atualizar("qtdImpressa", Number(valor))}
				/>
				<Campo
					label="Qtd. alvo"
					type="number"
					value={formulario.qtdAlvo}
					onChange={(valor) => atualizar("qtdAlvo", Number(valor))}
				/>
			</div>
			<fieldset className="mt-4">
				<legend className="text-sm font-bold text-sky-900">
					<Users className="mr-1 inline h-4 w-4" />
					Responsáveis
				</legend>
				<div className="mt-2 flex flex-wrap gap-2">
					{responsaveis.map((pessoa) => (
						<label
							key={pessoa.id}
							className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-sm text-slate-700"
						>
							<input
								type="checkbox"
								checked={formulario.responsavelIds.includes(pessoa.id)}
								onChange={(evento) =>
									atualizar(
										"responsavelIds",
										evento.target.checked
											? [...formulario.responsavelIds, pessoa.id]
											: formulario.responsavelIds.filter(
													(id) => id !== pessoa.id,
												),
									)
								}
							/>
							{pessoa.nome}
						</label>
					))}
					{!responsaveis.length && (
						<p className="text-sm text-slate-600">
							Nenhum responsável disponível.
						</p>
					)}
				</div>
			</fieldset>
			<div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
				<label>
					<input
						type="checkbox"
						checked={formulario.pronta}
						onChange={(evento) => atualizar("pronta", evento.target.checked)}
					/>{" "}
					Pronta
				</label>
				<label>
					<input
						type="checkbox"
						checked={formulario.impressa}
						onChange={(evento) => atualizar("impressa", evento.target.checked)}
					/>{" "}
					Impressa
				</label>
				<label>
					<input
						type="checkbox"
						checked={formulario.aulaRealizada}
						onChange={(evento) =>
							atualizar("aulaRealizada", evento.target.checked)
						}
					/>{" "}
					Aula realizada
				</label>
			</div>
			<div className="mt-5 flex justify-end gap-2">
				<button
					onClick={onCancel}
					disabled={salvando}
					className="min-h-11 rounded-xl px-4 text-sm font-bold text-slate-600 hover:bg-white"
				>
					Cancelar
				</button>
				<button
					onClick={onSave}
					disabled={
						salvando || !formulario.titulo.trim() || !formulario.curso.trim()
					}
					className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white hover:bg-sky-700 disabled:opacity-50"
				>
					<CheckCircle2 className="h-4 w-4" />
					{salvando ? "Salvando..." : "Salvar"}
				</button>
			</div>
		</section>
	);
}

function Campo({
	label,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	value: string | number;
	onChange: (valor: string) => void;
	type?: string;
}) {
	return (
		<label>
			{label}
			<input
				type={type}
				min={type === "number" ? 0 : undefined}
				value={value}
				onChange={(evento) => onChange(evento.target.value)}
			/>
		</label>
	);
}
