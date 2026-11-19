export function diaCalendario(data: Date) {
	return data.toISOString().slice(0, 10);
}

export function intervaloDoDia(data: Date) {
	const inicio = new Date(`${diaCalendario(data)}T00:00:00Z`);
	const fim = new Date(inicio);
	fim.setUTCDate(fim.getUTCDate() + 1);
	return { gte: inicio, lt: fim };
}
