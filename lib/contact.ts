import { fieldErrors, MIN_FILL_MS, type ContactResponse } from './contact-schema'

export type Mail = { to: string; from: string; replyTo: string; subject: string; text: string }
export type Sender = (mail: Mail) => Promise<{ ok: boolean; detail?: string }>

type Deps = {
  send: Sender
  to: string
  from: string
  /** max messages per IP per window */
  limit?: number
  windowMs?: number
  now?: () => number
}

/**
 * Contact handler with its edges injected (sender, clock) so it can be unit-tested.
 * Rate limit is in-memory per server instance: fine for a portfolio. Upgrade path:
 * @upstash/ratelimit with Redis if this ever gets real traffic.
 */
export function createContactHandler({ send, to, from, limit = 5, windowMs = 10 * 60_000, now = Date.now }: Deps) {
  const hits = new Map<string, number[]>()

  const limited = (ip: string) => {
    const t = now()
    const recent = (hits.get(ip) ?? []).filter((x) => t - x < windowMs)
    recent.push(t)
    hits.set(ip, recent)
    if (hits.size > 5000) hits.clear()
    return recent.length > limit
  }

  return async function handle(body: unknown, ip: string): Promise<{ status: number; body: ContactResponse }> {
    if (!body || typeof body !== 'object') return { status: 400, body: { ok: false, error: 'bad_request' } }
    const raw = body as Record<string, unknown>

    // honeypot filled: say thanks, send nothing
    if (typeof raw.company === 'string' && raw.company.length > 0) return { status: 200, body: { ok: true } }

    const { data, fields } = fieldErrors(raw)
    if (!data) return { status: 422, body: { ok: false, error: 'validation', fields: fields ?? {} } }
    if (data.elapsed < MIN_FILL_MS) return { status: 422, body: { ok: false, error: 'too_fast' } }
    if (limited(ip)) return { status: 429, body: { ok: false, error: 'rate_limited' } }

    const result = await send({
      to,
      from,
      replyTo: data.email,
      subject: `portfolio: ${data.name}`,
      text: `${data.message}\n\n— ${data.name} <${data.email}>`,
    }).catch(() => ({ ok: false }))

    return result.ok ? { status: 200, body: { ok: true } } : { status: 502, body: { ok: false, error: 'server' } }
  }
}
