"use client";
import { Editor } from "./_components/editor";
import { ListaMateriaisAtualizacao } from "./_components/lista-materiais-atualizacao";
import { vazio } from "./_components/suporte";
import { useMateriaisAtualizacao } from "./_components/use-materiais-atualizacao";

import { Download, FilePenLine, Plus, Upload } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import styles from "./materiais.module.css";

export default function MateriaisAtualizacao() {
	const {
		input,
		importar,
		modelo,
		semestre,
		setSemestreId,
		setFormulario,
		setMensagem,
		semestres,
		mensagem,
		formulario,
		responsaveis,
		enviar,
		salvar,
		erroMateriais,
		erroSemestres,
		utils,
		isLoading,
		carregandoSemestres,
		materiais,
		editar,
		remover,
	} = useMateriaisAtualizacao();
	return (
		<div className={`diretoria-page-canvas min-h-full ${styles.page}`}>
			<div className={styles.content}>
				<DiretoriaBackLink />
				<input
					ref={input}
					type="file"
					accept=".xlsx,.xls"
					className="sr-only"
					onChange={(e) => void importar(e)}
				/>
				<DiretoriaPageIntro
					icon={FilePenLine}
					title="Atualização de materiais"
					description="Acompanhe a revisão e os ajustes necessários nos materiais de cada curso."
					actions={
						<div className="flex w-full flex-wrap gap-2 sm:w-auto">
							<button
								onClick={() => input.current?.click()}
								className={styles.secondary}
							>
								<Upload className="mr-2 inline h-4 w-4" />
								Importar
							</button>
							<button
								onClick={() => void modelo()}
								className={styles.secondary}
							>
								<Download className="mr-2 inline h-4 w-4" />
								Modelo
							</button>
						</div>
					}
				/>
				<div className={styles.toolbar}>
					<label className={styles.semester}>
						Semestre{" "}
						<select
							value={semestre?.id ?? ""}
							onChange={(e) => {
								setSemestreId(e.target.value);
								setFormulario(null);
								setMensagem(null);
							}}
						>
							{semestres?.map((s) => (
								<option key={s.id} value={s.id}>
									{s.codigo}
								</option>
							))}
						</select>
					</label>
					<button
						onClick={() => setFormulario(vazio())}
						className={styles.primary}
					>
						<Plus className="mr-2 inline h-4 w-4" />
						Novo material
					</button>
				</div>
				{mensagem && (
					<p role="status" className={styles.notice}>
						{mensagem}
					</p>
				)}
				{formulario && (
					<Editor
						form={formulario}
						setForm={setFormulario}
						responsaveis={responsaveis}
						salvar={enviar}
						cancelar={() => setFormulario(null)}
						pendente={salvar.isPending}
					/>
				)}
				{erroMateriais || erroSemestres ? (
					<section className={styles.empty} role="alert">
						<h2>Não foi possível carregar os materiais</h2>
						<p>Tente novamente para consultar os dados do semestre.</p>
						<button
							className={styles.secondary}
							onClick={() => {
								void utils.diretoria.semestres.list.invalidate();
								void utils.diretoria.materialAtualizacao.list.invalidate();
							}}
						>
							Tentar novamente
						</button>
					</section>
				) : isLoading || carregandoSemestres ? (
					<DataSkeleton cards={4} />
				) : !materiais?.length ? (
					<section className={styles.empty}>
						<h2>
							{semestre
								? "Nenhum material neste semestre"
								: "Nenhum semestre disponível"}
						</h2>
						<p>
							{semestre
								? "Cadastre um novo material ou importe uma planilha para começar."
								: "Cadastre um semestre na diretoria para organizar os materiais."}
						</p>
					</section>
				) : (
					<ListaMateriaisAtualizacao
						materiais={materiais}
						editar={editar}
						salvar={salvar}
						remover={remover}
						semestre={semestre}
					/>
				)}
			</div>
		</div>
	);
}
