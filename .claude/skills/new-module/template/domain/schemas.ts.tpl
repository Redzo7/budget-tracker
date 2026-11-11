import { z } from "zod";

/** zod schemas validating input to __MODULE__ actions (form data, params). */
export const exampleInputSchema = z.object({
  // name: z.string().trim().min(1).max(100),
});

export type ExampleInput = z.infer<typeof exampleInputSchema>;
