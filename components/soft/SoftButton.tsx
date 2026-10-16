'use client'

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { useMagnetic } from '@/lib/use-magnetic'
import { play } from '@/lib/sound'

type Common = {
  variant?: 'raised' | 'ink'
  icon?: boolean
  magnetic?: boolean
  cursor?: string
  children: ReactNode
  className?: string
}

const classes = ({ variant = 'raised', icon, className = '' }: Common) =>
  ['soft soft-btn is-hoverable is-pressable magnetic', variant === 'ink' && 'is-ink', icon && 'is-icon', className]
    .filter(Boolean)
    .join(' ')

export function SoftButton({
  variant,
  icon,
  magnetic = true,
  cursor,
  children,
  className,
  onClick,
  type = 'button',
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>(magnetic ? 6 : 0)
  return (
    <button
      ref={ref}
      type={type}
      data-cursor={cursor}
      className={classes({ variant, icon, className, children })}
      onClick={(e) => {
        play('click')
        onClick?.(e)
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export function SoftLink({
  variant,
  icon,
  magnetic = true,
  cursor,
  children,
  className,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>(magnetic ? 6 : 0)
  const external = rest.href?.startsWith('http')
  return (
    <a
      ref={ref}
      data-cursor={cursor}
      className={classes({ variant, icon, className, children })}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}
