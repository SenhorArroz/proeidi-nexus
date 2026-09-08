export interface AlunoControle {
	id: string;
	nome: string;
	dataNascimento: Date;
	telefone: string | null;
	contatoEmergencia: string | null;
}

export interface TurmaControle {
	id: string;
	titulo: string;
	sala: string | null;
	horario: string | null;
	limiteAlunos: number;
	cor: string;
	corDestaque: string;
	corFundo: string;
	corTexto: string;
	corTitulo: string;
	corDescricao: string;
	fonte: string;
	professores: { user: { nome: string } }[];
	alunos: { aluno: AlunoControle }[];
}

export function ordenarAlunos(turma: TurmaControle) {
	return turma.alunos
		.map(({ aluno }) => aluno)
		.sort(
			(a, b) =>
				a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }) ||
				a.id.localeCompare(b.id),
		);
}

/**
 * Keeps regular classes paired, but reserves both columns for a class that
 * needs a continuation. This prevents a continuation from pushing the class
 * in the right column onto a later sheet.
 */
export function folhasControle(turmas: TurmaControle[]) {
	const folhas: {
		turma: TurmaControle;
		alunos: AlunoControle[];
		inicio: number;
		parte: number;
		partes: number;
	}[][] = [];
	const criarPartes = (turma: TurmaControle) => {
		const partes = Math.max(1, Math.ceil(turma.alunos.length / 16));
		return Array.from({ length: partes }, (_, indice) => ({
			turma,
			alunos: ordenarAlunos(turma).slice(indice * 16, (indice + 1) * 16),
			inicio: indice * 16,
			parte: indice + 1,
			partes,
		}));
	};

	for (let indice = 0; indice < turmas.length; ) {
		const turma = turmas[indice];
		if (!turma) break;
		const partesDaTurma = criarPartes(turma);
		if (partesDaTurma.length > 1) {
			for (let parte = 0; parte < partesDaTurma.length; parte += 2)
				folhas.push(partesDaTurma.slice(parte, parte + 2));
			indice += 1;
			continue;
		}

		const proximaTurma = turmas[indice + 1];
		const partesDaProxima = proximaTurma ? criarPartes(proximaTurma) : [];
		const primeiraParte = partesDaTurma[0];
		const primeiraParteDaProxima = partesDaProxima[0];
		if (
			primeiraParte &&
			primeiraParteDaProxima &&
			partesDaProxima.length === 1
		) {
			folhas.push([primeiraParte, primeiraParteDaProxima]);
			indice += 2;
		} else {
			folhas.push(partesDaTurma);
			indice += 1;
		}
	}
	return folhas;
}
