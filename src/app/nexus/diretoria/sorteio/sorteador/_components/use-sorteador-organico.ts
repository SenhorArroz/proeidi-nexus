"use client";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import { interpretarNumerosExcluidos } from "./suporte";

export function useSorteadorOrganico() {
	const { data: semestres, isLoading: carregandoSemestres } =
		api.diretoria.semestres.list.useQuery();
	const [semestreId, setSemestreId] = useState("");
	const semestreSelecionado =
		semestres?.find((semestre) => semestre.id === semestreId) ??
		semestres?.find((semestre) => semestre.ativo) ??
		semestres?.[0];
	const { data: candidatosDb, isLoading: carregandoCandidatos } =
		api.diretoria.candidatos.list.useQuery(
			{ semestreId: semestreSelecionado?.id ?? "c0000000000000000000000000" },
			{ enabled: Boolean(semestreSelecionado) },
		);
	const candidatos = candidatosDb ?? [];
	const getNomeCandidato = (ficha: number, curso: string) =>
		candidatos.find(
			(candidato) =>
				Number(candidato.ficha) === ficha &&
				candidato.curso ===
					(curso === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"),
		)?.nome;
	const [min, setMin] = useState(1);
	const [max, setMax] = useState(100);
	const [results, setResults] = useState<number[]>([]);
	const [isAnimating, setIsAnimating] = useState(false);

	// NOVO ESTADO: Controle do modo de sorteio
	const [modo, setModo] = useState<"vinculado" | "simples">("vinculado");

	const [smartphoneHistory, setSmartphoneHistory] = useState<number[]>([]);
	const [computerHistory, setComputerHistory] = useState<number[]>([]);
	const [deviceType, setDeviceType] = useState<"Smartphone" | "Computador">(
		"Smartphone",
	);
	const [numerosExcluidos, setNumerosExcluidos] = useState("");
	const [exclusoesAbertas, setExclusoesAbertas] = useState(false);
	const candidatosDoModulo = candidatos.filter(
		(candidato) =>
			candidato.curso ===
			(deviceType === "Smartphone" ? "SMARTPHONE" : "COMPUTADOR"),
	);
	const exclusoes = useMemo(
		() => interpretarNumerosExcluidos(numerosExcluidos),
		[numerosExcluidos],
	);

	useEffect(() => {
		if (!semestreId && semestreSelecionado)
			setSemestreId(semestreSelecionado.id);
	}, [semestreId, semestreSelecionado]);

	useEffect(() => {
		const tratarFechamento = (e: BeforeUnloadEvent) => {
			if (smartphoneHistory.length > 0 || computerHistory.length > 0) {
				e.preventDefault();
				e.returnValue = "";
			}
		};
		window.addEventListener("beforeunload", tratarFechamento);
		return () => window.removeEventListener("beforeunload", tratarFechamento);
	}, [smartphoneHistory, computerHistory]);

	const gerarNumeroOrganico = (lista: number[]) => {
		const indice = Math.floor(
			((Math.random() * performance.now()) % 1) * lista.length,
		);
		return lista[indice] ?? null;
	};

	const sortear = () => {
		if (exclusoes.invalidos.length > 0) {
			alert(
				`Revise os números excluídos: ${exclusoes.invalidos.join(", ")}. Use números separados por vírgula ou intervalos como 1-10.`,
			);
			return;
		}

		setIsAnimating(true);
		setResults([]);

		setTimeout(() => {
			const historicoAlvo =
				deviceType === "Smartphone" ? smartphoneHistory : computerHistory;

			const possiveis =
				modo === "vinculado"
					? candidatosDoModulo
							.map((candidato) => Number(candidato.ficha))
							.filter(
								(ficha) =>
									Number.isSafeInteger(ficha) &&
									!historicoAlvo.includes(ficha) &&
									!exclusoes.numeros.has(ficha),
							)
					: Array.from(
							{ length: Math.max(0, max - min + 1) },
							(_, indice) => min + indice,
						).filter(
							(numero) =>
								!historicoAlvo.includes(numero) &&
								!exclusoes.numeros.has(numero),
						);

			if (possiveis.length === 0) {
				alert(
					modo === "vinculado" && candidatosDoModulo.length === 0
						? `Não há candidatos de ${deviceType} cadastrados para este semestre. Cadastre as fichas antes de sortear.`
						: `Não há mais fichas disponíveis para ${deviceType} neste sorteio.`,
				);
				setIsAnimating(false);
				return;
			}

			const sorteado = gerarNumeroOrganico(possiveis);
			if (sorteado === null) {
				setIsAnimating(false);
				return;
			}
			setResults([sorteado]);

			if (deviceType === "Smartphone") {
				setSmartphoneHistory((prev) => [sorteado, ...prev]);
			} else {
				setComputerHistory((prev) => [sorteado, ...prev]);
			}
			setIsAnimating(false);
		}, 900);
	};

	const resetar = () => {
		if (confirm("Limpar todos os registros?")) {
			setSmartphoneHistory([]);
			setComputerHistory([]);
			setResults([]);
			setNumerosExcluidos("");
		}
	};

	// Pega o nome do ganhador atual (se aplicável)
	const resultadoAtual = results.at(0);
	const ganhadorAtual =
		!isAnimating && resultadoAtual !== undefined && modo === "vinculado"
			? getNomeCandidato(resultadoAtual, deviceType)
			: null;
	return {
		carregandoSemestres,
		carregandoCandidatos,
		semestreSelecionado,
		setSemestreId,
		semestres,
		setModo,
		modo,
		setDeviceType,
		deviceType,
		candidatosDoModulo,
		min,
		setMin,
		max,
		setMax,
		setExclusoesAbertas,
		exclusoesAbertas,
		numerosExcluidos,
		exclusoes,
		setNumerosExcluidos,
		isAnimating,
		results,
		ganhadorAtual,
		sortear,
		smartphoneHistory,
		computerHistory,
		candidatos,
		resetar,
		getNomeCandidato,
	};
}
