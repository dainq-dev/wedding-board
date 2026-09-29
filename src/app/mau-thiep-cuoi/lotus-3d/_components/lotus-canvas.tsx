"use client";

import dynamic from "next/dynamic";
import type { SceneProps } from "./scene";

// Fallback (không WebGL / reduced-motion / đang tải): trời bình minh + mặt nước bằng gradient.
// Ảnh cưới vẫn hiện đủ vì <PhotoSlot> tự hiện <img> khi không có lớp WebGL.
export function DawnFallback() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-[linear-gradient(180deg,#D6DDE3_0%,#F3E4DA_42%,#F9D6BA_58%,#DCD8CE_60%,#C9D2CC_100%)]"
    >
      <div className="absolute inset-x-0 top-[48%] h-1/4 bg-[radial-gradient(ellipse_at_50%_40%,rgba(255,236,210,0.9),transparent_65%)]" />
    </div>
  );
}

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <DawnFallback />,
});

export function LotusCanvas(props: Omit<SceneProps, "fallback">) {
  return <Scene {...props} fallback={<DawnFallback />} />;
}
