"use client";

import { useRef } from "react";
import { weddingDate } from "@/kit/dates";
import { gsap, ScrollTrigger, useGSAP } from "@/kit/gsap";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useReducedMotion } from "@/kit/use-reduced-motion";
import { useWedding } from "@/wedding/wedding-data-provider";
import { Grain, Pampas, Sun } from "./art";
import { Album, DressCode, ReplyAndThanks, Venue } from "./finale-sections";
import { Gate } from "./gate";
import {
  Couple,
  DateCard,
  Events,
  Names,
  SongPlate,
  Story,
} from "./story-sections";

const COLORS = ["#F3E9DC", "#C0673E", "#8A9A5B", "#6E4B4B"];

export function BohoInvite() {
  const { data } = useWedding();
  const root = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const music = useMusic();
  const date = weddingDate(data);

  useGSAP(
    () => {
      if (!root.current) return;
      const background = gsap.quickSetter(root.current, "backgroundColor");
      const trigger = ScrollTrigger.create({
        trigger: root.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) =>
          background(gsap.utils.interpolate(COLORS, self.progress)),
      });
      if (reduced) return () => trigger.kill();
      const reveals = gsap.utils.toArray<HTMLElement>("[data-boho-reveal]");
      const animations = reveals.map((element) =>
        gsap.fromTo(
          element,
          { clipPath: "inset(100% 0 0 0 round 999px 999px 0 0)" },
          {
            clipPath: "inset(0% 0 0 0 round 999px 999px 0 0)",
            duration: 1,
            ease: "power2.out",
            scrollTrigger: { trigger: element, start: "top 82%" },
          },
        ),
      );
      return () => {
        trigger.kill();
        for (const animation of animations) animation.kill();
      };
    },
    { scope: root, dependencies: [reduced] },
  );

  return (
    <main
      ref={root}
      className="relative min-h-screen overflow-x-hidden bg-[#F3E9DC] font-(family-name:--font-boho-body) text-[#4A3426] transition-colors duration-300"
    >
      <Grain />
      <MusicToggle music={music} className="bg-[#9C4F2C]! text-[#FFFAF3]!" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-52"
      >
        <Pampas className="absolute bottom-0 left-0 h-48 w-28 text-[#E8D8BF] opacity-80" />
        <Pampas className="absolute right-[14%] bottom-0 h-44 w-28 -scale-x-100 text-[#E8D8BF] opacity-80" />
      </div>
      <SmoothScroll>
        <Names groom={data.groom.name} bride={data.bride.name} date={date} />
        <SongPlate playing={music.playing} />
        <Couple data={data} />
        <Story images={data.images} />
        <DateCard date={date} />
        <Events data={data} date={date} />
        <Venue data={data} />
        <DressCode />
        <Album images={data.images} />
        <ReplyAndThanks data={data} />
      </SmoothScroll>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-7 left-[8vw] z-10 text-[#C0673E]"
      >
        <Sun className="size-16 sm:size-24" />
      </div>
      <Gate
        groom={data.groom.name}
        bride={data.bride.name}
        onOpen={() => music.play()}
      />
    </main>
  );
}
