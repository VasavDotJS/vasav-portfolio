import { createContactHandler, type Sender } from '@/lib/contact'
import { resendSender, web3formsSender } from '@/lib/contact-providers'
import { profile } from '@/content/profile'

function sender(): Sender | null {
  const provider = process.env.CONTACT_PROVIDER ?? 'resend'
  if (provider === 'web3forms' && process.env.WEB3FORMS_ACCESS_KEY) return web3formsSender(process.env.WEB3FORMS_ACCESS_KEY)
  if (provider === 'resend' && process.env.RESEND_API_KEY) return resendSender(process.env.RESEND_API_KEY)
  return null
}

const configured = sender()
const handle = createContactHandler({
  send: configured ?? (async () => ({ ok: false, detail: 'contact provider not configured' })),
  to: process.env.CONTACT_TO_EMAIL ?? profile.email,
  from: process.env.CONTACT_FROM_EMAIL ?? 'portfolio <onboarding@resend.dev>',
})

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
  const body = await req.json().catch(() => null)
  const res = await handle(body, ip)
  return Response.json(res.body, { status: res.status })
}
