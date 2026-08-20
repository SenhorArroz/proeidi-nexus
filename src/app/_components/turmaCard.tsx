"use client";

import { useState, useRef, useEffect } from "react";
import { Users, Clock, MoreVertical, BookOpen, MapPin, LogIn, Megaphone } from "lucide-react";

interface Turma {
    id: string;
    nome: string;
    sala: string;
    professores: string;
    alunos: number;
    proximaAula: string;
    color: string;
    progresso?: number; // 0-100, opcional (turmas concluídas podem omitir)
}

function initials(name: string) {
    return name
        .split(/[\s,e]+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join("");
}

function hexToRgba(hex: string, alpha: number) {
    const h = hex.replace("#", "");
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function TurmaCard({ turma }: { turma: Turma }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;
        function handleClick(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    return (
        <div className="group relative min-w-0 cursor-pointer rounded-2xl border-1 border-sky-500 bg-white transition-all duration-400 hover:-translate-y-0.5 hover:border-amber-600 hover:shadow-lg">
            {/* Banner */}
            <div
                className="relative h-24 flex items-start justify-between p-3 overflow-hidden rounded-t-2xl"
                style={{
                    background: `linear-gradient(135deg, ${turma.color} 0%, ${hexToRgba(turma.color, 0.75)} 100%)`,
                }}
            >
                {/* padrão decorativo: listras */}
                <div className="absolute -right-30 -top-10 w-40 h-40 flex flex-col gap-2 rotate-75 pointer-events-none mix-blend-screen ">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="w-full h-2.5 bg-amber-600 rounded-full" />
                    ))}
                </div>

                <div className="relative w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-4.5 h-4.5 text-white" />
                </div>

                <h4 className="absolute bottom-3 left-3 right-3 text-sm font-semibold text-white leading-snug line-clamp-2 drop-shadow-sm">
                    {turma.nome}
                </h4>
            </div>

            {/* Menu 3 pontos — fora do banner para não ser cortado */}
            <div ref={menuRef} className="absolute top-3 right-3 z-10">
                <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
					className="grid min-h-11 min-w-11 place-items-center rounded-full text-white/80 opacity-100 transition-opacity hover:bg-white/20 hover:text-white sm:min-h-0 sm:min-w-0 sm:p-1.5 sm:opacity-0 sm:group-hover:opacity-100"
					aria-label="Abrir ações da turma"
                >
                    <MoreVertical className="w-4 h-4" />
                </button>

                {menuOpen && (
                    <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                            <LogIn className="w-4 h-4" />
                            Acessar
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setMenuOpen(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                        >
                            <Megaphone className="w-4 h-4" />
                            Abrir chamado
                        </button>
                    </div>
                )}
            </div>

            {/* Corpo */}
            <div className="p-4">
				<div className="mb-4 flex min-w-0 flex-wrap items-center gap-2">
                    <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white flex-shrink-0"
                        style={{ backgroundColor: turma.color }}
                    >
                        {initials(turma.professores)}
                    </div>
					<p className="min-w-0 flex-1 truncate text-xs text-gray-500">{turma.professores}</p>
                    <span className="text-gray-300">·</span>
					<span className="flex max-w-full shrink-0 items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
						<span className="truncate">{turma.sala}</span>
                    </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        {turma.alunos} alunos
                    </span>
                </div>
            </div>
        </div>
    );
}
