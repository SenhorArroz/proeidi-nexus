---
type: "query"
date: "2026-09-01T20:06:36.799182+00:00"
question: "Quais componentes definem os botões de voltar e quais páginas Nexus possuem contêineres com min-h-screen, overflow ou larguras que podem ultrapassar a viewport?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/botaoVoltar.tsx,src/app/_components/diretoria/page-intro.tsx,src/styles/globals.css,src/app/nexus/layout.tsx"]
---

# Q: Quais componentes definem os botões de voltar e quais páginas Nexus possuem contêineres com min-h-screen, overflow ou larguras que podem ultrapassar a viewport?

## Answer

BotaoVoltar e DiretoriaBackLink são componentes compartilhados. Ambos agora têm espaçamento superior consistente, evitando retorno encostado no topo. diretoria-page-canvas agora impõe min-width:0, max-width:100% e overflow-x:clip em todos os CRUDs que o utilizam. O layout Nexus já usa flex-1 min-w-0 e overflow-x-hidden para conter o conteúdo.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/botaoVoltar.tsx,src/app/_components/diretoria/page-intro.tsx,src/styles/globals.css,src/app/nexus/layout.tsx