"use client";

export const dataFormatada = (data?: Date) =>
	data
		? new Intl.DateTimeFormat("pt-BR", {
				weekday: "short",
				day: "2-digit",
				month: "short",
				hour: "2-digit",
				minute: "2-digit",
			}).format(data)
		: "Sem próxima aula";
