"use client";
import { use, useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { COOKIE_VAZIO, obterIdentificadorDoNavegador } from "./suporte";
export function useResponderQuestionario(params: Promise<{ slug: string }>) {
	const { slug } = use(params);
	const { data, isLoading, error } = api.formulario.publicGet.useQuery({
		slug,
	});
	const enviar = api.formulario.publicSubmit.useMutation();
	const [respostas, setRespostas] = useState<Record<string, string | string[]>>(
		{},
	);
	const [nomeRespondente, setNomeRespondente] = useState("");
	const [identificadorCookie, setIdentificadorCookie] = useState<string | null>(
		null,
	);
	const [modoEdicao, setModoEdicao] = useState(false);
	const exigeIdentificador = Boolean(
		data &&
			(data.modoResposta === "IDENTIFICADO_POR_COOKIE" ||
				data.limitarPorNavegador),
	);
	const status = api.formulario.publicResponseStatus.useQuery(
		{ slug, identificadorCookie: identificadorCookie ?? COOKIE_VAZIO },
		{ enabled: exigeIdentificador && Boolean(identificadorCookie) },
	);

	useEffect(() => {
		if (exigeIdentificador)
			setIdentificadorCookie(obterIdentificadorDoNavegador());
	}, [exigeIdentificador]);

	const respostaAnterior = status.data?.resposta;
	const iniciarEdicao = () => {
		if (!respostaAnterior) return;
		setRespostas(
			respostaAnterior.respostas as Record<string, string | string[]>,
		);
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
	return {
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
	};
}
