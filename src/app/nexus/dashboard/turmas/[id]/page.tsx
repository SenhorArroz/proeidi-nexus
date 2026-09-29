"use client";
import { AnotacoesView } from "./_components/anotacoes-view";
import { CabecalhoTurma } from "./_components/cabecalho-turma";
import { CalendarioAulas } from "./_components/calendario-aulas";
import { ConfirmacaoPresencaModal } from "./_components/confirmacao-presenca-modal";
import { EditarTurmaModal } from "./_components/editar-turma-modal";
import { InicioView } from "./_components/inicio-view";
import { MatrizPresencaView } from "./_components/matriz-presenca-view";
import { MateriaisView } from "./_components/materiais-view";
import { NavegacaoTurmaDesktop } from "./_components/navegacao-turma-desktop";
import { NavegacaoTurmaMobile } from "./_components/navegacao-turma-mobile";
import { useTurmaView } from "./_components/use-turma-view";

import { AlertTriangle, CalendarDays } from "lucide-react";

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export default function TurmaView() {
	const {
		carregandoTurma,
		detalhe,
		turma,
		fundoTurma,
		corDestaqueLegivel,
		corTextoDestaque,
		corTextoLegivel,
		corDescricaoLegivel,
		podeEditarTurma,
		menuRef,
		setMenuAberto,
		menuAberto,
		setEditando,
		corTituloLegivel,
		corDescricaoBannerLegivel,
		tab,
		turmaId,
		avisos,
		eventos,
		materiais,
		anotacoes,
		presencaAlunos,
		datasDeAula,
		estadoPresenca,
		alterarPresenca,
		salvarAlteracoesPresenca,
		temAlteracoesPresenca,
		carregandoPresencas,
		erroPresenca,
		salvarPresencas,
		presencaMonitores,
		presencaProfessores,
		confirmacaoPresenca,
		setConfirmacaoPresenca,
		mobileNavOpen,
		tabsDisponiveis,
		setTab,
		setMobileNavOpen,
		tabAtual,
		IconeTabAtual,
		editando,
		salvarTurma,
	} = useTurmaView();

	if (carregandoTurma) {
		return (
			<div className="flex h-full min-h-0 flex-col animate-pulse bg-slate-50">
				<div className="h-40 shrink-0 bg-sky-200" />
				<div className="flex-1 space-y-5 p-6">
					<div className="h-7 w-48 rounded-lg bg-slate-200" />
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="h-44 rounded-2xl bg-white" />
						<div className="h-44 rounded-2xl bg-white" />
					</div>
					<div className="h-36 rounded-2xl bg-white" />
				</div>
				<div className="h-16 shrink-0 border-t border-sky-100 bg-white" />
			</div>
		);
	}

	if (!detalhe) {
		return (
			<div className="grid h-full place-items-center bg-slate-50 p-6 text-center">
				<div>
					<AlertTriangle className="mx-auto h-8 w-8 text-orange-500" />
					<h1 className="mt-3 font-bold text-slate-800">Turma indisponível</h1>
					<p className="mt-1 text-sm text-slate-500">
						Não foi possível carregar esta turma ou você não possui acesso a
						ela.
					</p>
				</div>
			</div>
		);
	}

	const podeAcessarGestao = detalhe.role !== "MONITOR";

	return (
		<div
			className={`turma-tema flex h-full min-h-0 min-w-0 flex-col overflow-x-clip text-slate-900 ${turma.fonte === "SERIF" ? "font-serif" : turma.fonte === "MONO" ? "font-mono" : "font-sans"}`}
			style={
				{
					backgroundColor: fundoTurma,
					"--turma-destaque": corDestaqueLegivel,
					"--turma-destaque-text": corTextoDestaque,
					"--turma-texto": corTextoLegivel,
					"--turma-descricao": corDescricaoLegivel,
				} as React.CSSProperties
			}
		>
			{/* Header da turma */}
			<CabecalhoTurma
				turma={turma}
				podeEditarTurma={podeEditarTurma}
				menuRef={menuRef}
				setMenuAberto={setMenuAberto}
				menuAberto={menuAberto}
				setEditando={setEditando}
				corTituloLegivel={corTituloLegivel}
				corDescricaoBannerLegivel={corDescricaoBannerLegivel}
			/>

			{/* Conteúdo */}
			<div className="turma-tema__conteudo min-h-0 flex-1 overflow-y-auto">
				{tab === "inicio" && (
					<InicioView
						turma={turma}
						turmaId={turmaId}
						avisos={avisos}
						eventos={eventos}
					/>
				)}
				{tab === "materiais" && (
					<MateriaisView
						materiais={materiais}
						turmaId={turmaId}
						cor={corDestaqueLegivel}
						podeGerenciar={detalhe.role !== "MONITOR"}
					/>
				)}
				{podeAcessarGestao && tab === "anotacoes" && (
					<AnotacoesView
						anotacoes={anotacoes}
						turmaId={turmaId}
						cor={corDestaqueLegivel}
					/>
				)}
				{podeAcessarGestao && tab === "calendario" && (
					<div className="mx-auto w-full max-w-6xl min-w-0 px-3 py-5 sm:px-6 sm:py-6 lg:px-8">
						<div className="mb-4">
							<h3 className="turma-semantic-text text-base sm:text-lg font-bold flex items-center gap-2">
								<CalendarDays className="turma-semantic-accent w-5 h-5" />
								Calendário de aulas e eventos
							</h3>
							<p className="turma-semantic-description text-xs sm:text-sm mt-0.5">
								Acompanhe o cronograma de aulas, reposições e feriados do
								semestre.
							</p>
						</div>
						<CalendarioAulas eventos={eventos} cor={corDestaqueLegivel} />
					</div>
				)}
				{podeAcessarGestao && tab === "presenca-alunos" && (
					<MatrizPresencaView
						titulo="Presença de alunos"
						pessoas={presencaAlunos}
						datas={datasDeAula}
						estadoNaData={(id, data) => estadoPresenca("ALUNOS", id, data)}
						onAlterar={(id, data, estado) =>
							alterarPresenca("ALUNOS", id, data, estado)
						}
						cor={corDestaqueLegivel}
						onSalvar={() => void salvarAlteracoesPresenca()}
						temAlteracoes={temAlteracoesPresenca}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						carregando={carregandoPresencas}
						coresEstado={{
							presente: turma.cor,
							ausente: corDestaqueLegivel,
							justificado: "#b45309",
						}}
					/>
				)}
				{podeAcessarGestao && tab === "presenca-monitores" && (
					<MatrizPresencaView
						titulo="Presença de monitores"
						pessoas={presencaMonitores}
						datas={datasDeAula}
						estadoNaData={(id, data) => estadoPresenca("MONITORES", id, data)}
						onAlterar={(id, data, estado) =>
							alterarPresenca("MONITORES", id, data, estado)
						}
						cor={corDestaqueLegivel}
						onSalvar={() => void salvarAlteracoesPresenca()}
						temAlteracoes={temAlteracoesPresenca}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						carregando={carregandoPresencas}
						coresEstado={{
							presente: turma.cor,
							ausente: corDestaqueLegivel,
							justificado: "#b45309",
						}}
					/>
				)}
				{podeAcessarGestao && tab === "presenca-professores" && (
					<MatrizPresencaView
						titulo="Presença de professores"
						pessoas={presencaProfessores}
						datas={datasDeAula}
						estadoNaData={(id, data) => estadoPresenca("PROFESSORES", id, data)}
						onAlterar={(id, data, estado) =>
							alterarPresenca("PROFESSORES", id, data, estado)
						}
						cor={corDestaqueLegivel}
						onSalvar={() => void salvarAlteracoesPresenca()}
						temAlteracoes={temAlteracoesPresenca}
						erroSalvar={erroPresenca}
						salvando={salvarPresencas.isPending}
						carregando={carregandoPresencas}
						coresEstado={{
							presente: turma.cor,
							ausente: corDestaqueLegivel,
							justificado: "#b45309",
						}}
					/>
				)}
			</div>

			{podeAcessarGestao && confirmacaoPresenca && (
				<ConfirmacaoPresencaModal
					confirmacao={confirmacaoPresenca}
					onFechar={() => setConfirmacaoPresenca(null)}
				/>
			)}

			{/* Navegação de turmas: menu flutuante no celular */}
			<NavegacaoTurmaMobile
				mobileNavOpen={mobileNavOpen}
				tabs={tabsDisponiveis}
				tab={tab}
				setTab={setTab}
				setMobileNavOpen={setMobileNavOpen}
				turma={turma}
				corDestaqueLegivel={corDestaqueLegivel}
				corTextoDestaque={corTextoDestaque}
				tabAtual={tabAtual}
				IconeTabAtual={IconeTabAtual}
			/>

			{/* Bottom nav */}
			<NavegacaoTurmaDesktop tabs={tabsDisponiveis} tab={tab} setTab={setTab} />

			{/* Modal de edição */}
			{editando && podeEditarTurma && (
				<EditarTurmaModal
					turma={turma}
					onSalvar={salvarTurma}
					onFechar={() => setEditando(false)}
				/>
			)}
		</div>
	);
}
