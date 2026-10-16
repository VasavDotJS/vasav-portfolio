// Mutable state shared between DOM scroll choreography and the R3F scene.
export type ScenePose = { x: number; y: number; scale: number; defocus: number; fade: number }

export const scenePose: ScenePose = { x: 0.22, y: -0.08, scale: 1, defocus: 0, fade: 1 }

let invalidate: (() => void) | null = null
export const setSceneInvalidate = (fn: (() => void) | null) => {
  invalidate = fn
}
export const requestSceneFrame = () => invalidate?.()

let ready = false
export const isSceneReady = () => ready
export function markSceneReady() {
  if (ready) return
  ready = true
  window.dispatchEvent(new Event('vpr:scene-ready'))
}
