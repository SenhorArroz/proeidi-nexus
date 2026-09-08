"use client";
import {
	type ConfiguracaoFormulario,
	type ModoResposta,
	type VisibilidadeFormulario,
} from "./suporte";
import { useEditorFormulario } from "./use-editor-formulario";

type Estado = ReturnType<typeof useEditorFormulario>;
type ConfiguracoesFormularioProps = {
	configuracao: NonNullable<Estado["configuracao"]>;
	setConfiguracao: NonNullable<Estado["setConfiguracao"]>;
	limitarPorNavegador: NonNullable<Estado["limitarPorNavegador"]>;
	modoResposta: NonNullable<Estado["modoResposta"]>;
	setLimitarPorNavegador: NonNullable<Estado["setLimitarPorNavegador"]>;
	setModoResposta: NonNullable<Estado["setModoResposta"]>;
	podeRestringirADiretoria: NonNullable<Estado["podeRestringirADiretoria"]>;
	visibilidade: NonNullable<Estado["visibilidade"]>;
	setVisibilidade: NonNullable<Estado["setVisibilidade"]>;
};

export function ConfiguracoesFormulario({
	configuracao,
	setConfiguracao,
	limitarPorNavegador,
	modoResposta,
	setLimitarPorNavegador,
	setModoResposta,
	podeRestringirADiretoria,
	visibilidade,
	setVisibilidade,
}: ConfiguracoesFormularioProps) {
	return (
		<section className="view-diretoria-formularios-configuracoes-formulario rounded-2xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
			<h2 className="font-extrabold text-slate-900">
				Configurações do questionário
			</h2>
			<div className="mt-4 grid gap-4 sm:grid-cols-2">
				{(
					[
						["corPrimaria", "Cor principal"],
						["corDestaque", "Cor de destaque"],
						["corFundo", "Cor do fundo"],
					] as const
				).map(([campo, rotulo]) => (
					<label key={campo} className="text-sm font-bold text-slate-800">
						{rotulo}
						<input
							type="color"
							value={configuracao[campo]}
							onChange={(event) =>
								setConfiguracao({
									...configuracao,
									[campo]: event.target.value,
								})
							}
							className="mt-2 block h-11 w-full cursor-pointer rounded-xl border border-sky-200 bg-white p-1"
						/>
					</label>
				))}
				<label className="text-sm font-bold text-slate-800">
					Fonte
					<select
						value={configuracao.fonte}
						onChange={(event) =>
							setConfiguracao({
								...configuracao,
								fonte: event.target.value as ConfiguracaoFormulario["fonte"],
							})
						}
						className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3"
					>
						<option value="SANS">Sem serifa</option>
						<option value="SERIF">Com serifa</option>
						<option value="MONO">Monoespaçada</option>
					</select>
				</label>
			</div>
			<div className="mt-5 space-y-3 border-t border-sky-100 pt-4">
				<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800">
					<span>Mostrar progresso ao responder</span>
					<input
						type="checkbox"
						checked={configuracao.mostrarProgresso}
						onChange={(event) =>
							setConfiguracao({
								...configuracao,
								mostrarProgresso: event.target.checked,
							})
						}
						className="h-5 w-5"
					/>
				</label>
				<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800">
					<span>Atribuir 1 ponto por questão correta</span>
					<input
						type="checkbox"
						checked={configuracao.atribuirPontuacao}
						onChange={(event) =>
							setConfiguracao({
								...configuracao,
								atribuirPontuacao: event.target.checked,
							})
						}
						className="h-5 w-5"
					/>
				</label>
				<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800">
					<span>Limitar a uma resposta por navegador</span>
					<input
						type="checkbox"
						checked={
							limitarPorNavegador || modoResposta === "IDENTIFICADO_POR_COOKIE"
						}
						disabled={modoResposta === "IDENTIFICADO_POR_COOKIE"}
						onChange={(event) => setLimitarPorNavegador(event.target.checked)}
						className="h-5 w-5"
					/>
				</label>
			</div>
			<label
				className="mt-4 block text-sm font-bold text-slate-800"
				htmlFor="modo-resposta"
			>
				Modo de resposta
			</label>
			<select
				id="modo-resposta"
				value={modoResposta}
				onChange={(event) =>
					setModoResposta(event.target.value as ModoResposta)
				}
				className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
			>
				<option value="ANONIMO">Anônima — várias respostas permitidas</option>
				<option value="IDENTIFICADO_POR_COOKIE">
					Identificada — uma resposta por navegador
				</option>
			</select>
			{podeRestringirADiretoria && (
				<>
					<label
						className="mt-4 block text-sm font-bold text-slate-800"
						htmlFor="visibilidade-questionario"
					>
						Quem pode ver este questionário na gestão
					</label>
					<select
						id="visibilidade-questionario"
						value={visibilidade}
						onChange={(event) =>
							setVisibilidade(event.target.value as VisibilidadeFormulario)
						}
						className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
					>
						<option value="COMPARTILHADO">
							Equipe — professores, diretores e coordenação
						</option>
						<option value="DIRETORIA">Somente Diretoria e coordenação</option>
					</select>
				</>
			)}
			{modoResposta === "IDENTIFICADO_POR_COOKIE" && (
				<p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-sky-800">
					A pessoa informará o nome e poderá responder uma vez por navegador.
				</p>
			)}
		</section>
	);
}
