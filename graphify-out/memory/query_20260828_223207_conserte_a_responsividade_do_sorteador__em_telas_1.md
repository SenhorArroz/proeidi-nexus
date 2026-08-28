---
type: "query"
date: "2026-08-28T22:32:07.905898+00:00"
question: "conserte a responsividade do sorteador, em telas 1920x1080 ele está normal, mas em telas 1366x768 ele fiqca pequeno e passa da tela"
contributor: "graphify"
outcome: "useful"
source_nodes: ["sorteador/page.tsx", "diretoria/layout.tsx", "diretoria-workspace.tsx", "SorteadorOrganico()"]
---

# Q: conserte a responsividade do sorteador, em telas 1920x1080 ele está normal, mas em telas 1366x768 ele fiqca pequeno e passa da tela

## Answer

Expanded from original query via graph vocab: [sorteador, sorteio, page, layout, grid, width, random, candidato, diretoria, semestre, exportar]. O sorteador usava breakpoint do viewport apesar da sidebar reduzir a largura útil, tipografia baseada em vw e alturas sem limite efetivo. Foi corrigido com container query baseada na largura real, layout compacto para viewport com até 820px de altura, tipografia mínima legível, histórico com rolagem limitada, remoção do espaçamento duplicado do link voltar e min-h-0 na raiz. Build, typecheck, lint do componente e detector visual passaram.

## Outcome

- Signal: useful

## Source Nodes

- sorteador/page.tsx
- diretoria/layout.tsx
- diretoria-workspace.tsx
- SorteadorOrganico()