---
type: "query"
date: "2026-08-28T16:26:30.950919+00:00"
question: "Authentication failed against database server during credentials login"
contributor: "graphify"
outcome: "useful"
source_nodes: ["auth", "env", "db", "authConfig"]
---

# Q: Authentication failed against database server during credentials login

## Answer

Expanded via graph vocabulary: auth, database, env, nextauth, prisma, url, user. The Auth.js credentials callback calls Prisma through src/server/auth/config.ts and src/server/db.ts. Runtime Prisma uses DATABASE_URL. Local .env is still configured with localhost placeholder credentials, while prisma/schema.prisma also requires missing DIRECT_DATABASE_URL. Replace both with fresh Neon connection strings, restart Next.js, validate Prisma, push schema, and seed.

## Outcome

- Signal: useful

## Source Nodes

- auth
- env
- db
- authConfig