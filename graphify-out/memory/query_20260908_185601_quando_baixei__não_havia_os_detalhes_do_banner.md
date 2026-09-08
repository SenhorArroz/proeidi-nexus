---
type: "query"
date: "2026-09-08T18:56:01.491554+00:00"
question: "Quando baixei, não havia os detalhes do banner."
contributor: "graphify"
outcome: "corrected"
correction: "Não fixar a cor branca no texto do banner do PDF; calcular contraste a partir de turma.cor."
source_nodes: ["controle-turma-pdf.ts", "pdf-lib", "Turma"]
---

# Q: Quando baixei, não havia os detalhes do banner.

## Answer

Expandido com o vocabulário [pdf, turma]. O texto do banner agora usa contraste automático conforme a cor da turma, garantindo a visibilidade do título e dos detalhes em banners claros e escuros, inclusive com raio superior.

## Outcome

- Signal: corrected
- Correction: Não fixar a cor branca no texto do banner do PDF; calcular contraste a partir de turma.cor.

## Source Nodes

- controle-turma-pdf.ts
- pdf-lib
- Turma