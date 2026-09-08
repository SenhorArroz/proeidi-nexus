"use client";

import { CalendarDays, Check, ClipboardList } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	type EstadoPresenca,
	type EventoCalendario,
	PRESENCA_CONFIG,
	type Pessoa,
	corLegivel,
	misturarCores,
} from "./suporte";

export function PresencaView({
	titulo,
	pessoas,
	setPessoas,
	cor,
	eventos,
	onSalvar,
	erroSalvar,
	salvando,
	coresEstado,
}: {
	titulo: string;
	pessoas: Pessoa[];
	setPessoas: React.Dispatch<React.SetStateAction<Pessoa[]>>;
	cor: string;
	eventos: EventoCalendario[];
	onSalvar: (data: string) => void;
	erroSalvar: string | null;
	salvando: boolean;
	coresEstado: { presente: string; ausente: string; justificado: string };
}) {
	const configuracaoPresenca = {
		...PRESENCA_CONFIG,
		presente: {
			...PRESENCA_CONFIG.presente,
			cor: coresEstado.presente,
			fundo: misturarCores(coresEstado.presente, "#ffffff", 0.86),
		},
		ausente: {
			...PRESENCA_CONFIG.ausente,
			cor: coresEstado.ausente,
			fundo: misturarCores(coresEstado.ausente, "#ffffff", 0.86),
		},
		justificado: {
			...PRESENCA_CONFIG.justificado,
			cor: coresEstado.justificado,
			fundo: misturarCores(coresEstado.justificado, "#ffffff", 0.12),
		},
	};
	const totais = useMemo(
		() =>
			pessoas.reduce(
				(acumulado, pessoa) => {
					acumulado[pessoa.presente] += 1;
					return acumulado;
				},
				{ presente: 0, ausente: 0, justificado: 0, a_registrar: 0 } as Record<
					EstadoPresenca,
					number
				>,
			),
		[pessoas],
	);
	const corTextoAcao = corLegivel("#ffffff", cor);
	const [dataSelecionada, setDataSelecionada] = useState("");

	const setPresenca = (id: string, valor: EstadoPresenca) =>
		setPessoas((prev) =>
			prev.map((p) => (p.id === id ? { ...p, presente: valor } : p)),
		);

	const marcarTodos = (valor: EstadoPresenca) =>
		setPessoas((prev) => prev.map((p) => ({ ...p, presente: valor })));

	const diasDeAula = useMemo(
		() =>
			eventos
				.filter((evento) => evento.tipo === "aula")
				.sort((a, b) => a.data.localeCompare(b.data)),
		[eventos],
	);

	useEffect(() => {
		setDataSelecionada((dataAtual) =>
			diasDeAula.some((aula) => aula.data === dataAtual)
				? dataAtual
				: (diasDeAula.at(-1)?.data ?? ""),
		);
	}, [diasDeAula]);

	return (
		<div className="view-dashboard-turmas-id-presenca-view mx-auto w-full max-w-6xl min-w-0 space-y-5 px-3 py-5 sm:px-6 lg:px-8">
			<section
				className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
				style={{ "--turma-secao-cor": cor } as React.CSSProperties}
			>
				<div className="border-b border-gray-200 p-4 sm:p-5">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<ClipboardList className="turma-presenca-icone h-5 w-5" />
								<h3 className="turma-presenca-titulo text-base font-bold sm:text-lg">
									{titulo}
								</h3>
							</div>
							<p className="turma-semantic-description mt-1 text-sm">
								Escolha uma data de aula, marque cada pessoa e então registre.
							</p>
						</div>
						<div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
							<label className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm sm:w-[18rem]">
								<CalendarDays className="turma-presenca-icone h-4 w-4 shrink-0" />
								<span className="sr-only">Dia da presença</span>
								<select
									value={dataSelecionada}
									onChange={(e) => setDataSelecionada(e.target.value)}
									disabled={diasDeAula.length === 0}
									className="turma-semantic-text min-w-0 flex-1 cursor-pointer bg-transparent text-sm font-medium outline-none"
								>
									{diasDeAula.length === 0 && (
										<option value="">Nenhuma aula cadastrada</option>
									)}
									{diasDeAula.map((aula) => (
										<option key={aula.id} value={aula.data}>
											{aula.data.split("-").reverse().join("/")} · {aula.titulo}
										</option>
									))}
								</select>
							</label>
							<button
								onClick={() => onSalvar(dataSelecionada)}
								disabled={
									!dataSelecionada || totais.a_registrar > 0 || salvando
								}
								style={{ backgroundColor: cor, color: corTextoAcao }}
								className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-bold transition hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
							>
								<Check className="h-4 w-4" />
								{salvando ? "Salvando..." : "Salvar presença"}
							</button>
						</div>
					</div>

					<div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
						{(
							Object.entries(configuracaoPresenca) as [
								EstadoPresenca,
								(typeof configuracaoPresenca)[EstadoPresenca],
							][]
						).map(([estado, config]) => {
							const Icone = config.icone;
							return (
								<div
									key={estado}
									className="rounded-xl border px-3 py-2.5"
									style={{
										backgroundColor: `${cor}0D`,
										borderColor: `${cor}30`,
									}}
								>
									<div
										className="flex items-center justify-between gap-2 text-xs font-semibold"
										style={{ color: config.cor }}
									>
										<span>{config.curta}</span>
										<Icone className="h-3.5 w-3.5" aria-hidden="true" />
									</div>
									<p
										className="mt-1 text-2xl font-bold tabular-nums leading-none"
										style={{ color: cor }}
									>
										{totais[estado]}
									</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="flex flex-col gap-2 border-b border-gray-200 bg-gray-50/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
					<p className="turma-semantic-description text-xs">
						{pessoas.length}{" "}
						{pessoas.length === 1 ? "pessoa na lista" : "pessoas na lista"} ·
						selecione um estado para cada uma.
					</p>
					<div className="grid grid-cols-2 gap-2 sm:flex">
						<button
							onClick={() => marcarTodos("presente")}
							className="min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95"
							style={{
								color: configuracaoPresenca.presente.cor,
								backgroundColor: configuracaoPresenca.presente.fundo,
							}}
						>
							Todos presentes
						</button>
						<button
							onClick={() => marcarTodos("ausente")}
							className="min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95"
							style={{
								color: configuracaoPresenca.ausente.cor,
								backgroundColor: configuracaoPresenca.ausente.fundo,
							}}
						>
							Todos ausentes
						</button>
						<button
							onClick={() => marcarTodos("a_registrar")}
							className="col-span-2 min-h-11 rounded-lg px-3 text-xs font-bold transition hover:brightness-95 sm:col-span-1"
							style={{
								color: configuracaoPresenca.a_registrar.cor,
								backgroundColor: configuracaoPresenca.a_registrar.fundo,
							}}
						>
							Limpar marcações
						</button>
					</div>
				</div>
				{erroSalvar && (
					<p
						role="alert"
						className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 sm:mx-5"
					>
						{erroSalvar}
					</p>
				)}

				<div className="divide-y divide-gray-100">
					{pessoas.map((p) => (
						<div
							key={p.id}
							className="flex min-w-0 flex-col gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50/50 sm:px-5 lg:flex-row lg:items-center"
						>
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<div
									className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold"
									style={{ backgroundColor: cor, color: corTextoAcao }}
								>
									{p.nome[0]}
								</div>
								<span className="turma-semantic-text min-w-0 truncate text-sm font-semibold">
									{p.nome}
								</span>
							</div>
							<div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:w-[27rem]">
								{(
									Object.entries(configuracaoPresenca) as [
										EstadoPresenca,
										(typeof configuracaoPresenca)[EstadoPresenca],
									][]
								).map(([estado, config]) => {
									const Icone = config.icone;
									const selecionado = p.presente === estado;
									return (
										<button
											key={estado}
											onClick={() => setPresenca(p.id, estado)}
											aria-pressed={selecionado}
											className="flex min-h-11 items-center justify-center gap-1.5 rounded-lg border px-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
											style={{
												color: config.cor,
												backgroundColor: selecionado
													? config.fundo
													: "transparent",
												borderColor: selecionado
													? config.cor
													: `${config.cor}45`,
												boxShadow: selecionado
													? `inset 0 0 0 1px ${config.cor}`
													: undefined,
											}}
										>
											<Icone className="h-3.5 w-3.5" aria-hidden="true" />
											{config.label}
										</button>
									);
								})}
							</div>
						</div>
					))}
					{pessoas.length === 0 && (
						<p className="turma-semantic-description text-center py-10 text-sm">
							Nenhuma pessoa cadastrada
						</p>
					)}
				</div>
			</section>
		</div>
	);
}
