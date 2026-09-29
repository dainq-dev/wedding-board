"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { TemplateMeta } from "@/wedding/types";
import { styleLabel } from "./labels";

const ICON_BTN =
  "flex size-10 items-center justify-center rounded-full bg-white/90 text-[#16181A] shadow-[0_6px_16px_-6px_rgba(0,0,0,0.35)] backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export function TemplateCard({
  t,
  priority = false,
}: {
  t: TemplateMeta;
  priority?: boolean;
}) {
  const href = `/mau-thiep-cuoi/${t.slug}` as Route;
  const [copied, setCopied] = useState(false);

  // Web Share trên mobile; desktop không hỗ trợ → sao chép link.
  const share = async () => {
    const url = new URL(href, window.location.origin).toString();
    if (navigator.share) {
      await navigator
        .share({ title: t.name, text: t.description, url })
        .catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <article className="group relative flex flex-col gap-3">
      <div className="relative aspect-3/5 overflow-hidden rounded-[1.75rem] bg-[#E9E5DC] shadow-[0_1px_0_rgba(22,24,26,0.06)] transition-shadow duration-500 group-hover:shadow-[0_30px_60px_-30px_rgba(22,24,26,0.45)]">
        <Image
          src={t.thumbnail}
          alt={`Mẫu thiệp ${t.name}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          priority={priority}
          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 via-40% to-black/0"
        />

        {/* Cả card bấm được → mở thiệp. Nút icon nằm trên lớp này. */}
        <Link
          href={href}
          aria-label={`Xem thiệp ${t.name}`}
          className="absolute inset-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E5E4E]"
        />

        <span
          className={`pointer-events-none absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide backdrop-blur ${
            t.tech === "3d"
              ? "bg-[#16181A]/80 text-[#F3D9A4]"
              : "bg-white/85 text-[#16181A]"
          }`}
        >
          {t.tech.toUpperCase()}
        </span>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Link
            href={href}
            aria-label={`Xem ngay ${t.name}`}
            title="Xem ngay"
            className={ICON_BTN}
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="size-[18px] fill-none stroke-current stroke-[1.8]"
            >
              <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={share}
            aria-label={`Chia sẻ ${t.name}`}
            title="Chia sẻ"
            className={ICON_BTN}
          >
            {copied ? (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-[18px] fill-none stroke-[#2E5E4E] stroke-[2.2]"
              >
                <path d="m5 12 5 5 9-10" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="size-[18px] fill-none stroke-current stroke-[1.8]"
              >
                <path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
              </svg>
            )}
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 text-white">
          <p className="text-[11px] tracking-[0.18em] text-white/75 uppercase">
            {t.styles.map(styleLabel).join(" · ")}
          </p>
          <h3 className="mt-1 font-(family-name:--font-display) text-xl leading-tight sm:text-2xl">
            {t.name}
          </h3>
        </div>

        <output
          className={`pointer-events-none absolute inset-x-3 bottom-3 rounded-full bg-[#16181A] py-2 text-center text-xs text-white transition-all duration-300 ${copied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
        >
          {copied ? "Đã sao chép link thiệp" : ""}
        </output>
      </div>
      <p className="line-clamp-2 px-1 text-sm leading-relaxed text-[#5E6661]">
        {t.description}
      </p>
    </article>
  );
}
