"use client";
import { useEditorFormulario } from "./use-editor-formulario";

type Estado = ReturnType<typeof useEditorFormulario>;
type CabecalhoFormularioProps = {
	setAtivoId: NonNullable<Estado["setAtivoId"]>;
	ativoId: Estado["ativoId"];
	titulo: NonNullable<Estado["titulo"]>;
	setTitulo: NonNullable<Estado["setTitulo"]>;
	descricao: NonNullable<Estado["descricao"]>;
	setDescricao: NonNullable<Estado["setDescricao"]>;
};

export function CabecalhoFormulario({
	setAtivoId,
	ativoId,
	titulo,
	setTitulo,
	descricao,
	setDescricao,
}: CabecalhoFormularioProps) {
	return (
		<div
			onClick={() => setAtivoId("header")}
			className={`view-diretoria-formularios-cabecalho-formulario ${`bg-white rounded-2xl border transition-all duration-200 cursor-pointer overflow-hidden ${
				ativoId === "header"
					? "border-sky-300 shadow-md ring-4 ring-sky-50"
					: "border-gray-200 hover:border-gray-300 hover:shadow-sm"
			}`}`}
		>
			<div className="h-2 w-full bg-sky-500" />
			<div className="space-y-4 p-4 sm:p-6">
				{ativoId === "header" ? (
					<>
						<input
							type="text"
							value={titulo}
							onChange={(e) => setTitulo(e.target.value)}
							placeholder="Título do formulário"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-lg font-semibold text-gray-900 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
						<textarea
							value={descricao}
							onChange={(e) => setDescricao(e.target.value)}
							placeholder="Descrição (opcional)"
							rows={2}
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 focus:bg-white focus:border-sky-300 focus:outline-none transition-colors resize-none"
						/>
					</>
				) : (
					<div>
						<h2 className="text-xl font-semibold text-gray-900">
							{titulo || "Formulário sem título"}
						</h2>
						{descricao && (
							<p className="text-sm text-gray-500 mt-1">{descricao}</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
