import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
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

	if (!ativa || !data) return null;

	return (
		<section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
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
				<fieldset className="space-y-2">
					<legend className="mb-2 text-sm font-bold text-[var(--nexus-ink)]">
						Quantidade por item
					</legend>
					{itensDisponiveis.map((item) => (
						<label
							key={item.id}
							className="flex items-center gap-3 rounded-xl bg-[var(--nexus-surface-soft)] p-2 text-sm"
						>
							<span className="min-w-0 flex-1 font-semibold text-[var(--nexus-ink)]">
								{item.nome}{" "}
								<small className="text-[var(--nexus-muted)]">
									· {pontosOriginais.get(item.id) ?? item.pontos} pts/un.
								</small>
							</span>
							<span className="w-24 shrink-0">
								<input
									aria-label={`Quantidade de ${item.nome}`}
									type="number"
									min={0}
									max={100000}
									step={1}
									className={campo}
									value={quantidades[item.id] ?? 0}
									onChange={(event) =>
										setQuantidades((atual) => ({
											...atual,
											[item.id]: Number(event.target.value),
										}))
									}
								/>
							</span>
						</label>
					))}
					{itensDisponiveis.length === 0 && (
						<p className="text-sm text-[var(--nexus-muted)]">
							Ative um item no catálogo para registrar doações.
						</p>
					)}
				</fieldset>
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
				{data.doacoes.map((doacao) => (
					<article key={doacao.id} className={linha}>
						<div className="min-w-36 flex-1 wrap-anywhere">
							<h3 className="font-bold text-[var(--nexus-ink)]">
								{doacao.nomeDoador}
							</h3>
							<p className="text-sm text-[var(--nexus-muted)]">
								{equipes.find((equipe) => equipe.id === doacao.equipeId)?.nome}{" "}
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
										doacao.itens.map((item) => [item.itemId, item.quantidade]),
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
		</section>
	);
}
