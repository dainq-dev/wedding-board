"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { TemplateMeta } from "@/wedding/types";
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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((t) => (
        <TemplateCard key={t.slug} t={t} />
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

  const update = (fn: (p: URLSearchParams) => void) => {
    const next = new URLSearchParams(params);
    fn(next);
    router.replace(`${pathname}?${next}` as Route, { scroll: false });
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

  const nq = normalize(q);
  const matchAny = (selected: string[], values: string[]) =>
    selected.length === 0 || selected.some((s) => values.includes(s));

  const items = templates
    .filter(
      (t) =>
        normalize([t.name, t.description, ...t.tags].join(" ")).includes(nq) &&
        matchAny(tech, [t.tech]) &&
        matchAny(styles, t.styles) &&
        matchAny(colors, t.colors),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "vi")
        : b.createdAt.localeCompare(a.createdAt),
    );

  const groups = [
    { key: "tech", label: "Công nghệ", options: ["2d", "3d"], selected: tech },
    {
      key: "style",
      label: "Phong cách",
      options: unique(templates.flatMap((t) => t.styles)),
      selected: styles,
    },
    {
      key: "color",
      label: "Màu",
      options: unique(templates.flatMap((t) => t.colors)),
      selected: colors,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          defaultValue={q}
          onChange={(e) =>
            update((p) =>
              e.target.value ? p.set("q", e.target.value) : p.delete("q"),
            )
          }
          placeholder="Tìm mẫu thiệp…"
          aria-label="Tìm mẫu thiệp"
          className="flex-1 rounded-lg border bg-white px-4 py-2"
        />
        <select
          value={sort}
          onChange={(e) => update((p) => p.set("sort", e.target.value))}
          aria-label="Sắp xếp"
          className="rounded-lg border bg-white px-3 py-2"
        >
          <option value="newest">Mới nhất</option>
          <option value="name">Tên A–Z</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        {groups.map((g) => (
          <div
            key={g.key}
            className="flex flex-wrap items-center gap-2 text-sm"
          >
            <span className="w-24 text-zinc-500">{g.label}</span>
            {g.options.map((o) => (
              <button
                key={o}
                type="button"
                aria-pressed={g.selected.includes(o)}
                onClick={() => toggle(g.key, o)}
                className="rounded-full border px-3 py-1 aria-pressed:bg-zinc-900 aria-pressed:text-white"
              >
                {o}
              </button>
            ))}
          </div>
        ))}
      </div>

      {items.length > 0 ? (
        <TemplateList items={items} />
      ) : (
        <div className="flex flex-col items-center gap-3 py-20 text-zinc-500">
          <p>Không có mẫu nào phù hợp.</p>
          <button
            type="button"
            onClick={() => router.replace("/", { scroll: false })}
            className="underline"
          >
            Xoá bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}
