"use client";

import { Gift, Pencil, Plus, Trash2, Trophy } from "lucide-react";
import { useState } from "react";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { api, type RouterOutputs } from "~/trpc/react";

type Aba = "ranking" | "equipes" | "doacoes" | "provas" | "itens";
const abas: { id: Aba; label: string }[] = [
	{ id: "ranking", label: "Ranking" },
	{ id: "equipes", label: "Equipes" },
	{ id: "doacoes", label: "Doações" },
	{ id: "provas", label: "Provas e apresentações" },
	{ id: "itens", label: "Itens" },
];
const campo =
	"min-h-11 w-full rounded-xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] px-3 text-sm text-[var(--nexus-ink)] focus-visible:outline-2 focus-visible:outline-sky-600";
const botao =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-4 py-2 text-sm font-bold text-white hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-50";
const botaoSecundario =
	"inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--nexus-line)] px-4 py-2 text-sm font-semibold hover:bg-[var(--nexus-hover)]";
const botaoIcone = `${botaoSecundario} w-11 shrink-0 px-0`;
const formulario =
	"min-w-0 space-y-4 rounded-2xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-4 sm:p-5";
const linha =
	"flex flex-wrap items-start gap-2 rounded-xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-3 sm:p-4";
const formatoPontos = new Intl.NumberFormat("pt-BR", {
	maximumFractionDigits: 2,
});
const pontos = (valor: number) => formatoPontos.format(valor);

export default function ConectaPage() {
	const semestresQuery = api.diretoria.semestres.list.useQuery();
	const semestres = semestresQuery.data ?? [];
	const [semestreEscolhido, setSemestreEscolhido] = useState("");
	const [aba, setAba] = useState<Aba>("ranking");
	const semestreId =
		semestres.find((semestre) => semestre.id === semestreEscolhido)?.id ||
		semestres.find((semestre) => semestre.ativo)?.id ||
		semestres[0]?.id ||
		"";

	return (
		<div className="diretoria-page-canvas mx-auto w-full max-w-6xl space-y-5 px-3 py-4 text-[var(--nexus-ink)] sm:px-6 sm:py-5 dark:[&_.diretoria-back-link]:text-sky-300 max-sm:[&_div[class$=orb]]:opacity-25">
			<DiretoriaBackLink />
			<DiretoriaPageIntro
				icon={Trophy}
				title="Conecta View"
				description="Acompanhe a gincana e gerencie equipes, doações e provas por semestre."
			/>
			<div className="flex flex-wrap items-end justify-between gap-4 rounded-2xl border border-[var(--nexus-line)] bg-[var(--nexus-surface)] p-3 sm:p-4">
				<nav
					aria-label="Áreas do Conecta View"
					className="flex flex-wrap gap-1"
				>
					{abas.map((item) => (
						<button
							key={item.id}
							type="button"
							onClick={() => setAba(item.id)} data-tour={`conecta-${item.id}`}
							aria-current={aba === item.id ? "true" : undefined}
							className={`min-h-11 rounded-xl px-3 py-2 text-sm font-semibold ${aba === item.id ? "bg-sky-700 text-white" : "hover:bg-[var(--nexus-hover)]"}`}
						>
							{item.label}
						</button>
					))}
				</nav>
				<label className="w-full text-sm font-semibold sm:w-44">
					Semestre
					<select
						className={`${campo} mt-1`}
						value={semestreId}
						disabled={!semestres.length}
						onChange={(event) => setSemestreEscolhido(event.target.value)}
					>
						{semestres.length === 0 && <option value="">—</option>}
						{semestres.map((semestre) => (
							<option key={semestre.id} value={semestre.id}>
								{semestre.codigo}
								{semestre.ativo ? " · ativo" : ""}
							</option>
						))}
					</select>
				</label>
			</div>
			{semestresQuery.isPending ? (
				<p role="status">Carregando semestres…</p>
			) : semestresQuery.isError ? (
				<p role="alert">
					Não foi possível carregar os semestres. {semestresQuery.error.message}
				</p>
			) : semestreId ? (
				<ConectaSemestre key={semestreId} semestreId={semestreId} aba={aba} />
			) : (
				<p>Cadastre um semestre para começar.</p>
			)}
		</div>
	);
}

function ConectaSemestre({
	semestreId,
	aba,
}: {
	semestreId: string;
	aba: Aba;
}) {
	const utils = api.useUtils();
	const { data, isLoading, error } = api.conecta.dados.useQuery(
		{ semestreId },
		{ refetchInterval: 15000 },
	);
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");
	const [equipeEditando, setEquipeEditando] = useState("");
	const [turmaId, setTurmaId] = useState("");
	const [equipeNome, setEquipeNome] = useState("");
	const [tema, setTema] = useState("");
	const [corInicial, setCorInicial] = useState("#0284c7");
	const [corFinal, setCorFinal] = useState("#0284c7");
	const [itemEditando, setItemEditando] = useState("");
	const [itemNome, setItemNome] = useState("");
	const [itemDescricao, setItemDescricao] = useState("");
	const [itemPontos, setItemPontos] = useState(1);
	const [itemAtivo, setItemAtivo] = useState(true);
	const [doacaoEditando, setDoacaoEditando] = useState("");
	const [doador, setDoador] = useState("");
	const [doacaoEquipeId, setDoacaoEquipeId] = useState("");
	const [doacaoDescricao, setDoacaoDescricao] = useState("");
	const [quantidades, setQuantidades] = useState<Record<string, number>>({});
	const [provaEditando, setProvaEditando] = useState("");
	const [provaNome, setProvaNome] = useState("");
	const [provaDescricao, setProvaDescricao] = useState("");
	const [provaEquipeId, setProvaEquipeId] = useState("");
	const [provaPontos, setProvaPontos] = useState(0);

	const atualizar = async (mensagem: string) => {
		await utils.conecta.dados.invalidate();
		setErro("");
		setSucesso(mensagem);
	};
	const falha = (error: { message: string }) => {
		setSucesso("");
		setErro(error.message);
	};
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

	function limparEquipe() {
		setEquipeEditando("");
		setTurmaId("");
		setEquipeNome("");
		setTema("");
		setCorInicial("#0284c7");
		setCorFinal("#0284c7");
	}
	function limparItem() {
		setItemEditando("");
		setItemNome("");
		setItemDescricao("");
		setItemPontos(1);
		setItemAtivo(true);
	}
	function limparDoacao() {
		setDoacaoEditando("");
		setDoador("");
		setDoacaoEquipeId("");
		setDoacaoDescricao("");
		setQuantidades({});
	}
	function limparProva() {
		setProvaEditando("");
		setProvaNome("");
		setProvaDescricao("");
		setProvaEquipeId("");
		setProvaPontos(0);
	}
	const confirmarExclusao = (nome: string) =>
		window.confirm(`Excluir ${nome}?`);
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
	const turmasDisponiveis = (data?.turmas ?? []).filter(
		(turma) =>
			turma.id === turmaId ||
			!equipes.some((equipe) => equipe.turmaId === turma.id),
	);

	return (
		<div className="space-y-5">
			{(erro || error) && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800 dark:bg-red-950 dark:text-red-200"
				>
					{erro || error?.message}
				</p>
			)}
			{sucesso && (
				<p
					role="status"
					className="rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
				>
					{sucesso}
				</p>
			)}
			{isLoading && (
				<p role="status" className="py-8 text-[var(--nexus-muted)]">
					Carregando dados da gincana…
				</p>
			)}
			{data && aba === "ranking" && <Ranking equipes={equipes} />}
			{data && aba === "equipes" && (
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
					<div className="space-y-3">
						<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
							Equipes do semestre
						</h2>
						{equipes.length === 0 && (
							<p className="text-sm text-[var(--nexus-muted)]">
								Nenhuma equipe cadastrada.
							</p>
						)}
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
				</section>
			)}
			{data && aba === "itens" && (
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
								<Plus size={16} />{" "}
								{itemEditando ? "Salvar item" : "Cadastrar item"}
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
					<div className="space-y-3">
						<h2 className="text-lg font-extrabold text-[var(--nexus-ink)]">
							Catálogo de itens
						</h2>
						{itens.length === 0 && (
							<p className="text-sm text-[var(--nexus-muted)]">
								Nenhum item cadastrado.
							</p>
						)}
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
				</section>
			)}
			{data && aba === "doacoes" && (
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
								setErro("Informe a quantidade de pelo menos um item.");
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
							O valor por unidade fica registrado na doação. Para o ranking, o
							total de doações da equipe é dividido pelo número de alunos da
							turma.
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
				</section>
			)}
			{data && aba === "provas" && (
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
							{provaEditando
								? "Editar pontuação"
								: "Lançar prova ou apresentação"}
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
							A pontuação de provas e apresentações entra integralmente no
							ranking, sem peso por pessoas.
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
										{equipes.find((equipe) => equipe.id === prova.equipeId)
											?.nome ?? "Equipe removida"}
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
			)}
		</div>
	);
}

function Ranking({
	equipes,
}: {
	equipes: RouterOutputs["conecta"]["dados"]["equipes"];
}) {
	return (
		<section aria-labelledby="classificacao" className={formulario}>
			<div>
				<h2 id="classificacao" className="text-xl font-bold">
					Classificação do semestre
				</h2>
				<p className="mt-1 text-sm text-[var(--nexus-muted)]">
					Total = pontos da gincana + (pontos brutos das doações ÷ alunos
					vinculados à turma).
				</p>
			</div>
			{equipes.length === 0 ? (
				<p className="border-t border-[var(--nexus-line)] pt-4 text-sm text-[var(--nexus-muted)]">
					Cadastre uma equipe na aba Equipes para começar a classificação.
				</p>
			) : (
				<ol className="divide-y divide-[var(--nexus-line)] border-y border-[var(--nexus-line)]">
					{equipes.map((equipe, index) => (
						<li
							key={equipe.id}
							className="grid min-w-0 gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:items-center"
						>
							<div className="flex min-w-0 items-start gap-3">
								<div className="grid min-w-10 shrink-0 gap-1">
									<span className="rounded-lg bg-[var(--nexus-surface-soft)] px-2 py-1 text-center text-sm font-bold tabular-nums text-amber-800 dark:text-amber-300">
										{index + 1}º
									</span>
									<span
										aria-hidden="true"
										className="h-1 rounded-full"
										style={{
											background: `linear-gradient(90deg, ${equipe.corInicial}, ${equipe.corFinal})`,
										}}
									/>
								</div>
								<div className="min-w-0 wrap-anywhere">
									<h3 className="font-bold">{equipe.nome}</h3>
									<p className="text-sm text-[var(--nexus-muted)]">
										{equipe.turma.titulo} · {equipe.pessoas}{" "}
										{equipe.pessoas === 1 ? "aluno" : "alunos"}
									</p>
									<p className="text-sm text-[var(--nexus-muted)]">
										{equipe.tema}
									</p>
								</div>
							</div>
							<dl className="grid grid-cols-2 gap-x-3 gap-y-2 tabular-nums sm:grid-cols-4">
								<div>
									<dt className="text-sm text-[var(--nexus-muted)]">Gincana</dt>
									<dd className="font-semibold wrap-anywhere">
										{pontos(equipe.pontosProvas)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-[var(--nexus-muted)]">
										Doações brutas
									</dt>
									<dd className="font-semibold wrap-anywhere">
										{pontos(equipe.pontosBrutosDoacoes)}
									</dd>
								</div>
								<div>
									<dt className="text-sm text-[var(--nexus-muted)]">
										Doações por aluno
									</dt>
									<dd className="font-semibold wrap-anywhere">
										{equipe.pessoas > 0 ? pontos(equipe.pontosDoacoes) : "—"}
									</dd>
								</div>
								<div>
									<dt className="text-sm font-semibold">Total</dt>
									<dd className="text-lg font-bold wrap-anywhere text-sky-800 dark:text-sky-300">
										{pontos(equipe.pontos)}
									</dd>
								</div>
							</dl>
						</li>
					))}
				</ol>
			)}
			{equipes.some((equipe) => equipe.pessoas === 0) && (
				<p className="text-sm text-[var(--nexus-muted)]">
					Em turmas sem alunos vinculados, o total considera apenas os pontos da
					gincana.
				</p>
			)}
		</section>
	);
}
