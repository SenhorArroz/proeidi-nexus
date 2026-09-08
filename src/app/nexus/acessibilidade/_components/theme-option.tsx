"use client";

import { Sun } from "lucide-react";

export function ThemeOption({
	active,
	icon: Icon,
	label,
	onClick,
}: {
	active: boolean;
	icon: typeof Sun;
	label: string;
	onClick: () => void;
}) {
	return (
		<label
			className={`view-theme-option ${`flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 text-left font-semibold transition-colors ${active ? "border-sky-700 bg-sky-50 text-sky-900" : "border-slate-200 text-slate-700 hover:border-sky-300"}`}`}
		>
			<input
				type="radio"
				name="tema"
				checked={active}
				onChange={onClick}
				className="sr-only"
			/>
			<Icon className="h-5 w-5" />
			{label}
		</label>
	);
}
