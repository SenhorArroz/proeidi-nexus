"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle2, Pencil, Plus, ShieldCheck } from "lucide-react";
import { api } from "~/trpc/react";

type Pergunta = { id: string; titulo: string; tipo: "short_text" | "paragraph" | "multiple_choice" | "checkbox"; opcoes: { id: string; texto: string }[]; obrigatoria: boolean };
type ConfiguracaoFormulario = { corPrimaria: string; corDestaque: string; corFundo: string; fonte: "SANS" | "SERIF" | "MONO"; mostrarProgresso: boolean; atribuirPontuacao: boolean };
const configuracaoPadrao: ConfiguracaoFormulario = { corPrimaria: "#0284c7", corDestaque: "#ea580c", corFundo: "#f8fafc", fonte: "SANS", mostrarProgresso: true, atribuirPontuacao: false };
const COOKIE_NAME = "nexus_questionario_dispositivo";
const COOKIE_VAZIO = "00000000-0000-4000-8000-000000000000";

function obterIdentificadorDoNavegador() {
	const salvo = document.cookie.split("; ").find((item) => item.startsWith(`${COOKIE_NAME}=`))?.split("=")[1];
	if (salvo) return decodeURIComponent(salvo);
	const identificador = crypto.randomUUID();
	document.cookie = `${COOKIE_NAME}=${encodeURIComponent(identificador)}; Max-Age=31536000; Path=/; SameSite=Lax`;
	return identificador;
}

export default function ResponderQuestionario({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = use(params);
	const { data, isLoading, error } = api.formulario.publicGet.useQuery({ slug });
	const enviar = api.formulario.publicSubmit.useMutation();
	const [respostas, setRespostas] = useState<Record<string, string | string[]>>({});
	const [nomeRespondente, setNomeRespondente] = useState("");
	const [identificadorCookie, setIdentificadorCookie] = useState<string | null>(null);
	const [modoEdicao, setModoEdicao] = useState(false);
	const exigeIdentificador = Boolean(data && (data.modoResposta === "IDENTIFICADO_POR_COOKIE" || data.limitarPorNavegador));
	const status = api.formulario.publicResponseStatus.useQuery(
		{ slug, identificadorCookie: identificadorCookie ?? COOKIE_VAZIO },
		{ enabled: exigeIdentificador && Boolean(identificadorCookie) },
	);

	useEffect(() => {
		if (exigeIdentificador) setIdentificadorCookie(obterIdentificadorDoNavegador());
	}, [exigeIdentificador]);

	const respostaAnterior = status.data?.resposta;
	const iniciarEdicao = () => {
		if (!respostaAnterior) return;
		setRespostas(respostaAnterior.respostas as Record<string, string | string[]>);
		setNomeRespondente(respostaAnterior.nomeRespondente ?? "");
		setModoEdicao(true);
		enviar.reset();
	};
	const responderNovamente = () => {
		setRespostas({});
		setNomeRespondente("");
		setModoEdicao(false);
		enviar.reset();
	};

	if (isLoading) return <main className="grid min-h-screen place-items-center text-slate-500">Carregando…</main>;
	if (error || !data) return <main className="grid min-h-screen place-items-center p-6 text-center text-slate-600">Este questionário não está disponível.</main>;
	const perguntas = (data.conteudo as { perguntas: Pergunta[] }).perguntas;
	const configuracao = { ...configuracaoPadrao, ...(data.configuracao as Partial<ConfiguracaoFormulario> | null) };
	const fonte = configuracao.fonte === "SERIF" ? "font-serif" : configuracao.fonte === "MONO" ? "font-mono" : "font-sans";
	const respondidas = perguntas.filter((pergunta) => { const resposta = respostas[pergunta.id]; return Array.isArray(resposta) ? resposta.length > 0 : Boolean(resposta?.trim()); }).length;
	const identificado = data.modoResposta === "IDENTIFICADO_POR_COOKIE";

	if (exigeIdentificador && (!identificadorCookie || status.isLoading)) return <main className="grid min-h-screen place-items-center p-6 text-center" style={{ backgroundColor: configuracao.corFundo }}><p className="text-sm font-semibold text-slate-600">Verificando sua participação…</p></main>;
	if (exigeIdentificador && respostaAnterior && !modoEdicao && !enviar.isSuccess) return <EstadoRespondido fonte={fonte} configuracao={configuracao} onEditar={iniciarEdicao} />;
	if (enviar.isSuccess) return <EstadoEnviado fonte={fonte} configuracao={configuracao} pontuacao={enviar.data?.pontuacao} editando={modoEdicao} respostaUnica={exigeIdentificador} onContinuar={exigeIdentificador ? iniciarEdicao : responderNovamente} />;

	return (
		<main className={`min-h-screen min-w-0 overflow-x-clip px-3 py-6 sm:px-4 sm:py-10 ${fonte}`} style={{ backgroundColor: configuracao.corFundo }}>
			<form onSubmit={(event) => { event.preventDefault(); enviar.mutate({ slug, respostas, editarUltima: modoEdicao, ...(exigeIdentificador ? { ...(identificado ? { nomeRespondente } : {}), identificadorCookie: identificadorCookie ?? undefined } : {}) }); }} className="mx-auto min-w-0 max-w-2xl space-y-4">
				<header className="min-w-0 rounded-3xl p-4 text-white sm:p-7" style={{ backgroundColor: configuracao.corPrimaria }}><h1 className="break-words text-2xl font-black">{data.titulo}</h1>{data.descricao && <p className="mt-2 break-words text-sky-100">{data.descricao}</p>}</header>
				{modoEdicao && <p className="rounded-xl bg-white p-3 text-sm font-bold text-slate-700 shadow-sm">Você está editando a sua última resposta.</p>}
				{configuracao.mostrarProgresso && <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Progresso</span><span>{respondidas}/{perguntas.length}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${perguntas.length ? (respondidas / perguntas.length) * 100 : 0}%`, backgroundColor: configuracao.corDestaque }} /></div></div>}
				{identificado && <section className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-950 sm:p-5"><div className="flex items-start gap-3"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" /><div><h2 className="font-extrabold">Resposta identificada</h2><p className="mt-1 text-sm text-sky-800">Seu nome será exibido à diretoria. Este navegador pode enviar apenas uma resposta.</p></div></div><label className="mt-4 block text-sm font-bold" htmlFor="nome-respondente">Seu nome</label><input id="nome-respondente" required value={nomeRespondente} onChange={(event) => setNomeRespondente(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white p-3 text-base text-sky-950 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100" placeholder="Digite seu nome completo" /></section>}
				{perguntas.map((pergunta) => <PerguntaCampo key={pergunta.id} pergunta={pergunta} respostas={respostas} onChange={setRespostas} />)}
				{enviar.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{enviar.error.message}</p>}
				<button disabled={enviar.isPending} style={{ backgroundColor: configuracao.corDestaque }} className="min-h-11 w-full rounded-xl px-5 py-3 font-extrabold text-white disabled:opacity-50">{enviar.isPending ? "Enviando…" : modoEdicao ? "Salvar alterações" : "Enviar respostas"}</button>
			</form>
		</main>
	);
}

function PerguntaCampo({ pergunta, respostas, onChange }: { pergunta: Pergunta; respostas: Record<string, string | string[]>; onChange: (respostas: Record<string, string | string[]>) => void }) {
	const valor = respostas[pergunta.id];
	const anterior = Array.isArray(valor) ? valor : [];
	return <label className="block min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-5"><span className="break-words font-bold text-slate-800">{pergunta.titulo}{pergunta.obrigatoria && <span className="text-orange-600"> *</span>}</span>{pergunta.tipo === "paragraph" ? <textarea required={pergunta.obrigatoria} value={(valor as string) ?? ""} onChange={(event) => onChange({ ...respostas, [pergunta.id]: event.target.value })} className="mt-3 min-h-28 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base" /> : pergunta.tipo === "short_text" ? <input required={pergunta.obrigatoria} value={(valor as string) ?? ""} onChange={(event) => onChange({ ...respostas, [pergunta.id]: event.target.value })} className="mt-3 min-h-11 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base" /> : <span className="mt-3 grid min-w-0 gap-2">{pergunta.opcoes.map((opcao) => <label key={opcao.id} className="flex min-h-11 min-w-0 items-center gap-3 text-sm text-slate-700"><input required={pergunta.obrigatoria && pergunta.tipo === "multiple_choice"} type={pergunta.tipo === "checkbox" ? "checkbox" : "radio"} name={pergunta.id} checked={pergunta.tipo === "checkbox" ? anterior.includes(opcao.texto) : valor === opcao.texto} className="h-5 w-5 shrink-0" onChange={(event) => onChange({ ...respostas, [pergunta.id]: pergunta.tipo === "checkbox" ? (event.target.checked ? [...anterior, opcao.texto] : anterior.filter((item) => item !== opcao.texto)) : opcao.texto })} /><span className="min-w-0 break-words">{opcao.texto}</span></label>)}</span>}</label>;
}

function EstadoRespondido({ fonte, configuracao, onEditar }: { fonte: string; configuracao: ConfiguracaoFormulario; onEditar: () => void }) {
	return <main className={`grid min-h-screen place-items-center p-6 text-center ${fonte}`} style={{ backgroundColor: configuracao.corFundo }}><div className="max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.12)] sm:p-8"><CheckCircle2 className="mx-auto h-10 w-10" style={{ color: configuracao.corDestaque }} /><h1 className="mt-4 text-2xl font-black text-slate-900">Você já respondeu</h1><p className="mt-2 text-sm leading-6 text-slate-600">Este questionário aceita apenas uma resposta por navegador. Sua participação está registrada.</p><button onClick={onEditar} style={{ backgroundColor: configuracao.corDestaque }} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-white"><Pencil className="h-4 w-4" /> Editar minha última resposta</button></div></main>;
}

function EstadoEnviado({ fonte, configuracao, pontuacao, editando, respostaUnica, onContinuar }: { fonte: string; configuracao: ConfiguracaoFormulario; pontuacao: number | null | undefined; editando: boolean; respostaUnica: boolean; onContinuar: () => void }) {
	return <main className={`grid min-h-screen place-items-center p-6 text-center ${fonte}`} style={{ backgroundColor: configuracao.corFundo }}><div className="max-w-md rounded-3xl bg-white p-6 shadow-[0_18px_42px_rgba(15,23,42,.12)] sm:p-8"><CheckCircle2 className="mx-auto h-10 w-10" style={{ color: configuracao.corDestaque }} /><h1 className="mt-4 text-2xl font-black text-slate-900">{editando ? "Resposta atualizada!" : "Resposta enviada!"}</h1><p className="mt-2 text-slate-600">Agradecemos sua participação.</p>{configuracao.atribuirPontuacao && <p className="mt-3 font-bold" style={{ color: configuracao.corPrimaria }}>Pontuação: {pontuacao ?? 0} ponto(s)</p>}<button onClick={onContinuar} style={{ backgroundColor: configuracao.corDestaque }} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold text-white">{respostaUnica ? <><Pencil className="h-4 w-4" /> Editar última resposta</> : <><Plus className="h-4 w-4" /> Responder mais uma vez</>}</button></div></main>;
}
