"use client";

import { useEffect } from "react";
import { useAccessibility } from "~/app/_components/accessibility-preferences";

/** Mantém a landing page sempre clara sem apagar a preferência do Nexus. */
export default function HomeThemeLock() {
	const { theme } = useAccessibility();

	useEffect(() => {
		const root = document.documentElement;
		root.dataset.theme = "light";
		return () => {
			root.dataset.theme = theme;
		};
	}, [theme]);

	return null;
}
