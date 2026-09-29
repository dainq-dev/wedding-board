import type { Metadata } from "next";
import { Josefin_Sans, Playfair_Display } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const display = Playfair_Display({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-display",
});

const body = Josefin_Sans({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function Gatsby2dLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
