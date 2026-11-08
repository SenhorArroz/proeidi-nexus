export type TourRole = "MONITOR" | "PROFESSOR" | "DIRETOR" | "COORDENADOR";

export type TourStep = {
	titulo: string;
	descricao: string;
	alvo?: { seletor?: string; rotulos?: string[]; alternativa?: string };
	previa?: { abrir: string; fechar?: string; aberto?: string };
};

export type TourGuide = {
	chave: string;
	titulo: string;
	passos: TourStep[];
};

const introducao = (titulo: string, descricao: string): TourStep => ({
	titulo,
	descricao,
	alvo: { seletor: "h1" },
});

const acao = (
	titulo: string,
	descricao: string,
	...rotulos: string[]
): TourStep => ({
	titulo,
	descricao,
	alvo: { rotulos },
});

const mostrar = (
	titulo: string,
	descricao: string,
	seletor: string,
	previa?: TourStep["previa"],
): TourStep => ({
	titulo,
	descricao,
	alvo: { seletor, alternativa: previa?.abrir },
	previa,
});

const marcador = (id: string) => `[data-tour="${id}"]`;
const previa = (abrir: string, fechar?: string): TourStep["previa"] => ({
	abrir: marcador(abrir),
	fechar: fechar ? marcador(fechar) : undefined,
});

const editarTurma = previa("turma-editar", "turma-voltar");
const declaracaoProfessor = {
	abrir: 'button[aria-label="Gerar certificado PM"]',
	fechar: marcador("professor-declaracao-fechar"),
};
const certificadosEmLote = previa(
	"certificados-lote",
	"certificados-lote-fechar",
);
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

function guia(chave: string, titulo: string, ...passos: TourStep[]): TourGuide {
	return { chave, titulo, passos };
}

const diretoria: Record<string, TourGuide> = {
	"/nexus/diretoria": guia(
		"diretoria",
		"Painel da Diretoria",
		introducao(
			"Sua área de gestão",
			"Este painel reúne os atalhos e o resumo do semestre para acompanhar a operação do projeto.",
		),
		acao(
			"Acesso rápido",
			"Os cartões de ferramentas abrem as áreas de alunos, turmas, presença, estoque e demais rotinas da diretoria.",
			"Alunos",
			"Turmas",
		),
		{
			titulo: "Resumo do semestre",
			descricao:
				"Os números são calculados com os cadastros do período ativo. Use o menu lateral para ir diretamente a uma área.",
		},
	),
	"/nexus/diretoria/alunos": guia(
		"diretoria/alunos",
		"Alunos",
		mostrar(
			"Trocar de semestre",
			"Abra o seletor Semestre e escolha o período. A lista, os cadastros, a importação e a exportação passam a usar esse semestre.",
			marcador("alunos-semestre"),
		),
		mostrar(
			"Buscar aluno",
			"Digite parte do nome ou do CPF para localizar o cadastro no semestre selecionado.",
			'input[placeholder^="Buscar aluno"]',
		),
		mostrar(
			"Novo aluno",
			"Preencha a ficha, indique a turma quando aplicável e salve o cadastro no semestre selecionado. Use Cancelar para fechar a ficha.",
			".view-diretoria-alunos-modal-cadastro-aluno form",
			previa("alunos-novo", "alunos-cadastro-fechar"),
		),
		mostrar(
			"Continuar em outro semestre",
			"No cartão, use Continuar. Selecione o semestre de destino e pelo menos uma turma. Informe a etapa da trilha, se necessário, e clique em Criar continuidades. A matrícula de origem fica no histórico.",
			".view-diretoria-alunos-modal-continuidade-aluno select",
			previa("aluno-continuar", "alunos-continuar-fechar"),
		),
		mostrar(
			"Ver informações",
			"Abre a ficha completa do aluno, com dados de cadastro, matrículas, turmas e histórico. Use Voltar para retornar à lista.",
			'[title^="Ver todas as informações"]',
		),
		mostrar(
			"Certificado individual",
			"Clique no botão de certificado no cartão para gerar e baixar o PDF desse aluno.",
			'[title^="Gerar certificado PDF"]',
		),
		mostrar(
			"Editar aluno",
			"Abra o lápis no cartão, altere os dados ou vínculos da ficha e use o botão de salvar no fim do formulário.",
			'.view-diretoria-alunos-modal-cadastro-aluno button[type="submit"]',
			previa("aluno-editar", "alunos-cadastro-fechar"),
		),
		mostrar(
			"Remover aluno",
			"Use a lixeira do cartão e confira o cadastro antes de confirmar a remoção do semestre selecionado.",
			'[title="Excluir aluno"]',
		),
		acao(
			"Ações em lote",
			"Marque as caixas dos cartões ou use Selecionar todos. Com alunos selecionados, Vincular altera as turmas e Continuar cria matrículas em outro semestre para o grupo.",
			"Selecionar todos",
			"Limpar seleção",
		),
		mostrar(
			"Certificados em lote",
			"Gera um único PDF com os certificados dos alunos do semestre selecionado.",
			'[title^="Gerar certificados em lote"]',
		),
		mostrar(
			"Importar planilha",
			"Abra Importar, escolha a planilha, confira os campos e vínculos na prévia e confirme a importação no semestre selecionado.",
			marcador("alunos-importar"),
		),
		mostrar(
			"Exportar alunos",
			"Baixa a planilha com os cadastros do semestre selecionado.",
			marcador("alunos-exportar"),
		),
	),
	"/nexus/diretoria/alunos/[id]": guia(
		"diretoria/aluno",
		"Ficha do aluno",
		introducao(
			"Ficha do aluno",
			"Aqui estão os dados cadastrais e os vínculos do aluno ao longo dos semestres.",
		),
		{
			titulo: "Histórico e ações",
			descricao:
				"Consulte matrículas, turmas e dados pessoais. Os botões disponíveis permitem voltar à lista e realizar as ações administrativas mostradas nesta ficha.",
		},
	),
	"/nexus/diretoria/turmas": guia(
		"diretoria/turmas",
		"Turmas",
		mostrar(
			"Selecionar semestre",
			"Escolha o período para ver as turmas vinculadas a ele e definir o semestre padrão de uma nova turma.",
			"#semestre-selecionado",
		),
		acao(
			"Nova turma",
			"Abra Nova turma e preencha os dados na Visão geral. Vincule a equipe e cadastre as aulas nas outras abas antes de salvar.",
			"Nova turma",
		),
		mostrar(
			"Editar turma",
			"Use o lápis no cartão. Em Visão geral, ajuste nome, semestre, limite de alunos, sala, horário e aparência.",
			marcador("turma-visao"),
			editarTurma,
		),
		mostrar(
			"Vincular a equipe",
			"Abra Equipe no editor para selecionar professores e monitores da turma. Os vínculos são gravados ao salvar.",
			marcador("turma-equipe"),
			editarTurma,
		),
		mostrar(
			"Organizar as aulas",
			"Abra Calendário no editor para adicionar, ajustar ou remover aulas. As datas cadastradas aparecem na tela de Presenças.",
			marcador("turma-calendario"),
			editarTurma,
		),
		mostrar(
			"Salvar a turma",
			"Use Salvar alterações para gravar os dados de todas as abas. Use Voltar se quiser sair da edição.",
			marcador("turma-salvar"),
			editarTurma,
		),
		mostrar(
			"Duplicar turma",
			"Use o botão de cópia para criar outra turma no mesmo semestre. Confira o nome e ajuste a nova turma pelo lápis.",
			'[aria-label="Duplicar turma"]',
		),
		acao(
			"Limpar alunos",
			"Remove os vínculos dos alunos com aquela turma após confirmação. Os cadastros dos alunos continuam disponíveis em Alunos.",
			"Limpar alunos",
		),
		mostrar(
			"Excluir turma",
			"Use a lixeira do cartão e confirme a turma selecionada antes de excluir.",
			'[aria-label="Excluir turma"]',
		),
		acao(
			"Controle de turma",
			"Abre a relação de alunos e vagas das turmas do semestre, com opção para baixar PDF.",
			"Controle de turma",
		),
	),
	"/nexus/diretoria/turmas/controle": guia(
		"diretoria/turmas/controle",
		"Controle de turmas",
		introducao(
			"Controle de turmas",
			"Consulte a ocupação das turmas e os alunos em ordem alfabética por semestre.",
		),
		{
			titulo: "Escolha o semestre",
			descricao:
				"O seletor muda o período da lista. Cada cartão apresenta os alunos e as vagas da turma.",
			alvo: { seletor: "select" },
		},
		acao(
			"Baixar PDF",
			"Gera uma versão das listas em A4 para conferência ou impressão.",
			"Baixar PDF para impressão",
		),
	),
	"/nexus/diretoria/professores": guia(
		"diretoria/professores",
		"Professores",
		acao(
			"Novo professor",
			"Abra o cadastro, preencha os dados pessoais e selecione turmas, se houver. Use Salvar no fim do formulário.",
			"Novo professor",
		),
		mostrar(
			"Editar professor",
			"Use o lápis no cartão para ajustar dados ou vínculos com turmas. Confira as alterações e salve.",
			'[aria-label="Editar professor"]',
		),
		mostrar(
			"Abrir a declaração",
			"O botão Gerar certificado PM abre o modal da declaração individual. Confira o nome e a matrícula do professor.",
			".view-nexus-diretoria-professores-modal-declaracao h2",
			declaracaoProfessor,
		),
		mostrar(
			"Selecionar a turma de referência",
			"No modal, escolha a turma. O semestre, as datas e o ano vêm das aulas cadastradas nessa turma.",
			marcador("professor-declaracao-turma"),
			declaracaoProfessor,
		),
		mostrar(
			"Preencher os dados da declaração",
			"Confira a matrícula e os cursos ministrados. Separe vários cursos com “e” e revise carga horária, nome e código do projeto.",
			marcador("professor-declaracao-dados"),
			declaracaoProfessor,
		),
		mostrar(
			"Conferir a prévia",
			"Leia a prévia para conferir os nomes, o período, a carga horária e os cursos antes de gerar o documento.",
			marcador("professor-declaracao-previa"),
			declaracaoProfessor,
		),
		mostrar(
			"Gerar declaração em PDF",
			"Depois de preencher matrícula, curso e turma, clique em Gerar Declaração. Use Cancelar para fechar o modal.",
			marcador("professor-declaracao-gerar"),
			declaracaoProfessor,
		),
		mostrar(
			"Gerar lote",
			"Abra Gerar lote, informe o código do projeto e clique em Gerar certificados. O código informado é usado no PDF com as declarações dos docentes da lista.",
			marcador("certificados-lote-codigo"),
			certificadosEmLote,
		),
		mostrar(
			"Excluir professor",
			"Use a lixeira no cartão e confira o nome da pessoa antes de confirmar a exclusão.",
			'[aria-label="Excluir professor"]',
		),
		mostrar(
			"Redefinir senha",
			"Use o ícone de chave para enviar um código de redefinição ao e-mail da conta.",
			'[aria-label="Enviar código para redefinir senha"]',
		),
	),
	"/nexus/diretoria/monitores": guia(
		"diretoria/monitores",
		"Monitores",
		acao(
			"Novo monitor",
			"Informe os dados do monitor, selecione as turmas em que atua e use Salvar. A edição usa o mesmo formulário.",
			"Novo monitor",
		),
		mostrar(
			"Editar monitor",
			"Use o lápis no cartão para atualizar os dados ou as turmas vinculadas e depois salve.",
			'[aria-label="Editar monitor"]',
		),
		mostrar(
			"Gerar certificado individual",
			"Use Gerar certificado PM no cartão para gerar o PDF do monitor com os dados e vínculos cadastrados.",
			'[aria-label="Gerar certificado PM"]',
		),
		mostrar(
			"Gerar lote",
			"Informe o código do projeto no modal e clique em Gerar certificados para baixar um PDF único dos monitores listados.",
			marcador("certificados-lote-codigo"),
			certificadosEmLote,
		),
		acao(
			"Importar monitores",
			"Escolha a planilha de monitores para carregar os cadastros.",
			"Importar",
		),
		acao(
			"Exportar monitores",
			"Baixa a planilha com os dados dos monitores.",
			"Exportar",
		),
		mostrar(
			"Excluir monitor",
			"Use a lixeira do cartão e confira a conta antes de confirmar a exclusão.",
			'[aria-label="Excluir monitor"]',
		),
		mostrar(
			"Redefinir senha",
			"Use o ícone de chave para enviar um código de redefinição ao e-mail do monitor.",
			'[aria-label="Enviar código para redefinir senha"]',
		),
	),
	"/nexus/diretoria/diretores": guia(
		"diretoria/diretores",
		"Diretores",
		acao(
			"Novo diretor",
			"A coordenação pode preencher nome, matrícula e e-mail para criar a conta de um diretor.",
			"Novo diretor",
		),
		mostrar(
			"Editar diretor",
			"Use o lápis no cartão, ajuste os dados e salve no formulário.",
			'[aria-label="Editar diretor"]',
		),
		mostrar(
			"Redefinir senha",
			"Envia ao diretor um código de redefinição para o e-mail da conta.",
			'[aria-label="Enviar código para redefinir senha"]',
		),
		mostrar(
			"Excluir diretor",
			"A lixeira remove a conta indicada depois da confirmação.",
			'[aria-label="Excluir diretor"]',
		),
	),
	"/nexus/diretoria/presencas": guia(
		"diretoria/presencas",
		"Presenças",
		mostrar(
			"Escolher semestre",
			"Abra o seletor para carregar as turmas do período em que a aula aconteceu.",
			marcador("presenca-semestre"),
		),
		mostrar(
			"Escolher turma",
			"Escolha a turma. As datas da chamada são as aulas cadastradas no calendário dela.",
			marcador("presenca-turma"),
		),
		acao(
			"Chamada dos alunos",
			"Abra Alunos para fazer a chamada dos estudantes vinculados à turma.",
			"Alunos (",
		),
		acao(
			"Chamada dos monitores",
			"Abra Monitores para registrar a presença da monitoria.",
			"Monitores (",
		),
		acao(
			"Chamada dos docentes",
			"Abra Professores e diretores para registrar a presença de quem atua como docente na turma.",
			"Professores e diretores (",
		),
		mostrar(
			"Marcar a presença de uma pessoa",
			"Encontre a pessoa na data da aula. No celular, toque na data para abrir a lista. Escolha Presente para quem compareceu, Ausente para falta sem justificativa ou Justificado para falta justificada. Aulas futuras ficam como A registrar.",
			'select[aria-label^="Presença de "]:enabled',
		),
		acao(
			"Salvar presenças",
			"Clique em Salvar presenças depois de conferir a chamada. O botão fica disponível quando houver mudanças pendentes.",
			"Salvar presenças",
		),
		mostrar(
			"Excluir registro de uma aula",
			"Em Registros desta turma, use a lixeira ao lado da data e confira o dia antes de confirmar a exclusão da chamada.",
			'button[aria-label^="Excluir registro de presença"]',
		),
	),
	"/nexus/diretoria/semestres": guia(
		"diretoria/semestres",
		"Semestres",
		mostrar(
			"Adicionar semestre",
			"Digite um código no formato ano.período, como 2027.1 ou 2027.2, e clique em Adicionar.",
			'input[placeholder="Ex.: 2027.1"]',
		),
		acao(
			"Tornar ativo",
			"No cartão de um semestre inativo, clique em Tornar ativo. Esse período passa a ser a referência nas telas que abrem no semestre ativo.",
			"Tornar ativo",
		),
		mostrar(
			"Duplicar semestre",
			"Clique em Duplicar no cartão de origem. Digite um código novo e confirme no modal. A cópia inclui turmas, materiais, vínculos da equipe e matrículas. O modal lista os dados que ficam no período de origem.",
			marcador("semestre-duplicar-codigo"),
			previa("semestre-duplicar", "semestre-duplicar-cancelar"),
		),
		mostrar(
			"Remover semestre",
			"Use a lixeira no cartão e confirme a exclusão. O botão fica desabilitado para o semestre ativo ou com turmas ou alunos.",
			marcador("semestre-remover"),
		),
	),
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

const compartilhados: Record<string, TourGuide> = {
	"/nexus/dashboard": guia(
		"dashboard",
		"Suas turmas",
		introducao(
			"Bem-vindo ao Nexus",
			"Aqui você vê as turmas permitidas para seu perfil e as próximas aulas.",
		),
		{
			titulo: "Abra uma turma",
			descricao:
				"Clique em um cartão de turma para acessar seus avisos, materiais e calendário. As ações internas dependem do seu perfil.",
			alvo: { seletor: ".nexus-dashboard section" },
		},
		{
			titulo: "Menu lateral",
			descricao:
				"O menu abre as outras áreas permitidas para sua conta, como questionários, diretoria, configurações e acessibilidade.",
			alvo: { seletor: ".nexus-sidebar" },
		},
	),
	"/nexus/configuracoes": guia(
		"configuracoes",
		"Configurações",
		introducao(
			"Sua conta",
			"Confira nome, e-mail, perfil e matrícula associados à sessão.",
		),
		acao(
			"Questionários",
			"Quando disponível, abre a gestão de questionários da sua conta.",
			"Questionários",
		),
		acao("Sair", "Encerra a sessão neste navegador.", "Sair"),
	),
	"/nexus/acessibilidade": guia(
		"acessibilidade",
		"Acessibilidade",
		introducao(
			"Ajuste a leitura",
			"Personalize tema, contraste e tamanho do texto para usar o Nexus com mais conforto.",
		),
		{
			titulo: "Tema, contraste e letras",
			descricao:
				"Os controles alteram a aparência imediatamente; a prévia mostra o resultado. As preferências ficam salvas neste navegador.",
		},
	),
	"/nexus/questionarios": guia(
		"questionarios",
		"Questionários",
		introducao(
			"Gerenciar questionários",
			"Encontre questionários compartilhados ou da diretoria conforme seu perfil e acompanhe respostas.",
		),
		acao(
			"Novo questionário",
			"Abre o editor para criar perguntas e configurar publicação, aparência e modo de resposta.",
			"Novo questionário",
		),
		mostrar(
			"Abrir questionário",
			"Abre o link do formulário para conferir a página que os participantes verão.",
			'[aria-label="Abrir questionário"]',
		),
		mostrar(
			"Gerar QR Code",
			"Abre um QR Code para compartilhar o endereço do formulário.",
			'[aria-label="Gerar QR Code"]',
		),
		mostrar(
			"Ver estatísticas",
			"Abre as métricas e, quando houver identificação, as respostas individuais.",
			'[aria-label="Ver estatísticas"]',
		),
		mostrar(
			"Editar questionário",
			"Abra o lápis para alterar perguntas, configurações ou publicação e salve as mudanças no editor.",
			'[aria-label="Editar questionário"]',
		),
		mostrar(
			"Excluir questionário",
			"Se a sua conta tiver permissão, use a lixeira e confira o título no modal antes de confirmar.",
			'[aria-label="Excluir questionário"]',
		),
	),
	"/nexus/questionarios/editor": guia(
		"questionarios/editor",
		"Editor de questionário",
		introducao(
			"Editor de questionário",
			"Monte perguntas, opções e instruções, depois configure a publicação.",
		),
		acao(
			"Adicionar pergunta",
			"Insere uma nova pergunta no questionário. Escolha o tipo e marque a obrigatoriedade quando necessário.",
			"Adicionar pergunta",
			"Nova pergunta",
		),
		mostrar(
			"Configurações",
			"Abra Configurações para definir cores, visibilidade, modo de resposta e limite por navegador antes de publicar.",
			".view-diretoria-formularios-acoes-formulario button[aria-expanded]",
		),
		mostrar(
			"Duplicar pergunta",
			"Selecione uma pergunta e use o botão de cópia para aproveitar sua estrutura em outra pergunta.",
			'button[title="Duplicar"]',
		),
		mostrar(
			"Excluir pergunta",
			"Selecione uma pergunta e use a lixeira para retirá-la do rascunho. Salve para gravar a alteração.",
			'button[title="Excluir"]',
		),
		acao(
			"Salvar",
			"Em um questionário novo, Publicar questionário cria o formulário e disponibiliza o link público. Ao editar, Salvar alterações grava as mudanças.",
			"Salvar",
			"Publicar",
		),
	),
	"/nexus/questionarios/[id]": guia(
		"questionarios/resultados",
		"Resultados do questionário",
		introducao(
			"Respostas e análise",
			"Acompanhe envios, gráficos e respostas de cada pergunta.",
		),
		acao(
			"Métricas gerais",
			"Veja os gráficos e o resumo das respostas por pergunta.",
			"Métricas gerais",
		),
		acao(
			"Respostas individuais",
			"Em questionários identificados, abra esta aba para consultar os envios de cada pessoa.",
			"Respostas individuais",
		),
	),
};

export function guiaParaRota(
	pathname: string,
	role: TourRole,
): TourGuide | null {
	if (pathname === "/nexus/dashboard") return compartilhados[pathname] ?? null;
	if (/^\/nexus\/dashboard\/turmas\/[^/]+$/.test(pathname)) {
		return guia(
			"dashboard/turma",
			"Turma",
			introducao(
				"Dentro da turma",
				"A página reúne avisos, equipe, próximas aulas e os recursos disponíveis para o seu perfil.",
			),
			{
				titulo: "Abas da turma",
				descricao:
					role === "MONITOR"
						? "Use Início, Materiais e Calendário para acompanhar comunicados, arquivos e datas. Você pode publicar e remover os próprios avisos."
						: "As abas levam a avisos, materiais, calendário, anotações e presença. Selecione uma aba para trabalhar naquela área.",
				alvo: { seletor: ".turma-tema nav" },
			},
			{
				titulo: "Botões de conteúdo",
				descricao:
					role === "MONITOR"
						? "Publicar aviso envia um comunicado; os controles de cada aviso editam ou removem apenas o que seu perfil permite. Materiais e calendário são de consulta."
						: "Os botões de cada seção criam ou editam avisos, materiais, aulas e anotações. Em Presença, altere os estados e use Salvar para gravá-los.",
			},
		);
	}
	if (pathname.startsWith("/nexus/diretoria")) {
		if (role !== "DIRETOR" && role !== "COORDENADOR") return null;
		if (pathname === "/nexus/diretoria/formularios")
			return compartilhados["/nexus/questionarios/editor"] ?? null;
		if (pathname === "/nexus/diretoria/questionarios")
			return compartilhados["/nexus/questionarios"] ?? null;
		if (/^\/nexus\/diretoria\/questionarios\/[^/]+$/.test(pathname))
			return compartilhados["/nexus/questionarios/[id]"] ?? null;
		if (/^\/nexus\/diretoria\/alunos\/[^/]+$/.test(pathname))
			return diretoria["/nexus/diretoria/alunos/[id]"] ?? null;
		return diretoria[pathname] ?? null;
	}
	if (pathname.startsWith("/nexus/questionarios")) {
		if (role === "MONITOR") return null;
		if (
			/^\/nexus\/questionarios\/[^/]+$/.test(pathname) &&
			pathname !== "/nexus/questionarios/editor"
		)
			return compartilhados["/nexus/questionarios/[id]"] ?? null;
		return compartilhados[pathname] ?? null;
	}
	return compartilhados[pathname] ?? null;
}
