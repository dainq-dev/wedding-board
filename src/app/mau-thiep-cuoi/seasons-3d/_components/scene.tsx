"use client";

import { Line, Sparkles } from "@react-three/drei";
import { type ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { type RefObject, useEffect, useMemo, useRef } from "react";
import {
  Color,
  CylinderGeometry,
  type DirectionalLight,
  type Group,
  type HemisphereLight,
  type InstancedMesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  Object3D,
  Quaternion,
  Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { range } from "@/kit/3d/keyframes";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import { useSafeTexture } from "@/kit/3d/use-safe-texture";
import {
  BG,
  buildTree,
  FOLIAGE,
  GRASS,
  LEAF_SCALE,
  lerpStops,
  ORBIT_KFS,
  sampleOrbit,
  seasonAt,
  seasonColor,
} from "./season";
import { SeasonParticles } from "./season-particles";

type Refs = { progress: RefObject<number>; intro: RefObject<number> };
type Props = Refs & {
  images: string[];
  onPhoto: (i: number) => void;
  fallback: React.ReactNode;
};

const UP = new Vector3(0, 1, 0);
const weight = (s: number, i: number) => Math.max(0, 1 - Math.abs(s - i));

export default function Scene({ fallback, ...props }: Props) {
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{ position: [0, 3, 20], fov: 45 }}
      eventSource={document.body}
      eventPrefix="client"
    >
      <World {...props} />
    </SceneCanvas>
  );
}

function World({ progress, intro, images, onPhoto }: Omit<Props, "fallback">) {
  const mobile = useMemo(isMobile, []);
  const scene = useThree((s) => s.scene);
  const bg = useMemo(() => new Color(BG[0]), []);
  const hill = useRef<MeshStandardMaterial>(null);
  const hemi = useRef<HemisphereLight>(null);
  const sun = useRef<DirectionalLight>(null);
  const sparkles = useRef<Group>(null);

  useEffect(() => {
    scene.background = bg;
  }, [scene, bg]);

  useFrame(() => {
    const s = seasonAt(progress.current);
    seasonColor(BG, s, bg);
    if (hill.current) seasonColor(GRASS, s, hill.current.color);
    if (hemi.current) seasonColor(BG, s, hemi.current.color);
    if (sun.current)
      sun.current.intensity = lerpStops([1.2, 2.2, 1.4, 0.9, 1.4], s);
    if (sparkles.current) sparkles.current.visible = weight(s, 1) > 0.5;
  });

  const pics = images.filter(Boolean);
  return (
    <>
      <OrbitRig progress={progress} intro={intro} />
      <hemisphereLight ref={hemi} args={["#ffffff", "#8a7a5a", 1.4]} />
      <directionalLight ref={sun} position={[6, 12, 4]} color="#FFF7E0" />
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[12, 13, 1, 24]} />
        <meshStandardMaterial ref={hill} flatShading />
      </mesh>
      <Tree mobile={mobile} progress={progress} intro={intro}>
        {(tips) => {
          const album = pics.slice(3);
          // Lấy mẫu đều theo góc; nhiều ảnh hơn đầu cành thì dừng ở số đầu cành.
          const n = Math.min(album.length, tips.length);
          return album
            .slice(0, n)
            .map((src, i) => (
              <HangingPhoto
                key={src}
                url={src}
                at={tips[Math.floor((i * tips.length) / n)]}
                i={i}
                onClick={() => onPhoto(3 + i)}
              />
            ));
        }}
      </Tree>
      {pics.slice(1, 3).map((src, i) => (
        <Photo
          key={src}
          url={src}
          position={[i ? 1.5 : -1.5, 1.25, 1.2]}
          rotationY={i ? -0.17 : 0.17}
          onClick={() => onPhoto(1 + i)}
        />
      ))}
      <group ref={sparkles}>
        <Sparkles
          color="#FEF08A"
          size={3}
          count={mobile ? 30 : 60}
          scale={[7, 5, 7]}
          position={[0, 5.5, 0]}
        />
      </group>
      <SeasonParticles
        count={mobile ? 700 : 1500}
        progress={progress}
        intro={intro}
      />
    </>
  );
}

function OrbitRig({ progress, intro }: Refs) {
  const pos = useMemo(() => new Vector3(0, 3, 20), []);
  const look = useMemo(() => new Vector3(0, 3, 0), []);
  const s = useMemo(() => ({ pos: new Vector3(), look: new Vector3() }), []);
  useFrame(({ camera, pointer }, delta) => {
    sampleOrbit(ORBIT_KFS, progress.current, s);
    // Màn mở: r 20 → 16 (hệ số 1.25 → 1).
    s.pos.x *= 1 + 0.25 * (1 - intro.current);
    s.pos.z *= 1 + 0.25 * (1 - intro.current);
    s.pos.applyAxisAngle(UP, pointer.x * 0.14); // ±8°, thả chuột thì trôi về
    const k = 1 - Math.exp(-4 * delta);
    pos.lerp(s.pos, k);
    look.lerp(s.look, k);
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

function Tree({
  mobile,
  progress,
  intro,
  children,
}: Refs & {
  mobile: boolean;
  children: (tips: Vector3[]) => React.ReactNode;
}) {
  const depth = mobile ? 4 : 5;
  const leafCount = mobile ? 200 : 400;
  const bulbCount = mobile ? 60 : 120;

  const { trunk, leaves, bulbs, tips } = useMemo(() => {
    const branches = buildTree(42, depth);
    const q = new Quaternion();
    const dir = new Vector3();
    const parts = branches.map((b) => {
      dir.subVectors(b.end, b.start);
      const len = dir.length();
      const g = new CylinderGeometry(b.radius * 0.62, b.radius, len, 5);
      g.translate(0, len / 2, 0);
      g.applyQuaternion(q.setFromUnitVectors(UP, dir.normalize()));
      g.translate(b.start.x, b.start.y, b.start.z);
      return g;
    });
    const trunk = mergeGeometries(parts);
    for (const g of parts) g.dispose();

    // Tán lá quanh đầu cành, kèm khoảng cách tới gốc để đâm chồi từ thân ra ngọn.
    const ends = branches.filter((b) => b.depth >= depth - 1).map((b) => b.end);
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const leaves = Array.from({ length: leafCount }, (_, i) => {
      const e = ends[i % ends.length];
      const p = new Vector3(
        e.x + (rand() - 0.5) * 1.4,
        e.y + (rand() - 0.5) * 1.0,
        e.z + (rand() - 0.5) * 1.4,
      );
      return { p, d: p.length() / 9, s: 0.7 + rand() * 0.6 };
    });
    const bulbs = Array.from({ length: bulbCount }, (_, i) => {
      const b = branches[i % branches.length];
      return new Vector3().lerpVectors(b.start, b.end, rand());
    });
    // Đầu cành 2 tầng cuối, sắp theo góc quanh thân → World lấy mẫu đều để
    // ảnh treo phủ vòng tròn (camera bay vòng quanh cây qua 4 mùa).
    const tips = branches
      .filter((b) => b.depth >= depth - 2)
      .map((b) => b.end)
      .sort((a, b) => Math.atan2(a.x, a.z) - Math.atan2(b.x, b.z))
      .map((t) => t.clone().setY(Math.max(3, t.y - 1.2)));
    return { trunk, leaves, bulbs, tips };
  }, [depth, leafCount, bulbCount]);
  useEffect(() => () => trunk.dispose(), [trunk]);

  const leafMesh = useRef<InstancedMesh>(null);
  const leafMat = useRef<MeshStandardMaterial>(null);
  const bulbMesh = useRef<InstancedMesh>(null);
  const bulbMat = useRef<MeshBasicMaterial>(null);
  const tmp = useMemo(() => new Object3D(), []);

  useEffect(() => {
    const m = bulbMesh.current;
    if (!m) return;
    for (let i = 0; i < bulbs.length; i++) {
      tmp.position.copy(bulbs[i]);
      tmp.scale.setScalar(1);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  }, [bulbs, tmp]);

  useFrame(({ clock }) => {
    const p = progress.current;
    const s = seasonAt(p);
    const m = leafMesh.current;
    if (leafMat.current) seasonColor(FOLIAGE, s, leafMat.current.color);
    if (bulbMat.current)
      bulbMat.current.opacity =
        weight(s, 3) * (0.75 + 0.25 * Math.sin(clock.elapsedTime * 3));
    if (!m) return;
    const base = lerpStops(LEAF_SCALE, s) + 0.6 * range(p, 0.9, 1);
    const k = intro.current;
    for (let i = 0; i < leaves.length; i++) {
      const l = leaves[i];
      // Stagger đâm chồi: lá gần gốc mọc trước.
      const grow = Math.min(1, Math.max(0, (k * 1.6 - l.d * 0.6) / 1));
      tmp.position.copy(l.p);
      tmp.scale.setScalar(base * l.s * grow * 0.35);
      tmp.updateMatrix();
      m.setMatrixAt(i, tmp.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      <mesh geometry={trunk}>
        <meshStandardMaterial color="#7C5A3C" flatShading />
      </mesh>
      <instancedMesh
        ref={leafMesh}
        args={[undefined, undefined, leaves.length]}
      >
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial ref={leafMat} flatShading />
      </instancedMesh>
      <instancedMesh ref={bulbMesh} args={[undefined, undefined, bulbs.length]}>
        <sphereGeometry args={[0.05, 6, 4]} />
        <meshBasicMaterial
          ref={bulbMat}
          color="#FDE68A"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </instancedMesh>
      {children(tips)}
    </group>
  );
}

function usePointerCursor() {
  return {
    onPointerOver: () => {
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };
}

function Photo({
  url,
  position,
  rotationY,
  onClick,
}: {
  url: string;
  position: [number, number, number];
  rotationY: number;
  onClick: () => void;
}) {
  const tex = useSafeTexture(url);
  const cursor = usePointerCursor();
  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mesh R3F, không phải DOM; ảnh cũng xem được qua lưới HTML
    <mesh
      position={position}
      rotation-y={rotationY}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onClick();
      }}
      {...cursor}
    >
      <planeGeometry args={[0.9, 1.2]} />
      {/* key: material tạo khi map=null không tự recompile shader khi texture về. */}
      <meshBasicMaterial
        key={tex?.uuid ?? "none"}
        map={tex}
        color={tex ? "#ffffff" : "#f5f5f4"}
      />
    </mesh>
  );
}

function HangingPhoto({
  url,
  at,
  i,
  onClick,
}: {
  url: string;
  at: Vector3 | undefined;
  i: number;
  onClick: () => void;
}) {
  const g = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (g.current)
      g.current.rotation.z = Math.sin(clock.elapsedTime + i) * 0.05;
  });
  if (!at) return null;
  return (
    <group ref={g} position={at}>
      <Line
        points={[
          [0, 1.2, 0],
          [0, 0.6, 0],
        ]}
        color="#57534e"
        lineWidth={1}
      />
      <Photo
        url={url}
        position={[0, 0, 0]}
        rotationY={Math.PI}
        onClick={onClick}
      />
    </group>
  );
}
