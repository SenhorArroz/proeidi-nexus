import { redirect } from "next/navigation";
import { KeyRound, Mail, Settings, ShieldCheck, UserRound, ClipboardList } from "lucide-react";
import Link from "next/link";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import BotaoSair from "./botaoSair";

const ROLE_LABEL: Record<string, string> = {
	COORDENADOR: "Coordenador(a)",
	DIRETOR: "Diretor(a)",
	PROFESSOR: "Professor(a)",
	MONITOR: "Monitor(a)",
};

/** Account details are selected server-side; no credential data is ever sent to the browser. */
export default async function ConfiguracoesPage() {
	const session = await auth();
	if (!session?.user?.id) redirect("/nexus/login");

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { nome: true, email: true, role: true, matricula: true },
	});
	if (!user) redirect("/nexus/login");

	return (
		<div className="min-h-full overflow-y-auto bg-slate-50 px-4 py-6 font-sans">
			<div className="mx-auto w-full max-w-3xl">
				<div className="relative mb-6 overflow-hidden rounded-[1.75rem] bg-sky-600 px-6 py-7 text-white shadow-[0_20px_45px_rgba(2,132,199,.22)]">
					<div className="absolute -right-8 -top-10 h-44 w-44 rounded-full bg-orange-500" /><div className="absolute bottom-[-2rem] right-32 h-20 w-20 rounded-full border-[12px] border-sky-300" />
					<div className="relative flex items-center gap-4"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500"><Settings className="h-5 w-5" /></div><div><h1 className="text-2xl font-black tracking-[-.03em]">Configurações</h1><p className="mt-1 text-sm text-sky-100">Preferências e informações da sua conta</p></div></div>
				</div>

				<section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
					<div className="border-b border-gray-100 px-6 py-5"><h2 className="text-sm font-semibold text-gray-900">Sua conta</h2><p className="mt-1 text-sm text-gray-500">Dados de acesso e perfil vinculados à sessão atual.</p></div>
					<div className="divide-y divide-gray-100">
						<InfoRow icon={UserRound} label="Nome" value={user.nome} />
						<InfoRow icon={Mail} label="E-mail" value={user.email} />
						<InfoRow icon={ShieldCheck} label="Perfil de acesso" value={ROLE_LABEL[user.role] ?? user.role} />
						<InfoRow icon={KeyRound} label="Matrícula" value={user.matricula} />
					</div>
				</section>
				{(user.role === "DIRETOR" || user.role === "COORDENADOR") && <Link href="/nexus/diretoria/questionarios" className="mt-5 flex items-center justify-between rounded-2xl bg-white p-5 text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]"><span className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-100 text-orange-700"><ClipboardList className="h-5 w-5" /></span><span><strong className="block text-sm">Questionários</strong><span className="mt-0.5 block text-sm text-slate-500">Criar, publicar e acompanhar respostas.</span></span></span><span className="text-sm font-extrabold text-sky-700">Gerenciar →</span></Link>}

				<p className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">Para alterar dados de acesso, procure a coordenação do programa.</p>
				<div className="mt-5"><BotaoSair /></div>
			</div>
		</div>
	);
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof UserRound; label: string; value: string }) {
	return <div className="flex items-center gap-3 px-6 py-4"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50"><Icon className="h-4 w-4 text-sky-600" /></div><div><p className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</p><p className="mt-0.5 text-sm font-medium text-gray-800">{value}</p></div></div>;
}
