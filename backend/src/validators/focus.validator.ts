import { z } from "zod";

export const focusSessionSchema = z.object({
  duration: z.number().int().positive().max(24 * 60),
  completed: z.boolean().default(true)
});
