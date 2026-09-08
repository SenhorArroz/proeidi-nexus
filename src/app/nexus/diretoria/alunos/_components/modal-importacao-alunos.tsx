"use client";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { useGerenciarAlunos } from "./use-gerenciar-alunos";

type Estado = ReturnType<typeof useGerenciarAlunos>;
type ModalImportacaoAlunosProps = {
	semestreSelecionado: Estado["semestreSelecionado"];
	setIsImportModalOpen: NonNullable<Estado["setIsImportModalOpen"]>;
	turmasDb: Estado["turmasDb"];
	fileInputRef: NonNullable<Estado["fileInputRef"]>;
	handleFileUpload: NonNullable<Estado["handleFileUpload"]>;
};

export function ModalImportacaoAlunos({
	semestreSelecionado,
	setIsImportModalOpen,
	turmasDb,
	fileInputRef,
	handleFileUpload,
}: ModalImportacaoAlunosProps) {
	return (
		<div className="view-diretoria-alunos-modal-importacao-alunos fixed inset-0 z-50 flex items-end justify-center bg-gray-900/40 p-0 backdrop-blur-sm animate-in fade-in duration-200 sm:items-center sm:p-4">
			<div className="flex max-h-[96dvh] w-full max-w-lg min-w-0 flex-col overflow-y-auto rounded-t-3xl bg-white shadow-xl animate-in zoom-in-95 duration-200 sm:max-h-[90vh] sm:rounded-3xl">
				{/* Cabecalho */}
				<div className="flex min-w-0 shrink-0 items-center justify-between gap-3 border-b border-gray-100 bg-white px-4 py-4 sm:px-6">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
							<FileSpreadsheet className="w-5 h-5" />
						</div>
						<div>
							<h2 className="text-xl font-bold text-gray-900">
								Importar Planilha
							</h2>
							<p className="text-sm text-gray-500">
								Destino: semestre{" "}
								{semestreSelecionado?.codigo ?? "não selecionado"}
							</p>
						</div>
					</div>
					<button
						onClick={() => setIsImportModalOpen(false)}
						className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				{/* Corpo */}
				<div className="flex min-w-0 flex-1 flex-col items-center justify-center space-y-4 overflow-y-auto bg-gray-50/50 p-4 sm:p-6">
					{(turmasDb?.length ?? 0) === 0 && (
						<p className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
							Não há turmas cadastradas para {semestreSelecionado?.codigo}. A
							planilha será importada sem vínculo de turma; você poderá
							vinculá-los depois ao criar as turmas.
						</p>
					)}
					<div className="flex w-full min-w-0 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-4 transition-colors hover:border-sky-500 sm:p-8">
						<Upload className="w-10 h-10 text-gray-400 mb-4" />
						<p className="text-sm font-semibold text-gray-700 mb-1">
							Selecione uma planilha do seu computador
						</p>
						<p className="text-xs text-gray-500 mb-4">
							Formatos suportados: .xlsx, .xls, .csv, .ods
						</p>

						<input
							type="file"
							accept=".xlsx, .xls, .csv, .ods"
							ref={fileInputRef}
							onChange={handleFileUpload}
							className="block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2.5 file:px-5
                                        file:rounded-xl file:border-0
                                        file:text-sm file:font-bold
                                        file:bg-sky-50 file:text-sky-700
                                        hover:file:bg-sky-100
                                        cursor-pointer"
						/>
					</div>
				</div>

				{/* Rodapé */}
				<div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
					<button
						type="button"
						onClick={() => setIsImportModalOpen(false)}
						className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50"
					>
						Cancelar
					</button>
				</div>
			</div>
		</div>
	);
}
