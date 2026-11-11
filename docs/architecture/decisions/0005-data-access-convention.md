# 0005: Data access: queries for reads, Server Actions for writes, route handlers only for HTTP integrations

- **Status:** accepted
- **Date:** 2026-11-11

## Context
Next.js offers three ways to run server code for the UI: direct server-side functions called from Server Components, Server Actions, and route handlers (`app/api/**/route.ts`). We need one convention. No mobile or external client is planned.

## Options considered
1. **Query functions (reads)**
   + Type-safe; no HTTP hop; work with `'use cache'`, Cache Components and streaming; easy to unit/integration test.
   − Callable only from server code. Client components get data via props.
2. **Server Actions (writes)**
   + Progressive enhancement for forms; built-in revalidation (`revalidatePath`/`updateTag`); end-to-end types; no URL or fetch boilerplate.
   − Each action is a public POST endpoint, so it needs auth plus validation every time. Actions run sequentially, so they're a bad fit for reads. Only this app can call them.
3. **Route handlers (`app/api`) for everything (REST)**
   + Usable by any client (mobile, scripts); familiar HTTP semantics.
   − More boilerplate; types lost across the fetch boundary; extra network hop when the app calls itself; caching is handled separately.

## Decision
Hybrid:
- Reads → `src/modules/<m>/server/queries.ts`, called directly from Server Components.
- Mutations → `src/modules/<m>/server/actions.ts` (`'use server'`): authenticate → zod-validate → service → revalidate → typed result.
- `src/app/api/**` → only auth callbacks, webhooks or other true HTTP integrations, as thin wrappers over module services.
Both actions and route handlers call `server/service.ts`, so adding a REST API later is cheap.

## Consequences
The review checklist must verify that every Server Action checks auth and validates input. If an external client becomes a requirement, add `app/api/v1` over the existing services in a new ADR.
