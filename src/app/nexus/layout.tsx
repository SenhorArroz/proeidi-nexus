"use client";
import type React from "react";
import { Suspense, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "~/app/_components/sidebar";
import { ForcePasswordChange } from "~/app/_components/force-password-change";
import { ScreenTour } from "~/app/_components/screen-tour";

const ROTAS_SEM_NAVEGACAO = new Set(["/nexus/login", "/nexus/redefinir-senha"]);

export default function DashboardLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const pathname = usePathname();
	const conteudoRef = useRef<HTMLElement>(null);

	useEffect(() => {
		const conteudo = conteudoRef.current;
		if (!conteudo || ROTAS_SEM_NAVEGACAO.has(pathname)) return;

		const mobile = window.matchMedia("(width < 40rem)");
		const atributo = "data-nexus-controles-recolhidos";
		let timer: number | undefined;
		let toqueInicial: Touch | undefined;

		const exibir = () => {
			window.clearTimeout(timer);
			document.body.removeAttribute(atributo);
			if (mobile.matches) {
				timer = window.setTimeout(() => {
					document.body.setAttribute(atributo, "");
				}, 4000);
			}
		};
		const iniciarToque = (event: TouchEvent) => {
			toqueInicial = event.touches[0];
		};
		const moverToque = (event: TouchEvent) => {
			const toque = event.touches[0];
			if (!mobile.matches || !toqueInicial || !toque) return;
			const dx = Math.abs(toque.clientX - toqueInicial.clientX);
			const dy = Math.abs(toque.clientY - toqueInicial.clientY);
			if (dy > Math.max(8, dx)) exibir();
		};
		const rolarRoda = (event: WheelEvent) => {
			if (mobile.matches && Math.abs(event.deltaY) > Math.abs(event.deltaX))
				exibir();
		};
		const focarControle = (event: FocusEvent) => {
			if (
				mobile.matches &&
				event.target instanceof Element &&
				event.target.closest(".nexus-controle-flutuante")
			)
				exibir();
		};

		exibir();
		mobile.addEventListener("change", exibir);
		conteudo.addEventListener("scroll", exibir, {
			capture: true,
			passive: true,
		});
		conteudo.addEventListener("touchstart", iniciarToque, { passive: true });
		conteudo.addEventListener("touchmove", moverToque, { passive: true });
		conteudo.addEventListener("wheel", rolarRoda, { passive: true });
		document.body.addEventListener("focusin", focarControle);
		return () => {
			window.clearTimeout(timer);
			document.body.removeAttribute(atributo);
			mobile.removeEventListener("change", exibir);
			conteudo.removeEventListener("scroll", exibir, true);
			conteudo.removeEventListener("touchstart", iniciarToque);
			conteudo.removeEventListener("touchmove", moverToque);
			conteudo.removeEventListener("wheel", rolarRoda);
			document.body.removeEventListener("focusin", focarControle);
		};
	}, [pathname]);

	if (ROTAS_SEM_NAVEGACAO.has(pathname)) {
		return (
			<main className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
				<Suspense
					fallback={
						<div className="p-6 text-sm font-semibold text-sky-800">
							Carregando…
						</div>
					}
				>
					{children}
				</Suspense>
			</main>
		);
	}

	return (
		<div className="h-dvh min-h-[100dvh] bg-blue-500 sm:p-1">
			<div className="flex h-full w-full overflow-hidden bg-white sm:rounded-2xl sm:border-6 sm:border-amber-600">
				<Sidebar />
				<main
					ref={conteudoRef}
					className="nexus-main flex-1 min-w-0 overflow-y-auto overflow-x-hidden"
				>
					<Suspense
						fallback={
							<div className="p-6 text-sm font-semibold text-sky-800">
								Carregando…
							</div>
						}
					>
						{children}
					</Suspense>
				</main>
				<ForcePasswordChange />
				<ScreenTour />
			</div>
		</div>
	);
}
