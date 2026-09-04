import { certificadoRouter } from "~/server/api/routers/certificado";
import { certificadoRouter as declaracaoRouter } from "~/server/api/routers/certificadoPM";
import { diretoriaRouter } from "~/server/api/routers/diretoria";
import { alunoRouter } from "~/server/api/routers/aluno";
import { turmaRouter } from "~/server/api/routers/turma";
import { professorRouter } from "~/server/api/routers/professor";
import { monitorRouter } from "~/server/api/routers/monitor";
import { diretorRouter } from "~/server/api/routers/diretor";
import { formularioRouter } from "~/server/api/routers/formulario";
import { contaRouter } from "~/server/api/routers/conta";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	certificado: certificadoRouter,
	declaracao: declaracaoRouter,
	diretoria: diretoriaRouter,
	aluno: alunoRouter,
	turma: turmaRouter,
	professor: professorRouter,
	monitor: monitorRouter,
	diretor: diretorRouter,
	formulario: formularioRouter,
	conta: contaRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 */
export const createCaller = createCallerFactory(appRouter);
