import type { Metadata } from "next";
import { Fraunces, Space_Grotesk } from "next/font/google";
import { meta } from "./meta";

const display = Fraunces({
  subsets: ["vietnamese"],
  weight: "900",
  variable: "--font-display",
});

const body = Space_Grotesk({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function VinylLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/vinyl-2d">) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
