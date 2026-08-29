---
type: "query"
date: "2026-08-29T14:37:20.786070+00:00"
question: "Onde a página interna da turma controla edição e permissões de monitor?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Turma,Monitor,MonitorTurma"]
---

# Q: Onde a página interna da turma controla edição e permissões de monitor?

## Answer

A página interna usa o papel retornado por turma.detalhe para exibir ações de edição. A mutação configurarTema valida o vínculo no servidor e agora recusa explicitamente o papel MONITOR.

## Outcome

- Signal: useful

## Source Nodes

- Turma,Monitor,MonitorTurma