---
type: "query"
date: "2026-09-27T15:31:53.886150+00:00"
question: "vá na importação dos alunos e ajuste a importação automática para mapear uma única turma por aluno pelos nomes da coluna Turma e pelos nomes cadastrados no banco"
contributor: "graphify"
outcome: "useful"
source_nodes: ["useGerenciarAlunos()", "ModalImportacaoAlunos()", "aluno.ts"]
---

# Q: vá na importação dos alunos e ajuste a importação automática para mapear uma única turma por aluno pelos nomes da coluna Turma e pelos nomes cadastrados no banco

## Answer

Expanded from original query via vocab: [aluno, alunos, turma, turmas, importacao, importar, matricula, matriculas, planilha, registro]. O fluxo está em useGerenciarAlunos(), ModalImportacaoAlunos() e aluno.ts. Foi implementado rastreio dinâmico dos títulos retornados pelo banco, respeito estrito a T1/T2/T3 quando há múltiplas turmas, fallback para a turma única do curso, seleção manual exclusiva e validação do servidor com no máximo uma turma por aluno importado.

## Outcome

- Signal: useful

## Source Nodes

- useGerenciarAlunos()
- ModalImportacaoAlunos()
- aluno.ts