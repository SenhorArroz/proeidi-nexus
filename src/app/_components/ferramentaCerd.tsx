import { ChevronRight } from "lucide-react";

interface Ferramenta {
    id: string;
    nome: string;
    link: string;
    descricao: string;
    icon: React.ElementType;
    cor: string;
}

export default function FerramentaCard({ ferramenta }: { ferramenta: Ferramenta }) {
	const Icon = ferramenta.icon;
	return (
		<a
			href={ferramenta.link}
			className="group flex items-center gap-4 bg-white rounded-2xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm transition-all duration-200 text-left w-full"
		>
			<div
				className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
				style={{ backgroundColor: `${ferramenta.cor}1A` }}
			>
				<Icon className="w-6 h-6" style={{ color: ferramenta.cor }} />
			</div>
			<div className="flex-1 min-w-0">
				<p className="text-sm font-semibold text-gray-900">{ferramenta.nome}</p>
				<p className="text-xs text-gray-500 mt-0.5">{ferramenta.descricao}</p>
			</div>
			<ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 flex-shrink-0 transition-all duration-200" />
		</a>
	);
}