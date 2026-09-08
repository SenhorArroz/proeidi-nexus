---
type: "query"
date: "2026-09-08T20:38:54.301318+00:00"
question: "Como as turmas são carregadas na Diretoria, qual o papel do semestre selecionado e quais condições podem impedir a consulta em produção?"
contributor: "graphify"
outcome: "corrected"
correction: "Não carregar relações completas de alunos, docentes e monitores apenas para calcular os totais dos semestres; não ocultar erros de consulta como uma lista vazia."
source_nodes: ["useTurmasDiretoria()", "TurmasDiretoria()", "diretoria.ts"]
---

# Q: Como as turmas são carregadas na Diretoria, qual o papel do semestre selecionado e quais condições podem impedir a consulta em produção?

## Answer

Expandido com o vocabulário [semestres, tRPC, turmas]. A listagem de semestres foi reduzida a contagens e vínculos compactos, evitando carregar árvores completas de turmas antes de habilitar a consulta principal. A tela de turmas agora exibe a falha e permite recarregar as duas consultas.

## Outcome

- Signal: corrected
- Correction: Não carregar relações completas de alunos, docentes e monitores apenas para calcular os totais dos semestres; não ocultar erros de consulta como uma lista vazia.

## Source Nodes

- useTurmasDiretoria()
- TurmasDiretoria()
- diretoria.ts