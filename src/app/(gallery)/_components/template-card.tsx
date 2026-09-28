import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import type { TemplateMeta } from "@/wedding/types";

export function TemplateCard({ t }: { t: TemplateMeta }) {
  return (
    <Link
      href={`/mau-thiep-cuoi/${t.slug}` as Route}
      className="group overflow-hidden rounded-xl border bg-white transition hover:shadow-lg"
    >
      <Image
        src={t.thumbnail}
        alt={t.name}
        width={600}
        height={800}
        className="aspect-3/4 w-full object-cover"
      />
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">{t.name}</h2>
          <span className="rounded bg-zinc-900 px-2 py-0.5 text-xs text-white uppercase">
            {t.tech}
          </span>
        </div>
        <p className="text-sm text-zinc-600">{t.description}</p>
        <div className="flex flex-wrap gap-1">
          {t.tags.map((tag) => (
            <span key={tag} className="rounded bg-zinc-100 px-2 py-0.5 text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
