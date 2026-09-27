export type TurmaDisponivelImportacao = {
	id: string;
	titulo: string;
};

const PALAVRAS_ESTRUTURAIS = new Set([
	"a",
	"ao",
	"as",
	"curso",
	"da",
	"das",
	"de",
	"do",
	"dos",
	"em",
	"na",
	"nas",
	"no",
	"nos",
	"o",
	"os",
	"para",
	"turma",
]);

export function removerHorarioDaTurma(valor: string) {
	return valor
		.replace(/\s*\([^)]*\)\s*/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function normalizarNomeTurma(valor: string) {
	return removerHorarioDaTurma(valor)
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.replace(/turma\s*0*(\d+)/g, "t$1")
		.replace(/\bt\s*0*(\d+)\b/g, "t$1")
		.replace(/[^a-z0-9]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

function codigoDaTurma(valor: string) {
	const codigo = normalizarNomeTurma(valor).match(/\bt(\d+)\b/);
	return codigo ? Number(codigo[1]) : null;
}

function nomeBaseDaTurma(valor: string) {
	return normalizarNomeTurma(valor)
		.split(" ")
		.filter(
			(token) =>
				token && !PALAVRAS_ESTRUTURAIS.has(token) && !/^t\d+$/.test(token),
		)
		.join(" ");
}

function similaridadeEntreNomes(origem: string, destino: string) {
	if (origem === destino) return 1;
	if (!origem || !destino) return 0;
	const anterior = Array.from({ length: destino.length + 1 }, (_, i) => i);
	for (let i = 1; i <= origem.length; i++) {
		const atual = [i];
		for (let j = 1; j <= destino.length; j++) {
			const custo = origem[i - 1] === destino[j - 1] ? 0 : 1;
			atual[j] = Math.min(
				(atual[j - 1] ?? 0) + 1,
				(anterior[j] ?? 0) + 1,
				(anterior[j - 1] ?? 0) + custo,
			);
		}
		for (let j = 0; j < atual.length; j++) anterior[j] = atual[j] ?? 0;
	}
	return (
		1 -
		(anterior[destino.length] ?? 0) / Math.max(origem.length, destino.length)
	);
}

/**
 * Rastreia o valor da planilha apenas contra títulos retornados pelo banco.
 * Para cursos com várias turmas, o código T1/T2/T3 precisa coincidir. Se o
 * banco possui uma única turma para o curso, o sufixo T da planilha é opcional.
 */
export function encontrarTurmaDaPlanilha<T extends TurmaDisponivelImportacao>(
	turmaPlanilha: string,
	turmasDoBanco: T[],
): { turma: T | null; confianca: number } {
	const nomeNormalizado = normalizarNomeTurma(turmaPlanilha);
	if (!nomeNormalizado) return { turma: null, confianca: 0 };

	const correspondenciasExatas = turmasDoBanco.filter(
		(turma) => normalizarNomeTurma(turma.titulo) === nomeNormalizado,
	);
	const correspondenciaExata = correspondenciasExatas[0];
	if (correspondenciasExatas.length === 1 && correspondenciaExata)
		return { turma: correspondenciaExata, confianca: 100 };

	const nomeBase = nomeBaseDaTurma(turmaPlanilha);
	if (!nomeBase) return { turma: null, confianca: 0 };

	const turmasDoMesmoCurso = turmasDoBanco.filter(
		(turma) => nomeBaseDaTurma(turma.titulo) === nomeBase,
	);
	const codigoPlanilha = codigoDaTurma(turmaPlanilha);
	if (codigoPlanilha !== null) {
		const mesmoCodigo = turmasDoMesmoCurso.filter(
			(turma) => codigoDaTurma(turma.titulo) === codigoPlanilha,
		);
		const turmaComMesmoCodigo = mesmoCodigo[0];
		if (mesmoCodigo.length === 1 && turmaComMesmoCodigo)
			return { turma: turmaComMesmoCodigo, confianca: 100 };
	}

	const turmaUnicaDoCurso = turmasDoMesmoCurso[0];
	if (turmasDoMesmoCurso.length === 1 && turmaUnicaDoCurso)
		return { turma: turmaUnicaDoCurso, confianca: 95 };

	const candidatasCompativeis = turmasDoBanco
		.filter((turma) => {
			const codigoBanco = codigoDaTurma(turma.titulo);
			return (
				codigoPlanilha === null ||
				codigoBanco === null ||
				codigoBanco === codigoPlanilha
			);
		})
		.map((turma) => ({
			turma,
			similaridade: similaridadeEntreNomes(
				nomeBase,
				nomeBaseDaTurma(turma.titulo),
			),
		}))
		.sort((a, b) => b.similaridade - a.similaridade);
	const melhor = candidatasCompativeis[0];
	const segunda = candidatasCompativeis[1];
	if (
		melhor &&
		melhor.similaridade >= 0.78 &&
		(!segunda || melhor.similaridade - segunda.similaridade >= 0.08)
	)
		return {
			turma: melhor.turma,
			confianca: Math.round(melhor.similaridade * 100),
		};

	return { turma: null, confianca: 0 };
}
