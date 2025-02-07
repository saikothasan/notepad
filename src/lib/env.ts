import { z } from "zod"

const envSchema = z.object({
  NOTES_KV: z.string(),
  RATE_LIMIT_REQUESTS: z.string().transform(Number),
  RATE_LIMIT_DURATION: z.string().transform(Number),
})

export const env = envSchema.parse(process.env)

