"use client";
import { FichaCadastralAluno } from "./_components/ficha-cadastral-aluno";
import { HistoricoMatriculasAluno } from "./_components/historico-matriculas-aluno";
import { simNao } from "./_components/suporte";

import { ArrowLeft, UserRound } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

export default function DetalheAluno({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const { data: aluno, isLoading, error } = api.aluno.detalhe.useQuery({ id });
	const { data: historico, isLoading: carregandoHistorico } =
		api.diretoria.alunos.historico.useQuery({ alunoId: id });
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
			<span
				aria-hidden="true"
				className="pointer-events-none absolute -left-32 top-52 h-96 w-96 rounded-full bg-sky-600/25 blur-3xl"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute -right-28 top-[28rem] h-[28rem] w-[28rem] rounded-full bg-amber-600/20 blur-3xl"
			/>
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
					<FichaCadastralAluno
						dadosPessoais={dadosPessoais}
						contato={contato}
						respostasConfirmacao={respostasConfirmacao}
					/>
					<HistoricoMatriculasAluno
						carregandoHistorico={carregandoHistorico}
						historico={historico}
					/>
				</div>
			</div>
		</main>
	);
}
