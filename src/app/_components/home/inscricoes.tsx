"use client";
import { useState, useEffect, useRef } from 'react';

export default function Inscricoes() {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
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
    // aqui fica mais fácil de botar (não mexa se n tiver mais)
    const coursesData = [
        {
            title: "Introdução ao Computador",
            subtitle: "Aprendizado básico ao avançado de computador",
            details: [
                { label: "Quando", value: "Sábados, de 17/08 a 28/09" },
                { label: "Duração", value: "6 aulas" },
                { label: "Vagas", value: "Duas turmas de 14 vagas" },
            ],
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            )
        },
        {
            title: "Uso de Smartphone",
            subtitle: "Aprendizado básico ao avançado de celular",
            details: [
                { label: "Quando", value: "Sábados, de 17/08 a 28/09" },
                { label: "Duração", value: "6 aulas" },
                { label: "Vagas", value: "Duas turmas de 14 vagas" },
            ],
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            )
        },
        {
            title: "Adicionar se tiver",
            subtitle: "o curso novo que tanto falaram",
            details: [
                { label: "Quando", value: "A partir de não sei (Durante a semana)" },
                { label: "Duração", value: "não sei aulas" },
                { label: "Vagas", value: "não sei vagas" },
            ],
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            )
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="bg-sky-600 min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 overflow-hidden flex justify-center"
            id="inscricoes"
        >
            <div 
                className={`
                    max-w-5xl w-full
                    transition-all duration-1000 ease-out transform 
                    ${isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-24 scale-95'
                    }
                `}
            >
                <h1 className="text-3xl max-w-md mx-auto md:text-4xl font-extrabold text-center text-white border-b-4 border-amber-500 pb-3 mb-8 drop-shadow-md">
                    Inscrições 2026.1
                </h1>

                <p className="text-white text-center text-lg mb-8 max-w-2xl mx-auto">
                    Os cursos do PROEIDI irão começar! Confira as informações abaixo.
                </p>

                <div className="bg-amber-500 rounded-xl p-6 shadow-lg mb-12 flex items-start gap-4 text-sky-950 max-w-3xl mx-auto">
                    <div className="bg-amber-300 p-2 rounded-full shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold mb-2">Atenção: Novo Formato de Seleção</h3>
                        <p className="font-medium leading-relaxed">
                            Neste semestre, os alunos serão selecionados por <strong>SORTEIO</strong>, não sendo mais por ordem de chegada.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-white backdrop-blur-sm flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-amber-300 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-xl mb-2 text-white">Dias de Inscrição</h3>
                            <ul className="space-y-1">
                                <li>(colocar data depois)</li>
                                <li>(colocar horario também)</li>
                                <li className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.327-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.493 1.698 5.988 3.3 7.724.882.799 1.707 1.381 2.327 1.765.31.193.57.337.757.433.092.047.186.094.281.14l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> Lab. B202 do IMD</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white/10 border border-white/20 rounded-xl p-6 text-white backdrop-blur-sm flex items-start gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-amber-300 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.328l5.603 3.113z" />
                        </svg>
                        <div>
                            <h3 className="font-bold text-xl mb-2 text-white">Dia do Sorteio</h3>
                            <ul className="space-y-1">
                                <li>(colocar data depois)</li>
                                <li>(colocar horario também)</li>
                                <li className="flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.327-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.493 1.698 5.988 3.3 7.724.882.799 1.707 1.381 2.327 1.765.31.193.57.337.757.433.092.047.186.094.281.14l.018.008.006.003zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg> Auditório B205</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white text-center mb-8">
                    Cursos Disponíveis (? vagas totais)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {coursesData.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center h-full"
                        >
                            <div className="bg-sky-100 p-3 md:p-4 rounded-full mb-4 md:mb-6 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {card.icon}
                                </svg>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-1">
                                {card.title}
                            </h2>
                            {card.subtitle && (
                                <p className="text-sm text-sky-600 font-medium mb-4">{card.subtitle}</p>
                            )}

                            <ul className="text-sm text-gray-600 leading-relaxed space-y-2 w-full text-left mt-4 bg-gray-50 p-4 rounded-lg">
                                {card.details.map((detail, idx) => (
                                    <li key={idx} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                                        <span className="font-bold text-gray-700">{detail.label}:</span>
                                        <span className="text-gray-600">{detail.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                
                <div className="flex justify-center shadow-xl hover:-translate-y-2 transition-transform duration-300 bg-white p-4 grid grid-cols-2 gap-x-7 gap-y-5 lg:grid-cols-4 rounded-xl max-w-7xl lg:gap-x-10 mx-auto backdrop-blur-md">
                    <img src="https://inclusaodigital.imd.ufrn.br/img/logos/imd.png" alt="" />
                    <img src="https://inclusaodigital.imd.ufrn.br/img/logos/ufrn.png" alt="" />
                    <img src="https://inclusaodigital.imd.ufrn.br/img/logos/spm.png" alt="" />
                    <img src="https://inclusaodigital.imd.ufrn.br/img/logos/proex.png" alt="" />
                </div>
            </div>
        </section>
    );
}