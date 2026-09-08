"use client";

type PreviaAcessibilidadeProps = {};
export function PreviaAcessibilidade({}: PreviaAcessibilidadeProps) {
	return (
		<aside className="view-previa-acessibilidade min-w-0 rounded-2xl border border-sky-200 bg-sky-50 p-4 sm:p-6">
			<h2 className="text-lg font-bold text-sky-950">Prévia</h2>
			<p className="mt-1 text-sm text-sky-800">
				Veja o resultado das preferências antes de continuar.
			</p>
			<div className="mt-5 rounded-xl border border-sky-200 bg-white p-4">
				<p className="text-base font-bold text-slate-900">
					Leitura confortável para todos
				</p>
				<p className="mt-2 text-sm text-slate-600">
					O ProEIDI Nexus adapta a interface às suas necessidades, sem alterar
					seus dados ou permissões.
					<br />A - a
					<br />
					1234567890!@#$%¨&*()_+-=
				</p>
				<button
					type="button"
					className="mt-4 rounded-lg bg-sky-700 px-3 py-2 text-sm font-bold text-white"
				>
					Exemplo de ação
				</button>
			</div>
		</aside>
	);
}
