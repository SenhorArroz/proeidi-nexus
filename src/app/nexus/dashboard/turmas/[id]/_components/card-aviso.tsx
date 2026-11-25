import { Pencil, Pin, Trash2 } from "lucide-react";
import type { Aviso } from "./suporte";

export function CardAviso({
	aviso,
	cor,
	iniciarEdicao,
	toggleFixar,
	excluirAviso,
	fixando,
	excluindo,
}: {
	aviso: Aviso;
	cor: string;
	iniciarEdicao: (aviso: Aviso) => void;
	toggleFixar: (aviso: Aviso) => void;
	excluirAviso: (id: string) => void;
	fixando: boolean;
	excluindo: boolean;
}) {
	return (
		<div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 group shadow-xs">
			<div className="flex items-start justify-between gap-2 mb-2">
				<div className="flex items-center gap-2">
					<div
						className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0"
						style={{ backgroundColor: cor }}
					>
						{aviso.autor[0]}
					</div>
					<div>
						<p className="text-sm font-medium text-gray-900">{aviso.autor}</p>
						<p className="text-[11px] text-gray-400">{aviso.quando}</p>
					</div>
				</div>
				<div className="flex items-center gap-1">
					{aviso.podeEditar && (
						<button
							onClick={() => iniciarEdicao(aviso)}
							className={`p-1 rounded-full transition-colors text-gray-300 opacity-0 group-hover:opacity-100 hover:text-sky-500`}
							title="Editar aviso"
							aria-label="Editar aviso"
						>
							<Pencil className="w-3.5 h-3.5" />
						</button>
					)}
					{aviso.podeFixar && (
						<button
							onClick={() => toggleFixar(aviso)}
							disabled={fixando}
							className={`p-1 rounded-full transition-colors ${aviso.fixado ? "text-amber-500" : "text-gray-300 opacity-0 group-hover:opacity-100 hover:text-amber-500"}`}
							title={aviso.fixado ? "Desafixar" : "Fixar"}
						>
							<Pin className="w-3.5 h-3.5" />
						</button>
					)}
					{aviso.podeExcluir && (
						<button
							onClick={() => excluirAviso(aviso.id)}
							disabled={excluindo}
							className="p-1 rounded-full text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-colors"
							title="Excluir"
						>
							<Trash2 className="w-3.5 h-3.5" />
						</button>
					)}
				</div>
			</div>
			<p className="text-sm text-gray-600 leading-relaxed">{aviso.texto}</p>
			{aviso.imagemUrl && (
				<img
					src={aviso.imagemUrl}
					alt={`Imagem do aviso de ${aviso.autor}`}
					className="mt-3 max-h-72 w-full rounded-xl bg-slate-100 object-contain"
				/>
			)}
			{aviso.linkUrl && (
				<a
					href={aviso.linkUrl}
					target="_blank"
					rel="noreferrer"
					className="mt-3 inline-flex min-h-11 items-center rounded-lg bg-sky-50 px-3 text-sm font-bold text-sky-700 hover:bg-sky-100"
				>
					Abrir link
				</a>
			)}
		</div>
	);
}
