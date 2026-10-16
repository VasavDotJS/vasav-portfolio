import { IconArrow } from '@/components/icons'
import { SoftLink } from '@/components/soft/SoftButton'
import { misc } from '@/content/copy'

export default function NotFound() {
  return (
    <main id="main" className="paper-grid grid min-h-svh place-items-center px-[var(--gutter)] pt-[var(--bar-h)]">
      <div className="grid justify-items-start gap-8">
        <h1 className="nf-404 misreg">
          <span className="misreg-ghost is-yellow" aria-hidden>
            404
          </span>
          <span className="misreg-ghost is-coral" aria-hidden>
            404
          </span>
          404
        </h1>
        <p className="text-[clamp(20px,2.4vw,32px)] font-semibold tracking-[-0.03em]">{misc.notFound}</p>
        <SoftLink href="/" cursor="back">
          <IconArrow width={16} height={16} style={{ rotate: '180deg' }} /> {misc.notFoundBack}
        </SoftLink>
      </div>
    </main>
  )
}
