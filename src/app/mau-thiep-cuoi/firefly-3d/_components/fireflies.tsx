"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  type Points,
  Raycaster,
  Vector2,
  Vector3,
} from "three";
import { gsap } from "@/kit/gsap";
import { arrowPoints, textPoints, wanderOffset } from "./formations";
import { along, CLEARING } from "./path";

const vertex = /* glsl */ `
uniform float uTime, uForm, uBurst, uPixelRatio, uSync, uBob, uMax, uCount;
uniform vec3 uPointer, uOrigin;
attribute vec3 aHome, aTarget; attribute float aPhase, aFreq;
varying float vBlink;
void main() {
  float lone = step(float(gl_VertexID), uCount);
  vec3 home = mix(uOrigin, aHome, max(uBurst, lone));
  vec3 off = vec3(sin(uTime*0.7*aFreq + aPhase), sin(uTime*0.9*aFreq + aPhase*1.7)*0.6, cos(uTime*0.5*aFreq + aPhase))*0.8;
  vec3 target = aTarget + vec3(0.0, sin(uTime*2.0)*0.2*uBob, 0.0);
  vec3 p = mix(home + off, target + off*0.1, smoothstep(0.0, 1.0, uForm));
  vec3 d = p - uPointer; float l = max(length(d), 1e-4);
  p += d / l * max(0.0, 1.2 - l) * 0.8;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float visible = max(lone, step(0.001, uBurst));
  gl_PointSize = visible * min(uMax, 60.0 * uPixelRatio / -mv.z);
  float ph = mix(aPhase, 0.0, uSync), fr = mix(aFreq, 1.0, uSync);
  vBlink = 0.4 + 0.6 * pow(0.5 + 0.5 * sin(uTime * fr * 3.0 + ph), 3.0);
}`;
const fragment = /* glsl */ `
uniform vec3 uColor; varying float vBlink;
void main() {
  float r = length(gl_PointCoord - 0.5);
  gl_FragColor = vec4(uColor, vBlink * smoothstep(0.5, 0.0, r));
}`;

type Key = string;
// Chương → đội hình (bảng §4).
function formationKey(p: number): Key {
  if (p < 0.12) return "free";
  if (p < 0.24) return "c3";
  if (p < 0.3) return "m1";
  if (p < 0.36) return "m2";
  if (p < 0.42) return "m3";
  if (p < 0.58) return "guide";
  if (p < 0.77) return "clear";
  if (p < 0.88) return "arrow";
  return "text";
}

export const PHOTO_SPOTS = {
  c3: [along(0.14, 3, -1.6, 2.1), along(0.14, 3, 1.6, 2.1)],
  m1: [along(0.24, 2.6, -1.6, 2)],
  m2: [along(0.3, 2.6, 1.6, 2)],
  m3: [along(0.36, 3, 0, 2.5)],
};
export const ARROW_AT = along(0.88, 5, 0.9, 1.8);
export const TEXT_AT = along(0.92, 8, 0, 2.6);

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const scatter = (w0: number, w1: number, r: number, y0: number, y1: number) =>
  along(rand(w0, w1)).add(
    new Vector3(rand(-r, r), rand(y0, y1), rand(-r / 2, r / 2)),
  );

type Props = {
  count: number;
  mobile: boolean;
  progress: { current: number };
  opened: boolean;
  initials: string;
  font: string;
  onInitials: () => void;
};

export function Fireflies({
  count,
  mobile,
  progress,
  opened,
  initials,
  font,
  onInitials,
}: Props) {
  const ref = useRef<Points>(null);
  const { camera, gl } = useThree();
  const origin = useMemo(() => along(0, 3, 0, 1.2), []);
  const data = useMemo(() => {
    const home = new Float32Array(count * 3);
    for (let i = 0; i < count; i++)
      home.set(scatter(0, 0.18, 5, 0.3, 3.5).toArray(), i * 3);
    return {
      home,
      target: home.slice(),
      phase: Float32Array.from({ length: count }, () => rand(0, Math.PI * 2)),
      freq: Float32Array.from({ length: count }, () => rand(0.6, 1.4)),
    };
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uBurst: { value: 0 },
      uSync: { value: 0 },
      uBob: { value: 0 },
      uCount: { value: 8 },
      uMax: { value: mobile ? 16 : 24 },
      uPixelRatio: { value: Math.min(2, gl.getPixelRatio()) },
      uPointer: { value: new Vector3(0, -99, 0) },
      uOrigin: { value: origin },
      uColor: { value: new Color("#E9F59A") },
    }),
    [mobile, gl, origin],
  );

  // C1: bầy đom đóm bay ra từ nút.
  useEffect(() => {
    if (!opened) return;
    const tw = gsap.to(uniforms.uBurst, {
      value: 1,
      delay: 0.2,
      duration: 1.6,
      ease: "power2.out",
    });
    return () => {
      tw.kill();
    };
  }, [opened, uniforms]);

  // Con trỏ: chiếu lên mặt phẳng cách camera 4 đơn vị. Chạm thì mờ sau 1.5s.
  const pointer = useRef({ ndc: new Vector2(0, 0), at: -1e9, touch: false });
  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.ndc.set(
        (e.clientX / innerWidth) * 2 - 1,
        -(e.clientY / innerHeight) * 2 + 1,
      );
      pointer.current.at = performance.now();
      pointer.current.touch = e.pointerType === "touch";
    };
    addEventListener("pointermove", on);
    addEventListener("pointerdown", on);
    return () => {
      removeEventListener("pointermove", on);
      removeEventListener("pointerdown", on);
    };
  }, []);
  const ray = useMemo(() => new Raycaster(), []);

  const key = useRef<Key>("free");
  const formTween = useRef<gsap.core.Tween | null>(null);

  const reform = (next: Key, t: number) => {
    const geo = ref.current?.geometry;
    if (!geo) return;
    const { home, target, phase, freq } = data;
    const f = uniforms.uForm.value;
    const s = f * f * (3 - 2 * f);
    const burst = uniforms.uBurst.value;
    // Vị trí hiện tại ước lượng (không tính né con trỏ / nhịp đập mũi tên).
    const cur = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const o = wanderOffset(phase[i], freq[i], t);
      for (let k = 0; k < 3; k++) {
        const h =
          origin.getComponent(k) +
          (home[i * 3 + k] - origin.getComponent(k)) *
            Math.max(burst, i <= 8 ? 1 : 0);
        cur[i * 3 + k] =
          (h + o[k]) * (1 - s) + (target[i * 3 + k] + o[k] * 0.1) * s;
      }
    }
    const rebase = (i: number) => {
      const o = wanderOffset(phase[i], freq[i], t);
      for (let k = 0; k < 3; k++) home[i * 3 + k] = cur[i * 3 + k] - o[k];
    };
    const settle = (i: number) => {
      const o = wanderOffset(phase[i], freq[i], t);
      for (let k = 0; k < 3; k++)
        target[i * 3 + k] = cur[i * 3 + k] - o[k] * 0.1;
    };
    uniforms.uBurst.value = 1;
    uniforms.uSync.value = 0;
    uniforms.uBob.value = next === "arrow" ? 1 : 0;

    const free = next === "free" || next === "clear";
    if (free) {
      // Bay tự do: mục tiêu = chỗ đang đứng, uForm 1 → 0 để trôi về tổ mới.
      for (let i = 0; i < count; i++) {
        settle(i);
        const v =
          next === "free"
            ? scatter(0, 0.18, 5, 0.3, 3.5)
            : CLEARING.clone().add(
                new Vector3(rand(-6, 6), rand(0.5, 5), rand(-6, 6)),
              );
        home.set(v.toArray(), i * 3);
      }
    } else {
      for (let i = 0; i < count; i++) rebase(i);
      let pts: Float32Array;
      let n = count;
      if (next === "guide") {
        pts = new Float32Array(count * 3);
        for (let i = 0; i < count; i++)
          pts.set(
            along(
              0.4 + (0.32 * i) / count,
              0,
              rand(-0.3, 0.3),
              rand(0.7, 1.1),
            ).toArray(),
            i * 3,
          );
      } else if (next === "arrow") {
        n = Math.min(count, 120);
        pts = arrowPoints(n).map(
          (v, j) => v * 0.6 + ARROW_AT.getComponent(j % 3),
        );
        for (let i = n; i < count; i++) settle(i);
      } else if (next === "text") {
        const w = mobile ? 4.2 : 7;
        pts = textPoints(
          initials,
          `96px ${font}`,
          count,
          w,
          mobile ? 4 : 3,
        ).map((v, j) => v + TEXT_AT.getComponent(j % 3));
      } else {
        // Vòng elip quanh ảnh treo.
        const spots = PHOTO_SPOTS[next as keyof typeof PHOTO_SPOTS];
        pts = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const c = spots[i % spots.length];
          const a = rand(0, Math.PI * 2);
          const r = rand(0.9, 1.4);
          pts.set(
            [
              c.x + Math.cos(a) * r * 0.9,
              c.y + Math.sin(a) * r * 1.1,
              c.z + rand(-0.4, 0.6),
            ],
            i * 3,
          );
        }
      }
      target.set(pts.subarray(0, n * 3));
    }
    geo.attributes.aHome.needsUpdate = true;
    geo.attributes.aTarget.needsUpdate = true;

    formTween.current?.kill();
    uniforms.uForm.value = free ? 1 : 0;
    formTween.current = gsap.to(uniforms.uForm, {
      value: free ? 0 : 1,
      duration: next === "text" ? 2.5 : 1.4,
      ease: "sine.inOut",
      onComplete:
        next === "text"
          ? () => {
              onInitials();
              // 3 nhịp nhấp nháy đồng bộ rồi lệch pha lại.
              gsap
                .timeline()
                .to(uniforms.uSync, { value: 1, duration: 0.4 })
                .to(uniforms.uSync, { value: 0, duration: 0.8, delay: 6.3 });
            }
          : undefined,
    });
  };

  useEffect(
    () => () => {
      formTween.current?.kill();
    },
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    const next = opened ? formationKey(progress.current) : "free";
    if (next !== key.current && (next !== "text" || font)) {
      key.current = next;
      reform(next, t);
    }
    const pt = pointer.current;
    const age = performance.now() - pt.at;
    if (pt.touch && age > 1500) uniforms.uPointer.value.set(0, -99, 0);
    else {
      ray.setFromCamera(pt.ndc, camera);
      ray.ray.at(4, uniforms.uPointer.value);
    }
  });

  return (
    <points ref={ref} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.home, 3]} />
        <bufferAttribute attach="attributes-aHome" args={[data.home, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[data.target, 3]} />
        <bufferAttribute attach="attributes-aPhase" args={[data.phase, 1]} />
        <bufferAttribute attach="attributes-aFreq" args={[data.freq, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
