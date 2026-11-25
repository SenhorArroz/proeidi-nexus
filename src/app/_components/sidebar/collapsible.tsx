// Componente utilitário para esconder/mostrar texto suavemente sem quebrar o layout
export function Collapsible({
	collapsed,
	children,
}: {
	collapsed: boolean;
	children: React.ReactNode;
}) {
	return (
		<div
			className={`grid transition-all duration-300 ease-in-out ${
				collapsed ? "grid-cols-[0fr] opacity-0" : "grid-cols-[1fr] opacity-100"
			}`}
		>
			<div className="overflow-hidden whitespace-nowrap flex items-center">
				{children}
			</div>
		</div>
	);
}
