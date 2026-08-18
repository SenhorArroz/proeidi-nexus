"use client";
import { useState, useEffect, useRef } from 'react';

export default function Contatos() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry?.isIntersecting) {
                    setIsVisible(true);
                    if (sectionRef.current) {
                        observer.unobserve(sectionRef.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => {
            if (sectionRef.current) {
                observer.unobserve(sectionRef.current);
            }
        };
    }, []);

    return (
        <section
            id="contatos"
            ref={sectionRef}
            className="bg-gray-50 min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 overflow-hidden flex justify-center"
        >
            <div
                className={`
                    w-full max-w-5xl
                    transition-all duration-1000 ease-out transform 
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                `}
            >
                {/* Cabeçalho */}
                <div className="text-center mb-12">
                    <h2 className="text-sky-600 font-bold tracking-wide uppercase text-sm mb-2">
                        Fale Conosco
                    </h2>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                        Tire suas dúvidas
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                        Nossa equipe está pronta para atender você. Entre em contato pelos canais abaixo.
                    </p>
                </div>

                {/* Card Principal de Contatos */}
                <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-3xl shadow-2xl overflow-hidden mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2">

                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <h3 className="text-2xl font-bold text-white mb-8 border-b-4 border-amber-500 pb-2 inline-block w-fit">
                                Canais de Atendimento
                            </h3>

                            <div className="flex items-start gap-4 mb-8 group">
                                <div className="bg-white/20 p-3 rounded-lg group-hover:bg-amber-500 group-hover:text-sky-900 text-white transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sky-100 text-sm font-medium mb-1">Ligue para nós</p>
                                    <a href="tel:+558433422216" className="text-2xl font-bold text-white hover:text-amber-300 transition-colors block">
                                        (84) 3342-2216
                                    </a>
                                    <p className="text-sky-200 text-sm mt-1">Ramais: 138 / 204 / 114</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="bg-white/20 p-3 rounded-lg group-hover:bg-amber-500 group-hover:text-sky-900 text-white transition-colors duration-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sky-100 text-sm font-medium mb-1">Mande um e-mail</p>
                                    <a href="mailto:inclusaodigital@imd.ufrn.br" className="text-xl font-bold text-white hover:text-amber-300 transition-colors break-all">
                                        inclusaodigital@imd.ufrn.br
                                    </a>
                                    <p className="text-sky-200 text-sm mt-1">Respondemos em até 24h úteis</p>
                                </div>
                            </div>

                            <div className="h-px w-full bg-sky-500/50 my-8"></div>

                            <div className="">
                                <h4 className="text-sky-200 text-xs font-bold uppercase tracking-widest mb-4">Acompanhe nas redes</h4>
                                <div className="flex gap-4">
                                    <a href="https://www.instagram.com/proeidi/" className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:scale-110 hover:shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                        </svg>
                                    </a>

                                    <a href="https://www.facebook.com/InclusaoDigitalIdososIMD/" className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 hover:scale-110 hover:shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                                        </svg>
                                    </a>

                                    <a href="https://www.youtube.com/channel/UCbnbp3G76Xgul9urok1Y11A" className="bg-white/10 p-3 rounded-full text-white transition-all duration-300 hover:bg-gradient-to-tr hover:from-red-500 hover:via-red-600 hover:to-red-700 hover:scale-110 hover:shadow-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="relative bg-sky-800 min-h-[300px] md:min-h-full overflow-hidden flex items-center justify-center p-8">
                            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500 rounded-full opacity-20 blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-sky-500 rounded-full opacity-20 blur-3xl"></div>

                            <div className="relative z-10 text-center">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
                                    <h4 className="text-white font-bold text-lg mb-2">Visite o IMD</h4>
                                    <p className="text-sky-100 text-sm leading-relaxed mb-4">
                                        Instituto Metrópole Digital - UFRN<br />
                                        Av. Senador Salgado Filho, 3000<br />
                                        Lagoa Nova, Natal - RN
                                    </p>
                                    <a
                                        href="https://maps.google.com/?q=Instituto+Metropole+Digital"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-amber-300 font-bold hover:text-amber-200 transition-colors text-sm"
                                    >
                                        <span>Ver no Mapa</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NOVO CARD: ProEIDI Nexus - Tratamento para Fundo Branco */}
                <div className="bg-white rounded-[2rem] shadow-xl shadow-sky-900/5 border border-gray-100/60 p-1.5 relative overflow-hidden group hover:shadow-2xl hover:shadow-sky-900/10 transition-shadow duration-500">
                    
                    {/* Efeitos de Luz de Fundo (Glows) */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-50/40 to-amber-50/20 z-0"></div>
                    <div className="absolute -left-32 -bottom-32 w-80 h-80 bg-sky-400 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 z-0"></div>
                    <div className="absolute -right-32 -top-32 w-80 h-80 bg-amber-400 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-700 z-0"></div>

                    {/* Conteúdo do Card (Estilo Vidro / Glass) */}
                    <div className="bg-white/70 backdrop-blur-xl rounded-[1.6rem] p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 border border-white">
                        
                        <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-6 md:gap-8 w-full">
                            
                            {/* Logo Container Animado (overflow-hidden para arredondar a imagem) */}
                            <div className="w-50 h-50 md:w-50 md:h-50 bg-white rounded-2xl shadow-md shadow-sky-900/5 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden group-hover:-translate-y-1.5 transition-transform duration-500 ease-out">
                                <img 
                                    src="/nexus_logo.png" 
                                    alt="Logo ProEIDI Nexus" 
                                    /* mix-blend-multiply faz o fundo branco da imagem fundir com o card */
                                    className="w-full h-full object-cover sm:object-contain mix-blend-multiply" 
                                />
                            </div>
                            
                            {/* Textos e Badge */}
                            <div className="flex-1">
                                
                                <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
                                    ProEIDI <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-sky-400">Nexus</span>
                                </h3>
                                
                                <p className="text-gray-500 text-sm md:text-base font-medium max-w-lg leading-relaxed">
                                    Conecte-se à nossa plataforma integrada. 
                                </p>
                            </div>
                        </div>

                        {/* Botão de Ação Estilizado */}
                        <div className="w-full md:w-auto shrink-0 mt-2 md:mt-0">
                            <a 
                                href="/nexus/login"
                                className="relative inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 rounded-xl bg-gray-900 text-white text-sm font-bold overflow-hidden transition-all duration-300 shadow-lg shadow-gray-900/20 active:scale-95 group/btn"
                            >
                                {/* Background revelado no Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                                
                                <span className="relative z-10">Acessar Sistema</span>
                                
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
