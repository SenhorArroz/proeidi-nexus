"use client";

type FichaCadastralAlunoProps = {
	dadosPessoais: string[][];
	contato: (string | null)[][];
	respostasConfirmacao: (string | null)[][];
};
export function FichaCadastralAluno({
	dadosPessoais,
	contato,
	respostasConfirmacao,
}: FichaCadastralAlunoProps) {
	return (
		<section className="view-ficha-cadastral-aluno rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,.06)] sm:p-5">
			<h2 className="font-extrabold text-slate-900">
				Informações completas do aluno
			</h2>
			<div className="mt-5 space-y-6">
				<div>
					<h3 className="font-bold text-slate-800">Dados pessoais</h3>
					<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
						{dadosPessoais.map(([rotulo, valor]) => (
							<div key={rotulo} className="min-w-0 rounded-xl bg-slate-50 p-3">
								<dt className="text-xs font-bold text-slate-500">{rotulo}</dt>
								<dd className="mt-1 break-words font-semibold text-slate-800">
									{valor || "Não informado"}
								</dd>
							</div>
						))}
					</dl>
				</div>
				<div>
					<h3 className="font-bold text-slate-800">Contato</h3>
					<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
						{contato.map(([rotulo, valor]) => (
							<div key={rotulo} className="min-w-0 rounded-xl bg-slate-50 p-3">
								<dt className="text-xs font-bold text-slate-500">{rotulo}</dt>
								<dd className="mt-1 break-words font-semibold text-slate-800">
									{valor || "Não informado"}
								</dd>
							</div>
						))}
					</dl>
				</div>
				<div>
					<h3 className="font-bold text-slate-800">
						Respostas da confirmação de inscrição
					</h3>
					<p className="mt-1 text-sm text-slate-500">
						Campos respondidos pelo aluno no momento da adição.
					</p>
					<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
						{respostasConfirmacao.map(([rotulo, valor]) => (
							<div key={rotulo} className="min-w-0 rounded-xl bg-slate-50 p-3">
								<dt className="text-xs font-bold text-slate-500">{rotulo}</dt>
								<dd className="mt-1 break-words font-semibold text-slate-800">
									{valor || "Não informado"}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</section>
	);
}
