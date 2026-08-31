---
type: "query"
date: "2026-08-31T12:50:32.272822+00:00"
question: "Como a Diretoria salva e recarrega turmas após edição?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["TurmasDiretoria(),diretoria.ts"]
---

# Q: Como a Diretoria salva e recarrega turmas após edição?

## Answer

O formulário agora aguarda a mutação, atualiza a turma editada no estado local com todos os dados do rascunho e invalida a lista antes de voltar. Isso evita cards temporariamente vazios ou desatualizados.

## Outcome

- Signal: useful

## Source Nodes

- TurmasDiretoria(),diretoria.ts