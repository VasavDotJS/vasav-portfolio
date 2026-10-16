import { BlendFunction, Effect, EffectAttribute } from 'postprocessing'
import { Color, Uniform, Vector2 } from 'three'
import { halftoneFrag } from '@/shaders/halftone'

export class HalftoneEffect extends Effect {
  constructor() {
    super('HalftoneEffect', halftoneFrag, {
      blendFunction: BlendFunction.SET,
      attributes: EffectAttribute.CONVOLUTION,
      uniforms: new Map<string, Uniform>([
        ['uRes', new Uniform(new Vector2(1, 1))],
        ['uCell', new Uniform(8)],
        ['uMisC', new Uniform(new Vector2(4, -3))],
        ['uMisY', new Uniform(new Vector2(-6, 5))],
        ['uDark', new Uniform(0)],
        ['uDefocus', new Uniform(0)],
        ['uFade', new Uniform(1)],
        ['uInkK', new Uniform(new Color('#0e0e0e'))],
        ['uInkC', new Uniform(new Color('#eb6461'))],
        ['uInkY', new Uniform(new Color('#fce244'))],
      ]),
    })
  }

  u<T>(name: string) {
    return this.uniforms.get(name) as Uniform<T>
  }

  setSize(width: number, height: number) {
    this.u<Vector2>('uRes').value.set(width, height)
  }
}
