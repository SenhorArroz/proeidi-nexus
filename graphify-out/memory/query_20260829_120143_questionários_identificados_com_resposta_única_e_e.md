---
type: "query"
date: "2026-08-29T12:01:43.710012+00:00"
question: "Questionários identificados com resposta única e estatísticas individuais"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Formulario", "FormularioResposta", "Respostas", "EstatisticasQuestionario()", "formulario.ts"]
---

# Q: Questionários identificados com resposta única e estatísticas individuais

## Answer

O projeto possui formulários públicos e respostas anônimas em JSON. A proposta é criar um modo por formulário: anônimo ilimitado (atual) ou identificado pela conta Nexus, com uma resposta por usuário. O banco deve relacionar a resposta ao usuário e garantir unicidade por formulário e usuário. As estatísticas de formulários identificados devem incluir uma lista protegida de respostas individuais, com nome, data e detalhe por pergunta; formulários anônimos preservam somente dados agregados.

## Outcome

- Signal: useful

## Source Nodes

- Formulario
- FormularioResposta
- Respostas
- EstatisticasQuestionario()
- formulario.ts