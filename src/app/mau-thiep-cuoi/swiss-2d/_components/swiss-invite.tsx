"use client";

import { useWedding } from "@/wedding/wedding-data-provider";
import { weddingDate, formatDate, formatTime } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { Album, DatePanel, Dress, Events, Names, People, Reply, Story, Venue } from "./sections";
import { initials } from "./format";
import { PanelStack } from "./panel-stack";
import { StripsGate } from "./strips-gate";

export function SwissInvite() {
  const { data } = useWedding();
  const music = useMusic();
  const date = weddingDate(data);
  const gateDate = `${formatDate(date)} / ${formatTime(date)}`;
  return <main className="min-h-screen overflow-x-hidden bg-white font-(family-name:--font-swiss-sans) text-black antialiased"><MusicToggle music={music} className="!rounded-none !border-black !bg-white !text-black !shadow-none !backdrop-blur-none" /><SmoothScroll><PanelStack><Names data={data} date={date} /><People data={data} /><Story data={data} /><DatePanel date={date} /><Events date={date} /><Venue data={data} date={date} /><Dress /><Album images={data.images} /><Reply data={data} /></PanelStack></SmoothScroll><StripsGate initials={`${initials(data.groom.name)} ─ ${initials(data.bride.name)}`} date={gateDate} onOpen={() => { void music.play(); }} /></main>;
}
