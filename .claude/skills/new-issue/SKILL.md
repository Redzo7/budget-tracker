---
name: new-issue
description: Create a new numbered issue file in docs/issues from the 000 template. Use for "/new-issue <title>", "create an issue for …", "log a bug about …".
argument-hint: <short title>
disable-model-invocation: true
---

# Create a new issue

1. Find the next number: the highest `docs/issues/NNN-*.md` + 1, zero-padded to 3 digits (000 is the template).
2. Build a slug from the title: lowercase kebab-case, max ~5 words.
3. Copy `docs/issues/000-issue-template.md` to `docs/issues/NNN-slug.md` and fill the frontmatter: `id`, `title` (`$ARGUMENTS`), `status: draft`, `type`, `module` (infer from `docs/architecture/overview.md`; ask if unsure), `priority: medium` unless told otherwise, `created` (today), `branch: issue/NNN-slug`. Replace `000` in the heading.
4. If the user described the problem, draft *Summary*, *User story* and *Acceptance criteria* from their words. Mark anything you inferred with `<!-- TODO(owner): confirm -->`. Never present invented requirements as decided.
5. Leave *Implementation plan* and *Test plan* as template placeholders (filled by `/plan-issue`).
6. Add a row to the index table in `docs/issues/README.md`.
7. Reply with the file path and the open TODOs the owner should fill before moving it to `ready`.
