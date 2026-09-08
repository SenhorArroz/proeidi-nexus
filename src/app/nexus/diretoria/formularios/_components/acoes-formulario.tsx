"use client";
import { FileText, Settings } from "lucide-react";
import { useEditorFormulario } from "./use-editor-formulario";

type Estado = ReturnType<typeof useEditorFormulario>;
type AcoesFormularioProps = {
	formularioId: Estado["formularioId"];
	setConfiguracoesAbertas: NonNullable<Estado["setConfiguracoesAbertas"]>;
	configuracoesAbertas: NonNullable<Estado["configuracoesAbertas"]>;
};

export function AcoesFormulario({
	formularioId,
	setConfiguracoesAbertas,
	configuracoesAbertas,
}: AcoesFormularioProps) {
	return (
		<div className="view-diretoria-formularios-acoes-formulario relative mb-8 w-full min-w-0 max-w-3xl overflow-hidden rounded-2xl bg-gradient-to-br from-sky-600 to-sky-500 px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2.2vh,1.75rem)] shadow-sm">
			<div className="absolute -right-10 -bottom-16 w-56 h-56 rounded-full bg-amber-600 " />
			<div className="absolute right-24 -top-12 w-32 h-32 rounded-full bg-amber-600 mix-blend-overlay" />

			<div className="relative flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-3">
					<div className="w-[clamp(2rem,3vw,2.5rem)] h-[clamp(2rem,3vw,2.5rem)] rounded-lg border-3 border-amber-600 backdrop-blur-sm flex items-center justify-center flex-shrink-0 bg-white/10">
						<FileText className="w-[70%] h-[70%] text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="text-[clamp(1rem,1.8vw,1.375rem)] font-semibold text-white leading-tight truncate">
							{formularioId ? "Editar questionário" : "Editor de Formulário"}
						</h1>
						<p className="text-[clamp(0.65rem,1vw,0.8rem)] text-white/70 truncate">
							{formularioId
								? "Atualize perguntas, configurações e publicação"
								: "Criando novo formulário de avaliação"}
						</p>
					</div>
				</div>

				<button
					type="button"
					onClick={() => setConfiguracoesAbertas((aberta) => !aberta)}
					aria-expanded={configuracoesAbertas}
					className="flex min-h-11 shrink-0 items-center gap-1.5 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition-all duration-200 hover:bg-white/30 sm:px-4"
				>
					<Settings className="w-4 h-4" />
					<span className="hidden sm:inline">Configurações</span>
				</button>
			</div>
		</div>
	);
}
