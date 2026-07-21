import { z } from "zod";

export const CheckRequestSchema = z.object({
  text: z.string().min(1).max(20000),
  language: z.enum(["fr", "en-US"]),
});

export type CheckRequest = z.infer<typeof CheckRequestSchema>;
