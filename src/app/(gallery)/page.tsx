import { Suspense } from "react";
import { listedTemplates as templates } from "@/templates/registry";
import { Hero } from "./_components/hero";
import { TemplateGrid, TemplateList } from "./_components/template-grid";

export default function Home() {
  const threeD = templates.filter((t) => t.tech === "3d");
  const twoD = templates.filter((t) => t.tech === "2d");
  const picks = [twoD[0], threeD[0], twoD[1] ?? threeD[1]].filter(
    (t) => t !== undefined,
  );

  return (
    <>
      <Hero picks={picks} count={templates.length} count3d={threeD.length} />

      <section id="mau" className="flex scroll-mt-4 flex-col gap-6 pb-24">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-(family-name:--font-display) text-3xl sm:text-4xl">
            Bộ sưu tập
          </h2>
          <p className="hidden text-sm text-[#5E6661] sm:block">
            Chạm vào thiệp để xem, hoặc chia sẻ cho nửa kia.
          </p>
        </div>
        {/* Fallback = danh sách chưa lọc → HTML prerender vẫn đủ nội dung. */}
        <Suspense fallback={<TemplateList items={templates} />}>
          <TemplateGrid templates={templates} />
        </Suspense>
      </section>
    </>
  );
}
