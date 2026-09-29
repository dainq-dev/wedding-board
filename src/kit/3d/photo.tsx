"use client";

import {
  type ThreeElements,
  type ThreeEvent,
  useFrame,
} from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import { Color, type Group, ShaderMaterial } from "three";
import { useSafeTexture } from "./use-safe-texture";

// Tấm ảnh cưới trong cảnh 3D (visual-quality §3.4): bo góc, viền giấy, cong nhẹ,
// hiện dần, sáng khi hover, bóng đổ mềm. Ảnh cắt kiểu "cover" đúng tỉ lệ.

const VERT = /* glsl */ `
uniform float uBend;
uniform float uWave;
uniform float uTime;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float x = uv.x * 2.0 - 1.0;
  p.z -= uBend * x * x;
  p.z += sin(uv.y * 3.14159 + uTime * 1.3) * uWave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const FRAG = /* glsl */ `
uniform sampler2D uMap;
uniform float uHasMap;
uniform float uImgAspect;
uniform float uAspect;
uniform float uRadius;
uniform float uMatte;
uniform vec3 uMatteColor;
uniform vec3 uBase;
uniform float uReveal;
uniform float uHover;
uniform float uOpacity;
varying vec2 vUv;

float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 halfSize = vec2(uAspect, 1.0) * 0.5;
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = sdRound(p, halfSize, uRadius);
  float aa = fwidth(d) * 1.2;
  float alpha = 1.0 - smoothstep(-aa, aa, d);

  vec2 innerHalf = halfSize - uMatte;
  float di = sdRound(p, innerHalf, max(uRadius - uMatte * 0.5, 0.0));
  float inPhoto = 1.0 - smoothstep(-aa, aa, di);

  // cover-fit trong vùng ảnh (bên trong viền)
  vec2 uv = p / (innerHalf * 2.0) + 0.5;
  float ia = innerHalf.x / innerHalf.y;
  vec2 s = ia > uImgAspect ? vec2(1.0, uImgAspect / ia) : vec2(ia / uImgAspect, 1.0);
  // hiện dần: zoom 1.12 → 1
  float z = 1.0 - 0.12 * (1.0 - uReveal);
  uv = (uv - 0.5) * s * z + 0.5;

  vec3 img = uHasMap > 0.5 ? texture2D(uMap, clamp(uv, 0.0, 1.0)).rgb : uBase;
  img *= 1.0 + uHover * 0.08;
  vec3 col = mix(uMatteColor, img, inPhoto);

  // quét từ dưới lên theo reveal
  float r = uReveal * 1.15;
  alpha *= 1.0 - smoothstep(r - 0.15, r, vUv.y);
  alpha *= uOpacity;
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}`;

const SHADOW_FRAG = /* glsl */ `
uniform float uAspect;
uniform float uOpacity;
uniform vec3 uColor;
varying vec2 vUv;
float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = sdRound(p, vec2(uAspect, 1.0) * 0.5 - 0.12, 0.06);
  float a = (1.0 - smoothstep(-0.02, 0.12, d)) * uOpacity;
  gl_FragColor = vec4(uColor, a);
  #include <colorspace_fragment>
}`;

type Num = number | RefObject<number>;
const read = (v: Num) => (typeof v === "number" ? v : v.current);

export type Photo3DProps = Omit<ThreeElements["group"], "ref"> & {
  url?: string;
  /** chiều cao theo đơn vị thế giới */
  height?: number;
  /** tỉ lệ khung rộng / cao (mặc định 2:3 — đúng bộ ảnh mẫu) */
  aspect?: number;
  radius?: number;
  matte?: number;
  matteColor?: string;
  baseColor?: string;
  bend?: number;
  wave?: number;
  reveal?: Num;
  opacity?: Num;
  shadow?: number;
  shadowColor?: string;
  maxTex?: number;
  onPick?: () => void;
};

export function Photo3D({
  url,
  height = 1.5,
  aspect = 2 / 3,
  radius = 0.035,
  matte = 0.03,
  matteColor = "#FFFFFF",
  baseColor = "#E9E4DE",
  bend = 0,
  wave = 0,
  reveal = 1,
  opacity = 1,
  shadow = 0.35,
  shadowColor = "#1B1612",
  maxTex = 768,
  onPick,
  ...group
}: Photo3DProps) {
  const tex = useSafeTexture(url, maxTex);
  const g = useRef<Group>(null);
  const hover = useRef({ t: 0, v: 0 });

  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        uniforms: {
          uMap: { value: null },
          uHasMap: { value: 0 },
          uImgAspect: { value: aspect },
          uAspect: { value: aspect },
          uRadius: { value: radius },
          uMatte: { value: matte },
          uMatteColor: { value: new Color(matteColor) },
          uBase: { value: new Color(baseColor) },
          uReveal: { value: 1 },
          uHover: { value: 0 },
          uOpacity: { value: 1 },
          uBend: { value: bend },
          uWave: { value: wave },
          uTime: { value: 0 },
        },
      }),
    [aspect, radius, matte, matteColor, baseColor, bend, wave],
  );
  const shadowMat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: SHADOW_FRAG,
        transparent: true,
        depthWrite: false,
        uniforms: {
          uAspect: { value: aspect },
          uOpacity: { value: shadow },
          uColor: { value: new Color(shadowColor) },
          uBend: { value: bend },
          uWave: { value: wave },
          uTime: { value: 0 },
        },
      }),
    [aspect, shadow, shadowColor, bend, wave],
  );
  useEffect(
    () => () => {
      mat.dispose();
      shadowMat.dispose();
    },
    [mat, shadowMat],
  );

  useEffect(() => {
    mat.uniforms.uMap.value = tex;
    mat.uniforms.uHasMap.value = tex ? 1 : 0;
    const img = tex?.image as { width: number; height: number } | undefined;
    if (img?.width && img.height)
      mat.uniforms.uImgAspect.value = img.width / img.height;
  }, [tex, mat]);

  useFrame(({ clock }, dt) => {
    const h = hover.current;
    h.v += (h.t - h.v) * Math.min(1, dt * 8);
    const u = mat.uniforms;
    u.uTime.value = clock.elapsedTime;
    shadowMat.uniforms.uTime.value = clock.elapsedTime;
    u.uHover.value = h.v;
    const r = read(reveal);
    const o = read(opacity);
    u.uReveal.value = r;
    u.uOpacity.value = o;
    shadowMat.uniforms.uOpacity.value = shadow * r * o;
    if (g.current) g.current.visible = o > 0.002 && r > 0.002;
    // Nâng nhẹ khi hover, như cầm tấm ảnh lên.
    if (g.current) g.current.children[0].position.z = h.v * 0.06;
  });

  const w = height * aspect;
  const pick = onPick
    ? {
        onClick: (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onPick();
        },
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          hover.current.t = 1;
          document.body.style.cursor = "pointer";
        },
        onPointerOut: () => {
          hover.current.t = 0;
          document.body.style.cursor = "";
        },
      }
    : {};

  return (
    <group ref={g} {...group}>
      <mesh material={mat} scale={[w, height, 1]} {...pick}>
        <planeGeometry args={[1, 1, 24, 24]} />
      </mesh>
      {shadow > 0 && (
        <mesh
          material={shadowMat}
          position={[height * 0.03, -height * 0.05, -0.02]}
          scale={[w * 1.18, height * 1.14, 1]}
          renderOrder={-1}
        >
          <planeGeometry args={[1, 1, 12, 12]} />
        </mesh>
      )}
    </group>
  );
}
