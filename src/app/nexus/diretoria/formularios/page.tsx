"use client";
import { AcoesFormulario } from "./_components/acoes-formulario";
import { CabecalhoFormulario } from "./_components/cabecalho-formulario";
import { ConfiguracoesFormulario } from "./_components/configuracoes-formulario";
import { PerguntaEditor } from "./_components/pergunta-editor";
import { useEditorFormulario } from "./_components/use-editor-formulario";

import { Plus } from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function EditorFormulario() {
	const {
		formularioId,
		setConfiguracoesAbertas,
		configuracoesAbertas,
		setAtivoId,
		ativoId,
		titulo,
		setTitulo,
		descricao,
		setDescricao,
		configuracao,
		setConfiguracao,
		limitarPorNavegador,
		modoResposta,
		setLimitarPorNavegador,
		setModoResposta,
		podeRestringirADiretoria,
		visibilidade,
		setVisibilidade,
		perguntas,
		atualizarPergunta,
		atualizarOpcao,
		removerOpcao,
		adicionarOpcao,
		duplicarPergunta,
		excluirPergunta,
		adicionarPergunta,
		carregandoFormulario,
		salvar,
		salvando,
		erroSalvar,
		formularioSalvo,
	} = useEditorFormulario();

	return (
		<div className="flex min-h-full w-full flex-col items-center overflow-x-clip  px-3 py-6 pb-32 font-sans sm:px-4 sm:py-10">
			<div className="w-full max-w-3xl">
				<BotaoVoltar
					href="/nexus/questionarios"
					label="Voltar para Questionários"
				/>
			</div>

			{/* Banner de topo (Mesmo estilo visual) */}
			<AcoesFormulario
				formularioId={formularioId}
				setConfiguracoesAbertas={setConfiguracoesAbertas}
				configuracoesAbertas={configuracoesAbertas}
			/>

			<div className="w-full min-w-0 max-w-3xl space-y-4">
				{/* Cabeçalho do Formulário */}
				<CabecalhoFormulario
					setAtivoId={setAtivoId}
					ativoId={ativoId}
					titulo={titulo}
					setTitulo={setTitulo}
					descricao={descricao}
					setDescricao={setDescricao}
				/>

				{configuracoesAbertas && (
					<ConfiguracoesFormulario
						configuracao={configuracao}
						setConfiguracao={setConfiguracao}
						limitarPorNavegador={limitarPorNavegador}
						modoResposta={modoResposta}
						setLimitarPorNavegador={setLimitarPorNavegador}
						setModoResposta={setModoResposta}
						podeRestringirADiretoria={podeRestringirADiretoria}
						visibilidade={visibilidade}
						setVisibilidade={setVisibilidade}
					/>
				)}

				{/* Lista de Perguntas */}
				{perguntas.map((pergunta) => {
					const isAtivo = ativoId === pergunta.id;

					return (
						<PerguntaEditor
							key={pergunta.id}
							pergunta={pergunta}
							setAtivoId={setAtivoId}
							isAtivo={isAtivo}
							atualizarPergunta={atualizarPergunta}
							atualizarOpcao={atualizarOpcao}
							configuracao={configuracao}
							removerOpcao={removerOpcao}
							adicionarOpcao={adicionarOpcao}
							duplicarPergunta={duplicarPergunta}
							excluirPergunta={excluirPergunta}
						/>
					);
				})}

				{/* Botão de Adicionar Pergunta (Usando o padrão do botão primary do painel) */}
				<div className="flex justify-center pt-4">
					<button
						onClick={adicionarPergunta}
						className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:text-sky-600 hover:border-sky-300 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all duration-200"
					>
						<div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center">
							<Plus className="w-4 h-4 text-sky-600" />
						</div>
						Adicionar pergunta
					</button>
				</div>
				{formularioId && carregandoFormulario && (
					<p className="rounded-xl bg-sky-50 p-3 text-sm text-sky-800">
						Carregando questionário…
					</p>
				)}
				<div className="sticky bottom-4 flex justify-end">
					<button
						onClick={salvar}
						disabled={
							salvando ||
							carregandoFormulario ||
							!titulo.trim() ||
							!perguntas.some((pergunta) => pergunta.titulo.trim())
						}
						className="min-h-11 w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 disabled:opacity-50 sm:w-auto"
					>
						{salvando
							? "Salvando…"
							: formularioId
								? "Salvar alterações"
								: "Publicar questionário"}
					</button>
				</div>
				{erroSalvar && (
					<p
						role="alert"
						className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
					>
						{erroSalvar.message}
					</p>
				)}
				{formularioSalvo && (
					<p
						role="status"
						className="rounded-xl bg-green-50 p-3 text-sm text-green-800"
					>
						{formularioId ? "Alterações salvas." : "Questionário publicado."}{" "}
						Link:{" "}
						<a
							className="font-bold underline"
							href={`/questionarios/${formularioSalvo.slug}`}
							target="_blank"
						>
							/questionarios/{formularioSalvo.slug}
						</a>
					</p>
				)}
			</div>
		</div>
	);
}
