"use client";

export type CandidatoExportavel = {
	ficha: string;
	nome: string;
	dataNascimento: Date;
	cpf: string;
	telefone: string;
	emergencia: string;
	curso: "SMARTPHONE" | "COMPUTADOR";
	createdAt: Date;
};

export const CABECALHOS_INSCRICAO = [
	"Carimbo de data/hora",
	"Nome Completo",
	"Número da ficha",
	"Data de Nascimento",
	"CPF",
	"Telefone para Contato",
	"Contato de Emergência",
	"Curso de interesse - Apenas uma opção",
] as const;

export const formatarCpf = (valor: string) => {
	const digitos = valor.replace(/\D/g, "").slice(0, 11);
	if (digitos.length <= 3) return digitos;
	if (digitos.length <= 6) return `${digitos.slice(0, 3)}.${digitos.slice(3)}`;
	if (digitos.length <= 9)
		return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6)}`;
	return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
};

export const exportarResultados = async (
	smartphone: number[],
	computador: number[],
	modo: "vinculado" | "simples",
	candidatos: CandidatoExportavel[],
	codigoSemestre: string,
) => {
	if (modo === "vinculado") {
		if (smartphone.length === 0 && computador.length === 0) {
			alert("Ainda não há pessoas sorteadas para exportar.");
			return;
		}

		const XLSX = await import("xlsx");
		const registrosDoCurso = (
			sorteados: number[],
			curso: "SMARTPHONE" | "COMPUTADOR",
		) =>
			sorteados.flatMap((ficha) => {
				const candidato = candidatos.find(
					(item) => Number(item.ficha) === ficha && item.curso === curso,
				);
				if (!candidato) return [];
				return [
					{
						[CABECALHOS_INSCRICAO[0]]: candidato.createdAt,
						[CABECALHOS_INSCRICAO[1]]: candidato.nome,
						[CABECALHOS_INSCRICAO[2]]: candidato.ficha,
						[CABECALHOS_INSCRICAO[3]]: candidato.dataNascimento,
						[CABECALHOS_INSCRICAO[4]]: formatarCpf(candidato.cpf),
						[CABECALHOS_INSCRICAO[5]]: candidato.telefone,
						[CABECALHOS_INSCRICAO[6]]: candidato.emergencia,
						[CABECALHOS_INSCRICAO[7]]:
							curso === "SMARTPHONE" ? "Smartphone" : "Computador",
					},
				];
			});
		const adicionarAba = (
			arquivo: ReturnType<typeof XLSX.utils.book_new>,
			nome: string,
			registros: ReturnType<typeof registrosDoCurso>,
		) => {
			const planilha = XLSX.utils.json_to_sheet(registros, {
				header: [...CABECALHOS_INSCRICAO],
			});
			planilha["!cols"] = [
				{ wch: 22 },
				{ wch: 34 },
				{ wch: 16 },
				{ wch: 18 },
				{ wch: 16 },
				{ wch: 25 },
				{ wch: 38 },
				{ wch: 34 },
			];
			for (let linha = 2; linha <= registros.length + 1; linha += 1) {
				if (planilha[`A${linha}`]) planilha[`A${linha}`].z = "dd/mm/yyyy hh:mm";
				if (planilha[`D${linha}`]) planilha[`D${linha}`].z = "dd/mm/yyyy";
			}
			XLSX.utils.book_append_sheet(arquivo, planilha, nome);
		};

		const arquivo = XLSX.utils.book_new();
		adicionarAba(
			arquivo,
			"Smartphone",
			registrosDoCurso(smartphone, "SMARTPHONE"),
		);
		adicionarAba(
			arquivo,
			"Computador",
			registrosDoCurso(computador, "COMPUTADOR"),
		);
		const codigo = codigoSemestre.replace(/[^a-zA-Z0-9_-]+/g, "_");
		XLSX.writeFile(arquivo, `Sorteados_${codigo}.xlsx`, { compression: true });
		return;
	}

	const BOM = "\ufeff";
	const cabecalho = "Smartphone;Computador\n";

	const totalLinhas = Math.max(smartphone.length, computador.length);

	const linhas = Array.from({ length: totalLinhas }, (_, i) => {
		const sNum = smartphone[i];
		const cNum = computador[i];

		let sText = "";
		let cText = "";

		// Processa coluna Smartphone
		if (sNum !== undefined) {
			sText = sNum.toString();
		}

		// Processa coluna Computador
		if (cNum !== undefined) {
			cText = cNum.toString();
		}

		return `${sText};${cText}`;
	}).join("\n");

	const csvFinal = BOM + cabecalho + linhas;
	const blob = new Blob([csvFinal], { type: "text/csv;charset=utf-8;" });

	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	const dataAtual = new Date().toLocaleDateString().replace(/\//g, "-");

	link.href = url;
	link.download = `Sorteio_${dataAtual}.csv`;
	document.body.appendChild(link);
	link.click();

	document.body.removeChild(link);
	URL.revokeObjectURL(url);
};

export const LIMITE_DE_EXCLUSOES = 10_000;

export const interpretarNumerosExcluidos = (valor: string) => {
	const numeros = new Set<number>();
	const invalidos: string[] = [];

	for (const item of valor
		.split(",")
		.map((parte) => parte.trim())
		.filter(Boolean)) {
		const intervalo = item.match(/^(\d+)\s*-\s*(\d+)$/);

		if (intervalo) {
			const inicio = Number(intervalo[1]);
			const fim = Number(intervalo[2]);
			const [menor, maior] = inicio <= fim ? [inicio, fim] : [fim, inicio];

			if (
				!Number.isSafeInteger(inicio) ||
				!Number.isSafeInteger(fim) ||
				maior - menor + 1 > LIMITE_DE_EXCLUSOES
			) {
				invalidos.push(item);
				continue;
			}

			for (let numero = menor; numero <= maior; numero += 1)
				numeros.add(numero);
			continue;
		}

		if (/^\d+$/.test(item) && Number.isSafeInteger(Number(item))) {
			numeros.add(Number(item));
		} else {
			invalidos.push(item);
		}
	}

	return { numeros, invalidos };
};
