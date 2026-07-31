"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, ArrowLeft, MapPinOff } from 'lucide-react';

const Error404 = () => {
    const router = useRouter();

    return (
        <div className="min-h-[100dvh] w-full bg-gray-50 flex flex-col font-sans text-gray-800 p-4 sm:p-6">
            
            {/* Contêiner principal */}
            <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto py-8">
                
                {/* Header/Logo */}
                <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-1000 flex flex-col items-center">
                    <img 
                        src="/logo_semFundo.png" 
                        alt="Logo" 
                        className="h-24 sm:h-40 object-contain grayscale opacity-60"
                    />
                </header>

                {/* Card Principal */}
                <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in zoom-in-95 duration-700 hover:border-gray-300 hover:shadow-md transition-all">
                    
                    {/* Faixa decorativa no topo do card */}
                    <div className="h-2 w-full bg-gradient-to-r from-sky-500 to-sky-600" />
                    
                    <div className="p-6 sm:p-10 flex flex-col items-center text-center">
                        
                        {/* Visual 404 (CORRIGIDO AQUI: inline-flex para abraçar o tamanho exato do ícone) */}
                        <div className="relative inline-flex mb-6">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[1.5rem] sm:rounded-[2rem] bg-sky-50 flex items-center justify-center border border-sky-100 relative z-10 shadow-sm">
                                <MapPinOff className="w-10 h-10 sm:w-12 sm:h-12 text-sky-600" />
                            </div>
                            {/* Detalhe em âmbar agora fica ancorado perfeitamente no canto do ícone */}
                            <div className="absolute -right-1.5 -bottom-1.5 sm:-right-2 sm:-bottom-2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-500 z-0 shadow-sm" />
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-2">
                            404
                        </h1>
                        <h2 className="text-base sm:text-xl font-semibold text-gray-800 mb-3">
                            Página não encontrada
                        </h2>
                        
                        <div className="w-full h-px bg-gray-100 mb-6 sm:mb-8" />

                        {/* Ações */}
                        <div className="flex flex-col w-full gap-3">
                            <button 
                                onClick={() => router.push('/')}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:shadow-sm transition-all duration-200"
                            >
                                <Home className="w-4 h-4" />
                                Painel Principal
                            </button>
                            
                            <button 
                                onClick={() => router.back()}
                                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Voltar à etapa anterior
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer Técnico */}
            <footer className="w-full py-4 flex flex-col items-center gap-1.5 opacity-60 text-center">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider px-2 leading-relaxed">
                    IMD - Instituto Metrópole Digital
                </span>
                <div className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] text-gray-400 font-medium px-4">
                    <span>Powered by: Luiz Roberto</span>
                    <span className="hidden sm:inline">•</span>
                    <span>@luizrob_bah</span>
                </div>
            </footer>

        </div>
    );
};

export default Error404;