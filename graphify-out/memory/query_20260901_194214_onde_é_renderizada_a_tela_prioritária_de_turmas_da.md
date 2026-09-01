---
type: "query"
date: "2026-09-01T19:42:14.241121+00:00"
question: "Onde é renderizada a tela prioritária de Turmas da Diretoria e quais estilos de texto ela utiliza?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/turmas/page.tsx,src/app/_components/accessibility-preferences.tsx"]
---

# Q: Onde é renderizada a tela prioritária de Turmas da Diretoria e quais estilos de texto ela utiliza?

## Answer

A tela prioritária é JanelaGestaoTurma em src/app/nexus/diretoria/turmas/page.tsx. Ela aplicava cores de texto e fundo personalizadas como estilos inline. Agora adapta texto, descrição e superfícies muito claras quando o tema escolhido é dark, preservando cores já legíveis e mantendo contraste em métricas, aulas, equipe, alunos e calendário.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/turmas/page.tsx,src/app/_components/accessibility-preferences.tsx