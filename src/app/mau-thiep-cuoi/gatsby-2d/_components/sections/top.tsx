"use client";

import { useRef } from "react";
import { useGSAP } from "@/kit/gsap";
import { OpenGate } from "@/kit/open-gate";
import { fadeUp, splitReveal } from "@/kit/presets";
import { Corner, Fan } from "../decor";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const STORY = [
  {
    year: "2018",
    title: "Gặp gỡ",
    text: "Một đêm vũ hội, hai ánh nhìn bắt gặp nhau giữa tiếng nhạc swing.",
  },
  {
    year: "2021",
    title: "Hẹn hò",
    text: "Những buổi tối dài bên ly champagne, kể nhau nghe giấc mơ lớn.",
  },
  {
    year: "2026",
    title: "Cầu hôn",
    text: "Và đêm nay, giấc mơ ấy có thêm một chương mới.",
  },
] as const;

function Portrait({
  img,
  side,
  name,
}: {
  img: string | undefined;
  side: string;
  name: string;
}) {
  return (
    <div className="gt-portrait text-center">
      {img ? (
        // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
        <img
          src={img}
          width={400}
          height={500}
          alt={`Chân dung ${side.toLowerCase()} ${name}`}
          className={`mx-auto aspect-4/5 w-full max-w-[220px] ${t.frame} p-2`}
        />
      ) : (
        <span
          aria-hidden="true"
          className={`mx-auto block aspect-4/5 w-full max-w-[220px] ${t.frame}`}
        />
      )}
      <p className={`${t.label} mt-4`}>{side}</p>
      <p className={`${t.name} !text-[26px] break-words lg:!text-[32px]`}>
        {name}
      </p>
    </div>
  );
}

// C1 + C2 + C3 + C4 · Rèm nhung mở hội, tên cặp đôi trong khung Deco,
// hai chân dung đối xứng và ba chương chuyện tình (spec §5).
export function TopSections({
  onOpen,
  groom,
  bride,
  cover,
  groomImg,
  brideImg,
}: {
  onOpen: () => void;
  groom: string;
  bride: string;
  cover: string | undefined;
  groomImg: string | undefined;
  brideImg: string | undefined;
}) {
  const couple = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(couple.current, () => {
        splitReveal(".gt-name", { by: "lines", stagger: 0.08 });
        if (cover) fadeUp(".gt-cover");
        fadeUp(".gt-portrait", { stagger: 0.2 });
        fadeUp(".gt-story", { stagger: 0.16 });
      });
    },
    { scope: couple },
  );

  return (
    <>
      <OpenGate onOpen={onOpen} className="bg-[#0C0C0C] text-[#F5E6B8]">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
          <span
            aria-hidden
            className="gt-curtain absolute inset-y-0 left-0 w-[46vw] bg-[linear-gradient(90deg,#3A0810_0%,#7A1420_60%,#5A0E18_100%)]"
          />
          <span
            aria-hidden
            className="gt-curtain absolute inset-y-0 right-0 w-[46vw] bg-[linear-gradient(270deg,#3A0810_0%,#7A1420_60%,#5A0E18_100%)]"
          />
          <div className="relative flex flex-col items-center px-6 text-center">
            <Fan className="w-32 text-[#D4AF37]" />
            <p className={`${t.label} mt-2`}>Đêm hội mừng cưới của</p>
            <p className={`${t.name} mt-1 !text-[30px] lg:!text-[44px]`}>
              {groom} &amp; {bride}
            </p>
            <button type="button" className={`${t.btn} mt-8`}>
              Mở rèm
            </button>
            <p className={`${t.label} mt-4 opacity-70`}>
              Chạm để mở tiệc và bật nhạc
            </p>
          </div>
        </div>
      </OpenGate>

      <section
        ref={couple}
        aria-label="Tên cô dâu chú rể và chuyện tình"
        className="relative flex min-h-dvh items-center justify-center px-3 py-24"
      >
        <Corner className="absolute top-6 left-6 w-12 text-[#D4AF37]/60" />
        <Corner className="absolute top-6 right-6 w-12 -scale-x-100 text-[#D4AF37]/60" />
        <Corner className="absolute bottom-6 left-6 w-12 -scale-y-100 text-[#D4AF37]/60" />
        <Corner className="absolute right-6 bottom-6 w-12 -scale-100 text-[#D4AF37]/60" />

        <div className={`${t.col} flex flex-col items-center gap-12`}>
          <div className="text-center">
            <p className={t.label}>Trân trọng kính mời</p>
            <h1 className="gt-name mt-3">
              <span className={`${t.name} gt-name-line block`}>{groom}</span>
              <span className={`${t.title} my-1 block`}>
                <Fan aria-hidden className="mx-auto mb-1 w-20 text-[#D4AF37]" />
                &amp;
              </span>
              <span className={`${t.name} gt-name-line block`}>{bride}</span>
            </h1>
            {cover ? (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={cover}
                width={520}
                height={360}
                alt={`Ảnh cưới của ${groom} và ${bride}`}
                className={`gt-cover mt-8 aspect-16/10 w-full ${t.frame} p-2`}
              />
            ) : null}
          </div>

          <div className="grid w-full grid-cols-2 gap-6">
            <Portrait img={groomImg} side="Chú rể" name={groom} />
            <Portrait img={brideImg} side="Cô dâu" name={bride} />
          </div>

          <div className="w-full">
            <h2 className={`${t.title} text-center`}>Ba chương của đôi ta</h2>
            <ol className="mt-6 flex flex-col gap-6">
              {STORY.map((s) => (
                <li key={s.year} className={`gt-story ${t.frame} px-6 py-5`}>
                  <p className={t.label}>
                    {s.year} · {s.title}
                  </p>
                  <p className={`${t.soft} mt-1`}>{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}
