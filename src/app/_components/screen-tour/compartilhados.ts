import { acao, guia, introducao, mostrar, type TourGuide } from "./guias";

export const compartilhados: Record<string, TourGuide> = {
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
