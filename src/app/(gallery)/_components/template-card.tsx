import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { TemplateMeta } from "@/wedding/types";
import { PhoneFrame } from "./phone-frame";

export function TemplateCard({
  t,
  previewHref,
}: {
  t: TemplateMeta;
  previewHref: string;
}) {
  const href = `/mau-thiep-cuoi/${t.slug}` as Route;
  return (
    <article className="flex flex-col gap-3">
      <Link
        href={previewHref as Route}
        scroll={false}
        aria-label={`Xem nhanh ${t.name}`}
      >
        <PhoneFrame
          className={
            t.tech === "3d"
              ? "outline outline-1 outline-offset-4 outline-[#A8874A]"
              : ""
          }
        >
          <Image
            src={t.thumbnail}
            alt=""
            width={450}
            height={950}
            className="h-full w-full object-cover"
          />
        </PhoneFrame>
      </Link>
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-(family-name:--font-display) text-xl text-[#1C2320]">
          {t.name}
        </h3>
        <span className="text-sm text-[#5E6661]">
          {t.tech === "3d" ? "3D" : "2D"}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-[#5E6661]">{t.description}</p>
      <div className="flex items-center gap-4 text-sm">
        <Link
          href={previewHref as Route}
          scroll={false}
          className="rounded-full bg-[#2E5E4E] px-4 py-2 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5E4E]"
        >
          Xem nhanh
        </Link>
        <Link
          href={href}
          className="text-[#1C2320] underline underline-offset-4"
        >
          Mở thiệp
        </Link>
      </div>
    </article>
  );
}
