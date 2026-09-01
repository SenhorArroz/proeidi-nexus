---
type: "query"
date: "2026-09-01T21:09:31.789830+00:00"
question: "Como o editor de formulários cria ou atualiza questionários e onde a listagem pode expor o link público para gerar um QR Code?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/nexus/diretoria/formularios/page.tsx,src/app/nexus/diretoria/questionarios/page.tsx,package.json,package-lock.json"]
---

# Q: Como o editor de formulários cria ou atualiza questionários e onde a listagem pode expor o link público para gerar um QR Code?

## Answer

O editor em formularios/page.tsx cria um formulário na primeira publicação e, ao receber o id, atualiza a URL e passa a usar formulario.update nas próximas gravações, evitando duplicações. A listagem em questionarios/page.tsx exibe QR Code apenas para formulários publicados, gerado no navegador com qrcode e disponível para download PNG. qrcode e @types/qrcode foram adicionados às dependências.

## Outcome

- Signal: useful

## Source Nodes

- src/app/nexus/diretoria/formularios/page.tsx,src/app/nexus/diretoria/questionarios/page.tsx,package.json,package-lock.json