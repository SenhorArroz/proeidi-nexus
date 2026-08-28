---
type: "query"
date: "2026-08-28T19:44:51.694894+00:00"
question: "ajuste a responsividade para se adequar a telas e a não passar delas"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SorteadorOrganico()", "sorteador/page.tsx", "DiretoriaLayout()"]
---

# Q: ajuste a responsividade para se adequar a telas e a não passar delas

## Answer

Expanded via graph vocab: sorteador, sorteio, organico, layout, page. SorteadorOrganico foi adaptado para uma coluna em larguras estreitas e duas colunas somente a partir de lg; containers receberam min-width zero, largura máxima e clipping horizontal; inputs e botões têm alvos móveis de 44px; textos e históricos agora quebram ou truncam dentro do card.

## Outcome

- Signal: useful

## Source Nodes

- SorteadorOrganico()
- sorteador/page.tsx
- DiretoriaLayout()