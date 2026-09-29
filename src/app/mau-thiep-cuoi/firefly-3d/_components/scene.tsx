"use client";

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  DoubleSide,
  type FogExp2,
  type InstancedMesh,
  type Mesh,
  type MeshBasicMaterial,
  Object3D,
  type PlaneGeometry,
  type PointLight,
  Quaternion,
  Vector3,
} from "three";
import { damp, range } from "@/kit/3d/keyframes";
import { useSafeTexture } from "@/kit/3d/use-safe-texture";
import { gsap } from "@/kit/gsap";
import { Fireflies, PHOTO_SPOTS } from "./fireflies";
import { along, CLEARING, EYE, PATH, PATH_LEN } from "./path";
import { walkAt } from "./walk";

export type SceneProps = {
  progress: { current: number };
  opened: boolean;
  images: string[];
  initials: string;
  font: string;
  mobile: boolean;
  onInitials: () => void;
};

const DEG = Math.PI / 180;

// Camera người đi bộ: walk(p) + hướng nhìn + head-bob + lệch theo con trỏ.
function WalkRig({ progress }: { progress: { current: number } }) {
  const camera = useThree((s) => s.camera);
  const dummy = useMemo(() => new Object3D(), []);
  const pos = useMemo(() => new Vector3(), []);
  const quat = useMemo(() => new Quaternion(), []);
  const bob = useRef({ phase: 0, prevW: 0, first: true });
  const px = useRef(0);
  useEffect(() => {
    const on = (e: PointerEvent) => {
      px.current = (e.clientX / innerWidth) * 2 - 1;
    };
    addEventListener("pointermove", on);
    return () => removeEventListener("pointermove", on);
  }, []);

  useFrame((_, delta) => {
    const [w, yaw, pitch] = walkAt(progress.current);
    const b = bob.current;
    const dt = Math.max(delta, 1e-3);
    const speed = b.first ? 0 : Math.abs(w - b.prevW) / dt;
    b.prevW = w;
    b.first = false;
    const a = Math.min(1, speed * 20);
    b.phase += speed * dt * PATH_LEN * 4; // khoảng 0.6 bước mỗi đơn vị đường

    const p = PATH.getPointAt(w);
    const t = PATH.getTangentAt(w);
    pos.set(p.x, EYE + Math.sin(b.phase) * 0.035 * a, p.z);
    dummy.position.copy(pos);
    // Object3D.lookAt hướng +z về target, còn camera nhìn theo −z →
    // nhìn NGƯỢC tiếp tuyến để camera (chép quaternion) hướng về phía trước lối.
    dummy.lookAt(pos.x - t.x, EYE, pos.z - t.z);
    dummy.rotateY(-(yaw + px.current * -6) * DEG);
    dummy.rotateX(pitch * DEG);
    dummy.rotateZ(Math.sin(b.phase / 2) * 0.4 * DEG * a);
    quat.copy(dummy.quaternion);

    const k = damp(3, delta);
    camera.position.lerp(pos, k);
    camera.quaternion.slerp(quat, k);
  });
  return null;
}

// Rải cây hai bên lối (cách lối ≥ 1.5), tránh khoảng rừng trống.
function useTreeLayout(n: number) {
  return useMemo(() => {
    const out: { x: number; z: number; r: number; h: number }[] = [];
    let guard = 0;
    while (out.length < n && guard++ < n * 20) {
      const w = Math.random();
      const side = (Math.random() < 0.5 ? -1 : 1) * (1.8 + Math.random() * 10);
      const v = along(w, 0, side, 0);
      if (v.distanceTo(CLEARING) < 7.5) continue;
      out.push({ x: v.x, z: v.z, r: 0.2 + Math.random() * 0.3, h: 0 });
    }
    return out;
  }, [n]);
}

function fernTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    g.strokeStyle = "#1d3a28";
    g.lineWidth = 3;
    for (let f = 0; f < 5; f++) {
      const a = -Math.PI / 2 + (f - 2) * 0.35;
      g.beginPath();
      g.moveTo(64, 128);
      g.quadraticCurveTo(
        64 + Math.cos(a) * 40,
        128 + Math.sin(a) * 70,
        64 + Math.cos(a) * 60,
        128 + Math.sin(a) * 120,
      );
      g.stroke();
      for (let k = 1; k < 9; k++) {
        const x = 64 + Math.cos(a) * 7 * k;
        const y = 128 + Math.sin(a) * 13 * k;
        g.beginPath();
        g.moveTo(x - 10, y + 4);
        g.lineTo(x + 10, y - 4);
        g.stroke();
      }
    }
  }
  return new CanvasTexture(c);
}

function Forest({ mobile }: { mobile: boolean }) {
  const trees = useTreeLayout(mobile ? 50 : 110);
  const nFern = mobile ? 120 : 300;
  const trunk = useRef<InstancedMesh>(null);
  const crown = useRef<InstancedMesh>(null);
  const fern = useRef<InstancedMesh>(null);
  const tex = useMemo(fernTexture, []);
  useEffect(() => () => tex.dispose(), [tex]);

  useLayoutEffect(() => {
    const o = new Object3D();
    trees.forEach((t, i) => {
      o.position.set(t.x, 6, t.z);
      o.rotation.set(0, Math.random() * 6, 0);
      o.scale.set(t.r / 0.35, 1, t.r / 0.35);
      o.updateMatrix();
      trunk.current?.setMatrixAt(i, o.matrix);
      o.position.set(t.x, 11 + Math.random() * 2, t.z);
      o.scale.setScalar(0.8 + Math.random() * 0.6);
      o.updateMatrix();
      crown.current?.setMatrixAt(i, o.matrix);
    });
    for (let i = 0; i < nFern; i++) {
      const side = (Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * 6);
      const v = along(Math.random(), 0, side, 0);
      o.position.set(v.x, 0.35, v.z);
      o.rotation.set(0, Math.random() * 6, 0);
      o.scale.setScalar(0.6 + Math.random() * 0.8);
      o.updateMatrix();
      fern.current?.setMatrixAt(i, o.matrix);
    }
    for (const m of [trunk, crown, fern])
      if (m.current) m.current.instanceMatrix.needsUpdate = true;
  }, [trees, nFern]);

  const ground = useMemo(() => {
    // Màu đỉnh theo khoảng cách tới lối mòn (lối sáng hơn).
    const samples = PATH.getSpacedPoints(160);
    return (x: number, z: number) => {
      let d = 1e9;
      for (const s of samples) d = Math.min(d, (s.x - x) ** 2 + (s.z - z) ** 2);
      return Math.sqrt(d) < 0.9 ? "#122219" : "#07120D";
    };
  }, []);
  const groundGeo = useRef<PlaneGeometry>(null);
  useLayoutEffect(() => {
    const g = groundGeo.current;
    if (!g) return;
    const pos = g.attributes.position;
    const col = new Float32Array(pos.count * 3);
    const c = new Color();
    for (let i = 0; i < pos.count; i++) {
      // plane xoay −90° quanh X: y cục bộ = −z thế giới
      c.set(ground(pos.getX(i), -pos.getY(i) - 46));
      col.set([c.r, c.g, c.b], i * 3);
    }
    g.setAttribute("color", new BufferAttribute(col, 3));
  }, [ground]);

  return (
    <>
      <instancedMesh ref={trunk} args={[undefined, undefined, trees.length]}>
        <cylinderGeometry args={[0.3, 0.4, 12, 6]} />
        <meshStandardMaterial color="#0B1510" flatShading />
      </instancedMesh>
      <instancedMesh ref={crown} args={[undefined, undefined, trees.length]}>
        <icosahedronGeometry args={[2.5, 0]} />
        <meshStandardMaterial color="#08130D" flatShading />
      </instancedMesh>
      <instancedMesh ref={fern} args={[undefined, undefined, nFern]}>
        <planeGeometry args={[0.9, 0.9]} />
        <meshStandardMaterial
          map={tex}
          alphaTest={0.3}
          transparent
          side={DoubleSide}
          color="#5c8a6b"
        />
      </instancedMesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, -46]}>
        <planeGeometry ref={groundGeo} args={[40, 110, 60, 160]} />
        <meshStandardMaterial vertexColors />
      </mesh>
    </>
  );
}

function PhotoPlane({
  url,
  at,
  face,
  basic,
  brightRef,
}: {
  url?: string;
  at: Vector3;
  face: Vector3;
  basic?: boolean;
  brightRef?: (m: MeshBasicMaterial | null) => void;
}) {
  const tex = useSafeTexture(url, 768);
  const ref = useRef<Mesh>(null);
  useLayoutEffect(() => {
    ref.current?.lookAt(face.x, at.y, face.z);
  }, [at, face]);
  if (!url) return null;
  return (
    <group>
      <Line
        points={[
          [at.x, at.y + 0.8, at.z],
          [at.x, at.y + 5, at.z],
        ]}
        color="#8A7350"
        lineWidth={1}
      />
      <mesh ref={ref} position={at}>
        <planeGeometry args={[1.2, 1.6]} />
        {basic ? (
          // key: material tạo khi map=null không tự recompile shader khi texture về.
          <meshBasicMaterial
            key={tex?.uuid ?? "none"}
            ref={brightRef}
            map={tex}
            color="#262626"
            // Ảnh là thứ cần khoe: không để fog đêm nuốt mất.
            fog={false}
          />
        ) : (
          <meshStandardMaterial
            key={tex?.uuid ?? "none"}
            map={tex}
            roughness={0.9}
          />
        )}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.32, 1.72]} />
          <meshStandardMaterial color="#3a2a1a" />
        </mesh>
      </mesh>
    </group>
  );
}

// C3, C4: ảnh cần ánh sáng; 1 pointLight chạy tới trạm đang xem.
const STATIONS: {
  spots: Vector3[];
  a: number;
  b: number;
  w: number;
  img: number[];
}[] = [
  { spots: PHOTO_SPOTS.c3, w: 0.14, a: 0.13, b: 0.24, img: [1, 2] },
  { spots: PHOTO_SPOTS.m1, w: 0.24, a: 0.24, b: 0.3, img: [3] },
  { spots: PHOTO_SPOTS.m2, w: 0.3, a: 0.3, b: 0.36, img: [4] },
  { spots: PHOTO_SPOTS.m3, w: 0.36, a: 0.36, b: 0.42, img: [5] },
];

function Photos({
  images,
  progress,
}: {
  images: string[];
  progress: { current: number };
}) {
  const light = useRef<PointLight>(null);
  // Hành lang ảnh: MỌI ảnh sau chân dung, xen kẽ trái/phải dọc lối đi w 0.44 → 0.70.
  const n = Math.max(0, images.length - 3);
  const corridor = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const w = 0.44 + (0.26 * i) / Math.max(1, n - 1);
        return {
          img: 3 + i,
          at: along(w, 0, i % 2 ? 1.8 : -1.8, 1.9),
          face: along(w, -4),
        };
      }),
    [n],
  );
  const mats = useRef<(MeshBasicMaterial | null)[]>([]);
  const cam = useThree((s) => s.camera);

  useFrame(() => {
    const p = progress.current;
    const l = light.current;
    if (l) {
      let best = 0;
      for (const s of STATIONS) {
        const k = range(p, s.a, s.a + 0.03) * (1 - range(p, s.b - 0.02, s.b));
        if (k > best) {
          best = k;
          const c = s.spots
            .reduce((acc, v) => acc.add(v), new Vector3())
            .divideScalar(s.spots.length);
          l.position.copy(c).lerp(cam.position, 0.3);
        }
      }
      l.intensity = best * 6;
    }
    corridor.forEach((c, i) => {
      const m = mats.current[i];
      if (!m) return;
      const d = cam.position.distanceTo(c.at);
      const b = 0.6 + 0.4 * Math.max(0, Math.min(1, (6 - d) / 3));
      m.color.setScalar(b);
    });
  });

  return (
    <>
      <pointLight
        ref={light}
        color="#E9F59A"
        intensity={0}
        distance={6}
        decay={1}
      />
      {STATIONS.flatMap((s) =>
        s.spots.map((at, j) => (
          <PhotoPlane
            key={`${s.a}-${j}`}
            url={images[s.img[j]]}
            at={at}
            face={along(s.w)}
          />
        )),
      )}
      {corridor.map((c, i) => (
        <PhotoPlane
          key={c.img}
          url={images[c.img]}
          at={c.at}
          face={c.face}
          basic
          brightRef={(m) => {
            mats.current[i] = m;
          }}
        />
      ))}
    </>
  );
}

// C5: 4 dây đèn catenary quanh khoảng trống, sáng dần từ hai đầu vào giữa.
function StringLights({
  mobile,
  progress,
}: {
  mobile: boolean;
  progress: { current: number };
}) {
  const per = mobile ? 16 : 24;
  const { wires, bulbs, order } = useMemo(() => {
    const wires: Vector3[][] = [];
    const bulbs: number[] = [];
    const order: number[] = [];
    for (let s = 0; s < 4; s++) {
      const a0 = (s / 4) * Math.PI * 2;
      const a1 = a0 + Math.PI * 0.8;
      const A = CLEARING.clone().add(
        new Vector3(Math.cos(a0) * 6, 5.5, Math.sin(a0) * 6),
      );
      const B = CLEARING.clone().add(
        new Vector3(Math.cos(a1) * 6, 5.5, Math.sin(a1) * 6),
      );
      const pts: Vector3[] = [];
      for (let i = 0; i < per; i++) {
        const t = i / (per - 1);
        const v = A.clone().lerp(B, t);
        v.y -= 1.6 * (1 - (2 * t - 1) ** 2);
        pts.push(v);
        bulbs.push(v.x, v.y - 0.08, v.z);
        order.push(Math.abs(t - 0.5) * -2 + 1); // 0 ở hai đầu → 1 ở giữa
      }
      wires.push(pts);
    }
    return {
      wires,
      bulbs: new Float32Array(bulbs),
      order: new Float32Array(order),
    };
  }, [per]);
  const uniforms = useMemo(
    () => ({ uLit: { value: 0 }, uColor: { value: new Color("#F2C572") } }),
    [],
  );
  const lamp = useRef<PointLight>(null);
  useFrame(() => {
    const lit = range(progress.current, 0.6, 0.66);
    uniforms.uLit.value = lit;
    if (lamp.current) lamp.current.intensity = lit * 8;
  });
  return (
    <>
      {wires.map((w, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: danh sách cố định
        <Line key={i} points={w} color="#3a3020" lineWidth={1} />
      ))}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bulbs, 3]} />
          <bufferAttribute attach="attributes-aOrder" args={[order, 1]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
          vertexShader={`uniform float uLit; attribute float aOrder; varying float vOn;
            void main(){ vec4 mv = modelViewMatrix*vec4(position,1.0); gl_Position = projectionMatrix*mv;
            vOn = smoothstep(aOrder, aOrder+0.1, uLit*1.1); gl_PointSize = min(28.0, 140.0 / -mv.z); }`}
          fragmentShader={`uniform vec3 uColor; varying float vOn;
            void main(){ float r = length(gl_PointCoord-0.5); gl_FragColor = vec4(uColor, (0.08+0.92*vOn)*smoothstep(0.5,0.0,r)); }`}
        />
      </points>
      <pointLight
        ref={lamp}
        position={[CLEARING.x, 4.5, CLEARING.z]}
        color="#F2C572"
        intensity={0}
        distance={14}
        decay={1}
      />
    </>
  );
}

function Fog({
  opened,
  progress,
}: {
  opened: boolean;
  progress: { current: number };
}) {
  const fog = useThree((s) => s.scene.fog) as FogExp2 | null;
  const base = useRef({ v: 0.12 });
  useEffect(() => {
    if (!opened) return;
    const tw = gsap.to(base.current, {
      v: 0.05,
      delay: 0.8,
      duration: 1.6,
      ease: "sine.inOut",
    });
    return () => {
      tw.kill();
    };
  }, [opened]);
  useFrame(() => {
    if (!fog) return;
    const k = range(progress.current, 0.56, 0.62);
    fog.density = base.current.v + (0.035 - base.current.v) * k;
  });
  return null;
}

export default function Scene(props: SceneProps) {
  const { progress, opened, images, mobile } = props;
  return (
    <>
      <color attach="background" args={["#050D0A"]} />
      <fogExp2 attach="fog" args={["#050D0A", 0.12]} />
      {/* Ánh trăng đủ để đọc được dáng rừng + ảnh; đom đóm vẫn là nguồn sáng chính. */}
      <ambientLight intensity={0.18} />
      <hemisphereLight args={["#3B5A4A", "#050D0A", 0.55]} />
      <WalkRig progress={progress} />
      <Fog opened={opened} progress={progress} />
      <Forest mobile={mobile} />
      <Photos images={images} progress={progress} />
      <StringLights mobile={mobile} progress={progress} />
      <Fireflies
        count={mobile ? 280 : 700}
        mobile={mobile}
        progress={progress}
        opened={opened}
        initials={props.initials}
        font={props.font}
        onInitials={props.onInitials}
      />
    </>
  );
}
