import { Gift, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import {
	campo,
	botao,
	botaoSecundario,
	botaoIcone,
	formulario,
	linha,
	confirmarExclusao,
	type AbaConectaProps,
} from "./suporte";

export function Itens({
	ativa,
	dados: data,
	atualizar,
	falha,
}: AbaConectaProps) {
	const [itemEditando, setItemEditando] = useState("");
	const [itemNome, setItemNome] = useState("");
	const [itemDescricao, setItemDescricao] = useState("");
	const [itemPontos, setItemPontos] = useState(1);
	const [itemAtivo, setItemAtivo] = useState(true);
	const criarItem = api.conecta.criarItem.useMutation({
		onSuccess: () => {
			limparItem();
			void atualizar("Item cadastrado.");
		},
		onError: falha,
	});
	const atualizarItem = api.conecta.atualizarItem.useMutation({
		onSuccess: () => {
			limparItem();
			void atualizar("Item atualizado.");
		},
		onError: falha,
	});
	const excluirItem = api.conecta.excluirItem.useMutation({
		onSuccess: () => void atualizar("Item removido do catálogo ativo."),
		onError: falha,
	});
	function limparItem() {
		setItemEditando("");
		setItemNome("");
		setItemDescricao("");
		setItemPontos(1);
		setItemAtivo(true);
	}
	const itens = data?.itens ?? [];

	if (!ativa || !data) return null;

	return (
		<section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<form
				data-tour="conecta-form-itens"
				onSubmit={(event) => {
					event.preventDefault();
					const input = {
						nome: itemNome,
						descricao: itemDescricao,
						pontos: itemPontos,
						ativo: itemAtivo,
					};
					itemEditando
						? atualizarItem.mutate({ id: itemEditando, ...input })
						: criarItem.mutate(input);
				}}
				className={formulario}
			>
				<div>
					<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
						{itemEditando ? "Editar item" : "Novo item"}
					</h2>
					<p className="text-sm text-[var(--nexus-muted)]">
						Catálogo geral, disponível em todos os semestres.
					</p>
				</div>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Nome
					<input
						required
						maxLength={160}
						className={`${campo} mt-1`}
						value={itemNome}
						onChange={(event) => setItemNome(event.target.value)}
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Descrição
					<input
						maxLength={500}
						className={`${campo} mt-1`}
						value={itemDescricao}
						onChange={(event) => setItemDescricao(event.target.value)}
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Pontos por unidade
					<input
						required
						type="number"
						min={0}
						max={1000000}
						step={1}
						className={`${campo} mt-1`}
						value={itemPontos}
						onChange={(event) => setItemPontos(Number(event.target.value))}
					/>
				</label>
				<label className="flex items-center gap-2 text-sm font-semibold text-[var(--nexus-ink)]">
					<input
						type="checkbox"
						checked={itemAtivo}
						onChange={(event) => setItemAtivo(event.target.checked)}
					/>{" "}
					Disponível para novas doações
				</label>
				<div className="flex flex-wrap gap-2">
					<button
						type="submit"
						className={botao}
						disabled={criarItem.isPending || atualizarItem.isPending}
					>
						<Plus size={16} /> {itemEditando ? "Salvar item" : "Cadastrar item"}
					</button>
					{itemEditando && (
						<button
							type="button"
							className={botaoSecundario}
							onClick={limparItem}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>
			<div className="min-w-0 space-y-3">
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					Catálogo de itens
				</h2>
				{itens.length === 0 && (
					<p className="text-sm text-[var(--nexus-muted)]">
						Nenhum item cadastrado.
					</p>
				)}
				<div className="max-h-[min(65dvh,40rem)] space-y-3 overflow-y-auto overscroll-contain pr-1">
					{itens.map((item) => (
						<article key={item.id} className={linha}>
							<Gift className="shrink-0 text-amber-700 dark:text-amber-300" />
							<div className="min-w-36 flex-1 wrap-anywhere">
								<h3 className="font-bold text-[var(--nexus-ink)]">
									{item.nome}
								</h3>
								<p className="text-sm text-[var(--nexus-muted)]">
									{item.pontos} pts/un. · {item.ativo ? "Ativo" : "Inativo"}
									{item.descricao && ` · ${item.descricao}`}
								</p>
							</div>
							<button
								type="button"
								aria-label={`Editar ${item.nome}`}
								className={botaoIcone}
								onClick={() => {
									setItemEditando(item.id);
									setItemNome(item.nome);
									setItemDescricao(item.descricao ?? "");
									setItemPontos(item.pontos);
									setItemAtivo(item.ativo);
								}}
							>
								<Pencil size={16} />
							</button>
							<button
								type="button"
								aria-label={`Remover ${item.nome}`}
								className={botaoIcone}
								onClick={() => {
									if (confirmarExclusao(item.nome))
										excluirItem.mutate({ id: item.id });
								}}
							>
								<Trash2 size={16} />
							</button>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
