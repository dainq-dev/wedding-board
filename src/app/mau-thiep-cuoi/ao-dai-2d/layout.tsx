import type { Metadata } from "next";
import { Ephesis, Lora } from "next/font/google";
import type { ReactNode } from "react";
import { meta } from "./meta";

const script = Ephesis({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});
const body = Lora({
  subsets: ["vietnamese"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: meta.name,
  description: meta.description,
};

export default function AoDai2dLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className={`${script.variable} ${body.variable}`}>{children}</div>
  );
}
