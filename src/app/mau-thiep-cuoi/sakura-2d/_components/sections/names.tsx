import { useRef } from "react";
import { gsap, useGSAP } from "@/kit/gsap";
import { clipReveal, fadeUp, splitReveal } from "@/kit/presets";
import { onceEnter } from "../reveal";
import { t } from "../tokens";

// C2 · Tên + ảnh bìa (spec §5). Gốc cành cây toàn trang bắt đầu từ đáy section này.
export function NamesSection({
  groom,
  bride,
  cover,
  dateLabel,
}: {
  groom: string;
  bride: string;
  cover: string | undefined;
  dateLabel: string;
}) {
  const section = useRef<HTMLElement>(null);
  const groomRef = useRef<HTMLSpanElement>(null);
  const brideRef = useRef<HTMLSpanElement>(null);
  const ampRef = useRef<HTMLSpanElement>(null);
  const coverRef = useRef<HTMLImageElement>(null);

  useGSAP(
    () => {
      onceEnter(section.current, () => {
        if (coverRef.current) clipReveal(coverRef.current);
        const tl = gsap.timeline();
        if (groomRef.current) tl.add(splitReveal(groomRef.current), 0);
        if (brideRef.current) tl.add(splitReveal(brideRef.current), 0.3);
        if (ampRef.current) {
          tl.fromTo(
            ampRef.current,
            { scale: 0 },
            { scale: 1, duration: 0.5, ease: "power2.out" },
            0.8,
          );
        }
        tl.add(fadeUp(".c2-date", { stagger: 0 }), 1);
      });
    },
    { scope: section },
  );

  const bigName =
    groom.length > 20 || bride.length > 20
      ? "text-[34px] lg:text-[64px]"
      : "text-[48px] lg:text-[80px]";

  return (
    <section
      ref={section}
      aria-label="Tên cô dâu chú rể"
      className="relative flex min-h-[100svh] items-center justify-center py-24"
    >
      <div className={`${t.col} relative`}>
        <p className={`${t.heading} text-center`}>Trân trọng kính mời</p>

        {cover ? (
          // biome-ignore lint/performance/noImgElement: ảnh có thể là blob: URL từ "Dùng thử"
          <img
            ref={coverRef}
            src={cover}
            width={520}
            height={693}
            alt={`Ảnh cưới của ${groom} và ${bride}`}
            className={`mx-auto mt-8 aspect-3/4 w-[70%] ${t.arch}`}
          />
        ) : null}

        <h1 className="mt-8 block text-center">
          <span
            ref={groomRef}
            className={`${t.script} block break-words text-left font-semibold leading-[1.1] text-[#5B3A44] ${bigName}`}
          >
            {groom}
          </span>
          <span
            ref={ampRef}
            className={`${t.script} block text-center text-[36px] text-[#D9667F] lg:text-[56px]`}
          >
            &amp;
          </span>
          <span
            ref={brideRef}
            className={`${t.script} block break-words text-right font-semibold leading-[1.1] text-[#5B3A44] ${bigName}`}
          >
            {bride}
          </span>
        </h1>

        <p
          className={`c2-date mt-8 flex items-center justify-center gap-3 ${t.caption} ${t.soft}`}
        >
          <span aria-hidden="true" className="h-px w-10 bg-[#F4B6C2]" />
          <span>{dateLabel}</span>
          <span aria-hidden="true" className="h-px w-10 bg-[#F4B6C2]" />
        </p>
      </div>

      {/* A4: cánh hoa lớn parallax bên phải (desktop). Reduced-motion: không có smoother nên bất động. */}
      <svg
        viewBox="0 0 20 20"
        aria-hidden="true"
        data-speed="0.8"
        className="absolute top-[18%] right-4 hidden size-[72px] fill-[#F4B6C2] opacity-50 lg:block"
      >
        <path d="M10 1 C14 5 15 12 12 17 C11.2 15.5 8.8 15.5 8 17 C5 12 6 5 10 1Z" />
      </svg>
    </section>
  );
}
