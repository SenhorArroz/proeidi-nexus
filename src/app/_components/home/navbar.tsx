"use client";
import { useState, useEffect, useRef, useCallback } from "react";

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const lastScrollY = useRef(0);

    const navLinks = [
        { name: "Quem pode participar?", href: "#participar" },
        { name: "Inscrições", href: "#inscricoes" },
        { name: "Imagens", href: "#galeria" },
        { name: "Notícias", href: "#noticias" },
        { name: "Integrantes", href: "#pessoal" },
        { name: "Contatos", href: "#contatos" },
    ];

    const controlNavbar = useCallback(() => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
            setIsVisible(false);
            setMobileMenuOpen(false);
        } else {
            setIsVisible(true);
        }
        lastScrollY.current = currentScrollY;
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", controlNavbar, { passive: true });
        return () => window.removeEventListener("scroll", controlNavbar);
    }, [controlNavbar]);

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, {
            rootMargin: "-50% 0px -50% 0px",
        });

        sections.forEach((section) => observer.observe(section));

        return () => {
            sections.forEach((section) => observer.unobserve(section));
        };
    }, []);

    return (
        <nav
            className={`
                fixed top-0 left-0 right-0 z-50
                bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-100
                transition-transform duration-300
                ${isVisible ? "translate-y-0" : "-translate-y-full"}
            `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo / Brand */}
                    <a href="#" className="flex items-center gap-3 cursor-pointer select-none hover:opacity-75 transition-opacity duration-200 shrink-0">
                        <span className="text-2xl font-bold text-blue-600 hover:text-amber-500 duration-200 transition-colors leading-none">
                            ProEIDI
                        </span>

                        <span className="hidden lg:block w-px h-6 bg-slate-300"></span>

                        <span className="text-xs lg:text-lg font-medium text-black leading-tight">
                            <span className="hidden lg:inline">Projeto de Extensão Inclusão Digital para Idosos</span>
                            <span className="lg:hidden">Extensão Inclusão Digital</span>
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <ul className="hidden lg:flex items-center gap-6">
                        {navLinks.map((link, index) => {
                            const linkId = link.href.replace('#', '');
                            const isActive = activeSection.toLowerCase() === linkId.toLowerCase();

                            return (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className={`
                                            text-base font-medium transition-colors duration-200 relative group
                                            ${isActive ? "text-blue-600 font-bold" : "text-black hover:text-blue-600"}
                                        `}
                                    >
                                        {link.name}
                                        <span className={`
                                            absolute -bottom-1 left-0 h-0.5 bg-amber-400 transition-all duration-300
                                            ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                                        `}></span>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setMobileMenuOpen((v) => !v)}
                        className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                        aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`
                    lg:hidden overflow-hidden transition-all duration-300 ease-in-out
                    ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
                `}
            >
                <ul className="px-4 pb-4 pt-2 space-y-1 bg-white/95 backdrop-blur-md border-t border-slate-100">
                    {navLinks.map((link, index) => {
                        const linkId = link.href.replace('#', '');
                        const isActive = activeSection === linkId;

                        return (
                            <li key={index}>
                                <a
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`
                                        block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200
                                        ${isActive
                                            ? "text-blue-600 font-bold bg-blue-50"
                                            : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                                        }
                                    `}
                                >
                                    {link.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}