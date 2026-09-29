import { Be_Vietnam_Pro, Prata } from "next/font/google";
import Link from "next/link";
import { TryItDialog } from "@/try-it/dialog";
import { WeddingDataProvider } from "@/wedding/wedding-data-provider";

// Font nhận diện Kệ Thiệp cho phần UI chung (Dùng thử), tách khỏi font của từng mẫu.
const ui = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
});
const uiDisplay = Prata({
  subsets: ["vietnamese"],
  weight: "400",
  variable: "--font-ui-display",
});

export default function TemplatesLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi">) {
  return (
    <WeddingDataProvider>
      {children}
      <div className={`${ui.variable} ${uiDisplay.variable} contents`}>
        <Link
          href="/"
          className="fixed top-4 left-4 z-50 rounded-full bg-white/90 px-4 py-2 text-sm shadow"
        >
          ← Quay lại
        </Link>
        <TryItDialog />
      </div>
    </WeddingDataProvider>
  );
}
