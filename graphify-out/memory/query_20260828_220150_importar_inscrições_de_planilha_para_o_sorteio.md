---
type: "query"
date: "2026-08-28T22:01:50.226663+00:00"
question: "Importar inscrições de planilha para o sorteio"
contributor: "graphify"
outcome: "useful"
source_nodes: ["GerenciarSorteio()", "Candidato", "sorteio/page.tsx"]
---

# Q: Importar inscrições de planilha para o sorteio

## Answer

Expanded via graph vocabulary: sorteador, sorteio, configuracoes. A tela GerenciarSorteio agora importa XLSX/XLS usando cabeçalhos normalizados, registra carimbo de data/hora, valida CPF, nascimento, contato e curso, e envia registros válidos ao importMany do router. Duplicatas por ficha e curso no mesmo semestre são ignoradas.

## Outcome

- Signal: useful

## Source Nodes

- GerenciarSorteio()
- Candidato
- sorteio/page.tsx