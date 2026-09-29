"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Glass } from "../art";
import { t } from "../tokens";

const LAYERS = [
  { color: "#F2E6CF", h: 30 },
  { color: "#7A4E2E", h: 34 },
  { color: "#E9DCC4", h: 16 },
];

const STORY = [
  {
    layer: "Tầng sữa",
    title: "Gặp gỡ",
    text: "Ngọt ngào mà chẳng ai để ý, như lần đầu tụi mình ngồi chung một bàn ở quán quen.",
  },
  {
    layer: "Tầng cà phê",
    title: "Thương",
    text: "Có những ngày đậm đà, có cả ngày hơi đắng, nhưng lúc nào cũng muốn thêm một ly nữa.",
  },
  {
    layer: "Tầng bọt",
    title: "Về chung nhà",
    text: "Và phần trên cùng nhẹ tênh: tụi mình quyết định cưới.",
  },
] as const;

// C4 · Bạc xỉu ba tầng: cuộn tới mốc nào, ly dâng tới tầng đó (desktop ghim ly).
export function BacXiu({
  images,
  onView,
}: {
  images: (string | undefined)[];
  onView: (i: number) => void;
}) {
  const scope = useRef<HTMLElement>(null);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        gsap.set(layers.current, { scaleY: 0 });
        const steps = gsap.utils.toArray<HTMLElement>(
          "[data-story]",
          scope.current,
        );
        steps.forEach((step, i) => {
          gsap.to(layers.current[i], {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: step,
              start: "top 70%",
              end: "center 50%",
              scrub: 0.6,
            },
          });
        });
        ScrollTrigger.create({
          trigger: scope.current?.querySelector("[data-story-list]"),
          start: "top 18%",
          end: "bottom 70%",
          pin:
            scope.current?.querySelector<HTMLElement>("[data-glass]") ??
            undefined,
          pinSpacing: false,
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [reduced] },
  );

  return (
    <section ref={scope} className="mx-auto w-[min(92vw,1080px)] py-20">
      <div
        data-rise
        className="mb-14 flex items-baseline justify-between gap-4 border-b border-dashed border-[#F2EEE3]/25 pb-4"
      >
        <h2 className={`${t.chalk} text-[30px] sm:text-[40px]`}>
          Bạc xỉu ba tầng
        </h2>
        <span className={`${t.chalkY} text-[20px]`}>vô giá</span>
      </div>
      <div className="lg:grid lg:grid-cols-[300px_1fr] lg:gap-20">
        <div className="hidden lg:block">
          <div data-glass className="pt-10">
            <Glass
              layers={LAYERS}
              className="mx-auto h-[380px] w-[240px]"
              layerRef={(i) => (el) => {
                layers.current[i] = el;
              }}
            />
          </div>
        </div>
        <ol data-story-list className="flex flex-col gap-24">
          {STORY.map((s, k) => {
            const img = images[k];
            return (
              <li
                key={s.title}
                data-story
                data-rise
                className="grid gap-6 sm:grid-cols-[1fr_1.1fr] sm:items-center"
              >
                {img && (
                  <button
                    type="button"
                    onClick={() => onView(3 + k)}
                    aria-label={`Xem lớn ảnh ${s.title}`}
                    className={`block overflow-hidden rounded-xl shadow-[0_30px_50px_-24px_rgba(0,0,0,0.85)] ${k % 2 ? "sm:order-2" : ""}`}
                  >
                    {/* biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử" */}
                    <img
                      src={img}
                      alt={s.title}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-[1.03]"
                    />
                  </button>
                )}
                <div>
                  <p className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="h-3 w-8 rounded-sm"
                      style={{ backgroundColor: LAYERS[k].color }}
                    />
                    <span className={`${t.label} text-[#F2EEE3]/70`}>
                      {s.layer}
                    </span>
                  </p>
                  <h3
                    className={`${t.chalkY} mt-3 text-[34px] leading-tight sm:text-[40px]`}
                  >
                    {s.title}
                  </h3>
                  <p className={`mt-3 max-w-[40ch] ${t.muted}`}>{s.text}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
