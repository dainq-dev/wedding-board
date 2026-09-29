"use client";

import { useState } from "react";
import { MapEmbed } from "@/components/map-embed";
import { Countdown } from "@/kit/countdown-ui";
import { formatDateLine, formatTime, dateParts, monthCells } from "./date-utils";
import { CloudFlourish, Lotus, NonLaFrame } from "./art";

const panel = "rounded-2xl border border-[#C9A0DC]/45 bg-white/80 p-6 shadow-[0_20px_42px_-36px_rgba(67,32,106,.75)] backdrop-blur-sm sm:p-8";

export function InvitationNames({ groom, bride, date }: { readonly groom: string; readonly bride: string; readonly date: Date }) {
  return (
    <section className="relative z-10 flex min-h-svh items-center px-[6vw] py-24">
      <div className={`${panel} mr-auto w-full max-w-md text-center`}>
        <CloudFlourish className="mx-auto mb-8 w-40 text-[#C9A0DC]" />
        <p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Trân trọng báo tin lễ thành hôn</p>
        <div className="mt-9 overflow-hidden">
          <p className="break-words font-(family-name:--font-script) text-5xl leading-[1.16] text-[#5B2A86] sm:text-6xl">{groom}</p>
        </div>
        <p className="my-3 text-xl italic text-[#B8925A]">và</p>
        <div className="overflow-hidden"><h1 className="text-balance break-words font-(family-name:--font-script) text-5xl leading-[1.16] text-[#5B2A86] sm:text-6xl">{bride}</h1></div>
        <div className="my-8 flex items-center justify-center gap-3 text-[#E9B8C8]"><span className="h-px w-12 bg-[#B8925A]" /><Lotus className="w-7" /><span className="h-px w-12 bg-[#B8925A]" /></div>
        <p className="text-sm capitalize text-[#6E5A80]">{formatDateLine(date)}</p>
      </div>
    </section>
  );
}

export function Families({ groom, bride, images }: { readonly groom: { readonly name: string; readonly address: string }; readonly bride: { readonly name: string; readonly address: string }; readonly images: readonly string[] }) {
  return (
    <section className="relative z-10 space-y-14 px-[6vw] py-20">
      <article className="mr-auto flex max-w-lg items-center gap-5"><NonLaFrame src={images[1]} alt={`Chân dung ${groom.name}`} /><div className="min-w-0"><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Nhà trai</p><h2 className="mt-2 font-(family-name:--font-script) text-4xl text-[#5B2A86]">{groom.name}</h2><p className="mt-2 text-sm leading-6 text-[#6E5A80]">{groom.address}</p></div></article>
      <article className="ml-auto flex max-w-lg flex-row-reverse items-center gap-5 text-right"><NonLaFrame src={images[2]} alt={`Chân dung ${bride.name}`} /><div className="min-w-0"><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Nhà gái</p><h2 className="mt-2 font-(family-name:--font-script) text-4xl text-[#5B2A86]">{bride.name}</h2><p className="mt-2 text-sm leading-6 text-[#6E5A80]">{bride.address}</p></div></article>
    </section>
  );
}

const STORY = [
  ["Khúc thứ nhất", "Gặp gỡ", "Một chiều thu, giữa bao người qua lại, hai ta tình cờ gặp nhau. Chẳng ai ngờ đó là khởi đầu của một câu chuyện dài."],
  ["Khúc thứ hai", "Thương nhau", "Những buổi chiều đi dọc bờ sông, những tin nhắn chúc ngủ ngon. Thương nhau từ những điều nhỏ nhất."],
  ["Khúc thứ ba", "Hẹn ước", "Rồi một ngày, anh ngỏ lời. Em gật đầu. Và từ đây, hai dòng sông nhỏ hoà thành một."],
] as const;

export function StoryRiver({ images }: { readonly images: readonly string[] }) {
  return <section className="relative z-10 space-y-20 py-24">{STORY.map(([chapter, title, copy], index) => <article key={title} className={`mx-[6vw] flex max-w-xl flex-col gap-6 ${index % 2 === 0 ? "mr-auto" : "ml-auto"}`}><div className={`${panel} order-2`}><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">{chapter}</p><h2 className="mt-3 text-3xl font-semibold italic text-[#43206A]">{title}</h2><p className="mt-5 text-base leading-8 text-[#6E5A80]">{copy}</p></div><div className="relative order-1 aspect-[4/5] overflow-hidden rounded-[5rem_5rem_1rem_1rem] border border-[#B8925A]/50 bg-[#EDE3F2] p-2 shadow-[0_22px_42px_-30px_rgba(67,32,106,.65)]"><img src={images[index + 3]} alt={`${title} của cô dâu chú rể`} className="size-full object-cover" /><span aria-hidden className="absolute right-5 bottom-5 size-4 rounded-full border-4 border-white bg-[#5B2A86] shadow-lg" /></div></article>)}</section>;
}

export function DateCard({ date }: { readonly date: Date }) {
  const { day, month, year } = dateParts(date);
  return <section className="relative z-10 px-[6vw] py-20"><div className={`${panel} mr-auto max-w-xl text-center`}><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Tháng {month} năm {year}</p><p className="mt-2 capitalize text-[#6E5A80]">{formatDateLine(date).split(",")[0]}</p><p className="my-2 text-8xl leading-none text-[#5B2A86] sm:text-9xl">{day}</p><Lotus className="mx-auto w-10 text-[#E9B8C8]" /><div className="mt-8 grid grid-cols-7 gap-y-2 text-xs text-[#6E5A80]">{"T2 T3 T4 T5 T6 T7 CN".split(" ").map((label) => <span key={label} className="font-semibold text-[#5B2A86]">{label}</span>)}{monthCells(date).map((cell, index) => <span key={`${cell}-${index}`} className={cell === day ? "mx-auto grid size-7 place-items-center rounded-full bg-[#E9B8C8] text-[#43206A]" : "grid h-7 place-items-center"}>{cell}</span>)}</div><Countdown date={date} flip className="mt-9 justify-center text-[#5B2A86] [&>div>div]:bg-[#EDE3F2]" /></div></section>;
}

export function Events({ venue, brideAddress, date }: { readonly venue: { readonly lat: number; readonly lng: number; readonly name?: string }; readonly brideAddress: string; readonly date: Date }) {
  const venueName = venue.name ?? "Nhà hàng tiệc cưới";
  const direction = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
  return <section className="relative z-10 space-y-8 px-[6vw] py-20"><article className={`${panel} ml-auto max-w-xl`}><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Lễ vu quy</p><h2 className="mt-3 text-2xl italic text-[#43206A]">08:00, {formatDateLine(date).split(",")[0]}</h2><p className="mt-4 leading-7 text-[#6E5A80]">Tư gia nhà gái<br />{brideAddress}</p></article><article className={`${panel} mr-auto max-w-xl`}><p className="text-xs tracking-[.25em] text-[#5B2A86] uppercase">Tiệc cưới</p><h2 className="mt-3 text-2xl italic text-[#43206A]">{formatTime(date)}, {formatDateLine(date).split(",")[0]}</h2><p className="mt-4 leading-7 text-[#6E5A80]">{venueName}</p><MapEmbed venue={venue} className="mt-5 aspect-[16/10] w-full rounded-xl border border-[#C9A0DC]/40" /><a href={direction} target="_blank" rel="noreferrer" className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#5B2A86] px-5 text-sm text-white transition-colors hover:bg-[#43206A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B2A86]">Chỉ đường</a></article></section>;
}
