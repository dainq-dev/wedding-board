"use client";

import { useCallback, useState } from "react";
import { Countdown } from "@/kit/countdown-ui";
import { formatDate, formatMonth, formatWeekday, weddingDate } from "@/kit/dates";
import { MusicToggle, useMusic } from "@/kit/music";
import { SmoothScroll } from "@/kit/smooth-scroll";
import { useWedding } from "@/wedding/wedding-data-provider";
import { ArchGate } from "./arch-gate";
import { ArchImage } from "./arch-image";
import { WeddingCalendar } from "./calendar";
import { Ceremonies } from "./ceremonies";
import { EdgeLeaves } from "./edge-leaves";
import { DressAndGift, Itinerary, Location } from "./garden-details";
import { PhotoLightbox } from "./photo-lightbox";
import { Rsvp } from "./rsvp";

const sectionTitle = "text-center text-sm font-semibold tracking-[0.22em] uppercase";

export function BotanicalInvite() {
  const { data } = useWedding();
  const { groom, bride, images } = data;
  const [lightbox, setLightbox] = useState<number | null>(null);
  const music = useMusic();
  const date = weddingDate(data);
  const names = [groom.name, bride.name] as const;
  const longNames = groom.name.length + bride.name.length > 28;
  const open = useCallback(() => { void music.play(); }, [music]);
  const stepPhoto = useCallback((direction: -1 | 1) => {
    setLightbox((current) => {
      if (current === null || images.length === 0) return current;
      return (current + direction + images.length) % images.length;
    });
  }, [images.length]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#F7F6F1] font-(family-name:--font-body) text-[19px] leading-relaxed text-[#34402F] lg:text-[21px]">
      <MusicToggle music={music} className="!z-30 !border-[#5F7A5A]/20 !bg-white/85 !text-[#34402F]" />
      <EdgeLeaves />
      <SmoothScroll>
        <main className="relative z-0">
          <Hero names={names} cover={images[0]} date={date} longNames={longNames} />
          <Couple groom={groom} bride={bride} images={images} />
          <DateSection date={date} />
          <Ceremonies data={data} dateLabel={formatWeekday(date)} />
          <Itinerary />
          <Location venue={data.venue} />
          <Album images={images} onPhoto={setLightbox} />
          <DressAndGift />
          <section className="min-h-[100svh] px-6 py-24"><div className="mx-auto w-[min(88vw,460px)]"><p className={sectionTitle}>Xác nhận tham dự</p><h2 className="mt-3 text-center text-3xl">Hẹn gặp bạn trong vườn</h2><div className="mt-9"><Rsvp /></div></div></section>
          <Thanks names={names} image={images.at(-1)} />
        </main>
      </SmoothScroll>
      <ArchGate names={names} cover={images[0]} onOpen={open} />
      <PhotoLightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onStep={stepPhoto} />
    </div>
  );
}

function Hero({ names, cover, date, longNames }: { names: readonly [string, string]; cover: string | undefined; date: Date; longNames: boolean }) {
  return <section className="flex min-h-[110svh] items-center px-6 py-28"><div className="mx-auto w-[min(88vw,460px)] text-center"><p className="text-sm tracking-[0.22em] uppercase">Trân trọng kính mời</p><ArchImage src={cover} alt={`Ảnh cưới ${names[0]} và ${names[1]}`} className="mx-auto mt-8 w-[min(70vw,320px)]" /><h1 className={`mt-10 font-(family-name:--font-script) leading-[0.85] break-words ${longNames ? "text-[48px] lg:text-[68px]" : "text-[60px] lg:text-[80px]"}`}><span className="block">{names[0]}</span><span className="my-2 block font-(family-name:--font-body) text-[0.36em] italic">và</span><span className="block">{names[1]}</span></h1><div className="mx-auto mt-8 h-px w-20 bg-[#5F7A5A]/50" /><p className="mt-5 text-xl italic">{formatWeekday(date)} · {formatDate(date)}</p></div></section>;
}

function Couple({ groom, bride, images }: { groom: { name: string; address: string }; bride: { name: string; address: string }; images: readonly string[] }) {
  return <section className="min-h-[100svh] px-6 py-24"><div className="mx-auto grid w-[min(88vw,460px)] grid-cols-2 gap-5 max-[350px]:grid-cols-1"><Person side="Nhà trai" name={groom.name} address={groom.address} image={images[1]} /><Person side="Nhà gái" name={bride.name} address={bride.address} image={images[2]} offset /></div></section>;
}

function Person({ side, name, address, image, offset = false }: { side: string; name: string; address: string; image: string | undefined; offset?: boolean }) {
  return <article className={`min-w-0 text-center ${offset ? "mt-12 max-[350px]:mt-0" : ""}`}><ArchImage src={image} alt={`Chân dung ${side.toLowerCase()} ${name}`} /><p className="mt-6 text-sm font-semibold tracking-[0.16em] uppercase">{side}</p><h2 className="mt-2 font-(family-name:--font-script) text-[35px] leading-none break-words">{name}</h2><p className="mt-3 line-clamp-3 text-[16px] italic text-[#6B7565]">{address}</p></article>;
}

function DateSection({ date }: { date: Date }) {
  return <section className="min-h-[110svh] px-6 py-24"><div className="mx-auto w-[min(88vw,460px)] text-center"><p className={sectionTitle}>{formatMonth(date)}</p><div className="relative mt-3"><span className="absolute inset-x-10 top-1/2 h-18 -translate-y-1/2 rounded-full bg-[#C8D5B9]/55 blur-md" /><p className="relative font-(family-name:--font-body) text-[128px] font-light leading-none text-[#5F7A5A] lg:text-[180px]">{String(date.getDate()).padStart(2, "0")}</p></div><p className="mt-2 text-xl">{formatWeekday(date)} · {date.getFullYear()}</p><div className="mt-9"><WeddingCalendar date={date} /></div><Countdown date={date} flip className="mt-9 justify-center text-[#5F7A5A]" /></div></section>;
}

function Album({ images, onPhoto }: { images: readonly string[]; onPhoto: (index: number) => void }) {
  return <section className="min-h-[130svh] px-6 py-24"><div className="mx-auto w-[min(88vw,520px)]"><p className={sectionTitle}>Khoảnh khắc</p><div className="mt-10 grid grid-cols-2 gap-5">{images.map((image, index) => <button key={image} type="button" onClick={() => onPhoto(index)} aria-label={`Xem ảnh cưới ${index + 1}`} className={`block text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5F7A5A] ${index % 2 === 1 ? "mt-14" : ""}`}><ArchImage src={image} alt={`Khoảnh khắc cưới ${index + 1}`} /><span className="mt-4 block text-sm italic text-[#6B7565]">Mùa hoa {String(index + 1).padStart(2, "0")}</span></button>)}</div></div></section>;
}

function Thanks({ names, image }: { names: readonly [string, string]; image: string | undefined }) {
  return <section className="flex min-h-[100svh] items-center rounded-t-full bg-[#E4EBDC] px-6 py-24 text-center"><div className="mx-auto w-[min(88vw,460px)]"><ArchImage src={image} alt="Khoảnh khắc cuối của cặp đôi" className="mx-auto w-44" /><p className="mt-10 text-2xl italic">Cảm ơn bạn đã ghé thăm khu vườn nhỏ của chúng tôi.</p><p className="mt-7 font-(family-name:--font-script) text-[48px] leading-none break-words">{names[0]} &amp; {names[1]}</p></div></section>;
}
