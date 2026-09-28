"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useRef } from "react";
import {
  BufferAttribute,
  Color,
  DoubleSide,
  MathUtils,
  type Mesh,
  Shape,
  ShapeGeometry,
} from "three";
import { type BloomId, bloomAt, type Vec3 } from "./pond";

// Một geometry cánh sen dùng chung cho mọi bông + cánh bay: giọt nước, lòng cánh cong vào trong.
function makePetal() {
  const s = new Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(0.38, 0.25, 0.32, 0.78, 0, 1);
  s.bezierCurveTo(-0.32, 0.78, -0.38, 0.25, 0, 0);
  const g = new ShapeGeometry(s, 10);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const white = new Color("#FFFFFF");
  const pink = new Color("#D9577A");
  const c = new Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    pos.setZ(i, -0.9 * x * x - 0.18 * y * y);
    c.copy(white).lerp(pink, y ** 1.5);
    c.toArray(colors, i * 3);
  }
  g.setAttribute("color", new BufferAttribute(colors, 3));
  g.computeVertexNormals();
  return g;
}
export const petalGeometry = makePetal();

const RINGS = [10, 8, 6]; // r=0 vòng ngoài (mở trước), r=2 vòng trong (mở sau)

type Props = {
  position: Vec3;
  scale?: number;
  progress: RefObject<number>;
  id?: BloomId; // theo scroll
  bloom?: number; // cố định (sen trang trí)
};

export function Lotus({
  position,
  scale = 1,
  progress,
  id,
  bloom = 0.8,
}: Props) {
  const petals = useRef<Mesh[][]>(RINGS.map(() => []));
  const bump = useRef(-10);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (Number.isNaN(bump.current)) bump.current = t;
    // Hover sen trang trí → nở thêm 0.15 rồi khép lại trong 1.2s.
    const extra =
      0.15 *
      Math.max(0, Math.sin(Math.min(1, (t - bump.current) / 1.2) * Math.PI));
    const b = Math.min(1, (id ? bloomAt(id, progress.current) : bloom) + extra);
    petals.current.forEach((ring, r) => {
      const k = Math.min(1, Math.max(0, b * 1.4 - r * 0.2));
      for (const p of ring)
        p.rotation.x = MathUtils.lerp(0.1, 1.15 - r * 0.25, k);
    });
  });

  return (
    <group
      position={position}
      scale={scale}
      onPointerOver={
        id
          ? undefined
          : (e) => {
              e.stopPropagation();
              bump.current = Number.NaN; // useFrame gán lại = clock hiện tại
            }
      }
    >
      {RINGS.map((n, r) => (
        <group key={n} rotation-y={r * 0.3} scale={1 - r * 0.15}>
          {Array.from({ length: n }, (_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: số cánh cố định
            <group key={i} rotation-y={(i / n) * Math.PI * 2}>
              <mesh
                ref={(m) => {
                  if (m) petals.current[r][i] = m;
                }}
                geometry={petalGeometry}
              >
                <meshStandardMaterial
                  vertexColors
                  side={DoubleSide}
                  roughness={0.7}
                />
              </mesh>
            </group>
          ))}
        </group>
      ))}
      <mesh position-y={0.18}>
        <cylinderGeometry args={[0.16, 0.1, 0.16, 12]} />
        <meshStandardMaterial color="#C9C86A" roughness={0.8} />
      </mesh>
    </group>
  );
}
