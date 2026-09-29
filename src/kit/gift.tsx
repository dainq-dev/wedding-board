"use client";

import { DownloadSimpleIcon, HeartIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { useScrollLock } from "@/kit/use-scroll-lock";
import { useWedding } from "@/wedding/wedding-data-provider";

// QR nhận tiền mừng dùng chung cho mọi mẫu (spec §4.4).
export const GIFT_QR = "/QR-nhan-tien-cuoi.jpg";

const DEFAULT_TRIGGER =
  "inline-flex min-h-12 items-center gap-2.5 rounded-full bg-[#16181A] py-2 pr-6 pl-2 text-[15px] text-white shadow-[0_12px_30px_-12px_rgba(22,24,26,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current";

/**
 * Nút "Gửi lời chúc" → modal QR mừng cưới.
 * `className` thay toàn bộ kiểu của nút để khớp tông từng mẫu; modal giữ thiết kế chung.
 */
export function GiftButton({
  className = DEFAULT_TRIGGER,
  label = "Gửi lời chúc",
}: {
  className?: string;
  label?: string;
}) {
  const { data } = useWedding();
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  useScrollLock(open);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const couple = `${data.groom.name} & ${data.bride.name}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        className={className}
      >
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-white/15"
        >
          <HeartIcon weight="fill" className="size-4" />
        </span>
        {label}
      </button>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: bàn phím đã có Esc native của <dialog>; click chỉ cho vùng backdrop */}
      <dialog
        ref={dialog}
        aria-label={`Gửi lời chúc đến ${couple}`}
        onClose={() => setOpen(false)}
        // Bấm ra ngoài thẻ (vùng backdrop = chính <dialog>) → đóng.
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        className="m-auto max-h-[100dvh] w-[min(92vw,420px)] overflow-visible bg-transparent p-0 opacity-0 transition-[opacity,translate,display,overlay] transition-discrete duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] backdrop:bg-[#0E0F10]/60 backdrop:opacity-0 backdrop:backdrop-blur-sm backdrop:transition-[opacity,display,overlay] backdrop:transition-discrete backdrop:duration-500 open:translate-y-0 open:opacity-100 open:backdrop:opacity-100 starting:open:translate-y-6 starting:open:opacity-0 starting:open:backdrop:opacity-0"
      >
        {/* Double-bezel: vỏ mờ + lõi trắng, bo đồng tâm. */}
        <div className="rounded-[2rem] bg-white/15 p-1.5 ring-1 ring-white/25">
          <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col items-center overflow-y-auto rounded-[calc(2rem-0.375rem)] bg-white px-6 pt-8 pb-6 text-center text-[#1B1C1E] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_40px_80px_-30px_rgba(14,15,16,0.6)]">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Đóng"
              className="absolute top-3 right-3 flex size-11 items-center justify-center rounded-full text-[#5B5E63] transition-colors hover:bg-[#F1F1F2] hover:text-[#1B1C1E]"
            >
              <XIcon className="size-5" />
            </button>

            <span className="flex size-12 items-center justify-center rounded-full bg-[#F7E9EC] text-[#B4475F]">
              <HeartIcon weight="fill" className="size-5" />
            </span>
            <h2 className="mt-4 text-[22px] leading-snug text-balance">
              Gửi lời chúc đến
              <span className="block font-semibold break-words">{couple}</span>
            </h2>
            <p className="mt-3 max-w-[32ch] text-[15px] leading-relaxed text-[#5B5E63]">
              Cảm ơn bạn đã dành tình cảm cho ngày vui của chúng tôi. Nếu muốn
              gửi quà mừng, bạn có thể quét mã dưới đây.
            </p>

            <figure className="mt-6 w-full max-w-[280px] rounded-3xl bg-[#F6F6F7] p-2 ring-1 ring-black/5">
              {/* biome-ignore lint/performance/noImgElement: ảnh tĩnh nhỏ trong public, không cần next/image */}
              <img
                src={GIFT_QR}
                alt={`Mã QR nhận quà mừng cưới của ${couple}`}
                width={1170}
                height={1279}
                loading="lazy"
                className="aspect-1170/1279 w-full rounded-[1.25rem] object-cover"
              />
            </figure>

            <div className="mt-6 flex w-full gap-3">
              <a
                href={GIFT_QR}
                download="qr-mung-cuoi.jpg"
                className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#1B1C1E] px-5 text-[15px] text-white transition-transform active:scale-[0.98]"
              >
                <DownloadSimpleIcon className="size-4.5" />
                Lưu mã QR
              </a>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-12 rounded-full px-5 text-[15px] text-[#5B5E63] ring-1 ring-black/10 transition-colors hover:bg-[#F6F6F7]"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
}
