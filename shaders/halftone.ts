// Riso halftone + misregistration. Reads the rendered scene (rgb shading, alpha = object mask)
// and prints it as dot screens:
//   paper (light): yellow silhouette offset behind, coral dots on lit faces (15°), black key dots (45°)
//   OLED  (dark):  emissive coral dots on lit faces (45°), fine yellow dots on highlights (75°), #000 elsewhere
export const halftoneFrag = /* glsl */ `
uniform vec2 uRes;
uniform float uCell;
uniform vec2 uMisC;
uniform vec2 uMisY;
uniform float uDark;
uniform float uDefocus;
uniform float uFade;
uniform vec3 uInkK;
uniform vec3 uInkC;
uniform vec3 uInkY;

mat2 rot(float a) { float s = sin(a), c = cos(a); return mat2(c, -s, s, c); }

vec4 samp(vec2 px) { return texture2D(inputBuffer, clamp(px / uRes, 0.0, 1.0)); }

// (luminance, coverage) at a point; averaged when defocused
vec2 value(vec2 px) {
  vec4 t = samp(px);
  if (uDefocus > 0.01) {
    float r = uCell * 1.6 * uDefocus;
    t += samp(px + vec2(r, 0.0)) + samp(px - vec2(r, 0.0)) + samp(px + vec2(0.0, r)) + samp(px - vec2(0.0, r));
    t /= 5.0;
  }
  float a = t.a;
  float lum = a > 0.002 ? dot(t.rgb / a, vec3(0.299, 0.587, 0.114)) : 1.0;
  return vec2(clamp(lum, 0.0, 1.0), a);
}

vec2 cellCenter(vec2 px, float ang, float cell) {
  vec2 p = rot(ang) * px;
  vec2 c = (floor(p / cell) + 0.5) * cell;
  return rot(-ang) * c;
}

float dotMask(vec2 px, float ang, float cell, float coverage) {
  vec2 p = rot(ang) * px;
  vec2 local = mod(p, cell) - 0.5 * cell;
  float radius = sqrt(clamp(coverage, 0.0, 1.0)) * cell * 0.64;
  float soft = mix(0.7, cell * 0.42, uDefocus);
  // no ink at zero coverage (otherwise AA leaves a half-pixel speck in every cell)
  return (1.0 - smoothstep(radius - soft, radius + soft, length(local))) * smoothstep(0.0, 0.04, coverage);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 px = uv * uRes;
  float cell = uCell * (1.0 + uDefocus * 1.4);
  const float aK = 0.7853982;
  const float aC = 0.2617994;
  const float aY = 1.3089969;

  if (uDark < 0.5) {
    vec2 vK = value(cellCenter(px, aK, cell));
    vec2 pxC = px - uMisC;
    vec2 vC = value(cellCenter(pxC, aC, cell));
    vec2 pxY = px - uMisY;
    float maskY = value(pxY).y;

    float covK = vK.y * pow(1.0 - vK.x, 1.5) * 1.1;
    float covC = vC.y * (0.22 + 0.6 * smoothstep(0.25, 0.9, vC.x));
    float covY = smoothstep(0.35, 0.65, maskY) * 0.94;

    float k = dotMask(px, aK, cell, covK);
    float c = dotMask(pxC, aC, cell, covC);

    vec3 col = vec3(1.0);
    col *= mix(vec3(1.0), uInkY, covY * uFade);
    col *= mix(vec3(1.0), uInkC, c * uFade);
    col *= mix(vec3(1.0), uInkK, k * uFade);
    outputColor = vec4(col, 1.0);
  } else {
    vec2 vK = value(cellCenter(px, aK, cell));
    vec2 pxY = px - uMisY;
    float cellY = cell * 0.7;
    vec2 vY = value(cellCenter(pxY, aY, cellY));

    float covC = vK.y * pow(vK.x, 1.25) * 0.95;
    float covY = vY.y * smoothstep(0.55, 1.0, vY.x) * 0.85;

    float c = dotMask(px, aK, cell, covC);
    float y = dotMask(pxY, aY, cellY, covY);
    vec3 col = uInkC * c * (1.0 - y * 0.6) + uInkY * y;
    outputColor = vec4(min(col, vec3(1.0)) * uFade, 1.0);
  }
}
`
