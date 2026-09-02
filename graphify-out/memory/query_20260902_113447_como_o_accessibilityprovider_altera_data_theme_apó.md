---
type: "query"
date: "2026-09-02T11:34:47.229002+00:00"
question: "Como o AccessibilityProvider altera data-theme após a montagem e como a página inicial pode impedir essa alteração apenas enquanto está aberta?"
contributor: "graphify"
outcome: "useful"
source_nodes: ["src/app/_components/home/home-theme-lock.tsx,src/app/_components/accessibility-preferences.tsx,src/app/page.tsx"]
---

# Q: Como o AccessibilityProvider altera data-theme após a montagem e como a página inicial pode impedir essa alteração apenas enquanto está aberta?

## Answer

HomeThemeLock agora observa alterações em html[data-theme] com MutationObserver e força light enquanto / está montada. Ao desmontar, desconecta o observador e restaura a preferência do AccessibilityProvider. Portanto qualquer troca tardia do provider não afeta a landing page.

## Outcome

- Signal: useful

## Source Nodes

- src/app/_components/home/home-theme-lock.tsx,src/app/_components/accessibility-preferences.tsx,src/app/page.tsx