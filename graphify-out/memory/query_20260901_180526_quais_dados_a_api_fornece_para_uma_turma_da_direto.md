---
type: "query"
date: "2026-09-01T18:05:26.661068+00:00"
question: "Quais dados a API fornece para uma turma da Diretoria e para o detalhe de um aluno, necessários para uma janela de gestão de turma em abas?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/turmas/page.tsx,src/server/api/routers/diretoria.ts,src/server/api/routers/aluno.ts"]
---

# Q: Quais dados a API fornece para uma turma da Diretoria e para o detalhe de um aluno, necessários para uma janela de gestão de turma em abas?

## Answer

A listagem de turmas fornece semestre, equipe, alunos, materiais, eventos e cores de personalização. A rota aluno.detalhe fornece os dados cadastrais e os vínculos de turmas para mostrar o histórico do aluno. A rota diretoria.presencas.list fornece os registros da turma para calcular a média de presença.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/turmas/page.tsx,src/server/api/routers/diretoria.ts,src/server/api/routers/aluno.ts