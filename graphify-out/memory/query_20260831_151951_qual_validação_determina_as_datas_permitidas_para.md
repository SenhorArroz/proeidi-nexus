---
type: "query"
date: "2026-08-31T15:19:51.295010+00:00"
question: "Qual validação determina as datas permitidas para salvar presenças e onde a lista de datas é montada na tela da turma?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts"]
---

# Q: Qual validação determina as datas permitidas para salvar presenças e onde a lista de datas é montada na tela da turma?

## Answer

O backend permite somente datas de EventoCalendario do tipo AULA. A seleção na PresencaView foi alinhada à regra: agora lista apenas aulas cadastradas, preseleciona uma data válida e bloqueia o salvamento se não houver aula.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts