---
type: "query"
date: "2026-08-31T20:29:25.663429+00:00"
question: "Quais áreas internas de turma usam turma-semantic-text e turma-semantic-description em cards claros?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css"]
---

# Q: Quais áreas internas de turma usam turma-semantic-text e turma-semantic-description em cards claros?

## Answer

Posts, calendário, materiais, notas e presença usam as classes semânticas dentro de cards claros no tema claro e superfícies escuras no dark. As variáveis de texto agora são calculadas contra a superfície dos cards, corrigindo letras brancas no tema claro.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css