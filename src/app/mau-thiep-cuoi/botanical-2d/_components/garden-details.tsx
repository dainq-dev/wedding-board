"use client";

import { MapEmbed } from "@/components/map-embed";
import type { WeddingData } from "@/wedding/types";

const PLAN = [
  ["17:00", "Đón khách"],
  ["18:00", "Làm lễ"],
  ["18:30", "Khai tiệc"],
  ["20:00", "Giao lưu"],
] as const;

export function Itinerary() {
  return (
    <section className="min-h-[100svh] px-6 py-24">
      <div className="mx-auto w-[min(88vw,460px)]">
        <p className="text-center text-sm font-semibold tracking-[0.22em] uppercase">Lịch trình</p>
        <ol className="mt-12 border-l border-[#C8D5B9] pl-7">
          {PLAN.map(([time, label], index) => <li key={time} className="relative pb-10 last:pb-0"><span className="absolute -left-[2.1rem] top-1 size-4 rounded-[100%_0_100%_0] bg-[#5F7A5A]" /><p className="text-xl text-[#5F7A5A]">{time}</p><p className="mt-1 text-2xl">{label}</p><p className="mt-1 italic text-[#6B7565]">{index === 0 ? "Một buổi chiều thong thả bắt đầu." : "Cùng lưu lại một mùa hoa đẹp."}</p></li>)}
        </ol>
      </div>
    </section>
  );
}

export function Location({ venue }: { venue: WeddingData["venue"] }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${venue.lat},${venue.lng}`;
  return (
    <section className="min-h-[90svh] px-6 py-20">
      <div className="mx-auto w-[min(88vw,460px)] text-center">
        <p className="text-sm font-semibold tracking-[0.22em] uppercase">Địa điểm</p>
        <h2 className="mt-3 text-3xl break-words">{venue.name ?? "Nhà hàng tiệc cưới"}</h2>
        <div className="mt-8 overflow-hidden rounded-t-full p-2 outline outline-1 outline-offset-8 outline-[#C8D5B9]"><MapEmbed venue={venue} className="aspect-4/5 w-full rounded-t-full" /></div>
        <a href={directions} target="_blank" rel="noreferrer" className="mt-8 inline-flex min-h-11 items-center rounded-full bg-[#5F7A5A] px-7 text-white transition-colors hover:bg-[#4A6146]">Chỉ đường</a>
      </div>
    </section>
  );
}

export function DressAndGift() {
  return (
    <>
      <section className="-mt-[10svh] rounded-t-full bg-[#C8D5B9] px-6 pt-[20svh] pb-20 text-center">
        <p className="text-sm font-semibold tracking-[0.22em] uppercase">Dress code</p>
        <h2 className="mt-3 text-3xl">Nhẹ nhàng cùng sắc vườn</h2>
        <p className="mt-3 text-xl italic">Xanh sage, xanh nhạt, kem và trắng.</p>
        <div className="mt-9 flex justify-center gap-4"><span className="size-12 rounded-[100%_0_100%_0] bg-[#5F7A5A]" /><span className="size-12 rounded-[100%_0_100%_0] bg-[#C8D5B9] ring-1 ring-[#5F7A5A]/30" /><span className="size-12 rounded-[100%_0_100%_0] bg-[#EFE8DC]" /><span className="size-12 rounded-[100%_0_100%_0] bg-white ring-1 ring-[#5F7A5A]/20" /></div>
      </section>
      <section className="min-h-[80svh] px-6 py-24 text-center">
        <div className="mx-auto w-[min(88vw,460px)]"><p className="text-sm font-semibold tracking-[0.22em] uppercase">Mừng cưới</p><h2 className="mt-3 text-3xl">Một lời chúc lành</h2><p className="mt-3 text-xl italic text-[#6B7565]">Sự hiện diện của bạn là món quà ý nghĩa nhất.</p><a href="/QR-nhan-tien-cuoi.jpg" target="_blank" rel="noreferrer" className="mx-auto mt-8 block w-52 rounded-t-full bg-white p-3 outline outline-1 outline-offset-8 outline-[#C8D5B9]"><img src="/QR-nhan-tien-cuoi.jpg" alt="Mã QR mừng cưới" className="aspect-square w-full rounded-t-full object-cover" /><span className="mt-3 block text-lg text-[#34402F]">Quét mã để gửi lời mừng</span></a></div>
      </section>
    </>
  );
}
