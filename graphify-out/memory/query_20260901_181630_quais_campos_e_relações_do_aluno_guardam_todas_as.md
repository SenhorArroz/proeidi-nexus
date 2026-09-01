---
type: "query"
date: "2026-09-01T18:16:30.689753+00:00"
question: "Quais campos e relações do Aluno guardam todas as informações cadastrais e as respostas da confirmação de adição, e como aluno.detalhe atualmente os retorna?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/server/api/routers/aluno.ts,src/app/nexus/diretoria/turmas/page.tsx,prisma/schema.prisma"]
---

# Q: Quais campos e relações do Aluno guardam todas as informações cadastrais e as respostas da confirmação de adição, e como aluno.detalhe atualmente os retorna?

## Answer

aluno.detalhe já retorna os campos cadastrais completos: dados pessoais, contato, escolaridade, trabalho, estudos, saúde, necessidade especial e acesso digital. Também retorna os vínculos de turma com semestre, sala e horário. A ficha da gestão de turma passou a organizar todos esses campos como respostas da confirmação de inscrição e a mostrar o histórico completo.

## Outcome

- Signal: useful

## Source Nodes

- src/server/api/routers/aluno.ts,src/app/nexus/diretoria/turmas/page.tsx,prisma/schema.prisma