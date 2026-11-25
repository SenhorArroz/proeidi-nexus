export type TourRole = "MONITOR" | "PROFESSOR" | "DIRETOR" | "COORDENADOR";

export type TourStep = {
	titulo: string;
	descricao: string;
	alvo?: { seletor?: string; rotulos?: string[]; alternativa?: string };
	previa?: { abrir: string; fechar?: string; aberto?: string };
};

export type TourGuide = {
	chave: string;
	titulo: string;
	passos: TourStep[];
};

export const introducao = (titulo: string, descricao: string): TourStep => ({
	titulo,
	descricao,
	alvo: { seletor: "h1" },
});

export const acao = (
	titulo: string,
	descricao: string,
	...rotulos: string[]
): TourStep => ({
	titulo,
	descricao,
	alvo: { rotulos },
});

export const mostrar = (
	titulo: string,
	descricao: string,
	seletor: string,
	previa?: TourStep["previa"],
): TourStep => ({
	titulo,
	descricao,
	alvo: { seletor, alternativa: previa?.abrir },
	previa,
});

export const marcador = (id: string) => `[data-tour="${id}"]`;
export const previa = (abrir: string, fechar?: string): TourStep["previa"] => ({
	abrir: marcador(abrir),
	fechar: fechar ? marcador(fechar) : undefined,
});

export function guia(
	chave: string,
	titulo: string,
	...passos: TourStep[]
): TourGuide {
	return { chave, titulo, passos };
}
