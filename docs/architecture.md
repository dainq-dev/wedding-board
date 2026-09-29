# Architecture — Wedding Template Showcase

> Đi kèm [0-requirement.md](./0-requirement.md). Nguồn tham khảo chính: tài liệu Next.js 16.3 trong `node_modules/next/dist/docs/` (bản đúng với version đang cài).

## 1. Kết luận nhanh

| Quyết định | Chọn | Lý do |
|---|---|---|
| Chiến lược render | **SSG (prerender lúc build)** cho mọi trang | Dữ liệu là hardcode → không có gì để SSR/ISR làm mới |
| SSR / ISR | **Không dùng** (chưa cần) | Không có nguồn dữ liệu thay đổi; thêm vào chỉ tốn server. Để ngỏ nếu sau này registry chuyển sang CMS |
| Cache Components | **Bật** `cacheComponents: true` | Mặc định PPR + giữ state khi điều hướng (`<Activity>`) |
| Tổ chức route | Mỗi template = 1 thư mục tĩnh `app/t/<slug>/` | Theo requirement; code-split tự nhiên |
| Metadata template | `meta.ts` **đặt cạnh** từng template, registry gom lại | Thêm/xoá template chỉ đụng 1 thư mục + 1 dòng |
| Contract template | Mọi template nhận cùng 1 prop `data: WeddingData` | Cho phép "Dùng thử" và tái sử dụng dữ liệu mẫu |
| Search/filter | Client-side, đọc `useSearchParams` | Giữ dashboard 100% static |
| Form "Dùng thử" | `<dialog>` native + React 19 form action (`useActionState`) chạy client | Không cần server action, không cần thư viện form |
| 3D | three.js load qua `next/dynamic` (`ssr: false`) trong đúng template cần | Dashboard và template 2D không tải three.js |
| Deploy | **Vercel** | Cache Components cần Node runtime; static export không hỗ trợ đầy đủ |

### Về yêu cầu "ưu tiên SSR, ISR, SSG"
Nói thẳng: với dự án **không có backend, dữ liệu hardcode**, chỉ **SSG** mang lại giá trị. ISR/SSR tồn tại để làm mới dữ liệu từ nguồn bên ngoài — ở đây không có nguồn đó. Dữ liệu "Dùng thử" nằm trong IndexedDB của trình duyệt, server không bao giờ thấy được, nên phần đó **bắt buộc** là client-side.

Kiến trúc dưới đây vẫn mở đường: nếu sau này registry chuyển sang CMS, chỉ cần bọc hàm đọc registry bằng `'use cache'` + `cacheLife('hours')` là có ISR, không phải đổi cấu trúc.

## 2. Cấu trúc thư mục

```
src/
├── app/
│   ├── layout.tsx                 # Root: <html>/<body> tối giản, KHÔNG font/theme chung
│   ├── globals.css                # Chỉ Tailwind base + reset
│   ├── (gallery)/                 # Route group: không xuất hiện trên URL
│   │   ├── layout.tsx             # Font + header/footer của dashboard
│   │   ├── page.tsx               # "/" — Server Component, render registry
│   │   └── _components/
│   │       ├── template-grid.tsx  # 'use client' — search/filter/sort
│   │       ├── filter-bar.tsx
│   │       └── template-card.tsx
│   └── mau-thiep-cuoi/
│       ├── layout.tsx             # Chỉ gắn <BackButton/> + <TryItButton/> nổi
│       ├── sakura-2d/
│       │   ├── meta.ts            # TemplateMeta của template này
│       │   ├── layout.tsx         # Font, màu, metadata riêng
│       │   ├── page.tsx           # <WeddingDataProvider> + <SakuraInvite/>
│       │   ├── opengraph-image.png
│       │   └── _components/       # Mọi thứ riêng của template
│       └── galaxy-3d/
│           ├── meta.ts
│           ├── layout.tsx
│           ├── page.tsx
│           └── _components/
│               ├── galaxy-invite.tsx
│               └── scene.tsx      # three.js, load bằng next/dynamic
├── templates/
│   └── registry.ts                # import tất cả meta.ts → TemplateMeta[]
├── wedding/                       # Lõi dùng chung cho mọi template
│   ├── types.ts                   # WeddingData, TemplateMeta
│   ├── sample-data.ts             # Dữ liệu mẫu mặc định
│   ├── wedding-data-provider.tsx  # 'use client' — sample hoặc dữ liệu dùng thử
│   └── use-wedding-data.ts
├── try-it/                        # Tính năng "Dùng thử"
│   ├── try-it-dialog.tsx          # 'use client' — form
│   ├── trial-store.ts             # IndexedDB + TTL 6 giờ
│   └── parse-maps-url.ts          # + parse-maps-url.test.ts
└── components/                    # UI dùng chung thật sự (BackButton, MapEmbed…)
```

Quy tắc:
- **Thư mục `_components`** (tiền tố `_`) là private folder — Next không biến nó thành route. Mọi thứ riêng của 1 template ở trong thư mục template đó.
- **Không template nào import từ template khác.** Chỉ được import từ `wedding/`, `try-it/`, `components/`.
- Thêm template = copy 1 thư mục có sẵn, đổi tên, sửa `meta.ts`, thêm 1 dòng vào `registry.ts`.

## 3. Contract dùng chung

```ts
// wedding/types.ts
export type WeddingData = {
  groom: { name: string; address: string; birthYear: number };
  bride: { name: string; address: string; birthYear: number };
  venue: { lat: number; lng: number; name?: string };
  images: string[];   // URL: ảnh mẫu trong /public hoặc blob: URL từ dùng thử
  videos: string[];
};

export type TemplateMeta = {
  slug: string;       // = tên thư mục trong app/t/
  name: string;
  description: string;
  thumbnail: string;
  tech: "2d" | "3d";
  styles: string[];
  colors: string[];
  tags: string[];
  createdAt: string;
  media: { images: number; videos: number };
};
```

Trang template chỉ làm 1 việc:

```tsx
// app/t/sakura-2d/page.tsx  (Server Component, prerender lúc build)
import { WeddingDataProvider } from "@/wedding/wedding-data-provider";
import { SakuraInvite } from "./_components/sakura-invite";
import { meta } from "./meta";

export default function Page() {
  return (
    <WeddingDataProvider slug={meta.slug}>
      <SakuraInvite />
    </WeddingDataProvider>
  );
}
```

Luồng dữ liệu:
1. **Build**: HTML prerender bằng `sample-data` → SEO tốt, hiển thị tức thì.
2. **Client**: Provider đọc IndexedDB theo `slug`. Có bản ghi còn hạn (< 6h) → thay bằng dữ liệu dùng thử (blob URL). Không có → giữ dữ liệu mẫu.

## 4. Tính năng mới của Next.js 16 / React 19 dùng ở đâu

| Tính năng | Dùng ở đâu | Ghi chú |
|---|---|---|
| **Cache Components / PPR** (`cacheComponents: true`) | Toàn app | Shell static phục vụ ngay; Suspense boundary chỉ ở phần đọc `searchParams` |
| **`<Activity>`** (tự bật cùng Cache Components) | Dashboard ↔ template | Quay lại dashboard vẫn giữ nguyên filter, scroll. Cần reset dialog "Dùng thử" khi ẩn (docs: `preserving-ui-state.md`) |
| **`<ViewTransition>`** (React) | Thumbnail card → hero của template | Hiệu ứng morph khi mở template; trình duyệt không hỗ trợ thì chỉ không animate |
| **React Compiler** (`reactCompiler: true`) | Toàn app | Bỏ `useMemo`/`useCallback` thủ công. Cần `bun add -D babel-plugin-react-compiler` |
| **`typedRoutes: true`** | `<Link href>` | Gõ sai `/t/<slug>` là lỗi TypeScript lúc build |
| **`LayoutProps` / `PageProps`** global type | Mọi layout/page | Type tự sinh theo route |
| **`useActionState` + `<form action>`** | Form "Dùng thử" | Action chạy client (ghi IndexedDB), có pending state sẵn |
| **`next/font` theo layout** | Mỗi `app/t/<slug>/layout.tsx` | Mỗi template chỉ tải font của nó |
| **`opengraph-image`** file convention | Mỗi thư mục template | Ảnh share riêng, không cần code |
| **`next/dynamic` `ssr: false`** | Canvas three.js | Tách chunk 3D khỏi HTML prerender |

Không dùng (và lý do):
- **Server Actions / Route Handlers** — không có backend.
- **Dynamic route `[slug]` + `generateStaticParams`** — requirement chọn trang tĩnh riêng; mỗi template có layout riêng nên dynamic route cũng không giúp gì.
- **Nhiều root layout** (mỗi template có `<html>` riêng) — cô lập tốt nhất nhưng gây full page reload khi chuyển trang và mất `<Activity>`/`<ViewTransition>`. Dùng nested layout là đủ.
- **Intercepting route cho modal "Dùng thử"** — đẹp nhưng thừa; `<dialog>` native làm được với ít code hơn.

## 5. Cô lập style giữa các template

Rủi ro lớn nhất khi có nhiều template: CSS của template này ảnh hưởng template khác.
- Tailwind: class utility không xung đột, an toàn.
- Không viết CSS thuần. Keyframes tự định nghĩa (ngoại lệ duy nhất) khai báo trong `@theme` của `globals.css`, tên có tiền tố slug — xem [template-spec.md §5](./template-spec.md).
- Font: khai báo trong `layout.tsx` của template, gán qua `className` trên wrapper.

## 6. Case study tham khảo

| Nguồn | Học được gì |
|---|---|
| Vercel — *cache-components-public-pages* (demo trong docs `public-static-pages.md`) | Trang public = static shell + cache; đúng mô hình dashboard |
| Vercel — *react-view-transitions-demo* (docs `view-transitions.md`) | Pattern gallery → detail morph thumbnail, đúng luồng card → template |
| iWedding (biihappy.com/iwedding/templates) | Nền tảng VN: gallery mẫu thiệp tách riêng, mỗi mẫu có trang xem trước riêng — xác nhận mô hình "dashboard + trang template độc lập" |
| Thiệp Trao Tay, Vesey, WeddingBook | Các nền tảng VN khác cùng mô hình chọn mẫu → điền thông tin cặp đôi → xem thiệp; khác biệt của dự án này là toàn bộ chạy trên client, không tài khoản |
| DEV.to — *I built 20 production Next.js 15 templates* | Kinh nghiệm quản lý nhiều template: tách mỗi template độc lập, dùng chung stack App Router + TS + Tailwind v4 |

## 7. Việc cần làm tiếp

1. Cập nhật `next.config.ts`: `cacheComponents`, `reactCompiler`, `typedRoutes`.
2. Dựng `wedding/`, `templates/registry.ts`, `try-it/`.
3. Dashboard `(gallery)/`.
4. 2 template mẫu: 1 bản 2D, 1 bản 3D — kiểm chứng contract.
5. `bun run build` → mọi route hiện `○ (Static)`.

## Nguồn

- Next.js docs (local, v16.3.6): `01-getting-started/02-project-structure.md`, `02-guides/public-static-pages.md`, `02-guides/rendering-philosophy.md`, `02-guides/preserving-ui-state.md`, `02-guides/view-transitions.md`, `02-guides/static-exports.md`, `03-api-reference/03-file-conventions/route-groups.md`, `03-api-reference/05-config/01-next-config-js/{cacheComponents,reactCompiler,typedRoutes}.md`
- [Showcase | Next.js](https://nextjs.org/showcase)
- [I built 20 production Next.js 15 templates — DEV Community](https://dev.to/cekuu35/i-built-20-production-nextjs-15-templates-the-stack-patterns-and-lessons-j0c)
- [iWedding templates](https://biihappy.com/iwedding/templates)
- [Thiệp Trao Tay](https://thieptraotay.com/) · [Vesey](https://vesey.vn/) · [WeddingBook](https://www.weddingbook.vn/thiep-cuoi-online)
- [Top 10+ website làm thiệp cưới online — CellphoneS](https://cellphones.com.vn/sforum/lam-thiep-cuoi-online)
