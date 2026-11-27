import { ClipboardList, Gift, Trophy } from "lucide-react";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { RouterOutputs } from "~/trpc/react";
import styles from "./ranking.module.css";

type DadosConecta = RouterOutputs["conecta"]["dados"];
type Equipe = DadosConecta["equipes"][number];
type FormatarPontos = (valor: number) => string;

const lugaresPodio = [2, 1, 3] as const;
const limiteAtividades = 5;
const horarioAtividade = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "America/Sao_Paulo",
});

function cores(equipe: Equipe): CSSProperties {
	return {
		"--cor-equipe-inicial": equipe.corInicial,
		"--cor-equipe-final": equipe.corFinal,
	} as CSSProperties;
}

function PontuacaoDetalhada({
	equipe,
	formatarPontos,
}: {
	equipe: Equipe;
	formatarPontos: FormatarPontos;
}) {
	return (
		<dl className={styles.pontuacao}>
			<div>
				<dt>Gincana</dt>
				<dd>{formatarPontos(equipe.pontosProvas)}</dd>
			</div>
			<div>
				<dt>Doações brutas</dt>
				<dd>{formatarPontos(equipe.pontosBrutosDoacoes)}</dd>
			</div>
			<div>
				<dt>Doações por aluno</dt>
				<dd>
					{equipe.pessoas > 0 ? formatarPontos(equipe.pontosDoacoes) : "—"}
				</dd>
			</div>
		</dl>
	);
}

function DadosEquipe({ equipe }: { equipe: Equipe }) {
	return (
		<div className={styles.dadosEquipe}>
			<h3>{equipe.nome}</h3>
			<p>
				{equipe.turma.titulo} · {equipe.pessoas}{" "}
				{equipe.pessoas === 1 ? "aluno" : "alunos"}
			</p>
			<p>{equipe.tema}</p>
		</div>
	);
}

function Podio({
	lideres,
	formatarPontos,
}: {
	lideres: Equipe[];
	formatarPontos: FormatarPontos;
}) {
	const lista = useRef<HTMLUListElement>(null);
	const [lugarAtivo, setLugarAtivo] = useState<number | null>(null);

	useEffect(() => {
		if (lugarAtivo === null) return;

		const fecharComEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") setLugarAtivo(null);
		};
		const fecharFora = (event: PointerEvent) => {
			if (
				event.target instanceof Node &&
				!lista.current?.contains(event.target)
			) {
				setLugarAtivo(null);
			}
		};

		document.addEventListener("keydown", fecharComEscape);
		document.addEventListener("pointerdown", fecharFora);
		return () => {
			document.removeEventListener("keydown", fecharComEscape);
			document.removeEventListener("pointerdown", fecharFora);
		};
	}, [lugarAtivo]);

	const fecharLugar = (lugar: number) => {
		setLugarAtivo((atual) => (atual === lugar ? null : atual));
	};

	return (
		<ul ref={lista} className={styles.podio} aria-label="Pódio">
			{lugaresPodio.map((lugar) => {
				const equipe = lideres[lugar - 1];
				if (!equipe) return null;

				const aberto = lugarAtivo === lugar;
				const painelId = `conecta-podio-equipe-${lugar}`;
				const total = formatarPontos(equipe.pontos);

				return (
					<li
						key={equipe.id}
						data-lugar={lugar}
						style={cores(equipe)}
						onPointerEnter={(event) => {
							if (event.pointerType === "mouse") setLugarAtivo(lugar);
						}}
						onPointerLeave={(event) => {
							if (
								event.pointerType === "mouse" &&
								!event.currentTarget.querySelector("button:focus-visible")
							) {
								fecharLugar(lugar);
							}
						}}
					>
						<button
							type="button"
							className={styles.botaoPodio}
							aria-label={`${lugar}º lugar, ${equipe.nome}, ${total} pontos`}
							aria-expanded={aberto}
							aria-controls={painelId}
							onFocus={(event) => {
								if (event.currentTarget.matches(":focus-visible")) {
									setLugarAtivo(lugar);
								}
							}}
							onBlur={() => fecharLugar(lugar)}
							onClick={(event) => {
								const ativadoComMouse =
									event.nativeEvent instanceof PointerEvent &&
									event.nativeEvent.pointerType === "mouse";
								setLugarAtivo((atual) =>
									atual === lugar && !ativadoComMouse ? null : lugar,
								);
							}}
						>
							<span className={styles.lider}>
								<span className={styles.posicaoPodio}>{lugar}º</span>
								<span className={styles.nomeLider}>{equipe.nome}</span>
								<span className={styles.total}>
									{total} <small>pts</small>
								</span>
							</span>
							<span className={styles.degrau} aria-hidden="true" />
						</button>
						<div
							className={styles.painelPodio}
							id={painelId}
							data-aberto={aberto}
							inert={!aberto}
						>
							<div className={styles.detalheLider}>
								<DadosEquipe equipe={equipe} />
								<PontuacaoDetalhada
									equipe={equipe}
									formatarPontos={formatarPontos}
								/>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);
}

function AtividadesRecentes({
	dados,
	formatarPontos,
}: {
	dados: DadosConecta;
	formatarPontos: FormatarPontos;
}) {
	const equipesPorId = new Map(
		dados.equipes.map((equipe) => [equipe.id, equipe]),
	);
	const atividades = [
		...dados.doacoes.slice(0, limiteAtividades).map((doacao) => {
			const primeiroItem = doacao.itens[0]?.item.nome;
			return {
				tipo: "doacao" as const,
				id: doacao.id,
				nome: primeiroItem ? `Doação de ${primeiroItem}` : "Doação",
				outrosItens: doacao.itens.length - 1,
				equipe: equipesPorId.get(doacao.equipeId),
				pontos: doacao.pontosBrutos,
				data: doacao.createdAt,
			};
		}),
		...dados.provas.slice(0, limiteAtividades).map((prova) => ({
			tipo: "prova" as const,
			id: prova.id,
			nome: prova.nome,
			outrosItens: 0,
			equipe: prova.equipeId ? equipesPorId.get(prova.equipeId) : undefined,
			pontos: prova.pontos,
			data: prova.createdAt,
		})),
	]
		.sort((a, b) => b.data.getTime() - a.data.getTime())
		.slice(0, limiteAtividades);

	return (
		<section className={styles.painel} aria-labelledby="conecta-atividades">
			<header className={styles.cabecalhoPainel}>
				<h2 id="conecta-atividades">Atividades recentes</h2>
			</header>
			{atividades.length === 0 ? (
				<p className={styles.vazio}>Nenhuma doação ou prova registrada.</p>
			) : (
				<ol className={styles.atividades}>
					{atividades.map((atividade) => {
						const Icone = atividade.tipo === "doacao" ? Gift : ClipboardList;
						return (
							<li key={`${atividade.tipo}-${atividade.id}`}>
								<span className={styles.iconeAtividade} aria-hidden="true">
									<Icone size={16} />
								</span>
								<div>
									<p className={styles.tituloAtividade}>
										{atividade.nome}
										{atividade.outrosItens > 0 && ` +${atividade.outrosItens}`}
									</p>
									<p className={styles.metaAtividade}>
										{atividade.equipe && <span>{atividade.equipe.nome}</span>}
										<time dateTime={atividade.data.toISOString()}>
											{horarioAtividade.format(atividade.data)}
										</time>
									</p>
									<p className={styles.pontosAtividade}>
										+{formatarPontos(atividade.pontos)}{" "}
										{atividade.tipo === "doacao"
											? "pts brutos"
											: "pts de gincana"}
									</p>
								</div>
							</li>
						);
					})}
				</ol>
			)}
		</section>
	);
}

export function Ranking({
	dados,
	formatarPontos,
}: {
	dados: DadosConecta;
	formatarPontos: FormatarPontos;
}) {
	const formatarPontosArredondados = (valor: number) =>
		formatarPontos(Math.ceil(valor));
	const lideres = dados.equipes.slice(0, 3);
	const demais = dados.equipes.slice(3);

	return (
		<div className={styles.ranking}>
			<section className={styles.palco} aria-labelledby="classificacao">
				<div className={styles.tituloPalco}>
					<Trophy aria-hidden="true" />
					<h2 id="classificacao">Líderes da gincana</h2>
				</div>
				{lideres.length > 0 ? (
					<Podio
						lideres={lideres}
						formatarPontos={formatarPontosArredondados}
					/>
				) : (
					<p className={styles.vazio}>
						Cadastre uma equipe na aba Equipes para começar a classificação.
					</p>
				)}
			</section>

			<div className={styles.grade}>
				<section
					className={styles.painel}
					aria-labelledby="conecta-demais-equipes"
				>
					<header className={styles.cabecalhoPainel}>
						<h2 id="conecta-demais-equipes">Demais equipes</h2>
						{demais.length > 0 && <span>{demais.length}</span>}
					</header>
					{demais.length > 0 ? (
						<ol className={styles.equipes} start={4}>
							{demais.map((equipe, indice) => (
								<li
									key={equipe.id}
									className={styles.equipe}
									style={cores(equipe)}
								>
									<div className={styles.resumoEquipe}>
										<span className={styles.posicaoEquipe}>
											<span className="sr-only">Lugar </span>
											{indice + 4}º
										</span>
										<DadosEquipe equipe={equipe} />
										<p className={styles.total}>
											{formatarPontosArredondados(equipe.pontos)}{" "}
											<span>pts</span>
										</p>
									</div>
									<PontuacaoDetalhada
										equipe={equipe}
										formatarPontos={formatarPontosArredondados}
									/>
								</li>
							))}
						</ol>
					) : (
						<p className={styles.vazio}>
							{lideres.length > 0
								? "Todas as equipes deste semestre estão no pódio."
								: "Nenhuma equipe neste semestre."}
						</p>
					)}
					<div className={styles.regra}>
						<p>
							Total = pontos da gincana + (pontos brutos das doações ÷ alunos
							vinculados à turma).
						</p>
						{dados.equipes.some((equipe) => equipe.pessoas === 0) && (
							<p>
								Em turmas sem alunos vinculados, o total considera apenas os
								pontos da gincana.
							</p>
						)}
					</div>
				</section>
				<AtividadesRecentes
					dados={dados}
					formatarPontos={formatarPontosArredondados}
				/>
			</div>
		</div>
	);
}
