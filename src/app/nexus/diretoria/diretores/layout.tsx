import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

/** This route is additionally protected even if someone pastes its URL. */
export default async function DiretoresLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	const session = await auth();
	if (!session?.user?.id) redirect("/nexus/login");
	const user = await db.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
	if (user?.role !== "COORDENADOR") redirect("/nexus/diretoria");
	return children;
}
