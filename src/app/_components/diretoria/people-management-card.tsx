import { DoorOpen, FileText, Pencil, Trash2 } from "lucide-react";

type PersonManagementCardProps = {
	person: { nome: string; email: string; matricula: string; turmas: string[] };
	role: "professor" | "monitor";
	roleLabel?: string;
	onEdit?: () => void;
	onRemove?: () => void;
	onCertificate: () => void;
};

const initials = (name: string) => name.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");

/** Shared roster card; its density mirrors the Directorate workbench rather than a generic profile tile. */
export function PersonManagementCard({ person, role, roleLabel, onEdit, onRemove, onCertificate }: PersonManagementCardProps) {
	const isProfessor = role === "professor";
	const tint = isProfessor ? "bg-orange-100 text-orange-700" : "bg-sky-100 text-sky-700";
	const chip = isProfessor ? "bg-orange-50 text-orange-800" : "bg-sky-50 text-sky-800";
	return <article className="group relative overflow-hidden rounded-2xl bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(2,132,199,.13)]"><div className="absolute right-0 top-0 h-1.5 w-20 rounded-bl-full bg-sky-500" />
		<div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-sm font-black ${tint}`}>{initials(person.nome) || "?"}</div><div className="min-w-0"><h3 className="truncate text-sm font-extrabold text-slate-900">{person.nome || "Sem nome"}</h3><p className="mt-0.5 truncate text-xs text-slate-500">{person.email || "Sem e-mail cadastrado"}</p>{roleLabel && <p className="mt-1 text-[11px] font-bold text-orange-700">{roleLabel}</p>}{person.matricula && <p className="mt-1 text-[11px] font-semibold text-slate-400">Matrícula · {person.matricula}</p>}</div></div><div className="flex shrink-0 items-center gap-1"><button onClick={onCertificate} className="rounded-lg p-2 text-slate-400 transition hover:bg-orange-50 hover:text-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2" aria-label="Gerar certificado PM" title="Gerar certificado PM"><FileText className="h-4 w-4" /></button>{onEdit && <button onClick={onEdit} className="rounded-lg p-2 text-slate-400 transition hover:bg-sky-50 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2" aria-label={`Editar ${role}`}><Pencil className="h-4 w-4" /></button>}{onRemove && <button onClick={onRemove} className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" aria-label={`Excluir ${role}`}><Trash2 className="h-4 w-4" /></button>}</div></div>
		<div className="mt-4 border-t border-slate-100 pt-3">{person.turmas.length ? <div className="flex flex-wrap gap-1.5">{person.turmas.map((turma) => <span key={turma} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${chip}`}><DoorOpen className="h-3 w-3" />{turma}</span>)}</div> : <p className="text-xs text-slate-400">Nenhuma turma atribuída</p>}</div>
	</article>;
}
