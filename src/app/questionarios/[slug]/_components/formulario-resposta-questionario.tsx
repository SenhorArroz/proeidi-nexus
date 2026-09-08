"use client";
import { ShieldCheck } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { RouterOutputs } from "~/trpc/react";
import { api } from "~/trpc/react";
import { PerguntaCampo } from "./pergunta-campo";
import { type Pergunta } from "./suporte";

type FormularioRespostaQuestionarioProps = {
	slug: string;
	enviar: ReturnType<typeof api.formulario.publicSubmit.useMutation>;
	modoEdicao: boolean;
	exigeIdentificador: boolean;
	identificado: boolean;
	identificadorCookie: string | null;
	configuracao: {
		corPrimaria: string;
		corDestaque: string;
		corFundo: string;
		fonte: "SANS" | "SERIF" | "MONO";
		mostrarProgresso: boolean;
		atribuirPontuacao: boolean;
	};
	data: NonNullable<RouterOutputs["formulario"]["publicGet"]>;
	respondidas: number;
	perguntas: Pergunta[];
	nomeRespondente: string;
	setNomeRespondente: Dispatch<SetStateAction<string>>;
	respostas: Record<string, string | string[]>;
	setRespostas: Dispatch<SetStateAction<Record<string, string | string[]>>>;
};
export function FormularioRespostaQuestionario({
	slug,
	enviar,
	modoEdicao,
	exigeIdentificador,
	identificado,
	identificadorCookie,
	configuracao,
	data,
	respondidas,
	perguntas,
	nomeRespondente,
	setNomeRespondente,
	respostas,
	setRespostas,
}: FormularioRespostaQuestionarioProps) {
	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				enviar.mutate({
					slug,
					respostas,
					editarUltima: modoEdicao,
					...(exigeIdentificador
						? {
								...(identificado ? { nomeRespondente } : {}),
								identificadorCookie: identificadorCookie ?? undefined,
							}
						: {}),
				});
			}}
			className="view-formulario-resposta-questionario mx-auto min-w-0 max-w-2xl space-y-4"
		>
			<header
				className="min-w-0 rounded-3xl p-4 text-white sm:p-7"
				style={{ backgroundColor: configuracao.corPrimaria }}
			>
				<h1 className="break-words text-2xl font-black">{data.titulo}</h1>
				{data.descricao && (
					<p className="mt-2 break-words text-sky-100">{data.descricao}</p>
				)}
			</header>
			{modoEdicao && (
				<p className="rounded-xl bg-white p-3 text-sm font-bold text-slate-700 shadow-sm">
					Você está editando a sua última resposta.
				</p>
			)}
			{configuracao.mostrarProgresso && (
				<div className="rounded-2xl bg-white p-4 shadow-sm">
					<div className="flex justify-between text-sm font-bold text-slate-700">
						<span>Progresso</span>
						<span>
							{respondidas}/{perguntas.length}
						</span>
					</div>
					<div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
						<div
							className="h-full rounded-full transition-all"
							style={{
								width: `${perguntas.length ? (respondidas / perguntas.length) * 100 : 0}%`,
								backgroundColor: configuracao.corDestaque,
							}}
						/>
					</div>
				</div>
			)}
			{identificado && (
				<section className="rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sky-950 sm:p-5">
					<div className="flex items-start gap-3">
						<ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" />
						<div>
							<h2 className="font-extrabold">Resposta identificada</h2>
							<p className="mt-1 text-sm text-sky-800">
								Seu nome será exibido à diretoria. Este navegador pode enviar
								apenas uma resposta.
							</p>
						</div>
					</div>
					<label
						className="mt-4 block text-sm font-bold"
						htmlFor="nome-respondente"
					>
						Seu nome
					</label>
					<input
						id="nome-respondente"
						required
						value={nomeRespondente}
						onChange={(event) => setNomeRespondente(event.target.value)}
						className="mt-2 min-h-11 w-full rounded-xl border border-sky-200 bg-white p-3 text-base text-sky-950 outline-none focus:border-sky-600 focus:ring-2 focus:ring-sky-100"
						placeholder="Digite seu nome completo"
					/>
				</section>
			)}
			{perguntas.map((pergunta) => (
				<PerguntaCampo
					key={pergunta.id}
					pergunta={pergunta}
					respostas={respostas}
					onChange={setRespostas}
				/>
			))}
			{enviar.error && (
				<p
					role="alert"
					className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
				>
					{enviar.error.message}
				</p>
			)}
			<button
				disabled={enviar.isPending}
				style={{ backgroundColor: configuracao.corDestaque }}
				className="min-h-11 w-full rounded-xl px-5 py-3 font-extrabold text-white disabled:opacity-50"
			>
				{enviar.isPending
					? "Enviando…"
					: modoEdicao
						? "Salvar alterações"
						: "Enviar respostas"}
			</button>
		</form>
	);
}
