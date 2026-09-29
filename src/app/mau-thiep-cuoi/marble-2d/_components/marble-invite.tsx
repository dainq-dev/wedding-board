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
  ArchReveal,
  Attire,
  Closing,
  Cover,
  Families,
  Gallery,
  Onyx,
  Order,
  Venue,
} from "./sections";
import { Marble } from "./stone";
import { t } from "./tokens";

const ARCH_IN = "inset(22% 28% 22% 28% round 9999px 9999px 12px 12px)";
const ARCH_OUT = "inset(0% 0% 0% 0% round 0px 0px 0px 0px)";
const ARCH_WIDE = "inset(5% 31% 5% 31% round 9999px 9999px 16px 16px)";

// Đá Cẩm Thạch (docs/templates/marble-2d.md): monogram trong vòm → sảnh đối xứng, vòm mở theo cuộn → hành lang vòm.
export function MarbleInvite() {
  const { data } = useWedding();
  const { groom, bride, images } = data;
  const date = weddingDate(data);
  const music = useMusic(0.55);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(!opened);

  useGSAP(
    () => {
      if (!opened || reduced) return;
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 24,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-shine]"))
        gsap.fromTo(
          el,
          { backgroundPosition: "100% 0" },
          {
            backgroundPosition: "0% 0",
            duration: 1.8,
            ease: "power2.inOut",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      for (const el of gsap.utils.toArray<HTMLElement>("[data-axis]"))
        gsap.from(el, {
          scaleY: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });
      // Vòm mở: ảnh lớn lộ dần qua khung vòm khi cuộn qua section (desktop dừng ở một vòm lớn giữa màn).
      const mm = gsap.matchMedia();
      mm.add(
        { wide: "(min-width: 1024px)", narrow: "(max-width: 1023px)" },
        (ctx) => {
          const end = ctx.conditions?.wide ? ARCH_WIDE : ARCH_OUT;
          for (const s of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: s,
                start: "top top",
                end: "+=80%",
                pin: true,
                scrub: 0.6,
              },
            });
            tl.fromTo(
              s.querySelector("[data-reveal-img]"),
              { clipPath: ARCH_IN },
              { clipPath: end, ease: "none", duration: 1 },
            ).fromTo(
              s.querySelector("[data-reveal-text]"),
              { autoAlpha: 0, y: 20 },
              { autoAlpha: 1, y: 0, duration: 0.3 },
              0.75,
            );
          }
        },
      );
      for (const el of gsap.utils.toArray<HTMLElement>("[data-count]")) {
        const n = { v: 1 };
        gsap.to(n, {
          v: Number(el.dataset.count),
          duration: 0.9,
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = String(n.v);
          },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
      gsap.from("[data-swatch]", {
        scale: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-swatch]",
          start: "top 88%",
          once: true,
        },
      });
      for (const el of gsap.utils.toArray<HTMLElement>("[data-arch-tile]"))
        gsap.from(el, {
          autoAlpha: 0,
          y: 30,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <Marble />
      <MusicToggle music={music} className="bg-white/80 text-[#8A6A3B]" />
      <Gate
        groom={groom.name}
        bride={bride.name}
        date={date}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className="relative z-10">
          <Cover data={data} date={date} onView={view} />
          <Families data={data} onView={view} />
          <ArchReveal
            src={images[3]}
            i={3}
            title="Lần đầu gặp gỡ"
            text="Một buổi chiều rất bình thường, hai người rất lạ, và mọi thứ bắt đầu."
            onView={view}
          />
          <Onyx date={date} />
          <Order date={date} />
          <ArchReveal
            src={images[4]}
            i={4}
            title="Lời hẹn ước"
            text="Chúng tôi chọn nhau, hôm nay và mọi ngày sau này."
            onView={view}
          />
          <Venue data={data} date={date} />
          <Attire />
          <Gallery images={images} onView={view} onAll={() => setAlbum(true)} />
          <Closing
            data={data}
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
