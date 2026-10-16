'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { CapsuleGeometry, Group, MeshStandardMaterial, Quaternion, Vector3, type WebGLProgramParametersWithUniforms } from 'three'
import { hashString, mulberry32, range } from '@/lib/seeded-random'

/** A soft cluster of clay capsules. Wobbles with scroll velocity via a tiny vertex shader patch. */
export function Centerpiece({ velocity }: { velocity: { current: number } }) {
  const group = useRef<Group>(null)
  const uniforms = useRef({ uTime: { value: 0 }, uVel: { value: 0 } })

  const material = useMemo(() => {
    const m = new MeshStandardMaterial({ color: '#d9d4cb', roughness: 0.42, metalness: 0 })
    m.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
      shader.uniforms.uTime = uniforms.current.uTime
      shader.uniforms.uVel = uniforms.current.uVel
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;\nuniform float uVel;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          float w = sin(position.y * 4.0 + uTime * 1.7) * sin(position.x * 3.0 - uTime * 1.3);
          transformed += normal * w * (0.025 + uVel * 0.12);`,
        )
    }
    return m
  }, [])

  const geometry = useMemo(() => new CapsuleGeometry(0.3, 0.95, 10, 28), [])

  const pills = useMemo(() => {
    const rng = mulberry32(hashString('capsules'))
    const up = new Vector3(0, 1, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const theta = (i / 7) * Math.PI * 2 + range(rng, -0.3, 0.3)
      const phi = range(rng, 0.6, 2.5)
      const dir = new Vector3(Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta))
      const pos = dir.clone().multiplyScalar(range(rng, 0.38, 0.6))
      const axis = dir.clone().add(new Vector3(range(rng, -0.6, 0.6), range(rng, -0.6, 0.6), range(rng, -0.6, 0.6))).normalize()
      const q = new Quaternion().setFromUnitVectors(up, axis)
      return { pos, q, s: range(rng, 0.8, 1.15) }
    })
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const u = uniforms.current
    u.uTime.value = state.clock.elapsedTime
    u.uVel.value += (Math.min(Math.abs(velocity.current) / 40, 1) - u.uVel.value) * 0.1
    g.rotation.y += delta * 0.18
    g.rotation.x = Math.sin(state.clock.elapsedTime * 0.21) * 0.25
  })

  return (
    <group ref={group}>
      {pills.map((p, i) => (
        <mesh key={i} geometry={geometry} material={material} position={p.pos} quaternion={p.q} scale={p.s} />
      ))}
    </group>
  )
}
