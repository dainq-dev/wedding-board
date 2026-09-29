"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  CircleGeometry,
  Color,
  type DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  type Group,
  type HemisphereLight,
  type InstancedMesh,
  Matrix4,
  Object3D,
  Quaternion,
  RepeatWrapping,
  ShaderMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { CinematicFX } from "@/kit/3d/fx";
import { damp } from "@/kit/3d/keyframes";
import { PhotoLayer } from "@/kit/3d/photo-slots";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { createSkyMaterial } from "@/kit/3d/sky-material";
import {
  boatAt,
  dawnAt,
  lotusField,
  PATH_LENGTH,
  rng,
  sunElevation,
} from "./dawn";

export type SceneProps = {
  progress: RefObject<number>;
  /** 0 = màn mở (cận cảnh bông sen), 1 = đã mở thiệp */
  intro: RefObject<number>;
  fallback: React.ReactNode;
};

// ---------------------------------------------------------------- Hoa sen
const PETAL_BASE = new Color("#F4EDC6");
const PETAL_MID = new Color("#FFF5F3");
const PETAL_TIP = new Color("#DC7496");

/** Một cánh sen: lòng thìa hướng vào tâm (−z), đầu cánh uốn nhẹ ra ngoài (+z). */
function petalGeometry(len: number, width: number, cup: number, curl: number) {
  const U = 10;
  const V = 18;
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const c = new Color();
  for (let v = 0; v <= V; v++) {
    const t = v / V;
    const w = width * Math.sin(Math.PI * t ** 0.7) * (1 - 0.12 * t) + 0.0005;
    for (let u = 0; u <= U; u++) {
      const s = (u / U) * 2 - 1;
      pos.push(
        s * w,
        t * len,
        cup * t * t - curl * s * s * Math.sin(Math.PI * t),
      );
      if (t < 0.14) c.copy(PETAL_BASE).lerp(PETAL_MID, t / 0.14);
      else c.copy(PETAL_MID).lerp(PETAL_TIP, ((t - 0.14) / 0.86) ** 1.7);
      c.lerp(PETAL_TIP, Math.max(0, Math.abs(s) - 0.75) * 0.8);
      col.push(c.r, c.g, c.b);
    }
  }
  for (let v = 0; v < V; v++)
    for (let u = 0; u < U; u++) {
      const a = v * (U + 1) + u;
      const b = a + U + 1;
      idx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Ghép 3 vòng cánh + đài sen thành MỘT geometry (1 draw call / bông). */
function flowerGeometry(bloom: number) {
  const parts: BufferGeometry[] = [];
  const rings = [
    { n: 6, r: 0.04, tilt: 0.12 + 0.4 * bloom, len: 0.62, w: 0.2 },
    { n: 8, r: 0.07, tilt: 0.3 + 0.62 * bloom, len: 0.78, w: 0.25 },
    { n: 10, r: 0.1, tilt: 0.5 + 0.8 * bloom, len: 0.9, w: 0.28 },
  ];
  const m = new Matrix4();
  const q = new Quaternion();
  const e = new Object3D();
  rings.forEach((ring, k) => {
    const base = petalGeometry(ring.len, ring.w, 0.12 + 0.18 * bloom, 0.09);
    for (let i = 0; i < ring.n; i++) {
      const a = (i / ring.n) * Math.PI * 2 + k * 0.37;
      e.position.set(Math.sin(a) * ring.r, 0, Math.cos(a) * ring.r);
      e.rotation.set(0, a, 0);
      e.updateMatrix();
      q.setFromAxisAngle(new Vector3(1, 0, 0), ring.tilt);
      m.makeRotationFromQuaternion(q);
      const g = base.clone().applyMatrix4(m).applyMatrix4(e.matrix);
      parts.push(g);
    }
    base.dispose();
  });
  // Đài sen: trụ thấp màu vàng xanh.
  const podN = 24;
  const pod: number[] = [];
  const podCol: number[] = [];
  const podIdx: number[] = [];
  const podTop = new Color("#CDBF57");
  const podSide = new Color("#9DB04E");
  for (let i = 0; i <= podN; i++) {
    const a = (i / podN) * Math.PI * 2;
    for (const [y, r, col] of [
      [0.02, 0.07, podSide],
      [0.14, 0.11, podSide],
      [0.15, 0.1, podTop],
    ] as const) {
      pod.push(Math.sin(a) * r, y, Math.cos(a) * r);
      podCol.push(col.r, col.g, col.b);
    }
  }
  for (let i = 0; i < podN; i++)
    for (let j = 0; j < 2; j++) {
      const a = i * 3 + j;
      const b = (i + 1) * 3 + j;
      podIdx.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const pg = new BufferGeometry();
  pg.setAttribute("position", new Float32BufferAttribute(pod, 3));
  pg.setAttribute("color", new Float32BufferAttribute(podCol, 3));
  pg.setIndex(podIdx);
  pg.computeVertexNormals();
  parts.push(pg);
  const merged = mergeGeometries(parts, false);
  for (const p of parts) p.dispose();
  return merged;
}

function Flowers({
  mobile,
  hero,
}: {
  mobile: boolean;
  hero: RefObject<Group | null>;
}) {
  const geos = useMemo(() => [0.08, 0.55, 1].map((b) => flowerGeometry(b)), []);
  const field = useMemo(() => lotusField(mobile ? 22 : 38), [mobile]);
  const refs = useRef<(Group | null)[]>([]);
  useEffect(
    () => () => {
      for (const g of geos) g.dispose();
    },
    [geos],
  );
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    refs.current.forEach((g, i) => {
      if (!g) return;
      g.rotation.z = Math.sin(t * 0.7 + i) * 0.025;
      g.rotation.x = Math.cos(t * 0.6 + i * 1.3) * 0.02;
    });
  });
  const mat = (
    <meshPhysicalMaterial
      vertexColors
      side={DoubleSide}
      roughness={0.55}
      sheen={0.5}
      sheenRoughness={0.5}
      sheenColor="#FFE3EC"
      emissive="#5A1A2E"
      emissiveIntensity={0.12}
    />
  );
  return (
    <>
      {/* Bông sen hero ở màn mở */}
      <group ref={hero} position={[0.9, 0.34, 4.2]} scale={1.35}>
        <mesh geometry={geos[2]}>{mat}</mesh>
        <Stem />
      </group>
      {field.map((f, i) => (
        <group
          key={`${f.x.toFixed(2)}${f.z.toFixed(2)}`}
          ref={(g) => {
            refs.current[i] = g;
          }}
          position={[f.x, 0.3 * f.scale, f.z]}
          rotation={[0, f.rot, 0]}
          scale={f.scale}
        >
          <mesh geometry={geos[f.bloom > 0.85 ? 2 : f.bloom > 0.68 ? 1 : 0]}>
            {mat}
          </mesh>
          <Stem />
        </group>
      ))}
    </>
  );
}

function Stem() {
  return (
    <mesh position={[0, -0.18, 0]}>
      <cylinderGeometry args={[0.018, 0.024, 0.4, 8]} />
      <meshStandardMaterial color="#5E7F48" roughness={0.8} />
    </mesh>
  );
}

// ---------------------------------------------------------------- Lá sen
function veinTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, "#77A160");
  grad.addColorStop(0.7, "#5E8C4C");
  grad.addColorStop(1, "#8DB06F");
  g.fillStyle = grad;
  g.fillRect(0, 0, 512, 512);
  g.strokeStyle = "rgba(210,230,170,0.35)";
  g.lineWidth = 2;
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    g.beginPath();
    g.moveTo(256, 256);
    g.quadraticCurveTo(
      256 + Math.cos(a + 0.1) * 150,
      256 + Math.sin(a + 0.1) * 150,
      256 + Math.cos(a) * 250,
      256 + Math.sin(a) * 250,
    );
    g.stroke();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Pads({ mobile }: { mobile: boolean }) {
  const ref = useRef<InstancedMesh>(null);
  const geo = useMemo(() => {
    const g = new CircleGeometry(1, 64, 0.3, Math.PI * 2 - 0.42);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const y = p.getY(i);
      const r = Math.hypot(x, y);
      p.setZ(i, 0.06 * r ** 4 - 0.02 * (1 - r)); // mép hơi vểnh
    }
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, []);
  const tex = useMemo(veinTexture, []);
  const count = mobile ? 70 : 130;
  useEffect(() => {
    const m = ref.current;
    if (!m) return;
    const r = rng(23);
    const o = new Object3D();
    for (let i = 0; i < count; i++) {
      const side = r() > 0.5 ? 1 : -1;
      o.position.set(
        side * (1.9 + r() * 12),
        0.015,
        10 - r() * (PATH_LENGTH + 20),
      );
      o.rotation.set(0, r() * Math.PI * 2, 0);
      o.scale.setScalar(0.35 + r() * 0.65);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [count]);
  useEffect(
    () => () => {
      geo.dispose();
      tex?.dispose();
    },
    [geo, tex],
  );
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshStandardMaterial
        map={tex ?? undefined}
        roughness={0.5}
        side={DoubleSide}
      />
    </instancedMesh>
  );
}

// ---------------------------------------------------------------- Nước, trời, sương
function rippleTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  const img = g.createImageData(256, 256);
  const r = rng(3);
  for (let i = 0; i < img.data.length; i += 4) {
    const y = Math.floor(i / 4 / 256);
    const v = 128 + Math.sin(y * 0.35 + r() * 0.6) * 60 + (r() - 0.5) * 40;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(12, 12);
  return t;
}

function Water({ mobile }: { mobile: boolean }) {
  const ripple = useMemo(rippleTexture, []);
  useEffect(() => () => ripple?.dispose(), [ripple]);
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -40]}>
      <planeGeometry args={[400, 400]} />
      <MeshReflectorMaterial
        resolution={mobile ? 512 : 1024}
        blur={[320, 90]}
        mixBlur={1.1}
        mixStrength={1.6}
        mirror={0.85}
        roughness={1}
        depthScale={0.4}
        minDepthThreshold={0.6}
        maxDepthThreshold={1.3}
        metalness={0.35}
        color="#A8BAB4"
        distortionMap={ripple ?? undefined}
        distortion={0.18}
      />
    </mesh>
  );
}

function treelineTexture(seed: number, color: string) {
  const c = document.createElement("canvas");
  c.width = 2048;
  c.height = 256;
  const g = c.getContext("2d");
  if (!g) return null;
  const r = rng(seed);
  g.fillStyle = color;
  // Tán tre / cây xa: chuỗi vòm mềm + vài ngọn tre vút lên.
  g.beginPath();
  g.moveTo(0, 256);
  for (let x = 0; x <= 2048; x += 24) {
    const h = 70 + Math.sin(x * 0.004 + seed) * 30 + r() * 40;
    g.lineTo(x, 256 - h);
  }
  g.lineTo(2048, 256);
  g.fill();
  for (let i = 0; i < 40; i++) {
    const x = r() * 2048;
    const h = 120 + r() * 110;
    g.beginPath();
    g.moveTo(x - 18, 256 - 60);
    g.quadraticCurveTo(x + (r() - 0.5) * 30, 256 - h - 20, x + 22, 256 - 60);
    g.fill();
  }
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  return t;
}

function Treeline() {
  const far = useMemo(() => treelineTexture(4, "#A9BDB2"), []);
  const near = useMemo(() => treelineTexture(9, "#8FA897"), []);
  useEffect(
    () => () => {
      far?.dispose();
      near?.dispose();
    },
    [far, near],
  );
  return (
    <>
      <mesh position={[0, 11, -170]}>
        <planeGeometry args={[520, 26]} />
        <meshBasicMaterial
          map={far ?? undefined}
          transparent
          depthWrite={false}
        />
      </mesh>
      <mesh position={[20, 8, -128]}>
        <planeGeometry args={[420, 18]} />
        <meshBasicMaterial
          map={near ?? undefined}
          transparent
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function mistTexture() {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 64;
  const g = c.getContext("2d");
  if (!g) return null;
  const grad = g.createRadialGradient(128, 32, 4, 128, 32, 128);
  grad.addColorStop(0, "rgba(255,255,255,0.9)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 64);
  return new CanvasTexture(c);
}

function Mist({ progress }: { progress: RefObject<number> }) {
  const tex = useMemo(mistTexture, []);
  const banks = useMemo(() => {
    const r = rng(41);
    return Array.from({ length: 16 }, () => ({
      x: (r() - 0.5) * 40,
      z: 4 - r() * (PATH_LENGTH + 30),
      s: 14 + r() * 16,
      phase: r() * 10,
    }));
  }, []);
  const refs = useRef<(Group | null)[]>([]);
  useEffect(() => () => tex?.dispose(), [tex]);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime;
    // Sương tan dần khi nắng lên.
    const o = 0.55 - 0.3 * Math.min(1, progress.current * 1.3);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const b = banks[i];
      g.position.x = b.x + Math.sin(t * 0.05 + b.phase) * 3;
      g.quaternion.copy(camera.quaternion);
      const m = (g.children[0] as { material?: { opacity: number } }).material;
      if (m) m.opacity = o;
    });
  });
  return (
    <>
      {banks.map((b, i) => (
        <group
          key={b.phase}
          ref={(g) => {
            refs.current[i] = g;
          }}
          position={[b.x, 0.9, b.z]}
        >
          <mesh scale={[b.s, b.s * 0.22, 1]}>
            <planeGeometry />
            <meshBasicMaterial
              map={tex ?? undefined}
              transparent
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

function Pollen({ count }: { count: number }) {
  const { geo, mat } = useMemo(() => {
    const r = rng(77);
    const pos: number[] = [];
    for (let i = 0; i < count; i++)
      pos.push((r() - 0.5) * 24, 0.3 + r() * 3.2, 8 - r() * (PATH_LENGTH + 10));
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    const m = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        uniform float uTime; varying float vA;
        void main() {
          vec3 p = position;
          p.y += sin(uTime * 0.4 + position.x * 3.0) * 0.12;
          p.x += cos(uTime * 0.3 + position.z) * 0.1;
          vA = 0.5 + 0.5 * sin(uTime * 1.3 + position.z * 5.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = 22.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying float vA;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          gl_FragColor = vec4(vec3(1.0, 0.9, 0.7) * 1.4, smoothstep(0.5, 0.0, d) * vA * 0.7);
        }`,
    });
    return { geo: g, mat: m };
  }, [count]);
  useEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  useFrame(({ clock }) => {
    mat.uniforms.uTime.value = clock.elapsedTime;
  });
  return <points geometry={geo} material={mat} frustumCulled={false} />;
}

function Sky({ progress }: { progress: RefObject<number> }) {
  const mat = useMemo(() => createSkyMaterial({ disc: 2.6, curve: 0.45 }), []);
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
    dawnAt(p, cols);
    const el = sunElevation(p);
    const u = mat.uniforms;
    u.uTop.value.copy(cols.top);
    u.uHorizon.value.copy(cols.horizon);
    u.uSun.value.copy(cols.sun);
    u.uSunDir.value.set(0.25, Math.sin(el), -Math.cos(el)).normalize();
    if (hemi.current) {
      hemi.current.color.copy(cols.top);
      hemi.current.groundColor.set("#9DB0A6");
    }
    if (sun.current) {
      sun.current.color.copy(cols.sun);
      sun.current.position
        .copy(u.uSunDir.value)
        .multiplyScalar(40)
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
      <hemisphereLight ref={hemi} intensity={1.5} />
      <directionalLight ref={sun} intensity={2.4} />
    </>
  );
}

// ---------------------------------------------------------------- Camera
function Boat({
  progress,
  intro,
}: {
  progress: RefObject<number>;
  intro: RefObject<number>;
}) {
  const pos = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(0, 0.9, -10), []);
  const want = useMemo(() => new Vector3(), []);
  useFrame(({ camera, pointer, clock }, dt) => {
    const t = clock.elapsedTime;
    const b = boatAt(progress.current, t);
    const k = intro.current;
    // Màn mở: cao hơn, cúi xuống ngắm bông sen hero; mở thiệp thì hạ sát mặt nước.
    pos.set(b.x * k + (1 - k) * 0.2, b.y + (1 - k) * 1.1, b.z + (1 - k) * 0.6);
    want.set(
      b.x * 0.5 * k + pointer.x * 0.8 + (1 - k) * 0.8,
      0.9 + pointer.y * 0.25 - (1 - k) * 0.55,
      b.z - 10 + (1 - k) * 5.4,
    );
    const s = damp(2.2, dt);
    camera.position.lerp(pos, s);
    look.lerp(want, s);
    camera.lookAt(look);
  });
  return null;
}

function World({ progress, intro }: Omit<SceneProps, "fallback">) {
  const mobile = useMemo(isMobile, []);
  const hero = useRef<Group>(null);
  return (
    <>
      <fog attach="fog" args={["#F9D6BA", 18, 120]} />
      <Boat progress={progress} intro={intro} />
      <Sky progress={progress} />
      <Treeline />
      <Water mobile={mobile} />
      <Pads mobile={mobile} />
      <Flowers mobile={mobile} hero={hero} />
      <Mist progress={progress} />
      <Pollen count={mobile ? 220 : 500} />
      <CinematicFX
        mobile={mobile}
        tone="aces"
        bloom={0.6}
        threshold={0.92}
        vignette={0.32}
        grain={0.03}
      />
      <PhotoLayer baseColor="#EFE6DC" />
    </>
  );
}

export default function Scene({ fallback, ...props }: SceneProps) {
  const mobile = isMobile();
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{
        fov: mobile ? 52 : 42,
        near: 0.05,
        far: 900,
        position: [0.2, 2.3, 9],
      }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <World {...props} />
    </SceneCanvas>
  );
}
