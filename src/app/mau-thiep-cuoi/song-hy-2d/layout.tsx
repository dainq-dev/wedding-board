import type { Metadata } from "next";
import { Noto_Serif, Noto_Serif_Display } from "next/font/google";
import { meta } from "./meta";

const display = Noto_Serif_Display({
  subsets: ["vietnamese"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
});
const body = Noto_Serif({
  subsets: ["vietnamese"],
  weight: ["400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function SongHy2dLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/song-hy-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
