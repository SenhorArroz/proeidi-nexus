import type { ElementType, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type DiretoriaPageIntroProps = {
	title: string;
	description: string;
	icon: ElementType;
	actions?: ReactNode;
};

/** Shared opening block for the Directorate CRUD workspaces. */
export function DiretoriaPageIntro({ title, description, icon: Icon, actions }: DiretoriaPageIntroProps) {
	return (
		<header className="diretoria-page-intro">
			<div className="diretoria-page-intro__orb" aria-hidden="true" />
			<div className="diretoria-page-intro__loop" aria-hidden="true" />
			<div className="relative flex min-w-0 flex-1 items-start gap-4">
				<div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-orange-500 text-white shadow-[0_10px_20px_rgba(234,88,12,.25)]"><Icon className="h-5 w-5" /></div>
				<div className="min-w-0"><h1>{title}</h1><p>{description}</p></div>
			</div>
			{actions && <div className="relative mt-4 flex shrink-0 flex-wrap gap-2 sm:mt-0">{actions}</div>}
		</header>
	);
}

export function DiretoriaBackLink() {
	return <Link href="/nexus/diretoria" className="diretoria-back-link"><ArrowLeft className="h-4 w-4" />Voltar para Diretoria</Link>;
}
