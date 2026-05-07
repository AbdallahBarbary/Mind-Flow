import { z } from "zod";

export const noteSchema = z.object({
  content: z.string().trim().min(1).max(20000)
});
