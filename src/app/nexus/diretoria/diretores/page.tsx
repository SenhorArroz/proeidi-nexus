"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Check, Mail, Pencil, Plus, Trash2, Users } from "lucide-react";
import { DiretoriaBackLink, DiretoriaPageIntro } from "~/app/_components/diretoria/page-intro";
import { DiretoriaFormField } from "~/app/_components/diretoria/form-field";
import { DataSkeleton } from "~/app/_components/diretoria/data-skeleton";
import { api } from "~/trpc/react";

type Diretor = { id: string; nome: string; matricula: string; email: string; turmas: string[] };
const vazio = (): Diretor => ({ id: "", nome: "", matricula: "", email: "", turmas: [] });

export default function DiretoresDiretoria() {
	const utils = api.useUtils();
	const { data, isLoading } = api.diretor.list.useQuery();
	const criar = api.diretor.create.useMutation({ onSuccess: () => utils.diretor.list.invalidate() });
	const atualizar = api.diretor.update.useMutation({ onSuccess: () => utils.diretor.list.invalidate() });
	const remover = api.diretor.remove.useMutation({ onSuccess: () => utils.diretor.list.invalidate() });
	const [diretores, setDiretores] = useState<Diretor[]>([]);
	const [modo, setModo] = useState<"lista" | "form">("lista");
	const [editando, setEditando] = useState<string | null>(null);
	const [form, setForm] = useState<Diretor>(vazio());
	const [erro, setErro] = useState("");
	const [sucesso, setSucesso] = useState("");

	useEffect(() => {
		if (data) setDiretores(data.map((d) => ({ id: d.id, nome: d.nome, matricula: d.matricula, email: d.email, turmas: d.turmasProfessor.map((v) => v.turma.titulo) })));
	}, [data]);

	function novo() { setEditando(null); setForm(vazio()); setErro(""); setModo("form"); }
	function editar(diretor: Diretor) { setEditando(diretor.id); setForm(diretor); setErro(""); setModo("form"); }
	function salvar() {
		setErro("");
		setSucesso("");
		if (!form.nome.trim() || !form.email.trim() || !form.matricula.trim()) { setErro("Preencha nome, matrícula e e-mail."); return; }
		const payload = { nome: form.nome, email: form.email, matricula: form.matricula };
		const options = { onSuccess: () => { setSucesso("Diretor salvo com sucesso."); setModo("lista"); }, onError: (cause: { message: string }) => setErro(cause.message) };
		if (editando) atualizar.mutate({ id: editando, ...payload }, options); else criar.mutate(payload, options);
	}
	function excluir(id: string) { if (confirm("Excluir este diretor? O acesso será revogado imediatamente.")) remover.mutate({ id }); }

	return <div className="min-h-screen w-full bg-gray-50 px-4 py-10 font-sans">
		<div className="mx-auto w-full max-w-5xl"><DiretoriaBackLink />
			<div className="mb-6"><DiretoriaPageIntro icon={Building2} title="Gerenciar diretores" description="Acesso administrativo controlado pelo coordenador" /></div>
			{modo === "lista" ? <>{sucesso && <p role="status" className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{sucesso}</p>}<div className="mb-4 flex items-center justify-between"><span className="text-sm font-medium text-gray-700">{isLoading ? "Carregando…" : `${diretores.length} diretores cadastrados`}</span><button onClick={novo} className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"><Plus className="h-4 w-4" />Novo diretor</button></div>
				{isLoading ? <DataSkeleton cards={4} /> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{diretores.map((d) => <div key={d.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><div className="flex items-center justify-between bg-gradient-to-br from-amber-700 to-amber-600 px-5 py-4 text-white"><div className="flex items-center gap-2"><Building2 className="h-4 w-4" /><span className="font-semibold">{d.nome}</span></div><div><button onClick={() => editar(d)} className="p-1.5 hover:bg-white/20"><Pencil className="h-4 w-4" /></button><button onClick={() => excluir(d.id)} className="p-1.5 hover:bg-white/20"><Trash2 className="h-4 w-4" /></button></div></div><div className="space-y-2 p-5 text-sm text-gray-600"><p className="flex items-center gap-2"><Mail className="h-4 w-4" />{d.email}</p><p>{d.matricula}</p><p className="flex items-center gap-2 text-xs text-gray-500"><Users className="h-4 w-4" />{d.turmas.length ? d.turmas.join(", ") : "Sem turmas vinculadas"}</p></div></div>)}</div>}
				{!isLoading && !diretores.length && <p className="py-16 text-center text-sm text-gray-400">Nenhum diretor cadastrado.</p>}</> : <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white"><div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5"><button onClick={() => setModo("lista")} className="p-1.5 text-gray-400 hover:bg-gray-100"><ArrowLeft className="h-4 w-4" /></button><h2 className="text-sm font-semibold">{editando ? "Editar diretor" : "Novo diretor"}</h2></div><div className="space-y-5 p-6"><DiretoriaFormField label="Nome" value={form.nome} onChange={(nome) => setForm({ ...form, nome })} /><DiretoriaFormField label="Matrícula" value={form.matricula} onChange={(matricula) => setForm({ ...form, matricula })} /><DiretoriaFormField label="E-mail" type="email" value={form.email} onChange={(email) => setForm({ ...form, email })} />
				<p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">A senha de acesso é sempre a matrícula informada acima. Alterar a matrícula redefine a senha.</p>{erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{erro}</p>}</div><div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4"><button onClick={() => setModo("lista")} className="rounded-lg px-4 py-2 text-sm text-gray-500">Cancelar</button><button onClick={salvar} disabled={criar.isPending || atualizar.isPending} className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"><Check className="h-4 w-4" />Salvar diretor</button></div></div>}
		</div></div>;
}
