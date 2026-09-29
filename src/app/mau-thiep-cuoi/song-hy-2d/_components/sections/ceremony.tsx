"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp } from "@/kit/presets";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { Cloud, CornerOrnament } from "../decor";
import { t } from "../tokens";

function CircularPortrait({
  src,
  side,
  name,
}: {
  src: string | undefined;
  side: string;
  name: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative size-36 lg:size-44">
        <span
          aria-hidden="true"
          className="absolute -inset-2 rounded-full border border-[#D4A24C]/60"
        />
        {src ? (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            src={src}
            width={352}
            height={352}
            alt={`Chân dung ${side.toLowerCase()} ${name}`}
            className="size-full rounded-full border-2 border-[#D4A24C] object-cover"
          />
        ) : (
          <span className="block size-full rounded-full border-2 border-[#D4A24C] bg-[#F7E6C4]" />
        )}
      </div>
      <p className={`${t.label} mt-5`}>{side}</p>
      <p className="font-(family-name:--font-display) mt-1 text-[22px] leading-tight break-words lg:text-[26px]">
        {name}
      </p>
    </div>
  );
}

// C2 + C3 + C6 · Lễ Thành Hôn, hai khung tròn nhà trai/nhà gái, hai lễ (spec §4).
export function CeremonySection({
  groom,
  groomAddress,
  groomImg,
  bride,
  brideAddress,
  brideImg,
  dateLabel,
}: {
  groom: string;
  groomAddress: string;
  groomImg: string | undefined;
  bride: string;
  brideAddress: string;
  brideImg: string | undefined;
  dateLabel: string;
}) {
  const section = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      if (reduced) return;
      const imgs = gsap.utils.toArray<HTMLElement>(".sh-portrait");
      const tl = gsap.timeline({
        scrollTrigger: { trigger: section.current, start: "top 75%" },
      });
      imgs.forEach((img, i) => {
        tl.add(clipReveal(img), i * 0.25);
      });
      tl.add(fadeUp(".sh-ceremony", { stagger: 0.12 }), 0.1);
    },
    { scope: section, dependencies: [reduced] },
  );

  return (
    <section
      ref={section}
      aria-label="Lễ thành hôn và đôi lứa"
      className="relative flex min-h-[100svh] flex-col items-center justify-center py-24"
    >
      <Cloud className="absolute top-16 right-2 w-24 text-[#D4A24C]/40 lg:right-[8vw]" />
      <div className={`${t.card} ${t.col} relative px-6 py-12 text-center`}>
        <CornerOrnament className="absolute top-4 left-4 size-8 text-[#D4A24C]" />
        <CornerOrnament className="absolute top-4 right-4 size-8 -scale-x-100 text-[#D4A24C]" />
        <p className={t.label}>Trân trọng kính mời</p>
        <h1 className="mt-6">
          <span className={`${t.name} block break-words`}>{groom}</span>
          <span className="my-2 block text-[24px] text-[#9B1B1E] lg:text-[32px]">
            &amp;
          </span>
          <span className={`${t.name} block break-words`}>{bride}</span>
        </h1>
        <p className={`${t.soft} italic mt-6`}>{dateLabel}</p>

        <div className="mt-12 grid grid-cols-2 gap-6 max-[360px]:grid-cols-1">
          <div className="sh-portrait">
            <CircularPortrait src={groomImg} side="Nhà trai" name={groom} />
          </div>
          <div className="sh-portrait">
            <CircularPortrait src={brideImg} side="Nhà gái" name={bride} />
          </div>
        </div>

        <div className="sh-ceremony mt-12 flex flex-col gap-4 text-left">
          <div className={t.shade}>
            <p className={`${t.label} px-5 pt-4`}>Lễ vu quy</p>
            <p className="px-5 pt-1 font-semibold">Tại tư gia nhà gái</p>
            <p className={`${t.soft} px-5 pb-4 text-[15px]`}>{brideAddress}</p>
          </div>
          <div className={t.shade}>
            <p className={`${t.label} px-5 pt-4`}>Lễ thành hôn</p>
            <p className="px-5 pt-1 font-semibold">Tại tư gia nhà trai</p>
            <p className={`${t.soft} px-5 pb-4 text-[15px]`}>{groomAddress}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
