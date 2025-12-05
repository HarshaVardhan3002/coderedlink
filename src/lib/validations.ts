import { z } from "zod"

export const createLinkSchema = z.object({
  url: z.string().url("Invalid URL format"),
  code: z
    .string()
    .min(6, "Code must be at least 6 characters")
    .max(8, "Code must be at most 8 characters")
    .regex(/^[A-Za-z0-9]+$/, "Code must be alphanumeric")
    .optional()
    .or(z.literal("")),
})

export type CreateLinkInput = z.infer<typeof createLinkSchema>
