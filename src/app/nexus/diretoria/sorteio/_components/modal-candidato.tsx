"use client";
import {
	Calendar,
	FileDigit,
	Monitor,
	Pencil,
	Phone,
	PhoneCall,
	Plus,
	Smartphone,
	Ticket,
	User,
	X,
} from "lucide-react";
import { formatarCpf, formatarTelefone } from "./suporte";
import { useGerenciarSorteio } from "./use-gerenciar-sorteio";

type Estado = ReturnType<typeof useGerenciarSorteio>;
type ModalCandidatoProps = {
	setIsModalOpen: NonNullable<Estado["setIsModalOpen"]>;
	candidatoEditando: Estado["candidatoEditando"];
	salvarCandidato: NonNullable<Estado["salvarCandidato"]>;
	form: NonNullable<Estado["form"]>;
	setForm: NonNullable<Estado["setForm"]>;
};

export function ModalCandidato({
	setIsModalOpen,
	candidatoEditando,
	salvarCandidato,
	form,
	setForm,
}: ModalCandidatoProps) {
	return (
		<div className="view-diretoria-sorteio-modal-candidato fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
				onClick={() => setIsModalOpen(false)}
			/>

			{/* Modal Content */}
			<div className="relative z-10 max-h-[96dvh] w-full max-w-2xl overflow-hidden rounded-t-3xl border border-gray-100 bg-white shadow-xl animate-in zoom-in-95 duration-200 sm:rounded-3xl">
				<div className="flex items-center justify-between gap-3 border-b border-gray-100 bg-gray-50/50 p-4 sm:p-6">
					<h3 className="flex min-w-0 items-center gap-2 break-words text-lg font-bold text-gray-900">
						{candidatoEditando ? (
							<Pencil className="w-5 h-5 text-sky-600" />
						) : (
							<Plus className="w-5 h-5 text-sky-600" />
						)}
						{candidatoEditando ? "Editar Candidato" : "Nova Ficha de Inscrição"}
					</h3>
					<button
						onClick={() => setIsModalOpen(false)}
						className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
					>
						<X className="w-5 h-5" />
					</button>
				</div>

				<form
					onSubmit={salvarCandidato}
					className="max-h-[calc(96dvh-5rem)] overflow-y-auto p-4 sm:max-h-[70vh] sm:p-6"
				>
					<p className="mb-5 rounded-xl bg-sky-50 px-3 py-2 text-sm text-sky-800">
						A data e a hora do registro são preenchidas automaticamente.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{/* Ficha */}
						<div className="space-y-1 md:col-span-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<FileDigit className="w-4 h-4 text-sky-500" /> Número da Ficha
							</label>
							<input
								required
								type="text"
								value={form.ficha}
								onChange={(e) => setForm({ ...form, ficha: e.target.value })}
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
								placeholder="Ex: 042"
							/>
						</div>

						{/* Curso de Interesse */}
						<div className="space-y-1 md:col-span-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<Ticket className="w-4 h-4 text-sky-500" /> Curso de interesse
							</label>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<button
									type="button"
									onClick={() => setForm({ ...form, curso: "Smartphone" })}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Smartphone" ? "bg-sky-50 border-sky-300 text-sky-700 shadow-sm" : "bg-white border-gray-200 text-black/60 hover:bg-gray-50"}`}
								>
									<Smartphone className="w-4 h-4" /> Smartphone
								</button>
								<button
									type="button"
									onClick={() => setForm({ ...form, curso: "Computador" })}
									className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all ${form.curso === "Computador" ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm" : "bg-white border-gray-200 text-black/60 hover:bg-gray-50"}`}
								>
									<Monitor className="w-4 h-4" /> Computador
								</button>
							</div>
						</div>

						{/* Nome Completo */}
						<div className="space-y-1 md:col-span-2">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<User className="w-4 h-4 text-sky-500" /> Nome Completo
							</label>
							<input
								required
								type="text"
								value={form.nome}
								onChange={(e) => setForm({ ...form, nome: e.target.value })}
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
								placeholder="Digite o nome completo"
							/>
						</div>

						{/* Nascimento */}
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<Calendar className="w-4 h-4 text-sky-500" /> Data de Nascimento
							</label>
							<input
								required
								type="date"
								value={form.dataNascimento}
								onChange={(e) =>
									setForm({ ...form, dataNascimento: e.target.value })
								}
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
							/>
						</div>

						{/* CPF */}
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<FileDigit className="w-4 h-4 text-sky-500" /> CPF
							</label>
							<input
								required
								type="text"
								value={form.cpf}
								onChange={(e) =>
									setForm({ ...form, cpf: formatarCpf(e.target.value) })
								}
								inputMode="numeric"
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
								placeholder="000.000.000-00"
							/>
						</div>

						{/* Telefone */}
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<Phone className="w-4 h-4 text-sky-500" /> Telefone para Contato
							</label>
							<input
								required
								type="text"
								value={form.telefone}
								onChange={(e) =>
									setForm({
										...form,
										telefone: formatarTelefone(e.target.value),
									})
								}
								inputMode="numeric"
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
								placeholder="(00) 00000-0000"
							/>
						</div>

						{/* Contato de Emergência */}
						<div className="space-y-1">
							<label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
								<PhoneCall className="w-4 h-4 text-red-400" /> Contato de
								Emergência
							</label>
							<input
								required
								type="text"
								value={form.emergencia}
								onChange={(e) =>
									setForm({ ...form, emergencia: e.target.value })
								}
								className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-2.5 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 transition-all"
								placeholder="Ex.: (84) 99999-9999 - Maria (filha)"
							/>
						</div>
					</div>

					{/* Rodapé do Modal */}
					<div className="mt-8 flex flex-col-reverse gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-end">
						<button
							type="button"
							onClick={() => setIsModalOpen(false)}
							className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:w-auto"
						>
							Cancelar
						</button>
						<button
							type="submit"
							className="min-h-11 w-full rounded-xl bg-sky-600 px-5 py-2.5 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-sky-700 hover:shadow-md sm:w-auto"
						>
							{candidatoEditando ? "Salvar Alterações" : "Adicionar ao Sorteio"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
