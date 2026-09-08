"use client";
import { BookOpen, MoreVertical, Pencil } from "lucide-react";
import { useTurmaView } from "./use-turma-view";

type Estado = ReturnType<typeof useTurmaView>;
type CabecalhoTurmaProps = {
	turma: NonNullable<Estado["turma"]>;
	podeEditarTurma: NonNullable<Estado["podeEditarTurma"]>;
	menuRef: NonNullable<Estado["menuRef"]>;
	setMenuAberto: NonNullable<Estado["setMenuAberto"]>;
	menuAberto: NonNullable<Estado["menuAberto"]>;
	setEditando: NonNullable<Estado["setEditando"]>;
	corTituloLegivel: NonNullable<Estado["corTituloLegivel"]>;
	corDescricaoBannerLegivel: NonNullable<Estado["corDescricaoBannerLegivel"]>;
};

export function CabecalhoTurma({
	turma,
	podeEditarTurma,
	menuRef,
	setMenuAberto,
	menuAberto,
	setEditando,
	corTituloLegivel,
	corDescricaoBannerLegivel,
}: CabecalhoTurmaProps) {
	return (
		<div
			className="view-dashboard-turmas-id-cabecalho-turma turma-tema__cabecalho relative min-w-0 flex-shrink-0 overflow-hidden px-3 pb-6 pt-5 shadow-[0_18px_35px_rgba(2,132,199,.2)] sm:px-6 sm:pt-6 lg:px-8"
			style={{ backgroundColor: turma.cor }}
		>
			<div
				className="absolute -right-8 -bottom-10 h-32 w-32 rounded-full"
				style={{ backgroundColor: turma.corDestaque ?? "#ea580c" }}
			/>
			<div className="absolute right-10 -top-8 w-20 h-20 rounded-full border-[11px] border-sky-200/80" />

			<div className="w-full max-w-6xl mx-auto relative">
				<div className="flex items-center justify-between mb-4">
					<div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
						<BookOpen className="w-4.5 h-4.5 text-white" />
					</div>
					{podeEditarTurma && (
						<div ref={menuRef} className="relative">
							<button
								onClick={() => setMenuAberto((v) => !v)}
								aria-label="Abrir opções da turma"
								className="rounded-xl p-2 text-white/80 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
							>
								<MoreVertical className="w-4 h-4" />
							</button>
							{menuAberto && (
								<div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
									<button
										onClick={() => {
											setEditando(true);
											setMenuAberto(false);
										}}
										className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
									>
										<Pencil className="w-4 h-4" />
										Editar turma
									</button>
								</div>
							)}
						</div>
					)}
				</div>

				<h1
					className="mb-1 break-words text-xl font-black leading-snug tracking-[-.035em] text-white sm:text-3xl"
					style={{ color: corTituloLegivel }}
				>
					{turma.nome}
				</h1>
				<p
					className="break-words text-xs text-white/85 sm:text-sm"
					style={{ color: corDescricaoBannerLegivel }}
				>
					{turma.sala} · {turma.professores.join(" e ")}
				</p>
			</div>
		</div>
	);
}
