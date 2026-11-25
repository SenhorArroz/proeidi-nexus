import {
	acao,
	guia,
	introducao,
	marcador,
	mostrar,
	previa,
	type TourGuide,
} from "./guias";

const editarTurma = previa("turma-editar", "turma-voltar");
const certificadosEmLote = previa(
	"certificados-lote",
	"certificados-lote-fechar",
);

export const diretoriaAcademica: Record<string, TourGuide> = {
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
			"Gerar declaração em PDF",
			"Use Gerar certificado PM no cartão para baixar a declaração individual com as turmas e presenças registradas do docente.",
			'[aria-label="Gerar certificado PM"]',
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
};
