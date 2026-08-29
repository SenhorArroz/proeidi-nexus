"use client";
import React, { useState } from "react";
import {
    FileText,
    Plus,
    Copy,
    Trash2,
    Check,
    X,
    CircleDot,
    CheckSquare,
    Type,
    AlignLeft,
    Settings,
    GripVertical
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";
import { api } from "~/trpc/react";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------

type TipoPergunta = "short_text" | "paragraph" | "multiple_choice" | "checkbox";
type ModoResposta = "ANONIMO" | "IDENTIFICADO_POR_COOKIE";
type ConfiguracaoFormulario = { corPrimaria: string; corDestaque: string; corFundo: string; fonte: "SANS" | "SERIF" | "MONO"; mostrarProgresso: boolean; atribuirPontuacao: boolean };

interface Opcao {
    id: string;
    texto: string;
}

interface Pergunta {
    id: string;
    titulo: string;
    tipo: TipoPergunta;
    opcoes: Opcao[];
    obrigatoria: boolean;
	respostaCorreta?: string | string[];
}

const TIPOS_PERGUNTA = [
    { value: "short_text", label: "Resposta curta", icon: Type },
    { value: "paragraph", label: "Parágrafo", icon: AlignLeft },
    { value: "multiple_choice", label: "Múltipla escolha", icon: CircleDot },
    { value: "checkbox", label: "Caixa de seleção", icon: CheckSquare },
];

// ---------------------------------------------------------------------------
// Componentes Auxiliares
// ---------------------------------------------------------------------------

function IconeOpcao({ tipo, className }: { tipo: TipoPergunta; className?: string }) {
    if (tipo === "multiple_choice") return <CircleDot className={`w-4 h-4 ${className}`} />;
    if (tipo === "checkbox") return <CheckSquare className={`w-4 h-4 ${className}`} />;
    return <div className={`w-4 h-4 rounded-full bg-gray-200 ${className}`} />;
}

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function EditorFormulario() {
	const utils = api.useUtils();
    const [titulo, setTitulo] = useState("Pesquisa de Satisfação");
    const [descricao, setDescricao] = useState("Deixe sua opinião sobre o módulo.");
	const [modoResposta, setModoResposta] = useState<ModoResposta>("ANONIMO");
	const [limitarPorNavegador, setLimitarPorNavegador] = useState(false);
	const [configuracoesAbertas, setConfiguracoesAbertas] = useState(false);
	const [configuracao, setConfiguracao] = useState<ConfiguracaoFormulario>({ corPrimaria: "#0284c7", corDestaque: "#ea580c", corFundo: "#f8fafc", fonte: "SANS", mostrarProgresso: true, atribuirPontuacao: false });
    const [ativoId, setAtivoId] = useState<string | null>("header");
	const salvarFormulario = api.formulario.create.useMutation({ onSuccess: () => utils.formulario.list.invalidate() });

    const [perguntas, setPerguntas] = useState<Pergunta[]>([
        {
            id: "1",
            titulo: "Como você avalia a didática do professor?",
            tipo: "multiple_choice",
            opcoes: [
                { id: "o1", texto: "Excelente" },
                { id: "o2", texto: "Boa" },
                { id: "o3", texto: "Regular" },
            ],
            obrigatoria: true,
        }
    ]);

    // Funções de manipulação
    const adicionarPergunta = () => {
        const nova: Pergunta = {
            id: Date.now().toString(),
            titulo: "",
            tipo: "multiple_choice",
            opcoes: [{ id: Date.now() + "o", texto: "Opção 1" }],
            obrigatoria: false,
        };
        setPerguntas([...perguntas, nova]);
        setAtivoId(nova.id);
    };

    const duplicarPergunta = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const p = perguntas.find((x) => x.id === id);
        if (!p) return;
        const nova = {
            ...p,
            id: Date.now().toString(),
            opcoes: p.opcoes.map(o => ({ ...o, id: Date.now() + Math.random().toString() }))
        };
        const index = perguntas.findIndex((x) => x.id === id);
        const arrayAtualizado = [...perguntas];
        arrayAtualizado.splice(index + 1, 0, nova);
        setPerguntas(arrayAtualizado);
        setAtivoId(nova.id);
    };

    const excluirPergunta = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (perguntas.length === 1) return;
        const novas = perguntas.filter((p) => p.id !== id);
        setPerguntas(novas);
        if (ativoId === id) setAtivoId(null);
    };

    const atualizarPergunta = (id: string, campo: keyof Pergunta, valor: any) => {
        setPerguntas((prev) => prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p)));
    };

    const adicionarOpcao = (perguntaId: string) => {
        setPerguntas((prev) => prev.map((p) => {
            if (p.id !== perguntaId) return p;
            return { ...p, opcoes: [...p.opcoes, { id: Date.now().toString(), texto: `Opção ${p.opcoes.length + 1}` }] };
        }));
    };

    const atualizarOpcao = (perguntaId: string, opcaoId: string, texto: string) => {
        setPerguntas((prev) => prev.map((p) => {
            if (p.id !== perguntaId) return p;
            return { ...p, opcoes: p.opcoes.map((o) => (o.id === opcaoId ? { ...o, texto } : o)) };
        }));
    };

    const removerOpcao = (perguntaId: string, opcaoId: string) => {
        setPerguntas((prev) => prev.map((p) => {
            if (p.id !== perguntaId) return p;
            if (p.opcoes.length === 1) return p;
            return { ...p, opcoes: p.opcoes.filter((o) => o.id !== opcaoId) };
        }));
    };

	const salvar = () => salvarFormulario.mutate({ titulo: titulo.trim(), descricao: descricao.trim() || null, conteudo: { perguntas: perguntas.filter((pergunta) => pergunta.titulo.trim()).map((pergunta) => ({ ...pergunta, titulo: pergunta.titulo.trim(), opcoes: pergunta.opcoes.filter((opcao) => opcao.texto.trim()).map((opcao) => ({ ...opcao, texto: opcao.texto.trim() })) })) }, publicado: true, modoResposta, limitarPorNavegador, configuracao });

    return (
        <div className="flex min-h-full w-full flex-col items-center overflow-x-clip bg-gray-50 px-3 py-6 pb-32 font-sans sm:px-4 sm:py-10">
            
            <div className="w-full max-w-3xl">
                <BotaoVoltar href="/nexus/diretoria/questionarios" label="Voltar para Questionários" />
            </div>

            {/* Banner de topo (Mesmo estilo visual) */}
            <div className="relative mb-8 w-full min-w-0 max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-sky-500 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] shadow-sm">
                <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-600 " />
                <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-amber-600 mix-blend-overlay" />

                <div className="relative flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg border-3 border-amber-600 backdrop-blur-sm flex items-center justify-center flex-shrink-0 bg-white/10">
                            <FileText className="w-[70%] h-[70%] text-white" />
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-[clamp(1rem,1.8vw,1.375rem)] font-semibold text-white leading-tight truncate">
                                Editor de Formulário
                            </h1>
                            <p className="text-[clamp(0.65rem,1vw,0.8rem)] text-white/70 truncate">
                                Criando novo formulário de avaliação
                            </p>
                        </div>
                    </div>
                    
					<button type="button" onClick={() => setConfiguracoesAbertas((aberta) => !aberta)} aria-expanded={configuracoesAbertas} className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-white/30 sm:px-4">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Configurações</span>
                    </button>
                </div>
            </div>

            <div className="w-full min-w-0 max-w-3xl space-y-4">
                
                {/* Cabeçalho do Formulário */}
                <div 
                    onClick={() => setAtivoId("header")}
                    className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
                        ativoId === "header" 
                            ? "border-sky-300 shadow-md ring-4 ring-sky-50" 
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                >
                    <div className="h-2 w-full bg-sky-500" />
                    <div className="space-y-4 p-4 sm:p-6">
                        {ativoId === "header" ? (
                            <>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                    placeholder="Título do formulário"
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-900 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
                                />
                                <textarea
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                    placeholder="Descrição (opcional)"
                                    rows={2}
                                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors resize-none"
                                />
                            </>
                        ) : (
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">{titulo || "Formulário sem título"}</h2>
                                {descricao && <p className="text-sm text-gray-500 mt-1">{descricao}</p>}
                            </div>
                        )}
                    </div>
                </div>

				{configuracoesAbertas && <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-4 sm:p-5">
					<h2 className="font-extrabold text-slate-900">Configurações do questionário</h2>
					<div className="mt-4 grid gap-4 sm:grid-cols-2">
						{([['corPrimaria','Cor principal'],['corDestaque','Cor de destaque'],['corFundo','Cor do fundo']] as const).map(([campo, rotulo]) => <label key={campo} className="text-sm font-bold text-slate-800">{rotulo}<input type="color" value={configuracao[campo]} onChange={(event) => setConfiguracao({ ...configuracao, [campo]: event.target.value })} className="mt-2 block h-11 w-full cursor-pointer rounded-xl border border-sky-200 bg-white p-1" /></label>)}
						<label className="text-sm font-bold text-slate-800">Fonte<select value={configuracao.fonte} onChange={(event) => setConfiguracao({ ...configuracao, fonte: event.target.value as ConfiguracaoFormulario['fonte'] })} className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3"><option value="SANS">Sem serifa</option><option value="SERIF">Com serifa</option><option value="MONO">Monoespaçada</option></select></label>
					</div>
					<div className="mt-5 space-y-3 border-t border-sky-100 pt-4">
						<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800"><span>Mostrar progresso ao responder</span><input type="checkbox" checked={configuracao.mostrarProgresso} onChange={(event) => setConfiguracao({ ...configuracao, mostrarProgresso: event.target.checked })} className="h-5 w-5" /></label>
						<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800"><span>Atribuir 1 ponto por questão correta</span><input type="checkbox" checked={configuracao.atribuirPontuacao} onChange={(event) => setConfiguracao({ ...configuracao, atribuirPontuacao: event.target.checked })} className="h-5 w-5" /></label>
						<label className="flex min-h-11 items-center justify-between gap-3 text-sm font-bold text-slate-800"><span>Limitar a uma resposta por navegador</span><input type="checkbox" checked={limitarPorNavegador || modoResposta === "IDENTIFICADO_POR_COOKIE"} disabled={modoResposta === "IDENTIFICADO_POR_COOKIE"} onChange={(event) => setLimitarPorNavegador(event.target.checked)} className="h-5 w-5" /></label>
					</div>
					<label className="mt-4 block text-sm font-bold text-slate-800" htmlFor="modo-resposta">Modo de resposta</label>
					<select id="modo-resposta" value={modoResposta} onChange={(event) => setModoResposta(event.target.value as ModoResposta)} className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100">
						<option value="ANONIMO">Anônima — várias respostas permitidas</option>
						<option value="IDENTIFICADO_POR_COOKIE">Identificada — uma resposta por navegador</option>
					</select>
					{modoResposta === "IDENTIFICADO_POR_COOKIE" && <p className="mt-3 rounded-xl bg-white px-3 py-2 text-sm text-sky-800">A pessoa informará o nome e poderá responder uma vez por navegador.</p>}
				</section>}

                {/* Lista de Perguntas */}
                {perguntas.map((pergunta) => {
                    const isAtivo = ativoId === pergunta.id;

                    return (
                        <div 
                            key={pergunta.id}
                            onClick={() => setAtivoId(pergunta.id)}
                            className={`group relative flex min-w-0 rounded-2xl border bg-white transition-all duration-200 cursor-pointer ${
                                isAtivo 
                                    ? "border-sky-300 shadow-md ring-4 ring-sky-50" 
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                            {/* Drag handle sutil */}
                            <div className="flex w-7 shrink-0 flex-col items-center pt-4 text-gray-200 transition-colors group-hover:text-gray-400 sm:w-8 sm:pt-6">
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
                                                onChange={(e) => atualizarPergunta(pergunta.id, "titulo", e.target.value)}
                                                placeholder="Sua pergunta"
                                                className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-900 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
                                            />
                                            <div className="relative w-full sm:w-48 flex-shrink-0">
                                                <select
                                                    value={pergunta.tipo}
                                                    onChange={(e) => atualizarPergunta(pergunta.id, "tipo", e.target.value)}
                                                    className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm text-gray-700 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors cursor-pointer"
                                                >
                                                    {TIPOS_PERGUNTA.map(t => (
                                                        <option key={t.value} value={t.value}>{t.label}</option>
                                                    ))}
                                                </select>
                                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                                                    <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2">
                                            {(pergunta.tipo === "multiple_choice" || pergunta.tipo === "checkbox") && (
                                                <>
                                                    {pergunta.opcoes.map((opcao) => (
                                                        <div key={opcao.id} className="group/opt grid min-w-0 grid-cols-[auto_minmax(0,1fr)_2.75rem] items-center gap-2 sm:grid-cols-[auto_minmax(0,1fr)_auto_2.75rem]">
                                                            <IconeOpcao tipo={pergunta.tipo} className="text-gray-300 flex-shrink-0" />
                                                            <input
                                                                type="text"
                                                                value={opcao.texto}
                                                                onChange={(e) => atualizarOpcao(pergunta.id, opcao.id, e.target.value)}
                                                                className="flex-1 rounded-lg border border-transparent bg-transparent hover:bg-gray-50 focus:bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-gray-200 focus:outline-none transition-colors"
                                                            />
																	{configuracao.atribuirPontuacao && <button type="button" onClick={() => atualizarPergunta(pergunta.id, "respostaCorreta", pergunta.tipo === "checkbox" ? (() => { const atuais = Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta : []; return atuais.includes(opcao.texto) ? atuais.filter((item) => item !== opcao.texto) : [...atuais, opcao.texto]; })() : (pergunta.respostaCorreta === opcao.texto ? undefined : opcao.texto))} className={`col-start-2 row-start-2 min-h-11 justify-self-start rounded-lg px-2 py-1 text-[11px] font-bold sm:col-start-3 sm:row-start-1 ${Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta.includes(opcao.texto) ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50" : pergunta.respostaCorreta === opcao.texto ? "bg-green-50 text-green-700" : "text-slate-600 hover:bg-slate-50"}`}>{(Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta.includes(opcao.texto) : pergunta.respostaCorreta === opcao.texto) ? "Correta" : "Marcar correta"}</button>}
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); removerOpcao(pergunta.id, opcao.id); }}
                                                                className="col-start-3 row-start-1 grid h-11 w-11 place-items-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-red-50 hover:text-red-500 sm:col-start-4 sm:text-gray-300 sm:opacity-0 sm:group-hover/opt:opacity-100 sm:focus:opacity-100"
                                                                title="Remover opção"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <div className="flex items-center gap-3 pl-1 pt-1">
                                                        <IconeOpcao tipo={pergunta.tipo} className="text-gray-300" />
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
                                                <div className="w-1/2 border-b-2 border-dashed border-gray-200 pb-2 ml-1 text-sm text-gray-400">Texto de resposta curta...</div>
                                            )}
                                            {pergunta.tipo === "paragraph" && (
                                                <div className="w-full border-b-2 border-dashed border-gray-200 pb-6 ml-1 text-sm text-gray-400">Texto de resposta longa...</div>
                                            )}
                                        </div>

                                        {/* Footer de ações da pergunta ativa */}
                                        <div className="mt-2 flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
                                            <button 
                                                onClick={() => atualizarPergunta(pergunta.id, "obrigatoria", !pergunta.obrigatoria)}
                                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                                                    pergunta.obrigatoria 
                                                        ? "bg-sky-50 text-sky-700" 
                                                        : "text-gray-500 hover:bg-gray-100"
                                                }`}
                                            >
                                                Obrigatória {pergunta.obrigatoria && <Check className="w-3.5 h-3.5" />}
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
                                            {pergunta.obrigatoria && <span className="text-red-500 text-sm mt-0.5">*</span>}
                                        </div>
                                        
                                        <div className="space-y-2.5">
                                            {(pergunta.tipo === "multiple_choice" || pergunta.tipo === "checkbox") && 
                                                pergunta.opcoes.map(opcao => (
                                                    <div key={opcao.id} className="flex items-center gap-3">
                                                        <IconeOpcao tipo={pergunta.tipo} className="text-gray-400" />
                                                        <span className="text-sm text-gray-600">{opcao.texto}</span>
                                                    </div>
                                                ))
                                            }
                                            {pergunta.tipo === "short_text" && (
                                                <div className="w-1/2 border-b border-gray-300 pb-2 text-sm text-gray-400">Resposta curta</div>
                                            )}
                                            {pergunta.tipo === "paragraph" && (
                                                <div className="w-full border-b border-gray-300 pb-6 text-sm text-gray-400">Resposta longa</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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
				<div className="sticky bottom-4 flex justify-end"><button onClick={salvar} disabled={salvarFormulario.isPending || !titulo.trim() || !perguntas.some((pergunta) => pergunta.titulo.trim())} className="min-h-11 w-full rounded-xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 disabled:opacity-50 sm:w-auto">{salvarFormulario.isPending ? "Publicando…" : "Publicar questionário"}</button></div>
				{salvarFormulario.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{salvarFormulario.error.message}</p>}
				{salvarFormulario.data && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">Questionário publicado. Link: <a className="font-bold underline" href={`/questionarios/${salvarFormulario.data.slug}`} target="_blank">/questionarios/{salvarFormulario.data.slug}</a></p>}

            </div>
        </div>
    );
}
