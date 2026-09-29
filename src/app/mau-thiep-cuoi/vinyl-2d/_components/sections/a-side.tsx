"use client";

import { useRef } from "react";
import { useGSAP } from "@/kit/gsap";
import { fadeUp, splitReveal } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const TRACKS = [
  {
    no: "01",
    title: "Gặp nhau mùa hè",
    text: "Một quán nhỏ, một bài hát lặp lại cả buổi chiều.",
  },
  {
    no: "02",
    title: "Yêu nhau mùa mưa",
    text: "Những bản thu chung, phát đi phát lại trên chiếc đĩa cũ.",
  },
  {
    no: "03",
    title: "Cầu hôn mùa khô",
    text: "Và hôm nay, hai đứa chính thức phát hành chương mới.",
  },
] as const;

function Square({
  src,
  alt,
  className = "",
}: {
  src: string | undefined;
  alt: string;
  className?: string;
}) {
  if (!src)
    return (
      <span
        aria-hidden="true"
        className={`aspect-square w-full bg-[#EBD9BC] ${className}`}
      />
    );
  return (
    // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
    <img
      src={src}
      width={400}
      height={400}
      alt={alt}
      className={`aspect-square w-full object-cover ${className}`}
    />
  );
}

// C2 + C3 + C4 · "Side A": tên cặp đôi như băng đĩa đơn, hai portrait 7-inch
// và ba track chuyện tình (spec §5).
export function ASide({
  groom,
  bride,
  cover,
  groomImg,
  brideImg,
}: {
  groom: string;
  bride: string;
  cover: string | undefined;
  groomImg: string | undefined;
  brideImg: string | undefined;
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        splitReveal(".vs-name-line", { by: "lines", stagger: 0.08 });
        fadeUp(".vs-item", { stagger: 0.12 });
      });
    },
    { scope: section },
  );

  return (
    <section
      ref={section}
      aria-label="Side A: tên cặp đôi và chuyện tình"
      className="relative flex min-h-dvh items-center justify-center px-3 py-24"
    >
      <div className={`${t.col} flex flex-col gap-8`}>
        <div className={`${t.sleeve} vs-item p-6 text-center`}>
          <p className={t.label}>Side A · Đĩa đơn đầu tay</p>
          <h1 className="mt-3">
            <span className={`${t.name} vs-name-line block text-[#3E2723]`}>
              {groom}
            </span>
            <span className={`${t.title} block`}>&amp;</span>
            <span className={`${t.name} vs-name-line block text-[#3E2723]`}>
              {bride}
            </span>
          </h1>
          <Square
            src={cover}
            alt={`Bìa đĩa cưới của ${groom} và ${bride}`}
            className="vs-item mt-6 rounded ring-4 ring-[#3E2723]/10"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {[
            { img: groomImg, side: "Chú rể", name: groom },
            { img: brideImg, side: "Cô dâu", name: bride },
          ].map(({ img, side, name }) => (
            <div key={side} className="vs-item text-center">
              <Square
                src={img}
                alt={`Chân dung ${side.toLowerCase()} ${name}`}
                className="rounded-full p-1 shadow-[0_10px_24px_-10px_rgba(62,39,35,0.5)]"
              />
              <p className={`${t.label} mt-3`}>{side}</p>
              <p className="text-[19px] font-bold break-words">{name}</p>
            </div>
          ))}
        </div>

        <div className={`${t.sleeve} vs-item p-6`}>
          <p className={`${t.title} text-center`}>Danh sách bài hát</p>
          <ol className="mt-5 flex flex-col gap-4">
            {TRACKS.map((tr) => (
              <li key={tr.no} className="flex gap-4">
                <span className={`${t.big} !text-[28px] w-12 shrink-0`}>
                  {tr.no}
                </span>
                <span>
                  <span className="block font-bold">{tr.title}</span>
                  <span className={`${t.soft} block text-[15px]`}>
                    {tr.text}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
