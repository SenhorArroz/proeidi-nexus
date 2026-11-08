export type TourRole = "MONITOR" | "PROFESSOR" | "DIRETOR" | "COORDENADOR";

export type TourStep = {
	titulo: string;
	descricao: string;
	alvo?: { seletor?: string; rotulos?: string[] };
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
		introducao(
			"Gerenciar alunos",
			"Cadastre alunos, consulte suas fichas e gere certificados no contexto de um semestre.",
		),
		{
			titulo: "Semestre de trabalho",
			descricao:
				"A seleção do semestre determina a lista, os novos cadastros, a importação e a exportação.",
			alvo: { seletor: "select" },
		},
		acao(
			"Novo aluno",
			"Abre o cadastro completo de um aluno. A ficha pode depois ser editada pela lista.",
			"Novo Aluno",
			"Novo aluno",
		),
		acao(
			"Importar e exportar",
			"Importar lê uma planilha de alunos; Exportar baixa os registros do semestre selecionado.",
			"Importar",
			"Exportar",
		),
		{
			titulo: "Ações da lista",
			descricao:
				"Nos registros você pode ver detalhes, editar, excluir, vincular turmas e emitir certificados conforme os dados disponíveis.",
		},
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
		introducao(
			"Gerenciar turmas",
			"Crie e organize turmas, equipe, alunos, aulas e materiais de cada semestre.",
		),
		{
			titulo: "Selecione o semestre",
			descricao:
				"A lista de turmas e o cadastro trabalham no semestre selecionado.",
			alvo: { seletor: "#semestre-selecionado" },
		},
		acao(
			"Nova turma",
			"Abre o formulário para definir dados, professores, monitores, alunos, materiais e aulas.",
			"Nova turma",
		),
		acao(
			"Controle de turma",
			"Leva ao acompanhamento consolidado das turmas do semestre.",
			"Controle de turma",
		),
		{
			titulo: "Ações em cada turma",
			descricao:
				"Cada cartão oferece edição, duplicação, limpeza de alunos e exclusão. Confira o cartão antes de confirmar ações que removem dados.",
		},
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
		introducao(
			"Gerenciar professores",
			"Cadastre docentes, acompanhe vínculos com turmas e emita declarações.",
		),
		acao(
			"Novo professor",
			"Abre o formulário de cadastro. Os cartões permitem editar dados e consultar vínculos.",
			"Novo professor",
			"Adicionar professor",
		),
		{
			titulo: "Ações dos cartões",
			descricao:
				"Os botões de cada pessoa permitem editar, remover, solicitar redefinição de senha e gerar declarações quando disponíveis.",
		},
		{
			titulo: "Operações em lote",
			descricao:
				"Importação, exportação e geração em lote atuam sobre os registros apresentados pela página.",
		},
	),
	"/nexus/diretoria/monitores": guia(
		"diretoria/monitores",
		"Monitores",
		introducao(
			"Gerenciar monitores",
			"Cadastre monitores, consulte turmas vinculadas e emita declarações.",
		),
		acao(
			"Novo monitor",
			"Abre o cadastro de uma pessoa com perfil de monitor.",
			"Novo monitor",
			"Adicionar monitor",
		),
		{
			titulo: "Ações dos cartões",
			descricao:
				"Em cada cartão você pode editar, remover, solicitar redefinição de senha ou gerar declaração, conforme o botão escolhido.",
		},
		{
			titulo: "Importação e lotes",
			descricao:
				"Os controles acima da lista permitem importar, exportar e gerar documentos para vários monitores.",
		},
	),
	"/nexus/diretoria/diretores": guia(
		"diretoria/diretores",
		"Diretores",
		introducao(
			"Gerenciar diretores",
			"Somente a coordenação pode cadastrar, editar ou remover contas de diretores.",
		),
		{
			titulo: "Cadastro e cartões",
			descricao:
				"Use o botão de novo diretor para cadastrar. Na lista, os botões de cada cartão editam ou removem a conta correspondente.",
		},
	),
	"/nexus/diretoria/presencas": guia(
		"diretoria/presencas",
		"Presenças",
		introducao(
			"Gerenciar presenças",
			"Registre e consulte presença de alunos, monitores, professores e diretores docentes.",
		),
		{
			titulo: "Semestre e turma",
			descricao:
				"Escolha primeiro o semestre e a turma. As datas disponíveis vêm das aulas cadastradas.",
			alvo: { seletor: "select" },
		},
		acao(
			"Grupos de pessoas",
			"Alunos, Monitores e Professores alternam a grade do grupo selecionado.",
			"Alunos (",
			"Monitores (",
			"Professores e diretores (",
		),
		acao(
			"Salvar presenças",
			"Grava as alterações de estado feitas na grade. O botão só fica ativo quando há mudanças.",
			"Salvar presenças",
		),
	),
	"/nexus/diretoria/semestres": guia(
		"diretoria/semestres",
		"Semestres",
		introducao(
			"Gerenciar semestres",
			"Cadastre períodos letivos e defina qual está ativo.",
		),
		acao(
			"Adicionar semestre",
			"Digite um código como 2027.1 e use Adicionar para criar o período.",
			"Adicionar",
		),
		{
			titulo: "Ações de cada período",
			descricao:
				"A lista permite ativar, duplicar e remover semestres. A duplicação pede um novo código e mostra o que será copiado.",
		},
	),
	"/nexus/diretoria/sorteio": guia(
		"diretoria/sorteio",
		"Sorteio",
		introducao(
			"Candidatos do sorteio",
			"Organize fichas de candidatos por semestre e pelo curso escolhido.",
		),
		{
			titulo: "Filtros e fichas",
			descricao:
				"Selecione semestre e curso para localizar candidatos. As fichas oferecem ações de cadastro, edição e remoção.",
		},
		acao(
			"Abrir sorteador",
			"Leva à execução do sorteio com os candidatos elegíveis do contexto selecionado.",
			"Sorteador",
			"Iniciar sorteio",
		),
	),
	"/nexus/diretoria/sorteio/sorteador": guia(
		"diretoria/sorteio/sorteador",
		"Sorteador",
		introducao(
			"Executar o sorteio",
			"Esta tela seleciona candidatos das fichas disponíveis no semestre e curso escolhidos.",
		),
		{
			titulo: "Seleção e resultado",
			descricao:
				"Confira os filtros e a quantidade antes de acionar o sorteio. O histórico registra os resultados exibidos nesta tela.",
		},
		acao(
			"Exportar planilha",
			"Baixa o resultado para conferência fora do sistema.",
			"Exportar Planilha",
		),
	),
	"/nexus/diretoria/impressao": guia(
		"diretoria/impressao",
		"Impressão de apostilas",
		introducao(
			"Controle de impressão",
			"Organize apostilas por semestre, semana e aula, com responsáveis, quantidades e andamento.",
		),
		{
			titulo: "Busca e período",
			descricao:
				"Use os filtros para encontrar uma apostila, curso ou responsável e escolher o semestre.",
		},
		{
			titulo: "Ações das semanas",
			descricao:
				"Os botões de cada semana ou apostila permitem criar, editar, remover e atualizar estados de preparação e impressão.",
		},
		{
			titulo: "Planilhas",
			descricao:
				"Importar lê a planilha no formato esperado; baixar modelo fornece a estrutura usada pela importação.",
		},
	),
	"/nexus/diretoria/materiais-atualizacao": guia(
		"diretoria/materiais-atualizacao",
		"Atualização de materiais",
		introducao(
			"Revisão de materiais",
			"Acompanhe a revisão dos materiais de cada curso e semestre.",
		),
		{
			titulo: "Responsáveis e estados",
			descricao:
				"Cada registro mostra responsáveis, prazo e os estados Revisado, Precisa de ajuste e Ajustado.",
		},
		{
			titulo: "Cadastro e planilhas",
			descricao:
				"Os botões permitem criar, editar, remover e importar materiais; o modelo de planilha orienta a importação.",
		},
	),
	"/nexus/diretoria/estoque": guia(
		"diretoria/estoque",
		"Estoque",
		introducao(
			"Estoque",
			"O banner soma as unidades cadastradas. Cada cartão mostra nome, quantidade e validade do item.",
		),
		acao(
			"Novo item",
			"Abre o formulário de nome, quantidade, validade e uma ou mais categorias.",
			"Novo item",
		),
		{
			titulo: "Encontrar itens",
			descricao:
				"Combine pesquisa por nome, data exata de validade e categoria; Limpar filtros volta à lista completa.",
			alvo: { seletor: "#titulo-filtros-estoque" },
		},
		{
			titulo: "Criar categoria",
			descricao:
				"Digite uma categoria e use Criar categoria. Ao criá-la com o formulário aberto, ela será selecionada para o item.",
			alvo: { seletor: "#titulo-categorias-estoque" },
		},
		{
			titulo: "Editar ou excluir",
			descricao:
				"Os ícones em cada cartão alteram ou excluem o item; a exclusão pede confirmação.",
		},
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
		{
			titulo: "Ações da lista",
			descricao:
				"Busque pelo nome. Nos cartões, os botões permitem editar, abrir resultados, compartilhar o link/QR ou remover quando você tem permissão.",
		},
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
		{
			titulo: "Configurações",
			descricao:
				"Defina cores, visibilidade, modo de resposta e limites por navegador antes de publicar.",
		},
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
		{
			titulo: "Navegação dos resultados",
			descricao:
				"Use as abas e filtros da página para alternar entre resumo, perguntas e respostas individuais.",
		},
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
