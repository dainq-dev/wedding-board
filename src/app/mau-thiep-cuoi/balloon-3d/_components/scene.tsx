"use client";

import { Cloud, Clouds, Line, Stars } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  CanvasTexture,
  Color,
  DataTexture,
  DoubleSide,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  LatheGeometry,
  type Mesh,
  MeshLambertMaterial,
  NearestFilter,
  Object3D,
  type PointLight,
  type Points,
  RedFormat,
  type Sprite,
  Vector2,
  Vector3,
} from "three";
import { range } from "@/kit/3d/keyframes";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { useSafeTexture } from "@/kit/3d/use-safe-texture";
import { FLIGHT_KFS, sampleFlight, skyColors } from "./flight";

export type Fx = { burst: number; intro: number; opened: boolean };
export type SceneProps = {
  progress: RefObject<number>;
  fx: RefObject<Fx>;
  images: string[];
  onPick: (index: number) => void;
  fallback: React.ReactNode;
};

const CORAL = "#EF6F6C";
const SKYBLUE = "#3D84A8";

// Mount/unmount theo dải progress: chỉ setState khi đổi trạng thái.
function useBand(progress: RefObject<number>, a: number, b: number) {
  const [on, setOn] = useState(false);
  useFrame(() => {
    const p = progress.current;
    const next = p >= a && p <= b;
    if (next !== on) setOn(next);
  });
  return on;
}

// Toon 3 bậc.
function useToonMap() {
  const t = useMemo(() => {
    const d = new DataTexture(new Uint8Array([90, 170, 255]), 3, 1, RedFormat);
    d.minFilter = d.magFilter = NearestFilter;
    d.needsUpdate = true;
    return d;
  }, []);
  useEffect(() => () => t.dispose(), [t]);
  return t;
}

// Chấm sáng tròn (mây drei, mặt trời) — sinh bằng canvas, không gọi CDN.
function useGlowTexture() {
  const t = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    if (g) {
      const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      r.addColorStop(0, "rgba(255,255,255,1)");
      r.addColorStop(0.5, "rgba(255,255,255,0.6)");
      r.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = r;
      g.fillRect(0, 0, 128, 128);
    }
    return { tex: new CanvasTexture(c), url: c.toDataURL() };
  }, []);
  useEffect(() => () => t.tex.dispose(), [t]);
  return t;
}

// Vỏ giọt nước: Lathe 16 điểm × 24 phân đoạn, sọc coral/trắng/sky bằng vertex color.
function useEnvelope() {
  const geo = useMemo(() => {
    const pts: Vector2[] = [];
    for (let i = 0; i < 16; i++) {
      const t = i / 15; // 0 = đáy (miệng), 1 = đỉnh
      const a = t * Math.PI;
      const r =
        0.35 + Math.sin(a) * 1.6 * (0.6 + 0.4 * t) + (t > 0.95 ? -0.3 : 0);
      pts.push(new Vector2(Math.max(0.01, i === 15 ? 0.01 : r), t * 3.6));
    }
    const g = new LatheGeometry(pts, 24);
    const cols = [new Color(CORAL), new Color("#FFFFFF"), new Color(SKYBLUE)];
    const arr: number[] = [];
    const n = g.attributes.position.count;
    for (let v = 0; v < n; v++) {
      const c = cols[Math.floor(v / 16) % 3];
      arr.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new Float32BufferAttribute(arr, 3));
    return g;
  }, []);
  useEffect(() => () => geo.dispose(), [geo]);
  return geo;
}

const ROPES: [number, number][] = [
  [0.45, 0.45],
  [-0.45, 0.45],
  [0.45, -0.45],
  [-0.45, -0.45],
];

function Balloon({
  geo,
  toon,
  flame,
  light,
  onFlame,
}: {
  geo: LatheGeometry;
  toon: DataTexture;
  flame?: RefObject<Mesh | null>;
  light?: RefObject<PointLight | null>;
  onFlame?: () => void;
}) {
  return (
    <group>
      <mesh geometry={geo} position-y={1.6}>
        <meshToonMaterial vertexColors gradientMap={toon} />
      </mesh>
      <mesh position-y={0.25}>
        <boxGeometry args={[1, 0.6, 1]} />
        <meshToonMaterial color="#9A6A45" gradientMap={toon} />
      </mesh>
      {ROPES.map(([x, z]) => (
        <Line
          key={`${x}${z}`}
          points={[
            [x, 0.55, z],
            [x * 0.9, 1.75, z * 0.9],
          ]}
          color="#6B4A33"
          lineWidth={1}
        />
      ))}
      {flame && (
        // biome-ignore lint/a11y/noStaticElementInteractions: mesh three.js, không phải DOM
        <mesh ref={flame} position-y={1.1} onClick={onFlame}>
          <coneGeometry args={[0.18, 0.6, 12]} />
          <meshBasicMaterial
            color="#FFB347"
            blending={AdditiveBlending}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
      {light && (
        <pointLight
          ref={light}
          position-y={1.3}
          color="#FF9A3C"
          intensity={4}
        />
      )}
    </group>
  );
}

function Sky({ progress }: { progress: RefObject<number> }) {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({ uTop: { value: new Color() }, uHorizon: { value: new Color() } }),
    [],
  );
  const cols = useMemo(() => ({ top: new Color(), horizon: new Color() }), []);
  useFrame(({ camera }) => {
    skyColors(progress.current, cols);
    uniforms.uTop.value.copy(cols.top);
    uniforms.uHorizon.value.copy(cols.horizon);
    mesh.current?.position.copy(camera.position);
  });
  return (
    <mesh ref={mesh} renderOrder={-1}>
      <sphereGeometry args={[500, 32, 16]} />
      <shaderMaterial
        side={BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader="varying vec3 vN; void main(){ vN = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }"
        fragmentShader="uniform vec3 uTop; uniform vec3 uHorizon; varying vec3 vN; void main(){ gl_FragColor = vec4(mix(uHorizon, uTop, clamp(vN.y*1.5+0.2,0.,1.)),1.); }"
      />
    </mesh>
  );
}

// Seed ngẫu nhiên cố định cho thành phố.
const rand = (s: number) => () => {
  s = (s * 16807) % 2147483647;
  return s / 2147483647;
};
const PASTEL = [
  "#F9D5C4",
  "#FCE7B2",
  "#CDE8D6",
  "#D6E4F5",
  "#F4C9D6",
  "#FFFFFF",
];

function City({ count, toon }: { count: number; toon: DataTexture }) {
  const ref = useRef<InstancedMesh>(null);
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = rand(42);
    const o = new Object3D();
    const c = new Color();
    for (let i = 0; i < count; i++) {
      let x = 0;
      let z = 0;
      while (Math.abs(x) < 6 && Math.abs(z) < 6) {
        x = (r() - 0.5) * 190;
        z = (r() - 0.5) * 190;
      }
      const h = 4 + r() * 22;
      o.position.set(x, -30 + h / 2, z);
      o.scale.set(3 + r() * 4, h, 3 + r() * 4);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
      m.setColorAt(i, c.set(PASTEL[Math.floor(r() * PASTEL.length)]));
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [count]);
  return (
    <group>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <boxGeometry />
        <meshToonMaterial gradientMap={toon} />
      </instancedMesh>
      {/* Sân thượng xuất phát */}
      <mesh position-y={-15}>
        <boxGeometry args={[8, 30, 8]} />
        <meshToonMaterial color="#E8D9C5" gradientMap={toon} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={-30}>
        <planeGeometry args={[200, 200]} />
        <meshToonMaterial color="#BFD9A8" gradientMap={toon} />
      </mesh>
    </group>
  );
}

function CloudLayer({ mobile, url }: { mobile: boolean; url: string }) {
  const n = mobile ? 7 : 14;
  const seg = mobile ? 10 : 20;
  const items = useMemo(() => {
    const r = rand(7);
    return Array.from({ length: n }, (_, i) => ({
      key: i,
      pos: [(r() - 0.5) * 60, 120 + r() * 80, (r() - 0.5) * 40 - 5] as const,
      seed: i + 1,
    }));
  }, [n]);
  return (
    <Clouds material={MeshLambertMaterial} texture={url} limit={400}>
      {items.map((c) => (
        <Cloud
          key={c.key}
          seed={c.seed}
          segments={seg}
          bounds={[10, 3, 6]}
          volume={8}
          color="#FFFFFF"
          position={[c.pos[0], c.pos[1], c.pos[2]]}
        />
      ))}
      {/* Biển mây phẳng */}
      <Cloud
        seed={99}
        segments={seg * 2}
        bounds={[80, 2, 60]}
        volume={30}
        color="#FFFFFF"
        position={[0, 205, -20]}
      />
    </Clouds>
  );
}

const FLOTILLA: [number, number, number][] = [
  [-9, 222, -8],
  [8, 225, -12],
  [-4, 218, -20],
  [12, 219, -3],
  [-14, 226, -18],
  [3, 229, -26],
];

function SmallBalloon({
  url,
  pos,
  phase,
  geo,
  toon,
  onPick,
}: {
  url?: string;
  pos: [number, number, number];
  phase: number;
  geo: LatheGeometry;
  toon: DataTexture;
  onPick: () => void;
}) {
  const g = useRef<Group>(null);
  const hover = useRef({ target: 0, cur: 0 });
  const tex = useSafeTexture(url, 512);
  useFrame(({ clock }, dt) => {
    if (!g.current) return;
    const h = hover.current;
    h.cur += (h.target - h.cur) * Math.min(1, dt * 6);
    g.current.position.y =
      pos[1] + Math.sin(clock.elapsedTime * 0.8 + phase) * 0.5 + h.cur;
  });
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: group three.js, không phải DOM
    <group
      ref={g}
      position={pos}
      scale={0.8}
      onClick={(e) => {
        e.stopPropagation();
        onPick();
      }}
      onPointerOver={() => {
        hover.current.target = 0.3;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hover.current.target = 0;
        document.body.style.cursor = "";
      }}
    >
      <Balloon geo={geo} toon={toon} />
      <mesh position-y={-1.3}>
        <planeGeometry args={[1.5, 2]} />
        {tex ? (
          <meshBasicMaterial map={tex} side={DoubleSide} toneMapped={false} />
        ) : (
          <meshBasicMaterial color="#FFFFFF" side={DoubleSide} />
        )}
      </mesh>
    </group>
  );
}

function Sun({
  progress,
  tex,
}: {
  progress: RefObject<number>;
  tex: CanvasTexture;
}) {
  const s = useRef<Sprite>(null);
  useFrame(() => {
    if (!s.current) return;
    const k = range(progress.current, 0.6, 0.85);
    s.current.position.set(-110, 330 - k * 60, -260);
    s.current.material.opacity =
      Math.min(1, range(progress.current, 0.55, 0.65)) *
      (1 - range(progress.current, 0.85, 0.92));
  });
  return (
    <sprite ref={s} scale={90}>
      <spriteMaterial
        map={tex}
        color="#FFB38A"
        blending={AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </sprite>
  );
}

function Birds({ progress }: { progress: RefObject<number> }) {
  const ref = useRef<Points>(null);
  const pos = useMemo(
    () =>
      new Float32Array([
        0, 0, 0, -1, -0.6, 0, 1, -0.6, 0, -2, -1.2, 0, 2, -1.2, 0,
      ]),
    [],
  );
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const k = range(progress.current, 0.03, 0.25);
    ref.current.visible = k > 0 && k < 1;
    ref.current.position.set(
      -60 + k * 120,
      45 + k * 40 + Math.sin(clock.elapsedTime * 3) * 0.3,
      -25,
    );
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#23303F" size={0.6} />
    </points>
  );
}

function Rig({
  progress,
  fx,
  mobile,
  images,
  onPick,
}: Omit<SceneProps, "fallback"> & { mobile: boolean }) {
  const balloon = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const flame = useRef<Mesh>(null);
  const light = useRef<PointLight>(null);
  const camPos = useMemo(() => new Vector3(0, 2, 10), []);
  const lookAt = useMemo(() => new Vector3(0, 3, 0), []);
  const tmp = useMemo(() => new Vector3(), []);
  const flight = useMemo(
    () => ({ alt: 0, offset: new Vector3(), look: new Vector3() }),
    [],
  );
  const geo = useEnvelope();
  const toon = useToonMap();
  const glow = useGlowTexture();
  const cityOn = useBand(progress, -1, 0.4);
  const cloudsOn = useBand(progress, 0.25, 0.7);
  const flotillaOn = useBand(progress, 0.42, 0.75);
  const starsOn = useBand(progress, 0.75, 2);
  const invalidate = useThree((s) => s.invalidate);

  const burst = () => {
    fx.current.burst = performance.now();
    invalidate();
  };

  // Chạm đúp = bắn lửa (chỉ trang trí).
  useEffect(() => {
    const on = () => {
      fx.current.burst = performance.now();
    };
    window.addEventListener("dblclick", on);
    return () => window.removeEventListener("dblclick", on);
  }, [fx]);

  useFrame(({ camera, clock, pointer }, dt) => {
    const b = balloon.current;
    if (!b) return;
    sampleFlight(FLIGHT_KFS, progress.current, flight);
    const t = clock.elapsedTime;
    b.position.set(Math.sin(t * 0.2) * 1.5, flight.alt + fx.current.intro, 0);
    b.rotation.y += 0.05 * dt;
    b.rotation.z += (-pointer.x * 0.08 - b.rotation.z) * Math.min(1, dt * 3);
    flight.offset.x += pointer.x * 1.5;
    const k = 1 - Math.exp(-3 * dt);
    camPos.lerp(tmp.copy(b.position).add(flight.offset), k);
    lookAt.lerp(tmp.copy(b.position).add(flight.look), k);
    camera.position.copy(camPos);
    camera.lookAt(lookAt);

    // Lửa: nhấp nháy + bùng khi bắn (0.6s).
    const since = (performance.now() - fx.current.burst) / 600;
    const boost = since >= 0 && since < 1 ? Math.sin(since * Math.PI) : 0;
    if (flame.current)
      flame.current.scale.y =
        1 + Math.sin(t * 20) * 0.15 + Math.sin(t * 33) * 0.1 + boost * 2;
    if (light.current) light.current.intensity = 4 + boost * 26;
    if (shell.current) {
      const s = fx.current.opened ? 1 : 0.92;
      shell.current.scale.setScalar(
        shell.current.scale.x +
          (s - shell.current.scale.x) * Math.min(1, dt * 6),
      );
    }
  });

  return (
    <>
      <Sky progress={progress} />
      <hemisphereLight args={["#FFFFFF", "#9FB8C8", 1.6]} />
      <directionalLight position={[20, 40, 10]} intensity={1.4} />
      <group ref={balloon}>
        <group ref={shell} scale={0.92}>
          <Balloon
            geo={geo}
            toon={toon}
            flame={flame}
            light={light}
            onFlame={burst}
          />
        </group>
      </group>
      {cityOn && <City count={mobile ? 150 : 300} toon={toon} />}
      <Birds progress={progress} />
      {cloudsOn && <CloudLayer mobile={mobile} url={glow.url} />}
      {flotillaOn &&
        FLOTILLA.map((p, i) => {
          // 5 chiếc đầu mang images[3..7], chiếc thứ 6 mang images[0].
          const idx = i < 5 ? 3 + i : 0;
          return (
            <SmallBalloon
              key={p.join()}
              url={images[idx]}
              pos={p}
              phase={i * 1.3}
              geo={geo}
              toon={toon}
              onPick={() => onPick(idx)}
            />
          );
        })}
      <Sun progress={progress} tex={glow.tex} />
      {starsOn && <Stars radius={300} count={mobile ? 1200 : 3000} fade />}
    </>
  );
}

export default function Scene({ fallback, ...props }: SceneProps) {
  const mobile = isMobile();
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{ fov: 50, near: 0.1, far: 1200, position: [0, 2, 10] }}
    >
      <Rig {...props} mobile={mobile} />
    </SceneCanvas>
  );
}
