# ProEIDI Nexus

Sistema web do Projeto de Extensão de Inclusão Digital para Pessoas Idosas (ProEIDI). Reúne a operação das turmas e da diretoria: pessoas, semestres, aulas, presença, materiais, certificados, questionários, sorteio e estoque.

## Comece por aqui

**Requisitos:** Node.js, npm e um banco PostgreSQL acessível. Os comandos abaixo são executados na raiz do repositório.

```powershell
Copy-Item .env.example .env
npm install
```

Preencha `.env` com `DATABASE_URL`, `DIRECT_DATABASE_URL` e `AUTH_SECRET`. Para criar a conta inicial, defina também `COORDENADOR_SENHA` com pelo menos 10 caracteres. Em um PostgreSQL local sem pool de conexões, as duas URLs do banco podem ser iguais. Em um serviço com pool, use a URL direta para `DIRECT_DATABASE_URL`.

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

Abra `http://localhost:3000` para o site público ou `http://localhost:3000/nexus/login` para entrar no sistema. A seed cria ou atualiza o coordenador informado no ambiente e cadastra os semestres de 2026.1 a 2099.2, ativando 2026.1 se nenhum estiver ativo. **A seed atualiza a senha do coordenador a cada execução.**

Para outros sistemas operacionais, copie `.env.example` para `.env` com o comando equivalente. Veja [configuração e operação](docs/operacao.md) antes de apontar as variáveis para um banco já existente.

## O que existe hoje

| Área | Recursos principais |
| --- | --- |
| Site público | Página inicial do projeto e questionários publicados por link. |
| Dashboard | Turmas visíveis para a pessoa conectada e recursos internos de avisos, materiais, calendário, anotações e presença conforme o perfil. |
| Diretoria | Gestão de semestres, turmas, alunos, professores, monitores, presenças, sorteio, questionários, impressão de apostilas e atualização de materiais. |
| Estoque | Cadastro e edição de itens com nome, quantidade, validade e uma ou mais categorias; filtros por categoria, nome e data; total de unidades no banner. |
| Coordenação | Além das áreas da diretoria, gestão de contas de diretores. |
| Conta e acessibilidade | Login, alteração ou redefinição de senha, tema claro/escuro, contraste e tamanho de fonte. |

Os perfis do sistema são **coordenador, diretor, professor e monitor**. Alunos são registros administrativos, sem login. A diretoria e o estoque exigem perfil de diretor ou coordenador; o cadastro de diretores é exclusivo da coordenação. A API também valida permissões, além dos controles de navegação.

Detalhes e limites de cada área estão em [funcionalidades](docs/funcionalidades.md). O mapa de camadas, rotas e dados está em [arquitetura](docs/arquitetura.md).

## Estrutura do repositório

| Caminho | Conteúdo |
| --- | --- |
| `src/app` | Rotas Next.js, páginas, componentes de cada tela e handlers HTTP. |
| `src/app/_components` | Componentes compartilhados, navegação e preferências de acessibilidade. |
| `src/server/api/routers` | Procedures tRPC, validação, autorização e acesso aos dados. |
| `src/server/auth` | Autenticação por credenciais e utilitários de senha. |
| `prisma/schema.prisma` | Modelos PostgreSQL. |
| `prisma/migrations` | Histórico SQL de migrações, incluindo a base e o estoque. |
| `prisma/seed.mjs` | Provisionamento do coordenador e dos semestres. |
| `docs` | Documentação funcional, técnica e operacional. |
| `mobile` | Projeto Expo inicial, ainda sem integração com o Nexus web. |

## Comandos

| Comando | Resultado |
| --- | --- |
| `npm run dev` | Inicia o Next.js em desenvolvimento com Turbopack. |
| `npm run build` | Compila a aplicação para produção. |
| `npm run start` | Serve a build de produção. |
| `npm run typecheck` | Verifica os tipos TypeScript. |
| `npm run check` | Executa as verificações do Biome. |
| `npm run db:migrate` | Aplica migrações pendentes com `prisma migrate deploy`. |
| `npm run db:generate` | Executa `prisma migrate dev` para criar/aplicar migrações em desenvolvimento; o nome do script é legado. |
| `npm run db:seed` | Cria/atualiza o coordenador e os semestres. |
| `npm run db:studio` | Abre o Prisma Studio. |
| `npm run db:push` | Sincroniza o schema sem histórico de migração; evite nos ambientes que usam `migrate`. |

O `postinstall` gera o cliente Prisma automaticamente. Após alterações no schema, execute `npx prisma generate` se precisar regenerá-lo sem criar uma migração.

## Tecnologias

Next.js 15, React 19, TypeScript, Tailwind CSS 4, tRPC 11, NextAuth 5, Prisma 6, PostgreSQL, Zod, PDF-Lib e SheetJS. O diretório `mobile/` usa Expo 57 e React Native, como projeto separado.

## Documentação

- [Funcionalidades, perfis e limites](docs/funcionalidades.md)
- [Arquitetura, rotas e modelo de dados](docs/arquitetura.md)
- [Ambiente, migrações e operação](docs/operacao.md)
- [Histórico da refatoração das views](docs/refatoracao-views.md)

## Autoria

Luiz Guimarães — @luizrob_bah
