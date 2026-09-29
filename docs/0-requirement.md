# 0. Requirement — Wedding Template Showcase

## 1. Mục tiêu

Một website **100% frontend** (không backend, không database, không API) dùng để trưng bày bộ sưu tập các **template thiệp cưới online tĩnh**. Gồm 3 phần:

1. **Dashboard** — trang chính để duyệt, tìm kiếm, lọc toàn bộ template.
2. **Các trang template** — mỗi template là 1 trang độc lập, layout riêng, ý tưởng riêng, không trùng nhau (2D, 3D three.js, animation GSAP, ...).
3. **Dùng thử** — người dùng nhập thông tin + upload ảnh/video của mình để xem template hiển thị bằng dữ liệu thật của họ, ngay trên máy họ.

## 2. Phạm vi

### Trong phạm vi
- Dashboard liệt kê template: search, filter, sort.
- Mỗi template là 1 trang tĩnh riêng (App Router), tự chứa (component, style, asset riêng).
- Dữ liệu mặc định trong template là **dữ liệu mẫu hardcode** (tên, ngày, địa điểm, ảnh).
- Tính năng "Dùng thử": lưu tạm trên trình duyệt người dùng, tối đa **6 giờ**.
- Deploy dạng static (Vercel hoặc `next build` + static export).

### Ngoài phạm vi
- Đăng nhập, tài khoản người dùng.
- **Chia sẻ** thiệp đã dùng thử cho người khác (không link, không export, không đồng bộ giữa thiết bị).
- Lưu trữ lâu dài dữ liệu dùng thử (quá 6 giờ là xoá).
- RSVP, sổ lưu bút, gửi form tới server (nếu template có form thì chỉ là UI).
- Thanh toán, đặt mua template.
- Đa ngôn ngữ (i18n).

## 3. Kiến trúc dữ liệu

Nguồn metadata duy nhất: 1 file registry tĩnh `src/templates/registry.ts`.

```ts
type TemplateMeta = {
  slug: string;          // trùng tên thư mục route: /t/<slug>
  name: string;
  description: string;
  thumbnail: string;     // ảnh preview trong /public
  tech: "2d" | "3d";
  styles: string[];      // vd: "minimalist", "vintage", "floral", "modern"
  colors: string[];      // tông màu chủ đạo
  tags: string[];
  createdAt: string;     // ISO date, dùng để sort "mới nhất"
  media: {               // số file bắt buộc khi "Dùng thử"
    images: number;
    videos: number;
  };
};
```

- **Không dùng dynamic route** (`[slug]`). Mỗi template là 1 thư mục route tĩnh riêng:
  ```
  src/app/
    page.tsx                 # dashboard
    t/
      sakura-2d/page.tsx     # template 1 (+ layout.tsx riêng nếu cần)
      galaxy-3d/page.tsx     # template 2
      ...
  ```
- Thêm template mới = tạo thư mục `src/app/t/<slug>/` + thêm 1 entry vào registry.
- Dashboard chỉ đọc registry, **không import code của template** (tránh kéo three.js vào bundle dashboard).

## 4. Dashboard (`/`)

### Chức năng
| Chức năng | Mô tả |
|---|---|
| Danh sách | Grid card: thumbnail, tên, badge 2D/3D, tags |
| Search | Tìm theo tên, mô tả, tags (không phân biệt hoa thường, bỏ dấu tiếng Việt) |
| Filter | Theo `tech` (2D/3D), `styles`, `colors`; chọn nhiều giá trị |
| Sort | Mới nhất / Tên A–Z |
| Trạng thái URL | Search/filter/sort lưu trên query string → back/forward hoạt động |
| Empty state | Thông báo khi không có kết quả + nút xoá filter |
| Mở template | Click card → đi tới `/t/<slug>` |

### Yêu cầu
- Search/filter xử lý hoàn toàn phía client (số lượng template nhỏ).
- Responsive: mobile 1 cột, tablet 2, desktop 3–4.

## 5. Trang template (`/t/<slug>`)

- Mỗi template là **1 trang tĩnh độc lập** (`src/app/t/<slug>/page.tsx`), prerender lúc build.
- Mỗi template **có layout riêng**, không dùng header/footer chung của dashboard.
- Mỗi template tự chịu trách nhiệm về font, màu, animation của nó.
- Thành phần chung duy nhất: nút nổi "← Quay lại" và nút "Dùng thử".
- Template 3D: lazy load three.js, có fallback/loading khi WebGL không được hỗ trợ.
- Tôn trọng `prefers-reduced-motion`: giảm/tắt animation nặng.
- Nội dung gợi ý (tuỳ template): tên cô dâu chú rể, ngày giờ, đếm ngược, địa điểm + bản đồ, lịch trình, album ảnh, video, lời mời, nhạc nền (tắt mặc định).
- Template lấy dữ liệu qua 1 hook chung: có dữ liệu dùng thử còn hạn → dùng dữ liệu đó; không có → dữ liệu mẫu.

## 6. Tính năng "Dùng thử"

### Luồng
1. Người dùng bấm **"Dùng thử"** trên trang template → mở form.
2. Nhập thông tin + upload đủ ảnh/video theo `media` của template.
3. Submit → lưu vào trình duyệt → trang template render lại bằng dữ liệu của họ.
4. Có nút **"Xoá dữ liệu dùng thử"** để quay về dữ liệu mẫu.

### Form
| Trường | Bắt buộc | Validate |
|---|---|---|
| Tên chồng, tên vợ | ✅ | Không rỗng, tối đa 50 ký tự |
| Địa chỉ nhà chồng, nhà vợ | ✅ | Không rỗng |
| Năm sinh chồng, vợ | ✅ | Số 4 chữ số, hợp lý (vd 1940 – năm hiện tại − 18) |
| Ảnh | ✅ | **Đúng đủ** số lượng `media.images`; chỉ `image/*`; ≤ 10MB/ảnh |
| Video | ✅ nếu `media.videos > 0` | **Đúng đủ** số lượng `media.videos`; chỉ `video/*`; ≤ 50MB/video |
| Link Google Maps nhà hàng | ✅ | Parse được toạ độ (xem dưới) |

- Nút submit bị khoá cho tới khi hợp lệ; hiển thị tiến độ kiểu "Ảnh 5/8".
- Hiển thị preview ảnh/video và **iframe bản đồ xem trước** ngay khi nhập.

### Google Maps
- Người dùng dán **URL đầy đủ** từ thanh địa chỉ trình duyệt (dạng `https://www.google.com/maps/place/...`).
- Lấy toạ độ theo thứ tự ưu tiên:
  1. `!3d<lat>!4d<lng>` — vị trí ghim chính xác.
  2. `@<lat>,<lng>` — tâm khung nhìn (fallback).
- Tên địa điểm lấy từ đoạn `/place/<tên>/` (decode), dùng làm nhãn.
- Nhúng bằng iframe: `https://www.google.com/maps?q=<lat>,<lng>&z=16&output=embed` (không cần API key).
- Link rút gọn `maps.app.goo.gl/...` **không hỗ trợ** (không có toạ độ, bị CORS) → báo lỗi + hướng dẫn: "Mở link trên trình duyệt máy tính rồi copy URL trên thanh địa chỉ".

### Lưu trữ
- **IndexedDB** (lưu được `File`/`Blob`), không dùng localStorage.
- Mỗi template 1 bản ghi, key = `slug`, kèm `savedAt`.
- **Hết hạn sau 6 giờ** kể từ `savedAt`: khi đọc thấy quá hạn → xoá và dùng dữ liệu mẫu. Mỗi lần mở app cũng dọn các bản ghi hết hạn.
- Submit lại → ghi đè bản ghi cũ.
- Hiển thị file bằng `URL.createObjectURL`, gọi `URL.revokeObjectURL` khi unmount.
- Lỗi hết dung lượng (`QuotaExceededError`) → báo người dùng giảm kích thước file.
- Ghi chú rõ trên form: "Dữ liệu chỉ lưu trên trình duyệt này, tự xoá sau 6 giờ, không ai khác xem được."

## 7. Yêu cầu phi chức năng

- **Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, Biome, Bun. Thêm three.js / GSAP chỉ khi template cần.
- **Hiệu năng**: Dashboard không tải thư viện 3D/animation nặng. Mỗi template code-split theo route.
- **Mobile-first**: thiệp cưới chủ yếu được mở trên điện thoại.
- **SEO**: mỗi template có `metadata` riêng (title, description, OG image).
- **Quyền riêng tư**: dữ liệu dùng thử không bao giờ rời khỏi trình duyệt.
- **Accessibility cơ bản**: alt ảnh, tương phản đủ, form có label, điều hướng được bằng bàn phím.

## 8. Tiêu chí hoàn thành (MVP)

- [ ] Dashboard hiển thị toàn bộ template từ registry.
- [ ] Search + filter + sort hoạt động, lưu trên URL.
- [ ] Tối thiểu **3 template**: ít nhất 1 template 2D và 1 template 3D (three.js).
- [ ] Mỗi template có layout riêng biệt, chạy tốt trên mobile.
- [ ] "Dùng thử": form validate đủ, bắt buộc đủ ảnh/video, bản đồ nhúng đúng toạ độ.
- [ ] Dữ liệu dùng thử hiển thị đúng sau submit và reload; tự mất sau 6 giờ.
- [ ] `bun run build` và `bun run lint` pass.

## 9. Câu hỏi mở (cần chốt)

1. Số lượng template mục tiêu ở bản đầu? (đề xuất: 3)
2. Ngôn ngữ nội dung: tiếng Việt hay tiếng Anh?
3. Ảnh mẫu: dùng ảnh stock miễn phí (Unsplash) hay ảnh tự có?
4. Deploy ở đâu: Vercel hay static export (GitHub Pages)?
5. Bộ giá trị `styles` / `colors` cố định là gì?
6. Form có cần thêm ngày cưới / giờ tiệc không? (template có đếm ngược sẽ cần)
