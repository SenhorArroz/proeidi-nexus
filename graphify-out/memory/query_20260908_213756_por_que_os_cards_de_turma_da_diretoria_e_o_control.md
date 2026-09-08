---
type: "query"
date: "2026-09-08T21:37:56.022439+00:00"
question: "Por que os cards de turma da Diretoria e o Controle de Turma não carregam em produção, enquanto a Dashboard carrega?"
contributor: "graphify"
outcome: "corrected"
correction: "Todo campo novo selecionado por rotas de produção deve ter migration Prisma versionada, não apenas um SQL avulso."
source_nodes: ["turmaRouter", "diretoriaRouter", "diretoria.ts", "turma.ts"]
---

# Q: Por que os cards de turma da Diretoria e o Controle de Turma não carregam em produção, enquanto a Dashboard carrega?

## Answer

Expandido com o vocabulário [dashboard, diretoria, controle, turmas]. As telas que falham compartilham diretoria.turmas.list, que seleciona limiteAlunos; a Dashboard usa turma.minhas e não seleciona essa coluna. limiteAlunos existia somente como SQL avulso, portanto não era aplicado por prisma migrate deploy. Foi criada uma migration oficial aditiva.

## Outcome

- Signal: corrected
- Correction: Todo campo novo selecionado por rotas de produção deve ter migration Prisma versionada, não apenas um SQL avulso.

## Source Nodes

- turmaRouter
- diretoriaRouter
- diretoria.ts
- turma.ts