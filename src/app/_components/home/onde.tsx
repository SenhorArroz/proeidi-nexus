"use client";
import { useState, useEffect, useRef } from 'react';

export default function Onde() {
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

    const cardsData = [
        {
            title: "Computador Pessoal",
            text: "Aprenda a manusear o computador, usar o mouse, teclado e navegar entre sites com segurança.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            )
        },
        {
            title: "Smartphone",
            text: "Domine os recursos do seu celular, configure aplicativos, tire fotos e conecte-se ao Wi-Fi.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            )
        },
        {
            title: "Redes Sociais",
            text: "Crie perfis, encontre amigos e desfrute das redes sociais com segurança e privacidade.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            )
        },
        {
            title: "Aplicativos Diversos",
            text: "Descubra aplicativos úteis para o seu dia a dia, entretenimento e organização pessoal.",
            icon: (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />
            )
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="bg-sky-600 min-h-fit py-12 px-4 sm:px-6 md:py-24 md:px-8 overflow-hidden flex justify-center"
        >
            <div id='onde'
                className={`
                    max-w-7xl w-full
                    transition-all duration-1000 ease-out transform 
                    ${isVisible
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-24 scale-95'
                    }
                `}
            >
                <h1 className="text-2xl max-w-md mx-auto pb-2 sm:text-3xl md:text-4xl font-extrabold text-white text-center mb-10 md:mb-16 drop-shadow-md px-2 border-b-4 border-amber-500">
                    O que você aprenderá?
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {cardsData.map((card, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center h-full"
                        >
                            <div className="bg-sky-100 p-3 md:p-4 rounded-full mb-4 md:mb-6 shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 md:h-10 md:w-10 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {card.icon}
                                </svg>
                            </div>
                            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2 md:mb-3">
                                {card.title}
                            </h2>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {card.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}