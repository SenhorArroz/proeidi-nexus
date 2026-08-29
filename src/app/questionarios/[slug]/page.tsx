"use client";

import { use, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { api } from "~/trpc/react";

type Pergunta = {
	id: string;
	titulo: string;
	tipo: "short_text" | "paragraph" | "multiple_choice" | "checkbox";
	opcoes: { id: string; texto: string }[];
	obrigatoria: boolean;
};
type ConfiguracaoFormulario = { corPrimaria: string; corDestaque: string; corFundo: string; fonte: "SANS" | "SERIF" | "MONO"; mostrarProgresso: boolean; atribuirPontuacao: boolean };
const configuracaoPadrao: ConfiguracaoFormulario = { corPrimaria: "#0284c7", corDestaque: "#ea580c", corFundo: "#f8fafc", fonte: "SANS", mostrarProgresso: true, atribuirPontuacao: false };

const COOKIE_NAME = "nexus_questionario_dispositivo";

function obterIdentificadorDoNavegador() {
	const salvo = document.cookie
		.split("; ")
		.find((item) => item.startsWith(`${COOKIE_NAME}=`))
		?.split("=")[1];
	if (salvo) return decodeURIComponent(salvo);
	const identificador = crypto.randomUUID();
	document.cookie = `${COOKIE_NAME}=${encodeURIComponent(identificador)}; Max-Age=31536000; Path=/; SameSite=Lax`;
	return identificador;
}

export default function ResponderQuestionario({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = use(params);
	const { data, isLoading, error } = api.formulario.publicGet.useQuery({ slug });
	const enviar = api.formulario.publicSubmit.useMutation();
	const [respostas, setRespostas] = useState<Record<string, string | string[]>>({});
	const [nomeRespondente, setNomeRespondente] = useState("");

	if (isLoading)
		return <main className="grid min-h-screen place-items-center text-slate-500">Carregando…</main>;
	if (error || !data)
		return <main className="grid min-h-screen place-items-center p-6 text-center text-slate-600">Este questionário não está disponível.</main>;

	const perguntas = (data.conteudo as { perguntas: Pergunta[] }).perguntas;
	const configuracao = { ...configuracaoPadrao, ...(data.configuracao as Partial<ConfiguracaoFormulario> | null) };
	const fonte = configuracao.fonte === "SERIF" ? "font-serif" : configuracao.fonte === "MONO" ? "font-mono" : "font-sans";
	const respondidas = perguntas.filter((pergunta) => { const resposta = respostas[pergunta.id]; return Array.isArray(resposta) ? resposta.length > 0 : Boolean(resposta?.trim()); }).length;
	const identificado = data.modoResposta === "IDENTIFICADO_POR_COOKIE";
	if (enviar.isSuccess)
		return (
			<main className="grid min-h-screen place-items-center p-6 text-center">
				<div>
					<h1 className="text-2xl font-black text-sky-800">Resposta enviada!</h1>
					<p className="mt-2 text-slate-600">Agradecemos sua participação.</p>
					{configuracao.atribuirPontuacao && <p className="mt-3 font-bold" style={{ color: configuracao.corPrimaria }}>Pontuação: {enviar.data?.pontuacao ?? 0} ponto(s)</p>}
				</div>
			</main>
		);

	return (
		<main className={`min-h-screen min-w-0 overflow-x-clip px-3 py-6 sm:px-4 sm:py-10 ${fonte}`} style={{ backgroundColor: configuracao.corFundo }}>
			<form
				onSubmit={(event) => {
					event.preventDefault();
					enviar.mutate({
						slug,
						respostas,
						...(identificado || data.limitarPorNavegador
							? {
								...(identificado ? { nomeRespondente } : {}),
								identificadorCookie: obterIdentificadorDoNavegador(),
							}
							: {}),
					});
				}}
				className="mx-auto min-w-0 max-w-2xl space-y-4"
			>
				<header className="min-w-0 rounded-3xl p-4 text-white sm:p-7" style={{ backgroundColor: configuracao.corPrimaria }}>
					<h1 className="break-words text-2xl font-black">{data.titulo}</h1>
					{data.descricao && <p className="mt-2 break-words text-sky-100">{data.descricao}</p>}
				</header>
				{configuracao.mostrarProgresso && <div className="rounded-2xl bg-white p-4 shadow-sm"><div className="flex justify-between text-sm font-bold text-slate-700"><span>Progresso</span><span>{respondidas}/{perguntas.length}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full transition-all" style={{ width: `${perguntas.length ? (respondidas / perguntas.length) * 100 : 0}%`, backgroundColor: configuracao.corDestaque }} /></div></div>}

				{identificado && (
					<section className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-950 sm:p-5">
						<div className="flex items-start gap-3">
							<ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
							<div>
								<h2 className="font-extrabold">Resposta identificada</h2>
								<p className="mt-1 text-sm text-sky-800">Seu nome será exibido à diretoria. Este navegador pode enviar apenas uma resposta.</p>
							</div>
						</div>
						<label className="mt-4 block text-sm font-bold" htmlFor="nome-respondente">Seu nome</label>
						<input
							id="nome-respondente"
							required
							value={nomeRespondente}
							onChange={(event) => setNomeRespondente(event.target.value)}
							className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white p-3 text-base text-slate-900 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
							placeholder="Digite seu nome completo"
						/>
						<p className="mt-2 text-xs text-sky-800">Apagar os dados do navegador remove esse bloqueio.</p>
					</section>
				)}

				{perguntas.map((pergunta) => (
					<label key={pergunta.id} className="block min-w-0 rounded-2xl bg-white p-4 shadow-sm sm:p-5">
						<span className="break-words font-bold text-slate-800">
							{pergunta.titulo}{pergunta.obrigatoria && <span className="text-orange-600"> *</span>}
						</span>
						{pergunta.tipo === "paragraph" ? (
							<textarea required={pergunta.obrigatoria} onChange={(event) => setRespostas({ ...respostas, [pergunta.id]: event.target.value })} className="mt-3 min-h-28 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base" />
						) : pergunta.tipo === "short_text" ? (
							<input required={pergunta.obrigatoria} onChange={(event) => setRespostas({ ...respostas, [pergunta.id]: event.target.value })} className="mt-3 min-h-11 w-full min-w-0 rounded-xl border border-sky-100 p-3 text-base" />
						) : (
							<span className="mt-3 grid min-w-0 gap-2">
								{pergunta.opcoes.map((opcao) => (
									<label key={opcao.id} className="flex min-h-11 min-w-0 items-center gap-3 text-sm text-slate-700">
										<input required={pergunta.obrigatoria && pergunta.tipo === "multiple_choice"} type={pergunta.tipo === "checkbox" ? "checkbox" : "radio"} name={pergunta.id} value={opcao.texto} className="h-5 w-5 shrink-0" onChange={(event) => {
											const anterior: string[] = Array.isArray(respostas[pergunta.id]) ? respostas[pergunta.id] as string[] : [];
											setRespostas({ ...respostas, [pergunta.id]: pergunta.tipo === "checkbox" ? (event.target.checked ? [...anterior, opcao.texto] : anterior.filter((valor) => valor !== opcao.texto)) : opcao.texto });
										}} />
										<span className="min-w-0 break-words">{opcao.texto}</span>
									</label>
								))}
							</span>
						)}
					</label>
				))}
				{enviar.error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{enviar.error.message}</p>}
				<button disabled={enviar.isPending} style={{ backgroundColor: configuracao.corDestaque }} className="min-h-11 w-full rounded-xl px-5 py-3 font-extrabold text-white disabled:opacity-50">
					{enviar.isPending ? "Enviando…" : "Enviar respostas"}
				</button>
			</form>
		</main>
	);
}
