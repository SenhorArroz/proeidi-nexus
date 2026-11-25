import { Check } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { botaoPrimario, campo, type Categoria, type Rascunho } from "./suporte";

export function FormularioItem({
	rascunho,
	setRascunho,
	editandoId,
	categorias,
	erroForm,
	salvando,
	carregandoCategorias,
	salvar,
	fecharForm,
}: {
	rascunho: Rascunho;
	setRascunho: Dispatch<SetStateAction<Rascunho>>;
	editandoId: string | null;
	categorias: Categoria[];
	erroForm: string;
	salvando: boolean;
	carregandoCategorias: boolean;
	salvar: (event: FormEvent<HTMLFormElement>) => void;
	fecharForm: () => void;
}) {
	return (
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
													? atual.categoriaIds.filter((id) => id !== cat.id)
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
						data-tour="estoque-cancelar"
					>
						Cancelar
					</button>
				</div>
			</form>
		</section>
	);
}
