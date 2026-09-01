---
type: "query"
date: "2026-09-01T21:11:57.712062+00:00"
question: "Como o layout raiz e a página inicial aplicam tema e onde definir o tema claro padrão somente para a rota /?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/layout.tsx,src/app/page.tsx,src/app/_components/accessibility-preferences.tsx,src/styles/globals.css"]
---

# Q: Como o layout raiz e a página inicial aplicam tema e onde definir o tema claro padrão somente para a rota /?

## Answer

RootLayout agora inicia o documento com data-theme=light e idioma pt-BR. globals.css define color-scheme e fundo claros para data-theme=light. Assim a página inicial carrega em tema claro desde o primeiro frame; o AccessibilityProvider ainda pode aplicar uma preferência persistida após a hidratação.

## Outcome

- Signal: useful

## Source Nodes

- src/app/layout.tsx,src/app/page.tsx,src/app/_components/accessibility-preferences.tsx,src/styles/globals.css