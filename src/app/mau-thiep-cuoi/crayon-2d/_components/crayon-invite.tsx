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
import { CrayonFilter } from "./draw";
import { Gate } from "./gate";
import {
  Board,
  Comic,
  Crayons,
  Day,
  GoodKid,
  Hello,
  Rainbow,
  Road,
  Two,
} from "./sections";
import { t } from "./tokens";

// Nét Sáp Màu (docs/templates/crayon-2d.md): ngôi nhà + mặt trời → mọi nét sáp vẽ ra khi cuộn tới.
export function CrayonInvite() {
  const { data } = useWedding();
  const { groom, bride, images } = data;
  const date = weddingDate(data);
  const music = useMusic(0.5);
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const [opened, setOpened] = useState(false);
  const [photo, setPhoto] = useState<number | null>(null);
  const [album, setAlbum] = useState(false);
  useScrollLock(!opened);

  useGSAP(
    () => {
      if (!opened || reduced) return;
      const main = root.current?.querySelector("main");
      if (!main) return;
      for (const el of gsap.utils.toArray<HTMLElement>("[data-pop]", main)) {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
        tl.from(el, {
          autoAlpha: 0,
          scale: 0.9,
          y: 20,
          duration: 0.5,
          ease: "back.out(2)",
        });
        const lines = el.querySelectorAll("[data-draw]");
        if (lines.length)
          tl.from(
            lines,
            {
              drawSVG: "0%",
              duration: 0.6,
              stagger: 0.05,
              ease: "power1.inOut",
            },
            "-=0.2",
          );
      }
      gsap.from(gsap.utils.toArray("[data-crayon]", main), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: main.querySelector("[data-crayon]"),
          start: "top 88%",
          once: true,
        },
      });
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={t.root}>
      <CrayonFilter />
      <MusicToggle music={music} className="bg-white/90 text-[#C93A6B]" />
      <Gate
        couple={couple}
        onOpen={() => {
          music.play(1500);
          setOpened(true);
        }}
      />
      <SmoothScroll>
        <main className={t.paper}>
          <Hello data={data} date={date} onView={view} />
          <Two data={data} onView={view} />
          <Comic images={[images[3], images[4], images[5]]} onView={view} />
          <Day date={date} />
          <Rainbow date={date} />
          <Road data={data} date={date} />
          <Crayons />
          <Board images={images} onView={view} onAll={() => setAlbum(true)} />
          <GoodKid
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
