---
type: "query"
date: "2026-09-02T11:21:59.728254+00:00"
question: "Como o layout raiz e a página inicial aplicam tema e onde definir o tema claro padrão somente para a rota /?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/page.tsx,src/app/_components/home/home-theme-lock.tsx,src/app/_components/accessibility-preferences.tsx,src/app/layout.tsx"]
---

# Q: Como o layout raiz e a página inicial aplicam tema e onde definir o tema claro padrão somente para a rota /?

## Answer

A página inicial agora usa HomeThemeLock. O componente força html[data-theme] para light enquanto / está montada e, ao sair, restaura a preferência preservada no AccessibilityProvider. Assim / permanece sempre clara mesmo que o usuário escolha modo escuro no Nexus.

## Outcome

- Signal: useful

## Source Nodes

- src/app/page.tsx,src/app/_components/home/home-theme-lock.tsx,src/app/_components/accessibility-preferences.tsx,src/app/layout.tsx