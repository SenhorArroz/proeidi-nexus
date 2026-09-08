"use client";
import { HistoricoPresencas } from "./_components/historico-presencas";
import { useGerenciarPresencas } from "./_components/use-gerenciar-presencas";

import { Check, ClipboardCheck, Users } from "lucide-react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import {
	DiretoriaBackLink,
	DiretoriaPageIntro,
} from "~/app/_components/diretoria/page-intro";
import { PresenceGrid } from "~/app/_components/diretoria/presence-grid";

export default function GerenciarPresencas() {
	const {
		carregandoSemestres,
		carregandoTurmas,
		carregandoRegistros,
		semestre,
		setSemestreId,
		setTurmaId,
		semestres,
		turma,
		turmas,
		salvarPresencas,
		rascunhos,
		salvar,
		datasDeAula,
		setGrupoAtivo,
		grupoAtivo,
		alunos,
		monitores,
		professores,
		estadoExibido,
		alterarPresenca,
		registrosOrdenados,
		setData,
		remover,
	} = useGerenciarPresencas();

	if (carregandoSemestres || carregandoTurmas || carregandoRegistros)
		return (
			<main
				className="diretoria-page-canvas min-h-full px-4 py-4"
				aria-busy="true"
			>
				<div className="mx-auto max-w-6xl space-y-6">
					<DiretoriaBackLink />
					<DiretoriaPageIntro
						icon={ClipboardCheck}
						title="Gerenciar presenças"
						description="Controle oficial de alunos, monitores, professores e diretores docentes."
					/>
					<DataSkeleton rows={7} />
				</div>
			</main>
		);

	return (
		<main className="diretoria-page-canvas min-h-full px-4 py-6">
			<div className="mx-auto max-w-6xl space-y-6">
				<DiretoriaBackLink />
				<DiretoriaPageIntro
					icon={ClipboardCheck}
					title="Gerenciar presenças"
					description="Controle oficial de alunos, monitores, professores e diretores docentes."
				/>
				<section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 md:grid-cols-2">
					<label className="text-sm font-medium text-gray-600">
						Semestre
						<select
							value={semestre?.id ?? ""}
							onChange={(e) => {
								setSemestreId(e.target.value);
								setTurmaId("");
							}}
							className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
						>
							{semestres?.map((item) => (
								<option key={item.id} value={item.id}>
									{item.codigo}
								</option>
							))}
						</select>
					</label>
					<label className="text-sm font-medium text-gray-600">
						Turma
						<select
							value={turma?.id ?? ""}
							onChange={(e) => setTurmaId(e.target.value)}
							className="mt-1 block w-full rounded-lg border border-gray-200 p-2"
						>
							{turmas?.map((item) => (
								<option key={item.id} value={item.id}>
									{item.titulo}
								</option>
							))}
						</select>
					</label>
				</section>
				{turma ? (
					<>
						<div className="flex items-center justify-between gap-3 text-sm text-gray-600">
							<div className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								{turma.titulo}
							</div>
							<button
								onClick={() => void salvarPresencas()}
								disabled={!Object.keys(rascunhos).length || salvar.isPending}
								style={{ backgroundColor: turma.corDestaque }}
								className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
							>
								<Check className="h-4 w-4" />
								{salvar.isPending ? "Salvando..." : "Salvar presenças"}
							</button>
						</div>
						{!datasDeAula.length && (
							<p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
								Cadastre ao menos uma aula na turma para registrar presenças.
							</p>
						)}
						<div className="flex flex-wrap gap-2 border-b border-gray-200">
							<button
								onClick={() => setGrupoAtivo("ALUNOS")}
								className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "ALUNOS" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
							>
								Alunos ({alunos.length})
							</button>
							<button
								onClick={() => setGrupoAtivo("MONITORES")}
								className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "MONITORES" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
							>
								Monitores ({monitores.length})
							</button>
							<button
								onClick={() => setGrupoAtivo("PROFESSORES")}
								className={`border-b-2 px-4 py-2 text-sm font-semibold ${grupoAtivo === "PROFESSORES" ? "border-sky-600 text-sky-700" : "border-transparent text-gray-500 hover:text-gray-700"}`}
							>
								Professores e diretores ({professores.length})
							</button>
						</div>
						{grupoAtivo === "ALUNOS" ? (
							<PresenceGrid
								titulo="Alunos"
								pessoas={turma.alunos.map((item) => ({
									id: item.aluno.id,
									nome: item.aluno.nome,
									estado: "PRESENTE",
								}))}
								datas={datasDeAula}
								estadoNaData={(id, dia) => estadoExibido("ALUNOS", id, dia)}
								onAlterar={(id, dia, estado) =>
									alterarPresenca("ALUNOS", id, dia, estado)
								}
								cores={{
									presente: turma.cor,
									ausente: turma.corDestaque,
									justificado: turma.corFundo,
								}}
							/>
						) : grupoAtivo === "MONITORES" ? (
							<PresenceGrid
								titulo="Monitores"
								pessoas={turma.monitores.map((item) => ({
									id: item.user.id,
									nome: item.user.nome,
									role: item.user.role,
									estado: "PRESENTE",
								}))}
								datas={datasDeAula}
								estadoNaData={(id, dia) => estadoExibido("MONITORES", id, dia)}
								onAlterar={(id, dia, estado) =>
									alterarPresenca("MONITORES", id, dia, estado)
								}
								cores={{
									presente: turma.cor,
									ausente: turma.corDestaque,
									justificado: turma.corFundo,
								}}
							/>
						) : (
							<PresenceGrid
								titulo="Professores e diretores"
								pessoas={turma.professores.map((item) => ({
									id: item.user.id,
									nome: item.user.nome,
									role: item.user.role,
									estado: "PRESENTE",
								}))}
								datas={datasDeAula}
								estadoNaData={(id, dia) =>
									estadoExibido("PROFESSORES", id, dia)
								}
								onAlterar={(id, dia, estado) =>
									alterarPresenca("PROFESSORES", id, dia, estado)
								}
								cores={{
									presente: turma.cor,
									ausente: turma.corDestaque,
									justificado: turma.corFundo,
								}}
							/>
						)}
						<HistoricoPresencas
							registrosOrdenados={registrosOrdenados}
							setData={setData}
							remover={remover}
							turma={turma}
						/>
					</>
				) : (
					<p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
						Selecione um semestre e uma turma para gerenciar as presenças.
					</p>
				)}
			</div>
		</main>
	);
}
