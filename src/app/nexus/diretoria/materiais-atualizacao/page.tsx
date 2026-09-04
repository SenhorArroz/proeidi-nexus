"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import {
	CheckCircle2,
	CalendarDays,
	Circle,
	Download,
	FilePenLine,
	Pencil,
	Plus,
	Trash2,
	Upload,
	Users,
} from "lucide-react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";
import styles from "./materiais.module.css";

const CABECALHOS = [
	"Curso",
	"Material",
	"Responsável",
	"Data de entrega",
	"Revisado",
	"Precisa de ajuste",
	"Ajustado",
];
type Formulario = {
	id?: string;
	curso: string;
	titulo: string;
	dataEntrega: string;
	revisado: boolean;
	precisaAjuste: boolean;
	ajustado: boolean;
	responsavelIds: string[];
};
const vazio = (): Formulario => ({
	curso: "",
	titulo: "",
	dataEntrega: "",
	revisado: false,
	precisaAjuste: false,
	ajustado: false,
	responsavelIds: [],
});
const texto = (valor: unknown) => String(valor ?? "").trim();
const sim = (valor: unknown) =>
	["sim", "s", "true", "1", "x"].includes(
		texto(valor)
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase(),
	);

export default function MateriaisAtualizacao() {
	const utils = api.useUtils();
	const [semestreId, setSemestreId] = useState("");
	const [formulario, setFormulario] = useState<Formulario | null>(null);
	const [mensagem, setMensagem] = useState<string | null>(null);
	const input = useRef<HTMLInputElement>(null);
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
		data: materiais,
		isLoading,
		error: erroMateriais,
	} = api.diretoria.materialAtualizacao.list.useQuery(
		{ semestreId: semestre?.id ?? "c0000000000000000000000000" },
		{ enabled: Boolean(semestre) },
	);
	const { data: responsaveis = [] } =
		api.diretoria.materialAtualizacao.responsaveis.useQuery();
	const salvar = api.diretoria.materialAtualizacao.salvar.useMutation({
		onSuccess: () => {
			setFormulario(null);
			setMensagem("Material salvo.");
			void utils.diretoria.materialAtualizacao.list.invalidate();
		},
		onError: (erro) => setMensagem(erro.message),
	});
	const remover = api.diretoria.materialAtualizacao.remover.useMutation({
		onSuccess: () => void utils.diretoria.materialAtualizacao.list.invalidate(),
		onError: (erro) => setMensagem(erro.message),
	});
	const editar = (item: NonNullable<typeof materiais>[number]) =>
		setFormulario({
			id: item.id,
			curso: item.curso,
			titulo: item.titulo,
			dataEntrega: item.dataEntrega
				? item.dataEntrega.toISOString().slice(0, 10)
				: "",
			revisado: item.revisado,
			precisaAjuste: item.precisaAjuste,
			ajustado: item.ajustado,
			responsavelIds: item.responsaveis.map((r) => r.userId),
		});
	const enviar = () => {
		if (!formulario || !semestre) return;
		salvar.mutate({
			...formulario,
			semestreId: semestre.id,
			dataEntrega: formulario.dataEntrega
				? new Date(`${formulario.dataEntrega}T12:00:00`)
				: null,
		});
	};
	const modelo = async () => {
		const XLSX = await import("xlsx");
		const ws = XLSX.utils.json_to_sheet(
			[
				{
					Curso: "Nome do curso",
					Material: "Nome do material",
					Responsável: "Nome do diretor",
					"Data de entrega": "2026-02-13",
					Revisado: "NÃO",
					"Precisa de ajuste": "NÃO",
					Ajustado: "NÃO",
				},
			],
			{ header: CABECALHOS },
		);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Atualização de materiais");
		XLSX.writeFile(wb, "Modelo_atualizacao_materiais.xlsx");
	};
	const importar = async (evento: ChangeEvent<HTMLInputElement>) => {
		const arquivo = evento.target.files?.[0];
		evento.target.value = "";
		if (!arquivo || !semestre) return;
		try {
			const XLSX = await import("xlsx");
			const wb = XLSX.read(await arquivo.arrayBuffer(), {
				type: "array",
				cellDates: true,
			});
			const ws = wb.Sheets[wb.SheetNames[0] ?? ""];
			if (!ws) throw new Error("Planilha sem dados.");
			const matriz = XLSX.utils.sheet_to_json<unknown[]>(ws, {
				header: 1,
				defval: "",
			});
			const cabecalhos =
				matriz[0]?.map((cabecalho) =>
					texto(cabecalho)
						.normalize("NFD")
						.replace(/[\u0300-\u036f]/g, "")
						.toLowerCase(),
				) ?? [];
			const valor = (linha: unknown[], nome: string) =>
				linha[cabecalhos.indexOf(nome)] ?? "";
			let total = 0;
			for (const linha of matriz.slice(1)) {
				const curso = texto(valor(linha, "curso"));
				const titulo = texto(valor(linha, "material"));
				if (!curso || !titulo) continue;
				const nomes = texto(valor(linha, "responsavel"))
					.split(",")
					.map((n) => n.trim().toLowerCase());
				const entrega = valor(linha, "data de entrega");
				const data =
					entrega instanceof Date
						? entrega
						: texto(entrega)
							? new Date(`${texto(entrega)}T12:00:00`)
							: null;
				await salvar.mutateAsync({
					semestreId: semestre.id,
					curso,
					titulo,
					dataEntrega: data && !Number.isNaN(data.getTime()) ? data : null,
					revisado: sim(valor(linha, "revisado")),
					precisaAjuste: sim(valor(linha, "precisa de ajuste")),
					ajustado: sim(valor(linha, "ajustado")),
					responsavelIds: responsaveis
						.filter((p) => nomes.includes(p.nome.toLowerCase()))
						.map((p) => p.id),
				});
				total++;
			}
			setMensagem(`${total} material(is) importado(s).`);
			void utils.diretoria.materialAtualizacao.list.invalidate();
		} catch (erro) {
			setMensagem(
				erro instanceof Error ? erro.message : "Não foi possível importar.",
			);
		}
	};
	return (
		<div className={`diretoria-page-canvas min-h-full ${styles.page}`}>
			<div className={styles.content}>
				<DiretoriaBackLink />
				<input
					ref={input}
					type="file"
					accept=".xlsx,.xls"
					className="sr-only"
					onChange={(e) => void importar(e)}
				/>
				<DiretoriaPageIntro
					icon={FilePenLine}
					title="Atualização de materiais"
					description="Acompanhe a revisão e os ajustes necessários nos materiais de cada curso."
					actions={
						<div className="flex w-full flex-wrap gap-2 sm:w-auto">
							<button
								onClick={() => input.current?.click()}
								className={styles.secondary}
							>
								<Upload className="mr-2 inline h-4 w-4" />
								Importar
							</button>
							<button
								onClick={() => void modelo()}
								className={styles.secondary}
							>
								<Download className="mr-2 inline h-4 w-4" />
								Modelo
							</button>
						</div>
					}
				/>
				<div className={styles.toolbar}>
					<label className={styles.semester}>
						Semestre{" "}
						<select
							value={semestre?.id ?? ""}
							onChange={(e) => {
								setSemestreId(e.target.value);
								setFormulario(null);
								setMensagem(null);
							}}
						>
							{semestres?.map((s) => (
								<option key={s.id} value={s.id}>
									{s.codigo}
								</option>
							))}
						</select>
					</label>
					<button
						onClick={() => setFormulario(vazio())}
						className={styles.primary}
					>
						<Plus className="mr-2 inline h-4 w-4" />
						Novo material
					</button>
				</div>
				{mensagem && (
					<p role="status" className={styles.notice}>
						{mensagem}
					</p>
				)}
				{formulario && (
					<Editor
						form={formulario}
						setForm={setFormulario}
						responsaveis={responsaveis}
						salvar={enviar}
						cancelar={() => setFormulario(null)}
						pendente={salvar.isPending}
					/>
				)}
				{erroMateriais || erroSemestres ? (
					<section className={styles.empty} role="alert">
						<h2>Não foi possível carregar os materiais</h2>
						<p>Tente novamente para consultar os dados do semestre.</p>
						<button
							className={styles.secondary}
							onClick={() => {
								void utils.diretoria.semestres.list.invalidate();
								void utils.diretoria.materialAtualizacao.list.invalidate();
							}}
						>
							Tentar novamente
						</button>
					</section>
				) : isLoading || carregandoSemestres ? (
					<DataSkeleton cards={4} />
				) : !materiais?.length ? (
					<section className={styles.empty}>
						<h2>
							{semestre
								? "Nenhum material neste semestre"
								: "Nenhum semestre disponível"}
						</h2>
						<p>
							{semestre
								? "Cadastre um novo material ou importe uma planilha para começar."
								: "Cadastre um semestre na diretoria para organizar os materiais."}
						</p>
					</section>
				) : (
					<div className={styles.grid}>
						{materiais?.map((item) => (
							<article
								key={item.id}
								className={styles.card}
								aria-labelledby={`material-${item.id}`}
							>
								<header className={styles.cardHeader}>
									<span className={styles.materialIcon}>
										<FilePenLine size={20} aria-hidden="true" />
									</span>
									<div className={styles.identity}>
										<h2 id={`material-${item.id}`}>{item.titulo}</h2>
										<p>{item.curso}</p>
									</div>
								</header>
								<div className={styles.cardBody}>
									<div className={styles.people}>
										<p className={styles.label}>
											<Users size={16} aria-hidden="true" /> Responsáveis
										</p>
										<div className={styles.chips}>
											{item.responsaveis.length ? (
												item.responsaveis.map((r) => (
													<span key={r.userId} className={styles.chip}>
														{r.user.nome}
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
										<span className={styles.label}>
											<CalendarDays size={16} aria-hidden="true" /> Entrega
										</span>
										<strong>
											{item.dataEntrega ? (
												<time
													dateTime={item.dataEntrega.toISOString().slice(0, 10)}
												>
													{item.dataEntrega.toLocaleDateString("pt-BR")}
												</time>
											) : (
												"A definir"
											)}
										</strong>
									</div>
									<dl className={styles.statusList}>
										<Status label="Revisado" ativo={item.revisado} />
										<Status
											label="Precisa de ajuste"
											ativo={item.precisaAjuste}
											cor="orange"
										/>
										<Status label="Ajustado" ativo={item.ajustado} />
									</dl>
								</div>
								<footer className={styles.cardActions}>
									<button
										onClick={() => editar(item)}
										className={styles.edit}
										aria-label={`Editar ${item.titulo}`}
										disabled={salvar.isPending || remover.isPending}
									>
										<Pencil size={16} aria-hidden="true" /> Editar
									</button>
									<button
										onClick={() =>
											confirm(`Remover ${item.titulo}?`) &&
											remover.mutate({
												id: item.id,
												semestreId: semestre!.id,
											})
										}
										className={styles.remove}
										aria-label={`Remover ${item.titulo}`}
										disabled={salvar.isPending || remover.isPending}
									>
										<Trash2 size={16} aria-hidden="true" /> Remover
									</button>
								</footer>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function Status({
	label,
	ativo,
	cor = "sky",
}: {
	label: string;
	ativo: boolean;
	cor?: "sky" | "orange";
}) {
	return (
		<div className={styles.statusRow}>
			<dt>{label}</dt>
			<dd className={styles.statusValue} data-active={ativo} data-tone={cor}>
				{ativo ? (
					<CheckCircle2 size={16} aria-hidden="true" />
				) : (
					<Circle size={16} aria-hidden="true" />
				)}
				{ativo ? "Sim" : "Não"}
			</dd>
		</div>
	);
}
function Editor({
	form,
	setForm,
	responsaveis,
	salvar,
	cancelar,
	pendente,
}: {
	form: Formulario;
	setForm: (f: Formulario) => void;
	responsaveis: { id: string; nome: string }[];
	salvar: () => void;
	cancelar: () => void;
	pendente: boolean;
}) {
	const editor = useRef<HTMLElement>(null);
	useEffect(() => {
		editor.current?.scrollIntoView({ behavior: "instant", block: "start" });
		editor.current?.focus({ preventScroll: true });
	}, [form.id]);
	const set = <K extends keyof Formulario>(k: K, v: Formulario[K]) =>
		setForm({ ...form, [k]: v });
	return (
		<section
			ref={editor}
			tabIndex={-1}
			aria-label={form.id ? "Editar material" : "Novo material"}
			className={styles.editor}
		>
			<h2>{form.id ? "Editar material" : "Novo material"}</h2>
			<div className={styles.editorFields}>
				{(
					[
						["Curso", "curso", "text"],
						["Material", "titulo", "text"],
						["Data de entrega", "dataEntrega", "date"],
					] as const
				).map(([l, k, t]) => (
					<label key={k}>
						{l}
						<input
							type={t}
							value={form[k] as string}
							onChange={(e) => set(k, e.target.value)}
						/>
					</label>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
				{(
					[
						["revisado", "Revisado"],
						["precisaAjuste", "Precisa de ajuste"],
						["ajustado", "Ajustado"],
					] as const
				).map(([k, l]) => (
					<label key={k}>
						<input
							type="checkbox"
							checked={form[k]}
							onChange={(e) => set(k, e.target.checked)}
						/>{" "}
						{l}
					</label>
				))}
			</div>
			<div className="mt-4 flex flex-wrap gap-2">
				{responsaveis.map((r) => (
					<label key={r.id} className={styles.chip}>
						<input
							type="checkbox"
							checked={form.responsavelIds.includes(r.id)}
							onChange={(e) =>
								set(
									"responsavelIds",
									e.target.checked
										? [...form.responsavelIds, r.id]
										: form.responsavelIds.filter((id) => id !== r.id),
								)
							}
						/>{" "}
						{r.nome}
					</label>
				))}
			</div>
			<div className="mt-5 flex justify-end gap-2">
				<button
					onClick={cancelar}
					className={styles.secondary}
					disabled={pendente}
				>
					Cancelar
				</button>
				<button
					onClick={salvar}
					disabled={pendente || !form.curso || !form.titulo}
					className={styles.primary}
				>
					<CheckCircle2 className="mr-2 inline h-4 w-4" />
					{pendente ? "Salvando…" : "Salvar"}
				</button>
			</div>
		</section>
	);
}
