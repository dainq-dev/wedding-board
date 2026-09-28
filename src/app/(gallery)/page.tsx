import { Suspense } from "react";
import { templates } from "@/templates/registry";
import { Hero } from "./_components/hero";
import { TemplateCard } from "./_components/template-card";
import { TemplateGrid, TemplateList } from "./_components/template-grid";

export default function Home() {
  const threeD = templates.filter((t) => t.tech === "3d");
  const featured = threeD[0] ?? templates[0];

  return (
    <>
      <Hero featured={featured} count={templates.length} />

      {threeD.length > 0 && (
        <section className="flex flex-col gap-6 border-t border-[#1C2320]/15 py-12">
          <div className="flex max-w-xl flex-col gap-2">
            <h2 className="font-(family-name:--font-display) text-3xl">
              Thiệp 3D kể chuyện
            </h2>
            <p className="text-[#5E6661]">
              Mỗi lần cuộn, câu chuyện của hai bạn hiện thêm một chương.
            </p>
          </div>
          <div className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4">
            {threeD.map((t) => (
              <div key={t.slug} className="w-44 shrink-0 snap-start sm:w-52">
                <TemplateCard t={t} previewHref={`?xem=${t.slug}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      <section
        id="mau"
        className="flex scroll-mt-6 flex-col gap-8 border-t border-[#1C2320]/15 py-12"
      >
        <h2 className="font-(family-name:--font-display) text-3xl">
          Tất cả mẫu
        </h2>
        {/* Fallback = danh sách chưa lọc → HTML prerender vẫn đủ nội dung. */}
        <Suspense fallback={<TemplateList items={templates} />}>
          <TemplateGrid templates={templates} />
        </Suspense>
      </section>
    </>
  );
}
