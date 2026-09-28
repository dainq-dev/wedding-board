"use client";

import dynamic from "next/dynamic";
import { isMobile, SceneCanvas } from "@/kit/3d/scene-canvas";
import type { SceneProps } from "./scene";

const Scene = dynamic(() => import("./scene"), { ssr: false });

export function ForestCanvas({
  fallback,
  ...props
}: Omit<SceneProps, "mobile"> & { fallback: React.ReactNode }) {
  return (
    <SceneCanvas
      fallback={fallback}
      camera={{ fov: 60, near: 0.1, far: 80, position: [0, 1.6, 0] }}
    >
      <Scene {...props} mobile={isMobile()} />
    </SceneCanvas>
  );
}
