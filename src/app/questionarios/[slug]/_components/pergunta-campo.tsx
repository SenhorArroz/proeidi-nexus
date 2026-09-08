"use client";

import { type Pergunta } from "./suporte";

export function PerguntaCampo({
	pergunta,
	respostas,
	onChange,
}: {
	pergunta: Pergunta;
	respostas: Record<string, string | string[]>;
	onChange: (respostas: Record<string, string | string[]>) => void;
}) {
	const valor = respostas[pergunta.id];
	const anterior = Array.isArray(valor) ? valor : [];
	return (
		<label className="view-app-questionarios-slug-pergunta-campo block min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
			<span className="break-words font-bold text-slate-800">
				{pergunta.titulo}
				{pergunta.obrigatoria && <span className="text-orange-600"> *</span>}
			</span>
			{pergunta.tipo === "paragraph" ? (
				<textarea
					required={pergunta.obrigatoria}
					value={(valor as string) ?? ""}
					onChange={(event) =>
						onChange({ ...respostas, [pergunta.id]: event.target.value })
					}
					className="mt-3 min-h-28 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base"
				/>
			) : pergunta.tipo === "short_text" ? (
				<input
					required={pergunta.obrigatoria}
					value={(valor as string) ?? ""}
					onChange={(event) =>
						onChange({ ...respostas, [pergunta.id]: event.target.value })
					}
					className="mt-3 min-h-11 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base"
				/>
			) : (
				<span className="mt-3 grid min-w-0 gap-2">
					{pergunta.opcoes.map((opcao) => (
						<label
							key={opcao.id}
							className="flex min-h-11 min-w-0 items-center gap-3 text-sm text-slate-700"
						>
							<input
								required={
									pergunta.obrigatoria && pergunta.tipo === "multiple_choice"
								}
								type={pergunta.tipo === "checkbox" ? "checkbox" : "radio"}
								name={pergunta.id}
								checked={
									pergunta.tipo === "checkbox"
										? anterior.includes(opcao.texto)
										: valor === opcao.texto
								}
								className="h-5 w-5 shrink-0"
								onChange={(event) =>
									onChange({
										...respostas,
										[pergunta.id]:
											pergunta.tipo === "checkbox"
												? event.target.checked
													? [...anterior, opcao.texto]
													: anterior.filter((item) => item !== opcao.texto)
												: opcao.texto,
									})
								}
							/>
							<span className="min-w-0 break-words">{opcao.texto}</span>
						</label>
					))}
				</span>
			)}
		</label>
	);
}
