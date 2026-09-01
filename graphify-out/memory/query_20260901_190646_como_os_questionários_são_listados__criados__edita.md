---
type: "query"
date: "2026-09-01T19:06:46.652706+00:00"
question: "Como os questionários são listados, criados, editados ou excluídos na diretoria e quais rotas tRPC atendem essa área?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/questionarios/page.tsx,src/app/nexus/diretoria/formularios/page.tsx,src/server/api/routers/formulario.ts"]
---

# Q: Como os questionários são listados, criados, editados ou excluídos na diretoria e quais rotas tRPC atendem essa área?

## Answer

A listagem em src/app/nexus/diretoria/questionarios/page.tsx agora busca por título e oferece editar/excluir. A edição abre o editor em /nexus/diretoria/formularios?id=<id>, que carrega stats e persiste com formulario.update. A exclusão usa formulario.remove após confirmação, removendo respostas em cascata.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/questionarios/page.tsx,src/app/nexus/diretoria/formularios/page.tsx,src/server/api/routers/formulario.ts