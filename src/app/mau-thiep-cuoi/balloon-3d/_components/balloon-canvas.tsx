"use client";

import dynamic from "next/dynamic";
import type { SceneProps } from "./scene";

// Fallback (không WebGL / reduced-motion / đang tải): bầu trời giờ vàng bằng gradient.
// Ảnh cưới vẫn hiện đủ vì <PhotoSlot> tự hiện <img> khi không có lớp WebGL.
export function SkyFallback() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,#6EA7DB_0%,#A9C6E4_38%,#F7C59F_72%,#E39585_100%)]"
    >
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(ellipse_at_50%_100%,rgba(255,255,255,0.75),transparent_70%)]" />
    </div>
  );
}

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <SkyFallback />,
});

export function BalloonCanvas(props: Omit<SceneProps, "fallback">) {
  return <Scene {...props} fallback={<SkyFallback />} />;
}
