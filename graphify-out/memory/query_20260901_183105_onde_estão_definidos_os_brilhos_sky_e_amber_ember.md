---
type: "query"
date: "2026-09-01T18:31:05.588018+00:00"
question: "Onde estão definidos os brilhos sky e amber/ember do perfil de aluno e da área de informações da Diretoria?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/alunos/[id]/page.tsx,src/styles/globals.css"]
---

# Q: Onde estão definidos os brilhos sky e amber/ember do perfil de aluno e da área de informações da Diretoria?

## Answer

O perfil detalhado de aluno não tinha camadas próprias de brilho atrás das informações. Foram adicionadas duas camadas decorativas não interativas no fundo da página: sky com opacidade 45% e amber com opacidade 40%, ambas desfocadas e mantidas atrás do conteúdo para preservar a leitura.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/alunos/[id]/page.tsx,src/styles/globals.css