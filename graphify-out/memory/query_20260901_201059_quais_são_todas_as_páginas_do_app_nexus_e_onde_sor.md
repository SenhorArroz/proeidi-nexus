---
type: "query"
date: "2026-09-01T20:10:59.904901+00:00"
question: "Quais são todas as páginas do app Nexus e onde Sorteio e Professores usam contêineres, grades ou larguras que podem causar overflow horizontal?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/sorteio/page.tsx,src/app/nexus/diretoria/professores/page.tsx,src/app/nexus/diretoria/turmas/page.tsx,src/app/nexus/diretoria/diretores/page.tsx,src/app/nexus/layout.tsx,src/styles/globals.css"]
---

# Q: Quais são todas as páginas do app Nexus e onde Sorteio e Professores usam contêineres, grades ou larguras que podem causar overflow horizontal?

## Answer

A auditoria identificou min-h-screen em páginas internas do painel como causa de altura excessiva: elas somavam uma viewport ao cabeçalho/layout já limitado. Semestres, Turmas (lista e prioritária), Alunos, Professores, Monitores, Sorteio e Diretores agora usam min-h-full com diretoria-page-canvas. A varredura final não encontrou min-h-screen ou w-screen restantes nas páginas Nexus; as larguras mínimas restantes são condicionadas a breakpoints ou pequenas.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/sorteio/page.tsx,src/app/nexus/diretoria/professores/page.tsx,src/app/nexus/diretoria/turmas/page.tsx,src/app/nexus/diretoria/diretores/page.tsx,src/app/nexus/layout.tsx,src/styles/globals.css