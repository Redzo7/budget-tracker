# 0004: Vitest + Playwright for testing

- **Status:** accepted
- **Date:** 2026-11-11

## Decision
- **Vitest** (+ Testing Library, jsdom) for unit tests (domain logic, money) and integration tests (module services against the test DB).
- **Playwright** for E2E user flows, including async Server Components, which Vitest can't render.
Follows the bundled guides in `node_modules/next/dist/docs/01-app/02-guides/testing/`.

## Consequences
Playwright's bundled Chromium doesn't support macOS 12. Locally, use `npm run test:e2e:chrome` (installed Google Chrome).
