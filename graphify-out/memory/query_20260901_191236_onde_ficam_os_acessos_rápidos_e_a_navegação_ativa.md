---
type: "query"
date: "2026-09-01T19:12:36.780123+00:00"
question: "Onde ficam os acessos rápidos e a navegação ativa da sidebar, e quais componentes de questionários usam bg-sky-50/60?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/sidebar.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx"]
---

# Q: Onde ficam os acessos rápidos e a navegação ativa da sidebar, e quais componentes de questionários usam bg-sky-50/60?

## Answer

A sidebar está em src/app/_components/sidebar.tsx. O menu rápido de acessibilidade agora tem superfícies escuras no tema dark e a navegação reconhece rotas internas, incluindo o editor de formulários como Questionários. O cabeçalho de respostas individuais em src/app/nexus/diretoria/questionarios/[id]/page.tsx agora usa fundo escuro no tema dark.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/sidebar.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx