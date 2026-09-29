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
import { grind, shine } from "./grind";
import {
  Album,
  Attire,
  DateBlock,
  Families,
  Gratitude,
  Main,
  Order,
  Places,
  Screen,
  Triptych,
} from "./sections";
import { t } from "./tokens";

// Sơn Mài (docs/templates/son-mai-2d.md): bình phong mài lộ vàng → Chương I Đôi ta → bình phong → Chương II Ngày lành
// → bình phong → Chương III Tri ân.
export function SonMaiInvite() {
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
      for (const el of gsap.utils.toArray<HTMLElement>("[data-grind]"))
        grind(el, {
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-shine]"))
        shine(el, { delay: 0.6 });
      for (const s of gsap.utils.toArray<HTMLElement>("[data-screen]")) {
        const leaves = s.querySelectorAll<HTMLElement>("[data-leaf]");
        gsap.to(leaves, {
          rotateY: (i) => (i % 2 ? -88 : 88),
          opacity: 0,
          ease: "power2.inOut",
          stagger: 0.04,
          scrollTrigger: {
            trigger: s,
            start: "top 65%",
            end: "center 45%",
            scrub: 0.8,
          },
        });
      }
      gsap.from("[data-tile]", {
        autoAlpha: 0,
        y: 30,
        duration: 0.9,
        stagger: { each: 0.05, grid: "auto" },
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-tile]", start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} và ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <MusicToggle music={music} className="bg-[#1F120C]/85 text-[#C9A24A]" />
      <Gate
        groom={groom.name}
        bride={bride.name}
        onOpen={() => {
          music.play(2000);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className={t.bg}>
          <Main data={data} date={date} onView={view} />
          <Families data={data} onView={view} />
          <Triptych images={[images[3], images[4], images[5]]} onView={view} />
          <Screen sub="Chương hai" title="Ngày lành" />
          <DateBlock date={date} />
          <Order date={date} />
          <Places data={data} date={date} />
          <Attire />
          <Screen sub="Chương ba" title="Tri ân" />
          <Album images={images} onView={view} onAll={() => setAlbum(true)} />
          <Gratitude
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
