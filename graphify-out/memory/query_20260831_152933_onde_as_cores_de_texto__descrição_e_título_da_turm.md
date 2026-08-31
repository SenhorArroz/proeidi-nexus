---
type: "query"
date: "2026-08-31T15:29:33.696392+00:00"
question: "Onde as cores de texto, descrição e título da turma são aplicadas na tela interna e quais regras tratam o tema escuro?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css"]
---

# Q: Onde as cores de texto, descrição e título da turma são aplicadas na tela interna e quais regras tratam o tema escuro?

## Answer

A página interna calcula luminância e contraste para as cores personalizadas. Ao alternar o atributo data-theme, ela escurece a superfície personalizada no tema escuro e escolhe automaticamente um texto claro ou escuro que tenha contraste suficiente. Título e descrição do banner também são recalculados contra a cor principal da turma.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/styles/globals.css