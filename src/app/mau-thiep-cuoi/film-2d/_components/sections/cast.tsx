"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import type { Person, WeddingData } from "@/wedding/types";
import { Clapper } from "../svg/clapper";
import { t } from "../tokens";

function ActorCard({
  side,
  person,
  img,
  align,
}: {
  side: string;
  person: Person;
  img?: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`flex min-w-0 items-stretch gap-4 ${align === "right" ? "flex-row-reverse" : ""}`}
    >
      {img && (
        <div className={`w-[46%] shrink-0 ${t.frame}`}>
          {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
          <img
            src={img}
            alt={`Chân dung ${person.name} — ${side}`}
            className={`aspect-3/4 w-full ${t.photo}`}
          />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className={`${t.label} tracking-[0.3em]`}>Trong vai</p>
        <p className={`${t.scene} mt-0.5 !text-[#F5F5F0]`}>{side}</p>
        <p
          className={`${t.display} mt-2 text-[28px] leading-[1.15] text-[#F5F5F0] break-words`}
        >
          {person.name}
        </p>
        <p className={`${t.label} mt-1 break-words line-clamp-3`}>
          {person.address}
        </p>
      </div>
    </div>
  );
}

// C3 · Hai "diễn viên chính" — ghim 150svh; thẻ trai trái / gái phải (A3 đổi
// hướng clip), cuối cảnh cắt sang C4 (autoAlpha T2).
export function Cast({ data }: { data: WeddingData }) {
  const sec = useRef<HTMLElement>(null);
  const groom = useRef<HTMLDivElement>(null);
  const bride = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (!sec.current || !groom.current || !bride.current) return;
      if (reduced) {
        clipReveal(groom.current, { duration: 0.3 });
        fadeUp(bride.current, { duration: 0.3 });
        return;
      }
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec.current,
          start: "top top",
          end: "+=50%",
          pin: true,
          pinSpacing: true,
          scrub: 0.4,
        },
      });
      // clipReveal của kit chỉ clip từ dưới → cảnh này cần từ trái/phải (spec §5 C3).
      tl.fromTo(
        groom.current,
        { clipPath: "inset(0 100% 0 0)" },
        { clipPath: "inset(0 0% 0 0)", duration: 0.35, ease: "expo.out" },
        0,
      );
      tl.fromTo(
        bride.current,
        { clipPath: "inset(0 0 0 100%)" },
        { clipPath: "inset(0 0 0 0%)", duration: 0.35, ease: "expo.out" },
        0.35,
      );
      tl.to(sec.current, { autoAlpha: 0, duration: 0.15 }, 1.45);
    },
    { dependencies: [reduced] },
  );

  return (
    <section
      ref={sec}
      data-lb="21:9"
      className="relative flex min-h-[100svh] items-center justify-center bg-[#0D0D0D]"
    >
      <div className="mx-auto w-[min(90vw,560px)] py-[16svh]">
        <p className={`${t.scene} flex items-center gap-2`}>
          <Clapper /> Cảnh 02 · Diễn viên chính
        </p>
        <div ref={groom} className="mt-6">
          <ActorCard
            side="Chú rể"
            person={data.groom}
            img={data.images[1]}
            align="left"
          />
        </div>
        <hr className="my-6 border-[#262626]" />
        <div ref={bride} className="min-h-0">
          <ActorCard
            side="Cô dâu"
            person={data.bride}
            img={data.images[2]}
            align="right"
          />
        </div>
      </div>
    </section>
  );
}
