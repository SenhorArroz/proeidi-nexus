---
type: "query"
date: "2026-08-31T15:32:46.093375+00:00"
question: "Quais botões da página interna de turma usam a cor de destaque personalizada como fundo ou texto?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css"]
---

# Q: Quais botões da página interna de turma usam a cor de destaque personalizada como fundo ou texto?

## Answer

Os botões principais e de confirmação, além das ações mapeadas de sky/blue, usam --turma-destaque. A cor de ação agora é calculada separadamente da cor de texto sobre a ação, evitando botões brancos ou texto ilegível no tema escuro.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css