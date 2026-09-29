"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { TemplateMeta } from "@/wedding/types";
import { COLOR, colorLabel, styleLabel } from "./labels";
import { PhoneFrame } from "./phone-frame";

// Mở/đóng theo ?xem=<slug> — share được link, nút back đóng được.
export function PreviewDialog({
  t,
  onClose,
}: {
  t: TemplateMeta | undefined;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (t && !d.open) d.showModal();
    if (!t && d.open) d.close();
  }, [t]);

  const media = t
    ? `Cần ${t.media.images} ảnh${t.media.videos ? ` và ${t.media.videos} video` : ""} để dùng thử.`
    : "";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-label={t ? `Xem nhanh ${t.name}` : undefined}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-[#F2F3EE] p-0 backdrop:bg-[#1C2320]/60 sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:max-w-3xl sm:rounded-[2rem]"
    >
      {t && (
        <div className="flex h-full flex-col gap-6 overflow-y-auto p-5 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
          <PhoneFrame size="lg" className="mx-auto shrink-0">
            <iframe
              src={`/mau-thiep-cuoi/${t.slug}`}
              title={`Thiệp mẫu ${t.name}`}
              loading="lazy"
              className="h-full w-full"
            />
          </PhoneFrame>
          <div className="flex flex-col gap-4">
            <h2 className="font-(family-name:--font-display) text-4xl text-[#1C2320]">
              {t.name}
            </h2>
            <p className="text-[#5E6661]">{t.description}</p>
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="text-[#5E6661]">Loại</dt>
              <dd>{t.tech === "3d" ? "3D, cuộn để kể chuyện" : "2D"}</dd>
              <dt className="text-[#5E6661]">Phong cách</dt>
              <dd>{t.styles.map(styleLabel).join(", ")}</dd>
              <dt className="text-[#5E6661]">Màu</dt>
              <dd className="flex gap-1.5">
                {t.colors.map((c) => (
                  <span
                    key={c}
                    role="img"
                    aria-label={colorLabel(c)}
                    title={colorLabel(c)}
                    className="size-4 rounded-full border border-[#1C2320]/20"
                    style={{ background: COLOR[c]?.hex }}
                  />
                ))}
              </dd>
            </dl>
            <p className="text-sm text-[#5E6661]">{media}</p>
            <div className="flex gap-3 pt-2">
              <Link
                href={`/mau-thiep-cuoi/${t.slug}` as Route}
                className="rounded-full bg-[#2E5E4E] px-6 py-3 text-white"
              >
                Mở thiệp
              </Link>
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="rounded-full border border-[#1C2320] px-6 py-3"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
