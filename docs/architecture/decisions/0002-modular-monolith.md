# 0002: Modular monolith in a single Next.js app

- **Status:** accepted
- **Date:** 2026-11-11

## Context
A personal budget tracker doesn't justify microservices, but a flat `components/` + `lib/` layout erodes quickly, especially with agents generating code.

## Decision
Use one Next.js app with business modules in `src/modules/<name>`. Each module has a public `index.ts`, owns its tables, and lives under `src/app` only through thin routes. Boundaries are enforced by ESLint `no-restricted-imports`. See `docs/architecture/overview.md`.

## Consequences
+ Changes stay local to one module; agents get a clear place for code.
+ A module could be extracted later.
− Some boilerplate (index re-exports); cross-module reads go through APIs instead of SQL joins (use `reports` for aggregations).
