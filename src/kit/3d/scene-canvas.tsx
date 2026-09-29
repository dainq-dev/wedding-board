"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, type CanvasProps } from "@react-three/fiber";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/kit/use-reduced-motion";

const hasWebGL = () => {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
};

type Props = CanvasProps & { fallback: React.ReactNode; className?: string };

// Canvas cố định sau nội dung. Không WebGL / reduced-motion → render `fallback`.
export function SceneCanvas({
  fallback,
  className = "",
  children,
  ...props
}: Props) {
  const reduced = useReducedMotion();
  const [ok, setOk] = useState<boolean | null>(null);
  const [visible, setVisible] = useState(true);
  const [dpr, setDpr] = useState<number | null>(null);

  useEffect(() => {
    setOk(hasWebGL());
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (ok === null) return null;
  if (!ok || reduced) return <>{fallback}</>;

  const mobile = window.matchMedia("(max-width: 768px)").matches;
  return (
    <div className={`fixed inset-0 -z-10 ${className}`} aria-hidden>
      <Canvas
        dpr={dpr ?? [1, mobile ? 1.5 : 2]}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: !mobile, powerPreference: "high-performance" }}
        {...props}
      >
        {/* FPS tụt → hạ dpr về 1 thay vì giật (spec §10). */}
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        {children}
      </Canvas>
    </div>
  );
}

export const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 768px)").matches;
