# Dashboard — Kệ thiệp

> Spec thiết kế trang `/`. Code ở `src/app/(gallery)/`.

## 1. Đề bài

- **Người dùng:** cặp đôi sắp cưới, chủ yếu mở trên điện thoại, đang chọn mẫu thiệp online.
- **Việc chính của trang:** giúp họ chọn được một mẫu và thử ngay bằng ảnh của mình.
- **Ý tưởng:** trang được dựng như một **kệ trưng bày điện thoại**. Thiệp online sống trong màn hình điện thoại, nên mỗi mẫu được trình bày trong khung điện thoại, và thiệp có thể **chạy thật ngay trong khung** (iframe). Người dùng xem được trải nghiệm thật, không chỉ nhìn ảnh chụp.

## 2. Tokens

| Tên | Hex | Dùng cho |
|---|---|---|
| `mist` | `#F2F3EE` | Nền trang: trắng xám ngả xanh, như giấy dó dưới trời sương (tránh tông kem) |
| `ink` | `#1C2320` | Chữ, khung điện thoại |
| `jade` | `#2E5E4E` | Hành động chính, trạng thái được chọn |
| `blush` | `#EBCFC7` | Nền nhấn nhẹ: vùng hero, chip đang chọn khi hover |
| `brass` | `#A8874A` | Đường viền mảnh cho mẫu 3D nổi bật (chỉ dùng ở đó) |
| `stone` | `#5E6661` | Chữ phụ (tương phản trên `mist` khoảng 5.6:1) |

**Chữ**
- Tiêu đề: **Prata** (serif, có tiếng Việt), 44px / 60px (mobile / desktop), line-height 1.1.
- Nội dung: **Be Vietnam Pro** 400/500, 16px, line-height 1.6.
- Không dùng chữ viết hoa cho nhãn, không dùng font mono, không thêm "→" sau chữ trên nút.

**Hình khối**
- Khung điện thoại: bo góc `2.25rem`, viền 10px màu `ink`, có tai thỏ.
- Nút: bo `9999px`.
- Mỗi nhóm thành phần có bán kính bo góc riêng, không bo đồng loạt.

**Chuyển động:** chỉ có một khoảnh khắc chuyển động đáng chú ý, là lúc bấm "Chạy thiệp" và khung điện thoại bật sáng (thiệp trong iframe tự chạy animation của nó). Card không có hiệu ứng hover nổi lên.

## 3. Bố cục

```
Desktop (≥1024)
┌──────────────────────────────────────────────────────────────┐
│ Kệ Thiệp                                  6 mẫu thiệp        │
├──────────────────────────────────────────────────────────────┤
│ Thiệp cưới online,                         ┌──────────┐       │
│ thử bằng ảnh của chính bạn.                │  phone   │       │
│ Chọn một mẫu, tải ảnh cưới lên, xem        │  poster  │       │
│ thiệp của hai bạn chạy ngay trên máy.      │ [Chạy    │       │
│ [Xem các mẫu]  [Thử mẫu Hai Vì Sao]        │  thiệp]  │       │
│                                            └──────────┘       │
├──────────────────────────────────────────────────────────────┤
│ Thiệp 3D kể chuyện                                           │
│ Cuộn để xem câu chuyện của hai bạn hiện ra.                  │
│ [phone][phone][phone][phone][phone] ← cuộn ngang             │
├──────────────────────────────────────────────────────────────┤
│ Tất cả mẫu (id="mau")                                        │
│ [Tìm mẫu…                       ] [Mới nhất ▾]               │
│ Loại   (2D) (3D)                                             │
│ Phong cách (Tối giản) (Hoa lá) (Điện ảnh) …                  │
│ Màu    ● ● ● ● ●   (chấm màu thật)                           │
│                                                              │
│ Chưa lọc → chia nhóm theo phong cách chính:                  │
│ Điện ảnh   [card][card][card]                                │
│ Hoa lá     [card][card]                                      │
│ Có lọc → lưới kết quả + "3 mẫu phù hợp"                      │
└──────────────────────────────────────────────────────────────┘

Mobile (360): hero xếp dọc (chữ → phone thu nhỏ 240px), dải 3D cuộn ngang
kiểu snap, lưới 2 cột với card nhỏ.
```

Căn trái toàn bộ, chỉ phần khung điện thoại ở hero là căn giữa trong cột của nó.

**Card mẫu**
```
┌─────────┐
│ ▔▔▔▔▔▔▔ │ ← khung phone nhỏ (viền 6px), ảnh thumbnail 9:19
│  thumb  │
│         │
└─────────┘
Hai Vì Sao              3D
Hai ngôi sao bay về phía nhau…   (1 dòng, cắt …)
[Xem nhanh]  Mở thiệp
```
Card không có nền hay đổ bóng, chỉ có khung điện thoại. Tên dùng Prata 20px.

## 4. Xem nhanh

- Bấm **"Xem nhanh"** sẽ đặt `?xem=<slug>` lên URL. Hộp thoại mở dựa theo tham số này, nên có thể chia sẻ link, nút back của trình duyệt đóng được hộp thoại, và nó hoạt động đúng với `<Activity>` (theo docs Next `preserving-ui-state`).
- Nội dung hộp thoại (`<dialog>` native):
  - Bên trái: khung điện thoại chứa `<iframe src="/mau-thiep-cuoi/<slug>">`.
  - Bên phải: tên, mô tả, loại, phong cách, màu, và yêu cầu "Cần 8 ảnh và 1 video để dùng thử".
  - Hai nút: **Mở thiệp** (đi tới trang) và **Đóng**.
- Mobile: hộp thoại chiếm toàn màn hình; khung điện thoại chiếm gần hết chiều cao, thông tin nằm bên dưới.
- Iframe chỉ được tạo khi hộp thoại đang mở (`loading="lazy"`), và bị gỡ khi đóng để dừng nhạc và 3D.

## 5. Nhãn tiếng Việt

| Giá trị | Nhãn |
|---|---|
| minimalist · floral · vintage · modern · luxury · traditional · playful · cinematic | Tối giản · Hoa lá · Cổ điển · Hiện đại · Sang trọng · Truyền thống · Vui tươi · Điện ảnh |
| white · pink · red · gold · green · blue · purple · black · beige | chấm màu hex + `aria-label` "Trắng", "Hồng", "Đỏ", "Vàng kim", "Xanh lá", "Xanh dương", "Tím", "Đen", "Be" |

## 6. Hiệu năng
- Trang `/` vẫn là static. Không import code của template (three.js chỉ tải bên trong iframe khi người dùng bấm).
- Poster ở hero là thumbnail; iframe ở hero chỉ tạo sau khi bấm "Chạy thiệp".

## 7. Nghiệm thu
- [ ] Bố cục đúng ở 360, 768 và 1440px; không có thanh cuộn ngang ngoài dải 3D
- [ ] Mở và đóng "Xem nhanh" bằng nút, phím Esc và nút back của trình duyệt; đóng xong thì nhạc trong iframe dừng
- [ ] Lọc và tìm kiếm vẫn lưu trên URL; bấm "Xoá bộ lọc" thì quay về chế độ chia nhóm
- [ ] Focus bàn phím nhìn thấy rõ; chấm màu có `aria-label`
- [ ] `bun run build`: `/` vẫn là `○ Static`; JS của `/` không chứa three
