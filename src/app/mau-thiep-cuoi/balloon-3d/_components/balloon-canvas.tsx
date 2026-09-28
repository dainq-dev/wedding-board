"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { SceneProps } from "./scene";

export function BalloonSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 140" className={className} aria-hidden="true">
      <path
        d="M50 4C24 4 8 24 8 48c0 26 26 44 34 58h16c8-14 34-32 34-58C92 24 76 4 50 4Z"
        fill="#EF6F6C"
      />
      <path
        d="M50 4c-10 0-18 20-18 44 0 26 8 44 10 58h16c2-14 10-32 10-58 0-24-8-44-18-44Z"
        fill="#FFFFFF"
      />
      <path
        d="M50 4c-4 0-7 20-7 44 0 26 3 44 4 58h6c1-14 4-32 4-58 0-24-3-44-7-44Z"
        fill="#3D84A8"
      />
      <path d="M42 106l-2 16M58 106l2 16" stroke="#6B4A33" strokeWidth="1.5" />
      <rect x="38" y="120" width="24" height="16" rx="3" fill="#9A6A45" />
    </svg>
  );
}

function CloudSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 80" className={className} aria-hidden="true">
      <path
        d="M30 70a24 24 0 0 1 4-47 32 32 0 0 1 60-8 26 26 0 0 1 46 10 22 22 0 0 1 30 45Z"
        fill="#FFFFFF"
        fillOpacity="0.85"
      />
    </svg>
  );
}

// Fallback §7: mây SVG parallax 3 lớp + khinh khí cầu SVG cố định (A12).
export function BalloonFallback({ onFallback }: { onFallback?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => onFallback?.(), [onFallback]);
  useGSAP(
    () => {
      if (reduced || !onFallback) return;
      gsap.utils.toArray<HTMLElement>("[data-layer]").forEach((el, i) => {
        gsap.to(el, {
          yPercent: -60 * (i + 1),
          ease: "none",
          scrollTrigger: { start: 0, end: "max", scrub: true },
        });
      });
      gsap.to("[data-float]", {
        y: -10,
        duration: 2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    },
    { scope: ref, dependencies: [reduced] },
  );
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {onFallback && (
        <>
          <div data-layer className="absolute inset-x-0 top-[20%] h-[300%]">
            <CloudSvg className="absolute left-[-10%] top-[10%] w-48 opacity-70" />
            <CloudSvg className="absolute right-[-5%] top-[35%] w-40 opacity-70" />
          </div>
          <div data-layer className="absolute inset-x-0 top-[40%] h-[300%]">
            <CloudSvg className="absolute left-[30%] top-[15%] w-64" />
            <CloudSvg className="absolute right-[10%] top-[45%] w-56" />
          </div>
          <div data-layer className="absolute inset-x-0 top-[60%] h-[300%]">
            <CloudSvg className="absolute left-[-15%] top-[20%] w-80" />
            <CloudSvg className="absolute right-[-10%] top-[50%] w-72" />
          </div>
        </>
      )}
      <div
        data-float
        className="absolute left-1/2 top-[8%] w-24 -translate-x-1/2 lg:w-32"
      >
        <BalloonSvg />
      </div>
    </div>
  );
}

const Scene = dynamic(() => import("./scene"), {
  ssr: false,
  loading: () => <BalloonFallback />,
});

export function BalloonCanvas(
  props: Omit<SceneProps, "fallback"> & { onFallback: () => void },
) {
  const { onFallback, ...rest } = props;
  return (
    <Scene {...rest} fallback={<BalloonFallback onFallback={onFallback} />} />
  );
}
