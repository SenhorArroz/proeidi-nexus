"use client";
import { ArrowLeft, Check, DoorOpen, IdCard, Info, Mail } from "lucide-react";
import { useProfessoresDiretoria } from "./use-professores-diretoria";

type Estado = ReturnType<typeof useProfessoresDiretoria>;
type FormularioProfessorProps = {
	cancelar: NonNullable<Estado["cancelar"]>;
	editandoId: Estado["editandoId"];
	rascunho: NonNullable<Estado["rascunho"]>;
	setRascunho: NonNullable<Estado["setRascunho"]>;
	salvar: NonNullable<Estado["salvar"]>;
	formValido: NonNullable<Estado["formValido"]>;
};

export function FormularioProfessor({
	cancelar,
	editandoId,
	rascunho,
	setRascunho,
	salvar,
	formValido,
}: FormularioProfessorProps) {
	return (
		<div className="view-diretoria-professores-formulario-professor bg-white rounded-2xl border border-gray-200 overflow-hidden">
			<div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4 sm:px-6 sm:py-5">
				<button
					onClick={cancelar}
					className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					aria-label="Voltar"
				>
					<ArrowLeft className="w-4 h-4" />
				</button>
				<h2 className="text-sm font-semibold text-gray-900">
					{editandoId ? "Editar professor" : "Novo professor"}
				</h2>
			</div>

			<div className="min-w-0 space-y-5 p-4 sm:p-6">
				{/* Nome */}
				<div>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Nome
					</label>
					<input
						value={rascunho.nome}
						onChange={(e) => setRascunho({ ...rascunho, nome: e.target.value })}
						placeholder="Nome completo"
						className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
					/>
				</div>

				{/* Matrícula */}
				<div>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Matrícula
					</label>
					<div className="relative">
						<IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							value={rascunho.matricula}
							onChange={(e) =>
								setRascunho({ ...rascunho, matricula: e.target.value })
							}
							placeholder="Ex: 20230011221"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
						/>
					</div>
				</div>

				{/* Email de acesso */}
				<div>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						E-mail de acesso
					</label>
					<div className="relative">
						<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
						<input
							type="email"
							value={rascunho.email}
							onChange={(e) =>
								setRascunho({ ...rascunho, email: e.target.value })
							}
							placeholder="professor@proeidi.com.br"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-3 py-2.5 text-sm focus:bg-white focus:border-violet-300 focus:outline-none transition-colors"
						/>
					</div>
				</div>

				{/* Senha de acesso */}
				<div>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Senha de acesso
					</label>
					<p className="rounded-lg bg-amber-50 px-3 py-2.5 text-sm text-amber-800">
						A senha inicial é a matrícula. Depois do primeiro acesso, a
						redefinição é feita por código enviado por e-mail.
					</p>
				</div>

				{/* Turmas (somente leitura) */}
				<div>
					<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
						Turmas
					</label>
					{rascunho.turmas.length > 0 ? (
						<div className="flex flex-wrap gap-1.5 mb-2">
							{rascunho.turmas.map((t) => (
								<span
									key={t}
									className="flex max-w-full items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-700"
								>
									<DoorOpen className="w-3 h-3" />
									<span className="truncate">{t}</span>
								</span>
							))}
						</div>
					) : (
						<p className="text-xs text-gray-400 mb-2">
							Este professor ainda não está em nenhuma turma
						</p>
					)}
					<p className="flex items-start gap-1.5 text-[11px] text-gray-400">
						<Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />O vínculo com
						turmas é feito na tela de Turmas, não aqui.
					</p>
				</div>
			</div>

			<div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-6">
				<button
					onClick={cancelar}
					className="min-h-11 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200"
				>
					Cancelar
				</button>
				<button
					onClick={salvar}
					disabled={!formValido}
					className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
				>
					<Check className="w-4 h-4" />
					Salvar professor
				</button>
			</div>
		</div>
	);
}
