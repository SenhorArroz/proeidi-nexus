"use client";

export function Campo({
	label,
	value,
	onChange,
	type = "text",
}: {
	label: string;
	value: string | number;
	onChange: (valor: string) => void;
	type?: string;
}) {
	return (
		<label className="view-nexus-diretoria-impressao-campo">
			{label}
			<input
				type={type}
				min={type === "number" ? 0 : undefined}
				value={value}
				onChange={(evento) => onChange(evento.target.value)}
			/>
		</label>
	);
}
