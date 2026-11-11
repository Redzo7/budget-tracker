---
name: plan-issue
description: Plan the implementation of an issue from docs/issues. Explores the code, reads the bundled Next.js docs, asks open questions, and writes the Implementation plan + Test plan into the issue file. Use when the user says "plan issue 003", "/plan-issue 003", or asks how to approach an issue before coding.
argument-hint: <issue-number>
---

# Plan an issue

Target: issue `$ARGUMENTS` in `docs/issues/` (match `docs/issues/$ARGUMENTS-*.md`; if no number is given, list `ready` issues and ask which one).

**This skill only plans.** Do not modify source code. The only file you edit is the issue file.

## Steps
1. **Read context**
   - The issue file in full.
   - `docs/product/vision.md` (domain glossary, constraints), `docs/architecture/overview.md`, every ADR in `docs/architecture/decisions/`, `docs/development/conventions.md`, `docs/development/testing.md`.
   - Issues listed in `depends_on`. If any of them aren't `done`, warn the owner.
2. **Check readiness.** Unclear summary, missing or untestable acceptance criteria, or unresolved *Open questions* → stop and ask the owner with AskUserQuestion. Never invent product behaviour.
3. **Explore the code.** Look at the affected modules in `src/modules/<name>` (public `index.ts`, existing schema, queries, actions) and `src/shared`. Reuse existing helpers (e.g. `src/shared/lib/money.ts`).
4. **Read the relevant Next.js docs** under `node_modules/next/dist/docs/` (Next 16: Cache Components, `proxy.ts`, forms/Server Actions, data security). Record the paths you used.
5. **Design** within the rules in CLAUDE.md:
   - Which module(s) own the change; new public exports in `index.ts`.
   - Data model and migrations (tables, columns, indexes, `user_id` scoping, money as `amount_minor` + `currency`).
   - Reads in `server/queries.ts`, mutations as Server Actions in `server/actions.ts`, shared logic in `server/service.ts`; route handlers only if truly HTTP (ADR-0005).
   - Routes and UI (Server vs Client Components, loading/error/empty states, caching and revalidation).
   - New dependencies with a reason. Any decision big enough for an ADR → propose it (draft it as `proposed`).
6. **Write into the issue file** (replace the placeholder comments, keep everything else):
   - `## Implementation plan`: fill each bullet of the template concisely; use an ordered task list if there are more than ~4 steps.
   - `## Test plan`: one row per acceptance criterion (unit / integration / e2e + intended file path). Always include a user-isolation test when user data is touched.
   - Frontmatter `status: planned`; append `- YYYY-MM-DD: Planned (summary of approach).` to *Notes / log*.
7. **Report** to the owner: a 5–10 line summary of the plan, the open risks, and any ADR proposed. Suggest `/implement-issue <NNN>` as the next step.
