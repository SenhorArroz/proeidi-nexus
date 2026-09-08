---
type: "query"
date: "2026-09-08T19:28:23.913506+00:00"
question: "Onde fica o formulário de edição de turmas da diretoria e quais campos de cor são persistidos?"
contributor: "graphify"
outcome: "corrected"
correction: "As cores existentes da turma precisam estar disponíveis no editor, não apenas persistidas pela API."
source_nodes: ["VisaoGeralGestaoTurma()", "Turma", "diretoria.ts"]
---

# Q: Onde fica o formulário de edição de turmas da diretoria e quais campos de cor são persistidos?

## Answer

Expandido com o vocabulário [cor, formulário, turma]. A aba Visão geral do editor de turma agora expõe seletores para cor principal, destaque, fundo, título, texto e descrição. Todos já fazem parte do payload de salvamento da turma.

## Outcome

- Signal: corrected
- Correction: As cores existentes da turma precisam estar disponíveis no editor, não apenas persistidas pela API.

## Source Nodes

- VisaoGeralGestaoTurma()
- Turma
- diretoria.ts