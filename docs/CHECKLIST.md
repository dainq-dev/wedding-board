# Checklist 40 mẫu thiệp

> Quy tắc để không làm trùng nhau:
> 1. **Nhận việc trước khi code**: điền tên vào cột *Người làm*, đổi *Trạng thái* thành `🟡 Đang làm`, commit + push file này ngay.
> 2. Mỗi mẫu 1 branch `tpl/<slug>`. Chỉ sửa trong `src/app/mau-thiep-cuoi/<slug>/`, `public/templates/<slug>/` và 1 dòng trong `src/templates/registry.ts`.
> 3. Cần sửa `@/kit`, `@/wedding`, `globals.css` → làm PR riêng, ghi vào mục *Thay đổi dùng chung* bên dưới.
> 4. Xong: tick `[x]`, đổi thành `✅ Xong`, ghi link PR. Tiêu chí “xong” = checklist §12 trong [template-spec.md](./template-spec.md) + tiêu chí nghiệm thu trong spec của mẫu + **đạt [visual-quality.md](./visual-quality.md) và được chủ dự án duyệt bằng mắt**. Người làm chỉ tự đặt tối đa `🔵 Chờ review` (kèm bộ screenshot); **chỉ chủ dự án** chuyển sang `✅ Xong`.
> 5. Chỉ bắt đầu P2 trở đi khi P0 + P1 đã ✅.

Trạng thái: `⬜ Chưa làm` · `🟡 Đang làm` · `🔵 Chờ review` · `✅ Xong` · `⛔ Bị chặn` · `🔁 Làm lại` (không đạt chuẩn thẩm mỹ)

**Tiến độ: 0/40 mẫu** (cập nhật tay)


## P0 — Nền tảng (làm trước, chặn mọi mẫu)

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | — | Nền tảng @/kit + mở rộng WeddingData | [todo-list §3 P0](./todo-list-wedding-page.md) | 🟡 Đang làm | Claude (kit cơ bản + 3D đã dựng) | | Chốt date / bố mẹ / QR trước |

## P1 — Pilot

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 3D-01 | **Hai Vì Sao** `galaxy-3d` | [spec](./templates/galaxy-3d.md) | 🔁 Làm lại | Claude agent | | Không đạt [visual-quality](./visual-quality.md) (29/09): hình khối thô, vật liệu mặc định, ánh sáng phẳng, ảnh là plane trần |
| [ ] | 2D-01 | **Sakura (làm lại)** `sakura-2d` | [spec](./templates/sakura-2d.md) | 🔵 Chờ review | Qwen · 2D-batch-1 | master (cb70eb9/b9cf1be) | chờ chủ dự án duyệt mắt theo visual-quality §6 |
| [ ] | 2D-02 | **Phong Thư Sáp** `letter-2d` | [spec](./templates/letter-2d.md) | 🔵 Chờ review | Qwen · 2D-batch-1 | master (cb70eb9/b9cf1be) | chờ duyệt visual-quality §6 |

## P2 — 2D đợt A

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 2D-03 | **Sổ Polaroid** `polaroid-2d` | [spec](./templates/polaroid-2d.md) | 🔵 Chờ review | Qwen · 2D-batch-1 | master (cb70eb9/b9cf1be) | chờ duyệt visual-quality §6 |
| [ ] | 2D-04 | **Thước Phim** `film-2d` | [spec](./templates/film-2d.md) | 🔵 Chờ review | Qwen · 2D-batch-1 | master (cb70eb9/b9cf1be) | chờ duyệt visual-quality §6 |
| [ ] | 2D-05 | **Tạp Chí Cưới** `editorial-2d` | [spec](./templates/editorial-2d.md) | 🔵 Chờ review | Qwen · 2D-batch-1 | master (cb70eb9/b9cf1be) | chờ duyệt visual-quality §6 |
| [ ] | 2D-06 | **Song Hỷ** `song-hy-2d` | [spec](./templates/song-hy-2d.md) | 🟡 Đang làm | Qwen · 2D-batch-1 | feat/3d-templates | |
| [ ] | 2D-07 | **Áo Dài Tím Huế** `ao-dai-2d` | [spec](./templates/ao-dai-2d.md) | 🟡 Đang làm | Qwen · 2D-batch-1 | feat/3d-templates | |
| [ ] | 2D-08 | **Swiss Mono** `swiss-2d` | [spec](./templates/swiss-2d.md) | 🟡 Đang làm | Qwen · 2D-batch-1 | feat/3d-templates | |
| [ ] | 2D-09 | **Vườn Màu Nước** `botanical-2d` | [spec](./templates/botanical-2d.md) | 🟡 Đang làm | Qwen · 2D-batch-1 | feat/3d-templates | |
| [ ] | 2D-10 | **Boho Đất Nung** `boho-2d` | [spec](./templates/boho-2d.md) | 🟡 Đang làm | Qwen · 2D-batch-1 | feat/3d-templates | |
| [ ] | 2D-11 | **Biển Nhiệt Đới** `tropical-2d` | [spec](./templates/tropical-2d.md) | ⬜ Chưa làm | | | |

## P3 — 3D đợt A

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 3D-02 | **Thư Trong Chai** `ocean-3d` | [spec](./templates/ocean-3d.md) | ⬜ Chưa làm | | | |
| [ ] | 3D-03 | **Phố Hội Đèn Lồng** `lantern-3d` | [spec](./templates/lantern-3d.md) | ⬜ Chưa làm | | | |
| [ ] | 3D-04 | **Ngàn Hạc Giấy** `paper-crane-3d` | [spec](./templates/paper-crane-3d.md) | ⬜ Chưa làm | | | |
| [ ] | 3D-05 | **Rừng Đom Đóm** `firefly-3d` | [spec](./templates/firefly-3d.md) | 🔁 Làm lại | Claude agent | | Không đạt [visual-quality](./visual-quality.md) (29/09): hình khối thô, vật liệu mặc định, ánh sáng phẳng, ảnh là plane trần |

## P4 — 2D đợt B

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 2D-12 | **Tiệc Vườn Picnic** `picnic-2d` | [spec](./templates/picnic-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-13 | **Gatsby** `gatsby-2d` | [spec](./templates/gatsby-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-14 | **Đĩa Than 70s** `vinyl-2d` | [spec](./templates/vinyl-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-15 | **Truyện Tranh** `comic-2d` | [spec](./templates/comic-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-16 | **Nhiệm Vụ 8-bit** `pixel-2d` | [spec](./templates/pixel-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-17 | **Thẻ Lên Máy Bay** `boarding-2d` | [spec](./templates/boarding-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-18 | **Lịch Bloc** `lich-to-2d` | [spec](./templates/lich-to-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-19 | **Báo Tin Vui** `newspaper-2d` | [spec](./templates/newspaper-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-20 | **Cà Phê Sài Gòn** `cafe-2d` | [spec](./templates/cafe-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-21 | **Tin Nhắn Đầu Tiên** `chat-2d` | [spec](./templates/chat-2d.md) | ⬜ Chưa làm | | | |

## P5 — 3D đợt B

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 3D-06 | **Chuyến Tàu Thống Nhất** `train-3d` | [spec](./templates/train-3d.md) | ⬜ Chưa làm | | | |
| [ ] | 3D-07 | **Bốn Mùa Yêu** `seasons-3d` | [spec](./templates/seasons-3d.md) | 🔁 Làm lại | Claude agent | | Không đạt [visual-quality](./visual-quality.md) (29/09): hình khối thô, vật liệu mặc định, ánh sáng phẳng, ảnh là plane trần |
| [ ] | 3D-08 | **Bảo Tàng Kỷ Niệm** `museum-3d` | [spec](./templates/museum-3d.md) | ⬜ Chưa làm | | | |
| [ ] | 3D-09 | **Khinh Khí Cầu** `balloon-3d` | [spec](./templates/balloon-3d.md) | 🔁 Làm lại | Claude agent | | Không đạt [visual-quality](./visual-quality.md) (29/09): hình khối thô, vật liệu mặc định, ánh sáng phẳng, ảnh là plane trần |
| [ ] | 3D-10 | **Đầm Sen** `lotus-3d` | [spec](./templates/lotus-3d.md) | 🔁 Làm lại | Claude agent | | Không đạt [visual-quality](./visual-quality.md) (29/09): hình khối thô, vật liệu mặc định, ánh sáng phẳng, ảnh là plane trần |

## P6 — 2D đợt C

| ✓ | # | Mẫu | Spec | Trạng thái | Người làm | Branch / PR | Ghi chú |
|---|---|---|---|---|---|---|---|
| [ ] | 2D-22 | **Gỗ Mộc Đèn Dây** `rustic-2d` | [spec](./templates/rustic-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-23 | **Neon Sài Gòn** `neon-2d` | [spec](./templates/neon-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-24 | **Sơn Mài** `son-mai-2d` | [spec](./templates/son-mai-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-25 | **Tranh Đông Hồ** `dong-ho-2d` | [spec](./templates/dong-ho-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-26 | **Sương Đà Lạt** `da-lat-2d` | [spec](./templates/da-lat-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-27 | **Bản Đồ Hành Trình** `route-map-2d` | [spec](./templates/route-map-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-28 | **Đá Cẩm Thạch** `marble-2d` | [spec](./templates/marble-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-29 | **Nét Sáp Màu** `crayon-2d` | [spec](./templates/crayon-2d.md) | ⬜ Chưa làm | | | |
| [ ] | 2D-30 | **Đêm Đầy Sao** `starry-2d` | [spec](./templates/starry-2d.md) | ⬜ Chưa làm | | | |

## Thay đổi dùng chung

Ghi lại mọi thay đổi ngoài thư mục mẫu để người khác biết mà rebase.

| Ngày | Người | File | Nội dung | PR |
|---|---|---|---|---|
