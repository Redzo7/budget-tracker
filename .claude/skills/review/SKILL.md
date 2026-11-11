---
name: review
description: Project-specific code review of the current changes (or an issue's branch) against this repo's architecture rules, security/user-isolation requirements, money handling, Next.js 16 conventions and the Definition of Done. Read-only; produces findings by severity. Use for "/review", "review my changes", "review issue 003".
argument-hint: "[issue-number | base-ref]"
---

# Project review

**Read-only.** Don't edit code. Report findings. The owner decides what to fix (or asks you to fix them afterwards).

## 1. Determine the scope
- Argument is an issue number → read `docs/issues/$ARGUMENTS-*.md` and diff its branch against `main` (`git diff main...issue/NNN-slug`).
- Argument is a git ref → `git diff <ref>...HEAD`.
- No argument → `git diff HEAD` plus untracked files (`git status --short`).
Read every changed file in full, not just the hunks. Also read `CLAUDE.md`, `docs/architecture/overview.md` and `docs/development/definition-of-done.md`.

## 2. Run the checks
`npm run check` (lint, typecheck, unit tests). Record failures as findings.

## 3. Checklist
**Architecture**
- [ ] No deep imports into other modules (`@/modules/x/...`); `shared/` doesn't import modules (except `shared/db/schema.ts`).
- [ ] A module only queries its own tables. Cross-module data goes through public APIs.
- [ ] Routes in `src/app` are thin (no SQL or business logic).
- [ ] Reads are query functions, writes are Server Actions, `app/api` is only for auth or webhooks (ADR-0005).

**Security and data isolation** (blockers if violated)
- [ ] Every Server Action and route handler authenticates via `identity`.
- [ ] Every query and mutation is scoped to the authenticated `userId`. No client-supplied `userId`. Updates and deletes include `user_id` in the WHERE clause.
- [ ] All inputs validated with zod (form data, params, searchParams, bodies).
- [ ] No secrets or server-only modules imported into Client Components. No sensitive data serialized to the client unnecessarily.
- [ ] No raw SQL string interpolation.

**Correctness**
- [ ] Money is integer minor units plus currency, with no float arithmetic. Formatting goes through `shared/lib/money.ts`.
- [ ] Dates and periods: time zones, month boundaries, inclusive/exclusive ranges.
- [ ] Caching: `'use cache'` data is revalidated (`revalidatePath`/`updateTag`) after the mutations that affect it. No user-specific data is cached under a shared key.
- [ ] Error, empty and loading states handled; expected errors returned, not thrown.

**Next.js 16**
- [ ] APIs match the bundled docs (`proxy.ts` not middleware, current caching APIs, async `params`/`searchParams`).
- [ ] `'use client'` placed at the smallest leaf.

**Data and tests**
- [ ] Schema changes come with a generated migration in `/drizzle`. No edited old migrations. Indexes on `user_id` and foreign keys.
- [ ] Every acceptance criterion has a test. A user-isolation test exists for new user data.
- [ ] Issue file updated (status, ticks, log). Docs/ADRs updated if architecture changed.

## 4. Report
Group the findings by severity: **Blocker** (security, data loss, broken build), **Major** (bug, rule violation), **Minor** (maintainability), **Nit**. Each finding: `path:line`, the problem, why it matters, and a suggested fix. End with a verdict: *ready to merge* / *needs changes*, and the DoD items still open.

If auth, permissions or user data changed, also recommend running the built-in `/security-review`. For deeper bug hunting, recommend `/code-review`.
