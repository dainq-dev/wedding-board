"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { fadeUp, float } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Palm } from "../decor";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const MILESTONES = [
  {
    title: "Chuyến đi đầu",
    text: "Hẹn nhau ở một bãi biển nhỏ, chung ô che nắng suốt buổi chiều.",
  },
  {
    title: "Mùa khô thứ ba",
    text: "Cùng nhau qua mấy chuyến đảo, chuyện tương lai nói dần mỗi đêm lửa trại.",
  },
  {
    title: "Hôm nay",
    text: "Và lần này, hai đứa chọn đi chung một hành trình dài.",
  },
] as const;

// C2 + C3 + C4 · Tên cô dâu chú rể, hai ảnh chân dung và chuyện tình ba mốc,
// tất cả là "đảo trắng" nổi trên nền cát vàng (spec §5).
export function CoupleSection({
  groom,
  bride,
  cover,
  groomImg,
  brideImg,
  images,
}: {
  groom: string;
  bride: string;
  cover: string | undefined;
  groomImg: string | undefined;
  brideImg: string | undefined;
  images: string[];
}) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        const tl = gsap.timeline();
        tl.add(fadeUp(".tr-name-line", { stagger: 0.15 }));
        tl.add(fadeUp(".tr-portrait", { stagger: 0.2 }), "-=0.3");
        tl.add(fadeUp(".tr-milestone", { stagger: 0.16 }), "-=0.2");
      });
      if (!reduced) {
        float(".tr-palm-l", { y: 0, rotation: 3, duration: 5 });
        float(".tr-palm-r", { y: 0, rotation: -3, duration: 6 });
      }
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      ref={section}
      aria-label="Tên cô dâu chú rể và chuyện tình"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-3 py-24"
    >
      <Palm className="tr-palm-l absolute -top-2 -left-6 w-36 opacity-90" />
      <Palm className="tr-palm-r absolute right-0 bottom-10 w-28 -scale-x-100 opacity-90" />

      <div className="mx-auto flex w-[min(92vw,540px)] flex-col gap-6">
        <div className={`${t.island} tr-name-line px-6 py-10 text-center`}>
          <p className={`${t.label} ${t.soft}`}>Trân trọng kính mời</p>
          <h1 className="mt-4 font-(family-name:--font-script) text-[44px] leading-[1.15] text-[#1E3A4C] break-words lg:text-[68px]">
            {groom}
            <span className={`${t.script} mx-2 text-[#C4502A]`}>&amp;</span>
            {bride}
          </h1>
          {cover ? (
            // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
            <img
              src={cover}
              width={520}
              height={390}
              alt={`Ảnh cưới của ${groom} và ${bride}`}
              className="mt-8 aspect-4/3 w-full rounded-2xl object-cover"
            />
          ) : null}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { img: groomImg, side: "Chú rể", name: groom },
            { img: brideImg, side: "Cô dâu", name: bride },
          ].map(({ img, side, name }) => (
            <div
              key={side}
              className={`${t.island} tr-portrait p-3 pb-6 text-center`}
            >
              {img ? (
                // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                <img
                  src={img}
                  width={400}
                  height={400}
                  alt={`Chân dung ${side.toLowerCase()} ${name}`}
                  className="aspect-square w-full rounded-full object-cover"
                />
              ) : (
                <span className="block aspect-square w-full rounded-full bg-[#E6F6F3]" />
              )}
              <p className={`${t.label} mt-4 ${t.soft}`}>{side}</p>
              <p className="text-[19px] font-bold break-words">{name}</p>
            </div>
          ))}
        </div>

        <div className={`${t.island} px-6 py-8`}>
          <p className={`${t.script} text-center text-[26px] text-[#1F7F74]`}>
            Chuyện của hai đứa
          </p>
          <ol className="mt-6 flex flex-col gap-6">
            {MILESTONES.map((m, i) => {
              const img = images[3 + i];
              return (
                <li key={m.title} className="tr-milestone">
                  <p className={`${t.label} ${t.soft}`}>{m.title}</p>
                  <p className="mt-1">{m.text}</p>
                  {img ? (
                    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                    <img
                      src={img}
                      width={480}
                      height={320}
                      alt={`Ảnh chuyện tình: ${m.title}`}
                      className={`mt-3 aspect-3/2 w-full rounded-xl object-cover ${
                        i % 2 ? "lg:translate-x-6" : "lg:-translate-x-6"
                      }`}
                    />
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
