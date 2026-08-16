---
version: 1
slug: "src-app-nexus-diretoria-page-tsx"
primary_target: "src/app/nexus/diretoria/page.tsx"
related_targets: ["src/app/_components/diretoria-workspace.tsx","src/app/_components/sidebar.tsx"]
---

Scope: Diretoria is the operating workspace for directors and coordinators; it preserves existing routes, labels, permissions, CRUD flows, and the Nexus brand.

Audience and job: directors move rapidly between students, classes, teachers, monitors, attendance, semesters, forms and drawings while keeping semester context visible.

Chosen direction: Ritmo de Oficina. The approved reference is `.impeccable/mocks/decision/ritmo-de-oficina.png`. A horizontal creative workbench organizes navigation, semester context and operations. Its memorable moment is the sky-blue working field interrupted by ember-orange markers, with real tools arranged as a workflow rather than a generic metric grid.

Constraints: sky-500 and ember-600 remain the anchors; preserve accessible contrast, role restrictions, real database data, mobile behavior, and the existing text. No mock values are introduced.

Implemented foundation: shared Diretória workspace bar, dynamic active semester indicator, persistent wayfinding, keyboard-ready search affordance, global focus styling, and a dashboard reorganized as a workbench with quick routes and live summary totals.
