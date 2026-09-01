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
      className="group mt-3 mb-4 flex w-fit items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700 sm:mt-4"
    >
      <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}
