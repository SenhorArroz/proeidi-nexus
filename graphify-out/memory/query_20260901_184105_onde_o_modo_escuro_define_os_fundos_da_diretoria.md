---
type: "query"
date: "2026-09-01T18:41:05.360817+00:00"
question: "Onde o modo escuro define os fundos da Diretoria, dashboard e outras telas Nexus, e como aplicar o mesmo canvas escuro da Diretoria sem escurecer cards?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/styles/globals.css,src/app/nexus/dashboard/page.tsx,src/app/_components/diretoria-workspace.tsx"]
---

# Q: Onde o modo escuro define os fundos da Diretoria, dashboard e outras telas Nexus, e como aplicar o mesmo canvas escuro da Diretoria sem escurecer cards?

## Answer

O canvas escuro mais profundo da Diretoria é #0b1220, enquanto superfícies elevadas usam #162033. O CSS global agora aplica #0b1220 aos fundos de página bg-gray-50 e bg-slate-50 no modo escuro, preserva #162033 para bg-white e adiciona o mesmo canvas ao dashboard com seus brilhos.

## Outcome

- Signal: useful

## Source Nodes

- src/styles/globals.css,src/app/nexus/dashboard/page.tsx,src/app/_components/diretoria-workspace.tsx