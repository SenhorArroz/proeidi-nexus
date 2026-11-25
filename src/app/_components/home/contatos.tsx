"use client";
import { useState, useEffect, useRef } from "react";

import { CanaisAtendimento } from "./_components/canais-atendimento";

import { AcessoNexus } from "./_components/acesso-nexus";

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
			{ threshold: 0.1 },
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
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
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
						Nossa equipe está pronta para atender você. Entre em contato pelos
						canais abaixo.
					</p>
				</div>

				<CanaisAtendimento />

				<AcessoNexus />
			</div>
		</section>
	);
}
