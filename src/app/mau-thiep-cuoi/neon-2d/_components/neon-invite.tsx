"use client";

import { useRef, useState } from "react";
import { weddingDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { AlbumSheet, Lightbox } from "@/kit/lightbox";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Gate } from "./gate";
import { Night } from "./night";
import {
  Board,
  Closing,
  DateSign,
  DressCode,
  GiftAndRsvp,
  NameSign,
  Steam,
  Venue,
  Windows,
} from "./sections";
import { t } from "./tokens";

const LETTERS = "ABCDEGHKLMNOPQRSTUVXY0123456789";

// Neon Sài Gòn (docs/templates/neon-2d.md): biển "Đang mở cửa" → các biển neon bật sáng dọc con hẻm → cửa cuốn.
export function NeonInvite() {
  const { data } = useWedding();
  const { groom, bride, images } = data;
  const date = weddingDate(data);
  const music = useMusic();
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(!opened);

  useGSAP(
    () => {
      if (!opened || reduced) return;
      // Mỗi biển bật kiểu chập chờn khi vào khung hình (≤ 3 lần sáng/giây).
      for (const el of gsap.utils.toArray<HTMLElement>("[data-neon]"))
        gsap.fromTo(
          el,
          { opacity: 0 },
          {
            keyframes: { opacity: [0, 0.9, 0.2, 1, 0.5, 1] },
            duration: 0.9,
            ease: "steps(1)",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      // Bảng giờ: chữ lật qua vài ký tự ngẫu nhiên rồi dừng đúng.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-flip]")) {
        const final = el.textContent ?? "";
        const o = { p: 0 };
        gsap.to(o, {
          p: 1,
          duration: 0.8,
          ease: "none",
          onUpdate: () => {
            const k = Math.floor(o.p * final.length);
            el.textContent =
              final.slice(0, k) +
              [...final.slice(k)]
                .map((c) =>
                  c === " " || c === ":"
                    ? c
                    : LETTERS[Math.floor(Math.random() * LETTERS.length)],
                )
                .join("");
          },
          onComplete: () => {
            el.textContent = final;
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
      // Hơi nước trên kính được lau từ trái sang phải khi ảnh vào giữa màn hình.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-steam]"))
        gsap.fromTo(
          el,
          { clipPath: "inset(0 0 0 0%)" },
          {
            clipPath: "inset(0 0 0 100%)",
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "center 50%",
              scrub: 0.6,
            },
          },
        );
      gsap.from("[data-tube]", {
        opacity: 0.15,
        stagger: 0.15,
        duration: 0.4,
        ease: "steps(2)",
        scrollTrigger: { trigger: "[data-tube]", start: "top 85%", once: true },
      });
      gsap.to("[data-shutter]", {
        yPercent: 100,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-closing]",
          start: "top 30%",
          end: "bottom bottom",
          scrub: 0.8,
        },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <Night lit={opened} />
      <MusicToggle music={music} className="bg-[#140D24]/80 text-[#2BD2FF]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className="relative z-10">
          <NameSign data={data} date={date} onView={view} />
          <Windows data={data} onView={view} />
          <DateSign date={date} />
          <Venue data={data} date={date} />
          <Board date={date} />
          <Steam images={images} onView={view} onAll={() => setAlbum(true)} />
          <DressCode />
          <GiftAndRsvp />
          <Closing
            couple={couple}
            img={images.at(-1)}
            onView={() => view(images.length - 1)}
          />
        </main>
      </SmoothScroll>
      <Lightbox
        images={images}
        index={photo}
        onIndex={setPhoto}
        onClose={() => setPhoto(null)}
      />
      <AlbumSheet
        images={images}
        open={album}
        onPick={(i) => {
          setAlbum(false);
          setPhoto(i);
        }}
        onClose={() => setAlbum(false)}
      />
    </div>
  );
}
