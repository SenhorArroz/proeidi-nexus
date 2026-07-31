'use client';

import { useState } from "react";
import {
  ChevronDown,
} from "lucide-react";

import TurmaCard from "~/app/_components/turmaCard";

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

interface Categoria {
  id: string;
  label: string;
  turmas: Turma[];
}

const CATEGORIAS: Categoria[] = [
  {
    id: "andamento",
    label: "Em andamento",
    turmas: [
      { id: "1", nome: "Smartphone mais do que Avançado", sala: "Sala 204", professores: "Thales e Paulo", alunos: 28, proximaAula: "Hoje, 14:00", color: "#1A73E8", progresso: 62 },
      { id: "2", nome: "Excel para o dia a dia", sala: "Sala 108", professores: "Marina Alves", alunos: 19, proximaAula: "Amanhã, 09:00", color: "#188038", progresso: 40 },
      { id: "3", nome: "Introdução ao Word", sala: "Sala 108", professores: "Marina Alves", alunos: 22, proximaAula: "Qui, 10:30", color: "#E37400", progresso: 18 },
    ],
  },
];


function CategoriaSection({ categoria }: { categoria: Categoria }) {
  const [open, setOpen] = useState(true);

  return (
    <section className="mb-8">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700 hover:text-gray-900"
      >
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? "" : "-rotate-90"}`} />
        {categoria.label}
        <span className="text-gray-400 font-normal">({categoria.turmas.length})</span>
      </button>

      {open && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoria.turmas.map((turma) => (
            <TurmaCard key={turma.id} turma={turma} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function TurmasPorCategoria() {
  const TODAY = new Date();
  const WEEKDAY = TODAY.toLocaleDateString("pt-BR", { weekday: "long" });
  const DATE_LABEL = TODAY.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });

  return (
    <div className="flex min-h-screen w-full text-gray-900">
      <main className="flex-1 px-8 py-8 max-w-5xl mx-auto w-full">
        <p className="text-sm text-gray-500 capitalize">{WEEKDAY}, {DATE_LABEL}</p>
        <h1 className="text-2xl font-semibold text-gray-900 mt-1 mb-6">Minhas turmas</h1>

        {CATEGORIAS.map((categoria) => (
          <CategoriaSection key={categoria.id} categoria={categoria} />
        ))}
      </main>
    </div>
  );
}