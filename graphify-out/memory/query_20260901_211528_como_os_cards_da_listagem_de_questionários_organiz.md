---
type: "query"
date: "2026-09-01T21:15:28.862796+00:00"
question: "Como os cards da listagem de questionários organizam hoje as ações de abrir, QR Code, estatísticas, edição e exclusão?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/questionarios/page.tsx"]
---

# Q: Como os cards da listagem de questionários organizam hoje as ações de abrir, QR Code, estatísticas, edição e exclusão?

## Answer

Os cards em src/app/nexus/diretoria/questionarios/page.tsx agora separam ações em compartilhamento e gerenciamento. Abrir e QR Code ficam num grupo compacto; estatísticas e exclusão são botões de ícone com título e rótulo acessível; Editar é a única ação primária destacada. A composição empilha bem em telas menores.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/questionarios/page.tsx