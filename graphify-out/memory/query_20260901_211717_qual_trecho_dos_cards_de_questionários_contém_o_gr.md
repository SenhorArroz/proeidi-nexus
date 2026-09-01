---
type: "query"
date: "2026-09-01T21:17:17.181789+00:00"
question: "Qual trecho dos cards de questionários contém o grupo atual de ações para padronizá-lo em uma única fileira de ícones?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/questionarios/page.tsx"]
---

# Q: Qual trecho dos cards de questionários contém o grupo atual de ações para padronizá-lo em uma única fileira de ícones?

## Answer

A área de ações no rodapé de cada card em src/app/nexus/diretoria/questionarios/page.tsx agora usa uma única fileira de botões quadrados de 44px. Abrir, QR Code, estatísticas, editar e excluir usam apenas ícones, com aria-label e title; Editar mantém destaque azul para indicar a ação principal.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/questionarios/page.tsx