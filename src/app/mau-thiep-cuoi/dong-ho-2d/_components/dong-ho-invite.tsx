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
import {
  Calendar,
  Colors,
  Finale,
  Pair,
  Places,
  Procession,
  Stack,
  Story,
  TinVui,
} from "./sections";
import { t } from "./tokens";

const PRESSES = [
  ["ink", "#2B1D12"],
  ["red", "#B5382A"],
  ["green", "#2F5D50"],
  ["yellow", "#D9A628"],
] as const;

// Tranh Đông Hồ (docs/templates/dong-ho-2d.md): tờ "Tin vui" → các tờ tranh in qua bốn bản màu → xấp tranh kỷ niệm.
export function DongHoInvite() {
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
      // "Ép bản khắc": bản gỗ hạ xuống / nhấc lên 4 lần, mỗi lần để lại một lớp màu (chữ hiện ở lần đầu).
      for (const sheet of gsap.utils.toArray<HTMLElement>("[data-sheet]")) {
        const block = sheet.querySelector<HTMLElement>(":scope > [data-block]");
        if (!block) continue;
        const layer = (k: string) =>
          sheet.querySelectorAll(`[data-layer="${k}"]`);
        for (const [k] of PRESSES) gsap.set(layer(k), { opacity: 0 });
        const tl = gsap.timeline({
          scrollTrigger: { trigger: sheet, start: "top 80%", once: true },
        });
        for (const [k, color] of PRESSES) {
          tl.set(block, {
            backgroundColor: color,
            opacity: k === "ink" ? 0.9 : 0.6,
          })
            .fromTo(
              block,
              { yPercent: -100 },
              { yPercent: 0, duration: 0.2, ease: "steps(4)" },
            )
            .set(layer(k), { opacity: 1 })
            .to(block, { yPercent: -100, duration: 0.2, ease: "steps(4)" });
        }
        tl.from(sheet.querySelectorAll("[data-bubble]"), {
          scale: 0,
          duration: 0.3,
          ease: "steps(3)",
        });
      }
      gsap.from("[data-station]", {
        autoAlpha: 0,
        x: -20,
        stagger: 0.2,
        duration: 0.4,
        ease: "steps(4)",
        scrollTrigger: {
          trigger: "[data-station]",
          start: "top 85%",
          once: true,
        },
      });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-leafprint]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 0.5,
          ease: "steps(5)",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <MusicToggle music={music} className="bg-[#B5382A]/90 text-[#F7ECD6]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className={t.paper}>
          <TinVui data={data} date={date} onView={view} />
          <Pair data={data} onView={view} />
          <Story images={[images[3], images[4], images[5]]} onView={view} />
          <Calendar date={date} />
          <Procession date={date} />
          <Places data={data} date={date} />
          <Stack images={images} onView={view} onAll={() => setAlbum(true)} />
          <Colors />
          <Finale
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
