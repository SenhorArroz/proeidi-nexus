"use client";
import { ShieldCheck, UsersRound } from "lucide-react";
import Image from "next/image";

type ApresentacaoLoginProps = {};
export function ApresentacaoLogin({}: ApresentacaoLoginProps) {
	return (
		<section className="view-apresentacao-login relative hidden min-w-0 overflow-hidden bg-sky-600 p-8 text-white lg:flex lg:w-[52%] lg:flex-col lg:justify-between xl:p-12">
			<div
				className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500"
				aria-hidden="true"
			/>
			<div
				className="absolute bottom-14 right-12 h-48 w-48 rounded-full border-[18px] border-sky-300/60"
				aria-hidden="true"
			/>
			<div
				className="absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-orange-400/90"
				aria-hidden="true"
			/>
			<div className="relative flex items-center gap-3">
				<Image
					src="/nexus_logo.png"
					alt="ProEIDI Nexus"
					width={200}
					height={100}
					className="h-30 w-auto object-contain"
				/>
				<span className="h-7 w-px bg-white/35" aria-hidden="true" />
				<span className="text-sm font-bold tracking-wide text-sky-50">
					Área do projeto
				</span>
			</div>
			<div className="relative max-w-lg py-14 xl:py-20">
				<div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-orange-500 shadow-[0_12px_24px_rgba(234,88,12,.3)]">
					<ShieldCheck className="h-7 w-7" aria-hidden="true" />
				</div>
				<h1 className="max-w-md text-4xl font-black tracking-[-.035em] text-white xl:text-5xl">
					A rotina do ProEIDI, conectada.
				</h1>
				<p className="mt-5 max-w-md text-base leading-7 text-sky-100 xl:text-lg">
					Gerencie turmas, pessoas, atividades e presença em um só lugar.
				</p>
			</div>
			<div className="relative flex max-w-md items-center gap-3 border-t border-white/20 pt-6 text-sm text-sky-100">
				<UsersRound
					className="h-5 w-5 shrink-0 text-orange-200"
					aria-hidden="true"
				/>
				<span>
					Acesso para coordenação, diretoria, professores e monitores.
				</span>
			</div>
		</section>
	);
}
