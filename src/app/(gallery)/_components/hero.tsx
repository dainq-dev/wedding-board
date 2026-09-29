import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { TemplateMeta } from "@/wedding/types";

// 3 thumbnail xếp quạt; card giữa là mẫu nổi bật.
const FAN = [
  "-rotate-[10deg] -translate-x-[62%] translate-y-6 scale-[0.88]",
  "z-10",
  "rotate-[10deg] translate-x-[62%] translate-y-6 scale-[0.88]",
];

export function Hero({
  picks,
  count,
  count3d,
}: {
  picks: TemplateMeta[];
  count: number;
  count3d: number;
}) {
  const featured = picks[1] ?? picks[0];
  return (
    <section className="grid items-center gap-12 pt-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:pt-20 lg:pb-24">
      <div className="flex max-w-xl flex-col gap-7">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#16181A]/10 bg-white px-3 py-1.5 text-xs text-[#5E6661]">
          <span className="size-1.5 rounded-full bg-[#2E5E4E]" />
          Miễn phí · Không cần tài khoản
        </span>
        <h1 className="font-(family-name:--font-display) text-[44px] leading-[1.05] tracking-[-0.01em] text-[#16181A] sm:text-[56px] lg:text-[68px]">
          Thiệp cưới online,{" "}
          <span className="italic text-[#2E5E4E]">sống động</span> như chính câu
          chuyện của hai bạn.
        </h1>
        <p className="text-lg leading-relaxed text-[#5E6661]">
          Chọn mẫu, tải ảnh cưới lên và xem thiệp chạy ngay trên máy. Ảnh không
          rời khỏi trình duyệt của bạn.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#mau"
            className="rounded-full bg-[#16181A] px-6 py-3.5 text-white transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16181A]"
          >
            Khám phá mẫu thiệp
          </a>
          {featured && (
            <Link
              href={`/mau-thiep-cuoi/${featured.slug}` as Route}
              className="rounded-full border border-[#16181A]/15 bg-white px-6 py-3.5 text-[#16181A] transition-colors hover:border-[#16181A]/40"
            >
              Xem mẫu {featured.name}
            </Link>
          )}
        </div>
        <dl className="flex gap-8 border-t border-[#16181A]/10 pt-6">
          {(
            [
              [count, "mẫu thiệp"],
              [count3d, "mẫu 3D"],
              ["6h", "lưu thử trên máy"],
            ] as const
          ).map(([v, k]) => (
            <div key={k}>
              <dt className="sr-only">{k}</dt>
              <dd className="font-(family-name:--font-display) text-3xl text-[#16181A]">
                {v}
              </dd>
              <dd className="text-sm text-[#5E6661]">{k}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="relative flex h-[420px] items-center justify-center sm:h-[520px]">
        <div
          aria-hidden
          className="absolute size-[340px] rounded-full bg-[radial-gradient(circle,#EBCFC7_0%,transparent_70%)] sm:size-[460px]"
        />
        {picks.map((t, i) => (
          <Link
            key={t.slug}
            href={`/mau-thiep-cuoi/${t.slug}` as Route}
            aria-label={`Xem thiệp ${t.name}`}
            className={`absolute aspect-9/19 w-[168px] overflow-hidden rounded-[1.75rem] border-[5px] border-[#16181A] bg-[#16181A] shadow-[0_40px_80px_-30px_rgba(22,24,26,0.55)] transition-transform duration-500 hover:-translate-y-3 sm:w-[210px] ${FAN[i]}`}
          >
            <Image
              src={t.thumbnail}
              alt=""
              fill
              sizes="210px"
              priority
              className="rounded-[1.4rem] object-cover"
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
