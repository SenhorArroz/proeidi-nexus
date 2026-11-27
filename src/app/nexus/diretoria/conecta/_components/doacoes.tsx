import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api } from "~/trpc/react";
import {
	campo,
	botao,
	botaoSecundario,
	botaoIcone,
	formulario,
	linha,
	pontos,
	confirmarExclusao,
	type AbaConectaProps,
} from "./suporte";

export function Doacoes({
	ativa,
	dados: data,
	atualizar,
	falha,
	informarErro,
}: AbaConectaProps & { informarErro: (mensagem: string) => void }) {
	const [doacaoEditando, setDoacaoEditando] = useState("");
	const [doador, setDoador] = useState("");
	const [doacaoEquipeId, setDoacaoEquipeId] = useState("");
	const [doacaoDescricao, setDoacaoDescricao] = useState("");
	const [quantidades, setQuantidades] = useState<Record<string, number>>({});
	const [modalItemAberto, setModalItemAberto] = useState(false);
	const [itemSelecionadoId, setItemSelecionadoId] = useState("");
	const [quantidadeItem, setQuantidadeItem] = useState(1);
	const modalItemRef = useRef<HTMLDialogElement>(null);
	const seletorItemRef = useRef<HTMLSelectElement>(null);
	useEffect(() => {
		if (!modalItemAberto) return;
		modalItemRef.current?.showModal();
		seletorItemRef.current?.focus();
	}, [modalItemAberto]);
	const criarDoacao = api.conecta.criarDoacao.useMutation({
		onSuccess: () => {
			limparDoacao();
			void atualizar("Doação registrada.");
		},
		onError: falha,
	});
	const atualizarDoacao = api.conecta.atualizarDoacao.useMutation({
		onSuccess: () => {
			limparDoacao();
			void atualizar("Doação atualizada.");
		},
		onError: falha,
	});
	const excluirDoacao = api.conecta.excluirDoacao.useMutation({
		onSuccess: () => void atualizar("Doação excluída."),
		onError: falha,
	});
	function limparDoacao() {
		setDoacaoEditando("");
		setDoador("");
		setDoacaoEquipeId("");
		setDoacaoDescricao("");
		setQuantidades({});
		setModalItemAberto(false);
		setItemSelecionadoId("");
		setQuantidadeItem(1);
	}
	const equipes = data?.equipes ?? [];
	const itens = data?.itens ?? [];
	const doacaoOriginal = data?.doacoes.find(
		(doacao) => doacao.id === doacaoEditando,
	);
	const pontosOriginais = new Map(
		doacaoOriginal?.itens.map((item) => [item.itemId, item.pontosUnitarios]),
	);
	const itensDisponiveis = itens.filter(
		(item) => item.ativo || pontosOriginais.has(item.id),
	);
	const itensSelecionados = itensDisponiveis.filter(
		(item) => (quantidades[item.id] ?? 0) > 0,
	);
	const pontosTotais = itensSelecionados.reduce(
		(total, item) =>
			total +
			(quantidades[item.id] ?? 0) *
				(pontosOriginais.get(item.id) ?? item.pontos),
		0,
	);
	const itemDoModal = itens.find((item) => item.id === itemSelecionadoId);
	const itensParaAdicionar = itens.filter(
		(item) => item.ativo && !quantidades[item.id],
	);

	if (!ativa || !data) return null;

	return (
		<section className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<form
				data-tour="conecta-form-doacoes"
				onSubmit={(event) => {
					event.preventDefault();
					const input = {
						equipeId: doacaoEquipeId,
						nomeDoador: doador,
						descricao: doacaoDescricao,
						itens: itensDisponiveis
							.map(({ id }) => ({
								itemId: id,
								quantidade: quantidades[id] ?? 0,
							}))
							.filter(({ quantidade }) => quantidade > 0),
					};
					if (!input.itens.length) {
						informarErro("Informe a quantidade de pelo menos um item.");
						return;
					}
					doacaoEditando
						? atualizarDoacao.mutate({ id: doacaoEditando, ...input })
						: criarDoacao.mutate(input);
				}}
				className={formulario}
			>
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					{doacaoEditando ? "Editar doação" : "Registrar doação"}
				</h2>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Doador
					<input
						required
						maxLength={160}
						className={`${campo} mt-1`}
						value={doador}
						onChange={(event) => setDoador(event.target.value)}
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Equipe
					<select
						required
						className={`${campo} mt-1`}
						value={doacaoEquipeId}
						onChange={(event) => setDoacaoEquipeId(event.target.value)}
					>
						<option value="">Selecione</option>
						{equipes.map((equipe) => (
							<option key={equipe.id} value={equipe.id}>
								{equipe.nome}
							</option>
						))}
					</select>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Observação
					<input
						maxLength={500}
						className={`${campo} mt-1`}
						value={doacaoDescricao}
						onChange={(event) => setDoacaoDescricao(event.target.value)}
					/>
				</label>
				<div className="space-y-3">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<h3 className="text-sm font-bold text-[var(--nexus-ink)]">
							Itens da doação
						</h3>
						<button
							type="button"
							className={botaoSecundario}
							disabled={!itensParaAdicionar.length}
							onClick={() => {
								setItemSelecionadoId(itensParaAdicionar[0]?.id ?? "");
								setQuantidadeItem(1);
								setModalItemAberto(true);
							}}
						>
							<Plus size={16} /> Adicionar Item
						</button>
					</div>
					{itensSelecionados.length ? (
						<div className="max-h-[min(38dvh,20rem)] space-y-2 overflow-y-auto overscroll-contain pr-1">
							{itensSelecionados.map((item) => {
								const pontosUnitarios =
									pontosOriginais.get(item.id) ?? item.pontos;
								return (
									<div
										key={item.id}
										className="flex flex-wrap items-center gap-3 rounded-xl bg-[var(--nexus-surface-soft)] p-3 text-sm"
									>
										<div className="min-w-0 flex-1">
											<p className="font-semibold text-[var(--nexus-ink)]">
												{item.nome}
											</p>
											<p className="text-xs text-[var(--nexus-muted)]">
												{item.descricao ||
													`${pontosUnitarios} pontos por unidade`}
											</p>
										</div>
										<label className="w-24 shrink-0 text-xs font-semibold text-[var(--nexus-muted)]">
											Quantidade
											<input
												aria-label={`Quantidade de ${item.nome}`}
												type="number"
												min={1}
												max={100000}
												step={1}
												className={`${campo} mt-1`}
												value={quantidades[item.id] ?? 1}
												onChange={(event) =>
													setQuantidades((atual) => ({
														...atual,
														[item.id]: Math.max(1, Number(event.target.value)),
													}))
												}
											/>
										</label>
										<div className="w-24 shrink-0 text-right">
											<span className="block text-xs text-[var(--nexus-muted)]">
												Subtotal
											</span>
											<strong className="text-sky-800 dark:text-sky-300">
												{pontos((quantidades[item.id] ?? 1) * pontosUnitarios)}{" "}
												pts
											</strong>
										</div>
										<button
											type="button"
											className={botaoIcone}
											aria-label={`Remover ${item.nome} da doação`}
											onClick={() =>
												setQuantidades((atual) => {
													const proxima = { ...atual };
													delete proxima[item.id];
													return proxima;
												})
											}
										>
											<Trash2 size={16} />
										</button>
									</div>
								);
							})}
						</div>
					) : (
						<p className="rounded-xl bg-[var(--nexus-surface-soft)] p-3 text-sm text-[var(--nexus-muted)]">
							Selecione os itens recebidos para ver quantidades e pontos.
						</p>
					)}
					<div className="flex items-center justify-between border-t border-[var(--nexus-line)] pt-3 text-sm">
						<span className="font-semibold text-[var(--nexus-ink)]">
							Total da doação
						</span>
						<strong className="text-base text-sky-800 dark:text-sky-300">
							{pontos(pontosTotais)} pts
						</strong>
					</div>
					{!itensAtivosDisponiveis(itens) && (
						<p className="text-xs text-[var(--nexus-muted)]">
							Ative um item no catálogo para registrar novas doações.
						</p>
					)}
				</div>
				<p className="text-xs text-[var(--nexus-muted)]">
					O valor por unidade fica registrado na doação. Para o ranking, o total
					de doações da equipe é dividido pelo número de alunos da turma.
				</p>
				<div className="flex flex-wrap gap-2">
					<button
						type="submit"
						className={botao}
						disabled={
							!equipes.length ||
							!itensDisponiveis.length ||
							criarDoacao.isPending ||
							atualizarDoacao.isPending
						}
					>
						<Plus size={16} />{" "}
						{doacaoEditando ? "Salvar doação" : "Registrar doação"}
					</button>
					{doacaoEditando && (
						<button
							type="button"
							className={botaoSecundario}
							onClick={limparDoacao}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>
			<div className="space-y-3">
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					Doações do semestre
				</h2>
				{data.doacoes.length === 0 && (
					<p className="text-sm text-[var(--nexus-muted)]">
						Nenhuma doação registrada.
					</p>
				)}
				<div className="max-h-[min(65dvh,40rem)] space-y-3 overflow-y-auto overscroll-contain pr-1">
					{data.doacoes.map((doacao) => (
						<article key={doacao.id} className={linha}>
							<div className="min-w-36 flex-1 wrap-anywhere">
								<h3 className="font-bold text-[var(--nexus-ink)]">
									{doacao.nomeDoador}
								</h3>
								<p className="text-sm text-[var(--nexus-muted)]">
									{
										equipes.find((equipe) => equipe.id === doacao.equipeId)
											?.nome
									}{" "}
									·{" "}
									{doacao.itens
										.map((item) => `${item.quantidade}× ${item.item.nome}`)
										.join(", ")}
								</p>
								<p className="mt-1 text-sm font-bold text-sky-800 dark:text-sky-300">
									{pontos(doacao.pontosBrutos)} pts brutos
								</p>
							</div>
							<button
								type="button"
								aria-label={`Editar doação de ${doacao.nomeDoador}`}
								className={botaoIcone}
								onClick={() => {
									setDoacaoEditando(doacao.id);
									setDoador(doacao.nomeDoador);
									setDoacaoEquipeId(doacao.equipeId);
									setDoacaoDescricao(doacao.descricao ?? "");
									setQuantidades(
										Object.fromEntries(
											doacao.itens.map((item) => [
												item.itemId,
												item.quantidade,
											]),
										),
									);
								}}
							>
								<Pencil size={16} />
							</button>
							<button
								type="button"
								aria-label={`Excluir doação de ${doacao.nomeDoador}`}
								className={botaoIcone}
								onClick={() => {
									if (confirmarExclusao("esta doação"))
										excluirDoacao.mutate({ id: doacao.id });
								}}
							>
								<Trash2 size={16} />
							</button>
						</article>
					))}
				</div>
			</div>
			{modalItemAberto && (
				<dialog
					ref={modalItemRef}
					aria-labelledby="conecta-adicionar-item-titulo"
					className="m-auto max-h-[min(90dvh,40rem)] w-[calc(100%-1.5rem)] max-w-lg overflow-y-auto rounded-2xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-4 text-[var(--nexus-ink)] shadow-[0_24px_60px_rgba(15,23,42,.3)] backdrop:bg-slate-950/55 backdrop:backdrop-blur-[2px] sm:p-6"
					onCancel={(event) => {
						event.preventDefault();
						setModalItemAberto(false);
					}}
				>
					<div>
						<div className="mb-5 flex items-start justify-between gap-3">
							<div>
								<h2
									id="conecta-adicionar-item-titulo"
									className="text-lg font-extrabold text-[var(--nexus-ink)]"
								>
									Adicionar item
								</h2>
								<p className="mt-1 text-sm text-[var(--nexus-muted)]">
									Informe o item e a quantidade recebida.
								</p>
							</div>
							<button
								type="button"
								className={botaoIcone}
								aria-label="Fechar"
								onClick={() => setModalItemAberto(false)}
							>
								<X size={18} />
							</button>
						</div>
						{itensParaAdicionar.length ? (
							<div className="space-y-4">
								<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
									Item
									<select
										ref={seletorItemRef}
										className={`${campo} mt-1`}
										value={itemSelecionadoId}
										onChange={(event) =>
											setItemSelecionadoId(event.target.value)
										}
									>
										{itensParaAdicionar.map((item) => (
											<option key={item.id} value={item.id}>
												{item.nome}
											</option>
										))}
									</select>
								</label>
								{itemDoModal && (
									<div className="rounded-xl bg-[var(--nexus-surface-soft)] p-3 text-sm">
										<p className="font-bold text-[var(--nexus-ink)]">
											{itemDoModal.nome} · {pontos(itemDoModal.pontos)} pts/un.
										</p>
										<p className="mt-1 text-[var(--nexus-muted)]">
											{itemDoModal.descricao || "Item do catálogo de doações."}
										</p>
									</div>
								)}
								<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
									Quantidade
									<input
										className={`${campo} mt-1`}
										type="number"
										min={1}
										max={100000}
										step={1}
										value={quantidadeItem}
										onChange={(event) =>
											setQuantidadeItem(Math.max(1, Number(event.target.value)))
										}
									/>
								</label>
								<p className="text-sm text-[var(--nexus-muted)]">
									Subtotal:{" "}
									<strong className="text-sky-800 dark:text-sky-300">
										{pontos(quantidadeItem * (itemDoModal?.pontos ?? 0))} pts
									</strong>
								</p>
								<div className="flex flex-wrap justify-end gap-2">
									<button
										type="button"
										className={botaoSecundario}
										onClick={() => setModalItemAberto(false)}
									>
										Cancelar
									</button>
									<button
										type="button"
										className={botao}
										disabled={!itemDoModal}
										onClick={() => {
											if (!itemDoModal) return;
											setQuantidades((atual) => ({
												...atual,
												[itemDoModal.id]:
													(atual[itemDoModal.id] ?? 0) + quantidadeItem,
											}));
											setModalItemAberto(false);
										}}
									>
										<Plus size={16} /> Adicionar item
									</button>
								</div>
							</div>
						) : (
							<p className="text-sm text-[var(--nexus-muted)]">
								Todos os itens ativos já foram adicionados. Ajuste as
								quantidades na lista da doação.
							</p>
						)}
					</div>
				</dialog>
			)}
		</section>
	);
}

function itensAtivosDisponiveis(itens: { ativo: boolean }[]) {
	return itens.some((item) => item.ativo);
}
