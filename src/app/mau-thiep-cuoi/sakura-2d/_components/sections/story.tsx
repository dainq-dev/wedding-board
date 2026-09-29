import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { onceEnter } from "../reveal";
import { Flower } from "../svg/decor";
import { t } from "../tokens";

// Lời + năm viết sẵn trong mẫu (spec §5 C4) — không lấy từ data.
const MILESTONES = [
  {
    year: "2019",
    title: "Lần đầu gặp",
    text: "Một buổi chiều mưa, hai người lạ trú chung dưới một mái hiên.",
    img: 3,
  },
  {
    year: "2022",
    title: "Thương nhau",
    text: "Rồi mỗi mùa hoa nở, đều có nhau.",
    img: 4,
  },
  {
    year: "2025",
    title: "Lời hứa",
    text: "Và hôm nay, chúng mình muốn đi cùng nhau thật lâu.",
    img: 5,
  },
] as const;

// C4 · Chuyện tình: timeline dọc bám cành cây, hoa là điểm mốc, zig-zag ảnh/trái phải.
export function StorySection({ images }: { images: (string | undefined)[] }) {
  const section = useRef<HTMLElement>(null);
  const flowers = useRef<(HTMLSpanElement | null)[]>([]);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      MILESTONES.forEach((_, i) => {
        const el = flowers.current[i];
        if (!el) return;
        onceEnter(el, () => {
          fadeUp(`.c4-body-${i}`, { stagger: 0 });
          const img = section.current?.querySelector<HTMLElement>(
            `.c4-img-${i}`,
          );
          if (img) clipReveal(img);
          // Ngoại lệ ease duy nhất của mẫu: hoa nở back.out(1.4) (spec §5).
          if (reduced || !el.firstElementChild) return;
          gsap.from(el.firstElementChild, {
            scale: 0,
            rotation: -30,
            duration: 0.5,
            ease: "back.out(1.4)",
          });
        });
      });
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      ref={section}
      aria-label="Chuyện của chúng mình"
      className="relative flex min-h-[150svh] items-center justify-center py-24"
    >
      <div className={`${t.col}`}>
        <h2 className={`${t.heading} text-center`}>Chuyện của chúng mình</h2>

        <div className="mt-12 flex flex-col gap-16">
          {MILESTONES.map((m, i) => {
            const img = images[m.img];
            const flipped = i % 2 === 1;
            return (
              <div
                key={m.year}
                className={`flex flex-col gap-3 ${flipped ? "lg:flex-row-reverse" : "lg:flex-row"} lg:items-center lg:gap-5`}
              >
                <span
                  ref={(el) => {
                    flowers.current[i] = el;
                  }}
                  aria-hidden="true"
                  className={`-ml-10 flex shrink-0 items-center gap-2 lg:-ml-14 ${flipped ? "lg:order-2" : ""}`}
                >
                  <Flower size={26} />
                  <span aria-hidden="true" className="h-px w-6 bg-[#F4B6C2]" />
                </span>

                <div
                  className={`w-full lg:w-[55%] ${flipped ? "lg:order-1" : ""}`}
                >
                  {img ? (
                    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                    <img
                      src={img}
                      width={300}
                      height={375}
                      alt={`Ảnh chuyện tình: ${m.title}`}
                      className={`c4-img-${i} aspect-4/5 w-full rounded-2xl object-cover`}
                    />
                  ) : null}
                </div>

                <div
                  className={`${i === 0 ? "c4-body-0" : i === 1 ? "c4-body-1" : "c4-body-2"} ${flipped ? "lg:text-right" : ""}`}
                >
                  <p className={`${t.caption} text-[#B4475F]`}>
                    {m.year} · {m.title}
                  </p>
                  <p className="mt-1">{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
