import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { meta } from "./meta";

const display = Playfair_Display({
  subsets: ["vietnamese"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Manrope({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function EditorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${display.variable} ${body.variable}`}>{children}</div>
  );
}
