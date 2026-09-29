"use client";

import { useEffect, useState } from "react";
import { Countdown } from "@/kit/countdown-ui";
import { MapEmbed } from "@/components/map-embed";
import type { WeddingData } from "@/wedding/types";
import { formatDate, formatTime, formatWeekday } from "@/kit/dates";
import { fitNameClass, formatCoord, scheduleFrom } from "./format";
import { Panel } from "./panel";

const portrait = (images: string[], index: number) => images[index] ?? images[0] ?? "";

export function Names({ data, date }: { data: WeddingData; date: Date }) {
  return <Panel number="02" title="CẶP ĐÔI"><div className="col-span-full flex min-w-0 flex-col justify-center overflow-hidden"><h1 className="contents"><span className={`${fitNameClass(data.groom.name)} -ml-[.08em] font-(family-name:--font-swiss-sans) leading-[.76] font-black tracking-[-.08em] uppercase`}>{data.groom.name}</span><span className="my-6 size-4 shrink-0 bg-[#ff3b30]" aria-label="và" /><span className={`${fitNameClass(data.bride.name)} -ml-[.08em] font-(family-name:--font-swiss-sans) leading-[.76] font-black tracking-[-.08em] uppercase`}>{data.bride.name}</span></h1><div className="mt-12 grid grid-cols-4 gap-4 font-(family-name:--font-swiss-mono) text-xs tracking-[.12em] uppercase lg:grid-cols-12 lg:gap-6"><p className="col-span-2">Trân trọng<br />kính mời</p><p className="col-span-2 lg:col-span-3">{formatWeekday(date)}<br />{formatDate(date)}</p></div></div></Panel>;
}

export function People({ data }: { data: WeddingData }) {
  const couples = [{ label: "NHÀ TRAI", person: data.groom, image: portrait(data.images, 1) }, { label: "NHÀ GÁI", person: data.bride, image: portrait(data.images, 2) }];
  return <Panel number="03" title="HAI NGƯỜI" tone="surface"><div className="col-span-full grid content-center gap-8 sm:grid-cols-2 lg:col-span-10 lg:col-start-2"><div className="hidden lg:block" />{couples.map(({ label, person, image }) => <article key={label} className="group"><img src={image} alt={`Chân dung ${person.name}`} className="aspect-[3/4] w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" /><p className="mt-3 font-(family-name:--font-swiss-mono) text-[11px] font-bold tracking-[.15em] text-[#d70015] uppercase">/ {label}</p><h2 className="mt-2 text-2xl font-extrabold tracking-[-.05em] uppercase">{person.name}</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6b6b6b]">{person.address}</p></article>)}</div></Panel>;
}

export function Story({ data }: { data: WeddingData }) {
  const notes = ["MỘT CUỘC GẶP GỠ", "MỘT LỜI HỨA", "MỘT NGÀY VUI"];
  return <Panel number="04" title="CÂU CHUYỆN" tone="dark"><div className="col-span-full grid content-center gap-y-8 lg:col-span-10 lg:col-start-2">{data.images.slice(3).map((src, index) => <article key={src} className="grid grid-cols-4 items-end gap-4 border-t border-[#262626] pt-4 lg:grid-cols-10"><span className="font-(family-name:--font-swiss-mono) text-xs text-[#ff3b30]">{String(index + 1).padStart(2, "0")}</span><img src={src} alt={`Kỷ niệm ${index + 1} của đôi bạn`} className="col-span-2 aspect-[3/2] w-full object-cover grayscale transition duration-500 hover:grayscale-0 lg:col-span-4" /><p className="col-span-1 text-right text-xl font-extrabold tracking-[-.05em] lg:col-span-4 lg:text-3xl">{notes[index % notes.length]}</p></article>)}</div></Panel>;
}

export function DatePanel({ date }: { date: Date }) {
  const day = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", day: "2-digit" }).format(date);
  const month = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", month: "2-digit" }).format(date);
  const year = new Intl.DateTimeFormat("vi-VN", { timeZone: "Asia/Ho_Chi_Minh", year: "2-digit" }).format(date);
  return <Panel number="05" title="NGÀY" tone="dark"><div className="col-span-full flex flex-col justify-center"><div className="font-(family-name:--font-swiss-sans) text-[32vw] leading-[.7] font-black tracking-[-.09em] lg:text-[18vw]"><p>{day}</p><p>{month}</p><p>{year}</p></div><div className="mt-10 border border-[#262626] p-5"><p className="font-(family-name:--font-swiss-mono) text-xs tracking-[.14em] text-[#ff3b30] uppercase">{formatWeekday(date)} / {formatDate(date)} / {formatTime(date)}</p><Countdown date={date} flip className="mt-6 font-(family-name:--font-swiss-mono)" /></div></div></Panel>;
}

export function Events({ date }: { date: Date }) {
  return <Panel number="06" title="LỊCH TRÌNH"><div className="col-span-full flex flex-col justify-center lg:col-span-9 lg:col-start-3"><div className="grid grid-cols-[6rem_1fr] border-y-2 border-black font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em] uppercase"><span className="border-r-2 border-black p-4">Giờ</span><span className="p-4">Hạng mục</span>{scheduleFrom(date).map(({ time, label }, index) => <div key={label} className="contents"><span className="border-t border-r-2 border-black p-4 text-xl tabular-nums">{time}</span><span className="relative border-t border-black p-4 text-xl">{label}{index === 1 && <i aria-hidden="true" className="absolute right-4 top-1/2 size-3 -translate-y-1/2 bg-[#ff3b30]" />}</span></div>)}</div></div></Panel>;
}

export function Venue({ data, date }: { data: WeddingData; date: Date }) {
  return <Panel number="07" title="ĐỊA ĐIỂM" tone="surface" className="min-h-[120svh]"><div className="col-span-full flex flex-col justify-center lg:col-span-10 lg:col-start-2"><div className="grid gap-8 border-y-2 border-black py-6 sm:grid-cols-2"><div><p className="font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em] uppercase">Lễ vu quy / 08:00</p><p className="mt-3 text-2xl font-extrabold uppercase">Tư gia nhà gái</p><p className="mt-2 text-[#6b6b6b]">{data.bride.address}</p></div><div><p className="font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em] uppercase">Tiệc cưới / {formatTime(date)}</p><p className="mt-3 text-2xl font-extrabold uppercase">{data.venue.name || "Địa điểm tiệc"}</p><p className="mt-2 font-(family-name:--font-swiss-mono) text-xs">{formatCoord(data.venue.lat, data.venue.lng)}</p></div></div><MapEmbed venue={data.venue} className="mt-8 aspect-video w-full border-2 border-black grayscale transition duration-500 hover:grayscale-0" /><a href={`https://www.google.com/maps/dir/?api=1&destination=${data.venue.lat},${data.venue.lng}`} target="_blank" rel="noreferrer" className="mt-6 inline-flex min-h-12 w-fit items-center border-2 border-black px-5 font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em] uppercase focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]">Chỉ đường →</a></div></Panel>;
}

export function Dress() {
  return <Panel number="08" title="DRESS CODE"><div className="col-span-full flex flex-col justify-center lg:col-span-8 lg:col-start-3"><div className="grid grid-cols-3 gap-4"><div className="aspect-square bg-black p-3 font-(family-name:--font-swiss-mono) text-xs font-bold text-white">ĐEN</div><div className="aspect-square border-2 border-black p-3 font-(family-name:--font-swiss-mono) text-xs font-bold">TRẮNG</div><div className="aspect-square bg-[#ff3b30] p-3 font-(family-name:--font-swiss-mono) text-xs font-bold">ĐỎ</div></div><p className="mt-8 max-w-md text-3xl font-extrabold leading-tight tracking-[-.06em]">Đen, trắng. Một điểm đỏ nếu bạn muốn.</p></div></Panel>;
}

export function Album({ images }: { images: string[] }) {
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
      if (selected !== null && event.key === "ArrowRight") setSelected((current) => current === null ? 0 : (current + 1) % images.length);
      if (selected !== null && event.key === "ArrowLeft") setSelected((current) => current === null ? 0 : (current - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [images.length, selected]);
  return <Panel number="09" title="INDEX" tone="dark" className="min-h-[120svh]"><div className="col-span-full flex flex-col justify-center"><p className="mb-6 font-(family-name:--font-swiss-mono) text-xs tracking-[.14em] uppercase">Chọn một ảnh để xem lớn</p><div className="grid grid-cols-2 gap-2 lg:grid-cols-4">{images.map((src, index) => <button key={`${src}-${index}`} type="button" onClick={() => setSelected(index)} className="group relative aspect-square overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff3b30]"><img src={src} alt={`Ảnh cưới ${index + 1}`} className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /><span className="absolute left-2 top-2 bg-black px-2 py-1 font-(family-name:--font-swiss-mono) text-xs text-white">{String(index + 1).padStart(2, "0")}</span></button>)}</div></div>{selected !== null && <div role="dialog" aria-modal="true" aria-label={`Ảnh cưới ${selected + 1}`} className="fixed inset-0 z-40 flex items-center justify-center bg-black p-4" onClick={() => setSelected(null)}><button type="button" className="absolute right-5 top-5 min-h-11 border border-white px-4 font-(family-name:--font-swiss-mono) text-xs text-white" onClick={() => setSelected(null)}>ĐÓNG</button><img src={images[selected]} alt={`Ảnh cưới ${selected + 1} phóng lớn`} className="max-h-[86svh] max-w-full object-contain" onClick={(event) => event.stopPropagation()} /><span className="absolute bottom-5 font-(family-name:--font-swiss-mono) text-xs text-white">{String(selected + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span></div>}</Panel>;
}

export function Reply({ data }: { data: WeddingData }) {
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  return <Panel number="10" title="TRẢ LỜI" className="min-h-[110svh]"><div className="col-span-full flex flex-col justify-center lg:col-span-8 lg:col-start-3">{sent ? <div><p className="font-(family-name:--font-swiss-sans) text-6xl font-black tracking-[-.08em] uppercase lg:text-8xl">CẢM ƠN,<br />{name || "BẠN"}.</p><i aria-hidden="true" className="mt-6 block size-5 bg-[#ff3b30]" /></div> : <form onSubmit={(event) => { event.preventDefault(); setSent(true); }} className="max-w-xl"><p className="font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.14em] uppercase">/ XÁC NHẬN THAM DỰ</p><label className="mt-10 block font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.14em] uppercase">Tên<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-4 min-h-12 w-full border-b-2 border-black bg-transparent text-2xl font-bold outline-none focus:border-[#ff3b30]" /></label><div className="mt-8 grid grid-cols-2 gap-3"><button type="button" className="min-h-12 bg-black font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em] text-white">ĐẾN</button><button type="button" className="min-h-12 border-2 border-black font-(family-name:--font-swiss-mono) text-xs font-bold tracking-[.12em]">KHÔNG</button></div><button type="submit" className="mt-8 min-h-14 bg-[#ff3b30] px-6 font-(family-name:--font-swiss-mono) text-sm font-bold tracking-[.12em] uppercase">GỬI →</button><p className="mt-4 text-xs text-[#6b6b6b]">Bản xem thử, không gửi đi.</p></form>}<div className="mt-16 border-t border-black pt-5 font-(family-name:--font-swiss-mono) text-xs leading-relaxed">{data.groom.name} / {data.bride.name}<br />Hân hạnh đón tiếp.</div></div></Panel>;
}
