---
type: "implementation"
date: "2026-09-28T23:49:31.663023+00:00"
question: "Como manter a grade de presença compacta e responsiva em dispositivos móveis sem seletor direto de dia?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["PresenceGrid()", "presence-grid.tsx", "matriz-presenca-view.tsx", "viewport"]
---

# Q: Como manter a grade de presença compacta e responsiva em dispositivos móveis sem seletor direto de dia?

## Answer

No PresenceGrid, a visualização abaixo de lg usa blocos nativos details/summary por data. O dia passado mais recente começa aberto, os demais ficam recolhidos, cada bloco mantém os selects individuais de presença e datas futuras ficam identificadas e desabilitadas. Em lg ou maior, permanece a matriz em tabela. O botão Salvar alterações fica no cabeçalho e só habilita quando há rascunhos.

## Outcome

- Signal: useful

## Source Nodes

- PresenceGrid()
- presence-grid.tsx
- matriz-presenca-view.tsx
- viewport