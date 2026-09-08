"use client";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export function useControleTurmasPage() {
	const [semestreId, setSemestreId] = useState("");
	const [gerando, setGerando] = useState(false);
	const [erroPdf, setErroPdf] = useState("");
	useEffect(() => {
		setSemestreId(
			new URLSearchParams(window.location.search).get("semestreId") ?? "",
		);
	}, []);
	const semestres = api.diretoria.semestres.list.useQuery();
	const semestre =
		semestres.data?.find((s) => s.id === semestreId) ??
		semestres.data?.find((s) => s.ativo) ??
		semestres.data?.[0];
	const turmas = api.diretoria.turmas.list.useQuery(
		{ semestreId: semestre?.id },
		{ enabled: Boolean(semestre) },
	);
	const carregando =
		semestres.isLoading || (Boolean(semestre) && turmas.isLoading);
	const erro = semestres.error || turmas.error;
	async function baixarPdf() {
		if (!turmas.data?.length || !semestre) return;
		setGerando(true);
		setErroPdf("");
		try {
			const { gerarControleTurmaPdf } = await import(
				"~/lib/controle-turma-pdf"
			);
			const bytes = await gerarControleTurmaPdf(turmas.data);
			const url = URL.createObjectURL(
				new Blob([new Uint8Array(bytes)], { type: "application/pdf" }),
			);
			const link = document.createElement("a");
			link.href = url;
			link.download = `controle-turmas-${semestre.codigo}.pdf`;
			link.click();
			setTimeout(() => URL.revokeObjectURL(url), 60000);
		} catch {
			setErroPdf("Não foi possível gerar o PDF. Tente novamente.");
		} finally {
			setGerando(false);
		}
	}
	return {
		baixarPdf,
		gerando,
		carregando,
		erro,
		turmas,
		semestre,
		setSemestreId,
		setErroPdf,
		semestres,
		erroPdf,
	};
}
