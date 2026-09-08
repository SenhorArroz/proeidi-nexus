"use client";
import { Check, Copy, GripVertical, Trash2, X } from "lucide-react";
import { IconeOpcao } from "./icone-opcao";
import type { Pergunta } from "./suporte";
import { TIPOS_PERGUNTA } from "./suporte";
import { useEditorFormulario } from "./use-editor-formulario";

type PerguntaEditorProps = {
	pergunta: Pergunta;
	setAtivoId: ReturnType<typeof useEditorFormulario>["setAtivoId"];
	isAtivo: boolean;
	atualizarPergunta: ReturnType<
		typeof useEditorFormulario
	>["atualizarPergunta"];
	atualizarOpcao: ReturnType<typeof useEditorFormulario>["atualizarOpcao"];
	configuracao: ReturnType<typeof useEditorFormulario>["configuracao"];
	removerOpcao: ReturnType<typeof useEditorFormulario>["removerOpcao"];
	adicionarOpcao: ReturnType<typeof useEditorFormulario>["adicionarOpcao"];
	duplicarPergunta: ReturnType<typeof useEditorFormulario>["duplicarPergunta"];
	excluirPergunta: ReturnType<typeof useEditorFormulario>["excluirPergunta"];
};
export function PerguntaEditor({
	pergunta,
	setAtivoId,
	isAtivo,
	atualizarPergunta,
	atualizarOpcao,
	configuracao,
	removerOpcao,
	adicionarOpcao,
	duplicarPergunta,
	excluirPergunta,
}: PerguntaEditorProps) {
	return (
		<div
			onClick={() => setAtivoId(pergunta.id)}
			className={`view-pergunta-editor ${`group relative flex min-w-0 rounded-2xl border bg-white transition-all duration-200 cursor-pointer ${
				isAtivo
					? "border-sky-300 shadow-md ring-4 ring-sky-50"
					: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
			}`}`}
		>
			{/* Drag handle sutil */}
			<div className="view-pergunta-editor flex w-7 shrink-0 flex-col items-center pt-4 text-gray-200 transition-colors group-hover:text-gray-400 sm:w-8 sm:pt-6">
				<GripVertical className="w-4 h-4" />
			</div>

			<div className="min-w-0 flex-1 p-4 pl-0 sm:p-6 sm:pl-0">
				{isAtivo ? (
					// MODO EDIÇÃO
					<div className="space-y-4">
						<div className="flex flex-col sm:flex-row gap-3">
							<input
								autoFocus
								type="text"
								value={pergunta.titulo}
								onChange={(e) =>
									atualizarPergunta(pergunta.id, "titulo", e.target.value)
								}
								placeholder="Sua pergunta"
								className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
							<div className="relative w-full sm:w-48 flex-shrink-0">
								<select
									value={pergunta.tipo}
									onChange={(e) =>
										atualizarPergunta(pergunta.id, "tipo", e.target.value)
									}
									className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-700 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors cursor-pointer"
								>
									{TIPOS_PERGUNTA.map((t) => (
										<option key={t.value} value={t.value}>
											{t.label}
										</option>
									))}
								</select>
								<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
									<svg className="fill-current h-4 w-4" viewBox="0 0 20 20">
										<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
									</svg>
								</div>
							</div>
						</div>

						<div className="space-y-2 pt-2">
							{(pergunta.tipo === "multiple_choice" ||
								pergunta.tipo === "checkbox") && (
								<>
									{pergunta.opcoes.map((opcao) => (
										<div
											key={opcao.id}
											className="group/opt grid min-w-0 grid-cols-[auto_minmax(0,1fr)_2.75rem] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto_2.75rem]"
										>
											<IconeOpcao
												tipo={pergunta.tipo}
												className="text-gray-300 flex-shrink-0"
											/>
											<input
												type="text"
												value={opcao.texto}
												onChange={(e) =>
													atualizarOpcao(pergunta.id, opcao.id, e.target.value)
												}
												className="flex-1 rounded-lg border border-transparent bg-transparent hover:bg-gray-50 focus:bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-gray-200 focus:outline-none transition-colors"
											/>
											{configuracao.atribuirPontuacao && (
												<button
													type="button"
													onClick={() =>
														atualizarPergunta(
															pergunta.id,
															"respostaCorreta",
															pergunta.tipo === "checkbox"
																? (() => {
																		const atuais = Array.isArray(
																			pergunta.respostaCorreta,
																		)
																			? pergunta.respostaCorreta
																			: [];
																		return atuais.includes(opcao.texto)
																			? atuais.filter(
																					(item) => item !== opcao.texto,
																				)
																			: [...atuais, opcao.texto];
																	})()
																: pergunta.respostaCorreta === opcao.texto
																	? undefined
																	: opcao.texto,
														)
													}
													className={`col-start-2 row-start-2 min-h-11 justify-self-start rounded-lg px-2 py-1 text-[11px] font-bold sm:col-start-3 sm:row-start-1 ${Array.isArray(pergunta.respostaCorreta) ? (pergunta.respostaCorreta.includes(opcao.texto) ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50") : pergunta.respostaCorreta === opcao.texto ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50"}`}
												>
													{(
														Array.isArray(pergunta.respostaCorreta)
															? pergunta.respostaCorreta.includes(opcao.texto)
															: pergunta.respostaCorreta === opcao.texto
													)
														? "Correta"
														: "Marcar correta"}
												</button>
											)}
											<button
												onClick={(e) => {
													e.stopPropagation();
													removerOpcao(pergunta.id, opcao.id);
												}}
												className="col-start-3 row-start-1 grid h-11 w-11 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 sm:col-start-4 sm:text-gray-300 sm:opacity-0 sm:group-hover/opt:opacity-100 sm:focus:opacity-100"
												title="Remover opção"
											>
												<X className="w-4 h-4" />
											</button>
										</div>
									))}
									<div className="flex items-center gap-3 pl-1 pt-1">
										<IconeOpcao
											tipo={pergunta.tipo}
											className="text-gray-300"
										/>
										<button
											onClick={() => adicionarOpcao(pergunta.id)}
											className="text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 px-2 py-1 rounded transition-colors"
										>
											Adicionar opção
										</button>
									</div>
								</>
							)}

							{pergunta.tipo === "short_text" && (
								<div className="w-1/2 border-b-2 border-dashed border-gray-200 pb-2 ml-1 text-sm text-gray-400">
									Texto de resposta curta...
								</div>
							)}
							{pergunta.tipo === "paragraph" && (
								<div className="w-full border-b-2 border-dashed border-gray-200 pb-6 ml-1 text-sm text-gray-400">
									Texto de resposta longa...
								</div>
							)}
						</div>

						{/* Footer de ações da pergunta ativa */}
						<div className="mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
							<button
								onClick={() =>
									atualizarPergunta(
										pergunta.id,
										"obrigatoria",
										!pergunta.obrigatoria,
									)
								}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
									pergunta.obrigatoria
										? "bg-sky-50 text-sky-700"
										: "text-gray-500 hover:bg-gray-100"
								}`}
							>
								Obrigatória{" "}
								{pergunta.obrigatoria && <Check className="w-3.5 h-3.5" />}
							</button>

							<div className="w-px h-5 bg-gray-200 mx-1"></div>

							<button
								onClick={(e) => duplicarPergunta(pergunta.id, e)}
								className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-200 hover:scale-110 active:scale-90"
								title="Duplicar"
							>
								<Copy className="w-4 h-4" />
							</button>
							<button
								onClick={(e) => excluirPergunta(pergunta.id, e)}
								className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all duration-200 hover:scale-110 active:scale-90"
								title="Excluir"
							>
								<Trash2 className="w-4 h-4" />
							</button>
						</div>
					</div>
				) : (
					// MODO VISUALIZAÇÃO
					<div className="space-y-4 pr-6">
						<div className="flex items-start gap-1">
							<h3 className="text-sm font-semibold text-gray-900">
								{pergunta.titulo || "Pergunta sem título"}
							</h3>
							{pergunta.obrigatoria && (
								<span className="text-red-500 text-sm mt-0.5">*</span>
							)}
						</div>

						<div className="space-y-2.5">
							{(pergunta.tipo === "multiple_choice" ||
								pergunta.tipo === "checkbox") &&
								pergunta.opcoes.map((opcao) => (
									<div key={opcao.id} className="flex items-center gap-3">
										<IconeOpcao
											tipo={pergunta.tipo}
											className="text-gray-400"
										/>
										<span className="text-sm text-gray-600">{opcao.texto}</span>
									</div>
								))}
							{pergunta.tipo === "short_text" && (
								<div className="w-1/2 border-b border-gray-300 pb-2 text-sm text-gray-400">
									Resposta curta
								</div>
							)}
							{pergunta.tipo === "paragraph" && (
								<div className="w-full border-b border-gray-300 pb-6 text-sm text-gray-400">
									Resposta longa
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
