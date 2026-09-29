"use client";

import { weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { OpenGate } from "@/kit/open-gate";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import {
  DressCode,
  GiftAndRsvp,
  SilkAlbum,
  Thanks,
} from "./finishing-sections";
import { River } from "./river";
import {
  DateCard,
  Events,
  Families,
  InvitationNames,
  StoryRiver,
} from "./sections";
import { SilkGate } from "./silk-gate";

export function AoDaiInvite() {
  const { data } = useWedding();
  const music = useMusic();
  const date = weddingDate(data);
  const names = `${data.groom.name} & ${data.bride.name}`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#F5F0F7] font-(family-name:--font-body) text-[#2E1A40] selection:bg-[#C9A0DC]/60">
      <SmoothScroll>
        <main>
          <div className="relative isolate overflow-hidden">
            <River />
            <InvitationNames
              groom={data.groom.name}
              bride={data.bride.name}
              date={date}
            />
            <Families
              groom={data.groom}
              bride={data.bride}
              images={data.images}
            />
            <StoryRiver images={data.images} />
            <DateCard date={date} />
            <Events
              venue={data.venue}
              brideAddress={data.bride.address}
              date={date}
            />
            <DressCode />
          </div>
          <SilkAlbum images={data.images} />
          <GiftAndRsvp groom={data.groom.name} bride={data.bride.name} />
          <Thanks image={data.images[5]} names={names} />
        </main>
      </SmoothScroll>
      <MusicToggle
        music={music}
        className="border-[#C9A0DC]/60 bg-[#5B2A86] text-white"
      />
      <OpenGate onOpen={() => music.play()} className="bg-[#F5F0F7]">
        <SilkGate names={names} />
      </OpenGate>
    </div>
  );
}
