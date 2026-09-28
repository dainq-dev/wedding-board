import type { Metadata } from "next";
import { Playfair_Display, Space_Mono } from "next/font/google";
import { meta } from "./meta";

const display = Playfair_Display({
  subsets: ["vietnamese"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const mono = Space_Mono({
  subsets: ["vietnamese"],
  weight: ["400", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function FilmLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/film-2d">) {
  return <div className={`${display.variable} ${mono.variable}`}>{children}</div>;
}
