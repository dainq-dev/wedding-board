"use client";

import { Sparkles, Stars } from "@react-three/drei";
import { type ThreeEvent, useFrame } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  type Group,
  Line,
  LineBasicMaterial,
  type Mesh,
  type Points,
  type PointsMaterial,
  type Sprite,
  type SpriteMaterial,
  Vector3,
} from "three";
import { damp, range, sampleKeyframes } from "@/kit/3d/keyframes";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { useSafeTexture } from "@/kit/3d/use-safe-texture";
import { COLLIDE_AT, KEYFRAMES, orbit } from "./keyframes";

const GOLD = "#F4D58D";
const VIOLET = "#9B8CFF";

export type SceneProps = {
  progress: RefObject<number>;
  openedAt: RefObject<number | null>; // performance.now() lúc bấm "Mở thiệp"
  tilt: RefObject<{ x: number; y: number }>; // con trỏ/gyro -1..1
  images: string[];
  onPick: (index: number) => void;
  opened: boolean;
  fallback: React.ReactNode;
};

// Texture sinh bằng code (thay cho glow.png / nebula-*.webp).
function makeTexture(
  size: number,
  draw: (g: CanvasRenderingContext2D) => void,
) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  if (g) draw(g);
  return new CanvasTexture(c);
}

function useGlow() {
  const tex = useMemo(
    () =>
      makeTexture(128, (g) => {
        const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, "rgba(255,255,255,1)");
        r.addColorStop(0.25, "rgba(255,255,255,0.45)");
        r.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = r;
        g.fillRect(0, 0, 128, 128);
      }),
    [],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function useNebula(seed: number, color: string) {
  const tex = useMemo(
    () =>
      makeTexture(512, (g) => {
        let s = seed;
        const rnd = () => {
          s = (s * 16807) % 2147483647;
          return s / 2147483647;
        };
        g.globalCompositeOperation = "lighter";
        for (let i = 0; i < 40; i++) {
          const x = 256 + (rnd() - 0.5) * 300;
          const y = 256 + (rnd() - 0.5) * 300;
          const rad = 40 + rnd() * 120;
          const r = g.createRadialGradient(x, y, 0, x, y, rad);
          r.addColorStop(0, `${color}22`);
          r.addColorStop(1, `${color}00`);
          g.fillStyle = r;
          g.fillRect(0, 0, 512, 512);
        }
      }),
    [seed, color],
  );
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function Nebula({
  seed,
  color,
  position,
  scale,
}: {
  seed: number;
  color: string;
  position: [number, number, number];
  scale: number;
}) {
  const map = useNebula(seed, color);
  const ref = useRef<Mesh>(null);
  useFrame((_, d) => {
    if (ref.current) ref.current.rotation.z += d * 0.01;
  });
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial
        map={map}
        transparent
        opacity={0.35}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Plane ảnh 3:4 với viền sáng phía sau.
function Photo({
  url,
  onClick,
  scale = 3,
}: {
  url?: string;
  onClick?: (e: ThreeEvent<MouseEvent>) => void;
  scale?: number;
}) {
  const tex = useSafeTexture(url);
  if (!tex) return null;
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: object3D của R3F, không phải DOM
    <group scale={scale} onClick={onClick}>
      <mesh position-z={-0.01} scale={[0.8, 1.06, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          color={VIOLET}
          transparent
          opacity={0.3}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={[0.75, 1, 1]}>
        <planeGeometry />
        <meshBasicMaterial map={tex} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}

function Star({ color, glow }: { color: string; glow: CanvasTexture }) {
  return (
    <>
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <sprite scale={6}>
        <spriteMaterial
          map={glow}
          color={color}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <Sparkles color={color} count={30} scale={4} size={3} speed={0.3} />
    </>
  );
}

function TwinStars({
  progress,
  images,
  glow,
}: {
  progress: RefObject<number>;
  images: string[];
  glow: CanvasTexture;
}) {
  const g = useRef<Group>(null);
  const b = useRef<Group>(null);
  const pg = useRef<Group>(null);
  const pb = useRef<Group>(null);
  useFrame(({ clock }) => {
    const p = progress.current;
    const [x, y, z] = orbit(p);
    const on = p < COLLIDE_AT;
    g.current?.position.set(x, y, z);
    b.current?.position.set(-x, -y, -z);
    if (g.current) g.current.visible = on;
    if (b.current) b.current.visible = on;
    // Chân dung bay quanh sao trong chương cặp đôi (0.12–0.28).
    const s = Math.sin(Math.PI * range(p, 0.08, 0.32)) * 3;
    const t = clock.elapsedTime * 0.4;
    for (const [ref, sign] of [
      [pg, 1],
      [pb, -1],
    ] as const) {
      const o = ref.current;
      if (!o) continue;
      o.visible = s > 0.01;
      o.scale.setScalar(Math.max(0.001, s));
      o.position.set(
        sign * x + Math.cos(t) * 3,
        1.5,
        sign * z + Math.sin(t) * 3,
      );
    }
  });
  return (
    <>
      <group ref={g}>
        <Star color={GOLD} glow={glow} />
      </group>
      <group ref={b}>
        <Star color={VIOLET} glow={glow} />
      </group>
      <group ref={pg}>
        <Photo url={images[1]} scale={1} />
      </group>
      <group ref={pb}>
        <Photo url={images[2]} scale={1} />
      </group>
    </>
  );
}

const CONSTELLATIONS: {
  at: [number, number, number];
  pts: [number, number][];
}[] = [
  {
    at: [-10, 5, 2],
    pts: [
      [0, 0],
      [1.5, 1],
      [3, 0.6],
      [4, 2],
      [5.5, 1.5],
      [6, 0],
    ],
  },
  {
    at: [-3, -6, -4],
    pts: [
      [0, 0],
      [1, 1.8],
      [2.5, 2.2],
      [4, 1.4],
      [5, 2.6],
    ],
  },
  {
    at: [6, 4, -8],
    pts: [
      [0, 0],
      [1.2, -1],
      [2.8, -0.4],
      [3.5, 1.2],
      [5, 1.8],
      [6.2, 0.8],
      [7, 2],
    ],
  },
];

function Constellations({
  progress,
  images,
}: {
  progress: RefObject<number>;
  images: string[];
}) {
  const lines = useMemo(
    () =>
      CONSTELLATIONS.map(({ pts }) => {
        const geo = new BufferGeometry();
        geo.setAttribute(
          "position",
          new Float32BufferAttribute(
            pts.flatMap(([x, y]) => [x, y, 0]),
            3,
          ),
        );
        geo.setDrawRange(0, 0);
        return new Line(
          geo,
          new LineBasicMaterial({
            color: VIOLET,
            transparent: true,
            opacity: 0.8,
          }),
        );
      }),
    [],
  );
  useEffect(
    () => () => {
      for (const l of lines) {
        l.geometry.dispose();
        (l.material as LineBasicMaterial).dispose();
      }
    },
    [lines],
  );
  const photos = useRef<(Group | null)[]>([]);
  useFrame(() => {
    const p = progress.current;
    lines.forEach((l, i) => {
      // 3 chòm vẽ lần lượt trong 0.28–0.45.
      const k = range(p, 0.28 + i * 0.055, 0.28 + (i + 1) * 0.055);
      const n = CONSTELLATIONS[i].pts.length;
      l.geometry.setDrawRange(0, Math.ceil(k * n));
      const ph = photos.current[i];
      if (ph) ph.visible = k > 0.5 && p < 0.6;
    });
  });
  return (
    <>
      {CONSTELLATIONS.map(({ at, pts }, i) => (
        <group key={at.join()} position={at}>
          <primitive object={lines[i]} />
          {pts.map(([x, y]) => (
            <mesh key={`${x},${y}`} position={[x, y, 0]}>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial color="#EEEAFF" />
            </mesh>
          ))}
          <group
            ref={(o) => {
              photos.current[i] = o;
            }}
            position={[pts.at(-1)?.[0] ?? 0, -2, 0]}
          >
            <Photo url={images[3 + i]} scale={2.4} />
          </group>
        </group>
      ))}
    </>
  );
}

function AlbumSpiral({
  images,
  onPick,
}: {
  images: string[];
  onPick: (i: number) => void;
}) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame(({ camera }) => {
    for (const o of refs.current) o?.lookAt(camera.position);
  });
  return (
    <>
      {[3, 4, 5, 6].map((idx, i) => {
        const a = i * (Math.PI / 1.5);
        return (
          <group
            key={idx}
            ref={(o) => {
              refs.current[i] = o;
            }}
            position={[Math.cos(a) * 4, Math.sin(a) * 4, -20 - i * (40 / 3)]}
          >
            <Photo
              url={images[idx]}
              scale={4}
              onClick={(e) => {
                e.stopPropagation();
                onPick(idx);
              }}
            />
          </group>
        );
      })}
    </>
  );
}

function Collision({
  progress,
  glow,
  count,
}: {
  progress: RefObject<number>;
  glow: CanvasTexture;
  count: number;
}) {
  const flash = useRef<Sprite>(null);
  const pts = useRef<Points>(null);
  const dirs = useMemo(() => {
    const a = new Float32Array(count * 3);
    const v = new Vector3();
    for (let i = 0; i < count; i++) {
      v.randomDirection().multiplyScalar(0.5 + Math.random());
      a.set([v.x, v.y, v.z], i * 3);
    }
    return a;
  }, [count]);
  useFrame(() => {
    const k = range(progress.current, 0.66, COLLIDE_AT + 0.04);
    const on = k > 0 && k < 1;
    if (flash.current) {
      flash.current.visible = on;
      flash.current.scale.setScalar(k * 30 + 0.001);
      (flash.current.material as SpriteMaterial).opacity = 1 - k;
    }
    if (pts.current) {
      pts.current.visible = on;
      pts.current.scale.setScalar(k * 20 + 0.001);
      (pts.current.material as PointsMaterial).opacity = 1 - k;
    }
  });
  return (
    <>
      <sprite ref={flash}>
        <spriteMaterial
          map={glow}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
      <points ref={pts}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dirs, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={GOLD}
          size={0.3}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </>
  );
}

const MERGED_VERT = `varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const MERGED_FRAG = `uniform vec3 a; uniform vec3 b; varying vec3 vN; void main(){ gl_FragColor = vec4(mix(b, a, vN.y * 0.5 + 0.5), 1.0); }`;

function MergedStar({
  progress,
  glow,
}: {
  progress: RefObject<number>;
  glow: CanvasTexture;
}) {
  const ref = useRef<Group>(null);
  const uniforms = useMemo(
    () => ({ a: { value: new Color(GOLD) }, b: { value: new Color(VIOLET) } }),
    [],
  );
  useFrame(() => {
    const k = range(progress.current, COLLIDE_AT - 0.02, COLLIDE_AT + 0.04);
    if (!ref.current) return;
    ref.current.visible = k > 0;
    ref.current.scale.setScalar(Math.max(0.001, k));
  });
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial
          vertexShader={MERGED_VERT}
          fragmentShader={MERGED_FRAG}
          uniforms={uniforms}
        />
      </mesh>
      <sprite scale={14}>
        <spriteMaterial
          map={glow}
          color="#FFE9C0"
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </sprite>
    </group>
  );
}

function Planet({ progress }: { progress: RefObject<number> }) {
  const ref = useRef<Group>(null);
  const globe = useRef<Mesh>(null);
  useFrame((_, d) => {
    const s = Math.sin(Math.PI * range(progress.current, 0.74, 0.97));
    if (!ref.current) return;
    ref.current.visible = s > 0.01;
    ref.current.scale.setScalar(Math.max(0.001, s));
    if (globe.current) globe.current.rotation.y += d * 0.1;
  });
  return (
    <group ref={ref} position={[0, 6, -14]}>
      <directionalLight position={[10, 10, 10]} intensity={2.5} />
      <mesh ref={globe}>
        <sphereGeometry args={[6, 48, 48]} />
        <meshStandardMaterial
          color="#2E6FB0"
          emissive="#0E3B2E"
          roughness={0.8}
        />
      </mesh>
      <mesh position={[0, 6.6, 0]} rotation-x={Math.PI}>
        <coneGeometry args={[0.35, 1.2, 16]} />
        <meshBasicMaterial color={GOLD} />
      </mesh>
    </group>
  );
}

function CameraRig({
  progress,
  openedAt,
  tilt,
}: Pick<SceneProps, "progress" | "openedAt" | "tilt">) {
  const look = useRef(new Vector3());
  const target = useMemo(
    () => ({ pos: new Vector3(), look: new Vector3() }),
    [],
  );
  const smoothTilt = useRef({ x: 0, y: 0 });
  useFrame(({ camera }, delta) => {
    sampleKeyframes(KEYFRAMES, progress.current, target);
    // Màn mở: camera bay z +30 → 0 trong 3 giây sau khi bấm.
    const t0 = openedAt.current;
    const fly =
      t0 === null ? 1 : 1 - Math.min(1, (performance.now() - t0) / 3000);
    target.pos.z += 30 * (fly * fly * (3 - 2 * fly));
    const st = smoothTilt.current;
    st.x += (tilt.current.x - st.x) * damp(3, delta);
    st.y += (tilt.current.y - st.y) * damp(3, delta);
    target.pos.x += st.x * 0.3 * 3;
    target.pos.y += st.y * 0.3 * 2;
    const k = damp(4, delta);
    camera.position.lerp(target.pos, k);
    look.current.lerp(target.look, k);
    camera.lookAt(look.current);
  });
  return null;
}

function WarpStars({
  openedAt,
  mobile,
}: {
  openedAt: RefObject<number | null>;
  mobile: boolean;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, d) => {
    const t0 = openedAt.current;
    const t = t0 === null ? 1 : (performance.now() - t0) / 3000;
    // Vệt sao: tốc độ 1 → 8 → 1 trong 3 giây.
    const speed = 1 + 7 * Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    if (ref.current) ref.current.rotation.z += d * 0.01 * speed;
  });
  return (
    <group ref={ref}>
      <Stars
        radius={200}
        depth={80}
        count={mobile ? 2500 : 6000}
        factor={4}
        fade
      />
    </group>
  );
}

export default function GalaxyScene({ fallback, opened, ...p }: SceneProps) {
  const mobile = isMobile();
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{ position: [0, 0, 90], fov: 55, near: 0.1, far: 1000 }}
      className="bg-[#07061A]"
      // Canvas nằm sau HTML (-z-10) → nghe sự kiện trên body để raycast ảnh album.
      eventSource={document.body}
      eventPrefix="client"
      {...(!opened && { frameloop: "demand" as const })}
    >
      <color attach="background" args={["#07061A"]} />
      <ambientLight intensity={0.3} />
      <Inner {...p} mobile={mobile} />
    </SceneCanvas>
  );
}

function Inner({
  progress,
  openedAt,
  tilt,
  images,
  onPick,
  mobile,
}: Omit<SceneProps, "fallback" | "opened"> & { mobile: boolean }) {
  const glow = useGlow();
  return (
    <>
      <CameraRig progress={progress} openedAt={openedAt} tilt={tilt} />
      <WarpStars openedAt={openedAt} mobile={mobile} />
      <Nebula seed={7} color="#6A4CFF" position={[-30, 10, -60]} scale={90} />
      <Nebula seed={31} color="#C06AFF" position={[35, -15, -80]} scale={110} />
      {!mobile && (
        <Nebula
          seed={97}
          color="#4C8BFF"
          position={[0, 20, -120]}
          scale={140}
        />
      )}
      <TwinStars progress={progress} images={images} glow={glow} />
      <Constellations progress={progress} images={images} />
      <AlbumSpiral images={images} onPick={onPick} />
      <Collision progress={progress} glow={glow} count={mobile ? 150 : 300} />
      <MergedStar progress={progress} glow={glow} />
      <Planet progress={progress} />
    </>
  );
}
