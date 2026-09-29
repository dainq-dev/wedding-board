"use client";

import { Hud, OrthographicCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  createContext,
  use,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import { Color, type Mesh, ShaderMaterial } from "three";
import { useSafeTexture } from "./use-safe-texture";

/*
 * Ảnh cưới "DOM-synced WebGL" (kỹ thuật của các site WebGL hiện đại):
 * - Bố cục ảnh viết bằng HTML/CSS (<PhotoSlot>) → responsive, dễ thiết kế nhịp.
 * - <PhotoLayer> (trong Canvas) vẽ mỗi ảnh đè đúng lên slot của nó bằng shader:
 *   bo góc, viền, hiện dần khi vào màn, uốn theo tốc độ cuộn, parallax trong khung, hover.
 * - Vẽ ở HUD sau hậu kỳ → ảnh không bị bloom / tone map, giữ đúng màu.
 * - Không WebGL / reduced-motion: layer không mount → <img> thật trong slot hiện ra.
 */

type Slot = {
  el: HTMLElement;
  url: string;
  radius: number;
  matte: number;
  matteColor: string;
};

class Registry {
  slots = new Map<string, Slot>();
  active = false;
  private version = 0;
  private listeners = new Set<() => void>();
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };
  getVersion = () => this.version;
  private emit() {
    this.version++;
    for (const fn of this.listeners) fn();
  }
  set(id: string, s: Slot) {
    this.slots.set(id, s);
    this.emit();
  }
  delete(id: string) {
    this.slots.delete(id);
    this.emit();
  }
  setActive(v: boolean) {
    this.active = v;
    this.emit();
  }
}

const SlotsContext = createContext<Registry | null>(null);

export function PhotoSlotsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reg = useMemo(() => new Registry(), []);
  return <SlotsContext value={reg}>{children}</SlotsContext>;
}

function useRegistryVersion(reg: Registry | null) {
  return useSyncExternalStore(
    reg?.subscribe ?? (() => () => {}),
    reg?.getVersion ?? (() => 0),
    () => 0,
  );
}

/** Ô ảnh trong HTML. Khi WebGL chạy, <img> ẩn đi và ảnh được vẽ bằng shader đè lên. */
export function PhotoSlot({
  url,
  alt,
  className = "",
  radius = 18,
  matte = 0,
  matteColor = "#FFFFFF",
  onClick,
}: {
  url: string;
  alt: string;
  className?: string;
  /** bo góc (px) */
  radius?: number;
  /** viền giấy (px) */
  matte?: number;
  matteColor?: string;
  onClick?: () => void;
}) {
  const reg = use(SlotsContext);
  useRegistryVersion(reg);
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (!reg || !ref.current) return;
    reg.set(id, { el: ref.current, url, radius, matte, matteColor });
    return () => reg.delete(id);
  }, [reg, id, url, radius, matte, matteColor]);

  const gl = reg?.active ?? false;
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`Xem lớn: ${alt}`}
      className={`group relative block cursor-zoom-in overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current ${className}`}
      style={{ borderRadius: radius }}
    >
      {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
      <img
        src={url}
        alt={alt}
        loading="lazy"
        draggable={false}
        className={`size-full object-cover transition-opacity duration-300 ${gl ? "opacity-0" : ""}`}
        style={matte ? { border: `${matte}px solid ${matteColor}` } : undefined}
      />
    </button>
  );
}

const VERT = /* glsl */ `
uniform float uSkew;
varying vec2 vUv;
void main() {
  vUv = uv;
  vec3 p = position;
  float x = uv.x * 2.0 - 1.0;
  p.y += uSkew * (1.0 - x * x);
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
uniform float uParallax;
varying vec2 vUv;

float sdRound(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 halfSize = vec2(uAspect, 1.0) * 0.5;
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);
  float d = sdRound(p, halfSize, uRadius);
  float aa = fwidth(d) * 1.1;
  float alpha = 1.0 - smoothstep(-aa, aa, d);

  vec2 innerHalf = halfSize - uMatte;
  float di = sdRound(p, innerHalf, max(uRadius - uMatte, 0.0));
  float inPhoto = 1.0 - smoothstep(-aa, aa, di);

  vec2 uv = p / (innerHalf * 2.0) + 0.5;
  float ia = innerHalf.x / innerHalf.y;
  vec2 s = ia > uImgAspect ? vec2(1.0, uImgAspect / ia) : vec2(ia / uImgAspect, 1.0);
  // Zoom dư 8% để parallax trong khung; hiện dần: 1.18 → 1.08, hover: 1.04
  float z = 0.92 - 0.1 * (1.0 - uReveal) - 0.04 * uHover;
  uv = (uv - 0.5) * s * z + 0.5;
  uv.y += uParallax * 0.04;

  vec3 img = uHasMap > 0.5 ? texture2D(uMap, clamp(uv, 0.0, 1.0)).rgb : uBase;
  vec3 col = mix(uMatteColor, img, inPhoto);

  // Màn che mở từ dưới lên, mép mềm.
  float r = uReveal * 1.2;
  alpha *= 1.0 - smoothstep(r - 0.2, r, 1.0 - vUv.y);
  if (alpha < 0.004) discard;
  gl_FragColor = vec4(col, alpha);
  #include <colorspace_fragment>
}`;

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

function SlotMesh({
  slot,
  vel,
  baseColor,
}: {
  slot: Slot;
  vel: { current: number };
  baseColor: string;
}) {
  const tex = useSafeTexture(slot.url, 900);
  const mesh = useRef<Mesh>(null);
  const hover = useRef(0);
  const size = useThree((s) => s.size);
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthTest: false,
        uniforms: {
          uMap: { value: null },
          uHasMap: { value: 0 },
          uImgAspect: { value: 2 / 3 },
          uAspect: { value: 2 / 3 },
          uRadius: { value: 0 },
          uMatte: { value: 0 },
          uMatteColor: { value: new Color(slot.matteColor) },
          uBase: { value: new Color(baseColor) },
          uReveal: { value: 0 },
          uHover: { value: 0 },
          uParallax: { value: 0 },
          uSkew: { value: 0 },
        },
      }),
    [slot.matteColor, baseColor],
  );
  useEffect(() => () => mat.dispose(), [mat]);
  useEffect(() => {
    mat.uniforms.uMap.value = tex;
    mat.uniforms.uHasMap.value = tex ? 1 : 0;
    const img = tex?.image as { width: number; height: number } | undefined;
    if (img?.width && img.height)
      mat.uniforms.uImgAspect.value = img.width / img.height;
  }, [tex, mat]);

  useFrame((_, dt) => {
    const m = mesh.current;
    if (!m) return;
    const r = slot.el.getBoundingClientRect();
    const vh = size.height;
    const on = r.bottom > -vh * 0.5 && r.top < vh * 1.5 && r.width > 0;
    m.visible = on;
    if (!on) return;
    m.position.set(
      r.left + r.width / 2 - size.width / 2,
      vh / 2 - (r.top + r.height / 2),
      0,
    );
    m.scale.set(r.width, r.height, 1);
    const u = mat.uniforms;
    u.uAspect.value = r.width / r.height;
    u.uRadius.value = slot.radius / r.height;
    u.uMatte.value = slot.matte / r.height;
    u.uReveal.value = smooth(clamp01((vh * 1.02 - r.top) / (vh * 0.55)));
    u.uParallax.value = Math.max(
      -1,
      Math.min(1, (r.top + r.height / 2 - vh / 2) / vh),
    );
    const want = slot.el.matches(":hover") ? 1 : 0;
    hover.current += (want - hover.current) * Math.min(1, dt * 7);
    u.uHover.value = hover.current;
    u.uSkew.value = Math.max(-0.07, Math.min(0.07, (vel.current * 0.02) / 60));
  });

  return (
    <mesh ref={mesh} material={mat} visible={false}>
      <planeGeometry args={[1, 1, 16, 16]} />
    </mesh>
  );
}

/** Đặt trong <Canvas>. Vẽ mọi <PhotoSlot> đã đăng ký, sau hậu kỳ (HUD). */
export function PhotoLayer({
  baseColor = "#E8E2DA",
  renderPriority = 3,
}: {
  baseColor?: string;
  renderPriority?: number;
}) {
  const reg = use(SlotsContext);
  useRegistryVersion(reg);
  const vel = useRef(0);
  const last = useRef<number | null>(null);

  useEffect(() => {
    reg?.setActive(true);
    return () => reg?.setActive(false);
  }, [reg]);

  useFrame((_, dt) => {
    const y = window.scrollY;
    const d =
      last.current === null ? 0 : (y - last.current) / Math.max(dt, 1e-3);
    last.current = y;
    // px/s, làm mượt để ảnh uốn theo quán tính chứ không giật.
    vel.current += (d / 60 - vel.current) * Math.min(1, dt * 6);
  });

  if (!reg) return null;
  return (
    <Hud renderPriority={renderPriority}>
      <OrthographicCamera
        makeDefault
        position={[0, 0, 100]}
        near={0.1}
        far={1000}
      />
      {[...reg.slots].map(([id, slot]) => (
        <SlotMesh key={id} slot={slot} vel={vel} baseColor={baseColor} />
      ))}
    </Hud>
  );
}
