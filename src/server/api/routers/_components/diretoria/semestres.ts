import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter } from "~/server/api/trpc";
import { directorProcedure, id } from "./procedures";

export const semestresRouter = createTRPCRouter({
	list: directorProcedure.query(async ({ ctx }) => {
		const [semestres, professores, monitores] = await Promise.all([
			ctx.db.semestre.findMany({
				select: {
					id: true,
					codigo: true,
					ativo: true,
					_count: { select: { turmas: true, alunos: true } },
				},
				orderBy: { codigo: "asc" },
			}),
			ctx.db.professorTurma.findMany({
				select: { userId: true, turma: { select: { semestreId: true } } },
			}),
			ctx.db.monitorTurma.findMany({
				select: { userId: true, turma: { select: { semestreId: true } } },
			}),
		]);
		const pessoasPorSemestre = (
			vinculos: Array<{ userId: string; turma: { semestreId: string } }>,
		) => {
			const pessoas = new Map<string, Set<string>>();
			for (const vinculo of vinculos) {
				const ids = pessoas.get(vinculo.turma.semestreId) ?? new Set<string>();
				ids.add(vinculo.userId);
				pessoas.set(vinculo.turma.semestreId, ids);
			}
			return pessoas;
		};
		const professoresPorSemestre = pessoasPorSemestre(professores);
		const monitoresPorSemestre = pessoasPorSemestre(monitores);
		return semestres.map(({ _count, ...semestre }) => ({
			...semestre,
			totalTurmas: _count.turmas,
			totalAlunos: _count.alunos,
			totalProfessores: professoresPorSemestre.get(semestre.id)?.size ?? 0,
			totalMonitores: monitoresPorSemestre.get(semestre.id)?.size ?? 0,
		}));
	}),
	create: directorProcedure
		.input(
			z.object({
				codigo: z
					.string()
					.regex(/^\d{4}\.[12]$/, "Use o formato AAAA.1 ou AAAA.2."),
			}),
		)
		.mutation(({ ctx, input }) =>
			ctx.db.semestre.create({
				data: { codigo: input.codigo },
				select: { id: true },
			}),
		),
	setAtivo: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) =>
			ctx.db.$transaction(async (tx) => {
				await tx.semestre.updateMany({ data: { ativo: false } });
				return tx.semestre.update({
					where: { id: input.id },
					data: { ativo: true },
					select: { id: true },
				});
			}),
		),
	remove: directorProcedure
		.input(z.object({ id }))
		.mutation(async ({ ctx, input }) => {
			const semestre = await ctx.db.semestre.findUnique({
				where: { id: input.id },
				select: {
					_count: {
						select: { turmas: true, alunos: true, candidatos: true },
					},
				},
			});
			if (!semestre) throw new TRPCError({ code: "NOT_FOUND" });
			if (
				semestre._count.turmas ||
				semestre._count.alunos ||
				semestre._count.candidatos
			)
				throw new TRPCError({
					code: "CONFLICT",
					message:
						"Não é possível excluir um semestre que possui turmas, alunos ou candidatos.",
				});
			await ctx.db.semestre.delete({ where: { id: input.id } });
			return { id: input.id };
		}),
	duplicate: directorProcedure
		.input(
			z.object({
				semestreOrigemId: id,
				codigoDestino: z
					.string()
					.regex(/^\d{4}\.[12]$/, "Use o formato AAAA.1 ou AAAA.2."),
				continuarAlunos: z.boolean().default(true),
				copiarMateriais: z.boolean().default(true),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const origem = await ctx.db.semestre.findUnique({
				where: { id: input.semestreOrigemId },
				include: {
					alunos: true,
					turmas: {
						include: {
							professores: { select: { userId: true } },
							monitores: { select: { userId: true } },
							alunos: { select: { alunoId: true } },
							materiais: { select: { titulo: true, tipo: true, url: true } },
						},
					},
				},
			});
			if (!origem) throw new TRPCError({ code: "NOT_FOUND" });
			const existente = await ctx.db.semestre.findUnique({
				where: { codigo: input.codigoDestino },
				select: { id: true },
			});
			if (existente)
				throw new TRPCError({
					code: "CONFLICT",
					message: "Já existe um semestre com esse código.",
				});

			return ctx.db.$transaction(async (tx) => {
				const destino = await tx.semestre.create({
					data: { codigo: input.codigoDestino },
					select: { id: true, codigo: true },
				});
				const alunoDestinoPorOrigem = new Map<string, string>();
				if (input.continuarAlunos) {
					for (const aluno of origem.alunos) {
						const novoAluno = await tx.aluno.create({
							data: {
								semestreId: destino.id,
								alunoOrigemId: aluno.id,
								nome: aluno.nome,
								dataNascimento: aluno.dataNascimento,
								cpf: aluno.cpf,
								corRaca: aluno.corRaca,
								identidadeGenero: aluno.identidadeGenero,
								lgbtqiapn: aluno.lgbtqiapn,
								telefone: aluno.telefone,
								contatoEmergencia: aluno.contatoEmergencia,
								email: aluno.email,
								escolaridade: aluno.escolaridade,
								cuidaTerceiros: aluno.cuidaTerceiros,
								trabalha: aluno.trabalha,
								trabalhoLocal: aluno.trabalhoLocal,
								trabalhoFuncao: aluno.trabalhoFuncao,
								estuda: aluno.estuda,
								estudoLocal: aluno.estudoLocal,
								estudoCurso: aluno.estudoCurso,
								problemaSaude: aluno.problemaSaude,
								problemaSaudeQual: aluno.problemaSaudeQual,
								necessidadeEspecial: aluno.necessidadeEspecial,
								necessidadeEspecialQual: aluno.necessidadeEspecialQual,
								acessoInternet: aluno.acessoInternet,
								temComputador: aluno.temComputador,
								temSmartphone: aluno.temSmartphone,
								sistemaSmartphone: aluno.sistemaSmartphone,
								etapaTrilha: aluno.etapaTrilha,
							},
							select: { id: true },
						});
						alunoDestinoPorOrigem.set(aluno.id, novoAluno.id);
					}
				}

				const equipe = new Set<string>();
				for (const turma of origem.turmas) {
					const novaTurma = await tx.turma.create({
						data: {
							semestreId: destino.id,
							titulo: turma.titulo,
							sala: turma.sala,
							horario: turma.horario,
							cor: turma.cor,
							corDestaque: turma.corDestaque,
							corFundo: turma.corFundo,
							corTexto: turma.corTexto,
							corTitulo: turma.corTitulo,
							corDescricao: turma.corDescricao,
							fonte: turma.fonte,
						},
						select: { id: true },
					});
					await Promise.all([
						tx.professorTurma.createMany({
							data: turma.professores.map(({ userId }) => ({
								userId,
								turmaId: novaTurma.id,
							})),
						}),
						tx.monitorTurma.createMany({
							data: turma.monitores.map(({ userId }) => ({
								userId,
								turmaId: novaTurma.id,
							})),
						}),
						...(input.continuarAlunos
							? [
									tx.alunoTurma.createMany({
										data: turma.alunos.flatMap(({ alunoId }) => {
											const alunoDestinoId = alunoDestinoPorOrigem.get(alunoId);
											return alunoDestinoId
												? [{ alunoId: alunoDestinoId, turmaId: novaTurma.id }]
												: [];
										}),
									}),
								]
							: []),
						...(input.copiarMateriais
							? [
									tx.material.createMany({
										data: turma.materiais.map((material) => ({
											...material,
											turmaId: novaTurma.id,
										})),
									}),
								]
							: []),
					]);
					for (const { userId } of [...turma.professores, ...turma.monitores])
						equipe.add(userId);
				}
				if (equipe.size)
					await tx.vinculoEquipeSemestre.createMany({
						data: [...equipe].map((userId) => ({
							userId,
							semestreId: destino.id,
						})),
					});
				return {
					...destino,
					totalAlunosContinuados: alunoDestinoPorOrigem.size,
					totalTurmas: origem.turmas.length,
				};
			});
		}),
});
