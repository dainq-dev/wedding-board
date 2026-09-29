"use client";

import { useRef, useState } from "react";
import { gsap } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";
import { FilmGrain } from "./film-grain";
import { Leader } from "./leader";
import { Letterbox, type LetterboxHandle } from "./letterbox";
import { Cast } from "./sections/cast";
import { Cinema } from "./sections/cinema";
import { ContactSheet } from "./sections/contact-sheet";
import { FilmStrip } from "./sections/film-strip";
import { TheEnd } from "./sections/the-end";
import { Ticket } from "./sections/ticket";
import { TitleCard } from "./sections/title-card";
import { Trailer } from "./sections/trailer";
import { t } from "./tokens";

export function FilmInvite() {
  const { data } = useWedding();
  const music = useMusic();
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const letterbox = useRef<LetterboxHandle>(null);
  const flash = useRef<HTMLDivElement>(null);
  const grain = useRef<HTMLDivElement>(null);
  useScrollLock(!opened);

  const open = () => {
    music.play();
    setOpened(true);
    if (!reduced && flash.current && grain.current) {
      // Flash trắng + grain bùng lên như máy chiếu bật (spec §5 C1).
      gsap.fromTo(
        flash.current,
        { opacity: 0 },
        { opacity: 0.9, duration: 0.08, yoyo: true, repeat: 1 },
      );
      gsap.fromTo(
        grain.current,
        { opacity: 0.3 },
        { opacity: 0.08, duration: 0.6 },
      );
    }
    letterbox.current?.setRatio("21:9");
  };

  const { images, videos } = data;

  return (
    <div className={t.root}>
      <SmoothScroll>
        <main>
          <TitleCard data={data} />
          <Cast data={data} />
          <FilmStrip data={data} />
          {videos[0] && (
            <Trailer src={videos[0]} poster={images[0]} music={music} />
          )}
          <Ticket data={data} />
          <Cinema venue={data.venue} />
          <ContactSheet images={images} />
          <TheEnd data={data} />
        </main>
      </SmoothScroll>

      <Letterbox ref={letterbox} />
      <FilmGrain opacityRef={grain} />
      <div
        ref={flash}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-40 bg-white opacity-0"
      />
      {opened && <MusicToggle music={music} />}

      <OpenGate onOpen={open} className="bg-[#0D0D0D]">
        <Leader
          names={`${data.groom.name} & ${data.bride.name}`}
          playing={opened}
          action={
            <button type="button" className={`mt-2 ${t.btn}`}>
              ▶ Bấm máy
            </button>
          }
        />
      </OpenGate>
    </div>
  );
}
