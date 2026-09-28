"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { SceneProps } from "./scene";

const Scene = dynamic(() => import("./scene"), { ssr: false });

// null = chưa biết (SSR / lần render đầu). SceneCanvas cũng tự kiểm tra, đây để HTML đổi bố cục.
export function useThreeD() {
  const reduced = useReducedMotion();
  const [gl, setGl] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      setGl(!!document.createElement("canvas").getContext("webgl2"));
    } catch {
      setGl(false);
    }
  }, []);
  return gl === null ? null : gl && !reduced;
}

export const PETAL_PATH = "M12 0C20 6 20 22 12 32C4 22 4 6 12 0Z";

// Fallback: minh hoạ sen màu nước cố định dưới màn hình + (chỉ khi không WebGL) 24 cánh sen rơi chậm.
function Fallback() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (reduced) return;
      // ponytail: GSAP thay cho keyframes `lotus-3d-drift` trong globals.css (không được sửa file chung).
      for (const el of gsap.utils.toArray<HTMLElement>(
        "[data-petal]",
        root.current,
      )) {
        gsap.fromTo(
          el,
          { y: "-10vh", x: 0, rotate: 0 },
          {
            y: "110vh",
            x: gsap.utils.random(-60, 60),
            rotate: gsap.utils.random(-360, 360),
            duration: gsap.utils.random(14, 24),
            delay: gsap.utils.random(-24, 0),
            ease: "none",
            repeat: -1,
          },
        );
      }
    },
    { scope: root, dependencies: [reduced] },
  );
  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,#F7C9A9_0%,#F6EFE7_55%)]" />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 160"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-x-0 bottom-0 h-[40vh] w-full opacity-70 blur-[1px]"
      >
        <ellipse
          cx="200"
          cy="150"
          rx="260"
          ry="30"
          fill="#B9C9C1"
          opacity="0.6"
        />
        <ellipse
          cx="90"
          cy="130"
          rx="70"
          ry="16"
          fill="#4F7D4A"
          opacity="0.45"
        />
        <ellipse
          cx="320"
          cy="136"
          rx="60"
          ry="14"
          fill="#4F7D4A"
          opacity="0.4"
        />
        {[-50, -25, 0, 25, 50].map((a) => (
          <path
            key={a}
            d="M200 130C230 100 222 60 200 30C178 60 170 100 200 130Z"
            fill="#D9577A"
            opacity="0.55"
            transform={`rotate(${a} 200 130)`}
          />
        ))}
      </svg>
      {!reduced &&
        Array.from({ length: 24 }, (_, i) => (
          <svg
            aria-hidden="true"
            // biome-ignore lint/suspicious/noArrayIndexKey: danh sách cố định
            key={i}
            data-petal
            viewBox="0 0 24 32"
            className="absolute top-0 size-4 fill-[#D9577A]/60"
            style={{ left: `${(i * 41) % 100}%` }}
          >
            <path d={PETAL_PATH} />
          </svg>
        ))}
    </div>
  );
}

export function LotusCanvas({
  mode,
  ...props
}: SceneProps & { mode: boolean | null }) {
  if (mode === null) return null;
  return mode ? <Scene {...props} /> : <Fallback />;
}
