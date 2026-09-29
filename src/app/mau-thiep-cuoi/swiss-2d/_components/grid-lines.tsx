"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";

export function GridLines({ dark = false }: { dark?: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () =>
      gsap.from(".swiss-grid-line", {
        scaleY: 0,
        transformOrigin: "top",
        duration: 0.6,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 82%" },
      }),
    { scope: root },
  );
  return (
    <div ref={root} aria-hidden="true" className="pointer-events-none absolute inset-0 grid grid-cols-4 px-4 lg:grid-cols-12 lg:px-12">
      {Array.from({ length: 13 }, (_, index) => (
        <i key={index} className={`swiss-grid-line border-l ${dark ? "border-[#262626]" : "border-[#d9d9d9]"}`} />
      ))}
    </div>
  );
}
