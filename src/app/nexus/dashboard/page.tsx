"use client";
import React from "react";
import Link from "next/link";
import {
  Sun,
  Sunset,
  Moon,
  GraduationCap,
  ShieldCheck,
  Users,
  DoorOpen,
  MapPin,
  Clock,
} from "lucide-react";

type Role = "professor" | "monitor";

interface Turma {
  id: string;
  titulo: string;
  sala: string;
  cor: string;
  alunos: number;
  proximaAula: string;
}

const USUARIO: { nome: string; role: Role } = {
  nome: "Thales",
  role: "professor",
};

const ROLE_INFO: Record<Role, { label: string; icon: React.ElementType; cor: string }> = {
  professor: { label: "Professor(a)", icon: GraduationCap, cor: "#1A73E8" },
  monitor: { label: "Monitor(a)", icon: ShieldCheck, cor: "#188038" },
};

const TURMAS_DO_USUARIO: Turma[] = [
  {
    id: "1",
    titulo: "Smartphone mais do que Avançado",
    sala: "Sala 204",
    cor: "#1A73E8",
    alunos: 28,
    proximaAula: "Hoje, 14:00",
  },
  {
    id: "2",
    titulo: "Excel para o dia a dia",
    sala: "Sala 108",
    cor: "#188038",
    alunos: 19,
    proximaAula: "Amanhã, 09:00",
  },
];

function useSaudacao() {
  const hora = new Date().getHours();
  if (hora < 12) return { texto: "Bom dia", icon: Sun };
  if (hora < 18) return { texto: "Boa tarde", icon: Sunset };
  return { texto: "Boa noite", icon: Moon };
}

function TurmaMiniCard({ turma }: { turma: Turma }) {
  const slug = turma.titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  return (
    <Link 
      href={`/nexus/dashboard/turmas/${slug}`}
      className="block bg-white rounded-2xl border border-sky-200 overflow-hidden hover:border-amber-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div
        className="relative h-16 flex items-center px-4"
        style={{ background: `linear-gradient(135deg, ${turma.cor} 0%, ${turma.cor}CC 100%)` }}
      >
        <div className="absolute -right-4 -bottom-6 w-20 h-20 rounded-full bg-white/10" />
        <div className="relative w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <DoorOpen className="w-4 h-4 text-white" />
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm font-semibold text-gray-900 truncate mb-1">{turma.titulo}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin className="w-3 h-3" />
          {turma.sala}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            {turma.alunos} alunos
          </span>
          <span className="flex items-center gap-1.5 font-medium text-gray-700">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {turma.proximaAula}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Dashboard() {
  const saudacao = useSaudacao();
  const SaudacaoIcon = saudacao.icon;
  const roleInfo = ROLE_INFO[USUARIO.role];
  const RoleIcon = roleInfo.icon;

  return (
    <div className="w-full  bg-gray-50 flex flex-col items-center font-sans px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Banner de saudação */}
        <div
          className="relative rounded-2xl overflow-hidden mb-8 px-8 py-8"
          style={{ background: `linear-gradient(135deg, ${roleInfo.cor} 0%, ${roleInfo.cor}CC 100%)` }}
        >
          <div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-white/10" />

          <div className="relative flex items-center gap-2 mb-3">
            <SaudacaoIcon className="w-5 h-5 text-white/80" />
            <span className="text-sm text-white/80">{saudacao.texto}</span>
          </div>
          <h1 className="relative text-2xl font-semibold text-white leading-snug mb-3">
            {saudacao.texto}, {USUARIO.nome}
          </h1>
          <span className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold">
            <RoleIcon className="w-3.5 h-3.5" />
            {roleInfo.label}
          </span>
        </div>

        {/* Turmas do usuário */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-gray-700">Suas turmas</h2>
            <span className="text-xs text-gray-400">{TURMAS_DO_USUARIO.length} turmas</span>
          </div>

          {TURMAS_DO_USUARIO.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TURMAS_DO_USUARIO.map((turma) => (
                <TurmaMiniCard key={turma.id} turma={turma} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-sm text-gray-400 bg-white rounded-2xl border border-gray-200">
              Você ainda não está vinculado a nenhuma turma
            </div>
          )}
        </section>
      </div>
    </div>
  );
}