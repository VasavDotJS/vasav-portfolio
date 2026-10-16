'use client'

import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

type FieldProps = { label: string; error?: string | null; hint?: string }

/** Inset well with a mono label. Errors are announced and linked with aria-describedby. */
export function SoftInput({ label, error, hint, className = '', ...rest }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`soft-input soft-well ${className}`}
        {...rest}
      />
    </Field>
  )
}

export function SoftTextarea({ label, error, hint, className = '', ...rest }: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId()
  return (
    <Field id={id} label={label} error={error} hint={hint}>
      <textarea
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={`soft-input soft-well resize-y ${className}`}
        {...rest}
      />
    </Field>
  )
}

function Field({ id, label, error, hint, children }: FieldProps & { id: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="meta text-ink-muted">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="field-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="meta text-ink-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
