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
  Constellation,
  Evening,
  MemorySky,
  Names,
  Place,
  ThatNight,
  TwoStars,
  Wishes,
} from "./sections";
import { moonAt } from "./sky";
import { t } from "./tokens";

// Đêm Đầy Sao (docs/templates/starry-2d.md): trăng lưỡi liềm → nội dung mọc từ chân trời, trăng đi vòng cung theo cuộn.
export function StarryInvite() {
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
      if (reduced) return;
      // Nét xoáy chảy chậm như vệt cọ.
      gsap.to("[data-swirl]", {
        strokeDashoffset: -580,
        duration: 30,
        ease: "none",
        repeat: -1,
        stagger: { each: 2, from: "random" },
      });
      if (!opened) return;
      const moon = root.current?.querySelector<HTMLElement>("[data-moon]");
      const main = root.current?.querySelector("main");
      if (moon && main)
        gsap.to(
          {},
          {
            scrollTrigger: {
              trigger: main,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
              onUpdate: (s) => {
                const p = moonAt(s.progress);
                moon.style.left = `${p.x}%`;
                moon.style.top = `${p.y}%`;
              },
            },
          },
        );
      // Nội dung mọc lên từ chân trời.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 40,
          filter: "blur(6px)",
          duration: 1,
          ease: "sine.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      gsap.from("[data-link]", {
        drawSVG: "0%",
        ease: "none",
        scrollTrigger: {
          trigger: "[data-link]",
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.8,
        },
      });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-star]"))
        gsap.from(el, {
          autoAlpha: 0,
          scale: 0.4,
          duration: 0.8,
          ease: "back.out(2)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      gsap.fromTo(
        "[data-shoot]",
        { x: 0, autoAlpha: 0 },
        {
          x: 320,
          autoAlpha: 1,
          duration: 1.1,
          ease: "power2.in",
          scrollTrigger: {
            trigger: "[data-shoot]",
            start: "top 70%",
            once: true,
          },
        },
      );
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <Night />
      <MusicToggle music={music} className="bg-[#15254F]/80 text-[#F6C945]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(2000);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className="relative z-10">
          <Names data={data} date={date} onView={view} />
          <TwoStars data={data} onView={view} />
          <Constellation
            images={[images[3], images[4], images[5]]}
            onView={view}
          />
          <ThatNight date={date} />
          <Evening date={date} />
          <Place data={data} date={date} />
          <MemorySky
            images={images}
            onView={view}
            onAll={() => setAlbum(true)}
          />
          <Wishes
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
