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
	confirmarExclusao,
	type AbaConectaProps,
} from "./suporte";

export function Equipes({
	ativa,
	dados: data,
	atualizar,
	falha,
}: AbaConectaProps) {
	const [equipeEditando, setEquipeEditando] = useState("");
	const [turmaId, setTurmaId] = useState("");
	const [equipeNome, setEquipeNome] = useState("");
	const [tema, setTema] = useState("");
	const [corInicial, setCorInicial] = useState("#0284c7");
	const [corFinal, setCorFinal] = useState("#0284c7");
	const criarEquipe = api.conecta.criarEquipe.useMutation({
		onSuccess: () => {
			limparEquipe();
			void atualizar("Equipe cadastrada.");
		},
		onError: falha,
	});
	const atualizarEquipe = api.conecta.atualizarEquipe.useMutation({
		onSuccess: () => {
			limparEquipe();
			void atualizar("Equipe atualizada.");
		},
		onError: falha,
	});
	const excluirEquipe = api.conecta.excluirEquipe.useMutation({
		onSuccess: () => void atualizar("Equipe excluída."),
		onError: falha,
	});
	function limparEquipe() {
		setEquipeEditando("");
		setTurmaId("");
		setEquipeNome("");
		setTema("");
		setCorInicial("#0284c7");
		setCorFinal("#0284c7");
	}
	const equipes = data?.equipes ?? [];
	const turmasDisponiveis = (data?.turmas ?? []).filter(
		(turma) =>
			turma.id === turmaId ||
			!equipes.some((equipe) => equipe.turmaId === turma.id),
	);

	if (!ativa || !data) return null;

	return (
		<section className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<form
				data-tour="conecta-form-equipes"
				onSubmit={(event) => {
					event.preventDefault();
					const input = {
						turmaId,
						nome: equipeNome,
						tema,
						corInicial,
						corFinal,
					};
					equipeEditando
						? atualizarEquipe.mutate({ id: equipeEditando, ...input })
						: criarEquipe.mutate(input);
				}}
				className={formulario}
			>
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					{equipeEditando ? "Editar equipe" : "Cadastrar equipe"}
				</h2>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Turma do semestre
					<select
						required
						className={`${campo} mt-1`}
						value={turmaId}
						onChange={(event) => setTurmaId(event.target.value)}
					>
						<option value="">Selecione a turma</option>
						{turmasDisponiveis.map((turma) => (
							<option key={turma.id} value={turma.id}>
								{turma.titulo} · {turma.pessoas} alunos
							</option>
						))}
					</select>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Nome da equipe
					<input
						required
						maxLength={160}
						className={`${campo} mt-1`}
						value={equipeNome}
						onChange={(event) => setEquipeNome(event.target.value)}
					/>
				</label>
				<label className="block text-sm font-semibold text-[var(--nexus-ink)]">
					Tema
					<input
						required
						maxLength={160}
						className={`${campo} mt-1`}
						value={tema}
						onChange={(event) => setTema(event.target.value)}
					/>
				</label>
				<div className="grid grid-cols-2 gap-3">
					<label className="text-sm font-semibold text-[var(--nexus-ink)]">
						Cor inicial
						<input
							type="color"
							className="mt-1 h-11 w-full cursor-pointer rounded-lg"
							value={corInicial}
							onChange={(event) => setCorInicial(event.target.value)}
						/>
					</label>
					<label className="text-sm font-semibold text-[var(--nexus-ink)]">
						Cor final
						<input
							type="color"
							className="mt-1 h-11 w-full cursor-pointer rounded-lg"
							value={corFinal}
							onChange={(event) => setCorFinal(event.target.value)}
						/>
					</label>
				</div>
				<div
					role="img"
					className="h-10 rounded-xl"
					aria-label="Prévia das cores"
					style={{
						background: `linear-gradient(90deg, ${corInicial}, ${corFinal})`,
					}}
				/>
				<div className="flex flex-wrap gap-2">
					<button
						type="submit"
						className={botao}
						disabled={
							criarEquipe.isPending || atualizarEquipe.isPending || !turmaId
						}
					>
						<Plus size={16} />{" "}
						{equipeEditando ? "Salvar equipe" : "Criar equipe"}
					</button>
					{equipeEditando && (
						<button
							type="button"
							className={botaoSecundario}
							onClick={limparEquipe}
						>
							Cancelar
						</button>
					)}
				</div>
			</form>
			<div className="min-w-0 space-y-3">
				<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
					Equipes do semestre
				</h2>
				{equipes.length === 0 && (
					<p className="text-sm text-[var(--nexus-muted)]">
						Nenhuma equipe cadastrada.
					</p>
				)}
				<div className="max-h-[min(65dvh,40rem)] space-y-3 overflow-y-auto overscroll-contain pr-1">
					{equipes.map((equipe) => (
						<article key={equipe.id} className={linha}>
							<span
								className="h-12 w-12 shrink-0 rounded-xl"
								style={{
									background: `linear-gradient(135deg, ${equipe.corInicial}, ${equipe.corFinal})`,
								}}
							/>
							<div className="min-w-36 flex-1 wrap-anywhere">
								<h3 className="font-bold text-[var(--nexus-ink)]">
									{equipe.nome}
								</h3>
								<p className="text-sm text-[var(--nexus-muted)]">
									{equipe.tema} · {equipe.turma.titulo} · {equipe.pessoas}{" "}
									alunos
								</p>
							</div>
							<button
								type="button"
								aria-label={`Editar ${equipe.nome}`}
								className={botaoIcone}
								onClick={() => {
									setEquipeEditando(equipe.id);
									setTurmaId(equipe.turmaId);
									setEquipeNome(equipe.nome);
									setTema(equipe.tema);
									setCorInicial(equipe.corInicial);
									setCorFinal(equipe.corFinal);
								}}
							>
								<Pencil size={16} />
							</button>
							<button
								type="button"
								aria-label={`Excluir ${equipe.nome}`}
								className={botaoIcone}
								onClick={() => {
									if (confirmarExclusao(equipe.nome))
										excluirEquipe.mutate({ id: equipe.id });
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
