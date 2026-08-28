---
type: "query"
date: "2026-08-28T16:55:41.214868+00:00"
question: "Persist avisos materiais notas da turma no banco"
contributor: "graphify"
outcome: "useful"
source_nodes: ["Aviso", "Material", "Anotacao", "turmaRouter"]
---

# Q: Persist avisos materiais notas da turma no banco

## Answer

Expanded via graph vocabulary: aviso, anotacao, material, turma, prisma, router. The Prisma models and turma router already exposed detail plus create/remove mutations. The class detail UI now calls turma.avisos, turma.materiais and turma.anotacoes mutations, invalidates detalhe after success, and surfaces pending/error states. Avisos include author-based delete permission and non-monitor pin permission.

## Outcome

- Signal: useful

## Source Nodes

- Aviso
- Material
- Anotacao
- turmaRouter