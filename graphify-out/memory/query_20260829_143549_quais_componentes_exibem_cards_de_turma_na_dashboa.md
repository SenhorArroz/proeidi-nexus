---
type: "query"
date: "2026-08-29T14:35:49.194257+00:00"
question: "Quais componentes exibem cards de turma na dashboard e na diretoria?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Dashboard(),Turma,diretoria.ts"]
---

# Q: Quais componentes exibem cards de turma na dashboard e na diretoria?

## Answer

Os cards de turma são exibidos diretamente em src/app/nexus/dashboard/page.tsx e src/app/nexus/diretoria/turmas/page.tsx; ambos consomem dados provenientes dos roteadores turma e diretoria.

## Outcome

- Signal: useful

## Source Nodes

- Dashboard(),Turma,diretoria.ts