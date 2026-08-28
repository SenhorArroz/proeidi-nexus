---
type: "query"
date: "2026-08-28T22:26:55.898690+00:00"
question: "Auditar a responsividade do sorteador em 1366x768 e sua relação com layout, workspace e sidebar"
contributor: "graphify"
outcome: "useful"
source_nodes: ["SorteadorOrganico()", "DiretoriaWorkspace()", "Sidebar()", "nexus/layout.tsx"]
---

# Q: Auditar a responsividade do sorteador em 1366x768 e sua relação com layout, workspace e sidebar

## Answer

Expansão pelo vocabulário do grafo: sorteador, sorteio, layout, diretoria, workspace, sidebar, grid, page. O breakpoint lg do grid usa a viewport e ignora a sidebar de 256px, deixando as duas colunas estreitas em notebooks e ainda pior com escala de fonte. A pilha vertical do card de configuração ultrapassa o orçamento de 768px, enquanto os históricos usam overflow-y-auto sem uma altura realmente limitada; recomenda-se container query, composição desktop 2:1 com corpo de ação em duas áreas, min-h-0 na cadeia de scroll e tipografia mínima de 12px.

## Outcome

- Signal: useful

## Source Nodes

- SorteadorOrganico()
- DiretoriaWorkspace()
- Sidebar()
- nexus/layout.tsx