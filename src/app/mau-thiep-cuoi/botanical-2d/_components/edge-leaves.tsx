"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";

const LAYERS = ["top-10", "top-[34svh]", "bottom-8"] as const;

function Spray({
  side,
  className,
}: {
  side: "left" | "right";
  className: string;
}) {
  const flip = side === "right" ? "scale-x-[-1]" : "";
  return (
    <div
      className={`absolute ${side}-0 ${className} ${flip} flex w-[18vw] min-w-18 flex-col gap-1 opacity-70 lg:w-[22vw]`}
    >
      <span className="ml-[18%] h-20 w-px rotate-[-35deg] bg-[#5F7A5A]/45" />
      <span className="h-14 w-[65%] rotate-[-38deg] rounded-[100%_0_100%_0] bg-[#5F7A5A]/60 blur-[0.2px]" />
      <span className="ml-[22%] h-11 w-[56%] rotate-[20deg] rounded-[100%_0_100%_0] bg-[#C8D5B9]" />
      <span className="h-12 w-[70%] rotate-[-18deg] rounded-[100%_0_100%_0] bg-[#5F7A5A]/45" />
    </div>
  );
}

export function EdgeLeaves() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const layers = gsap.utils.toArray<HTMLElement>("[data-leaf-layer]");
      layers.forEach((layer, index) => {
        gsap.to(layer, {
          yPercent: -(10 + index * 14),
          ease: "none",
          scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden"
    >
      {LAYERS.map((position) => (
        <div key={position} data-leaf-layer>
          <Spray side="left" className={position} />
          <Spray side="right" className={position} />
        </div>
      ))}
    </div>
  );
}
