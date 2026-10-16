// zod/mini: same Zod validation on client and server, a fraction of the bundle
import * as z from 'zod/mini'

// Shared by the form (client) and the route handler (server).
export const MIN_FILL_MS = 3000

export const contactSchema = z.object({
  name: z.string().check(z.trim(), z.minLength(1, 'name'), z.maxLength(80, 'name')),
  email: z.email('email').check(z.maxLength(254, 'email')),
  message: z.string().check(z.trim(), z.minLength(10, 'message'), z.maxLength(5000, 'messageLong')),
  // honeypot: people leave it empty, bots fill it
  company: z.optional(z.string().check(z.maxLength(0))),
  // ms the form was open before submitting
  elapsed: z.int().check(z.nonnegative()),
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
  // trim strings up front so " a@b.co " is a valid email
  const clean =
    input && typeof input === 'object'
      ? Object.fromEntries(Object.entries(input).map(([k, v]) => [k, typeof v === 'string' ? v.trim() : v]))
      : input
  const r = contactSchema.safeParse(clean)
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
