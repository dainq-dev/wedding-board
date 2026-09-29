import Link from "next/link";
import { TryItDialog } from "@/try-it/try-it-dialog";
import { WeddingDataProvider } from "@/wedding/wedding-data-provider";

export default function TemplatesLayout({
  children,
}: LayoutProps<"/mau-thiep-cuoi">) {
  return (
    <WeddingDataProvider>
      {children}
      <Link
        href="/"
        className="fixed top-4 left-4 z-50 rounded-full bg-white/90 px-4 py-2 text-sm shadow"
      >
        ← Quay lại
      </Link>
      <TryItDialog />
    </WeddingDataProvider>
  );
}
