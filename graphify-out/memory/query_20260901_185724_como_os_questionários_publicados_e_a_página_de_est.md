---
type: "query"
date: "2026-09-01T18:57:24.548700+00:00"
question: "Como os questionários publicados e a página de estatísticas armazenam configuração, identificação por cookie, limite de resposta e respostas individuais, e quais mudanças são necessárias para editar ou responder novamente?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/server/api/routers/formulario.ts,src/app/questionarios/[slug]/page.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx,prisma/schema.prisma"]
---

# Q: Como os questionários publicados e a página de estatísticas armazenam configuração, identificação por cookie, limite de resposta e respostas individuais, e quais mudanças são necessárias para editar ou responder novamente?

## Answer

O formulário armazena modoResposta, limitarPorNavegador, configuração e respostas vinculadas opcionalmente ao identificadorCookie. Foi incluída a consulta pública publicResponseStatus para recuperar a resposta do navegador na abertura. publicSubmit agora pode atualizar essa resposta quando editarUltima está ativo. A página pública mostra estado de resposta já enviada após refresh, permite editar a última resposta para formulários limitados e responder novamente apenas quando múltiplas respostas são permitidas. As estatísticas passaram a ter abas de métricas gerais e respostas individuais, sendo a segunda exclusiva do modo identificado.

## Outcome

- Signal: useful

## Source Nodes

- src/server/api/routers/formulario.ts,src/app/questionarios/[slug]/page.tsx,src/app/nexus/diretoria/questionarios/[id]/page.tsx,prisma/schema.prisma