---
type: "query"
date: "2026-09-01T20:31:31.129008+00:00"
question: "Como DiretoriaBackLink e DiretoriaPageIntro são compostos nas páginas de gestão para ajustar apenas o espaçamento entre eles?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/diretoria/page-intro.tsx,src/styles/globals.css,src/app/_components/diretoria-workspace.tsx"]
---

# Q: Como DiretoriaBackLink e DiretoriaPageIntro são compostos nas páginas de gestão para ajustar apenas o espaçamento entre eles?

## Answer

As páginas renderizam DiretoriaBackLink antes de DiretoriaPageIntro. O espaçamento foi refinado: a área de conteúdo reserva apenas uma folga mínima abaixo da barra, e o link tem margem superior pequena, margem inferior para separar o banner e z-index próprio. Assim o retorno continua visível imediatamente antes do cabeçalho sem empurrar o painel para baixo.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/diretoria/page-intro.tsx,src/styles/globals.css,src/app/_components/diretoria-workspace.tsx