---
type: "query"
date: "2026-09-01T18:21:03.217602+00:00"
question: "Onde o CRUD de alunos renderiza a visualização ou modal de detalhes de um aluno, e quais dados já estão disponíveis para completar a ficha?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/alunos/page.tsx,src/app/nexus/diretoria/alunos/[id]/page.tsx,src/server/api/routers/aluno.ts"]
---

# Q: Onde o CRUD de alunos renderiza a visualização ou modal de detalhes de um aluno, e quais dados já estão disponíveis para completar a ficha?

## Answer

O CRUD aponta para src/app/nexus/diretoria/alunos/[id]/page.tsx ao acionar Ver perfil e histórico. Essa página consulta aluno.detalhe, que já retorna todos os dados cadastrais e vínculos de turma. A tela foi ampliada para apresentar dados pessoais, contato e todas as respostas da confirmação de inscrição, além do histórico.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/alunos/page.tsx,src/app/nexus/diretoria/alunos/[id]/page.tsx,src/server/api/routers/aluno.ts