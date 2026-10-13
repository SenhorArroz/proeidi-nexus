# Funcionalidades e regras de acesso

Este documento descreve o que está implementado no aplicativo web em `src/app` e nas procedures de `src/server/api/routers`. O código e o schema Prisma são a referência para detalhes de validação.

## Perfis

| Perfil | Escopo principal |
| --- | --- |
| Coordenador | Acesso à diretoria, às turmas e ao cadastro de diretores. |
| Diretor | Acesso à diretoria e aos recursos docentes. Não administra contas de diretores. |
| Professor | Turmas em que está vinculado e seus recursos internos. Pode gerenciar questionários compartilhados conforme as regras de autoria. |
| Monitor | Turmas em que está vinculado, com ações limitadas em avisos, calendário e materiais. Não gerencia questionários. |

Alunos não têm conta de acesso: são cadastros administrativos vinculados a um semestre e, opcionalmente, a turmas do mesmo período. Respondentes usam apenas o link público de questionário publicado.

O layout de `/nexus/diretoria` exige sessão e perfil `DIRETOR` ou `COORDENADOR`. A rota de diretores exige `COORDENADOR` adicionalmente. Nas mutations e queries, `protectedProcedure`, `directorProcedure`, `coordinatorProcedure` e verificações de vínculo reforçam essas regras no servidor. O router de questionários usa uma regra própria que também admite professores.

## Site e área pessoal

- `/`: página pública do projeto, com seções institucionais, notícias, participação e contato.
- `/nexus/login`: entrada por e-mail e senha.
- `/nexus/dashboard`: lista de turmas visíveis para a sessão. A seleção considera perfil e vínculos.
- `/nexus/dashboard/turmas/[id]`: conteúdo da turma, com avisos, materiais, calendário, anotações e presença de acordo com o perfil.
- `/nexus/configuracoes`, `/nexus/acessibilidade` e `/nexus/redefinir-senha`: conta, preferências visuais e fluxo de redefinição.

### Recursos das turmas

| Recurso | Comportamento |
| --- | --- |
| Avisos | Publicação na turma. Monitores podem publicar e remover apenas os próprios avisos; fixação fica restrita aos perfis autorizados. |
| Materiais | Links, PDFs, slides e imagens. A API impede que monitores criem ou removam materiais. |
| Calendário | Aulas, feriados, cancelamentos e atividades especiais. Apenas datas cadastradas como aula são elegíveis para presença. |
| Anotações | Registros privados por autor; monitores não têm acesso às ações de anotações. |
| Presença | Registros por turma e data de aula, para alunos e equipe, conforme as permissões do perfil. |

## Diretoria

| Área | O que oferece |
| --- | --- |
| Painel | Acesso rápido às áreas de trabalho e resumo do semestre. |
| Semestres | Cadastro, ativação e duplicação de períodos. |
| Turmas | Cadastro e edição de turma, semestre, capacidade, equipe, alunos, aulas e materiais; duplicação e controle. |
| Alunos | Cadastro, edição, importação, exportação, vínculos com turmas, histórico e certificados. |
| Professores, monitores e diretores | Gestão de contas e vínculos. O gerenciamento de diretores é exclusivo da coordenação. |
| Presenças | Consulta e lançamento de presença de alunos, monitores e docentes. |
| Sorteio | Cadastro de candidatos por semestre e curso; seleção e exportação de resultados. |
| Questionários | Listagem, edição, publicação, link/QR, respostas e análises. O editor também aparece sob `/nexus/diretoria/formularios`. |
| Impressão de apostilas | Controle por semestre e semana, responsáveis, quantidades, andamento e importação de planilhas. |
| Atualização de materiais | Revisão por semestre, responsáveis, prazos, estados e importação de planilhas. |
| Estoque | Itens com nome, quantidade inteira não negativa, validade e uma ou mais categorias. |

### Estoque

A tela `/nexus/diretoria/estoque` mostra a **soma de `qtd` de todos os itens** no banner. Cada card organiza o nome no topo, a quantidade em destaque no centro e a validade na parte inferior. Há busca por nome e filtros de data exata de validade e categoria; os filtros podem ser combinados. Categorias são criadas na própria tela e podem ser associadas a vários itens. O formulário de item exige ao menos uma categoria. O acesso à página e ao router tRPC `estoque` é restrito à diretoria.

O estoque é geral: o modelo atual não o vincula a semestre, turma, pessoa ou local. A quantidade representa unidades cadastradas, sem movimentações de entrada/saída ou histórico de alterações de saldo. A data de validade é persistida como `DATE` no PostgreSQL.

## Questionários

Questionários publicados ficam disponíveis em `/questionarios/[slug]` sem login. Perguntas podem ser de texto curto, parágrafo, escolha única ou múltipla; obrigatoriedade e resposta correta podem ser configuradas. Estrutura e envios são armazenados em JSON. A gestão usa as rotas de `/nexus/questionarios` e da diretoria: professores podem gerir questionários compartilhados dentro das regras de autoria; questionários com visibilidade `DIRETORIA` exigem diretor ou coordenador. Monitores não gerenciam questionários.

O formulário aceita modo anônimo ou identificação por cookie e pode limitar respostas por navegador. Isso não equivale à identificação civil de uma pessoa. O envio público não corrige automaticamente respostas incorretas; a pontuação e as análises são recursos administrativos.

## Acessibilidade

A interface oferece tema claro e escuro, contraste padrão ou alto e opção de fonte ampliada. As preferências e controles ficam em `/nexus/acessibilidade` e nos componentes compartilhados do Nexus.

## Limites conhecidos

- A importação de alunos, apostilas e materiais exige planilhas compatíveis com os campos e modelos oferecidos nas respectivas telas.
- Certificados e carga horária dependem de aulas e presenças registradas; dados faltantes não são preenchidos automaticamente.
- O link público de questionário, por si só, não garante uma resposta única por pessoa.
- O endpoint de detalhe de turma admite diretores em qualquer turma, enquanto o dashboard lista seus vínculos docentes. Essa diferença de escopo deve ser considerada ao revisar permissões.
- O diretório `mobile/` ainda contém a estrutura inicial do Expo, sem autenticação ou consumo da API do Nexus.
