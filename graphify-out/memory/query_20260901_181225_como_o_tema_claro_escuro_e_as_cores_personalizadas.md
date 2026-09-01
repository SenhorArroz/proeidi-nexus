---
type: "query"
date: "2026-09-01T18:12:25.776580+00:00"
question: "Como o tema claro/escuro e as cores personalizadas de turma são aplicados na tela da Diretoria, e quais classes na janela de gestão podem estar forçando superfícies escuras?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/turmas/page.tsx,src/styles/globals.css"]
---

# Q: Como o tema claro/escuro e as cores personalizadas de turma são aplicados na tela da Diretoria, e quais classes na janela de gestão podem estar forçando superfícies escuras?

## Answer

A aplicação aplica o tema persistido por html[data-theme] no CSS global. A janela de gestão tinha variantes Tailwind dark: que reagiam à preferência do sistema, independentemente dessa escolha. Elas foram removidas; a tela agora usa as superfícies globais que respondem ao tema salvo e injeta a cor de destaque da turma pelo escopo turma-tema.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/turmas/page.tsx,src/styles/globals.css