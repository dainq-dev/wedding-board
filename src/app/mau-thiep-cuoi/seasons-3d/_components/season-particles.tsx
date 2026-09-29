"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo } from "react";
import { BufferAttribute, BufferGeometry } from "three";
import { range } from "@/kit/3d/keyframes";
import { seasonAt } from "./season";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uSeason;
uniform float uDensity;
attribute vec4 aSeed;
varying vec3 vColor;
varying float vAlpha;

float w(float i) { return max(0.0, 1.0 - abs(uSeason - i)); }

void main() {
  vec3 b = aSeed.xyz;
  float s = aSeed.w;
  float t = uTime;
  // Xuân: cánh hoa rơi chậm, lượn ngang.
  vec3 sp = vec3(b.x + sin(t * 1.3 + s * 6.28) * 0.6, mod(b.y - t * 0.4, 10.0), b.z);
  // Hạ: đom đóm lơ lửng quanh tán.
  vec3 su = vec3(b.x * 0.5 + sin(t * 0.7 + s * 9.0) * 0.4, 3.5 + b.y * 0.35 + sin(t + s * 20.0) * 0.5, b.z * 0.5 + cos(t * 0.6 + s * 7.0) * 0.4);
  // Thu: lá rơi nhanh, gió thổi ngang, quấn trong bán kính 12.
  vec3 au = vec3(mod(b.x + t * 0.8 + 12.0, 24.0) - 12.0, mod(b.y - t * 0.8, 10.0), b.z + sin(t * 2.0 + s * 5.0) * 0.3);
  // Đông: tuyết rơi thẳng rất chậm.
  vec3 wi = vec3(b.x, mod(b.y - t * 0.2, 10.0), b.z);
  float w0 = w(0.0) + w(4.0), w1 = w(1.0), w2 = w(2.0), w3 = w(3.0);
  vec3 pos = sp * w0 + su * w1 + au * w2 + wi * w3;
  vColor = vec3(0.976, 0.659, 0.831) * w0 + vec3(0.996, 0.941, 0.541) * w1
         + vec3(0.976, 0.451, 0.086) * w2 + vec3(1.0) * w3;
  vAlpha = step(s, uDensity);
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float size = 7.0 * w0 + 4.0 * w1 + 8.0 * w2 + 3.5 * w3;
  gl_PointSize = size * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

const fragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5 || vAlpha < 0.5) discard;
  gl_FragColor = vec4(vColor, smoothstep(0.5, 0.2, d));
}`;

// Hệ hạt duy nhất; CPU chỉ cập nhật uniform mỗi frame.
export function SeasonParticles({
  count,
  progress,
  intro,
}: {
  count: number;
  progress: RefObject<number>;
  intro: RefObject<number>;
}) {
  const geo = useMemo(() => {
    const a = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random()) * 12;
      a.set(
        [
          Math.sin(ang) * r,
          Math.random() * 10,
          Math.cos(ang) * r,
          Math.random(),
        ],
        i * 4,
      );
    }
    const g = new BufferGeometry();
    g.setAttribute("aSeed", new BufferAttribute(a, 4));
    // Vị trí thật tính trong shader; `position` chỉ để three biết số đỉnh.
    g.setAttribute(
      "position",
      new BufferAttribute(new Float32Array(count * 3), 3),
    );
    return g;
  }, [count]);
  useEffect(() => () => geo.dispose(), [geo]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uSeason: { value: 0 },
      uDensity: { value: 0 },
    }),
    [],
  );

  useFrame((_, dt) => {
    const p = progress.current;
    uniforms.uTime.value += dt;
    uniforms.uSeason.value = seasonAt(p);
    // Mật độ: 0 → 2/3 khi mở thiệp, ×1.5 ở đoạn nở rộ cuối.
    uniforms.uDensity.value = intro.current * (0.66 + 0.34 * range(p, 0.9, 1));
  });

  return (
    <points geometry={geo} frustumCulled={false}>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
