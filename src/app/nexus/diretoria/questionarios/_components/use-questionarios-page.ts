"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { criarQrComAssinatura } from "./suporte";

export function useQuestionariosPage() {
	const utils = api.useUtils();
	const { data: formularios, isLoading } = api.formulario.list.useQuery();
	const [busca, setBusca] = useState("");
	const [confirmarExclusao, setConfirmarExclusao] = useState<{
		id: string;
		titulo: string;
		respostas: number;
	} | null>(null);
	const [questionarioQr, setQuestionarioQr] = useState<{
		titulo: string;
		slug: string;
	} | null>(null);
	const [imagemQr, setImagemQr] = useState<string | null>(null);
	const [erroQr, setErroQr] = useState<string | null>(null);
	useEffect(() => {
		if (!questionarioQr) {
			setImagemQr(null);
			setErroQr(null);
			return;
		}
		let ativo = true;
		setImagemQr(null);
		setErroQr(null);
		void criarQrComAssinatura(
			`${window.location.origin}/questionarios/${questionarioQr.slug}`,
		)
			.then((imagem) => {
				if (ativo) setImagemQr(imagem);
			})
			.catch(() => {
				if (ativo) setErroQr("Não foi possível gerar o QR Code.");
			});
		return () => {
			ativo = false;
		};
	}, [questionarioQr]);
	const removerFormulario = api.formulario.remove.useMutation({
		onSuccess: async () => {
			await utils.formulario.list.invalidate();
			setConfirmarExclusao(null);
		},
	});
	const questionariosFiltrados = useMemo(() => {
		const termo = busca
			.trim()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase();
		const encontrados =
			formularios?.filter((formulario) =>
				formulario.titulo
					.normalize("NFD")
					.replace(/[\u0300-\u036f]/g, "")
					.toLowerCase()
					.includes(termo),
			) ?? [];
		return encontrados.sort((a, b) =>
			a.visibilidade === b.visibilidade
				? 0
				: a.visibilidade === "COMPARTILHADO"
					? -1
					: 1,
		);
	}, [busca, formularios]);
	return {
		busca,
		setBusca,
		isLoading,
		questionariosFiltrados,
		setQuestionarioQr,
		setConfirmarExclusao,
		formularios,
		confirmarExclusao,
		removerFormulario,
		questionarioQr,
		imagemQr,
		erroQr,
	};
}
