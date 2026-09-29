import type { Metadata } from "next";
import { Be_Vietnam_Pro, Noto_Serif_Display } from "next/font/google";
import { meta } from "./meta";

const serif = Noto_Serif_Display({
  subsets: ["vietnamese"],
  weight: ["200", "300", "400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
});
const sans = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["300", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function LotusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={`${serif.variable} ${sans.variable}`}>{children}</div>;
}
