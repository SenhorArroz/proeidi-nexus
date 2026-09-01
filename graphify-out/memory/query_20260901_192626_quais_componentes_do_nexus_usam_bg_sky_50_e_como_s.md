---
type: "query"
date: "2026-09-01T19:26:26.835605+00:00"
question: "Quais componentes do Nexus usam bg-sky-50 e como seus fundos se comportam com html[data-theme=dark]?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/styles/globals.css,src/app/nexus/diretoria/formularios/page.tsx,src/app/_components/diretoria/presence-grid.tsx,src/app/_components/diretoria/data-skeleton.tsx"]
---

# Q: Quais componentes do Nexus usam bg-sky-50 e como seus fundos se comportam com html[data-theme=dark]?

## Answer

A varredura encontrou bg-sky-50 puro e variantes opacas. As superfícies puras já eram cobertas pelas regras de tema escuro. globals.css agora cobre globalmente qualquer classe contendo bg-sky-50/, incluindo /50, /60, /65 e /70, além do alto contraste. Isso inclui o painel de configurações do editor de questionários.

## Outcome

- Signal: useful

## Source Nodes

- src/styles/globals.css,src/app/nexus/diretoria/formularios/page.tsx,src/app/_components/diretoria/presence-grid.tsx,src/app/_components/diretoria/data-skeleton.tsx