"use client";

import { CampoFichaAluno } from "./campo-ficha-aluno";

export function FichaAlunoCompleta({ aluno }: { aluno: any }) {
	const simNao = (valor: boolean) => (valor ? "Sim" : "Não");
	const dataNascimento = aluno.dataNascimento
		? new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(
				new Date(aluno.dataNascimento),
			)
		: "Não informada";

	return (
		<div className="view-nexus-diretoria-turmas-ficha-aluno-completa mt-5 space-y-6">
			<section>
				<h3 className="font-bold text-slate-900">Dados pessoais</h3>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno label="Data de nascimento" valor={dataNascimento} />
					<CampoFichaAluno label="CPF" valor={aluno.cpf} />
					<CampoFichaAluno label="Cor ou raça" valor={aluno.corRaca} />
					<CampoFichaAluno
						label="Identidade de gênero"
						valor={aluno.identidadeGenero}
					/>
					<CampoFichaAluno label="LGBTQIAPN+" valor={aluno.lgbtqiapn} />
					<CampoFichaAluno label="Escolaridade" valor={aluno.escolaridade} />
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">Contato</h3>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno label="E-mail" valor={aluno.email} />
					<CampoFichaAluno label="Telefone" valor={aluno.telefone} />
					<CampoFichaAluno
						label="Contato de emergência"
						valor={aluno.contatoEmergencia}
					/>
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">
					Respostas da confirmação de inscrição
				</h3>
				<p className="mt-1 text-sm text-slate-500">
					Informações respondidas pelo aluno no momento da adição.
				</p>
				<dl className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
					<CampoFichaAluno
						label="Cuida de terceiros?"
						valor={simNao(aluno.cuidaTerceiros)}
					/>
					<CampoFichaAluno label="Trabalha?" valor={simNao(aluno.trabalha)} />
					<CampoFichaAluno
						label="Local de trabalho"
						valor={aluno.trabalhoLocal}
					/>
					<CampoFichaAluno
						label="Função no trabalho"
						valor={aluno.trabalhoFuncao}
					/>
					<CampoFichaAluno label="Estuda?" valor={simNao(aluno.estuda)} />
					<CampoFichaAluno label="Local de estudo" valor={aluno.estudoLocal} />
					<CampoFichaAluno label="Curso" valor={aluno.estudoCurso} />
					<CampoFichaAluno
						label="Possui problema de saúde?"
						valor={simNao(aluno.problemaSaude)}
					/>
					<CampoFichaAluno
						label="Qual problema de saúde?"
						valor={aluno.problemaSaudeQual}
					/>
					<CampoFichaAluno
						label="Possui necessidade especial?"
						valor={simNao(aluno.necessidadeEspecial)}
					/>
					<CampoFichaAluno
						label="Qual necessidade especial?"
						valor={aluno.necessidadeEspecialQual}
					/>
					<CampoFichaAluno
						label="Acesso à internet?"
						valor={simNao(aluno.acessoInternet)}
					/>
					<CampoFichaAluno
						label="Possui computador?"
						valor={simNao(aluno.temComputador)}
					/>
					<CampoFichaAluno
						label="Possui smartphone?"
						valor={simNao(aluno.temSmartphone)}
					/>
					<CampoFichaAluno
						label="Sistema do smartphone"
						valor={aluno.sistemaSmartphone}
					/>
				</dl>
			</section>

			<section>
				<h3 className="font-bold text-slate-900">
					Histórico completo de turmas
				</h3>
				<div className="mt-3 space-y-2">
					{aluno.turmas?.length ? (
						aluno.turmas.map((vinculo: any) => (
							<div
								key={vinculo.turma.id}
								className="flex min-w-0 flex-col gap-2 rounded-lg bg-slate-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
							>
								<div className="min-w-0">
									<p className="truncate text-sm font-bold text-slate-900">
										{vinculo.turma.titulo}
									</p>
									<p className="mt-0.5 text-xs text-slate-500">
										{vinculo.turma.sala || "Sala não definida"}
										{vinculo.turma.horario ? ` · ${vinculo.turma.horario}` : ""}
									</p>
								</div>
								<span
									className="shrink-0 text-xs font-bold"
									style={{ color: vinculo.turma.cor }}
								>
									{vinculo.turma.semestre?.codigo ?? "Semestre não informado"}
								</span>
							</div>
						))
					) : (
						<p className="text-sm text-slate-500">Nenhuma turma registrada.</p>
					)}
				</div>
			</section>
		</div>
	);
}
