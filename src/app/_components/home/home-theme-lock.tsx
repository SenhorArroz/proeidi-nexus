"use client";

import { useEffect } from "react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";

/** Mantém a landing page sempre clara sem apagar a preferência do Nexus. */
export default function HomeThemeLock() {
	const { theme } = useAccessibility();

	useEffect(() => {
		const root = document.documentElement;
		const aplicarTemaClaro = () => {
			if (root.dataset.theme !== "light") root.dataset.theme = "light";
		};
		aplicarTemaClaro();
		const observador = new MutationObserver(aplicarTemaClaro);
		observador.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
		return () => {
			observador.disconnect();
			root.dataset.theme = theme;
		};
	}, [theme]);

	return null;
}
