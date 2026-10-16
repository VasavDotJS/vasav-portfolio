'use client'

import { useEffect, useRef, useState } from 'react'
import { work } from '@/content/copy'
import { formatINR, gstIntra, fyShort } from '@/lib/xprso-math'
import { play } from '@/lib/sound'

const s = work.xprso.settled

/** Thermal receipt that prints out, gets stamped, and refuses to be moved. */
export function SettledReceipt() {
  const ref = useRef<HTMLDivElement>(null)
  const wrap = useRef<HTMLDivElement>(null)
  const [stage, setStage] = useState<'idle' | 'printing' | 'settled'>('idle')
  const [refused, setRefused] = useState(0)
  const drag = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    // observe the wrapper: the receipt itself starts fully clipped, which reads as 0% visible
    const el = wrap.current
    if (!el) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return
        io.disconnect()
        if (reduced) return setStage('settled')
        setStage('printing')
        window.setTimeout(() => {
          setStage('settled')
          play('stamp')
        }, 1500)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const subtotal = s.items.reduce((a, i) => a + i.qty * i.paise, 0)
  const { cgst, sgst, total } = gstIntra(subtotal)

  const refuse = () => {
    setRefused((n) => n + 1)
    play('click', { rate: 0.6 })
  }

  return (
    <div ref={wrap} className="receipt-wrap">
      <div className="receipt-slot soft" aria-hidden />
      <div
        ref={ref}
        className="receipt"
        data-stage={stage}
        data-shake={refused % 2 ? 'a' : refused ? 'b' : undefined}
        data-cursor="drag"
        role="img"
        aria-label={`settled receipt ORD/${fyShort()}/000001, total ${formatINR(total)}. it cannot be edited.`}
        onPointerDown={(e) => (drag.current = { x: e.clientX, y: e.clientY })}
        onPointerMove={(e) => {
          if (!drag.current) return
          if (Math.hypot(e.clientX - drag.current.x, e.clientY - drag.current.y) > 6) {
            drag.current = null
            refuse()
          }
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <div className="receipt-paper mono tnum" aria-hidden>
          <p className="text-center">XPRSO</p>
          <p className="text-center">TAX INVOICE</p>
          <hr />
          <p className="flex justify-between">
            <span>ORD/{fyShort()}/000001</span>
          </p>
          <hr />
          {s.items.map((i) => (
            <p key={i.name} className="flex justify-between">
              <span>
                {i.name} ×{i.qty}
              </span>
              <span>{formatINR(i.qty * i.paise)}</span>
            </p>
          ))}
          <hr />
          <p className="flex justify-between">
            <span>CGST 2.5%</span>
            <span>{formatINR(cgst)}</span>
          </p>
          <p className="flex justify-between">
            <span>SGST 2.5%</span>
            <span>{formatINR(sgst)}</span>
          </p>
          <p className="flex justify-between font-medium">
            <span>TOTAL</span>
            <span>{formatINR(total)}</span>
          </p>
          <hr />
          <p className="text-center">UPI · paid</p>
        </div>
        <span className="receipt-stamp" aria-hidden>
          {s.stamp}
        </span>
      </div>
      <p className="receipt-error mono" role="status" aria-live="polite" data-on={refused ? 'true' : 'false'}>
        {refused ? `ERROR: ${s.refusal}` : ''}
      </p>
    </div>
  )
}
