/** Normaliza texto humano para buscas locais consistentes, inclusive com acentos. */
export function normalizarBusca(valor: string) {
	return valor
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLocaleLowerCase("pt-BR")
		.replace(/\s+/g, " ")
		.trim();
}
