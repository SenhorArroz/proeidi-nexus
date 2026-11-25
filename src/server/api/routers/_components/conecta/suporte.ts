import { z } from "zod";

export const id = z.string().cuid();

export const nome = z.string().trim().min(1).max(160);

export function somarPontosDaDoacao(
	itens: { quantidade: number; pontosUnitarios: number }[],
) {
	return itens.reduce(
		(total, item) => total + item.quantidade * item.pontosUnitarios,
		0,
	);
}
