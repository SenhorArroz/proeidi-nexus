---
type: "query"
date: "2026-09-01T19:44:55.964018+00:00"
question: "Como a tela principal da Diretoria aplica o fundo escuro e os brilhos, e quais páginas de gestão precisam compartilhar esse canvas?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/diretoria-workspace.tsx,src/styles/globals.css,src/app/nexus/diretoria/semestres/page.tsx,src/app/nexus/diretoria/turmas/page.tsx,src/app/nexus/diretoria/alunos/page.tsx,src/app/nexus/diretoria/professores/page.tsx,src/app/nexus/diretoria/monitores/page.tsx,src/app/nexus/diretoria/presencas/page.tsx,src/app/nexus/diretoria/sorteio/page.tsx"]
---

# Q: Como a tela principal da Diretoria aplica o fundo escuro e os brilhos, e quais páginas de gestão precisam compartilhar esse canvas?

## Answer

DiretoriaWorkspace já fornece o canvas com fundo profundo no tema dark e brilhos sky/amber. Os contêineres externos de Semestres, Turmas (incluindo a tela prioritária), Alunos, Professores, Monitores, Presenças e Sorteio foram convertidos para diretoria-page-canvas transparente, permitindo que o canvas compartilhado apareça de modo uniforme.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/diretoria-workspace.tsx,src/styles/globals.css,src/app/nexus/diretoria/semestres/page.tsx,src/app/nexus/diretoria/turmas/page.tsx,src/app/nexus/diretoria/alunos/page.tsx,src/app/nexus/diretoria/professores/page.tsx,src/app/nexus/diretoria/monitores/page.tsx,src/app/nexus/diretoria/presencas/page.tsx,src/app/nexus/diretoria/sorteio/page.tsx