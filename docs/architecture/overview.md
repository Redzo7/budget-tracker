# Architecture overview

## Style: modular monolith
One Next.js app and one Postgres database, split into **modules** with explicit public APIs. Modules are organised by business capability, not by technical layer. That keeps a change local to one folder and would allow extracting a module later.

```
                ┌─────────────── src/app (routes, thin) ───────────────┐
                │  Server Components → queries   Forms → Server Actions │
                │  app/api → route handlers (auth callback, webhooks)  │
                └───────────────┬──────────────────────────────────────┘
                                │ imports ONLY "@/modules/<name>"
   ┌──────────┬──────────┬──────┴───────┬────────────┬──────────┬──────────┐
   │ identity │ accounts │ transactions │ categories │ budgets  │ reports  │
   └────┬─────┴────┬─────┴──────┬───────┴─────┬──────┴────┬─────┴────┬─────┘
        └──────────┴────────────┴──── src/shared ┴─────────┴──────────┘
                     (db client, env config, money, ui primitives)
```

## Modules
| Module | Owns | May depend on |
|---|---|---|
| `identity` | users, sessions, auth integration | shared |
| `accounts` | accounts (name, type, currency) | identity |
| `categories` | category tree | identity |
| `transactions` | transactions | identity, accounts, categories |
| `budgets` | budgets per category and period | identity, categories, transactions (read) |
| `reports` | nothing (read-only aggregations) | identity + public APIs of the others |

<!-- TODO(owner): adjust once docs/product/vision.md is filled in. -->

Dependencies must stay **acyclic**. If two modules need each other, extract the shared concept or invert the dependency (pass data in from the caller).

## Module anatomy
```
src/modules/<name>/
  index.ts          public API: re-export what others may use
  domain/           pure TS: types, validation schemas (zod), calculations. No I/O.
  server/
    queries.ts      reads, called from Server Components. Always scoped by userId.
    actions.ts      'use server' mutations: auth → zod → service → revalidate
    service.ts      business operations shared by actions and route handlers
  db/schema.ts      Drizzle tables (prefixed with the module name if ambiguous)
  ui/               components specific to this module
  __tests__/        unit and integration tests
```

## Rules
1. **Public API only.** Import `@/modules/x`, never `@/modules/x/server/...`. ESLint (`no-restricted-imports`) enforces this.
2. **Data ownership.** Only module X's code queries X's tables. Cross-module foreign keys are allowed at the DB level, but data access goes through the owning module's API.
3. **Shared kernel stays small.** `src/shared` holds generic infrastructure only, with no business rules and no imports from modules (except `shared/db/schema.ts`, which aggregates schemas for drizzle-kit).
4. **User isolation.** Every query filters by the authenticated `userId`, obtained from `identity` on the server.
5. **Money.** Store integer minor units plus an ISO currency code (`src/shared/lib/money.ts`).
6. **Thin routes.** `page.tsx`/`layout.tsx` compose module UI and call module queries. They contain no SQL and no business logic.

## Data access (ADR-0005)
- Reads: `server/queries.ts`, called directly from Server Components (can use `'use cache'` and tags).
- Writes: Server Actions in `server/actions.ts`.
- HTTP: `src/app/api/**/route.ts` only for auth and webhooks.

## Database
- Postgres 17 via Docker Compose (`budget_tracker` and `budget_tracker_test`).
- Drizzle schema per module, aggregated in `src/shared/db/schema.ts`. Migrations in `/drizzle` (committed).

## Decisions
See `docs/architecture/decisions/` (ADRs).
