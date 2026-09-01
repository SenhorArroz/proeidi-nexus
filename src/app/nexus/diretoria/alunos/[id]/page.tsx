"use client";

import { use } from "react";
import Link from "next/link";
import {
	ArrowLeft,
	CalendarDays,
	GraduationCap,
	MapPin,
	UserRound,
} from "lucide-react";
import { api } from "~/trpc/react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";

const simNao = (valor: boolean) => (valor ? "Sim" : "Não");

export default function DetalheAluno({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: aluno, isLoading, error } = api.aluno.detalhe.useQuery({ id });
	if (isLoading)
		return (
			<main className="min-h-full px-4 py-8">
				<div className="mx-auto max-w-5xl">
					<DataSkeleton cards={4} />
				</div>
			</main>
		);
	if (error || !aluno)
		return (
			<main className="grid min-h-full place-items-center p-6 text-center text-slate-600">
				Aluno não encontrado.
			</main>
		);
	const turmas = [...aluno.turmas].sort(
		(a, b) =>
			b.turma.semestre.codigo.localeCompare(a.turma.semestre.codigo) ||
			a.turma.titulo.localeCompare(b.turma.titulo),
	);
	const dadosPessoais = [
		["CPF", aluno.cpf],
		[
			"Data de nascimento",
			new Intl.DateTimeFormat("pt-BR").format(aluno.dataNascimento),
		],
		["Raça/cor", aluno.corRaca],
		["Identidade de gênero", aluno.identidadeGenero],
		["LGBTQIAPN+", aluno.lgbtqiapn],
		["Escolaridade", aluno.escolaridade],
		["Cuida de terceiros", simNao(aluno.cuidaTerceiros)],
	];
	const contato = [
		["Telefone", aluno.telefone],
		["E-mail", aluno.email],
		["Contato de emergência", aluno.contatoEmergencia],
	];
	const respostasConfirmacao = [
		["Trabalha?", simNao(aluno.trabalha)],
		["Local de trabalho", aluno.trabalhoLocal],
		["Função no trabalho", aluno.trabalhoFuncao],
		["Estuda?", simNao(aluno.estuda)],
		["Local de estudo", aluno.estudoLocal],
		["Curso", aluno.estudoCurso],
		["Possui problema de saúde?", simNao(aluno.problemaSaude)],
		["Qual problema de saúde?", aluno.problemaSaudeQual],
		["Possui necessidade especial?", simNao(aluno.necessidadeEspecial)],
		["Qual necessidade especial?", aluno.necessidadeEspecialQual],
		["Acesso à internet?", simNao(aluno.acessoInternet)],
		["Possui computador?", simNao(aluno.temComputador)],
		["Possui smartphone?", simNao(aluno.temSmartphone)],
		["Sistema do smartphone", aluno.sistemaSmartphone],
	];
	return (
		<main className="relative min-h-full overflow-hidden px-3 sm:px-4 sm:py-4">
			<span aria-hidden="true" className="pointer-events-none absolute -left-32 top-52 h-96 w-96 rounded-full bg-sky-600/25 blur-3xl" />
			<span aria-hidden="true" className="pointer-events-none absolute -right-28 top-[28rem] h-[28rem] w-[28rem] rounded-full bg-amber-600/20 blur-3xl" />
			<div className="relative mx-auto max-w-5xl">
				<Link
					href="/nexus/diretoria/alunos"
					className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-sky-700"
				>
					<ArrowLeft className="h-4 w-4" /> Alunos
				</Link>
				<header className="mt-3 min-w-0 rounded-3xl bg-sky-600 p-5 text-white shadow-[0_20px_45px_rgba(2,132,199,.22)] sm:p-7">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
						<div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15">
							<UserRound className="h-7 w-7" />
						</div>
						<div className="min-w-0">
							<h1 className="break-words text-2xl font-black sm:text-3xl">
								{aluno.nome}
							</h1>
							<p className="mt-1 text-sky-100">
								Cadastro atual: semestre {aluno.semestre.codigo}
							</p>
						</div>
					</div>
				</header>

				<div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
					<section className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,.06)] sm:p-5">
						<h2 className="font-extrabold text-slate-900">
							Informações completas do aluno
						</h2>
						<div className="mt-5 space-y-6">
							<div>
								<h3 className="font-bold text-slate-800">Dados pessoais</h3>
								<dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
									{dadosPessoais.map(([rotulo, valor]) => (
										<div
											key={rotulo}
											className="min-w-0 rounded-xl bg-slate-50 p-3"
										>
											<dt className="text-xs font-bold text-slate-500">
												{rotulo}
											</dt>
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
										<div
											key={rotulo}
											className="min-w-0 rounded-xl bg-slate-50 p-3"
										>
											<dt className="text-xs font-bold text-slate-500">
												{rotulo}
											</dt>
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
										<div
											key={rotulo}
											className="min-w-0 rounded-xl bg-slate-50 p-3"
										>
											<dt className="text-xs font-bold text-slate-500">
												{rotulo}
											</dt>
											<dd className="mt-1 break-words font-semibold text-slate-800">
												{valor || "Não informado"}
											</dd>
										</div>
									))}
								</dl>
							</div>
						</div>
					</section>
					<section className="rounded-2xl bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,.06)] sm:p-5">
						<h2 className="flex items-center gap-2 font-extrabold text-slate-900">
							<GraduationCap className="h-5 w-5 text-orange-600" /> Histórico de
							turmas
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							Todas as turmas às quais este aluno já foi vinculado.
						</p>
						<div className="mt-4 space-y-3">
							{turmas.length ? (
								turmas.map(({ turma }) => (
									<article
										key={turma.id}
										className="rounded-xl border border-slate-100 p-3"
									>
										<div className="flex items-start gap-3">
											<span
												className="mt-1 h-3 w-3 shrink-0 rounded-full"
												style={{ backgroundColor: turma.cor }}
											/>
											<div className="min-w-0">
												<h3 className="break-words font-bold text-slate-900">
													{turma.titulo}
												</h3>
												<p className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
													<span className="inline-flex items-center gap-1">
														<CalendarDays className="h-3.5 w-3.5" />
														{turma.semestre.codigo}
													</span>
													{turma.horario && <span>{turma.horario}</span>}
													{turma.sala && (
														<span className="inline-flex items-center gap-1">
															<MapPin className="h-3.5 w-3.5" />
															{turma.sala}
														</span>
													)}
												</p>
											</div>
										</div>
									</article>
								))
							) : (
								<p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
									Nenhuma turma vinculada.
								</p>
							)}
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
