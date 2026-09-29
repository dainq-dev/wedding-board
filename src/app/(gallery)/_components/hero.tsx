"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { TemplateMeta } from "@/wedding/types";
import { PhoneFrame } from "./phone-frame";

export function Hero({
  featured,
  count,
}: {
  featured: TemplateMeta;
  count: number;
}) {
  const [running, setRunning] = useState(false);
  const href = `/mau-thiep-cuoi/${featured.slug}` as Route;
  return (
    <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.2fr_1fr] lg:py-16">
      <div className="flex max-w-xl flex-col gap-6">
        <h1 className="font-(family-name:--font-display) text-[44px] leading-[1.1] text-[#1C2320] lg:text-[60px]">
          Thiệp cưới online, thử bằng ảnh của chính bạn.
        </h1>
        <p className="text-lg text-[#5E6661]">
          Chọn một trong {count} mẫu, tải ảnh cưới lên và xem thiệp của hai bạn
          chạy ngay trên máy. Không cần tài khoản, ảnh không rời khỏi trình
          duyệt.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#mau"
            className="rounded-full bg-[#2E5E4E] px-6 py-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5E4E]"
          >
            Xem các mẫu
          </a>
          <Link
            href={href}
            className="rounded-full border border-[#1C2320] px-6 py-3 text-[#1C2320]"
          >
            Thử mẫu {featured.name}
          </Link>
        </div>
      </div>

      <div className="relative flex justify-center">
        <div
          aria-hidden
          className="absolute inset-x-6 top-10 bottom-10 rounded-[3rem] bg-[#EBCFC7]"
        />
        <PhoneFrame
          size="lg"
          className="relative shadow-[0_30px_60px_-30px_rgba(28,35,32,0.5)]"
        >
          {running ? (
            <iframe
              src={href}
              title={`Thiệp mẫu ${featured.name}`}
              className="h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setRunning(true)}
              className="group relative block h-full w-full"
            >
              <Image
                src={featured.thumbnail}
                alt=""
                fill
                sizes="300px"
                className="object-cover"
                priority
              />
              <span className="absolute inset-x-6 bottom-8 rounded-full bg-white/95 px-4 py-3 text-center text-sm font-medium text-[#1C2320] group-focus-visible:outline-2 group-focus-visible:outline-[#2E5E4E]">
                Chạy thiệp {featured.name}
              </span>
            </button>
          )}
        </PhoneFrame>
      </div>
    </section>
  );
}
