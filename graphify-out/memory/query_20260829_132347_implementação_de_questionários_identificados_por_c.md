---
type: "query"
date: "2026-08-29T13:23:47.498699+00:00"
question: "Implementação de questionários identificados por cookie e histórico de turmas de alunos"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Formulario", "FormularioResposta", "Aluno", "AlunoTurma", "Turma", "formulario.ts", "aluno.ts"]
---

# Q: Implementação de questionários identificados por cookie e histórico de turmas de alunos

## Answer

Foi implementado um modo de formulário identificado por cookie, que pede o nome da pessoa e impõe uma resposta por identificador persistente de navegador. As estatísticas exibem respostas individuais somente nesse modo. Foi criada uma página de perfil do aluno com informações e histórico de turmas; as atualizações de turma agora preservam vínculos de semestres anteriores.

## Outcome

- Signal: useful

## Source Nodes

- Formulario
- FormularioResposta
- Aluno
- AlunoTurma
- Turma
- formulario.ts
- aluno.ts