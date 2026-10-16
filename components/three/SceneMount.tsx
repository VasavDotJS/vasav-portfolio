'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { markSceneReady } from '@/lib/scene-state'

// three.js + R3F live in their own chunk, requested as soon as the page hydrates
// (i.e. while the loader is running). The loader listens for 'vpr:scene-ready'.
const Scene = dynamic(() => import('./Scene'), { ssr: false })

function canWebGL() {
  try {
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl2') ?? c.getContext('webgl'))
  } catch {
    return false
  }
}

export function SceneMount() {
  const [mode, setMode] = useState<'pending' | '3d' | 'static'>('pending')

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const forced = new URLSearchParams(location.search).has('no3d')
    const next = !reduced && !forced && canWebGL() ? '3d' : 'static'
    // decided after mount so SSR markup never depends on the device
    queueMicrotask(() => setMode(next))
    if (next === 'static') markSceneReady()
  }, [])

  if (mode === '3d') return <Scene />
  if (mode === 'static')
    return (
      <div className="scene-static" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/halftone-light.webp" alt="" className="scene-static__img is-light" width={900} height={900} decoding="async" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/halftone-dark.webp" alt="" className="scene-static__img is-dark" width={900} height={900} decoding="async" />
      </div>
    )
  return null
}
