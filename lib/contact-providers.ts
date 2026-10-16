import 'server-only'
import { Resend } from 'resend'
import type { Sender } from './contact'

/** Resend (default). Until a domain is verified, onboarding@resend.dev only delivers to the account owner. */
export function resendSender(apiKey: string): Sender {
  const resend = new Resend(apiKey)
  return async (m) => {
    const { error } = await resend.emails.send({ from: m.from, to: m.to, replyTo: m.replyTo, subject: m.subject, text: m.text })
    return error ? { ok: false, detail: error.message } : { ok: true }
  }
}

/** Web3Forms drop-in (CONTACT_PROVIDER=web3forms). No backend mail account needed. */
export function web3formsSender(accessKey: string): Sender {
  return async (m) => {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'content-type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({ access_key: accessKey, subject: m.subject, email: m.replyTo, replyto: m.replyTo, message: m.text }),
    })
    return { ok: res.ok }
  }
}
