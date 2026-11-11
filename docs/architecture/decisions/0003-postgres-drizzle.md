# 0003: PostgreSQL + Drizzle ORM

- **Status:** accepted
- **Date:** 2026-11-11

## Context
Multi-user relational data (users, accounts, transactions, budgets) with aggregations.

## Options considered
1. **SQLite + Drizzle**: zero infra; weaker for multi-user hosting.
2. **Postgres + Prisma**: mature; single schema file conflicts with per-module ownership; heavier client.
3. **Postgres + Drizzle**: SQL-like, type-safe, schema can be split per module, light runtime.

## Decision
Postgres 17 (Docker Compose locally) with Drizzle ORM and the `postgres` driver. Each module defines `db/schema.ts`; `src/shared/db/schema.ts` aggregates them for drizzle-kit. Migrations are generated (`npm run db:generate`) and committed in `/drizzle`.

## Consequences
Docker is needed for local development. Integration tests use a separate `budget_tracker_test` database.
