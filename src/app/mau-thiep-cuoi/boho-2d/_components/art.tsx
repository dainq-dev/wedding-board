"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

export function Sun({ className = "" }: { readonly className?: string }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, index) => (
          <path
            // biome-ignore lint/suspicious/noArrayIndexKey: danh sách trang trí tĩnh, không đổi thứ tự
            key={index}
            d="M50 7v13"
            transform={`rotate(${index * 30} 50 50)`}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="23" fill="currentColor" />
    </svg>
  );
}

export function Pampas({ className = "" }: { readonly className?: string }) {
  const root = useRef<SVGSVGElement>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      if (reduced || !root.current) return;
      return gsap.to(root.current, {
        rotate: 4,
        transformOrigin: "bottom center",
        duration: 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <svg
      ref={root}
      viewBox="0 0 120 220"
      aria-hidden="true"
      className={className}
    >
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M52 220C58 145 50 78 20 8" strokeWidth="3" />
        <path d="M60 220C65 155 74 83 102 24" strokeWidth="3" />
        <path d="M66 220C63 126 62 47 59 4" strokeWidth="3" />
        {Array.from({ length: 17 }, (_, index) => {
          const y = 14 + index * 9;
          return (
            <path
              key={y}
              d={`M${39 + index / 2} ${y + 14}q20 -14 31 -3M${70 - index / 3} ${y + 8}q-18 -13 -30 -1`}
              strokeWidth="2"
              opacity="0.8"
            />
          );
        })}
      </g>
    </svg>
  );
}

export function Grain() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 h-full w-full opacity-[0.045] mix-blend-multiply"
    >
      <filter id="boho-2d-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" />
      </filter>
      <rect width="100%" height="100%" filter="url(#boho-2d-grain)" />
    </svg>
  );
}
