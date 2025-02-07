import { z } from "zod"

export const noteSchema = z.object({
  content: z.string().min(1).max(1000),
})

export const idSchema = z.string().uuid()

