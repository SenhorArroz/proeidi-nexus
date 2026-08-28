---
type: "query"
date: "2026-08-28T22:05:12.408189+00:00"
question: "Corrigir importação com telefones longos na planilha de inscrições"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Candidato", "GerenciarSorteio()"]
---

# Q: Corrigir importação com telefones longos na planilha de inscrições

## Answer

Expanded via graph vocabulary: sorteio, candidato, import. A validação de telefone de Candidato passou de 30 para 160 caracteres, preservando números alternativos, rótulos e observações das quatro linhas antes rejeitadas. A maior entrada da planilha tem 50 caracteres, portanto é aceita.

## Outcome

- Signal: useful

## Source Nodes

- Candidato
- GerenciarSorteio()