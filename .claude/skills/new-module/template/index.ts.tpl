/**
 * Public API of the `__MODULE__` module.
 *
 * Responsibility: __RESPONSIBILITY__
 *
 * Rules (see docs/architecture/overview.md):
 * - Code outside this module may import ONLY from "@/modules/__MODULE__".
 * - Never export Drizzle tables for direct use by other modules.
 */
export type * from "./domain/types";
// export { listThings } from "./server/queries";
// export { createThing } from "./server/actions";
