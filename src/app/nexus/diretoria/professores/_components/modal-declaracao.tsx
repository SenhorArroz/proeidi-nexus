"use client";

import { FileText, Loader2, X } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";
import {
	type DeclaracaoForm,
	declaracaoFormPadrao,
	downloadBase64Pdf,
	iniciais,
	type Professor,
} from "./suporte";

export function ModalDeclaracao({
	professor,
	onClose,
}: {
	professor: Professor;
	onClose: () => void;
}) {
	const [turmaId, setTurmaId] = useState(
		professor.turmasDetalhadas[0]?.id ?? "",
	);
	const [form, setForm] = useState<DeclaracaoForm>({
		...declaracaoFormPadrao(),
		matricula: professor.matricula || "",
		curso: professor.turmas.join(" e "),
	});

	const gerarMutation = api.declaracao.gerarIndividual.useMutation({
		onSuccess: (data) => {
			downloadBase64Pdf(
				data.arquivoBase64,
				data.nomeArquivo || "Declaracao.pdf",
			);
			onClose();
		},
		onError: (err) => {
			alert(`Erro ao gerar declaração: ${err.message}`);
		},
	});

	const handleGerar = () => {
		if (!form.matricula.trim() || !form.curso.trim()) return;
		gerarMutation.mutate({
			usuarioId: professor.id,
			turmaId,
			nome: professor.nome,
			matricula: form.matricula,
			curso: form.curso,
			dataInicio: form.dataInicio,
			dataFim: form.dataFim,
			ano: form.ano,
			cargaHoraria: form.cargaHoraria,
			tipo: "professor",
			nomeProjeto: form.nomeProjeto,
			codigoProjeto: form.codigoProjeto,
		});
	};

	const formValido = form.matricula.trim() && form.curso.trim() && turmaId;

	return (
		<div className="view-nexus-diretoria-professores-modal-declaracao fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 backdrop-blur-sm sm:items-center sm:px-4">
			<div className="max-h-[96dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-h-[90vh] sm:rounded-2xl">
				{/* Header */}
				<div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-6">
					<div className="flex min-w-0 items-center gap-2">
						<FileText className="w-5 h-5 text-amber-600" />
						<h2 className="break-words text-sm font-semibold text-gray-900">
							Gerar Declaração — Professor
						</h2>
					</div>
					<button
						onClick={onClose}
						className="grid h-11 w-11 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					>
						<X className="w-4 h-4" />
					</button>
				</div>

				{/* Nome (somente leitura) */}
				<div className="px-4 pt-5 sm:px-6">
					<div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100">
						<div className="w-9 h-9 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-semibold">
							{iniciais(professor.nome) || "?"}
						</div>
						<div className="min-w-0">
							<p className="break-words text-sm font-semibold text-gray-900">
								{professor.nome}
							</p>
							<p className="break-all text-xs text-gray-500">
								{professor.email}
							</p>
						</div>
					</div>
				</div>

				{/* Campos */}
				<div className="space-y-4 px-4 py-5 sm:px-6">
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
							Matrícula *
						</label>
						<input
							value={form.matricula}
							onChange={(e) => setForm({ ...form, matricula: e.target.value })}
							placeholder="20250032396"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
					</div>

					{/* Cursos */}
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
							Turma de referência *
						</label>
						<select
							value={turmaId}
							onChange={(e) => setTurmaId(e.target.value)}
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						>
							<option value="">Selecione uma turma</option>
							{professor.turmasDetalhadas.map((turma) => (
								<option key={turma.id} value={turma.id}>
									{turma.titulo} — {turma.semestre}
								</option>
							))}
						</select>
						<p className="mt-1 text-[11px] text-gray-400">
							O semestre e as datas serão calculados pela primeira e última aula
							desta turma.
						</p>
					</div>
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
							Cursos ministrados *
						</label>
						<input
							value={form.curso}
							onChange={(e) => setForm({ ...form, curso: e.target.value })}
							placeholder="Pensamento Computacional e Computador"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
						<p className="text-[11px] text-gray-400 mt-1">
							Use &quot;e&quot; para separar cursos. Ex: &quot;Smartphone Básico
							e Smartphone Avançado&quot;
						</p>
					</div>

					{/* Linha: Período */}
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
								Data Início
							</label>
							<input
								value={form.dataInicio}
								readOnly
								className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
								Data Fim
							</label>
							<input
								value={form.dataFim}
								readOnly
								className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
								Ano
							</label>
							<input
								value={form.ano}
								readOnly
								className="w-full rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
							/>
						</div>
					</div>
					<p className="-mt-2 text-[11px] text-sky-700">
						As datas e o ano do documento são definidos automaticamente pelas
						aulas cadastradas na turma selecionada.
					</p>

					{/* Carga Horária */}
					<div>
						<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
							Carga Horária
						</label>
						<input
							value={form.cargaHoraria}
							onChange={(e) =>
								setForm({ ...form, cargaHoraria: e.target.value })
							}
							placeholder="54 horas"
							className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
						/>
					</div>

					{/* Linha: Projeto */}
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
						<div className="sm:col-span-2">
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
								Nome do Projeto
							</label>
							<input
								value={form.nomeProjeto}
								onChange={(e) =>
									setForm({ ...form, nomeProjeto: e.target.value })
								}
								placeholder="Projeto de Extensão..."
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
						<div>
							<label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
								Código
							</label>
							<input
								value={form.codigoProjeto}
								onChange={(e) =>
									setForm({ ...form, codigoProjeto: e.target.value })
								}
								placeholder="PJ457-2026"
								className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-sky-300 focus:outline-none transition-colors"
							/>
						</div>
					</div>

					{/* Preview do texto */}
					<div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
						<p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1.5">
							Prévia do texto
						</p>
						<p className="text-xs text-gray-600 leading-relaxed">
							Declaro, para os fins que se fizerem necessários, que{" "}
							<strong>o(a) discente {professor.nome}</strong>, matrícula{" "}
							<strong>{form.matricula || "___"}</strong>, está vinculado(a) ao{" "}
							<strong>{form.nomeProjeto}</strong> (
							<strong>{form.codigoProjeto}</strong>) , no período de{" "}
							<strong>{form.dataInicio}</strong> a{" "}
							<strong>{form.dataFim}</strong> de <strong>{form.ano}</strong>,
							com uma carga horária total de{" "}
							<strong>{form.cargaHoraria}</strong>. O(a) discente atuou como{" "}
							<strong>professor(a)</strong>{" "}
							{form.curso.includes(" e ") ? "dos cursos de" : "do curso de"}{" "}
							<strong>{form.curso || "___"}</strong>.
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="flex flex-col-reverse gap-3 border-t border-gray-100 bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
					<button
						onClick={onClose}
						className="min-h-11 w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-200 sm:w-auto"
					>
						Cancelar
					</button>
					<button
						onClick={handleGerar}
						disabled={!formValido || gerarMutation.isPending}
						className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-amber-700 disabled:opacity-50 sm:w-auto"
					>
						{gerarMutation.isPending ? (
							<Loader2 className="w-4 h-4 animate-spin" />
						) : (
							<FileText className="w-4 h-4" />
						)}
						{gerarMutation.isPending ? "Gerando..." : "Gerar Declaração"}
					</button>
				</div>
			</div>
		</div>
	);
}
