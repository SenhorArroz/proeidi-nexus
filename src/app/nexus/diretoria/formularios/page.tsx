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

	const salvar = () => salvarFormulario.mutate({ titulo: titulo.trim(), descricao: descricao.trim() || null, conteudo: { perguntas: perguntas.filter((pergunta) => pergunta.titulo.trim()).map((pergunta) => ({ ...pergunta, titulo: pergunta.titulo.trim(), opcoes: pergunta.opcoes.filter((opcao) => opcao.texto.trim()).map((opcao) => ({ ...opcao, texto: opcao.texto.trim() })) })) }, publicado: true });

    return (
        <div className="min-h-full w-full bg-gray-50 flex flex-col items-center font-sans px-4 py-10 pb-32">
            
            <div className="w-full max-w-3xl">
                <BotaoVoltar href="/nexus/diretoria/questionarios" label="Voltar para Questionários" />
            </div>

            {/* Banner de topo (Mesmo estilo visual) */}
            <div className="w-full max-w-3xl relative rounded-2xl overflow-hidden mb-8 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] bg-gradient-to-br from-sky-600 to-sky-500 shadow-sm">
                <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-600 " />
                <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-amber-600 mix-blend-overlay" />

                <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
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
                    
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 text-white text-sm font-medium backdrop-blur-md transition-all duration-200">
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">Configurações</span>
                    </button>
                </div>
            </div>

            <div className="w-full max-w-3xl space-y-4">
                
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
                    <div className="p-6 space-y-4">
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

                {/* Lista de Perguntas */}
                {perguntas.map((pergunta) => {
                    const isAtivo = ativoId === pergunta.id;

                    return (
                        <div 
                            key={pergunta.id}
                            onClick={() => setAtivoId(pergunta.id)}
                            className={`bg-white rounded-2xl border transition-all duration-200 cursor-pointer group flex relative ${
                                isAtivo 
                                    ? "border-sky-300 shadow-md ring-4 ring-sky-50" 
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                            {/* Drag handle sutil */}
                            <div className="w-8 flex flex-col items-center pt-6 text-gray-200 group-hover:text-gray-400 transition-colors">
                                <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex-1 p-6 pl-0">
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
                                                        <div key={opcao.id} className="flex items-center gap-3 group/opt">
                                                            <IconeOpcao tipo={pergunta.tipo} className="text-gray-300 flex-shrink-0" />
                                                            <input
                                                                type="text"
                                                                value={opcao.texto}
                                                                onChange={(e) => atualizarOpcao(pergunta.id, opcao.id, e.target.value)}
                                                                className="flex-1 rounded-lg border border-transparent bg-transparent hover:bg-gray-50 focus:bg-gray-50 px-3 py-1.5 text-sm text-gray-700 focus:border-gray-200 focus:outline-none transition-colors"
                                                            />
												<button type="button" onClick={() => atualizarPergunta(pergunta.id, "respostaCorreta", pergunta.tipo === "checkbox" ? (() => { const atuais = Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta : []; return atuais.includes(opcao.texto) ? atuais.filter((item) => item !== opcao.texto) : [...atuais, opcao.texto]; })() : (pergunta.respostaCorreta === opcao.texto ? undefined : opcao.texto))} className={`rounded-lg px-2 py-1 text-[11px] font-bold ${Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta.includes(opcao.texto) ? "bg-green-50 text-green-700" : "text-slate-400 hover:bg-slate-50" : pergunta.respostaCorreta === opcao.texto ? "bg-green-50 text-green-700" : "text-slate-400 hover:bg-slate-50"}`}>{(Array.isArray(pergunta.respostaCorreta) ? pergunta.respostaCorreta.includes(opcao.texto) : pergunta.respostaCorreta === opcao.texto) ? "Correta" : "Marcar correta"}</button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); removerOpcao(pergunta.id, opcao.id); }}
                                                                className="p-1.5 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 transition-all duration-200 opacity-0 group-hover/opt:opacity-100 focus:opacity-100"
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
                                        <div className="flex items-center justify-end gap-2 pt-4 mt-2 border-t border-gray-100">
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
				<div className="sticky bottom-4 flex justify-end"><button onClick={salvar} disabled={salvarFormulario.isPending || !titulo.trim() || !perguntas.some((pergunta) => pergunta.titulo.trim())} className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-sky-200 hover:bg-sky-700 disabled:opacity-50">{salvarFormulario.isPending ? "Publicando…" : "Publicar questionário"}</button></div>
				{salvarFormulario.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{salvarFormulario.error.message}</p>}
				{salvarFormulario.data && <p role="status" className="rounded-xl bg-green-50 p-3 text-sm text-green-800">Questionário publicado. Link: <a className="font-bold underline" href={`/questionarios/${salvarFormulario.data.slug}`} target="_blank">/questionarios/{salvarFormulario.data.slug}</a></p>}

            </div>
        </div>
    );
}
