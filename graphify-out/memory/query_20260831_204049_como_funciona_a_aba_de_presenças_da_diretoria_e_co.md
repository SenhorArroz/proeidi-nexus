---
type: "query"
date: "2026-08-31T20:40:49.260911+00:00"
question: "Como funciona a aba de presenças da Diretoria e como ela se relaciona com o registro de presença de uma turma?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/presencas/page.tsx,src/app/_components/diretoria/presence-grid.tsx,src/server/api/routers/diretoria.ts,src/app/nexus/dashboard/turmas/[id]/page.tsx"]
---

# Q: Como funciona a aba de presenças da Diretoria e como ela se relaciona com o registro de presença de uma turma?

## Answer

A Diretoria gerencia os mesmos RegistroPresenca por turma, com edição em matriz para várias datas e grupos. A grade foi atualizada para receber as cores da turma: presente usa cor principal, ausente usa destaque e justificado usa fundo, além de exibir métricas por grupo.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/presencas/page.tsx,src/app/_components/diretoria/presence-grid.tsx,src/server/api/routers/diretoria.ts,src/app/nexus/dashboard/turmas/[id]/page.tsx