import { z } from 'zod'

// Shared by the form (client) and the route handler (server).
export const MIN_FILL_MS = 3000

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'name').max(80, 'name'),
  email: z.string().trim().max(254, 'email').pipe(z.email('email')),
  message: z.string().trim().min(10, 'message').max(5000, 'messageLong'),
  // honeypot: people leave it empty, bots fill it
  company: z.string().max(0).optional().default(''),
  // ms the form was open before submitting
  elapsed: z.number().int().nonnegative(),
})

export type ContactInput = z.input<typeof contactSchema>
export type ContactField = 'name' | 'email' | 'message'

export type ContactResponse =
  | { ok: true }
  | {
      ok: false
      error: 'validation' | 'too_fast' | 'rate_limited' | 'server' | 'bad_request'
      fields?: Partial<Record<ContactField, 'name' | 'email' | 'message' | 'messageLong'>>
    }

/** Field errors keyed by the copy keys in content/copy.ts (contact.errors). */
export function fieldErrors(input: unknown) {
  const r = contactSchema.safeParse(input)
  if (r.success) return { data: r.data, fields: null }
  const fields: NonNullable<Extract<ContactResponse, { ok: false }>['fields']> = {}
  for (const issue of r.error.issues) {
    const key = issue.path[0]
    if (key === 'name' || key === 'email' || key === 'message') {
      fields[key] ??= issue.message as 'name' | 'email' | 'message' | 'messageLong'
    }
  }
  return { data: null, fields }
}
