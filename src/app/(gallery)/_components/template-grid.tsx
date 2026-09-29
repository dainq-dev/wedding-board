"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TemplateMeta } from "@/wedding/types";
import { COLOR, colorLabel, styleLabel } from "./labels";
import { PreviewDialog } from "./preview-dialog";
import { TemplateCard } from "./template-card";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

const unique = (xs: string[]) => [...new Set(xs)].sort();

type Sort = "newest" | "name";

const withParam = (params: URLSearchParams, key: string, value: string) => {
  const p = new URLSearchParams(params);
  p.set(key, value);
  return `?${p}`;
};

export function TemplateList({
  items,
  previewHref = (slug) => `?xem=${slug}`,
}: {
  items: TemplateMeta[];
  previewHref?: (slug: string) => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((t) => (
        <TemplateCard key={t.slug} t={t} previewHref={previewHref(t.slug)} />
      ))}
    </div>
  );
}

export function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const tech = params.getAll("tech");
  const styles = params.getAll("style");
  const colors = params.getAll("color");
  const sort = (params.get("sort") as Sort) ?? "newest";
  const filtering = q !== "" || tech.length + styles.length + colors.length > 0;

  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    fn(next);
    const s = next.toString();
    router.replace(`${pathname}${s ? `?${s}` : ""}` as Route, {
      scroll: false,
    });
  };
  const toggle = (key: string, value: string) =>
    update((p) => {
      const vals = p.getAll(key);
      p.delete(key);
      for (const v of vals.includes(value)
        ? vals.filter((v) => v !== value)
        : [...vals, value])
        p.append(key, v);
    });
  const clear = () =>
    update((p) => {
      for (const k of ["q", "tech", "style", "color"]) p.delete(k);
    });

  const nq = normalize(q);
  const matchAny = (selected: string[], values: string[]) =>
    selected.length === 0 || selected.some((s) => values.includes(s));

  const items = templates
    .filter(
      (t) =>
        normalize(
          [t.name, t.description, ...t.tags, ...t.styles.map(styleLabel)].join(
            " ",
          ),
        ).includes(nq) &&
        matchAny(tech, [t.tech]) &&
        matchAny(styles, t.styles) &&
        matchAny(colors, t.colors),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "vi")
        : b.createdAt.localeCompare(a.createdAt),
    );

  // Chưa lọc: chia nhóm theo phong cách chính (styles[0]).
  const groups = unique(items.map((t) => t.styles[0])).map((s) => ({
    style: s,
    items: items.filter((t) => t.styles[0] === s),
  }));

  const previewHref = (slug: string) => withParam(params, "xem", slug);
  const preview = templates.find((t) => t.slug === params.get("xem"));

  const chip =
    "rounded-full border border-[#1C2320]/25 px-3.5 py-1.5 aria-pressed:border-[#2E5E4E] aria-pressed:bg-[#2E5E4E] aria-pressed:text-white hover:bg-[#EBCFC7]/60 aria-pressed:hover:bg-[#2E5E4E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5E4E]";

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          defaultValue={q}
          onChange={(e) =>
            update((p) =>
              e.target.value ? p.set("q", e.target.value) : p.delete("q"),
            )
          }
          placeholder="Tìm theo tên, phong cách…"
          aria-label="Tìm mẫu thiệp"
          className="flex-1 rounded-full border border-[#1C2320]/25 bg-white px-5 py-3 focus-visible:outline-2 focus-visible:outline-[#2E5E4E]"
        />
        <select
          value={sort}
          onChange={(e) => update((p) => p.set("sort", e.target.value))}
          aria-label="Sắp xếp"
          className="rounded-full border border-[#1C2320]/25 bg-white px-4 py-3"
        >
          <option value="newest">Mới nhất</option>
          <option value="name">Tên A–Z</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 text-sm">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="float-left mr-2 w-24 text-[#5E6661]">Loại</legend>
          {["2d", "3d"].map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={tech.includes(o)}
              onClick={() => toggle("tech", o)}
              className={chip}
            >
              {o.toUpperCase()}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="float-left mr-2 w-24 text-[#5E6661]">
            Phong cách
          </legend>
          {unique(templates.flatMap((t) => t.styles)).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={styles.includes(o)}
              onClick={() => toggle("style", o)}
              className={chip}
            >
              {styleLabel(o)}
            </button>
          ))}
        </fieldset>
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="float-left mr-2 w-24 text-[#5E6661]">Màu</legend>
          {unique(templates.flatMap((t) => t.colors)).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={colors.includes(o)}
              aria-label={colorLabel(o)}
              title={colorLabel(o)}
              onClick={() => toggle("color", o)}
              className="size-8 rounded-full border border-[#1C2320]/25 ring-offset-2 ring-offset-[#F2F3EE] aria-pressed:ring-2 aria-pressed:ring-[#2E5E4E] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E5E4E]"
              style={{ background: COLOR[o]?.hex }}
            />
          ))}
        </fieldset>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-start gap-3 py-16">
          <p className="text-lg">Chưa có mẫu nào khớp với bộ lọc này.</p>
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-[#2E5E4E] px-5 py-2.5 text-white"
          >
            Xoá bộ lọc
          </button>
        </div>
      ) : filtering ? (
        <div className="flex flex-col gap-6">
          <div className="flex items-baseline gap-4">
            <p aria-live="polite">{items.length} mẫu phù hợp</p>
            <button
              type="button"
              onClick={clear}
              className="text-sm underline underline-offset-4"
            >
              Xoá bộ lọc
            </button>
          </div>
          <TemplateList items={items} previewHref={previewHref} />
        </div>
      ) : (
        groups.map((g) => (
          <section key={g.style} className="flex flex-col gap-5">
            <h3 className="font-(family-name:--font-display) text-2xl">
              {styleLabel(g.style)}
            </h3>
            <TemplateList items={g.items} previewHref={previewHref} />
          </section>
        ))
      )}

      <PreviewDialog
        t={preview}
        onClose={() => {
          if (params.get("xem")) update((p) => p.delete("xem"));
        }}
      />
    </div>
  );
}
