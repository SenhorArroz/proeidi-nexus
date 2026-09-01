---
type: "query"
date: "2026-09-01T20:15:42.382060+00:00"
question: "Como DiretoriaWorkspace organiza o cabeçalho sticky e onde deve ser reservado espaço para evitar sobreposição sobre as páginas filhas?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/diretoria-workspace.tsx,src/styles/globals.css"]
---

# Q: Como DiretoriaWorkspace organiza o cabeçalho sticky e onde deve ser reservado espaço para evitar sobreposição sobre as páginas filhas?

## Answer

DiretoriaWorkspace agora envolve children em diretoria-workspace__content. Esse contêiner reserva espaçamento superior e largura mínima segura abaixo do cabeçalho sticky; em mobile a folga é reduzida. Assim links Voltar para Diretoria e o início dos painéis não ficam sob o breadcrumb Diretoria → Visão geral.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/diretoria-workspace.tsx,src/styles/globals.css