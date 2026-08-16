# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Monitores:** acessam apenas posts, calendário e materiais das turmas às quais estão vinculados.
- **Professores:** acessam as próprias turmas e todos os recursos internos delas.
- **Diretores:** também atuam como professores, mas administram os fluxos mais complexos da diretoria.
- **Coordenador:** possui acesso geral, sem restrições de área.

## Product Purpose

O ProEIDI Nexus é o sistema unificado do projeto de extensão de Inclusão Digital para Pessoas Idosas. Ele organiza turmas, pessoas, materiais, calendário, posts, presenças, certificados e operações da diretoria.

## Positioning

O Nexus centraliza a operação pedagógica e administrativa do ProEIDI com permissões por cargo e por vínculo de turma, mantendo cada pessoa concentrada apenas no que precisa executar.

## Operating Context

- Gestão por semestres e turmas.
- Professores e monitores vinculados a turmas específicas.
- Diretoria responsável por cadastros, presença, certificados, formulários e sorteios.
- Coordenador responsável pelo acesso geral e pela gestão de diretores.

## Capabilities and Constraints

- As áreas e os dados devem respeitar permissões por cargo e vínculo com a turma.
- Monitores não devem visualizar recursos fora de posts, calendário e materiais das próprias turmas.
- Professores devem acessar apenas suas turmas e seus recursos internos.
- Diretores e coordenador possuem controles administrativos progressivamente mais amplos.
- O sistema deve oferecer tema claro e escuro, alto contraste e aumento de fonte.

## Brand Commitments

- A identidade visual usa `sky-500` e `amber-600`, em coerência com a logo.
- A experiência deve comunicar criatividade e autonomia.

## Evidence on Hand

- Logo e demais ativos em `public/`.
- Interface existente em Next.js, React, Tailwind CSS, tRPC, NextAuth e Prisma.
- Dados operacionais de turmas, usuários, presenças e certificados no banco de dados.

## Product Principles

1. Mostrar somente as ações e informações necessárias para cada cargo.
2. Dar autonomia aos usuários sem comprometer a segurança dos dados.
3. Manter a operação de turmas simples, rastreável e consistente por semestre.
4. Preservar uma identidade visual criativa, clara e reconhecível.
5. Tratar acessibilidade e legibilidade como requisitos do produto.

## Accessibility & Inclusion

- Disponibilizar temas claro e escuro.
- Disponibilizar modo de alto contraste.
- Permitir aumento de letra.
- Manter controles e dados sensíveis condicionados ao cargo autorizado.
