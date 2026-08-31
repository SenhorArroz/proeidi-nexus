---
type: "query"
date: "2026-08-31T20:26:47.178597+00:00"
question: "Onde ainda há botões com text-white dentro da página interna de turmas e como recebem cor de fundo personalizada?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css"]
---

# Q: Onde ainda há botões com text-white dentro da página interna de turmas e como recebem cor de fundo personalizada?

## Answer

Botões com fundo sky/blue são sobrescritos pelo tema de turma, e ações de presença/modal usam estilos inline. A navegação flutuante também foi ajustada para usar a cor de ação e a cor de texto calculadas, garantindo contraste após voltar ao tema claro.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css