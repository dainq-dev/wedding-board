"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TemplateMeta } from "@/wedding/types";
import { COLOR, colorLabel, styleLabel } from "./labels";
import { TemplateCard } from "./template-card";

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/đ/gi, "d")
    .toLowerCase();

const unique = (xs: string[]) => [...new Set(xs)].sort();

type Sort = "newest" | "name";

export function TemplateList({ items }: { items: TemplateMeta[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {items.map((t, i) => (
        <TemplateCard key={t.slug} t={t} priority={i < 4} />
      ))}
    </div>
  );
}

const CHIP =
  "shrink-0 rounded-full border border-[#16181A]/12 bg-white px-4 py-2 text-sm transition-colors hover:border-[#16181A]/35 aria-pressed:border-[#16181A] aria-pressed:bg-[#16181A] aria-pressed:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E5E4E]";

export function TemplateGrid({ templates }: { templates: TemplateMeta[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = params.get("q") ?? "";
  const tech = params.get("tech") ?? "";
  const styles = params.getAll("style");
  const colors = params.getAll("color");
  const sort = (params.get("sort") as Sort) ?? "newest";
  const filtering =
    q !== "" || tech !== "" || styles.length + colors.length > 0;

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
        (tech === "" || t.tech === tech) &&
        matchAny(styles, t.styles) &&
        matchAny(colors, t.colors),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "vi")
        : b.createdAt.localeCompare(a.createdAt),
    );

  const count = (v: string) =>
    v === "" ? templates.length : templates.filter((t) => t.tech === v).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="sticky top-3 z-30 -mx-2 flex flex-col gap-3 rounded-[1.75rem] border border-[#16181A]/8 bg-[#F7F5F0]/85 p-2 shadow-[0_12px_40px_-24px_rgba(22,24,26,0.35)] backdrop-blur-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div
            role="tablist"
            aria-label="Loại thiệp"
            className="flex rounded-full bg-[#16181A]/6 p-1"
          >
            {(
              [
                ["", "Tất cả"],
                ["2d", "2D"],
                ["3d", "3D"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={tech === v}
                onClick={() =>
                  update((p) => (v ? p.set("tech", v) : p.delete("tech")))
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm text-[#5E6661] transition-colors aria-selected:bg-white aria-selected:text-[#16181A] aria-selected:shadow-sm sm:flex-none"
              >
                {label}
                <span className="text-xs tabular-nums opacity-60">
                  {count(v)}
                </span>
              </button>
            ))}
          </div>
          <label className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 fill-none stroke-[#5E6661] stroke-2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
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
              className="w-full rounded-full border border-[#16181A]/10 bg-white py-2.5 pr-4 pl-10 text-sm outline-none focus-visible:border-[#2E5E4E] focus-visible:ring-2 focus-visible:ring-[#2E5E4E]/20"
            />
          </label>
          <select
            value={sort}
            onChange={(e) => update((p) => p.set("sort", e.target.value))}
            aria-label="Sắp xếp"
            className="rounded-full border border-[#16181A]/10 bg-white px-4 py-2.5 text-sm"
          >
            <option value="newest">Mới nhất</option>
            <option value="name">Tên A–Z</option>
          </select>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          {unique(templates.flatMap((t) => t.styles)).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={styles.includes(o)}
              onClick={() => toggle("style", o)}
              className={CHIP}
            >
              {styleLabel(o)}
            </button>
          ))}
          <span
            aria-hidden="true"
            className="mx-1 h-6 w-px shrink-0 bg-[#16181A]/12"
          />
          {unique(templates.flatMap((t) => t.colors)).map((o) => (
            <button
              key={o}
              type="button"
              aria-pressed={colors.includes(o)}
              aria-label={colorLabel(o)}
              title={colorLabel(o)}
              onClick={() => toggle("color", o)}
              className="size-8 shrink-0 rounded-full border border-[#16181A]/15 ring-offset-2 ring-offset-[#F7F5F0] transition-transform hover:scale-110 aria-pressed:ring-2 aria-pressed:ring-[#16181A] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2E5E4E]"
              style={{ background: COLOR[o]?.hex }}
            />
          ))}
        </div>
      </div>

      {filtering && (
        <div className="flex items-baseline gap-4 px-1 text-sm">
          <p aria-live="polite" className="text-[#5E6661]">
            {items.length} mẫu phù hợp
          </p>
          <button
            type="button"
            onClick={clear}
            className="underline underline-offset-4"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-dashed border-[#16181A]/15 py-20 text-center">
          <p className="font-(family-name:--font-display) text-2xl">
            Chưa có mẫu nào khớp
          </p>
          <button
            type="button"
            onClick={clear}
            className="rounded-full bg-[#16181A] px-5 py-2.5 text-sm text-white"
          >
            Xoá bộ lọc
          </button>
        </div>
      ) : (
        <TemplateList items={items} />
      )}
    </div>
  );
}
