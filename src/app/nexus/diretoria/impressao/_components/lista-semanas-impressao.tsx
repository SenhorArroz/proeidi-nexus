"use client";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";
import styles from ".././impressao.module.css";
import { StatusButton } from "./status-button";
import { useControleImpressao } from "./use-controle-impressao";

type Estado = ReturnType<typeof useControleImpressao>;
type ListaSemanasImpressaoProps = {
	semanasVisiveis: NonNullable<Estado["semanasVisiveis"]>;
	salvarSemana: NonNullable<Estado["salvarSemana"]>;
	ocupado: NonNullable<Estado["ocupado"]>;
	semestre: Estado["semestre"];
	salvarStatus: NonNullable<Estado["salvarStatus"]>;
	formulario: Estado["formulario"];
	alternarStatus: NonNullable<Estado["alternarStatus"]>;
	abrirEdicao: NonNullable<Estado["abrirEdicao"]>;
	remover: NonNullable<Estado["remover"]>;
};

export function ListaSemanasImpressao({
	semanasVisiveis,
	salvarSemana,
	ocupado,
	semestre,
	salvarStatus,
	formulario,
	alternarStatus,
	abrirEdicao,
	remover,
}: ListaSemanasImpressaoProps) {
	return (
		<div
			className={`view-diretoria-impressao-lista-semanas-impressao ${styles.weeks}`}
		>
			{semanasVisiveis.map((semana) => (
				<section
					key={semana.id}
					className={styles.week}
					aria-label={`Aula ${semana.numero}`}
				>
					<header className={styles.weekHeader}>
						<div className={styles.weekTitle}>
							<span className={styles.weekIcon}>
								<CalendarDays size={22} />
							</span>
							<div>
								<h2>Aula {semana.numero}</h2>
								<p>
									{semana.dataAula
										? semana.dataAula.toLocaleDateString("pt-BR")
										: "Data da aula a definir"}{" "}
									· {semana.apostilas.length} apostila(s)
								</p>
							</div>
						</div>
						<label className={styles.lessonCheck}>
							<input
								type="checkbox"
								checked={semana.aulaRealizada}
								disabled={salvarSemana.isPending || ocupado}
								onChange={(evento) =>
									salvarSemana.mutate({
										semestreId: semestre!.id,
										numero: semana.numero,
										dataAula: semana.dataAula,
										aulaRealizada: evento.target.checked,
									})
								}
							/>
							Aula realizada
						</label>
					</header>
					<div className={styles.columns} aria-hidden="true">
						<span>Apostila / curso</span>
						<span>Responsáveis</span>
						<span>Entrega</span>
						<span>Impressos / meta</span>
						<span>Preparação e impressão</span>
						<span>Ações</span>
					</div>
					{semana.apostilas.map((apostila) => {
						const status =
							apostila.qtdAlvo === 0
								? "Meta a definir"
								: apostila.qtdImpressa >= apostila.qtdAlvo
									? "Meta atingida"
									: apostila.qtdImpressa
										? "Em andamento"
										: "Pendente";
						const pendente =
							salvarStatus.isPending &&
							salvarStatus.variables?.id === apostila.id;
						return (
							<article
								key={apostila.id}
								className={styles.row}
								aria-label={apostila.titulo}
							>
								<div className={styles.identity}>
									<h3>{apostila.titulo}</h3>
									<p>{apostila.curso}</p>
								</div>
								<div className={styles.people}>
									<span className={styles.mobileLabel}>Responsáveis</span>
									<div className={styles.chips}>
										{apostila.responsaveis.length ? (
											apostila.responsaveis.map((item) => (
												<span key={item.userId} className={styles.chip}>
													{item.user.nome}
												</span>
											))
										) : (
											<span className={styles.unassigned}>Sem responsável</span>
										)}
									</div>
								</div>
								<div className={styles.delivery}>
									<span className={styles.mobileLabel}>Entrega</span>
									<span>
										{apostila.dataEntrega ? (
											<time
												dateTime={apostila.dataEntrega
													.toISOString()
													.slice(0, 10)}
											>
												{apostila.dataEntrega.toLocaleDateString("pt-BR")}
											</time>
										) : (
											"A definir"
										)}
									</span>
								</div>
								<div className={styles.quantity}>
									<span className={styles.mobileLabel}>Impressos / meta</span>
									<strong>
										{apostila.qtdImpressa} <span>/ {apostila.qtdAlvo}</span>
									</strong>
									<span className={styles.quantityStatus}>{status}</span>
								</div>
								<div className={styles.statusControls}>
									<StatusButton
										label="Pronta"
										checked={apostila.pronta}
										disabled={ocupado || salvarSemana.isPending || !!formulario}
										busy={pendente}
										onClick={() => alternarStatus(semana, apostila, "pronta")}
									/>
									<StatusButton
										label="Impressa"
										checked={apostila.impressa}
										disabled={ocupado || salvarSemana.isPending || !!formulario}
										busy={pendente}
										onClick={() => alternarStatus(semana, apostila, "impressa")}
									/>
								</div>
								<div className={styles.rowActions}>
									<button
										type="button"
										className={styles.edit}
										disabled={ocupado}
										onClick={() => abrirEdicao(semana, apostila)}
										aria-label={`Editar ${apostila.titulo}`}
									>
										<Pencil size={17} />
										<span>Editar</span>
									</button>
									<button
										type="button"
										className={styles.remove}
										disabled={ocupado}
										onClick={() =>
											confirm(`Remover ${apostila.titulo}?`) &&
											remover.mutate({
												id: apostila.id,
												semestreId: semestre!.id,
											})
										}
										aria-label={`Remover ${apostila.titulo}`}
									>
										<Trash2 size={17} />
										<span>Remover</span>
									</button>
								</div>
							</article>
						);
					})}
					{!semana.apostilas.length && (
						<p className={styles.weekEmpty}>Nenhuma apostila nesta aula.</p>
					)}
				</section>
			))}
		</div>
	);
}
