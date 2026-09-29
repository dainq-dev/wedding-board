import type { Metadata } from "next";
import { Fraunces, Josefin_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const display = Fraunces({
  subsets: ["vietnamese"],
  style: ["italic"],
  variable: "--font-boho-display",
});

const body = Josefin_Sans({
  subsets: ["vietnamese"],
  variable: "--font-boho-body",
});

export const metadata: Metadata = { title: meta.name, description: meta.description };

export default function Boho2dLayout({ children }: { children: ReactNode }) {
  return <div className={`${display.variable} ${body.variable}`}>{children}</div>;
}
