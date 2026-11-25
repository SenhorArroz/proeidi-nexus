import { Plus } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import { botaoPrimario, campo, type Categoria } from "./suporte";

export function CategoriasEstoque({
	categorias,
	selecionarCategoria,
}: {
	categorias: Categoria[];
	selecionarCategoria: (id: string) => void;
}) {
	const utils = api.useUtils();
	const [novaCategoria, setNovaCategoria] = useState("");
	const [erroCategoria, setErroCategoria] = useState("");
	const criarCategoria = api.estoque.criarCategoria.useMutation({
		onSuccess: async (criada) => {
			await utils.estoque.listarCategorias.invalidate();
			setNovaCategoria("");
			setErroCategoria("");
			selecionarCategoria(criada.id);
		},
		onError: (e) => setErroCategoria(e.message),
	});

	return (
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
	);
}
