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
import { BulbString } from "./art";
import { Clothesline } from "./sections/clothesline";
import { Gift, LightsOff, Rsvp } from "./sections/finale";
import { Gate } from "./sections/gate";
import {
  Ceremonies,
  DateSign,
  DressCode,
  Families,
  Names,
  Schedule,
  Story,
} from "./sections/signs";
import { t } from "./tokens";

// Gỗ Mộc Đèn Dây (docs/templates/rustic-2d.md): công tắc → dây thừng dọc treo bảng gỗ → dây phơi ảnh → tắt đèn.
export function RusticInvite() {
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
      // Sợi dây thừng dọc vẽ dần theo cuộn suốt trang.
      gsap.fromTo(
        "[data-rope]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-rope-zone]",
            start: "top 60%",
            end: "bottom bottom",
            scrub: 0.5,
          },
        },
      );
      // Bảng rơi xuống móc vào dây rồi đung đưa tắt dần.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-hang]")) {
        gsap.fromTo(
          el,
          { y: -80, rotation: -8, autoAlpha: 0 },
          {
            y: 0,
            rotation: 0,
            autoAlpha: 1,
            duration: 1.6,
            ease: "elastic.out(1, 0.35)",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      }
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]"))
        gsap.from(el, {
          y: 30,
          autoAlpha: 0,
          duration: 0.9,
          ease: "sine.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      gsap.from("[data-water]", {
        scaleY: 0,
        stagger: 0.1,
        duration: 1,
        ease: "sine.out",
        scrollTrigger: {
          trigger: "[data-water]",
          start: "top 90%",
          once: true,
        },
      });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
        const n = { v: 1 };
        gsap.to(n, {
          v: Number(el.dataset.count),
          duration: 0.9,
          snap: { v: 1 },
          ease: "sine.out",
          onUpdate: () => {
            el.textContent = String(n.v);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <MusicToggle music={music} className="bg-[#1E1510]/80 text-[#FFD68A]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />

      <SmoothScroll>
        <main className={t.wall}>
          <BulbString className="mx-auto max-w-4xl pt-2" />
          <div data-rope-zone className="relative">
            {/* dây thừng: mép trái (mobile) → giữa trang (desktop) */}
            <span
              data-rope
              aria-hidden="true"
              className="absolute top-0 bottom-0 left-5 w-[4px] origin-top rounded-full bg-[repeating-linear-gradient(160deg,#B89B72_0_5px,#8E744F_5px_7px)] shadow-[1px_0_2px_rgba(0,0,0,0.5)] lg:left-1/2 lg:-translate-x-1/2"
            />
            <Names data={data} date={date} onView={view} />
            <Families data={data} onView={view} />
            <Story images={[images[3], images[4], images[5]]} onView={view} />
            <DateSign date={date} />
            <Schedule date={date} />
            <Ceremonies data={data} date={date} />
            <DressCode />
          </div>
          <Clothesline
            images={images}
            onView={view}
            onAll={() => setAlbum(true)}
          />
          <Rsvp />
          <Gift />
          <LightsOff
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
