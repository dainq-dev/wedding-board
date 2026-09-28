import type { Metadata } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { meta } from "./meta";

const script = Pinyon_Script({
  subsets: ["vietnamese"],
  variable: "--font-script",
});
const body = Cormorant_Garamond({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function LetterLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi/letter-2d">) {
  return (
    <div className={`${script.variable} ${body.variable}`}>{children}</div>
  );
}
