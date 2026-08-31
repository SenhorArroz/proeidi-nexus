---
type: "query"
date: "2026-08-31T12:37:14.556538+00:00"
question: "Quais classes exibem contadores de alunos, materiais e aulas nos cards de turma?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Turma,Dashboard(),TurmasDiretoria()"]
---

# Q: Quais classes exibem contadores de alunos, materiais e aulas nos cards de turma?

## Answer

Os metadados dos cards usam a classe turma-card-descricao, vinculada à cor de descrição persistida da turma. Isso evita que o tema escuro substitua a cor escolhida nos contadores.

## Outcome

- Signal: useful

## Source Nodes

- Turma,Dashboard(),TurmasDiretoria()