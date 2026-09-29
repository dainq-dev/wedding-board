"use client";

import { GiftButton } from "@/kit/gift";
import { Flower } from "../svg/decor";
import { t } from "../tokens";

// C8 · Album 2 cột so le + C14 QR mừng cưới + C10 lời cảm ơn (spec §5).
export function AlbumSection({ images }: { images: string[] }) {
  return (
    <>
      <section
        aria-label="Album ảnh cưới"
        className="relative flex min-h-[100svh] flex-col justify-center py-24"
      >
        <div className={t.col}>
          <h2 className={`${t.heading} text-center`}>Khoảnh khắc</h2>
          <div className="mt-10 columns-2 gap-3 [&>*]:mb-3">
            {images.map((src, i) => (
              // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
              <img
                key={src}
                src={src}
                width={400}
                height={500}
                alt={`Ảnh cưới ${i + 1}`}
                className="w-full break-inside-avoid rounded-2xl object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      <section
        aria-label="Lời cảm ơn"
        className="relative flex min-h-[80svh] items-center justify-center py-24"
      >
        <div className={`${t.col} text-center`}>
          <Flower size={34} className="mx-auto" />
          <h2 className={`${t.script} mt-6 text-[38px] leading-tight`}>
            Cảm ơn bạn đã đến chung vui
          </h2>
          <p className={`${t.caption} mt-4`}>
            Sự có mặt của bạn là món quà quý nhất của chúng mình.
          </p>
          <GiftButton className={`${t.btn} mt-8`} />
        </div>
      </section>
    </>
  );
}
