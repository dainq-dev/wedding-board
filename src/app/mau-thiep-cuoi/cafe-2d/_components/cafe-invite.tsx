"use client";

import { useRef, useState } from "react";
import { formatDate, formatWeekday, weddingDate } from "@/kit/dates";
import { gsap, useGSAP } from "@/kit/gsap";
import { AlbumSheet, Lightbox } from "@/kit/lightbox";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Address } from "./sections/address";
import { BacXiu } from "./sections/bac-xiu";
import { Couple } from "./sections/couple";
import { DateBoard } from "./sections/date-board";
import { Gate } from "./sections/gate";
import { LightWall } from "./sections/light-wall";
import { MenuBoard } from "./sections/menu-board";
import { Chapter, PourOnce } from "./sections/pour";
import { Receipt } from "./sections/receipt";
import { SeeYou } from "./sections/see-you";
import { t } from "./tokens";

// Cà Phê Sài Gòn (docs/templates/cafe-2d.md): phin → bảng menu → 3 chương "rót đầy"
// (Đồ uống · Hẹn gặp · Ở lại chơi) → tường ảnh đèn dây → hoá đơn → ly cạn.
export function CafeInvite() {
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
      for (const el of gsap.utils.toArray<HTMLElement>("[data-rise]")) {
        gsap.from(el, {
          y: 36,
          autoAlpha: 0,
          filter: "blur(6px)",
          duration: 0.9,
          ease: "power1.inOut",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      }
      for (const el of gsap.utils.toArray<HTMLElement>("[data-slide]")) {
        const left = el.dataset.slide === "left";
        gsap.from(el, {
          x: left ? -90 : 90,
          rotate: left ? -6 : 6,
          autoAlpha: 0,
          duration: 1,
          ease: "power1.inOut",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
      }
      for (const el of gsap.utils.toArray<HTMLElement>("[data-swing]")) {
        gsap.fromTo(
          el,
          { rotate: 5 },
          {
            keyframes: { rotate: [5, -2.5, 1, 0] },
            duration: 1.6,
            ease: "sine.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      }
      gsap.from("[data-sugar]", {
        y: -60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power2.in",
        scrollTrigger: {
          trigger: "[data-sugar]",
          start: "top 90%",
          once: true,
        },
      });
      for (const el of gsap.utils.toArray<SVGPathElement>("[data-draw]")) {
        gsap.fromTo(
          el,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.1,
            ease: "power1.inOut",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      }
      for (const row of gsap.utils.toArray<HTMLElement>("[data-row]")) {
        gsap.from(row.querySelectorAll("[data-bulb]"), {
          opacity: 0.2,
          stagger: 0.05,
          duration: 0.4,
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
        gsap.from(row.querySelectorAll("[data-sway]"), {
          y: -30,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 0.9,
          ease: "power1.inOut",
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        });
      }
    },
    { scope: root, dependencies: [opened, reduced] },
  );

  const couple = `${groom.name} & ${bride.name}`;
  const view = (i: number) => images[i] && setPhoto(i);

  return (
    <div ref={root} className={`${t.root} ${t.wood}`}>
      <MusicToggle music={music} className="bg-[#1F2A24]/85 text-[#E9C46A]" />
      <Gate
        groom={groom.name}
        bride={bride.name}
        onOpen={() => {
          music.play(2000);
          setOpened(true);
        }}
      />
      <PourOnce play={opened} />

      <SmoothScroll>
        <main className={`bg-[#2B1D14] ${t.wood}`}>
          <MenuBoard
            groom={groom.name}
            bride={bride.name}
            dateLine={`${formatWeekday(date)}, ${formatDate(date).replaceAll("/", ".")}`}
            cover={images[0]}
            onView={() => view(0)}
          />
          <Chapter
            tone="coffee"
            title="Đồ uống"
            line="Hai người, một câu chuyện"
          />
          <Couple
            groom={groom}
            bride={bride}
            groomImg={images[1]}
            brideImg={images[2]}
            onView={view}
          />
          <BacXiu images={[images[3], images[4], images[5]]} onView={view} />
          <Chapter
            tone="latte"
            title="Hẹn gặp"
            line="Ngày giờ và địa chỉ quán"
          />
          <DateBoard date={date} />
          <Address data={data} date={date} />
          <Chapter
            tone="coffee"
            title="Ở lại chơi"
            line="Ngồi thêm chút nữa nhé"
          />
          <LightWall
            images={images}
            onView={view}
            onAll={() => setAlbum(true)}
          />
          <Receipt date={date} />
          <SeeYou
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
