import { removerHorarioDaTurma } from "./mapeamento-turmas-importacao";
import type { Aluno } from "./suporte";

export function lerAlunosPlanilha(lines: unknown[][], semestreFiltro: string) {
	const firstLine = lines[0] ?? [];
	const headers = firstLine.map((h) => String(h).trim().toLowerCase());

	// Mapeamento esperado baseado nas colunas do Forms
	const colMap: Record<
		string,
		Exclude<keyof Aluno, "turmasVinculadas"> | "ignorar"
	> = {
		"carimbo de data/hora": "ignorar",
		"nome - completo e sem abreviações": "nome",
		turma: "turma",
		"data de nascimento": "dataNascimento",
		cpf: "cpf",
		"qual é sua cor ou raça?": "corRaca",
		"qual sua identidade de gênero?": "identidadeGenero",
		"você se identifica como uma pessoa lgbtqiapn+?": "lgbtqiapn",
		telefone: "telefone",
		"contato de emergência": "contatoEmergencia",
		"e-mail": "email",
		"responsável pelo cuidado de terceiros?": "cuidaTerceiros",
		escolaridade: "escolaridade",
		"você trabalha atualmente?": "trabalha",
		"se sim na questão anterior: onde trabalha e qual a função?":
			"trabalhoLocal",
		"você estuda atualmente?": "estuda",
		"se sim na questão anterior: onde estuda e qual o curso?": "estudoLocal",
		"possui algum problema de saúde": "problemaSaude",
		"qual?": "problemaSaudeQual",
		"você tem alguma necessidade especial?": "necessidadeEspecial",
		"qual é a sua necessidade especial?": "necessidadeEspecialQual",
		"você tem acesso à internet?": "acessoInternet",
		"você tem computador ou notebook?": "temComputador",
		"você tem smartphone?": "temSmartphone",
		"informe o sistema operacional do seu smartphone": "sistemaSmartphone",
	};

	const newAlunos: Aluno[] = [];

	for (let i = 1; i < lines.length; i++) {
		const row = lines[i];
		if (!row || row.length === 0 || row.every((cell) => !cell)) continue; // Pular linhas vazias

		const novoAluno: Partial<
			Record<Exclude<keyof Aluno, "turmasVinculadas">, string>
		> = {
			id: (Date.now() + i).toString(),
			semestre: semestreFiltro,
			turma: "",
		};

		headers.forEach((header, index) => {
			const targetField = colMap[header];
			if (targetField && targetField !== "ignorar") {
				const rawVal = row[index];
				let val =
					rawVal instanceof Date
						? rawVal.toISOString().slice(0, 10)
						: rawVal !== undefined && rawVal !== null
							? String(rawVal).trim()
							: "";

				// Tratamento simples para Sim/Não
				if (
					[
						"cuidaTerceiros",
						"trabalha",
						"estuda",
						"problemaSaude",
						"necessidadeEspecial",
						"acessoInternet",
						"temComputador",
						"temSmartphone",
					].includes(targetField)
				) {
					val = val.toLowerCase().startsWith("s") ? "Sim" : "Não";
				}

				// Formatar dataNascimento de DD/MM/YYYY para YYYY-MM-DD
				if (targetField === "dataNascimento" && val.includes("/")) {
					const parts = val.split("/");
					if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
						val = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
					}
				}
				if (targetField === "dataNascimento" && val.includes("T"))
					val = val.split("T")[0] ?? "";
				if (targetField === "turma") val = removerHorarioDaTurma(val);

				novoAluno[targetField] = val;
			}
		});

		// Só adiciona se tiver pelo menos o nome preenchido
		if (novoAluno.nome) {
			newAlunos.push(novoAluno as Aluno);
		}
	}

	return newAlunos;
}
