---
type: "query"
date: "2026-09-01T18:34:13.198986+00:00"
question: "Quais layouts abrangem o dashboard, a Diretoria e seus CRUDs, e qual é o ponto mais seguro para adicionar brilhos decorativos globais sem interferir no conteúdo?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/diretoria-workspace.tsx,src/app/nexus/dashboard/page.tsx,src/app/nexus/diretoria/layout.tsx"]
---

# Q: Quais layouts abrangem o dashboard, a Diretoria e seus CRUDs, e qual é o ponto mais seguro para adicionar brilhos decorativos globais sem interferir no conteúdo?

## Answer

O dashboard possui sua própria página raiz em src/app/nexus/dashboard/page.tsx, enquanto todos os CRUDs da Diretoria são envolvidos por DiretoriaWorkspace. Foram adicionados brilhos não interativos no topo direito (sky) e no rodapé esquerdo (amber) no workspace e no dashboard; o conteúdo foi mantido em camada superior.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/diretoria-workspace.tsx,src/app/nexus/dashboard/page.tsx,src/app/nexus/diretoria/layout.tsx