"use client";

import { usePathname } from "next/navigation";
import { createContext, use, useEffect, useState } from "react";
import { getTemplate } from "@/templates/registry";
import { clearTrial, loadTrial, toWeddingData } from "@/try-it/trial-store";
import { sampleData } from "./sample-data";
import type { TemplateMeta, WeddingData } from "./types";

type Ctx = {
  meta: TemplateMeta;
  data: WeddingData;
  isTrial: boolean;
  reload: () => void;
  clear: () => Promise<void>;
};

const WeddingContext = createContext<Ctx | null>(null);

export function useWedding() {
  const ctx = use(WeddingContext);
  if (!ctx) throw new Error("useWedding phải nằm trong <WeddingDataProvider>");
  return ctx;
}

// Đặt ở app/mau-thiep-cuoi/layout.tsx: slug lấy từ URL nên page không cần truyền gì.
export function WeddingDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const slug = usePathname().split("/").at(-1) ?? "";
  const meta = getTemplate(slug);
  const [trial, setTrial] = useState<WeddingData | null>(null);
  const [version, setVersion] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: version là trigger để đọc lại IndexedDB
  useEffect(() => {
    let data: WeddingData | null = null;
    let cancelled = false;
    loadTrial(slug).then((r) => {
      if (cancelled || !r) return setTrial(null);
      data = toWeddingData(r);
      setTrial(data);
    });
    return () => {
      cancelled = true;
      for (const url of [...(data?.images ?? []), ...(data?.videos ?? [])])
        URL.revokeObjectURL(url);
    };
  }, [slug, version]);

  if (!meta) return children; // trang con không phải template
  return (
    <WeddingContext
      value={{
        meta,
        data: trial ?? sampleData,
        isTrial: trial !== null,
        reload: () => setVersion((v) => v + 1),
        clear: async () => {
          await clearTrial(slug);
          setVersion((v) => v + 1);
        },
      }}
    >
      {children}
    </WeddingContext>
  );
}
