"use client";
import { useState } from "react";
import { api } from "~/trpc/react";

export function useSemestresDiretoria() {
	const utils = api.useUtils();
	const { data: semestres, isLoading } =
		api.diretoria.semestres.list.useQuery();
	const [codigo, setCodigo] = useState("");
	const [erro, setErro] = useState("");
	const [semestreParaDuplicar, setSemestreParaDuplicar] = useState<{
		id: string;
		codigo: string;
	} | null>(null);
	const [codigoDestino, setCodigoDestino] = useState("");
	const atualizar = () => utils.diretoria.semestres.list.invalidate();
	const criar = api.diretoria.semestres.create.useMutation({
		onSuccess: () => {
			setCodigo("");
			setErro("");
			atualizar();
		},
		onError: (e) => setErro(e.message),
	});
	const ativar = api.diretoria.semestres.setAtivo.useMutation({
		onSuccess: atualizar,
	});
	const remover = api.diretoria.semestres.remove.useMutation({
		onSuccess: atualizar,
		onError: (e) => setErro(e.message),
	});
	const duplicar = api.diretoria.semestres.duplicate.useMutation({
		onSuccess: () => {
			setSemestreParaDuplicar(null);
			setCodigoDestino("");
			atualizar();
		},
		onError: (e) => setErro(e.message),
	});
	return {
		codigo,
		setCodigo,
		criar,
		erro,
		isLoading,
		semestres,
		ativar,
		setSemestreParaDuplicar,
		setCodigoDestino,
		remover,
		semestreParaDuplicar,
		duplicar,
		codigoDestino,
	};
}
