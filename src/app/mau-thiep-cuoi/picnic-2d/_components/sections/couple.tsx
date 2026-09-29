"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { EASE, fadeUp } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const MILESTONES = [
  {
    title: "Khai vị",
    text: "Gặp nhau trong một chuyến dã ngoại, cùng chia một giỏ bánh.",
  },
  {
    title: "Món chính",
    text: "Yêu nhau qua những buổi picnic cuối tuần kéo dài tới hoàng hôn.",
  },
  {
    title: "Tráng miệng",
    text: "Hôm nay, hai người quyết định đi cùng nhau suốt đời.",
  },
] as const;

// C2 + C3 + C4 · Tên trên thiệp menu, hai ảnh chân dung "dán" lên khăn,
// chuyện tình ba món theo thực đơn picnic (spec §5).
export function CoupleSection({
  groom,
  bride,
  groomImg,
  brideImg,
  images,
}: {
  groom: string;
  bride: string;
  groomImg: string | undefined;
  brideImg: string | undefined;
  images: string[];
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        const tl = gsap.timeline();
        tl.add(fadeUp(".pk-name", { stagger: 0.15 }));
        tl.add(
          gsap.from(".pk-portrait", {
            opacity: 0,
            scale: 0.6,
            rotate: () => gsap.utils.random(-6, 6),
            duration: 0.6,
            stagger: 0.2,
            ease: EASE.spring,
          }),
          "-=0.2",
        );
        tl.add(fadeUp(".pk-milestone", { stagger: 0.18 }), "-=0.1");
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Tên cô dâu chú rể và chuyện tình"
      className="relative flex min-h-[100svh] items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.card} text-center`}>
          <p className={t.label}>Trân trọng kính mời</p>
          <h1 className="mt-4">
            <span className={`${t.name} pk-name block break-words`}>
              {groom}
            </span>
            <span className={`${t.name} pk-name my-1 block text-[#F4A261]`}>
              &amp;
            </span>
            <span className={`${t.name} pk-name block break-words`}>
              {bride}
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { img: groomImg, side: "Chú rể", name: groom },
            { img: brideImg, side: "Cô dâu", name: bride },
          ].map(({ img, side, name }, i) => (
            <div
              key={side}
              className={`pk-portrait rounded-lg bg-white p-2 pb-8 shadow-[0_14px_30px_-14px_rgba(43,45,66,0.4)] ${i === 0 ? "-rotate-2" : "rotate-2"}`}
            >
              {img ? (
                // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                <img
                  src={img}
                  width={400}
                  height={400}
                  alt={`Chân dung ${side.toLowerCase()} ${name}`}
                  className="aspect-square w-full rounded-md object-cover"
                />
              ) : (
                <span className="block aspect-square w-full rounded-md bg-[#FFF1EE]" />
              )}
              <p className={`${t.label} mt-3 text-center`}>{side}</p>
              <p className="text-center font-bold break-words">{name}</p>
            </div>
          ))}
        </div>

        <div className={`${t.card}`}>
          <p className={`${t.title} text-center`}>Chuyện của hai đứa</p>
          <ol className="mt-5 flex flex-col gap-4">
            {MILESTONES.map((m, i) => {
              const img = images[3 + i];
              return (
                <li key={m.title} className="pk-milestone">
                  <p className={`${t.label}`}>{m.title}</p>
                  <p className="mt-1">{m.text}</p>
                  {img ? (
                    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                    <img
                      src={img}
                      width={480}
                      height={320}
                      alt={`Ảnh minh họa chuyện tình: ${m.title}`}
                      className="mt-3 aspect-3/2 w-full rounded-lg object-cover"
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
