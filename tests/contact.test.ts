import { describe, expect, it, vi } from 'vitest'
import { createContactHandler, type Mail } from '@/lib/contact'
import { gstIntra, rupeesToPaise } from '@/lib/xprso-math'
import { mood, polarity } from '@/lib/mood-toy'
import { asciiChart } from '@/lib/ascii-chart'

const good = { name: 'Asha', email: 'asha@example.com', message: 'hello, this is a real message', company: '', elapsed: 8000 }

const setup = (ok = true) => {
  const sent: Mail[] = []
  const send = vi.fn(async (m: Mail) => {
    sent.push(m)
    return { ok }
  })
  let t = 1_000_000
  const handle = createContactHandler({ send, to: 'me@example.com', from: 'site <onboarding@resend.dev>', limit: 2, windowMs: 60_000, now: () => t })
  return { handle, send, sent, tick: (ms: number) => (t += ms) }
}

describe('contact handler', () => {
  it('sends a valid message with reply-to set to the sender', async () => {
    const { handle, sent } = setup()
    const r = await handle(good, '1.1.1.1')
    expect(r).toEqual({ status: 200, body: { ok: true } })
    expect(sent[0]).toMatchObject({ to: 'me@example.com', replyTo: 'asha@example.com', subject: 'portfolio: Asha' })
    expect(sent[0]!.text).toContain('hello, this is a real message')
  })

  it('returns field errors keyed to copy, and sends nothing', async () => {
    const { handle, send } = setup()
    const r = await handle({ ...good, name: '', email: 'nope@', message: 'short' }, '1.1.1.1')
    expect(r.status).toBe(422)
    expect(r.body).toEqual({ ok: false, error: 'validation', fields: { name: 'name', email: 'email', message: 'message' } })
    expect(send).not.toHaveBeenCalled()
  })

  it('flags messages over 5000 chars separately', async () => {
    const { handle } = setup()
    const r = await handle({ ...good, message: 'x'.repeat(5001) }, '1.1.1.1')
    expect(r.body).toMatchObject({ fields: { message: 'messageLong' } })
  })

  it('silently drops honeypot submissions', async () => {
    const { handle, send } = setup()
    const r = await handle({ ...good, company: 'spam inc' }, '1.1.1.1')
    expect(r).toEqual({ status: 200, body: { ok: true } })
    expect(send).not.toHaveBeenCalled()
  })

  it('rejects forms submitted faster than 3s', async () => {
    const { handle, send } = setup()
    const r = await handle({ ...good, elapsed: 900 }, '1.1.1.1')
    expect(r).toEqual({ status: 422, body: { ok: false, error: 'too_fast' } })
    expect(send).not.toHaveBeenCalled()
  })

  it('rate limits per IP inside the window, then lets them back in', async () => {
    const { handle, tick } = setup()
    expect((await handle(good, '2.2.2.2')).status).toBe(200)
    expect((await handle(good, '2.2.2.2')).status).toBe(200)
    expect((await handle(good, '2.2.2.2')).status).toBe(429)
    expect((await handle(good, '3.3.3.3')).status).toBe(200)
    tick(61_000)
    expect((await handle(good, '2.2.2.2')).status).toBe(200)
  })

  it('reports provider failures without throwing', async () => {
    const { handle } = setup(false)
    expect(await handle(good, '1.1.1.1')).toEqual({ status: 502, body: { ok: false, error: 'server' } })
  })

  it('rejects non-object bodies', async () => {
    const { handle } = setup()
    expect((await handle(null, '1.1.1.1')).status).toBe(400)
  })
})

describe('demo math mirrors the repos', () => {
  it('XPRSO: integer paise, 5% intra-state GST split half-up', () => {
    expect(rupeesToPaise('249')).toBe(24900)
    expect(rupeesToPaise('120.5')).toBe(12050)
    expect(gstIntra(24900)).toEqual({ cgst: 623, sgst: 623, total: 26146 })
    expect(gstIntra(51000)).toEqual({ cgst: 1275, sgst: 1275, total: 53550 })
  })

  it('MoodTunes toy: thresholds in the intended order', () => {
    expect(mood(0.6)).toBe('Happy')
    expect(mood(0.3)).toBe('Energetic')
    expect(mood(0)).toBe('Calm')
    expect(mood(-0.3)).toBe('Angry')
    expect(mood(-0.8)).toBe('Sad')
    expect(polarity('this is awful')).toBeLessThan(-0.5)
    expect(polarity('not good')).toBeLessThan(0)
  })

  it('FinTarot chart: same layout as chart.py', () => {
    const out = asciiChart([1, 2, 3], 3, 80).split('\n')
    expect(out[0]).toBe('    3.00 │   ●')
    expect(out[2]).toBe('    1.00 │ ●  ')
    expect(out[3]).toBe('         └───')
  })
})
