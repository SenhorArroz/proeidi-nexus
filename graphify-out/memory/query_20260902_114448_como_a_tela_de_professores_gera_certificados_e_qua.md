---
type: "query"
date: "2026-09-02T11:44:48.959950+00:00"
question: "Como a tela de Professores gera certificados e quais validações impedem diretores docentes de receber certificado de professor?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/professores/page.tsx,src/server/api/routers/certificadoPM.ts,src/app/_components/diretoria/people-management-card.tsx"]
---

# Q: Como a tela de Professores gera certificados e quais validações impedem diretores docentes de receber certificado de professor?

## Answer

A tela passou a abrir o modal de certificado também para diretores docentes. O modal exige a seleção de uma turma vinculada, que fornece semestre e período de aulas; o roteador já autoriza os papéis PROFESSOR e DIRETOR para certificados de professor.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/professores/page.tsx,src/server/api/routers/certificadoPM.ts,src/app/_components/diretoria/people-management-card.tsx