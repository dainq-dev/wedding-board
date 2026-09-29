"use client";

import { Cloud, Clouds, RoundedBox } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  type DirectionalLight,
  Float32BufferAttribute,
  type Group,
  type HemisphereLight,
  LatheGeometry,
  MeshBasicMaterial,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
} from "three";
import { CinematicFX } from "@/kit/3d/fx";
import { damp } from "@/kit/3d/keyframes";
import { Photo3D } from "@/kit/3d/photo";
import { PhotoLayer } from "@/kit/3d/photo-slots";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { createSkyMaterial } from "@/kit/3d/sky-material";
import { nightness, skyAt, sunElevation } from "./sky";

export type SceneProps = {
  progress: RefObject<number>;
  /** 0 = chưa mở (camera dưới biển mây), 1 = đã cất cánh */
  intro: RefObject<number>;
  cover?: string;
  fallback: React.ReactNode;
};

const ALTITUDE = 118; // độ cao camera ở cuối trang (đơn vị thế giới)

// ---------------------------------------------------------------- Bầu trời
function Sky({ progress }: { progress: RefObject<number> }) {
  const mat = useMemo(() => createSkyMaterial(), []);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const scene = useThree((s) => s.scene);
  const cols = useMemo(
    () => ({ top: new Color(), horizon: new Color(), sun: new Color() }),
    [],
  );
  useEffect(() => () => mat.dispose(), [mat]);

  useFrame(({ camera }) => {
    const p = progress.current;
    skyAt(p, cols);
    const el = sunElevation(p);
    const n = nightness(p);
    const u = mat.uniforms;
    u.uTop.value.copy(cols.top);
    u.uHorizon.value.copy(cols.horizon);
    u.uSun.value.copy(cols.sun);
    u.uSunDir.value.set(-0.45, Math.sin(el), -Math.cos(el)).normalize();
    u.uNight.value = n;
    if (hemi.current) {
      hemi.current.color.copy(cols.top).lerp(cols.sun, 0.25);
      hemi.current.groundColor.copy(cols.horizon);
      hemi.current.intensity = 1.9 - n * 1.2;
    }
    if (sun.current) {
      sun.current.color.copy(cols.sun);
      sun.current.intensity = 3.2 * (1 - n * 0.85);
      sun.current.position
        .copy(u.uSunDir.value)
        .multiplyScalar(50)
        .add(camera.position);
      sun.current.target.position.copy(camera.position);
      sun.current.target.updateMatrixWorld();
    }
    if (scene.fog) scene.fog.color.copy(cols.horizon);
  });

  return (
    <>
      <mesh material={mat} frustumCulled={false} renderOrder={-10}>
        <sphereGeometry args={[400, 32, 16]} />
      </mesh>
      <hemisphereLight ref={hemi} />
      <directionalLight ref={sun} />
    </>
  );
}

// ---------------------------------------------------------------- Sao
function Stars({
  progress,
  count,
}: {
  progress: RefObject<number>;
  count: number;
}) {
  const { geo, mat } = useMemo(() => {
    const pos: number[] = [];
    const seed: number[] = [];
    let s = 7;
    const rnd = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    for (let i = 0; i < count; i++) {
      const th = rnd() * Math.PI * 2;
      const ph = Math.acos(rnd() * 0.95); // bán cầu trên
      pos.push(
        Math.sin(ph) * Math.cos(th) * 300,
        Math.cos(ph) * 300,
        Math.sin(ph) * Math.sin(th) * 300,
      );
      seed.push(rnd());
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new Float32BufferAttribute(seed, 1));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 } },
      vertexShader: /* glsl */ `
        attribute float aSeed; uniform float uTime; varying float vA;
        void main() {
          vA = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.6) + aSeed * 40.0);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (1.2 + aSeed * 2.2);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uOpacity; varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d) * vA * uOpacity;
          gl_FragColor = vec4(vec3(1.0, 0.96, 0.9) * 1.6, a);
        }`,
    });
    return { geo: g, mat: m };
  }, [count]);
  const g = useRef<Group>(null);
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  useFrame(({ clock, camera }) => {
    const n = nightness(progress.current);
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uOpacity.value = n;
    if (g.current) {
      g.current.visible = n > 0.01;
      g.current.position.copy(camera.position);
    }
  });
  return (
    <group ref={g}>
      <points geometry={geo} material={mat} frustumCulled={false} />
    </group>
  );
}

// ---------------------------------------------------------------- Khinh khí cầu
const PALETTES = [
  ["#FBF3EA", "#E8735A"],
  ["#FBF3EA", "#8FA89B"],
  ["#F4D9D0", "#FBF3EA"],
  ["#FBF3EA", "#2F3A5C"],
  ["#F2C6A0", "#FBF3EA"],
] as const;

function envelopeProfile() {
  // Giọt nước ngược: cổ hẹp dưới, phình ở 60% rồi khép tròn ở đỉnh.
  const pts: Vector2[] = [];
  const N = 48;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const r =
      t < 0.6
        ? 0.16 + 0.84 * Math.sin(((t / 0.6) * Math.PI) / 2) ** 0.85
        : Math.cos((((t - 0.6) / 0.4) * Math.PI) / 2) ** 0.62;
    pts.push(new Vector2(Math.max(r, 0.0001), -1.1 + 2.15 * t));
  }
  return pts;
}

function goreTexture(a: string, b: string) {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  const gores = 16;
  const w = c.width / gores;
  for (let i = 0; i < gores; i++) {
    g.fillStyle = i % 2 ? b : a;
    g.fillRect(i * w, 0, w + 1, c.height);
  }
  // Gân nhẹ giữa múi + đường may: tạo cảm giác vải căng.
  for (let i = 0; i < gores; i++) {
    const grad = g.createLinearGradient(i * w, 0, (i + 1) * w, 0);
    grad.addColorStop(0, "rgba(0,0,0,0.10)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.10)");
    grad.addColorStop(1, "rgba(0,0,0,0.10)");
    g.fillStyle = grad;
    g.fillRect(i * w, 0, w, c.height);
    g.fillStyle = "rgba(60,40,30,0.25)";
    g.fillRect(i * w, 0, 2, c.height);
  }
  // Vòng may ngang ở chân & 1/3.
  g.fillStyle = "rgba(60,40,30,0.22)";
  for (const y of [0.18, 0.62]) g.fillRect(0, c.height * y, c.width, 3);
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.wrapS = RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function Balloon({
  palette,
  flame,
  night,
  children,
}: {
  palette: readonly [string, string];
  flame?: boolean;
  night: RefObject<number>;
  children?: React.ReactNode;
}) {
  const geo = useMemo(() => new LatheGeometry(envelopeProfile(), 64), []);
  const tex = useMemo(() => goreTexture(palette[0], palette[1]), [palette]);
  const glow = useRef<MeshBasicMaterial>(null);
  useEffect(
    () => () => {
      geo.dispose();
      tex?.dispose();
    },
    [geo, tex],
  );
  useFrame(({ clock }) => {
    const m = glow.current;
    if (!m) return;
    const n = night.current;
    const flick =
      0.85 + 0.15 * Math.sin(clock.elapsedTime * 13 + palette.length);
    // >1 khi tối → bloom làm lửa toả ánh cam.
    m.color.setRGB(1, 0.62, 0.3).multiplyScalar((0.6 + n * 5) * flick);
  });
  const ropes = [
    [0.13, 0.13],
    [-0.13, 0.13],
    [0.13, -0.13],
    [-0.13, -0.13],
  ] as const;
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshPhysicalMaterial
          map={tex ?? undefined}
          roughness={0.72}
          sheen={0.6}
          sheenRoughness={0.55}
          sheenColor="#FFE9D6"
        />
      </mesh>
      {ropes.map(([x, z]) => (
        <mesh
          key={`${x}${z}`}
          position={[x * 1.05, -1.33, z * 1.05]}
          rotation={[z * -0.35, 0, x * 0.35]}
        >
          <cylinderGeometry args={[0.006, 0.006, 0.46, 4]} />
          <meshStandardMaterial color="#5B4636" roughness={1} />
        </mesh>
      ))}
      <RoundedBox
        args={[0.36, 0.26, 0.36]}
        radius={0.05}
        smoothness={3}
        position={[0, -1.66, 0]}
      >
        <meshStandardMaterial color="#9A7048" roughness={0.95} />
      </RoundedBox>
      {flame && (
        <mesh position={[0, -1.18, 0]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshBasicMaterial ref={glow} toneMapped={false} />
        </mesh>
      )}
      {children}
    </group>
  );
}

// Vị trí đàn khinh khí cầu: rải theo độ cao để lúc nào cũng thấy vài chiếc (deterministic).
const FLEET = Array.from({ length: 11 }, (_, i) => {
  const side = i % 2 ? 1 : -1;
  return {
    pos: new Vector3(
      side * (7 + ((i * 7) % 11)),
      2 + i * 11.5,
      -14 - ((i * 13) % 30),
    ),
    scale: 1.3 + ((i * 5) % 7) * 0.22,
    phase: i * 1.7,
    palette: PALETTES[i % PALETTES.length],
  };
});

function Fleet({ night }: { night: RefObject<number> }) {
  const refs = useRef<(Group | null)[]>([]);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((g, i) => {
      if (!g) return;
      const f = FLEET[i];
      g.position.set(
        f.pos.x + Math.sin(t * 0.05 + f.phase) * 1.5,
        f.pos.y + Math.sin(t * 0.35 + f.phase) * 0.35,
        f.pos.z,
      );
      g.rotation.y = t * 0.04 + f.phase;
    });
  });
  return (
    <>
      {FLEET.map((f, i) => (
        <group
          key={f.phase}
          ref={(g) => {
            refs.current[i] = g;
          }}
          scale={f.scale}
        >
          <Balloon palette={f.palette} night={night} flame />
        </group>
      ))}
    </>
  );
}

/** Chiếc khinh khí cầu chủ đạo mang ảnh cưới — hero shot màn mở. */
function Carrier({
  cover,
  night,
}: {
  cover?: string;
  night: RefObject<number>;
}) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime;
    g.current.position.set(
      2.3 + Math.sin(t * 0.3) * 0.15,
      5.4 + Math.sin(t * 0.6) * 0.12,
      -3,
    );
    g.current.rotation.y = Math.sin(t * 0.25) * 0.18;
  });
  return (
    <group ref={g} scale={1.05}>
      <Balloon palette={PALETTES[0]} night={night} flame>
        {cover && (
          <group position={[0, -2.62, 0.02]}>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.004, 0.004, 0.55, 4]} />
              <meshStandardMaterial color="#5B4636" />
            </mesh>
            <Photo3D
              url={cover}
              height={1.25}
              radius={0.03}
              matte={0.045}
              shadow={0.25}
            />
          </group>
        )}
      </Balloon>
    </group>
  );
}

// ---------------------------------------------------------------- Mây
const CLOUD_BANDS = Array.from({ length: 12 }, (_, i) => ({
  seed: i * 3 + 1,
  pos: [
    (i % 2 ? 1 : -1) * (6 + ((i * 5) % 13)),
    -2 + i * 10.5,
    -10 - ((i * 11) % 24),
  ] as [number, number, number],
  bounds: [9 + (i % 3) * 3, 1.6, 3] as [number, number, number],
}));

// Mây vật liệu Basic (không nhận đèn → luôn trắng mềm), nhuộm theo giờ trong ngày mỗi frame.
function CloudField({
  mobile,
  progress,
}: {
  mobile: boolean;
  progress: RefObject<number>;
}) {
  const ref = useRef<Group>(null);
  const cols = useMemo(
    () => ({ top: new Color(), horizon: new Color(), sun: new Color() }),
    [],
  );
  const tint = useMemo(() => new Color(), []);
  useFrame(() => {
    const p = progress.current;
    skyAt(p, cols);
    const n = nightness(p);
    tint
      .set("#FFFFFF")
      .lerp(cols.sun, 0.25 + 0.35 * Math.min(1, p * 1.4))
      .lerp(cols.horizon, n * 0.55)
      .multiplyScalar(1 - n * 0.55);
    ref.current?.traverse((o) => {
      const m = (o as { material?: MeshBasicMaterial }).material;
      if (m?.color) m.color.copy(tint);
    });
  });
  return (
    <Clouds
      ref={ref}
      texture="/textures/cloud.png"
      material={MeshBasicMaterial}
      limit={mobile ? 220 : 420}
    >
      {/* Biển mây dưới chân lúc mở thiệp */}
      <Cloud
        seed={99}
        position={[0, -4, -18]}
        bounds={[34, 1.2, 10]}
        segments={mobile ? 22 : 40}
        volume={16}
        fade={80}
        opacity={0.95}
        speed={0.08}
        color="#FFFFFF"
      />
      {CLOUD_BANDS.map((c) => (
        <Cloud
          key={c.seed}
          seed={c.seed}
          position={c.pos}
          bounds={c.bounds}
          segments={mobile ? 10 : 18}
          volume={8}
          fade={70}
          opacity={0.85}
          speed={0.1}
          growth={4}
          color="#FFFFFF"
        />
      ))}
    </Clouds>
  );
}

// ---------------------------------------------------------------- Camera
function Rig({
  progress,
  intro,
  night,
}: {
  progress: RefObject<number>;
  intro: RefObject<number>;
  night: RefObject<number>;
}) {
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  useFrame(({ camera, pointer, clock }, dt) => {
    const p = progress.current;
    night.current = nightness(p);
    const t = clock.elapsedTime;
    const y = -3.2 + intro.current * 3.2 + p * ALTITUDE;
    target.set(
      Math.sin(t * 0.12) * 0.5 + pointer.x * 0.6,
      y + Math.sin(t * 0.4) * 0.08,
      12,
    );
    const k = damp(2.5, dt);
    camera.position.lerp(target, k);
    look.lerp(
      new Vector3(
        pointer.x * 0.4,
        camera.position.y + 1.4 + pointer.y * 0.3,
        0,
      ),
      k,
    );
    camera.lookAt(look);
  });
  return null;
}

function World({ progress, intro, cover }: Omit<SceneProps, "fallback">) {
  const mobile = useMemo(isMobile, []);
  const night = useRef(0);
  return (
    <>
      <fog attach="fog" args={["#F4E7DA", 30, 140]} />
      <Rig progress={progress} intro={intro} night={night} />
      <Sky progress={progress} />
      <Stars progress={progress} count={mobile ? 900 : 1800} />
      <CloudField mobile={mobile} progress={progress} />
      <Carrier cover={cover} night={night} />
      <Fleet night={night} />
      <CinematicFX
        mobile={mobile}
        tone="aces"
        bloom={0.85}
        threshold={0.9}
        vignette={0.38}
      />
      <PhotoLayer baseColor="#EFE3D8" />
    </>
  );
}

export default function Scene({ fallback, ...props }: SceneProps) {
  const mobile = isMobile();
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{
        fov: mobile ? 55 : 45,
        near: 0.1,
        far: 900,
        position: [0, -3, 12],
      }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <World {...props} />
    </SceneCanvas>
  );
}
