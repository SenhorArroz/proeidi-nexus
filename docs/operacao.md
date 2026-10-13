# Configuração e operação

## Ambiente

Na raiz do projeto, instale as dependências e crie o arquivo local de configuração:

```powershell
Copy-Item .env.example .env
npm install
```

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Conexão PostgreSQL do aplicativo. Obrigatória. |
| `DIRECT_DATABASE_URL` | Conexão direta usada pelo datasource Prisma nas migrações. Obrigatória no schema. |
| `AUTH_SECRET` | Assinatura das sessões NextAuth; obrigatória em produção. |
| `COORDENADOR_NOME`, `COORDENADOR_EMAIL`, `COORDENADOR_MATRICULA` | Identidade da conta criada/atualizada pela seed. |
| `COORDENADOR_SENHA` | Senha da conta inicial; obrigatória para a seed, com mínimo de 10 caracteres. |
| `UPLOADTHING_TOKEN` | Configuração do serviço de upload quando usado. |
| `GMAIL_SMTP_USER`, `GMAIL_SMTP_APP_PASSWORD`, `GMAIL_SMTP_FROM`, `APP_URL` | Envio de e-mails e links de redefinição; a rotina de e-mail exige usuário, senha de app e URL. |

Em PostgreSQL local, `DATABASE_URL` e `DIRECT_DATABASE_URL` podem apontar para a mesma instância. Em banco hospedado com pool de conexões, configure a segunda variável com a URL direta do provedor. Não versione `.env` nem credenciais reais; `.env.example` contém apenas exemplos.

## Primeira execução

```powershell
npm run db:migrate
npm run db:seed
npm run dev
```

`db:migrate` executa `prisma migrate deploy` e aplica migrações pendentes. A seed faz `upsert` da conta do coordenador pelo e-mail, **redefine a senha para `COORDENADOR_SENHA`** e cria os períodos de 2026.1 a 2099.2 que faltarem. Ela ativa 2026.1 somente se nenhum semestre estiver ativo. Rode a seed em um banco compartilhado apenas quando esse efeito for desejado.

O aplicativo abre em `http://localhost:3000`; a área autenticada começa em `/nexus/login`. Para produção, execute `npm run build` e depois `npm run start` no ambiente configurado.

## Migrações

O histórico versionado em `prisma/migrations` contém:

1. `20260101000000_baseline`: estrutura anterior do sistema, necessária para construir um banco novo.
2. `20260908000000_add_limite_alunos`: capacidade padrão de turma.
3. `20261013000000_add_estoque`: itens, categorias e relação entre eles.

Ao mudar `prisma/schema.prisma` em desenvolvimento, crie uma migração com `npx prisma migrate dev --name nome_da_alteracao`. O script `npm run db:generate` também chama `prisma migrate dev`; apesar do nome, ele **não** executa apenas `prisma generate`. Para gerar só o cliente, use `npx prisma generate`. Em deploy, use `npm run db:migrate`.

`npm run db:push` altera o banco sem gerar histórico SQL. Evite combiná-lo com o fluxo de migrations, sobretudo em um banco compartilhado. Confira o SQL antes de aplicar migrações que alterem ou removam dados.

### Banco existente e erro P3005

P3005 significa que o banco não está vazio, mas ainda não possui um histórico de migrações compatível. **Não execute `migrate reset` em um banco com dados.** Primeiro compare o schema do banco com `prisma/schema.prisma`, identifique quais mudanças já existem e só então registre como aplicadas as migrações correspondentes com `prisma migrate resolve --applied <nome>`. No banco Neon usado durante a implementação do estoque, as três migrações acima já foram registradas e `npm run db:migrate` retornou `No pending migrations to apply`. Em outro banco, verifique seu próprio estado antes de usar `resolve`.

Uma comparação somente leitura entre o banco configurado e o schema atual pode ser feita com:

```powershell
npx prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --exit-code
```

Resultado vazio indica que a estrutura atual corresponde ao schema. Ainda é necessário conferir quais migrações representam mudanças já feitas antes de usar `resolve`.

## Verificações

```powershell
npm run typecheck
npm run check
npx prisma validate
npx prisma migrate status
```

O build de produção também funciona como verificação de integração, mas precisa de rede para o `next/font` baixar Geist se ela não estiver em cache. Falhas de conexão com Google Fonts ou com o PostgreSQL hospedado devem ser distinguidas de erros de código.

## Serviços e arquivos gerados

- `generated/prisma` é produzido por `prisma generate` e utilizado pelo código do servidor; `npm install` executa essa geração via `postinstall`.
- `start-database.sh` auxilia a subir PostgreSQL local via Docker ou Podman em WSL/Linux/macOS. Ele lê `.env` e pode modificar a senha de exemplo; revise o script antes de usá-lo.
- `mobile/` tem instalação e execução próprias (`cd mobile`, `npm install`, `npm run start`), mas ainda é um scaffold Expo independente do backend Nexus.
