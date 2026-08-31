---
type: "query"
date: "2026-08-31T15:15:17.481990+00:00"
question: "Como a presença da turma é persistida e como as cores personalizadas e o modo escuro são aplicados na página interna de turma?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts,src/styles/globals.css"]
---

# Q: Como a presença da turma é persistida e como as cores personalizadas e o modo escuro são aplicados na página interna de turma?

## Answer

A presença é persistida por turma.presencas.salvar em uma transação com upsert de RegistroPresenca e substituição das presenças vinculadas. A interface usa cores semânticas para os estados e a cor configurada da turma para superfícies, métricas, ícones e ações principais. O feedback de sucesso foi convertido em modal somente após confirmação da mutation e erros aparecem no próprio painel.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts,src/styles/globals.css