import { acao, guia, marcador, mostrar, previa, type TourGuide } from "./guias";

const acaoConecta = (
	aba: string,
	titulo: string,
	descricao: string,
	seletor: string,
) => {
	const aberto = marcador(`conecta-form-${aba}`);
	return mostrar(titulo, descricao, `${aberto} + div ${seletor}`, {
		abrir: marcador(`conecta-${aba}`),
		aberto,
	});
};

export const diretoriaOperacional: Record<string, TourGuide> = {
	"/nexus/diretoria/sorteio": guia(
		"diretoria/sorteio",
		"Sorteio",
		mostrar(
			"Escolher semestre",
			"Use o seletor para carregar as inscrições do período.",
			"select",
		),
		acao(
			"Filtrar pelo curso",
			"Alterne entre Smartphone e Computador para localizar os candidatos da modalidade.",
			"Smartphone",
		),
		acao(
			"Cadastrar candidato",
			"Use Adicionar Ficha, preencha os dados, marque o curso e salve a inscrição.",
			"Adicionar ficha",
		),
		mostrar(
			"Editar candidato",
			"Use o lápis na ficha para corrigir dados da inscrição ou o curso escolhido e salve.",
			'button[title="Editar"]',
		),
		mostrar(
			"Remover candidato",
			"Use a lixeira da ficha para remover a inscrição selecionada após confirmação.",
			'button[title="Excluir"]',
		),
		acao(
			"Importar inscrições",
			"Escolha a planilha de candidatos para o semestre selecionado.",
			"Importar",
		),
		acao(
			"Exportar inscrições",
			"Baixa a planilha de inscrições do semestre selecionado.",
			"Exportar",
		),
		acao(
			"Abrir sorteador",
			"Abra o sorteador para escolher entre sortear candidatos inscritos e sortear números.",
			"Sorteador",
			"Iniciar sorteio",
		),
	),
	"/nexus/diretoria/sorteio/sorteador": guia(
		"diretoria/sorteio/sorteador",
		"Sorteador",
		mostrar(
			"Selecionar semestre",
			"No sorteio vinculado, o semestre determina quais inscrições entram na seleção.",
			"select",
		),
		mostrar(
			"Sorteio vinculado",
			"Escolha Vinculado para sortear entre candidatos cadastrados. Selecione Smartphone ou Computador e confira a quantidade de inscrições elegíveis. O resultado exibe o número e, quando houver candidato associado, o nome.",
			marcador("sorteador-vinculado-dados"),
			previa("sorteador-vinculado"),
		),
		mostrar(
			"Sorteio simples",
			"Escolha Simples para sortear números em um intervalo, independente das fichas. Preencha os limites inicial e final.",
			"#range-inicial",
			previa("sorteador-simples"),
		),
		mostrar(
			"Excluir números do sorteio",
			"Abra a lista de exclusões e digite números ou intervalos separados por vírgula. Use, por exemplo, 3, 8-12. Esses números ficam fora do sorteio.",
			marcador("sorteador-exclusoes"),
		),
		acao(
			"Executar sorteio",
			"Confira o modo e os filtros antes de clicar. O resultado aparece no painel e é incluído no histórico da modalidade.",
			"Executar sorteio",
		),
		acao(
			"Exportar planilha",
			"Baixa os resultados registrados no histórico.",
			"Exportar planilha",
		),
		mostrar(
			"Limpar o histórico",
			"A lixeira do sorteador pede confirmação para zerar os resultados desta sessão.",
			'[aria-label="Resetar banco de dados"]',
		),
	),
	"/nexus/diretoria/impressao": guia(
		"diretoria/impressao",
		"Impressão de apostilas",
		mostrar(
			"Escolher semestre",
			"A lista de aulas e apostilas acompanha o semestre selecionado.",
			".view-diretoria-impressao-acoes-impressao select",
		),
		mostrar(
			"Buscar apostila",
			"Pesquise pelo título da apostila, pelo curso ou pelo responsável.",
			'.view-diretoria-impressao-acoes-impressao input[type="search"]',
		),
		acao(
			"Nova apostila",
			"Abra o cadastro e informe o número e a data da aula, o curso, o título, a meta de cópias, o prazo e os responsáveis. Salve para incluir a apostila na aula indicada.",
			"Nova apostila",
		),
		mostrar(
			"Aula realizada",
			"Marque a caixa depois que a aula acontecer. A alteração é registrada para aquela aula.",
			marcador("impressao-aula-realizada"),
		),
		mostrar(
			"Marcar como pronta",
			"Use Pronta quando o conteúdo da apostila estiver preparado para imprimir.",
			'[aria-label^="Pronta:"]',
		),
		mostrar(
			"Marcar como impressa",
			"Use Impressa quando concluir a impressão. Confira a quantidade impressa e a meta na linha da apostila.",
			'[aria-label^="Impressa:"]',
		),
		mostrar(
			"Editar apostila",
			"Use o lápis da linha para ajustar aula, curso, prazo, responsáveis ou quantidades. Salve no editor.",
			'.view-diretoria-impressao-lista-semanas-impressao button[aria-label^="Editar "]',
		),
		mostrar(
			"Remover apostila",
			"Use a lixeira da linha e confirme a remoção da apostila indicada.",
			'.view-diretoria-impressao-lista-semanas-impressao button[aria-label^="Remover "]',
		),
		acao(
			"Baixar modelo",
			"Baixa a estrutura da planilha para preencher os dados de impressão.",
			"Baixar modelo",
		),
		acao(
			"Importar planilha",
			"Escolha a planilha preenchida para carregar as apostilas no semestre selecionado.",
			"Importar planilha",
		),
	),
	"/nexus/diretoria/materiais-atualizacao": guia(
		"diretoria/materiais-atualizacao",
		"Atualização de materiais",
		mostrar(
			"Escolher semestre",
			"Use o seletor para acompanhar os materiais do período selecionado.",
			"select",
		),
		acao(
			"Novo material",
			"Abra o editor e preencha curso, título, prazo e responsáveis. Salve para incluir o material no acompanhamento.",
			"Novo material",
		),
		mostrar(
			"Editar material",
			"Use o lápis para corrigir dados e responsáveis. No editor, marque Revisado após a conferência, Precisa de ajuste se encontrou pendências e Ajustado quando concluir as correções. Depois, salve.",
			'button[aria-label^="Editar "]',
		),
		mostrar(
			"Remover material",
			"Use Remover no cartão e confirme o título do material que será excluído.",
			'button[aria-label^="Remover "]',
		),
		acao(
			"Baixar modelo",
			"Baixa a planilha com as colunas esperadas para importar materiais.",
			"Modelo",
		),
		acao(
			"Importar materiais",
			"Escolha a planilha preenchida para importar os registros no semestre selecionado.",
			"Importar",
		),
	),
	"/nexus/diretoria/estoque": guia(
		"diretoria/estoque",
		"Estoque",
		mostrar(
			"Cadastrar item",
			"Abra Novo item, informe nome, quantidade, validade e as categorias correspondentes. Use Salvar para cadastrar.",
			"#titulo-form-estoque",
			previa("estoque-novo", "estoque-cancelar"),
		),
		mostrar(
			"Filtrar itens",
			"Combine a busca por nome, a data exata de validade e a categoria. Use Limpar filtros para voltar à lista completa.",
			'[aria-labelledby="titulo-filtros-estoque"]',
		),
		acao(
			"Criar categoria",
			"Digite o nome da categoria e clique em Criar categoria. Se o cadastro de item estiver aberto, a categoria recém-criada será selecionada nele.",
			"Criar categoria",
		),
		mostrar(
			"Editar item",
			"Use o lápis no cartão para corrigir quantidade, validade ou outros dados. Salve no formulário.",
			"#titulo-form-estoque",
			{
				abrir: 'button[aria-label^="Editar "]',
				fechar: marcador("estoque-cancelar"),
			},
		),
		mostrar(
			"Excluir item",
			"Use a lixeira do cartão e confira o nome do item antes de confirmar a exclusão.",
			'button[aria-label^="Excluir "]',
		),
	),
	"/nexus/diretoria/conecta": guia(
		"diretoria/conecta",
		"Conecta View",
		mostrar(
			"Escolher semestre",
			"O Conecta View abre no semestre ativo. Troque de período para gerenciar as equipes, doações e provas daquele semestre.",
			"select",
		),
		mostrar(
			"Ler o ranking",
			"Cada equipe recebe a soma dos pontos de gincana e dos pontos brutos das doações divididos pela quantidade de alunos da turma. Turmas sem alunos recebem os pontos da gincana.",
			"#classificacao",
			previa("conecta-ranking"),
		),
		mostrar(
			"Cadastrar equipes",
			"Selecione uma turma do semestre, informe nome, tema e cores e use Criar equipe.",
			`${marcador("conecta-form-equipes")} button[type=submit]`,
			previa("conecta-equipes"),
		),
		acaoConecta(
			"equipes",
			"Editar equipe",
			"Use o lápis para alterar nome, tema ou cores. A turma só pode ser trocada enquanto a equipe não tiver doações nem provas registradas.",
			'button[aria-label^="Editar "]',
		),
		acaoConecta(
			"equipes",
			"Excluir equipe",
			"Use a lixeira. Se houver lançamentos vinculados, remova-os antes de excluir a equipe.",
			'button[aria-label^="Excluir "]',
		),
		mostrar(
			"Cadastrar itens e pontos por unidade",
			"Informe o nome do item, os pontos por unidade e se ele está disponível para novas doações. O catálogo vale para todos os semestres.",
			`${marcador("conecta-form-itens")} button[type=submit]`,
			previa("conecta-itens"),
		),
		acaoConecta(
			"itens",
			"Editar item do catálogo",
			"Use o lápis para alterar os dados, a disponibilidade e os pontos por unidade das próximas doações.",
			'button[aria-label^="Editar "]',
		),
		acaoConecta(
			"itens",
			"Remover item do catálogo",
			"Use a lixeira. Se o item já foi usado, ele fica inativo no catálogo e continua no histórico.",
			'button[aria-label^="Remover "]',
		),
		mostrar(
			"Registrar doação",
			"Informe doador e equipe, preencha a quantidade dos itens recebidos e clique em Registrar doação.",
			`${marcador("conecta-form-doacoes")} button[type=submit]`,
			previa("conecta-doacoes"),
		),
		acaoConecta(
			"doacoes",
			"Editar doação",
			"Use o lápis para corrigir o lançamento. O valor por unidade registrado é preservado para os itens mantidos na doação.",
			'button[aria-label^="Editar "]',
		),
		acaoConecta(
			"doacoes",
			"Excluir doação",
			"Use a lixeira do registro e confirme. Os pontos da doação saem do ranking da equipe.",
			'button[aria-label^="Excluir "]',
		),
		mostrar(
			"Lançar provas e apresentações",
			"Informe a atividade, a equipe e os pontos. Use Lançar pontos para incluir o resultado no ranking.",
			`${marcador("conecta-form-provas")} button[type=submit]`,
			previa("conecta-provas"),
		),
		acaoConecta(
			"provas",
			"Editar prova",
			"Use o lápis para corrigir a atividade, a equipe ou os pontos atribuídos e salve.",
			'button[aria-label^="Editar "]',
		),
		acaoConecta(
			"provas",
			"Excluir prova",
			"Use a lixeira e confirme para retirar o resultado da classificação.",
			'button[aria-label^="Excluir "]',
		),
	),
};
