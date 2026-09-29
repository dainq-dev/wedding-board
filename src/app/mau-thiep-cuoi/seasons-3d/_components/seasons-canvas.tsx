"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <StaticTree />,
});

type Props = Omit<ComponentProps<typeof import("./scene").default>, "fallback">;

export function SeasonsCanvas(props: Props) {
  return <Scene {...props} fallback={<StaticTree />} />;
}

// Cây tĩnh 2 màu: hiện khi canvas chưa sẵn sàng / không WebGL / reduced-motion.
function StaticTree() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 flex items-start justify-center pt-[14svh] opacity-60"
    >
      {/* biome-ignore lint/a11y/noSvgWithoutTitle: trang trí, cha đã aria-hidden */}
      <svg viewBox="0 0 200 220" className="w-[min(70vw,360px)]" fill="none">
        <ellipse cx="100" cy="212" rx="96" ry="8" fill="#A7D7A0" />
        <path
          d="M100 212V120M100 150 70 110M100 135l32-38M70 110 52 80M70 110l8-40M132 97l20-30M132 97l-4-42"
          stroke="#7C5A3C"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <g fill="#F9A8D4">
          <circle cx="52" cy="72" r="22" />
          <circle cx="80" cy="58" r="26" />
          <circle cx="120" cy="50" r="28" />
          <circle cx="152" cy="62" r="22" />
          <circle cx="100" cy="86" r="24" />
        </g>
      </svg>
    </div>
  );
}
