import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { meta } from "./meta";

const serif = Cormorant_Garamond({
  subsets: ["vietnamese"],
  weight: ["300"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "400"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function GalaxyLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/galaxy-3d">) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
