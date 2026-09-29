"use client";

import { ImagesIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Peg } from "../art";
import { t } from "../tokens";

const TILT = [
  "-rotate-2",
  "rotate-1",
  "-rotate-1",
  "rotate-3",
  "-rotate-3",
  "rotate-2",
];
const SIZE = ["h-[52svh]", "h-[44svh]", "h-[48svh]"];

// C8 · Dây phơi ảnh: ghim section, dải ảnh chạy ngang theo cuộn; ảnh lắc theo vận tốc cuộn.
export function Clothesline({
  images,
  onView,
  onAll,
}: {
  images: string[];
  onView: (i: number) => void;
  onAll: () => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = track.current;
      if (reduced || !el) return;
      const dist = () => el.scrollWidth - window.innerWidth;
      const swing = gsap.quickTo("[data-photo]", "rotation", {
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
      });
      gsap.to(el, {
        x: () => -dist(),
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (s) =>
            swing(gsap.utils.clamp(-6, 6, -s.getVelocity() / 300)),
        },
      });
    },
    { scope, dependencies: [reduced, images.length] },
  );

  return (
    <section
      ref={scope}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-12"
    >
      <div className="px-6 lg:px-16">
        <h2 className={`${t.script} text-[52px] text-[#FFD68A] lg:text-[68px]`}>
          Khoảnh khắc
        </h2>
        <p className="mt-1 text-[#F4EAD9]/80">
          {images.length} tấm ảnh phơi trên dây, chạm để xem lớn.
        </p>
      </div>
      <div className={`relative mt-10 ${reduced ? "overflow-x-auto" : ""}`}>
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-3 h-[3px] bg-[repeating-linear-gradient(90deg,#B89B72_0_6px,#9C7F58_6px_8px)] shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
        />
        <div
          ref={track}
          className="flex w-max items-start gap-8 px-6 pt-3 lg:gap-12 lg:px-16"
        >
          {images.map((src, i) => (
            <figure key={src} className="relative shrink-0 snap-center">
              <Peg />
              <button
                data-photo
                type="button"
                onClick={() => onView(i)}
                aria-label={`Mở ảnh ${i + 1}/${images.length}`}
                className={`block origin-top bg-[#FBF5EA] p-2.5 pb-9 shadow-[0_24px_36px_-18px_rgba(0,0,0,0.85)] ${TILT[i % TILT.length]}`}
              >
                {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                <img
                  src={src}
                  alt={`Khoảnh khắc ${i + 1}`}
                  loading="lazy"
                  className={`aspect-[4/5] w-auto object-cover ${SIZE[i % SIZE.length]}`}
                />
              </button>
            </figure>
          ))}
          <div className="flex h-[44svh] shrink-0 items-center pr-10">
            <button type="button" onClick={onAll} className={t.btn}>
              <ImagesIcon className="size-5" />
              Xem trọn album
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
