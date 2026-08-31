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
	cores,
}: {
	titulo: string;
	pessoas: PessoaPresenca[];
	datas: string[];
	estadoNaData: (id: string, data: string) => EstadoPresenca;
	onAlterar: (id: string, data: string, estado: EstadoPresenca) => void;
	cores: { presente: string; ausente: string; justificado: string };
}) {
	const estados = ["PRESENTE", "AUSENTE", "JUSTIFICADO"] as const;
	const totais = estados.map((estado) => ({
		estado,
		total: pessoas.reduce((acumulado, pessoa) => acumulado + datas.filter((dia) => estadoNaData(pessoa.id, dia) === estado).length, 0),
	}));
	const corDoEstado = (estado: EstadoPresenca) => estado === "PRESENTE" ? cores.presente : estado === "AUSENTE" ? cores.ausente : cores.justificado;
	return (
		<section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.06)]">
			<div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 px-4 py-3 sm:px-5">
				<h2 className="break-words font-extrabold text-slate-800">{titulo}</h2>
				<span className="shrink-0 text-xs font-semibold text-sky-700">
					{pessoas.length} pessoa(s)
				</span>
			</div>
			<div className="grid grid-cols-3 gap-2 border-b border-slate-100 p-3 sm:px-5">
				{totais.map(({ estado, total }) => <div key={estado} className="rounded-lg border px-3 py-2" style={{ borderColor: `${corDoEstado(estado)}55`, backgroundColor: `${corDoEstado(estado)}12` }}><p className="text-xs font-semibold" style={{ color: corDoEstado(estado) }}>{estado === "PRESENTE" ? "Presentes" : estado === "AUSENTE" ? "Ausentes" : "Justificados"}</p><p className="mt-1 text-lg font-bold" style={{ color: corDoEstado(estado) }}>{total}</p></div>)}
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
													className="w-full rounded-lg border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1"
													style={{ color: corDoEstado(estado), borderColor: `${corDoEstado(estado)}66`, backgroundColor: `${corDoEstado(estado)}12` }}
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
