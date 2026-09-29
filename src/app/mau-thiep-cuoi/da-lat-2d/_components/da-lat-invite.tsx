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
import { Landscape } from "./landscape";
import {
  Album,
  Couple,
  DateCard,
  Day,
  FogBand,
  Mornings,
  Names,
  Places,
  Reply,
  Sunrise,
} from "./sections";
import { t } from "./tokens";

// Sương Đà Lạt (docs/templates/da-lat-2d.md): màn sương tách đôi → nội dung trôi trước đồi thông cố định,
// sương mỏng dần theo cuộn → nắng lên.
export function DaLatInvite() {
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
      if (reduced) {
        gsap.set("[data-fog]", { opacity: 0.45 });
        return;
      }
      gsap.to("[data-cloud]", {
        xPercent: 12,
        duration: 14,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      if (!opened) return;
      // Sương tổng thể mỏng dần suốt trang; cuối trang nắng lên.
      gsap.fromTo(
        "[data-fog]",
        { opacity: 1 },
        {
          opacity: 0.12,
          ease: "none",
          scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
      gsap.to("[data-sun]", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: "[data-sunrise]",
          start: "top bottom",
          end: "center center",
          scrub: 1,
        },
      });
      for (const el of gsap.utils.toArray<SVGElement>("[data-hill]")) {
        const depth = Number(el.dataset.hill);
        gsap.to(el, {
          yPercent: -3 - depth * 3,
          ease: "none",
          scrollTrigger: {
            trigger: "main",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });
      }
      // Card và ảnh hiện từ sương: mờ → rõ.
      for (const el of gsap.utils.toArray<HTMLElement>("[data-card]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          filter: "blur(12px)",
          duration: 1.2,
          ease: "sine.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-fade]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 16,
          filter: "blur(8px)",
          duration: 1.2,
          ease: "sine.inOut",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-mist]"))
        gsap.from(el, {
          filter: "blur(10px)",
          duration: 1.4,
          ease: "sine.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      gsap.from("[data-pine]", {
        scaleY: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: "sine.out",
        scrollTrigger: { trigger: "[data-pine]", start: "top 85%", once: true },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <Landscape />
      <MusicToggle music={music} className="bg-white/70 text-[#2F4F3E]" />
      <Gate
        groom={groom.name}
        bride={bride.name}
        onOpen={() => {
          music.play(2500);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className="relative z-10">
          <Names data={data} date={date} />
          <FogBand />
          <Couple data={data} onView={view} />
          <Mornings images={[images[3], images[4], images[5]]} onView={view} />
          <FogBand />
          <DateCard date={date} />
          <Day date={date} />
          <Places data={data} date={date} />
          <FogBand />
          <Album images={images} onView={view} onAll={() => setAlbum(true)} />
          <Reply />
          <Sunrise
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
