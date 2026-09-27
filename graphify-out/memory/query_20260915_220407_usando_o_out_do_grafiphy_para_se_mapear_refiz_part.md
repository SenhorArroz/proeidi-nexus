---
type: "query"
date: "2026-09-15T22:04:07.466696+00:00"
question: "usando o out do grafiphy para se mapear refiz parte do sistema de emails para enviar um novo post para os users daquela turma, mas alguns emails vão para a caixa principal dos destinatários e outros seguem para a área de spam. O que pode estar ocorrendo?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["turmaRouter", "sendPostTurmaEmail", "getFrom", "emailLayout"]
---

# Q: usando o out do grafiphy para se mapear refiz parte do sistema de emails para enviar um novo post para os users daquela turma, mas alguns emails vão para a caixa principal dos destinatários e outros seguem para a área de spam. O que pode estar ocorrendo?

## Answer

Expanded from original query via vocab: [email, nodemailer, send, turma, user, post]. The graph traces turmaRouter to sendPostTurmaEmail in src/server/api/routers/turma.ts:L245 and src/server/email.ts:L184. Delivery can vary by recipient reputation, Gmail SMTP quota/behavior, SPF DKIM DMARC alignment, and message content. The implementation sends individual Gmail SMTP messages, includes optional external image/link URLs, lacks List-Unsubscribe, and has informal footer/copy; the footer also renders an empty parenthetical. Verify headers from inbox/spam copies before changing code.

## Outcome

- Signal: useful

## Source Nodes

- turmaRouter
- sendPostTurmaEmail
- getFrom
- emailLayout