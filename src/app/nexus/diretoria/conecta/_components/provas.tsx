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

export function Provas({
	ativa,
	dados: data,
	atualizar,
	falha,
	semestreId,
}: AbaConectaProps & { semestreId: string }) {
	const [provaEditando, setProvaEditando] = useState("");
	const [provaNome, setProvaNome] = useState("");
	const [provaDescricao, setProvaDescricao] = useState("");
	const [provaEquipeId, setProvaEquipeId] = useState("");
	const [provaPontos, setProvaPontos] = useState(0);
	const criarProva = api.conecta.criarProva.useMutation({
		onSuccess: () => {
			limparProva();
			void atualizar("Pontuação registrada.");
		},
		onError: falha,
	});
	const atualizarProva = api.conecta.atualizarProva.useMutation({
		onSuccess: () => {
			limparProva();
			void atualizar("Pontuação atualizada.");
		},
		onError: falha,
	});
	const excluirProva = api.conecta.excluirProva.useMutation({
		onSuccess: () => void atualizar("Pontuação excluída."),
		onError: falha,
	});
	function limparProva() {
		setProvaEditando("");
		setProvaNome("");
		setProvaDescricao("");
		setProvaEquipeId("");
		setProvaPontos(0);
	}
	const equipes = data?.equipes ?? [];

	if (!ativa || !data) return null;

	return (
		<section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<form
				data-tour="conecta-form-provas"
				onSubmit={(event) => {
					event.preventDefault();
					const input = {
						semestreId,
						equipeId: provaEquipeId,
						nome: provaNome,
						descricao: provaDescricao,
						pontos: provaPontos,
					};
					provaEditando
						? atualizarProva.mutate({ id: provaEditando, ...input })
						: criarProva.mutate(input);
				}}
				className={formulario}
			>
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					{provaEditando ? "Editar pontuação" : "Lançar prova ou apresentação"}
				</h2>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Nome da atividade
					<input
						required
						maxLength={160}
						className={`${campo} mt-1`}
						value={provaNome}
						onChange={(event) => setProvaNome(event.target.value)}
						placeholder="Ex.: Apresentação final"
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Equipe
					<select
						required
						className={`${campo} mt-1`}
						value={provaEquipeId}
						onChange={(event) => setProvaEquipeId(event.target.value)}
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
					Descrição
					<input
						maxLength={500}
						className={`${campo} mt-1`}
						value={provaDescricao}
						onChange={(event) => setProvaDescricao(event.target.value)}
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Pontos
					<input
						required
						type="number"
						min={0}
						max={1000000}
						step={1}
						className={`${campo} mt-1`}
						value={provaPontos}
						onChange={(event) => setProvaPontos(Number(event.target.value))}
					/>
				</label>
				<p className="text-xs text-[var(--nexus-muted)]">
					A pontuação de provas e apresentações entra integralmente no ranking,
					sem peso por pessoas.
				</p>
				<div className="flex flex-wrap gap-2">
					<button
						type="submit"
						className={botao}
						disabled={
							!equipes.length ||
							criarProva.isPending ||
							atualizarProva.isPending
						}
					>
						<Plus size={16} />{" "}
						{provaEditando ? "Salvar pontuação" : "Lançar pontos"}
					</button>
					{provaEditando && (
						<button
							type="button"
							className={botaoSecundario}
							onClick={limparProva}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>
			<div className="space-y-3">
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					Resultados do semestre
				</h2>
				{data.provas.length === 0 && (
					<p className="text-sm text-[var(--nexus-muted)]">
						Nenhum resultado lançado.
					</p>
				)}
				{data.provas.map((prova) => (
					<article key={prova.id} className={linha}>
						<div className="min-w-36 flex-1 wrap-anywhere">
							<h3 className="font-bold text-[var(--nexus-ink)]">
								{prova.nome}
							</h3>
							<p className="text-sm text-[var(--nexus-muted)]">
								{equipes.find((equipe) => equipe.id === prova.equipeId)?.nome ??
									"Equipe removida"}
								{prova.descricao && ` · ${prova.descricao}`}
							</p>
							<p className="mt-1 text-sm font-bold text-sky-800 dark:text-sky-300">
								{pontos(prova.pontos)} pts
							</p>
						</div>
						<button
							type="button"
							aria-label={`Editar ${prova.nome}`}
							className={botaoIcone}
							onClick={() => {
								setProvaEditando(prova.id);
								setProvaNome(prova.nome);
								setProvaDescricao(prova.descricao ?? "");
								setProvaEquipeId(prova.equipeId ?? "");
								setProvaPontos(prova.pontos);
							}}
						>
							<Pencil size={16} />
						</button>
						<button
							type="button"
							aria-label={`Excluir ${prova.nome}`}
							className={botaoIcone}
							onClick={() => {
								if (confirmarExclusao(prova.nome))
									excluirProva.mutate({ id: prova.id });
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
