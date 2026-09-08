"use client";
import { Download, LoaderCircle, Plus, Search, Upload } from "lucide-react";
import styles from ".././impressao.module.css";
import { formularioVazio } from "./suporte";
import { useControleImpressao } from "./use-controle-impressao";

type Estado = ReturnType<typeof useControleImpressao>;
type AcoesImpressaoProps = {
	semestre: Estado["semestre"];
	ocupado: NonNullable<Estado["ocupado"]>;
	carregandoSemestres: NonNullable<Estado["carregandoSemestres"]>;
	setSemestreId: NonNullable<Estado["setSemestreId"]>;
	setFormulario: NonNullable<Estado["setFormulario"]>;
	setMensagem: NonNullable<Estado["setMensagem"]>;
	semestres: Estado["semestres"];
	busca: NonNullable<Estado["busca"]>;
	setBusca: NonNullable<Estado["setBusca"]>;
	erroConsulta: Estado["erroConsulta"];
	inputImportacao: NonNullable<Estado["inputImportacao"]>;
	importando: NonNullable<Estado["importando"]>;
	exportarModelo: NonNullable<Estado["exportarModelo"]>;
	semanas: Estado["semanas"];
};

export function AcoesImpressao({
	semestre,
	ocupado,
	carregandoSemestres,
	setSemestreId,
	setFormulario,
	setMensagem,
	semestres,
	busca,
	setBusca,
	erroConsulta,
	inputImportacao,
	importando,
	exportarModelo,
	semanas,
}: AcoesImpressaoProps) {
	return (
		<div
			className={`view-diretoria-impressao-acoes-impressao ${styles.toolbar}`}
		>
			<div className={styles.filters}>
				<label className={styles.semester}>
					Semestre
					<select
						value={semestre?.id ?? ""}
						disabled={ocupado || carregandoSemestres}
						onChange={(evento) => {
							setSemestreId(evento.target.value);
							setFormulario(null);
							setMensagem(null);
						}}
					>
						{!semestres?.length && <option value="">Selecione</option>}
						{semestres?.map((item) => (
							<option key={item.id} value={item.id}>
								{item.codigo}
							</option>
						))}
					</select>
				</label>
				<label className={styles.search}>
					<Search size={18} aria-hidden="true" />
					<span className="sr-only">Buscar apostila, curso ou responsável</span>
					<input
						type="search"
						value={busca}
						onChange={(evento) => setBusca(evento.target.value)}
						placeholder="Buscar apostila, curso ou responsável"
					/>
				</label>
			</div>
			<div className={styles.toolbarActions}>
				<button
					type="button"
					className={styles.secondary}
					disabled={ocupado || !semestre || !!erroConsulta}
					onClick={() => inputImportacao.current?.click()}
				>
					{importando ? (
						<LoaderCircle size={17} className={styles.spinner} />
					) : (
						<Upload size={17} />
					)}
					{importando ? "Importando…" : "Importar planilha"}
				</button>
				<button
					type="button"
					className={styles.secondary}
					onClick={() =>
						void exportarModelo().catch(() =>
							setMensagem("Não foi possível baixar o modelo. Tente novamente."),
						)
					}
				>
					<Download size={17} /> Baixar modelo
				</button>
				<button
					type="button"
					className={styles.primary}
					disabled={!semestre || ocupado || !!erroConsulta}
					onClick={() =>
						setFormulario(
							formularioVazio(Math.min((semanas?.at(-1)?.numero ?? 0) + 1, 99)),
						)
					}
				>
					<Plus size={18} /> Nova apostila
				</button>
			</div>
		</div>
	);
}
