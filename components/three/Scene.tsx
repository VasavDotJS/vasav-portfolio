'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { EffectComposer } from '@react-three/postprocessing'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Color, DirectionalLight, Group, UnsignedByteType, Vector2 } from 'three'
import { getLight, subscribeLight } from '@/lib/light-store'
import { markSceneReady, scenePose, setSceneInvalidate, type ScenePose } from '@/lib/scene-state'
import { getLenis } from '@/lib/scroll'
import { getTheme, subscribeTheme } from '@/lib/theme-store'
import { Centerpiece } from './Centerpiece'
import { HalftoneEffect } from './HalftoneEffect'

const INKS = {
  light: { k: '#0e0e0e', c: '#eb6461', y: '#fce244' },
  dark: { k: '#000000', c: '#f07a70', y: '#ffe14a' },
}

const HERO_DESKTOP: Partial<ScenePose> = { x: 0.34, y: 0.1, scale: 1.2 }
const HERO_MOBILE: Partial<ScenePose> = { x: 0.05, y: 0.42, scale: 1 }

/** Where the object sits as each section takes over. x/y in -1..1 of the viewport. */
function poses(mobile: boolean): [string, Partial<ScenePose>][] {
  return mobile
    ? [
        ['#index', { x: 0.55, y: 0.45, scale: 0.45 }],
        ['#work', { x: 0.6, y: 0.62, scale: 0.3 }],
        ['#desktop', { x: 0, y: 0, scale: 1.1, defocus: 1 }],
        ['#stack', { x: -0.4, y: 0.55, scale: 0.4, defocus: 0 }],
        ['#contact', { fade: 0, scale: 0.2 }],
      ]
    : [
        ['#index', { x: 0.64, y: 0.12, scale: 0.6 }],
        ['#work', { x: 0.78, y: 0.55, scale: 0.32 }],
        ['#desktop', { x: 0, y: 0, scale: 1.45, defocus: 1 }],
        ['#stack', { x: -0.68, y: 0.35, scale: 0.55, defocus: 0 }],
        ['#contact', { fade: 0, scale: 0.3 }],
      ]
}

function Rig({ effect, cellBase }: { effect: HalftoneEffect; cellBase: number }) {
  const { invalidate, gl, size, viewport, camera } = useThree()
  const group = useRef<Group>(null)
  const light = useRef<DirectionalLight>(null)
  const velocity = useRef(0)
  const frames = useRef(0)

  // theme → uniforms, same frame as the CSS swap
  useEffect(() => {
    const apply = () => {
      const t = getTheme()
      const ink = INKS[t]
      effect.u<number>('uDark').value = t === 'dark' ? 1 : 0
      effect.u<Color>('uInkK').value.set(ink.k)
      effect.u<Color>('uInkC').value.set(ink.c)
      effect.u<Color>('uInkY').value.set(ink.y)
      invalidate()
    }
    apply()
    return subscribeTheme(apply)
  }, [effect, invalidate])

  // render drivers: idle 30fps while visible, scroll, light
  useEffect(() => {
    setSceneInvalidate(invalidate)
    const id = window.setInterval(() => {
      if (!document.hidden && scenePose.fade > 0.01) invalidate()
    }, 1000 / 30)
    const offLight = subscribeLight(invalidate)
    const lenis = getLenis()
    const onScroll = () => {
      velocity.current = lenis?.velocity ?? 0
      invalidate()
    }
    lenis?.on('scroll', onScroll)
    const onNative = () => invalidate()
    if (!lenis) window.addEventListener('scroll', onNative, { passive: true })
    return () => {
      window.clearInterval(id)
      offLight()
      lenis?.off('scroll', onScroll)
      window.removeEventListener('scroll', onNative)
      setSceneInvalidate(null)
    }
  }, [invalidate])

  // scroll choreography (y is down-positive, like CSS)
  useEffect(() => {
    const mobile = size.width < 768
    Object.assign(scenePose, mobile ? HERO_MOBILE : HERO_DESKTOP)
    // ?capture centres the object, used to render the static fallback images
    if (new URLSearchParams(location.search).has('capture')) {
      Object.assign(scenePose, { x: 0, y: 0, scale: 1.25 })
      return
    }
    const ctx = gsap.context(() => {
      for (const [sel, pose] of poses(mobile)) {
        const el = document.querySelector(sel)
        if (!el) continue
        gsap.to(scenePose, {
          ...pose,
          ease: 'none',
          immediateRender: false,
          onUpdate: invalidate,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 20%', scrub: 0.8 },
        })
      }
    })
    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [size.width, invalidate])

  const res = useMemo(() => new Vector2(), [])
  useFrame(() => {
    const g = group.current
    if (!g) return
    const halfH = Math.tan(((camera as unknown as { fov: number }).fov * Math.PI) / 360) * 6
    const halfW = halfH * (size.width / size.height)
    const fit = Math.min(1, (size.width / size.height) * 1.45)
    g.position.set(scenePose.x * halfW, -scenePose.y * halfH, 0)
    g.scale.setScalar(0.85 * scenePose.scale * fit)

    const l = getLight()
    light.current?.position.set(l.x * 5, -l.y * 5 + 1.5, 4)

    gl.getDrawingBufferSize(res)
    effect.setSize(res.x, res.y)
    const dpr = viewport.dpr
    effect.u<number>('uCell').value = cellBase * dpr
    effect.u<number>('uDefocus').value = scenePose.defocus
    effect.u<number>('uFade').value = scenePose.fade
    const mis = 3 + Math.min(Math.abs(velocity.current) * 0.35, 6)
    effect.u<Vector2>('uMisC').value.set(mis * 1.1 * dpr, -mis * 0.6 * dpr)
    effect.u<Vector2>('uMisY').value.set(-mis * 2.2 * dpr, mis * 1.7 * dpr)
    velocity.current *= 0.9

    if (++frames.current === 2) markSceneReady()
  })

  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight ref={light} intensity={2.2} position={[-2, 3, 4]} />
      <directionalLight intensity={0.7} position={[3, -2, -3]} />
      <group ref={group}>
        <Centerpiece velocity={velocity} />
      </group>
    </>
  )
}

export default function Scene() {
  const effect = useMemo(() => new HalftoneEffect(), [])
  const [dpr, setDpr] = useState(() => Math.min(typeof window === 'undefined' ? 1 : window.devicePixelRatio, 1.75))
  const [cellBase, setCellBase] = useState(7)

  return (
    <Canvas
      className="scene-canvas"
      frameloop="demand"
      dpr={dpr}
      flat
      camera={{ fov: 30, position: [0, 0, 6], near: 0.1, far: 50 }}
      gl={{ antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}
      aria-hidden
    >
      <PerformanceMonitor
        bounds={() => [18, 26]}
        onDecline={() => {
          setDpr(1)
          setCellBase(9)
        }}
      />
      <Rig effect={effect} cellBase={cellBase} />
      <EffectComposer multisampling={0} frameBufferType={UnsignedByteType} enableNormalPass={false}>
        <primitive object={effect} dispose={null} />
      </EffectComposer>
    </Canvas>
  )
}
