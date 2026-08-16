# ProEIDI Nexus

Sistema de operação pedagógica e administrativa do Projeto de Extensão de Inclusão Digital para Pessoas Idosas (ProEIDI). O Nexus concentra a gestão por semestres e turmas, pessoas vinculadas, presenças, materiais, comunicados, certificados, inscrições de sorteio e questionários.

Sua interface usa a identidade do projeto: `sky-500` como campo de trabalho e `ember/amber-600` como marca de ação. O objetivo não é uma dashboard genérica: é uma área de trabalho para a rotina da diretoria e das turmas.

## O que o sistema organiza

```mermaid
flowchart TD
  S[Semestre] --> T[Turmas]
  T --> A[Alunos]
  T --> P[Professores e diretores docentes]
  T --> M[Monitores]
  T --> C[Calendário e aulas]
  T --> R[Presenças]
  T --> X[Materiais, avisos e anotações]
  S --> Z[Inscrições e sorteio]
  R --> Q[Carga horária e certificados]
```

O semestre é o contexto de trabalho. Alunos, turmas e candidatos de sorteio pertencem a um semestre; uma turma pertence a exatamente um semestre. Pessoas da equipe são usuários do sistema e podem ser vinculadas a várias turmas.

## Perfis e limites de acesso

| Perfil | Pode acessar | Limites principais |
| --- | --- | --- |
| **Coordenador** | Todo o sistema, Diretoria e gerenciamento de diretores | É o único perfil que cria, edita e remove diretores. |
| **Diretor** | Diretoria completa e turmas em que atua como docente | Não gerencia contas de outros diretores. Diretores podem ser vinculados como professores em turmas. Veja também a limitação de autorização de rota de turma abaixo. |
| **Professor** | Apenas suas turmas e os recursos internos delas | Não acessa a Diretoria nem turmas sem vínculo. Pode registrar presença, gerenciar materiais, avisos, calendário e anotações da própria turma. |
| **Monitor** | Apenas as turmas em que está vinculado | A interface é focada em posts, calendário e materiais. Não pode registrar presença, criar/remover anotações ou fixar avisos. Um aviso criado por monitor só pode ser removido pelo próprio autor. |
| **Aluno** | Não possui conta de login | É um cadastro administrativo, associado a semestre e turmas. |
| **Respondente de questionário** | Link público de questionário publicado | Não precisa de login e só acessa o formulário público; não acessa a área administrativa nem as estatísticas. |

As regras não existem só na interface: as procedures protegidas verificam a sessão, e os controllers conferem o cargo e o vínculo da turma antes de ler ou alterar dados.

## Áreas e funções

### Dashboard de turmas

A página inicial mostra somente as turmas autorizadas para o usuário conectado:

- Coordenador: todas as turmas.
- Diretor e professor: turmas em que constam como docentes.
- Monitor: turmas em que consta como monitor.

Ao entrar em uma turma, o sistema carrega seus dados reais e apresenta avisos, materiais, calendário, anotações e presença conforme o perfil. Há skeletons nas consultas para sinalizar carregamento sem confundir ausência de dados com falha.

### Diretoria

A Diretoria é restrita a diretor e coordenador. Ela reúne:

- **Semestres:** cria períodos, define o período ativo e mostra totais de turmas, alunos, docentes e monitores vinculados às turmas do período.
- **Turmas:** cria, edita, duplica e exclui turmas; define semestre, local, horário, docentes, monitores, alunos, materiais e aulas. Ao trocar o semestre, os vínculos são revalidados para evitar misturar pessoas de períodos diferentes. A duplicação cria `nome-da-turma-copia` no mesmo semestre e replica estrutura, equipe, materiais e calendário; não replica alunos nem presenças.
- **Alunos:** CRUD completo, importação e exportação por semestre, associação a turmas do mesmo período e emissão de certificados individuais ou em lote. CPF é normalizado para 11 dígitos; telefone e CPF podem ser formatados na interface. E-mail é opcional.
- **Professores e monitores:** CRUD de usuários, vínculo visível com turmas e certificados individuais ou em lote (um PDF por lote). A senha inicial gerada para esses perfis é a matrícula.
- **Diretores:** CRUD exclusivo do coordenador. Diretores também podem atuar como docentes e, nesse caso, aparecem na lista de professores, em presenças e em certificados de docentes.
- **Presenças:** registra alunos, monitores, professores e diretores docentes por data de aula. Estados: `PRESENTE`, `AUSENTE`, `JUSTIFICADO` e `A REGISTRAR` na interface. Datas futuras permanecem como “A registrar”; somente registros salvos entram nos cálculos de carga horária e certificados.
- **Sorteio:** cadastra fichas de candidatos por semestre, separadas por curso de Smartphone ou Computador. O sorteador usa apenas as fichas disponíveis no semestre selecionado e pode exportar o resultado em CSV.
- **Questionários:** cria, edita, publica e remove formulários; acompanha respostas, gráficos e resumos por pergunta. Perguntas podem ser curtas, longas, de escolha única ou múltipla e podem ter respostas corretas configuradas para análise.

### Turmas

Dentro de uma turma, os recursos são:

- **Avisos/posts:** comunicados vinculados à turma; professores/diretores podem fixar avisos. Monitores podem publicar e remover somente os próprios avisos.
- **Materiais:** links, PDFs, slides e imagens vinculados à turma.
- **Calendário:** aulas, feriados, cancelamentos e atividades especiais. Atualmente, somente eventos do tipo **Aula** são datas elegíveis para presença.
- **Anotações:** notas privadas por autor; monitores não acessam esse recurso.
- **Presença:** disponível para professor, diretor e coordenador; grava uma lista de presença por turma e data.

## Questionários públicos

Questionários publicados recebem um `slug` único. O acesso público usa esse identificador, sem exigir login.

- A estrutura do questionário é armazenada em JSON (`conteudo`), preservando ordem, tipo, opções, obrigatoriedade e resposta correta quando existir.
- Cada envio é salvo em JSON (`respostas`), como um mapa entre o identificador da pergunta e a resposta enviada.
- O envio público rejeita formulários não publicados e verifica perguntas obrigatórias.
- Estatísticas e respostas detalhadas ficam restritas à Diretoria.

## Segurança e integridade dos dados

- **Autenticação:** NextAuth com credenciais; a senha nunca é retornada nas consultas. Senhas são armazenadas com hash.
- **Autorização:** `protectedProcedure` exige sessão. `directorProcedure` aceita apenas diretor/coordenador; `coordinatorProcedure` aceita somente coordenador. Para professor e monitor, operações da turma conferem o vínculo no servidor.
- **Seleções do banco:** os controllers selecionam apenas campos necessários e validam IDs recebidos. Ao cadastrar ou atualizar uma turma, professor deve ter papel de professor ou diretor, monitor deve ter papel de monitor e aluno deve pertencer ao semestre da turma.
- **Dados de alunos:** CPF é guardado sem máscara e validado com 11 dígitos; associações a turma são conferidas no mesmo semestre. O e-mail pode ser nulo.
- **Presença:** existe apenas um registro por turma e data, e cada pessoa só aparece uma vez dentro daquele registro.
- **Formulários:** links públicos só expõem formulários publicados; respostas e analytics não são públicos.

## Limitações atuais

- A resposta correta dos questionários serve à análise/visualização administrativa; o envio público não bloqueia nem corrige automaticamente a resposta do participante.
- A importação de alunos depende de uma planilha cujas colunas possam ser mapeadas para os campos do cadastro e para uma turma existente no semestre escolhido.
- Certificados e carga horária dependem de turmas, aulas e presenças efetivamente registradas; informações ausentes no cadastro não são inventadas pelo sistema.
- O link público de questionário não autentica o respondente. Portanto, não há garantia nativa de uma única resposta por pessoa.
- O endpoint de detalhe de turma hoje trata diretor como perfil com acesso a qualquer turma, embora o dashboard liste apenas as turmas em que ele está vinculado. Isso deve ser ajustado caso a regra desejada seja limitar diretores somente às próprias turmas.
- Monitores têm acesso de servidor a materiais e calendário das turmas vinculadas, inclusive às mutations de criação e remoção de materiais. A interface é mais restritiva; se a política exigir autoria para remoção de material, essa regra ainda precisa ser adicionada ao controller.
- O banco configurado é PostgreSQL. A URL de produção deve usar o formato aceito pelo provedor/Prisma configurado no ambiente.

## Arquitetura

| Camada | Responsabilidade |
| --- | --- |
| `src/app` | Rotas e telas Next.js; páginas de Diretoria, dashboard, turma, configurações e formulários públicos. |
| `src/app/_components` | Componentes reutilizáveis de interface, incluindo navegação, cards, tabelas, campos e skeletons. |
| `src/server/api/routers` | Controllers tRPC: validação Zod, autorização por cargo, seleção segura de dados e operações de banco. |
| `src/server/auth` | Configuração de autenticação e utilitários de senha. |
| `prisma/schema.prisma` | Modelo relacional PostgreSQL: usuários, semestres, turmas, pessoas, presença, sorteio e formulários. |
| `prisma/seed.mjs` | Criação da conta inicial de coordenador a partir do ambiente. |

## Executando localmente

### Pré-requisitos

- Node.js compatível com o projeto e npm.
- PostgreSQL acessível.

### Configuração

```bash
npm install
copy .env.example .env
```

Preencha pelo menos estas variáveis em `.env`:

```env
AUTH_SECRET="gere-um-segredo-seguro"
DATABASE_URL="postgresql://usuario:senha@localhost:5432/proeidi_nexus"
COORDENADOR_NOME="Coordenador ProEIDI"
COORDENADOR_EMAIL="coordenador@proeidi.local"
COORDENADOR_MATRICULA="COORDENADOR-001"
COORDENADOR_SENHA="uma-senha-forte"
```

Depois, gere/aplique o banco e crie a conta inicial:

```bash
npm run db:generate
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`. Em Windows, use `Copy-Item .env.example .env` se o comando `copy` não estiver disponível.

## Scripts úteis

| Comando | Função |
| --- | --- |
| `npm run dev` | Inicia o Next.js em desenvolvimento com Turbopack. |
| `npm run build` | Gera a build de produção. |
| `npm run start` | Inicia a build de produção. |
| `npm run typecheck` | Executa TypeScript sem emitir arquivos. |
| `npm run check` | Executa as verificações do Biome. |
| `npm run db:generate` | Cria/aplica migração de desenvolvimento do Prisma. |
| `npm run db:migrate` | Aplica migrações em ambiente de deploy. |
| `npm run db:push` | Sincroniza o schema com o banco sem criar migração. Use com cuidado. |
| `npm run db:seed` | Cria/atualiza o coordenador definido no ambiente. |
| `npm run db:studio` | Abre o Prisma Studio. |

## Tecnologias

Next.js 15, React 19, TypeScript, Tailwind CSS, tRPC, NextAuth, Prisma, PostgreSQL, Zod, PDF-Lib e SheetJS (`xlsx`).
