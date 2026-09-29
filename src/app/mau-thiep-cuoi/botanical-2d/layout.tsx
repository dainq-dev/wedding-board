import type { Metadata } from "next";
import { Cormorant_Garamond, Great_Vibes } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const script = Great_Vibes({ subsets: ["vietnamese"], weight: "400", variable: "--font-script" });
const body = Cormorant_Garamond({ subsets: ["vietnamese"], variable: "--font-body" });

export const metadata: Metadata = { title: meta.name, description: meta.description };

export default function Botanical2DLayout({ children }: { children: ReactNode }) {
  return <div className={`${script.variable} ${body.variable}`}>{children}</div>;
}
