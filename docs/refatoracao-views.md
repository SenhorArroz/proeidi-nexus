# Refatoração das views

Varredura das 28 páginas web em `src/app`. Componentes visuais, formulários, listas, tabelas, modais e seções extensas foram separados em `_components` junto à rota. As páginas mantêm a composição principal; estado, consultas e ações extensas ficam em hooks locais. Componentes extraídos possuem nomes próprios e classes de identificação, preservando as classes de estilo existentes.

Utilitários repetidos de cadastro foram centralizados em `src/app/_components/diretoria/cadastro-utils.ts`. As páginas que apenas redirecionam ou reaproveitam outra view foram mantidas enxutas.

## Inventário

Linhas antes da extração e após a formatação; a contagem inclui imports e tipagem.

| Página | Antes | Depois | Organização |
| --- | ---: | ---: | --- |
| `src/app/nexus/acessibilidade/page.tsx` | 227 | 63 | 6 arquivos locais em `_components` |
| `src/app/nexus/configuracoes/page.tsx` | 54 | 98 | 2 arquivos locais em `_components` |
| `src/app/nexus/dashboard/page.tsx` | 158 | 93 | 2 arquivos locais em `_components` |
| `src/app/nexus/dashboard/turmas/[id]/page.tsx` | 2594 | 246 | 13 arquivos locais em `_components` |
| `src/app/nexus/diretoria/alunos/[id]/page.tsx` | 215 | 115 | 3 arquivos locais em `_components` |
| `src/app/nexus/diretoria/alunos/page.tsx` | 1422 | 196 | 12 arquivos locais em `_components` |
| `src/app/nexus/diretoria/diretores/page.tsx` | 54 | 99 | 4 arquivos locais em `_components` |
| `src/app/nexus/diretoria/formularios/page.tsx` | 463 | 174 | 7 arquivos locais em `_components` |
| `src/app/nexus/diretoria/impressao/page.tsx` | 941 | 150 | 7 arquivos locais em `_components` |
| `src/app/nexus/diretoria/materiais-atualizacao/page.tsx` | 529 | 155 | 5 arquivos locais em `_components` |
| `src/app/nexus/diretoria/monitores/page.tsx` | 683 | 135 | 5 arquivos locais em `_components` |
| `src/app/nexus/diretoria/page.tsx` | 293 | 116 | 3 arquivos locais em `_components` |
| `src/app/nexus/diretoria/presencas/page.tsx` | 451 | 219 | 3 arquivos locais em `_components` |
| `src/app/nexus/diretoria/professores/page.tsx` | 853 | 138 | 6 arquivos locais em `_components` |
| `src/app/nexus/diretoria/questionarios/[id]/page.tsx` | 308 | 119 | 3 arquivos locais em `_components` |
| `src/app/nexus/diretoria/questionarios/page.tsx` | 428 | 88 | 5 arquivos locais em `_components` |
| `src/app/nexus/diretoria/semestres/page.tsx` | 196 | 134 | 3 arquivos locais em `_components` |
| `src/app/nexus/diretoria/sorteio/page.tsx` | 672 | 132 | 6 arquivos locais em `_components` |
| `src/app/nexus/diretoria/sorteio/sorteador/page.tsx` | 674 | 145 | 4 arquivos locais em `_components` |
| `src/app/nexus/diretoria/turmas/controle/page.tsx` | 237 | 108 | 2 arquivos locais em `_components` |
| `src/app/nexus/diretoria/turmas/page.tsx` | 1941 | 147 | 13 arquivos locais em `_components` |
| `src/app/nexus/login/page.tsx` | 219 | 76 | 3 arquivos locais em `_components` |
| `src/app/nexus/questionarios/[id]/page.tsx` | 1 | 1 | View principal ou reaproveitamento existente |
| `src/app/nexus/questionarios/editor/page.tsx` | 17 | 17 | View principal ou reaproveitamento existente |
| `src/app/nexus/questionarios/page.tsx` | 1 | 1 | View principal ou reaproveitamento existente |
| `src/app/nexus/redefinir-senha/page.tsx` | 257 | 93 | 3 arquivos locais em `_components` |
| `src/app/page.tsx` | 27 | 27 | 7 arquivos locais em `_components` |
| `src/app/questionarios/[slug]/page.tsx` | 93 | 126 | 6 arquivos locais em `_components` |

## Validação

- `npm run typecheck`: passou.
- Compilação de produção: passou, incluindo geração de páginas, com saída isolada para preservar o servidor de desenvolvimento.
- `git diff --check -- src/app`: passou.
- Navegador: abertura do editor de turma, abas de alunos e calendário, listagem de alunos e abertura/fechamento do cadastro com suas seções. Nenhum cadastro foi salvo durante essa conferência.

A conferência no navegador foi feita nos fluxos acima; não representa um teste funcional de todos os caminhos das 28 páginas.
