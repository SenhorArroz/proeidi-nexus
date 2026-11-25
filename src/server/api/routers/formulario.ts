import { createTRPCRouter } from "~/server/api/trpc";
import { gestaoProcedures } from "./_components/formulario/gestao";
import { publicoProcedures } from "./_components/formulario/publico";

export const formularioRouter = createTRPCRouter({
	...gestaoProcedures,
	...publicoProcedures,
});
