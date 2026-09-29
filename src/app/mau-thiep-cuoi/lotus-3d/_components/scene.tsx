"use client";

import { MeshReflectorMaterial, Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  type RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import {
  AdditiveBlending,
  CanvasTexture,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  type DirectionalLight,
  DoubleSide,
  type Fog,
  type Group,
  type HemisphereLight,
  type InstancedMesh,
  Object3D,
  type Sprite,
  Vector3,
} from "three";
import { damp, range } from "@/kit/3d/keyframes";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { useSafeTexture } from "@/kit/3d/use-safe-texture";
import { Lotus, petalGeometry } from "./lotus";
import {
  easeRemap,
  LOTUS_POS,
  lookAt,
  PATH,
  reflectionIndex,
  reflectionSlot,
  type Vec3,
} from "./pond";

export type SceneProps = {
  progress: RefObject<number>;
  introStart: RefObject<number | null>; // performance.now() lúc bấm "Mở thiệp"; -Infinity = bỏ qua
  images: string[];
  onPhoto: (index: number) => void;
};

const MIST = new Color("#F6EFE7");
const GREY = new Color("#BDB8B3");

// Tiến độ intro 0..1 trong 3.5s sau khi mở.
const introAt = (start: number | null) =>
  start === null ? 0 : Math.min(1, (performance.now() - start) / 3500);

function useRadialTexture(inner: string, outer: string) {
  const tex = useMemo(() => radialTexture(inner, outer), [inner, outer]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function radialTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  if (g) {
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
  }
  return new CanvasTexture(c);
}

function Rig({ progress, introStart }: SceneProps) {
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        PATH.map((k) => new Vector3(...k.pos)),
        false,
        "centripetal",
      ),
    [],
  );
  const look = useRef(new Vector3(0, 0.8, 6));
  const tmp = useMemo(() => new Vector3(), []);
  const { scene } = useThree();
  const bg = useMemo(() => GREY.clone(), []);

  useFrame(({ camera, pointer }, delta) => {
    const p = progress.current;
    const intro = introAt(introStart.current);
    curve.getPoint(easeRemap(p), tmp);
    tmp.z += 4 * (1 - range(intro, 1.5 / 3.5, 1)); // lướt tới z 24 → 20
    camera.position.lerp(tmp, damp(3, delta));
    const [x, y, z] = lookAt(p);
    tmp.set(x + pointer.x * 0.4, y, z);
    look.current.lerp(tmp, damp(3, delta));
    camera.lookAt(look.current);
    bg.copy(GREY).lerp(MIST, range(intro, 0.05, 0.85));
    scene.background = bg;
    (scene.fog as Fog | null)?.color.copy(bg);
  });
  return <fog attach="fog" args={["#BDB8B3", 8, 55]} />;
}

function Sky({ introStart, progress }: SceneProps) {
  const sun = useRef<Sprite>(null);
  const hemi = useRef<HemisphereLight>(null);
  const dir = useRef<DirectionalLight>(null);
  const tex = useRadialTexture("rgba(247,201,169,1)", "rgba(247,201,169,0)");
  useFrame(() => {
    const k = range(introAt(introStart.current), 0.2 / 3.5, 3 / 3.5);
    if (sun.current) sun.current.position.y = -2 + 5 * k + 5 * progress.current;
    if (hemi.current) hemi.current.intensity = 0.2 + 0.8 * k;
    if (dir.current) dir.current.intensity = 0.2 + 1.2 * k;
  });
  return (
    <>
      <hemisphereLight ref={hemi} args={["#FFF4E8", "#4F7D4A", 0.2]} />
      <directionalLight ref={dir} position={[0, 6, -30]} color="#F7C9A9" />
      <sprite ref={sun} position={[0, -2, -70]} scale={18}>
        <spriteMaterial
          map={tex}
          blending={AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </sprite>
    </>
  );
}

function Mist({ introStart, progress, count }: SceneProps & { count: number }) {
  const group = useRef<Group>(null);
  const tex = useRadialTexture("rgba(246,239,231,0.9)", "rgba(246,239,231,0)");
  useFrame(({ clock }) => {
    const intro = range(introAt(introStart.current), 0.8 / 3.5, 3 / 3.5);
    const o = 0.9 - 0.7 * range(progress.current, 0, 0.12);
    group.current?.children.forEach((m, i) => {
      const side = i % 2 ? 1 : -1;
      m.position.x =
        side * (2 + i + intro * 6) +
        Math.sin(clock.elapsedTime * 0.1 + i) * 1.5;
      // biome-ignore lint/suspicious/noExplicitAny: material của mesh sương
      (m as any).material.opacity = o * (1 - 0.5 * intro);
    });
  });
  return (
    <group ref={group}>
      {Array.from({ length: count }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: danh sách cố định
        <mesh key={i} position={[0, 1.5, 16 - i * 4]}>
          <planeGeometry args={[14, 5]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}

// Lá sen: đĩa khuyết 1 múi, tâm lõm.
function padGeometry() {
  const g = new CircleGeometry(1, 28, 0.35, Math.PI * 2 - 0.35);
  g.rotateX(-Math.PI / 2);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const r = Math.hypot(pos.getX(i), pos.getZ(i));
    pos.setY(i, 0.12 * r * r - 0.04);
  }
  g.computeVertexNormals();
  return g;
}

function Pads({ count }: { count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const geo = useMemo(padGeometry, []);
  useLayoutEffect(() => {
    {
      const m = ref.current;
      if (!m) return;
      const o = new Object3D();
      for (let i = 0; i < count; i++) {
        // phân bố hai bên lộ trình, tránh hành lang camera |x| < 2
        const z = 22 - (i / count) * 80 + Math.sin(i * 7.1) * 2;
        const side = i % 2 ? 1 : -1;
        o.position.set(side * (2.2 + ((i * 3.7) % 7)), 0.02, z);
        o.rotation.set(0, i * 2.3, 0);
        o.scale.setScalar(0.5 + ((i * 0.37) % 0.6));
        o.updateMatrix();
        m.setMatrixAt(i, o.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
    }
  }, [count]);
  return (
    <instancedMesh ref={ref} args={[geo, undefined, count]}>
      <meshStandardMaterial color="#4F7D4A" roughness={0.8} side={DoubleSide} />
    </instancedMesh>
  );
}

function Photo({
  src,
  position,
  rotation = [0, 0, 0],
  size = 1.2,
  onClick,
}: {
  src?: string;
  position: Vec3;
  rotation?: Vec3;
  size?: number;
  onClick?: () => void;
}) {
  const tex = useSafeTexture(src);
  const cursor = (c: string) => {
    if (onClick) document.body.style.cursor = c;
  };
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mesh three.js; ảnh cũng bấm được qua lưới HTML
    <mesh
      position={position}
      rotation={rotation}
      onClick={onClick}
      onPointerOver={() => cursor("pointer")}
      onPointerOut={() => cursor("")}
    >
      <planeGeometry args={[size, size * (4 / 3)]} />
      <meshBasicMaterial
        // key: material tạo khi map=null không tự recompile shader khi texture về.
        key={tex?.uuid ?? "none"}
        map={tex}
        color={tex ? "#FFFFFF" : "#E8DDD2"}
        side={DoubleSide}
        toneMapped={false}
      />
    </mesh>
  );
}

function PortraitPads({ progress, images }: SceneProps) {
  const l = useRef<Group>(null);
  const r = useRef<Group>(null);
  useFrame(() => {
    const x = 2.4 - 1.1 * range(progress.current, 0.25, 0.38); // hai lá xích lại gần
    l.current?.position.setX(-x);
    r.current?.position.setX(x);
  });
  const geo = useMemo(padGeometry, []);
  return (
    <>
      {[l, r].map((ref, i) => (
        <group
          key={i === 0 ? "groom" : "bride"}
          ref={ref}
          position={[0, 0, -9]}
        >
          <mesh geometry={geo} scale={1.4}>
            <meshStandardMaterial
              color="#4F7D4A"
              roughness={0.8}
              side={DoubleSide}
            />
          </mesh>
          <Photo
            src={images[i + 1]}
            position={[0, 0.85, 0]}
            rotation={[-0.35, 0, 0]}
            size={1}
          />
        </group>
      ))}
    </>
  );
}

function Dragonfly({ progress }: SceneProps) {
  const body = useRef<Group>(null);
  const wings = useRef<Group>(null);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        [
          [0, 2.2, 0],
          [-6, 2, -18],
          [0, 2.1, -23],
          [6, 2, -26],
          [4, 8, -30],
        ].map((v) => new Vector3(...(v as Vec3))),
      ),
    [],
  );
  const a = useMemo(() => new Vector3(), []);
  const b = useMemo(() => new Vector3(), []);
  useFrame(({ clock }) => {
    const p = progress.current;
    const u = range(p, 0.38, 0.6);
    curve.getPoint(u, a);
    curve.getPoint(Math.min(1, u + 0.01), b);
    body.current?.position.copy(a);
    if (u < 1) body.current?.lookAt(b);
    if (body.current) body.current.visible = p > 0.36 && p < 0.62;
    wings.current?.children.forEach((w, i) => {
      w.rotation.z =
        (i % 2 ? -1 : 1) * (0.3 + 0.5 * Math.sin(clock.elapsedTime * 40));
    });
  });
  return (
    <group ref={body} scale={0.5}>
      <mesh rotation-x={Math.PI / 2}>
        <capsuleGeometry args={[0.05, 0.9, 4, 8]} />
        <meshStandardMaterial color="#3E6B6B" />
      </mesh>
      <group ref={wings}>
        {[-0.15, -0.15, 0.1, 0.1].map((z, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: 4 cánh cố định
          <group key={i} position={[0, 0.03, z]}>
            <mesh position-x={(i % 2 ? -1 : 1) * 0.35}>
              <planeGeometry args={[0.7, 0.14]} />
              <meshBasicMaterial
                color="#DDEFEF"
                transparent
                opacity={0.5}
                side={DoubleSide}
              />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

function Reflections({ images, onPhoto }: SceneProps) {
  return (
    <>
      {reflectionIndex(images.length).map((idx, i) => {
        const { pos, rotY } = reflectionSlot(i);
        return (
          <Photo
            key={`${idx}-${images[idx]}`}
            src={images[idx]}
            position={pos}
            rotation={[0, rotY, 0]}
            size={1.1}
            onClick={() => onPhoto(idx)}
          />
        );
      })}
    </>
  );
}

function Pavilion() {
  const wood = (
    <meshStandardMaterial color="#8A6A4F" roughness={0.9} side={DoubleSide} />
  );
  return (
    <group position={[0, 0, -57]}>
      <mesh position-y={0.3}>
        <cylinderGeometry args={[3, 3, 0.2, 6]} />
        {wood}
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={a} position={[Math.cos(a) * 2.6, 1.6, Math.sin(a) * 2.6]}>
            <cylinderGeometry args={[0.1, 0.1, 2.6, 8]} />
            {wood}
          </mesh>
        );
      })}
      <mesh position-y={3.6}>
        <coneGeometry args={[3.8, 1.6, 6]} />
        <meshStandardMaterial
          color="#A8395A"
          roughness={0.8}
          side={DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.25, 5]}>
        <boxGeometry args={[1.2, 0.12, 5]} />
        {wood}
      </mesh>
    </group>
  );
}

function FlyingPetals({ progress, count }: SceneProps & { count: number }) {
  const ref = useRef<InstancedMesh>(null);
  const o = useMemo(() => new Object3D(), []);
  const t = useRef(0);
  useFrame((_, delta) => {
    const m = ref.current;
    if (!m) return;
    const p = progress.current;
    m.visible = p > 0.85;
    if (!m.visible) return;
    t.current += delta * (0.3 + range(p, 0.9, 1));
    for (let i = 0; i < count; i++) {
      const h = (t.current * 0.4 + i * 0.37) % 9; // vòng lặp độ cao 0..9
      const a = i * 2.4 + t.current * 0.5;
      const r = 2 + (i % 7) + h * 0.3;
      o.position.set(Math.cos(a) * r, h, -52 + Math.sin(a) * r);
      o.rotation.set(t.current + i, a, i);
      o.scale.setScalar(0.25);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={ref}
      args={[petalGeometry, undefined, count]}
      visible={false}
    >
      <meshStandardMaterial color="#D9577A" side={DoubleSide} roughness={0.7} />
    </instancedMesh>
  );
}

const DECOR: Vec3[] = [
  [-3, 0.1, 10],
  [3.5, 0.1, 4],
  [-3.5, 0.1, -3],
  [3, 0.1, -12],
  [-9, 0.1, -14],
  [9, 0.1, -20],
  [-8, 0.1, -28],
  [7, 0.1, -36],
  [-6, 0.1, -44],
  [6, 0.1, -48],
  [-4, 0.1, -54],
  [5, 0.1, -60],
];

// Mọi vật gần mặt nước — render 2 lần trên mobile (bản lật làm bóng).
function World(props: SceneProps & { mobile: boolean }) {
  const { progress, mobile } = props;
  return (
    <>
      <Lotus id="L0" position={LOTUS_POS.L0} scale={2} progress={progress} />
      <Lotus id="L1" position={LOTUS_POS.L1} progress={progress} />
      <Lotus id="L2" position={LOTUS_POS.L2} progress={progress} />
      <Lotus id="L3" position={LOTUS_POS.L3} progress={progress} />
      {DECOR.filter((_, i) => !mobile || i % 2 === 0).map((pos, i) => (
        <Lotus
          key={pos.join()}
          position={pos}
          scale={0.7}
          bloom={0.55 + (i % 3) * 0.15}
          progress={progress}
        />
      ))}
      <Pads count={mobile ? 30 : 60} />
      <PortraitPads {...props} />
      <Reflections {...props} />
      <Pavilion />
    </>
  );
}

function Mirror({ children }: { children: React.ReactNode }) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current)
      g.current.scale.y = -1 + 0.02 * Math.sin(clock.elapsedTime * 1.3);
  });
  return <group ref={g}>{children}</group>;
}

function Water({ reflector }: { reflector: boolean }) {
  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[200, 200]} />
      {reflector ? (
        <MeshReflectorMaterial
          resolution={512}
          mixStrength={0.8}
          blur={[300, 100]}
          mirror={0.6}
          color="#B9C9C1"
          roughness={0.9}
        />
      ) : (
        <meshStandardMaterial
          color="#B9C9C1"
          transparent
          opacity={0.75}
          roughness={0.9}
        />
      )}
    </mesh>
  );
}

export default function Scene(props: SceneProps) {
  const mobile = isMobile();
  const reflector = !mobile && (navigator.hardwareConcurrency ?? 0) >= 6;
  const cheapMirror = !reflector;
  return (
    <SceneCanvas
      fallback={null}
      camera={{ position: [0, 0.6, 24], fov: 50, near: 0.1, far: 200 }}
    >
      <Rig {...props} />
      <Sky {...props} />
      <Mist {...props} count={mobile ? 3 : 6} />
      <World {...props} mobile={mobile} />
      {cheapMirror && (
        <Mirror>
          <World {...props} mobile={mobile} />
        </Mirror>
      )}
      <Water reflector={reflector} />
      <Dragonfly {...props} />
      <FlyingPetals {...props} count={mobile ? 40 : 80} />
      <Sparkles
        count={mobile ? 10 : 20}
        scale={[4, 3, 4]}
        position={[0, 1.5, 0]}
        size={2}
        speed={0.2}
        color="#F7C9A9"
      />
      <Sparkles
        count={mobile ? 10 : 20}
        scale={[8, 4, 8]}
        position={[0, 2, -57]}
        size={2}
        speed={0.2}
        color="#F7C9A9"
      />
    </SceneCanvas>
  );
}
