import { UserRound } from "lucide-react";

export function InfoRow({
	icon: Icon,
	label,
	value,
}: {
	icon: typeof UserRound;
	label: string;
	value: string;
}) {
	return (
		<div className="view-app-nexus-configuracoes-info-row flex min-w-0 items-center gap-3 px-4 py-4 sm:px-6">
			<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50">
				<Icon className="h-4 w-4 text-sky-600" />
			</div>
			<div className="min-w-0">
				<p className="text-xs font-medium uppercase tracking-wide text-gray-400">
					{label}
				</p>
				<p className="mt-0.5 break-words text-sm font-medium text-gray-800 [overflow-wrap:anywhere]">
					{value}
				</p>
			</div>
		</div>
	);
}
