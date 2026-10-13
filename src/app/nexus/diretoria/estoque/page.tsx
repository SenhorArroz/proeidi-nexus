"use client";

import {
	Boxes,
	CalendarDays,
	Check,
	Pencil,
	Plus,
	Search,
	Trash2,
	X,
} from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { api, type RouterOutputs } from "~/trpc/react";

type Item = RouterOutputs["estoque"]["listar"][number];
type Rascunho = {
	nome: string;
	qtd: string;
	validade: string;
	categoriaIds: string[];
};
const vazio: Rascunho = { nome: "", qtd: "", validade: "", categoriaIds: [] };
const campo =
	"min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus:border-sky-600 focus:ring-2 focus:ring-sky-100";
const botaoPrimario =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-bold text-white transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:opacity-50";

function dataLocal(valor: Date) {
	return new Date(valor).toISOString().slice(0, 10);
}

function dataLegivel(valor: Date) {
	return new Intl.DateTimeFormat("pt-BR", {
		timeZone: "UTC",
		day: "2-digit",
		month: "long",
		year: "numeric",
	}).format(new Date(valor));
}

export default function EstoqueDiretoria() {
	const utils = api.useUtils();
	const {
		data: itens = [],
		isLoading,
		error,
		refetch,
	} = api.estoque.listar.useQuery();
	const { data: categorias = [], isLoading: carregandoCategorias } =
		api.estoque.listarCategorias.useQuery();
	const [pesquisa, setPesquisa] = useState("");
	const [validade, setValidade] = useState("");
	const [categoria, setCategoria] = useState("");
	const [formAberto, setFormAberto] = useState(false);
	const [editandoId, setEditandoId] = useState<string | null>(null);
	const [rascunho, setRascunho] = useState<Rascunho>(vazio);
	const [novaCategoria, setNovaCategoria] = useState("");
	const [erroForm, setErroForm] = useState("");
	const [erroCategoria, setErroCategoria] = useState("");
	const [erroLista, setErroLista] = useState("");

	const atualizar = () =>
		Promise.all([
			utils.estoque.listar.invalidate(),
			utils.estoque.listarCategorias.invalidate(),
		]);
	const criar = api.estoque.criar.useMutation({
		onSuccess: async () => {
			await atualizar();
			fecharForm();
		},
		onError: (e) => setErroForm(e.message),
	});
	const editar = api.estoque.atualizar.useMutation({
		onSuccess: async () => {
			await atualizar();
			fecharForm();
		},
		onError: (e) => setErroForm(e.message),
	});
	const excluir = api.estoque.excluir.useMutation({
		onSuccess: async () => {
			await atualizar();
			setErroLista("");
		},
		onError: (e) => setErroLista(e.message),
	});
	const criarCategoria = api.estoque.criarCategoria.useMutation({
		onSuccess: async (criada) => {
			await utils.estoque.listarCategorias.invalidate();
			setNovaCategoria("");
			setErroCategoria("");
			setRascunho((atual) => ({
				...atual,
				categoriaIds: [...new Set([...atual.categoriaIds, criada.id])],
			}));
		},
		onError: (e) => setErroCategoria(e.message),
	});

	const itensFiltrados = useMemo(
		() =>
			itens.filter(
				(item) =>
					item.nome
						.toLocaleLowerCase("pt-BR")
						.includes(pesquisa.trim().toLocaleLowerCase("pt-BR")) &&
					(!validade || dataLocal(item.validade) === validade) &&
					(!categoria || item.categorias.some((cat) => cat.id === categoria)),
			),
		[itens, pesquisa, validade, categoria],
	);
	const total = itens.reduce((soma, item) => soma + item.qtd, 0);
	const salvando = criar.isPending || editar.isPending;

	function fecharForm() {
		setFormAberto(false);
		setEditandoId(null);
		setRascunho(vazio);
		setErroForm("");
	}

	function abrirEdicao(item: Item) {
		setEditandoId(item.id);
		setRascunho({
			nome: item.nome,
			qtd: String(item.qtd),
			validade: dataLocal(item.validade),
			categoriaIds: item.categorias.map((cat) => cat.id),
		});
		setErroForm("");
		setFormAberto(true);
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	function salvar(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const qtd = Number(rascunho.qtd);
		if (
			!rascunho.nome.trim() ||
			!Number.isSafeInteger(qtd) ||
			qtd < 0 ||
			!rascunho.validade ||
			rascunho.categoriaIds.length === 0
		) {
			setErroForm(
				"Preencha nome, quantidade válida, validade e ao menos uma categoria.",
			);
			return;
		}
		setErroForm("");
		const dados = {
			nome: rascunho.nome.trim(),
			qtd,
			validade: rascunho.validade,
			categoriaIds: rascunho.categoriaIds,
		};
		if (editandoId) editar.mutate({ id: editandoId, ...dados });
		else criar.mutate(dados);
	}

	function remover(item: Item) {
		if (window.confirm(`Excluir ${item.nome} do estoque?`))
			excluir.mutate({ id: item.id });
	}

	return (
		<div className="diretoria-page-canvas min-h-full w-full min-w-0 px-3 py-6 font-sans sm:px-4">
			<div className="mx-auto w-full max-w-5xl">
				<DiretoriaBackLink />
				<div className="mb-6">
					<DiretoriaPageIntro
						icon={Boxes}
						title="Estoque"
						description="Acompanhe itens, quantidades e prazos de validade."
						actions={
							<div className="rounded-2xl bg-white/15 px-5 py-3 text-white">
								<span className="block text-xs font-semibold text-sky-100">
									Quantidade total de itens
								</span>
								<strong
									className="block text-3xl font-black tabular-nums"
									aria-live="polite"
								>
									{isLoading ? "—" : total.toLocaleString("pt-BR")}
								</strong>
							</div>
						}
					/>
				</div>

				<div className="mb-5 flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm font-medium text-slate-600">
						{itens.length}{" "}
						{itens.length === 1 ? "item cadastrado" : "itens cadastrados"}
					</p>
					<button
						type="button"
						className={botaoPrimario}
						onClick={() => {
							if (formAberto) fecharForm();
							else {
								setRascunho(vazio);
								setFormAberto(true);
							}
						}}
					>
						{formAberto ? (
							<X className="h-4 w-4" />
						) : (
							<Plus className="h-4 w-4" />
						)}
						{formAberto ? "Cancelar" : "Novo item"}
					</button>
				</div>

				{formAberto && (
					<section
						className="mb-6 rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.08)] sm:p-6"
						aria-labelledby="titulo-form-estoque"
					>
						<h2
							id="titulo-form-estoque"
							className="text-lg font-extrabold text-slate-900"
						>
							{editandoId ? "Editar item" : "Cadastrar item"}
						</h2>
						<form onSubmit={salvar} className="mt-5 space-y-5">
							<div className="grid gap-4 sm:grid-cols-2">
								<label className="block text-sm font-semibold text-slate-800">
									Nome
									<input
										className={`${campo} mt-2`}
										maxLength={160}
										required
										value={rascunho.nome}
										onChange={(e) =>
											setRascunho({ ...rascunho, nome: e.target.value })
										}
										placeholder="Ex.: Papel A4"
									/>
								</label>
								<label className="block text-sm font-semibold text-slate-800">
									Quantidade
									<input
										className={`${campo} mt-2`}
										type="number"
										min="0"
										step="1"
										required
										value={rascunho.qtd}
										onChange={(e) =>
											setRascunho({ ...rascunho, qtd: e.target.value })
										}
										placeholder="0"
									/>
								</label>
								<label className="block text-sm font-semibold text-slate-800">
									Validade
									<input
										className={`${campo} mt-2`}
										type="date"
										required
										value={rascunho.validade}
										onChange={(e) =>
											setRascunho({ ...rascunho, validade: e.target.value })
										}
									/>
								</label>
							</div>
							<fieldset>
								<legend className="text-sm font-semibold text-slate-800">
									Categorias{" "}
									<span className="font-normal text-slate-500">
										(selecione uma ou mais)
									</span>
								</legend>
								<div className="mt-2 flex flex-wrap gap-2">
									{categorias.map((cat) => {
										const marcada = rascunho.categoriaIds.includes(cat.id);
										return (
											<label
												key={cat.id}
												className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-sky-600 ${marcada ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
											>
												<input
													className="sr-only"
													type="checkbox"
													checked={marcada}
													onChange={() =>
														setRascunho((atual) => ({
															...atual,
															categoriaIds: marcada
																? atual.categoriaIds.filter(
																		(id) => id !== cat.id,
																	)
																: [...atual.categoriaIds, cat.id],
														}))
													}
												/>
												{marcada && <Check className="h-4 w-4" />}
												{cat.nome}
											</label>
										);
									})}
									{categorias.length === 0 && (
										<p className="text-sm text-slate-600">
											Crie a primeira categoria para cadastrar um item.
										</p>
									)}
								</div>
							</fieldset>
							{erroForm && (
								<p role="alert" className="text-sm font-semibold text-red-700">
									{erroForm}
								</p>
							)}
							<div className="flex flex-wrap gap-2">
								<button
									className={botaoPrimario}
									type="submit"
									disabled={salvando || carregandoCategorias}
								>
									{salvando
										? "Salvando..."
										: editandoId
											? "Salvar alterações"
											: "Cadastrar item"}
								</button>
								<button
									type="button"
									className="min-h-11 rounded-xl px-4 text-sm font-semibold text-slate-600 hover:bg-slate-100"
									onClick={fecharForm}
								>
									Cancelar
								</button>
							</div>
						</form>
					</section>
				)}

				<section
					className="mb-6 rounded-2xl bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-5"
					aria-labelledby="titulo-filtros-estoque"
				>
					<div className="mb-4 flex flex-wrap items-center justify-between gap-3">
						<h2
							id="titulo-filtros-estoque"
							className="text-base font-extrabold text-slate-900"
						>
							Encontrar itens
						</h2>
						<span className="text-sm text-slate-500">
							{itensFiltrados.length}{" "}
							{itensFiltrados.length === 1 ? "resultado" : "resultados"}
						</span>
					</div>
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_12rem_12rem]">
						<label className="text-sm font-semibold text-slate-700">
							<span className="mb-1.5 block">Pesquisar por nome</span>
							<span className="relative block">
								<Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
								<input
									className={`${campo} pl-10`}
									type="search"
									value={pesquisa}
									onChange={(e) => setPesquisa(e.target.value)}
									placeholder="Nome do item"
								/>
							</span>
						</label>
						<label className="text-sm font-semibold text-slate-700">
							<span className="mb-1.5 block">Validade</span>
							<input
								className={campo}
								type="date"
								value={validade}
								onChange={(e) => setValidade(e.target.value)}
							/>
						</label>
						<label className="text-sm font-semibold text-slate-700">
							<span className="mb-1.5 block">Categoria</span>
							<select
								className={campo}
								value={categoria}
								onChange={(e) => setCategoria(e.target.value)}
							>
								<option value="">Todas</option>
								{categorias.map((cat) => (
									<option key={cat.id} value={cat.id}>
										{cat.nome}
									</option>
								))}
							</select>
						</label>
					</div>
					{(pesquisa || validade || categoria) && (
						<button
							type="button"
							className="mt-3 text-sm font-semibold text-sky-700 underline underline-offset-4 hover:text-sky-900"
							onClick={() => {
								setPesquisa("");
								setValidade("");
								setCategoria("");
							}}
						>
							Limpar filtros
						</button>
					)}
				</section>

				<section className="mb-6" aria-labelledby="titulo-categorias-estoque">
					<div className="mb-3 flex flex-wrap items-center justify-between gap-2">
						<h2
							id="titulo-categorias-estoque"
							className="text-base font-extrabold text-slate-900"
						>
							Categorias
						</h2>
						<span className="text-sm text-slate-500">
							{categorias.length} cadastradas
						</span>
					</div>
					<form
						className="flex flex-col gap-2 sm:flex-row"
						onSubmit={(e) => {
							e.preventDefault();
							if (novaCategoria.trim())
								criarCategoria.mutate({ nome: novaCategoria.trim() });
						}}
					>
						<label className="sr-only" htmlFor="nova-categoria-estoque">
							Nome da nova categoria
						</label>
						<input
							id="nova-categoria-estoque"
							className={`${campo} sm:max-w-sm`}
							value={novaCategoria}
							maxLength={160}
							onChange={(e) => setNovaCategoria(e.target.value)}
							placeholder="Nova categoria"
							required
						/>
						<button
							className={botaoPrimario}
							type="submit"
							disabled={criarCategoria.isPending || !novaCategoria.trim()}
						>
							<Plus className="h-4 w-4" />
							{criarCategoria.isPending ? "Criando..." : "Criar categoria"}
						</button>
					</form>
					{erroCategoria && (
						<p role="alert" className="mt-2 text-sm font-semibold text-red-700">
							{erroCategoria}
						</p>
					)}
				</section>

				{erroLista && (
					<p role="alert" className="mb-4 text-sm font-semibold text-red-700">
						{erroLista}
					</p>
				)}
				{isLoading ? (
					<DataSkeleton cards={4} />
				) : error ? (
					<div role="alert" className="rounded-2xl bg-red-50 p-6 text-red-900">
						<p className="font-bold">Não foi possível carregar o estoque.</p>
						<p className="mt-1 text-sm">{error.message}</p>
						<button
							type="button"
							className="mt-3 text-sm font-bold underline"
							onClick={() => void refetch()}
						>
							Tentar novamente
						</button>
					</div>
				) : itensFiltrados.length === 0 ? (
					<div className="rounded-2xl bg-white px-5 py-14 text-center text-slate-600">
						<Boxes className="mx-auto mb-3 h-8 w-8 text-sky-600" />
						<p className="font-bold text-slate-900">
							{itens.length === 0 ? "Estoque vazio" : "Nenhum item encontrado"}
						</p>
						<p className="mt-1 text-sm">
							{itens.length === 0
								? "Crie uma categoria e cadastre o primeiro item."
								: "Ajuste os filtros para encontrar outros itens."}
						</p>
					</div>
				) : (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{itensFiltrados.map((item) => (
							<article
								key={item.id}
								className="flex min-h-64 flex-col rounded-2xl bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.07)]"
							>
								<div className="flex items-start justify-between gap-3">
									<h3 className="min-w-0 break-words text-lg font-extrabold leading-snug text-slate-900">
										{item.nome}
									</h3>
									<div className="flex shrink-0 gap-1">
										<button
											type="button"
											className="grid h-9 w-9 place-items-center rounded-lg text-sky-800 hover:bg-sky-50 focus-visible:outline-2 focus-visible:outline-sky-600"
											aria-label={`Editar ${item.nome}`}
											onClick={() => abrirEdicao(item)}
										>
											<Pencil className="h-4 w-4" />
										</button>
										<button
											type="button"
											className="grid h-9 w-9 place-items-center rounded-lg text-red-800 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-red-700"
											aria-label={`Excluir ${item.nome}`}
											disabled={excluir.isPending}
											onClick={() => remover(item)}
										>
											<Trash2 className="h-4 w-4" />
										</button>
									</div>
								</div>
								<div className="my-auto py-6 text-center">
									<strong className="block text-5xl font-black tabular-nums tracking-[-0.03em] text-sky-700">
										{item.qtd.toLocaleString("pt-BR")}
									</strong>
									<span className="text-xs font-bold uppercase tracking-wide text-slate-500">
										unidades
									</span>
								</div>
								<div className="mt-auto border-t border-slate-100 pt-4">
									<p className="flex items-center gap-2 text-sm font-semibold text-slate-700">
										<CalendarDays className="h-4 w-4 text-orange-700" />
										Validade: {dataLegivel(item.validade)}
									</p>
									<div className="mt-3 flex flex-wrap gap-1.5">
										{item.categorias.map((cat) => (
											<span
												key={cat.id}
												className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800"
											>
												{cat.nome}
											</span>
										))}
									</div>
								</div>
							</article>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
