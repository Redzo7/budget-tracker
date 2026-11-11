---
name: new-module
description: Scaffold a new business module in src/modules/<name> from the project's module template and register it in the architecture docs. Use for "/new-module <name>", "add a savings-goals module".
argument-hint: <module-name (kebab-case)>
disable-model-invocation: true
---

# Scaffold a module

Module name: `$ARGUMENTS` (kebab-case, plural noun if it owns records, e.g. `savings-goals`).

1. Check that `src/modules/$ARGUMENTS` doesn't exist and the name doesn't overlap an existing module's responsibility (`docs/architecture/overview.md`). If it overlaps, stop and discuss with the owner.
2. Ask the owner (unless already given) for: a one-line responsibility and the modules it depends on. The dependency graph must stay acyclic.
3. Copy the files in `.claude/skills/new-module/template/` into `src/modules/$ARGUMENTS/`, dropping the `.tpl` suffix:
   - `index.ts.tpl` → `index.ts`
   - `domain/types.ts.tpl`, `domain/schemas.ts.tpl`
   - `server/queries.ts.tpl`, `server/actions.ts.tpl`, `server/service.ts.tpl`
   - `db/schema.ts.tpl`
   - create empty `ui/.gitkeep` and `__tests__/.gitkeep`
   In every file, replace `__MODULE__` with the module name and `__RESPONSIBILITY__` with the responsibility.
4. Leave `src/shared/db/schema.ts` alone until the module defines real tables (an empty schema re-export is harmless, but skip it to avoid noise). Add the re-export in the issue that creates the first table.
5. Add a row to the *Modules* table in `docs/architecture/overview.md` (and to the module list in `CLAUDE.md` if it's mentioned there).
6. Run `npm run lint && npm run typecheck`.
7. Report the created files. If the module is a significant architectural addition, suggest an ADR.
