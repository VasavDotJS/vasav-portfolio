'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { IconMail } from '@/components/icons'
import { SoftButton } from '@/components/soft/SoftButton'
import { SoftInput, SoftTextarea } from '@/components/soft/SoftInput'
import { contact } from '@/content/copy'
import { fieldErrors, type ContactField, type ContactResponse } from '@/lib/contact-schema'
import { play } from '@/lib/sound'

type Values = { name: string; email: string; message: string; company: string }
type Errors = Partial<Record<ContactField, string>>
const e = contact.errors

const toCopy = (fields: NonNullable<Extract<ContactResponse, { ok: false }>['fields']>): Errors => ({
  name: fields.name ? e.name : undefined,
  email: fields.email ? e.email : undefined,
  message: fields.message === 'messageLong' ? e.messageLong : fields.message ? e.message : undefined,
})

export function ContactForm() {
  const [v, setV] = useState<Values>({ name: '', email: '', message: '', company: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [formError, setFormError] = useState<string | null>(null)
  const opened = useRef(0)
  const form = useRef<HTMLFormElement>(null)

  useEffect(() => {
    opened.current = Date.now()
  }, [])

  const set = (k: keyof Values) => (ev: { target: { value: string } }) => {
    setV((s) => ({ ...s, [k]: ev.target.value }))
    if (errors[k as ContactField]) setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const blur = (k: ContactField) => () => {
    if (!v[k]) return
    const { fields } = fieldErrors({ ...v, elapsed: 0 })
    setErrors((x) => ({ ...x, [k]: fields ? toCopy(fields)[k] : undefined }))
  }

  const submit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (status === 'sending') return
    setFormError(null)
    const payload = { ...v, elapsed: Date.now() - opened.current }
    const { fields } = fieldErrors(payload)
    if (fields) {
      const errs = toCopy(fields)
      setErrors(errs)
      const first = (['name', 'email', 'message'] as const).find((k) => errs[k])
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus()
      return
    }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const body = (await res.json()) as ContactResponse
      if (body.ok) {
        setStatus('sent')
        play('rustle')
        return
      }
      setStatus('idle')
      if (body.error === 'validation' && body.fields) setErrors(toCopy(body.fields))
      else setFormError(body.error === 'too_fast' ? e.tooFast : body.error === 'rate_limited' ? e.rateLimited : e.server)
    } catch {
      setStatus('idle')
      setFormError(e.server)
    }
  }

  if (status === 'sent')
    return (
      <div className="contact-sent">
        <span className="envelope" aria-hidden>
          <IconMail width={44} height={44} />
        </span>
        <p className="contact-sent-text" role="status">
          {contact.sent}
        </p>
        <SoftButton
          onClick={() => {
            setV({ name: '', email: '', message: '', company: '' })
            opened.current = Date.now()
            setStatus('idle')
          }}
        >
          {contact.another}
        </SoftButton>
      </div>
    )

  return (
    <form ref={form} className="contact-form" onSubmit={submit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <SoftInput label={contact.fields.name} name="name" autoComplete="name" value={v.name} onChange={set('name')} onBlur={blur('name')} error={errors.name} maxLength={80} required />
        <SoftInput label={contact.fields.email} name="email" type="email" autoComplete="email" inputMode="email" value={v.email} onChange={set('email')} onBlur={blur('email')} error={errors.email} required />
      </div>
      <SoftTextarea label={contact.fields.message} name="message" rows={6} value={v.message} onChange={set('message')} onBlur={blur('message')} error={errors.message} maxLength={5000} required />
      {/* honeypot: hidden from people and assistive tech */}
      <div className="hp" aria-hidden>
        <label>
          company
          <input name="company" tabIndex={-1} autoComplete="off" value={v.company} onChange={set('company')} />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SoftButton type="submit" variant="ink" cursor="send" className="send-btn" aria-busy={status === 'sending'}>
          {status === 'sending' ? contact.sending : contact.send}
          <IconMail width={18} height={18} />
        </SoftButton>
        {formError && (
          <p className="field-error" role="alert">
            {formError}
          </p>
        )}
      </div>
    </form>
  )
}
