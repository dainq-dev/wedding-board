import type { Metadata } from "next";
import { Bangers, Nunito } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const display = Bangers({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-comic-display",
});

const body = Nunito({
  subsets: ["vietnamese"],
  weight: ["600", "800", "900"],
  variable: "--font-comic-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Comic2DLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
