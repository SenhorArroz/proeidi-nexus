"use client";
import { AcoesImpressao } from "./_components/acoes-impressao";
import { Editor } from "./_components/editor";
import { ListaSemanasImpressao } from "./_components/lista-semanas-impressao";
import { useControleImpressao } from "./_components/use-controle-impressao";

import { FileText, Printer } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import styles from "./impressao.module.css";

export default function ControleImpressao() {
	const {
		inputImportacao,
		importar,
		ocupado,
		semestre,
		carregandoSemestres,
		setSemestreId,
		setFormulario,
		setMensagem,
		semestres,
		busca,
		setBusca,
		erroConsulta,
		importando,
		exportarModelo,
		semanas,
		mensagem,
		formulario,
		responsaveis,
		enviar,
		salvar,
		utils,
		isLoading,
		semanasVisiveis,
		salvarSemana,
		salvarStatus,
		alternarStatus,
		abrirEdicao,
		remover,
		filtro,
	} = useControleImpressao();

	return (
		<div className={styles.page}>
			<div className={styles.content}>
				<DiretoriaBackLink />
				<DiretoriaPageIntro
					icon={Printer}
					title="Controle de impressão"
					description="Organize as apostilas de cada aula e acompanhe a preparação e a impressão."
				/>
				<input
					ref={inputImportacao}
					type="file"
					accept=".xlsx,.xls"
					className="sr-only"
					aria-label="Selecionar planilha de impressão"
					onChange={(evento) => void importar(evento)}
					disabled={ocupado}
				/>
				<AcoesImpressao
					semestre={semestre}
					ocupado={ocupado}
					carregandoSemestres={carregandoSemestres}
					setSemestreId={setSemestreId}
					setFormulario={setFormulario}
					setMensagem={setMensagem}
					semestres={semestres}
					busca={busca}
					setBusca={setBusca}
					erroConsulta={erroConsulta}
					inputImportacao={inputImportacao}
					importando={importando}
					exportarModelo={exportarModelo}
					semanas={semanas}
				/>
				{mensagem && (
					<p role="status" className={styles.notice}>
						{mensagem}
					</p>
				)}
				{formulario && (
					<Editor
						formulario={formulario}
						setFormulario={setFormulario}
						responsaveis={responsaveis}
						onCancel={() => setFormulario(null)}
						onSave={enviar}
						salvando={salvar.isPending}
					/>
				)}
				{erroConsulta ? (
					<div role="alert" className={styles.empty}>
						<h2>Não foi possível carregar as apostilas</h2>
						<p>{erroConsulta.message}</p>
						<button
							className={styles.secondary}
							onClick={() => {
								void utils.diretoria.semestres.list.invalidate();
								void utils.diretoria.impressao.list.invalidate();
							}}
						>
							Tentar novamente
						</button>
					</div>
				) : carregandoSemestres || isLoading ? (
					<DataSkeleton cards={4} />
				) : semanasVisiveis.length ? (
					<ListaSemanasImpressao
						semanasVisiveis={semanasVisiveis}
						salvarSemana={salvarSemana}
						ocupado={ocupado}
						semestre={semestre}
						salvarStatus={salvarStatus}
						formulario={formulario}
						alternarStatus={alternarStatus}
						abrirEdicao={abrirEdicao}
						remover={remover}
					/>
				) : (
					<section className={styles.empty}>
						<FileText size={30} />
						<h2>
							{filtro
								? "Nenhuma apostila encontrada"
								: "Nenhuma apostila cadastrada"}
						</h2>
						<p>
							{filtro
								? "Tente outro título, curso ou responsável."
								: semestre
									? "Cadastre uma apostila ou importe sua planilha para começar."
									: "Cadastre um semestre na Diretoria para começar."}
						</p>
						{filtro && (
							<button className={styles.secondary} onClick={() => setBusca("")}>
								Limpar busca
							</button>
						)}
					</section>
				)}
			</div>
		</div>
	);
}
