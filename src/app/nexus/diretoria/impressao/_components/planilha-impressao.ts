import { CABECALHOS, normalizar, texto } from "./suporte";

export async function exportarModelo() {
	const XLSX = await import("xlsx");
	const planilha = XLSX.utils.json_to_sheet(
		[
			{
				Semana: 1,
				"Data da aula": "2026-09-11",
				"Data de entrega": "2026-09-08",
				Apostila: "Nome da apostila",
				Curso: "Nome do curso",
				Responsáveis: "Nome do diretor",
				"Pronta?": "NÃO",
				"Impressa?": "NÃO",
				"Quantidade impressa": 0,
				"Quantidade alvo": 0,
				"Aula realizada?": "NÃO",
			},
		],
		{ header: CABECALHOS },
	);
	planilha["!cols"] = CABECALHOS.map((cabecalho) => ({
		wch: Math.max(16, cabecalho.length + 4),
	}));
	const arquivo = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(arquivo, planilha, "Controle de impressão");
	XLSX.writeFile(arquivo, "Modelo_controle_de_impressao.xlsx", {
		compression: true,
	});
}

export async function lerPlanilhaImpressao(arquivo: File) {
	const XLSX = await import("xlsx");
	const livro = XLSX.read(await arquivo.arrayBuffer(), {
		type: "array",
		cellDates: true,
	});
	const aba = livro.SheetNames[0];
	const planilha = aba ? livro.Sheets[aba] : undefined;
	if (!planilha) throw new Error("A planilha não possui uma aba de dados.");
	const matriz = XLSX.utils.sheet_to_json<unknown[]>(planilha, {
		header: 1,
		defval: "",
	});
	const metasPorCurso = new Map<string, number>();
	const abaDados = livro.SheetNames.find(
		(nome) => normalizar(nome) === "dados",
	);
	if (abaDados && livro.Sheets[abaDados]) {
		for (const linha of XLSX.utils.sheet_to_json<unknown[]>(
			livro.Sheets[abaDados],
			{ header: 1, defval: "" },
		)) {
			if (texto(linha[0]))
				metasPorCurso.set(
					normalizar(linha[0]),
					Math.max(0, Number(linha[1]) || 0),
				);
		}
	}
	const linhas: Array<Record<string, unknown>> = [];
	const ehModeloPadrao = normalizar(matriz[0]?.[0]) === "semana";
	if (ehModeloPadrao) {
		const cabecalhos = matriz[0]?.map((cabecalho) => texto(cabecalho)) ?? [];
		for (const valores of matriz.slice(1))
			linhas.push(
				Object.fromEntries(
					cabecalhos.map((cabecalho, indice) => [
						cabecalho,
						valores[indice] ?? "",
					]),
				),
			);
	} else {
		let semanaAtual = 0;
		for (const valores of matriz) {
			const cabecalhoAula = texto(valores[0]).match(/^aula\s+(\d+)$/i);
			if (cabecalhoAula) {
				semanaAtual = Number(cabecalhoAula[1]);
				continue;
			}
			const titulo = texto(valores[0]);
			const curso = texto(valores[1]);
			if (
				!semanaAtual ||
				!titulo ||
				!curso ||
				normalizar(titulo) === "apostila"
			)
				continue;
			linhas.push({
				Semana: semanaAtual,
				"Data de entrega": valores[3],
				Apostila: titulo,
				Curso: curso,
				Responsáveis: valores[2],
				"Pronta?": valores[4],
				"Impressa?": valores[5],
				"Quantidade impressa": valores[6],
				"Quantidade alvo": metasPorCurso.get(normalizar(curso)) ?? 0,
				"Aula realizada?": valores[8],
			});
		}
	}
	return linhas;
}
