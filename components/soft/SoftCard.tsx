import type { HTMLAttributes } from 'react'

export function SoftCard({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`soft soft-card ${className}`} {...rest} />
}
