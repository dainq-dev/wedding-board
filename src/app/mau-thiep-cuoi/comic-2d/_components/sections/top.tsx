"use client";

import { useRef } from "react";
import { useGSAP } from "@/kit/gsap";
import { fadeUp, splitReveal } from "@/kit/presets";
import { Burst } from "../decor";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

const STORY = [
  {
    side: "trái",
    bubble: "Này… cậu cũng thích quán này hả?",
    caption: "Chương 1 · Gặp gỡ",
  },
  {
    side: "phải",
    bubble: "Hóa ra hai đứa mình cùng chung một ngăn truyện tranh.",
    caption: "Chương 2 · Đồng điệu",
  },
  {
    side: "trái",
    bubble: "Vậy thì… đi hết phần đời còn lại chung một trang nhé?",
    caption: "Chương 3 · Lời hứa",
  },
] as const;

// C1 + C2 + C3 + C4 · Trang bìa "Số đặc biệt", hai nhân vật chính và ba panel
// chuyện tình trong bong bóng thoại (spec §5).
export function ComicTop({
  onOpen,
  groom,
  bride,
  cover,
  groomImg,
  brideImg,
  images,
}: {
  onOpen: () => void;
  groom: string;
  bride: string;
  cover: string | undefined;
  groomImg: string | undefined;
  brideImg: string | undefined;
  images: string[];
}) {
  const section = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        splitReveal(".cm-name-line", { by: "lines", stagger: 0.08 });
        fadeUp(".cm-item", { stagger: 0.14 });
      });
    },
    { scope: section },
  );

  return (
    <>
      <OpenGateWrapper
        onOpen={onOpen}
        groom={groom}
        bride={bride}
        cover={cover}
      />

      <section
        ref={section}
        aria-label="Tên cặp đôi, chân dung và chuyện tình"
        className="relative flex min-h-dvh items-center justify-center px-3 py-24"
      >
        <div className={`${t.col} flex flex-col gap-8`}>
          <div className={`${t.panel} cm-item px-6 py-8 text-center`}>
            <p className={t.label}>Trân trọng kính mời đọc</p>
            <h1 className="mt-2">
              <span className={`${t.name} cm-name-line block`}>{groom}</span>
              <span className={`${t.title} block text-[#1D3557]`}>&amp;</span>
              <span className={`${t.name} cm-name-line block`}>{bride}</span>
            </h1>
            {cover ? (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={cover}
                width={520}
                height={390}
                alt={`Ảnh bìa tập truyện cưới của ${groom} và ${bride}`}
                className="cm-item mt-6 aspect-4/3 w-full border-[3px] border-[#111] object-cover shadow-[6px_6px_0_#1D3557]"
              />
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { img: groomImg, side: "Nam chính", name: groom },
              { img: brideImg, side: "Nữ chính", name: bride },
            ].map(({ img, side, name }) => (
              <figure
                key={side}
                className={`${t.panel} cm-item p-2 pb-4 text-center`}
              >
                {img ? (
                  // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                  <img
                    src={img}
                    width={400}
                    height={400}
                    alt={`${side.toLowerCase()} ${name}`}
                    className="aspect-square w-full border-[3px] border-[#111] object-cover"
                  />
                ) : (
                  <span
                    aria-hidden
                    className="block aspect-square w-full border-[3px] border-[#111] bg-[#EAF1FB]"
                  />
                )}
                <figcaption className={`${t.label} mt-2`}>{side}</figcaption>
                <p className="text-[17px] font-extrabold break-words">{name}</p>
              </figure>
            ))}
          </div>

          <div className="flex flex-col gap-10">
            {STORY.map((s, i) => (
              <div
                key={s.caption}
                className={`cm-item ${i % 2 ? "lg:pl-16" : "lg:pr-16"}`}
              >
                <p className={`${t.label} mb-2 ${i % 2 ? "text-right" : ""}`}>
                  {s.caption}
                </p>
                <div
                  className={`${t.bubble} ${i % 2 ? "after:left-auto after:right-10" : ""}`}
                >
                  <p className="text-[17px] font-semibold">{s.bubble}</p>
                </div>
                {images[3 + i] ? (
                  // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
                  <img
                    src={images[3 + i]}
                    width={520}
                    height={300}
                    alt={`Minh họa ${s.caption.toLowerCase()}`}
                    className="mt-3 aspect-16/9 w-full border-[3px] border-[#111] object-cover"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// C1 · Bìa truyện: tên trong khung, sao "POW!", nút đọc tiếp.
import { OpenGate } from "@/kit/open-gate";

function OpenGateWrapper({
  onOpen,
  groom,
  bride,
  cover,
}: {
  onOpen: () => void;
  groom: string;
  bride: string;
  cover: string | undefined;
}) {
  return (
    <OpenGate
      onOpen={onOpen}
      className={`${t.halftone} bg-[#FFF9E6] text-[#111]`}
    >
      <div className="flex flex-col items-center gap-6 px-6 text-center">
        <p
          className={`${t.label} -rotate-2 bg-[#FFD60A] px-4 py-1 !tracking-[0.3em] !text-[#111]`}
        >
          Số đặc biệt
        </p>
        <div className="relative">
          <h2 className={`${t.name} !text-[38px] lg:!text-[56px]`}>
            {groom}
            <span className="block text-[#1D3557]">&amp;</span>
            {bride}
          </h2>
          <Burst className="absolute -top-8 -right-10 size-24 rotate-12">
            POW!
          </Burst>
        </div>
        {cover ? (
          <figure
            className={`${t.panel} w-[min(80vw,340px)] -rotate-1 p-2 pb-3`}
          >
            {
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                src={cover}
                width={400}
                height={300}
                alt={`Ảnh bìa thiệp truyện của ${groom} và ${bride}`}
                className="aspect-4/3 w-full border-[3px] border-[#111] object-cover"
              />
            }
          </figure>
        ) : null}
        <button type="button" className={t.btn}>
          Đọc tiếp!
        </button>
        <p className={`${t.label}`}>Chạm để mở thiệp và bật nhạc</p>
      </div>
    </OpenGate>
  );
}
