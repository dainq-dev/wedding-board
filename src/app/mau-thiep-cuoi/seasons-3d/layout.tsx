import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { meta } from "./meta";

const serif = Playfair_Display({
  subsets: ["vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Manrope({ subsets: ["vietnamese"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function SeasonsLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/seasons-3d">) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
