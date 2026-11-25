import * as XLSX from "xlsx";
import type { Aluno } from "./suporte";

export function exportarAlunos(
	alunosFiltrados: Aluno[],
	semestreFiltro: string,
) {
	if (alunosFiltrados.length === 0) {
		alert("Nenhum aluno encontrado para exportar neste semestre.");
		return;
	}

	// Ordem dos campos conforme pedidos no formulário, com cabeçalhos legíveis
	const colunasOrdenadas: {
		chave: Exclude<keyof Aluno, "turmasVinculadas">;
		cabecalho: string;
	}[] = [
		// Turma e Semestre
		{ chave: "semestre", cabecalho: "Semestre Letivo" },
		{ chave: "turma", cabecalho: "Turma" },
		// Dados Gerais
		{ chave: "nome", cabecalho: "Nome - completo e sem abreviações" },
		{ chave: "dataNascimento", cabecalho: "Data de nascimento" },
		{ chave: "cpf", cabecalho: "CPF" },
		{ chave: "corRaca", cabecalho: "Qual é sua cor ou raça?" },
		{
			chave: "identidadeGenero",
			cabecalho: "Qual sua identidade de gênero?",
		},
		{
			chave: "lgbtqiapn",
			cabecalho: "Você se identifica como uma pessoa LGBTQIAPN+?",
		},
		{ chave: "telefone", cabecalho: "Telefone" },
		{ chave: "contatoEmergencia", cabecalho: "Contato de emergência" },
		{ chave: "email", cabecalho: "E-mail" },
		{
			chave: "cuidaTerceiros",
			cabecalho: "Responsável pelo cuidado de terceiros?",
		},
		// Ocupação e Escolaridade
		{ chave: "escolaridade", cabecalho: "Escolaridade" },
		{ chave: "trabalha", cabecalho: "Você trabalha atualmente?" },
		{
			chave: "trabalhoLocal",
			cabecalho: "Se sim na questão anterior: onde trabalha e qual a função?",
		},
		{ chave: "estuda", cabecalho: "Você estuda atualmente?" },
		{
			chave: "estudoLocal",
			cabecalho: "Se sim na questão anterior: onde estuda e qual o curso?",
		},
		// Saúde
		{ chave: "problemaSaude", cabecalho: "Possui algum problema de saúde" },
		{ chave: "problemaSaudeQual", cabecalho: "Qual?" },
		{
			chave: "necessidadeEspecial",
			cabecalho: "Você tem alguma necessidade especial?",
		},
		{
			chave: "necessidadeEspecialQual",
			cabecalho: "Qual é a sua necessidade especial?",
		},
		// Infraestrutura
		{ chave: "acessoInternet", cabecalho: "Você tem acesso à internet?" },
		{ chave: "temComputador", cabecalho: "Você tem computador ou notebook?" },
		{ chave: "temSmartphone", cabecalho: "Você tem smartphone?" },
		{
			chave: "sistemaSmartphone",
			cabecalho: "Informe o sistema operacional do seu smartphone",
		},
	];

	// Montar array de objetos com cabeçalhos legíveis na ordem correta
	const dadosFormatados = alunosFiltrados.map((aluno) => {
		const linha: Record<string, string> = {};
		colunasOrdenadas.forEach(({ chave, cabecalho }) => {
			linha[cabecalho] = aluno[chave] ?? "";
		});
		return linha;
	});

	// Criar planilha com os cabeçalhos na ordem definida
	const cabecalhos = colunasOrdenadas.map((c) => c.cabecalho);
	const worksheet = XLSX.utils.json_to_sheet(dadosFormatados, {
		header: cabecalhos,
	});
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Alunos");

	XLSX.writeFile(workbook, `Alunos_${semestreFiltro}.xlsx`);
}
