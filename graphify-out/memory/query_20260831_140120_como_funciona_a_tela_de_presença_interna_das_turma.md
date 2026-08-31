---
type: "query"
date: "2026-08-31T14:01:20.400201+00:00"
question: "Como funciona a tela de presença interna das turmas, incluindo persistência, estados e personalização de cor?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts,src/styles/globals.css"]
---

# Q: Como funciona a tela de presença interna das turmas, incluindo persistência, estados e personalização de cor?

## Answer

A tela de presença da turma foi reconstruída em PresencaView. Ela mantém os estados presente, ausente, justificado e a registrar, permite escolher a data, aplicar ações em massa e salvar via turma.presencas.salvar. A interface usa a cor de destaque personalizada da turma para títulos, ícones e ação principal, mantendo as cores semânticas para cada estado.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/dashboard/turmas/[id]/page.tsx,src/server/api/routers/turma.ts,src/styles/globals.css