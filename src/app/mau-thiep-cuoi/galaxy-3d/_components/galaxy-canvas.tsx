"use client";

import dynamic from "next/dynamic";
import type { SceneProps } from "./scene";

const Scene = dynamic(() => import("./scene"), { ssr: false });

// Nền 2D khi không có WebGL / reduced-motion (thay cho fallback-stars.webp).
export function StaticSky() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-10 bg-[#07061A] bg-[radial-gradient(ellipse_at_20%_30%,#2A1B5C_0%,transparent_55%),radial-gradient(ellipse_at_80%_70%,#3b2a7a_0%,transparent_50%),radial-gradient(1px_1px_at_10%_20%,#fff,transparent),radial-gradient(1px_1px_at_70%_40%,#fff,transparent),radial-gradient(1.5px_1.5px_at_40%_80%,#F4D58D,transparent),radial-gradient(1px_1px_at_85%_15%,#9B8CFF,transparent),radial-gradient(1px_1px_at_55%_60%,#fff,transparent)]"
    />
  );
}

export function GalaxyCanvas(props: Omit<SceneProps, "fallback">) {
  return <Scene {...props} fallback={<StaticSky />} />;
}
