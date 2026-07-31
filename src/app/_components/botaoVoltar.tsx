"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BotaoVoltarProps {
  href: string;
  label: string;
}

export default function BotaoVoltar({ href, label }: BotaoVoltarProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-4 group"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}
