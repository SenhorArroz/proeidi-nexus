import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import DiretoriaWorkspace from "~/app/_components/diretoria-workspace";

/** Server-side gate: the administrative UI is never rendered for other roles. */
export default async function DiretoriaLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	if (!session?.user?.id) redirect("/nexus/login");
	const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
	if (!user || (user.role !== "DIRETOR" && user.role !== "COORDENADOR")) redirect("/nexus/dashboard");
	return <DiretoriaWorkspace>{children}</DiretoriaWorkspace>;
}
