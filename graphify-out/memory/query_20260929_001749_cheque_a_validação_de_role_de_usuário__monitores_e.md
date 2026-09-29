---
type: "implementation"
date: "2026-09-29T00:17:49.570393+00:00"
question: "cheque a validação de role de usuário. Monitores econseguem ver presença e isso não deveria. Eles apenas devem ver materiais e início. Apenas"
contributor: "graphify"
outcome: "useful"
source_nodes: ["useTurmaView()", "TABS", "NavegacaoTurmaMobile()", "turmas/[id]/page.tsx", "turmaRouter"]
---

# Q: cheque a validação de role de usuário. Monitores econseguem ver presença e isso não deveria. Eles apenas devem ver materiais e início. Apenas

## Answer

Expanded from original query via graph vocab: [role, monitor, monitores, dashboard, turma, presenca, material, inicio, auth, session, navegacao, permiss]. A role efetiva vem de turma.detalhe após acessoTurma consultar o usuário no banco. A API turma.presencas.list/salvar já bloqueava MONITOR, mas as navegações mobile e desktop mapeavam TABS sem filtro. A correção criou TABS_MONITOR apenas com inicio e materiais, propagou tabsDisponiveis às duas navegações, recolhe tabs inválidas para inicio e adicionou guardas de conteúdo para notas, calendário e três telas de presença. As mutações de calendário também passaram a rejeitar MONITOR no servidor.

## Outcome

- Signal: useful

## Source Nodes

- useTurmaView()
- TABS
- NavegacaoTurmaMobile()
- turmas/[id]/page.tsx
- turmaRouter