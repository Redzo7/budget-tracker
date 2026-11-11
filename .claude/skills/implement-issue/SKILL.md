---
name: implement-issue
description: Implement a planned issue from docs/issues following its Implementation plan, the modular-monolith rules and ADR-0005, then run all checks and move the issue to in-review. Use for "implement issue 003", "/implement-issue 003", "start working on 003".
argument-hint: <issue-number>
disable-model-invocation: true
---

# Implement an issue

Target: `docs/issues/$ARGUMENTS-*.md`.

## Preconditions
- The issue `status` must be `planned` (or `in-progress` if resuming). If it's `draft`/`ready`, stop and suggest `/plan-issue $ARGUMENTS`.
- Read the issue, `CLAUDE.md`, `docs/architecture/overview.md` and the ADRs it references.
- Git: create or switch to branch `branch:` from the frontmatter (`issue/NNN-slug`). Don't do this on `main` with uncommitted unrelated changes; ask first.

## Steps
1. Set `status: in-progress` and add a log line.
2. Before using any Next.js API, read its doc in `node_modules/next/dist/docs/`.
3. Implement in this order, one module at a time:
   1. `domain/`: types, zod schemas, pure logic (no I/O).
   2. `db/schema.ts`: tables; re-export from `src/shared/db/schema.ts`; run `npm run db:generate` and commit the migration in `/drizzle` (needs Docker/Postgres for `db:migrate`).
   3. `server/service.ts`: business operations taking `userId` explicitly.
   4. `server/queries.ts` (reads) and `server/actions.ts` (mutations); see the recipe below.
   5. `ui/` components (Server Components by default; `'use client'` only at interactive leaves).
   6. Thin routes in `src/app/...` composing module UI.
   7. Export what other code needs from the module's `index.ts` (nothing else).
4. Write or extend tests alongside (or run `/write-tests $ARGUMENTS` afterwards).
5. Run `npm run check` and `npm run build`; for UI flows, run `npm run test:e2e` (macOS 12: `npm run test:e2e:chrome`). Fix failures. Don't weaken tests or lint rules to get green.
6. Tick the acceptance criteria you verified. Update *Implementation plan* if the reality changed. Set `status: in-review` and log what was done, plus any follow-ups.
7. Report: files changed, how each AC is verified, anything left open. Suggest `/review $ARGUMENTS`. Don't commit unless the owner asks; if asked, use Conventional Commits, e.g. `feat(transactions): add transaction CRUD`, with `Refs: docs/issues/NNN-slug.md`.

## Server Action recipe (ADR-0005)
```ts
"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/modules/identity";
import { createThingSchema } from "../domain/schemas";
import * as service from "./service";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createThing(_prev: unknown, formData: FormData): Promise<ActionResult<{ id: string }>> {
  const user = await requireUser();                       // 1. authenticate
  const parsed = createThingSchema.safeParse(Object.fromEntries(formData)); // 2. validate
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", fieldErrors: z.flattenError(parsed.error).fieldErrors };
  }
  const thing = await service.createThing(user.id, parsed.data); // 3. service, scoped to user
  revalidatePath("/things");                              // 4. revalidate (or updateTag)
  return { ok: true, data: { id: thing.id } };            // 5. typed result
}
```
Verify the current `next/cache` revalidation APIs in the bundled docs before copying this.

## Guardrails
- Respect module boundaries (ESLint will flag `@/modules/x/...` deep imports).
- Never accept `userId` from the client. Every query filters by the authenticated user.
- Money: integer minor units via `src/shared/lib/money.ts`.
- Stay within the issue scope. Log unrelated findings in *Notes / log*.
