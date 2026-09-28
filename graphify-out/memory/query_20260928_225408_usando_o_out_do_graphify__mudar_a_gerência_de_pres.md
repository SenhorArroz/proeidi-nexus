---
type: "query"
date: "2026-09-28T22:54:08.203489+00:00"
question: "Usando o out do Graphify, mudar a gerência de presença nas turmas da dashboard para uma tabela com dias nas colunas, pessoas nas linhas e salvamento por botão."
contributor: "graphify"
outcome: "useful"
source_nodes: ["useGerenciarPresencas()", "presencas/page.tsx", "use-turma-view.ts", "presenca-view.tsx", "turma.ts"]
---

# Q: Usando o out do Graphify, mudar a gerência de presença nas turmas da dashboard para uma tabela com dias nas colunas, pessoas nas linhas e salvamento por botão.

## Answer

Expanded from original query via vocab: [dashboard, turma, turmadashboardcard, diretoria, usegerenciarpresencas, confirmacaopresenca, registropresenca, aluno, monitor, professor, salvar, presencaaluno]. O fluxo da Diretoria usa PresenceGrid com rascunhos indexados por data, grupo e pessoa. A Dashboard usava uma data selecionada por vez e não carregava os registros existentes. A implementação reutilizou PresenceGrid, passou a consultar turma.presencas.list, preservou estados já salvos, acumulou edições de múltiplos dias e salvou somente os dias alterados pelo botão da tela. Datas futuras permanecem bloqueadas e foram excluídas dos totais.

## Outcome

- Signal: useful

## Source Nodes

- useGerenciarPresencas()
- presencas/page.tsx
- use-turma-view.ts
- presenca-view.tsx
- turma.ts