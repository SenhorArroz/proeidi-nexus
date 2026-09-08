"use client";

export type Pergunta = {
	id: string;
	titulo: string;
	tipo: "short_text" | "paragraph" | "multiple_choice" | "checkbox";
	opcoes: { id: string; texto: string }[];
	obrigatoria: boolean;
};

export type ConfiguracaoFormulario = {
	corPrimaria: string;
	corDestaque: string;
	corFundo: string;
	fonte: "SANS" | "SERIF" | "MONO";
	mostrarProgresso: boolean;
	atribuirPontuacao: boolean;
};

export const configuracaoPadrao: ConfiguracaoFormulario = {
	corPrimaria: "#0284c7",
	corDestaque: "#ea580c",
	corFundo: "#f8fafc",
	fonte: "SANS",
	mostrarProgresso: true,
	atribuirPontuacao: false,
};

export const COOKIE_NAME = "nexus_questionario_dispositivo";

export const COOKIE_VAZIO = "00000000-0000-4000-8000-000000000000";

export function obterIdentificadorDoNavegador() {
	const salvo = document.cookie
		.split("; ")
		.find((item) => item.startsWith(`${COOKIE_NAME}=`))
		?.split("=")[1];
	if (salvo) return decodeURIComponent(salvo);
	const identificador = crypto.randomUUID();
	document.cookie = `${COOKIE_NAME}=${encodeURIComponent(identificador)}; Max-Age=31536000; Path=/; SameSite=Lax`;
	return identificador;
}
