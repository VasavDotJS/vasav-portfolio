'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { markSceneReady, markSceneRequested } from '@/lib/scene-state'

// three.js + R3F live in their own chunk, requested as soon as the page hydrates
// (i.e. while the loader is running). The loader listens for 'vpr:scene-ready'.
const Scene = dynamic(() => import('./Scene'), { ssr: false })

/** WebGL with a real GPU. Software rasterizers (SwiftShader, llvmpipe) get the static print. */
function canWebGL() {
  try {
    const c = document.createElement('canvas')
    const gl = (c.getContext('webgl2') ?? c.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software|softpipe/i.test(renderer)
  } catch {
    return false
  }
}

export function SceneMount() {
  const home = usePathname() === '/'
  const [mode, setMode] = useState<'pending' | '3d' | 'static'>('pending')

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const q = new URLSearchParams(location.search)
    const next = q.has('force3d') || (!reduced && !q.has('no3d') && canWebGL()) ? '3d' : 'static'
    // decided after mount so SSR markup never depends on the device
    queueMicrotask(() => setMode(next))
    document.documentElement.dataset.scene = next
    if (next === 'static') markSceneReady()
    else markSceneRequested()
  }, [])

  if (!home) return null
  if (mode === '3d')
    return (
      <Scene
        onFallback={() => {
          document.documentElement.dataset.scene = 'static'
          setMode('static')
        }}
      />
    )
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
