"use client";
import React, { useState } from "react";
import {
    Ticket,
    Smartphone,
    Monitor,
    Search,
    Plus,
    Pencil,
    Trash2,
    X,
    User,
    Calendar,
    Phone,
    PhoneCall,
    FileDigit,
    Dices
} from "lucide-react";
import BotaoVoltar from "~/app/_components/botaoVoltar";

// ---------------------------------------------------------------------------
// Tipos e Mock de Dados
// ---------------------------------------------------------------------------

type Curso = "Smartphone" | "Computador";

interface Candidato {
    id: string;
    ficha: string;
    nome: string;
    dataNascimento: string;
    cpf: string;
    telefone: string;
    emergencia: string;
    curso: Curso;
}

const DADOS_INICIAIS: Candidato[] = [
    {
        id: "1",
        ficha: "001",
        nome: "Maria das Graças Silva",
        dataNascimento: "1955-04-12",
        cpf: "111.222.333-44",
        telefone: "(84) 99999-1111",
        emergencia: "(84) 98888-1111",
        curso: "Smartphone",
    },
    {
        id: "2",
        ficha: "042",
        nome: "José Carlos Pereira",
        dataNascimento: "1948-08-25",
        cpf: "555.666.777-88",
        telefone: "(84) 99999-2222",
        emergencia: "(84) 98888-2222",
        curso: "Computador",
    },
    {
        id: "3",
        ficha: "015",
        nome: "Ana Lúcia Medeiros",
        dataNascimento: "1960-11-03",
        cpf: "999.888.777-66",
        telefone: "(84) 99999-3333",
        emergencia: "(84) 98888-3333",
        curso: "Smartphone",
    },
];

// ---------------------------------------------------------------------------
// Componente Principal
// ---------------------------------------------------------------------------

export default function GerenciarSorteio() {
    const [candidatos, setCandidatos] = useState<Candidato[]>(DADOS_INICIAIS);
    const [busca, setBusca] = useState("");
    
    // Controle do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidatoEditando, setCandidatoEditando] = useState<Candidato | null>(null);

    // Estado do formulário
    const [form, setForm] = useState<Omit<Candidato, "id">>({
        ficha: "",
        nome: "",
        dataNascimento: "",
        cpf: "",
        telefone: "",
        emergencia: "",
        curso: "Smartphone",
    });

    // Filtros e Separação
    const candidatosFiltrados = candidatos.filter(c => 
        c.nome.toLowerCase().includes(busca.toLowerCase()) || 
        c.ficha.includes(busca)
    );

    const listaSmartphone = candidatosFiltrados.filter(c => c.curso === "Smartphone");
    const listaComputador = candidatosFiltrados.filter(c => c.curso === "Computador");

    // Ações do CRUD
    const abrirModalNovo = () => {
        setForm({
            ficha: "",
            nome: "",
            dataNascimento: "",
            cpf: "",
            telefone: "",
            emergencia: "",
            curso: "Smartphone",
        });
        setCandidatoEditando(null);
        setIsModalOpen(true);
    };

    const abrirModalEdicao = (candidato: Candidato) => {
        setForm({ ...candidato });
        setCandidatoEditando(candidato);
        setIsModalOpen(true);
    };

    const excluirCandidato = (id: string) => {
        if (confirm("Tem certeza que deseja remover este candidato do sorteio?")) {
            setCandidatos(prev => prev.filter(c => c.id !== id));
        }
    };

    const salvarCandidato = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (candidatoEditando) {
            setCandidatos(prev => prev.map(c => c.id === candidatoEditando.id ? { ...form, id: c.id } : c));
        } else {
            const novoCandidato: Candidato = {
                ...form,
                id: Date.now().toString(),
            };
            setCandidatos([...candidatos, novoCandidato]);
        }
        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans p-4 sm:p-8 pb-32">
            <div className="max-w-7xl w-full mx-auto space-y-6">
                
                <BotaoVoltar href="/nexus/diretoria" label="Voltar para Diretoria" />

                {/* Banner Principal & Botão de Sorteio */}
                <div className="w-full relative rounded-2xl overflow-hidden px-6 py-8 sm:p-10 bg-gradient-to-br from-sky-600 to-sky-500 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-500 opacity-20 blur-2xl" />
                    <div className="absolute left-10 -top-12 w-32 h-32 rounded-full bg-sky-400 opacity-50 blur-2xl" />

                    <div className="relative z-10 flex items-center gap-4 text-white">
                        <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                            <Ticket className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Gerenciar Sorteio</h1>
                            <p className="text-sky-100 mt-1 text-sm sm:text-base">
                                Inscrições cadastradas: <span className="font-bold text-white">{candidatos.length}</span> fichas
                            </p>
                        </div>
                    </div>

                    <a 
                        href="/nexus/diretoria/sorteio/sorteador"
                        className="relative z-10 flex items-center gap-2 px-6 py-3.5 bg-amber-500 border-3 border-white font-bold rounded-xl hover:bg-amber-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 w-full md:w-auto justify-center"
                    >
                        <Dices className="w-5 h-5 text-white" />
                        <p className="text-white">Ir para o Sorteador</p>
                    </a>
                </div>

                {/* Barra de Controles (Busca e Adicionar) */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 pl-4 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-3 w-full sm:w-96">
                        <Search className="w-5 h-5 text-gray-400 shrink-0" />
                        <input 
                            type="text" 
                            placeholder="Buscar por nome ou ficha..." 
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-700 placeholder:text-gray-400 py-2"
                        />
                    </div>
                    <button 
                        onClick={abrirModalNovo}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md transition-all shrink-0"
                    >
                        <Plus className="w-4 h-4" />
                        Adicionar Ficha
                    </button>
                </div>

                {/* Duas Colunas: Smartphone vs Computador */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    
                    {/* COLUNA: SMARTPHONE */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-sky-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-sky-100 text-sky-600 rounded-lg">
                                    <Smartphone className="w-5 h-5" />
                                </div>
                                <h2 className="font-bold text-gray-800">Curso de Smartphone</h2>
                            </div>
                            <span className="bg-white border border-sky-100 text-sky-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                {listaSmartphone.length} fichas
                            </span>
                        </div>
                        
                        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {listaSmartphone.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-10">Nenhum candidato encontrado.</p>
                            ) : (
                                listaSmartphone.map(candidato => (
                                    <CardCandidato 
                                        key={candidato.id} 
                                        candidato={candidato} 
                                        onEdit={() => abrirModalEdicao(candidato)} 
                                        onDelete={() => excluirCandidato(candidato.id)} 
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* COLUNA: COMPUTADOR */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="bg-amber-50/50 p-5 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                    <Monitor className="w-5 h-5" />
                                </div>
                                <h2 className="font-bold text-gray-800">Curso de Computador</h2>
                            </div>
                            <span className="bg-white border border-amber-100 text-amber-600 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                                {listaComputador.length} fichas
                            </span>
                        </div>

                        <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {listaComputador.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 py-10">Nenhum candidato encontrado.</p>
                            ) : (
                                listaComputador.map(candidato => (
                                    <CardCandidato 
                                        key={candidato.id} 
                                        candidato={candidato} 
                                        onEdit={() => abrirModalEdicao(candidato)} 
                                        onDelete={() => excluirCandidato(candidato.id)} 
                                    />
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* MODAL DE CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsModalOpen(false)} />
                    
                    {/* Modal Content */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 w-full max-w-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                {candidatoEditando ? <Pencil className="w-5 h-5 text-sky-600"/> : <Plus className="w-5 h-5 text-sky-600"/>}
                                {candidatoEditando ? "Editar Candidato" : "Nova Ficha de Inscrição"}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 rounded-full transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={salvarCandidato} className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                
                                {/* Ficha */}
                                <div className="space-y-1 md:col-span-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><FileDigit className="w-4 h-4 text-sky-500"/> Número da Ficha</label>
                                    <input required type="text" value={form.ficha} onChange={e => setForm({...form, ficha: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="Ex: 042" />
                                </div>

                                {/* Curso de Interesse */}
                                <div className="space-y-1 md:col-span-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Ticket className="w-4 h-4 text-sky-500"/> Curso de Interesse</label>
                                    <div className="flex gap-2">
                                        <button type="button" onClick={() => setForm({...form, curso: "Smartphone"})} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Smartphone" ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                                            <Smartphone className="w-4 h-4"/> Smartphone
                                        </button>
                                        <button type="button" onClick={() => setForm({...form, curso: "Computador"})} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Computador" ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}>
                                            <Monitor className="w-4 h-4"/> Computador
                                        </button>
                                    </div>
                                </div>

                                {/* Nome Completo */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><User className="w-4 h-4 text-sky-500"/> Nome Completo</label>
                                    <input required type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="Digite o nome completo" />
                                </div>

                                {/* Nascimento */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Calendar className="w-4 h-4 text-sky-500"/> Data de Nasc.</label>
                                    <input required type="date" value={form.dataNascimento} onChange={e => setForm({...form, dataNascimento: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" />
                                </div>

                                {/* CPF */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><FileDigit className="w-4 h-4 text-sky-500"/> CPF</label>
                                    <input required type="text" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="000.000.000-00" />
                                </div>

                                {/* Telefone */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><Phone className="w-4 h-4 text-sky-500"/> Telefone Pessoal</label>
                                    <input required type="text" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all" placeholder="(00) 00000-0000" />
                                </div>

                                {/* Contato de Emergência */}
                                <div className="space-y-1">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5"><PhoneCall className="w-4 h-4 text-red-400"/> Contato Emergência</label>
                                    <input required type="text" value={form.emergencia} onChange={e => setForm({...form, emergencia: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all" placeholder="(00) 00000-0000" />
                                </div>

                            </div>

                            {/* Rodapé do Modal */}
                            <div className="mt-8 flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md transition-all">
                                    {candidatoEditando ? "Salvar Alterações" : "Adicionar ao Sorteio"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

// ---------------------------------------------------------------------------
// Sub-Componente: Card de Candidato (Lista)
// ---------------------------------------------------------------------------

function CardCandidato({ candidato, onEdit, onDelete }: { candidato: Candidato, onEdit: () => void, onDelete: () => void }) {
    const isSmartphone = candidato.curso === "Smartphone";

    return (
        <div className="group bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all flex items-center gap-4">
            
            {/* Ficha Badge */}
            <div className={`w-14 h-14 shrink-0 rounded-xl flex flex-col items-center justify-center border border-dashed ${isSmartphone ? 'bg-sky-50 border-sky-200 text-sky-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 -mb-1">Ficha</span>
                <span className="text-lg font-black">{candidato.ficha}</span>
            </div>
            
            {/* Infos */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-gray-900 truncate" title={candidato.nome}>{candidato.nome}</h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><FileDigit className="w-3 h-3"/> {candidato.cpf}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3 h-3"/> {candidato.telefone}</span>
                </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                <button onClick={onEdit} className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors" title="Editar">
                    <Pencil className="w-4 h-4" />
                </button>
                <button onClick={onDelete} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}