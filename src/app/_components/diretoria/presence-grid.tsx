export type EstadoPresenca = "PRESENTE" | "AUSENTE" | "JUSTIFICADO";
export type PessoaPresenca = {
	id: string;
	nome: string;
	role?: string;
	estado: EstadoPresenca;
};

const hoje = () => new Date().toISOString().slice(0, 10);

/** The attendance matrix is kept outside the route so the page only coordinates data and mutations. */
export function PresenceGrid({
	titulo,
	pessoas,
	datas,
	estadoNaData,
	onAlterar,
}: {
	titulo: string;
	pessoas: PessoaPresenca[];
	datas: string[];
	estadoNaData: (id: string, data: string) => EstadoPresenca;
	onAlterar: (id: string, data: string, estado: EstadoPresenca) => void;
}) {
	return (
		<section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.06)]">
			<div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 px-4 py-3 sm:px-5">
				<h2 className="break-words font-extrabold text-slate-800">{titulo}</h2>
				<span className="shrink-0 text-xs font-semibold text-sky-700">
					{pessoas.length} pessoa(s)
				</span>
			</div>
			{pessoas.length ? (
				<div className="overflow-x-auto">
					<table className="w-full min-w-max text-left text-sm">
						<thead className="border-b border-sky-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
							<tr>
								<th className="sticky left-0 z-10 min-w-40 bg-slate-50 px-3 py-3 font-semibold sm:min-w-52 sm:px-5">Nome</th>
								{datas.map((dia) => (
									<th key={dia} className="min-w-36 px-3 py-3 text-center font-semibold">
										{new Date(`${dia}T12:00:00`).toLocaleDateString("pt-BR")}
									</th>
								))}
							</tr>
						</thead>
						<tbody className="divide-y divide-slate-100">
							{pessoas.map((pessoa) => (
								<tr key={pessoa.id}>
									<td className="sticky left-0 z-10 max-w-40 bg-white px-3 py-3 sm:max-w-52 sm:px-5">
										<p className="break-words font-semibold text-slate-800">{pessoa.nome}</p>
										{pessoa.role === "DIRETOR" && <p className="text-xs font-medium text-orange-700">Diretor · docente</p>}
									</td>
									{datas.map((dia) => {
										const estado = estadoNaData(pessoa.id, dia);
										const futuro = dia > hoje();
										return (
											<td key={dia} className="px-3 py-3 text-center">
												{futuro ? (
													<select disabled value="A_REGISTRAR" className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-slate-500">
														<option value="A_REGISTRAR">A registrar</option>
													</select>
												) : (
													<select
														value={estado}
														onChange={(event) => onAlterar(pessoa.id, dia, event.target.value as EstadoPresenca)}
														className={`w-full rounded-lg border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 ${estado === "PRESENTE" ? "border-green-300 bg-green-50 text-green-800 focus:ring-green-600" : estado === "AUSENTE" ? "border-red-300 bg-red-50 text-red-800 focus:ring-red-600" : "border-amber-300 bg-amber-50 text-amber-800 focus:ring-amber-600"}`}
													>
														<option value="PRESENTE">Presente</option>
														<option value="AUSENTE">Ausente</option>
														<option value="JUSTIFICADO">Justificado</option>
													</select>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			) : (
				<p className="px-4 py-6 text-sm text-slate-500 sm:px-5">Nenhuma pessoa vinculada a esta turma.</p>
			)}
		</section>
	);
}
