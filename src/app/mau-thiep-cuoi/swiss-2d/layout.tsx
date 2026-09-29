import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const sans = Inter({ subsets: ["vietnamese"], variable: "--font-swiss-sans" });
const mono = Space_Mono({
  subsets: ["vietnamese"],
  weight: ["400", "700"],
  variable: "--font-swiss-mono",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Swiss2DLayout({ children }: { children: ReactNode }) {
  return <div className={`${sans.variable} ${mono.variable}`}>{children}</div>;
}
