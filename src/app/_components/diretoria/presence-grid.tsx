import { CalendarDays, ChevronDown } from "lucide-react";

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
	const hojeIso = hoje();
	const diaInicialAberto = datas.reduce<string | null>(
		(maisRecente, dia) =>
			dia <= hojeIso && (!maisRecente || dia > maisRecente) ? dia : maisRecente,
		null,
	);
	const totais = estados.map((estado) => ({
		estado,
		total: pessoas.reduce(
			(acumulado, pessoa) =>
				acumulado +
				datas.filter(
					(dia) => dia <= hojeIso && estadoNaData(pessoa.id, dia) === estado,
				).length,
			0,
		),
	}));
	const corDoEstado = (estado: EstadoPresenca) =>
		estado === "PRESENTE"
			? cores.presente
			: estado === "AUSENTE"
				? cores.ausente
				: cores.justificado;
	const formatarData = (dia: string, completa = false) =>
		new Date(`${dia}T12:00:00`).toLocaleDateString(
			"pt-BR",
			completa
				? { weekday: "short", day: "2-digit", month: "short" }
				: undefined,
		);
	const seletorPresenca = (pessoa: PessoaPresenca, dia: string) => {
		const estado = estadoNaData(pessoa.id, dia);
		const futuro = dia > hojeIso;
		const rotulo = `Presença de ${pessoa.nome} em ${formatarData(dia)}`;

		return futuro ? (
			<select
				disabled
				value="A_REGISTRAR"
				aria-label={rotulo}
				className="min-h-11 w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-2 py-2 text-sm text-slate-500"
			>
				<option value="A_REGISTRAR">A registrar</option>
			</select>
		) : (
			<select
				value={estado}
				aria-label={rotulo}
				onChange={(event) =>
					onAlterar(pessoa.id, dia, event.target.value as EstadoPresenca)
				}
				className="min-h-11 w-full rounded-lg border px-2 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1"
				style={{
					color: corDoEstado(estado),
					borderColor: `${corDoEstado(estado)}66`,
					backgroundColor: `${corDoEstado(estado)}12`,
				}}
			>
				<option value="PRESENTE">Presente</option>
				<option value="AUSENTE">Ausente</option>
				<option value="JUSTIFICADO">Justificado</option>
			</select>
		);
	};
	return (
		<section className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-[0_12px_30px_rgba(15,23,42,.06)]">
			<div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 px-4 py-3 sm:px-5">
				<h2 className="break-words font-extrabold text-slate-800">{titulo}</h2>
				<span className="shrink-0 text-xs font-semibold text-sky-700">
					{pessoas.length} pessoa(s)
				</span>
			</div>
			<div className="grid grid-cols-3 gap-2 border-b border-slate-100 p-3 sm:px-5">
				{totais.map(({ estado, total }) => (
					<div
						key={estado}
						className="min-w-0 rounded-lg border px-2 py-2 sm:px-3"
						style={{
							borderColor: `${corDoEstado(estado)}55`,
							backgroundColor: `${corDoEstado(estado)}12`,
						}}
					>
						<p
							className="truncate text-[11px] font-semibold sm:text-xs"
							style={{ color: corDoEstado(estado) }}
						>
							{estado === "PRESENTE"
								? "Presentes"
								: estado === "AUSENTE"
									? "Ausentes"
									: "Justificados"}
						</p>
						<p
							className="mt-1 text-lg font-bold tabular-nums"
							style={{ color: corDoEstado(estado) }}
						>
							{total}
						</p>
					</div>
				))}
			</div>
			{pessoas.length ? (
				<>
					<p className="border-b border-slate-100 bg-slate-50/70 px-4 py-3 text-xs font-medium text-slate-600 lg:hidden">
						Toque em um dia para abrir ou fechar a lista de presenças.
					</p>
					<div className="divide-y divide-slate-200 lg:hidden">
						{datas.map((dia) => {
							const futuro = dia > hojeIso;
							return (
								<details
									key={dia}
									className="group"
									open={dia === diaInicialAberto || undefined}
								>
									<summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 bg-slate-50 px-4 py-3 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500 [&::-webkit-details-marker]:hidden">
										<h3
											id={`presenca-dia-${dia}`}
											className="flex min-w-0 items-center gap-2 text-sm font-extrabold text-slate-800"
										>
											<CalendarDays
												className="h-4 w-4 shrink-0 text-sky-600"
												aria-hidden="true"
											/>
											<time dateTime={dia} className="capitalize">
												{formatarData(dia, true)}
											</time>
										</h3>
										<div className="flex shrink-0 items-center gap-2">
											{futuro && (
												<span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold text-slate-600">
													Aula futura
												</span>
											)}
											<ChevronDown
												className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180"
												aria-hidden="true"
											/>
										</div>
									</summary>
									{futuro ? (
										<p className="px-4 py-4 text-sm text-slate-600">
											A presença será liberada no dia da aula.
										</p>
									) : (
										<div className="divide-y divide-slate-100 px-4">
											{pessoas.map((pessoa) => (
												<div
													key={pessoa.id}
													className="grid grid-cols-[minmax(0,1fr)_minmax(8rem,9rem)] items-center gap-3 py-3"
												>
													<div className="min-w-0">
														<p className="break-words text-sm font-semibold leading-snug text-slate-800">
															{pessoa.nome}
														</p>
														{pessoa.role === "DIRETOR" && (
															<p className="mt-0.5 text-xs font-medium text-orange-700">
																Diretor · docente
															</p>
														)}
													</div>
													{seletorPresenca(pessoa, dia)}
												</div>
											))}
										</div>
									)}
								</details>
							);
						})}
					</div>
					<div className="hidden overflow-x-auto overscroll-x-contain lg:block">
						<table className="w-full min-w-max text-left text-sm">
							<thead className="border-b border-sky-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
								<tr>
									<th className="sticky left-0 z-10 min-w-40 bg-slate-50 px-3 py-3 font-semibold sm:min-w-52 sm:px-5">
										Nome
									</th>
									{datas.map((dia) => (
										<th
											key={dia}
											className="min-w-36 px-3 py-3 text-center font-semibold"
										>
											{formatarData(dia)}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-slate-100">
								{pessoas.map((pessoa) => (
									<tr key={pessoa.id}>
										<td className="sticky left-0 z-10 max-w-40 bg-white px-3 py-3 sm:max-w-52 sm:px-5">
											<p className="break-words font-semibold text-slate-800">
												{pessoa.nome}
											</p>
											{pessoa.role === "DIRETOR" && (
												<p className="text-xs font-medium text-orange-700">
													Diretor · docente
												</p>
											)}
										</td>
										{datas.map((dia) => (
											<td key={dia} className="px-3 py-3 text-center">
												{seletorPresenca(pessoa, dia)}
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</>
			) : (
				<p className="px-4 py-6 text-sm text-slate-500 sm:px-5">
					Nenhuma pessoa vinculada a esta turma.
				</p>
			)}
		</section>
	);
}
