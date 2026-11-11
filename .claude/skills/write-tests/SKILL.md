---
name: write-tests
description: Design and write tests (Vitest unit/integration, Playwright E2E) for an issue's acceptance criteria or for a given file/module, following docs/development/testing.md. Use for "write tests for 003", "/write-tests", "add test coverage for the budgets module".
argument-hint: <issue-number | path>
---

# Write tests

Target: `$ARGUMENTS`, either an issue number (`docs/issues/$ARGUMENTS-*.md`) or a file/module path. With no argument, use the current branch's issue (`issue/NNN-…`).

Read `docs/development/testing.md` first. It defines the levels, locations and principles.

## Steps
1. **Collect what to test**
   - Issue: every acceptance criterion and the *Test plan* table.
   - Path: the public behaviour of the file or module (its `index.ts` exports, domain functions, actions).
2. **Pick the lowest level that proves each behaviour:**
   - **Unit** (Vitest, `*.test.ts(x)`): domain logic, zod schemas, money math, sync components. No DB, no network.
   - **Integration** (Vitest, `src/modules/<m>/__tests__/*.int.test.ts`): services and queries against `TEST_DATABASE_URL`. If the DB test setup doesn't exist yet, create it (vitest setup file: run migrations, truncate between tests) and document it in testing.md. Requires Postgres (`npm run db:up`).
   - **E2E** (Playwright, `tests/e2e/*.spec.ts`): user flows, async Server Components, auth redirects, forms through Server Actions.
3. **Mandatory cases** when relevant:
   - User isolation: user B can't read, update or delete user A's records (integration level).
   - Validation: invalid input returns `{ ok: false, fieldErrors }` and doesn't throw.
   - Money edge cases: negatives, zero, rounding, currency mismatch.
   - Empty states and boundaries (period start/end, month rollover, time zones for dates).
4. **Write the tests.** Use the Arrange-Act-Assert structure and descriptive names (`it("rejects a budget with a negative limit")`). Query the UI by role or label. No snapshots by default. Keep fixtures and factories in the module's `__tests__/` or `tests/e2e/fixtures`.
5. **Run them:** `npm test` (or `npx vitest run <path>`), and for E2E `npm run test:e2e` (macOS 12: `npm run test:e2e:chrome`). Each test should fail without the implementation. If you have time, quickly check that by breaking the code under test.
6. **Update the issue's** *Test plan* table (AC → level → file) and log the result.
7. **Report** each AC with its test(s), anything not covered and why, and failing tests that point to real bugs (don't "fix" the test to hide them).
