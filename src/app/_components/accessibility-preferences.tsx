"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type AccessibilityPreferences = {
	theme: "light" | "dark";
	highContrast: boolean;
	textScale: number;
	setTheme: (theme: "light" | "dark") => void;
	setHighContrast: (enabled: boolean) => void;
	setTextScale: (scale: number) => void;
};

const STORAGE_KEY = "nexus-acessibilidade";
const AccessibilityContext = createContext<AccessibilityPreferences | null>(null);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<"light" | "dark">("light");
	const [highContrast, setHighContrast] = useState(false);
	const [textScale, setTextScaleState] = useState(0);
	const [loaded, setLoaded] = useState(false);

	const setTextScale = useCallback((scale: number) => setTextScaleState(Math.max(-10, Math.min(10, scale))), []);

	useEffect(() => {
		try {
			const saved = window.localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const preferences = JSON.parse(saved) as Partial<Pick<AccessibilityPreferences, "theme" | "highContrast" | "textScale">> & {
					temaEscuro?: boolean;
					altoContraste?: boolean;
					letraGrande?: boolean;
				};
				setTheme(preferences.theme === "dark" || preferences.temaEscuro ? "dark" : "light");
				setHighContrast(preferences.highContrast ?? Boolean(preferences.altoContraste));
				setTextScale(typeof preferences.textScale === "number" ? preferences.textScale : preferences.letraGrande ? 1 : 0);
			}
		} catch {
			window.localStorage.removeItem(STORAGE_KEY);
		} finally {
			setLoaded(true);
		}
	}, [setTextScale]);

	useEffect(() => {
		if (!loaded) return;
		const root = document.documentElement;
		root.dataset.theme = theme;
		root.dataset.contrast = highContrast ? "high" : "normal";
		root.style.setProperty("--accessibility-font-scale", `${100 + textScale * 5}%`);
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ theme, highContrast, textScale }));
	}, [highContrast, loaded, textScale, theme]);

	return (
		<AccessibilityContext.Provider value={{ theme, highContrast, textScale, setTheme, setHighContrast, setTextScale }}>
			{children}
		</AccessibilityContext.Provider>
	);
}

export function useAccessibility() {
	const context = useContext(AccessibilityContext);
	if (!context) throw new Error("useAccessibility precisa estar dentro de AccessibilityProvider");
	return context;
}
