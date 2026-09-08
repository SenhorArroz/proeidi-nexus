"use client";
import { EstadoEnviado } from "./_components/estado-enviado";
import { EstadoRespondido } from "./_components/estado-respondido";
import { FormularioRespostaQuestionario } from "./_components/formulario-resposta-questionario";
import {
	configuracaoPadrao,
	type ConfiguracaoFormulario,
	type Pergunta,
} from "./_components/suporte";
import { useResponderQuestionario } from "./_components/use-responder-questionario";

export default function ResponderQuestionario({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const {
		slug,
		data,
		isLoading,
		error,
		enviar,
		respostas,
		setRespostas,
		nomeRespondente,
		setNomeRespondente,
		identificadorCookie,
		modoEdicao,
		exigeIdentificador,
		status,
		respostaAnterior,
		iniciarEdicao,
		responderNovamente,
	} = useResponderQuestionario(params);

	if (isLoading)
		return (
			<main className="grid min-h-screen place-items-center text-slate-500">
				Carregando…
			</main>
		);
	if (error || !data)
		return (
			<main className="grid min-h-screen place-items-center p-6 text-center text-slate-600">
				Este questionário não está disponível.
			</main>
		);
	const perguntas = (data.conteudo as { perguntas: Pergunta[] }).perguntas;
	const configuracao = {
		...configuracaoPadrao,
		...(data.configuracao as Partial<ConfiguracaoFormulario> | null),
	};
	const fonte =
		configuracao.fonte === "SERIF"
			? "font-serif"
			: configuracao.fonte === "MONO"
				? "font-mono"
				: "font-sans";
	const respondidas = perguntas.filter((pergunta) => {
		const resposta = respostas[pergunta.id];
		return Array.isArray(resposta)
			? resposta.length > 0
			: Boolean(resposta?.trim());
	}).length;
	const identificado = data.modoResposta === "IDENTIFICADO_POR_COOKIE";

	if (exigeIdentificador && (!identificadorCookie || status.isLoading))
		return (
			<main
				className="grid min-h-screen place-items-center p-6 text-center"
				style={{ backgroundColor: configuracao.corFundo }}
			>
				<p className="text-sm font-semibold text-slate-600">
					Verificando sua participação…
				</p>
			</main>
		);
	if (
		exigeIdentificador &&
		respostaAnterior &&
		!modoEdicao &&
		!enviar.isSuccess
	)
		return (
			<EstadoRespondido
				fonte={fonte}
				configuracao={configuracao}
				onEditar={iniciarEdicao}
			/>
		);
	if (enviar.isSuccess)
		return (
			<EstadoEnviado
				fonte={fonte}
				configuracao={configuracao}
				pontuacao={enviar.data?.pontuacao}
				editando={modoEdicao}
				respostaUnica={exigeIdentificador}
				onContinuar={exigeIdentificador ? iniciarEdicao : responderNovamente}
			/>
		);

	return (
		<main
			className={`min-h-screen min-w-0 overflow-x-clip px-3 py-6 sm:px-4 sm:py-10 ${fonte}`}
			style={{ backgroundColor: configuracao.corFundo }}
		>
			<FormularioRespostaQuestionario
				slug={slug}
				enviar={enviar}
				modoEdicao={modoEdicao}
				exigeIdentificador={exigeIdentificador}
				identificado={identificado}
				identificadorCookie={identificadorCookie}
				configuracao={configuracao}
				data={data}
				respondidas={respondidas}
				perguntas={perguntas}
				nomeRespondente={nomeRespondente}
				setNomeRespondente={setNomeRespondente}
				respostas={respostas}
				setRespostas={setRespostas}
			/>
		</main>
	);
}
