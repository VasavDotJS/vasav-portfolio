// Mutable state shared between DOM scroll choreography and the R3F scene.
export type ScenePose = { x: number; y: number; scale: number; defocus: number; fade: number }

export const scenePose: ScenePose = { x: 0.22, y: -0.08, scale: 1, defocus: 0, fade: 1 }

let invalidate: (() => void) | null = null
export const setSceneInvalidate = (fn: (() => void) | null) => {
  invalidate = fn
}
export const requestSceneFrame = () => invalidate?.()

// Loading milestones the loader reads (polled, so event ordering never matters).
export const sceneMilestones = { requested: false, chunk: false, ready: false }

export const isSceneReady = () => sceneMilestones.ready
export function markSceneRequested() {
  sceneMilestones.requested = true
}
export function markSceneChunk() {
  sceneMilestones.chunk = true
}
export function markSceneReady() {
  if (sceneMilestones.ready) return
  sceneMilestones.requested = sceneMilestones.chunk = sceneMilestones.ready = true
  window.dispatchEvent(new Event('vpr:scene-ready'))
}
