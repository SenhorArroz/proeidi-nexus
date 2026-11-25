import { Search } from "lucide-react";
import { campo, type Categoria } from "./suporte";

export function FiltrosEstoque({
	pesquisa,
	setPesquisa,
	validade,
	setValidade,
	categoria,
	setCategoria,
	categorias,
	totalResultados,
}: {
	pesquisa: string;
	setPesquisa: (valor: string) => void;
	validade: string;
	setValidade: (valor: string) => void;
	categoria: string;
	setCategoria: (valor: string) => void;
	categorias: Categoria[];
	totalResultados: number;
}) {
	return (
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
					{totalResultados} {totalResultados === 1 ? "resultado" : "resultados"}
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
	);
}
