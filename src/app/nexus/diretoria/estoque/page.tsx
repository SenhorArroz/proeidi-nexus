"use client";

import { Boxes, Plus, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { api } from "~/trpc/react";
import { CardItem } from "./_components/card-item";
import { CategoriasEstoque } from "./_components/categorias-estoque";
import { FiltrosEstoque } from "./_components/filtros-estoque";
import { FormularioItem } from "./_components/formulario-item";
import { botaoPrimario, type Item, type Rascunho } from "./_components/suporte";

const vazio: Rascunho = { nome: "", qtd: "", validade: "", categoriaIds: [] };

function dataLocal(valor: Date) {
	return new Date(valor).toISOString().slice(0, 10);
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
	const [erroForm, setErroForm] = useState("");
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
						data-tour="estoque-novo"
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
					<FormularioItem
						rascunho={rascunho}
						setRascunho={setRascunho}
						editandoId={editandoId}
						categorias={categorias}
						erroForm={erroForm}
						salvando={salvando}
						carregandoCategorias={carregandoCategorias}
						salvar={salvar}
						fecharForm={fecharForm}
					/>
				)}

				<FiltrosEstoque
					pesquisa={pesquisa}
					setPesquisa={setPesquisa}
					validade={validade}
					setValidade={setValidade}
					categoria={categoria}
					setCategoria={setCategoria}
					categorias={categorias}
					totalResultados={itensFiltrados.length}
				/>

				<CategoriasEstoque
					categorias={categorias}
					selecionarCategoria={(id) => {
						setRascunho((atual) => ({
							...atual,
							categoriaIds: [...new Set([...atual.categoriaIds, id])],
						}));
					}}
				/>

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
							<CardItem
								key={item.id}
								item={item}
								abrirEdicao={abrirEdicao}
								remover={remover}
								excluindo={excluir.isPending}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
