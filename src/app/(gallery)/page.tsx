import { Suspense } from "react";
import { templates } from "@/templates/registry";
import { TemplateGrid, TemplateList } from "./_components/template-grid";

export default function Home() {
  return (
    // Fallback = toàn bộ danh sách chưa lọc → HTML prerender vẫn có đủ nội dung.
    <Suspense fallback={<TemplateList items={templates} />}>
      <TemplateGrid templates={templates} />
    </Suspense>
  );
}
