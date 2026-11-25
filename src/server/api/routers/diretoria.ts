import { createTRPCRouter } from "~/server/api/trpc";
import { semestresRouter } from "./_components/diretoria/semestres";
import { usuariosRouter } from "./_components/diretoria/usuarios";
import { diretoresRouter } from "./_components/diretoria/diretores";
import { candidatosRouter } from "./_components/diretoria/candidatos";
import { presencasRouter } from "./_components/diretoria/presencas";
import { turmasRouter } from "./_components/diretoria/turmas";
import { alunosRouter } from "./_components/diretoria/alunos";
import { impressaoRouter } from "./_components/diretoria/impressao";
import { materialAtualizacaoRouter } from "./_components/diretoria/material-atualizacao";
import { directorProcedure } from "./_components/diretoria/procedures";

export {
	coordinatorProcedure,
	directorProcedure,
	personInput,
} from "./_components/diretoria/procedures";

export const diretoriaRouter = createTRPCRouter({
	overview: directorProcedure.query(async ({ ctx }) => {
		const semestre = await ctx.db.semestre.findFirst({
			where: { ativo: true },
			select: { id: true, codigo: true },
		});
		const usuario = await ctx.db.user.findUnique({
			where: { id: ctx.session.user.id },
			select: { role: true },
		});
		if (!semestre)
			return {
				semestre: null,
				totalAlunos: 0,
				totalProfessores: 0,
				totalMonitores: 0,
				role: usuario?.role ?? null,
			};
		const [totalAlunos, totalProfessores, totalMonitores] = await Promise.all([
			ctx.db.aluno.count({ where: { semestreId: semestre.id } }),
			ctx.db.user.count({ where: { role: "PROFESSOR" } }),
			ctx.db.user.count({ where: { role: "MONITOR" } }),
		]);
		return {
			semestre,
			totalAlunos,
			totalProfessores,
			totalMonitores,
			role: usuario?.role ?? null,
		};
	}),
	semestres: semestresRouter,
	usuarios: usuariosRouter,
	diretores: diretoresRouter,
	candidatos: candidatosRouter,
	presencas: presencasRouter,
	turmas: turmasRouter,
	alunos: alunosRouter,
	impressao: impressaoRouter,
	materialAtualizacao: materialAtualizacaoRouter,
});
