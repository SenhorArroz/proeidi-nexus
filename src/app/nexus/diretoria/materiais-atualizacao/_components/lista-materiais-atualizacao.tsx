"use client";
import { CalendarDays, FilePenLine, Pencil, Trash2, Users } from "lucide-react";
import styles from ".././materiais.module.css";
import { Status } from "./status";
import { useMateriaisAtualizacao } from "./use-materiais-atualizacao";

type Estado = ReturnType<typeof useMateriaisAtualizacao>;
type ListaMateriaisAtualizacaoProps = {
	materiais: NonNullable<Estado["materiais"]>;
	editar: NonNullable<Estado["editar"]>;
	salvar: NonNullable<Estado["salvar"]>;
	remover: NonNullable<Estado["remover"]>;
	semestre: Estado["semestre"];
};

export function ListaMateriaisAtualizacao({
	materiais,
	editar,
	salvar,
	remover,
	semestre,
}: ListaMateriaisAtualizacaoProps) {
	return (
		<div
			className={`view-diretoria-materiais-atualizacao-lista-materiais-atualizacao ${styles.grid}`}
		>
			{materiais?.map((item) => (
				<article
					key={item.id}
					className={styles.card}
					aria-labelledby={`material-${item.id}`}
				>
					<header className={styles.cardHeader}>
						<span className={styles.materialIcon}>
							<FilePenLine size={20} aria-hidden="true" />
						</span>
						<div className={styles.identity}>
							<h2 id={`material-${item.id}`}>{item.titulo}</h2>
							<p>{item.curso}</p>
						</div>
					</header>
					<div className={styles.cardBody}>
						<div className={styles.people}>
							<p className={styles.label}>
								<Users size={16} aria-hidden="true" /> Responsáveis
							</p>
							<div className={styles.chips}>
								{item.responsaveis.length ? (
									item.responsaveis.map((r) => (
										<span key={r.userId} className={styles.chip}>
											{r.user.nome}
										</span>
									))
								) : (
									<span className={styles.unassigned}>Sem responsável</span>
								)}
							</div>
						</div>
						<div className={styles.delivery}>
							<span className={styles.label}>
								<CalendarDays size={16} aria-hidden="true" /> Entrega
							</span>
							<strong>
								{item.dataEntrega ? (
									<time dateTime={item.dataEntrega.toISOString().slice(0, 10)}>
										{item.dataEntrega.toLocaleDateString("pt-BR")}
									</time>
								) : (
									"A definir"
								)}
							</strong>
						</div>
						<dl className={styles.statusList}>
							<Status label="Revisado" ativo={item.revisado} />
							<Status
								label="Precisa de ajuste"
								ativo={item.precisaAjuste}
								cor="orange"
							/>
							<Status label="Ajustado" ativo={item.ajustado} />
						</dl>
					</div>
					<footer className={styles.cardActions}>
						<button
							onClick={() => editar(item)}
							className={styles.edit}
							aria-label={`Editar ${item.titulo}`}
							disabled={salvar.isPending || remover.isPending}
						>
							<Pencil size={16} aria-hidden="true" /> Editar
						</button>
						<button
							onClick={() =>
								confirm(`Remover ${item.titulo}?`) &&
								remover.mutate({
									id: item.id,
									semestreId: semestre!.id,
								})
							}
							className={styles.remove}
							aria-label={`Remover ${item.titulo}`}
							disabled={salvar.isPending || remover.isPending}
						>
							<Trash2 size={16} aria-hidden="true" /> Remover
						</button>
					</footer>
				</article>
			))}
		</div>
	);
}
