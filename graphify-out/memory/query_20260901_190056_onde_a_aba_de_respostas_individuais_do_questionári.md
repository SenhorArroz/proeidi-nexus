---
type: "query"
date: "2026-09-01T19:00:56.450402+00:00"
question: "Onde a aba de respostas individuais do questionário é renderizada e quais campos permitem filtrar respostas por nome?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/questionarios/[id]/page.tsx,src/server/api/routers/formulario.ts"]
---

# Q: Onde a aba de respostas individuais do questionário é renderizada e quais campos permitem filtrar respostas por nome?

## Answer

A aba fica em src/app/nexus/diretoria/questionarios/[id]/page.tsx. Ela usa data.formulario.respostas e agora filtra nomeRespondente com um campo de busca acima da lista, ignorando diferenças de maiúsculas e acentos.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/questionarios/[id]/page.tsx,src/server/api/routers/formulario.ts