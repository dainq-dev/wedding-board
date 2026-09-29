import { BackSide, Color, ShaderMaterial, Vector3 } from "three";

// Vòm trời gradient dùng chung cho mẫu 3D: đỉnh ↔ chân trời, quầng mặt trời
// và đĩa mặt trời HDR (>1) để bloom bắt sáng, dither chống banding.
// Cập nhật uniforms uTop / uHorizon / uSun / uSunDir / uNight mỗi frame.

const VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize((modelMatrix * vec4(position, 0.0)).xyz);
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const FRAG = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSun;
uniform vec3 uSunDir;
uniform float uNight;
uniform float uDisc;
uniform float uCurve;
varying vec3 vDir;
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col = mix(uHorizon, uTop, pow(clamp(h + 0.04, 0.0, 1.0), uCurve));
  col = mix(col, uHorizon * 0.82, smoothstep(0.0, -0.35, h));
  float s = max(dot(d, normalize(uSunDir)), 0.0);
  col += uSun * (pow(s, 6.0) * 0.35 + pow(s, 60.0) * 0.6) * (1.0 - uNight * 0.7);
  col += uSun * smoothstep(0.9993, 0.9997, s) * uDisc * (1.0 - uNight);
  col += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}`;

export function createSkyMaterial({
  disc = 3.5,
  curve = 0.32,
}: {
  disc?: number;
  curve?: number;
} = {}) {
  return new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      uTop: { value: new Color() },
      uHorizon: { value: new Color() },
      uSun: { value: new Color() },
      uSunDir: { value: new Vector3(0, 0.2, -1) },
      uNight: { value: 0 },
      uDisc: { value: disc },
      uCurve: { value: curve },
    },
  });
}
