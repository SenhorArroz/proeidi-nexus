---
type: "query"
date: "2026-09-01T19:16:25.686596+00:00"
question: "Como as preferências de acessibilidade aplicam tema claro ou escuro e onde existem superfícies bg-sky-50 na área Nexus?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/accessibility-preferences.tsx,src/styles/globals.css,src/app/_components/sidebar.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx"]
---

# Q: Como as preferências de acessibilidade aplicam tema claro ou escuro e onde existem superfícies bg-sky-50 na área Nexus?

## Answer

As preferências persistem em localStorage e aplicam html[data-theme]. globals.css agora redefine a variante dark do Tailwind para esse atributo, eliminando a dependência do tema do sistema. Os dois cabeçalhos bg-sky-50/60 de respostas individuais e o menu rápido da sidebar usam superfícies escuras apenas quando data-theme é dark.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/accessibility-preferences.tsx,src/styles/globals.css,src/app/_components/sidebar.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx