# 2D-01 · `sakura-2d` · Sakura (làm lại)

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Đây là bản **làm lại** mẫu tham chiếu hiện có tại `src/app/mau-thiep-cuoi/sakura-2d/` (hiện chỉ có tên, lưới ảnh, địa chỉ, bản đồ).

---

## 1. Concept

**Một câu:** Một cành anh đào mảnh mọc dần dọc mép trái trang khi khách cuộn xuống; mỗi nhánh con nở ra đúng chỗ một phần nội dung, cánh hoa rơi dày dần như mùa hoa đang tới độ.

**Cảm xúc muốn gợi:** tĩnh, nhẹ, tinh tế kiểu Nhật. Nhiều khoảng trắng, đọc chậm, thở chậm.

**Phù hợp với:** cặp đôi thích tối giản, tông pastel, cưới mùa xuân hoặc tiệc ngoài trời ban ngày; ảnh cưới sáng, trong.

**Khác các mẫu khác ở chỗ:** trang **không chia thành card đóng khung**. Cả trang là một tờ giấy trắng dài, trục chính là **cành hoa SVG vẽ theo cuộn** (A6 scrub, cả trang). Nội dung bám vào các nhánh, lệch trái–phải theo nhịp bất đối xứng. Màn mở là **vòng tròn nở ra từ nút** (T4). Mật độ cánh hoa rơi (A8) tăng theo tiến độ cuộn: đầu trang lác đác, cuối trang như mưa hoa.

**Moodboard:** giấy washi trắng ngà, anh đào Yoshino, con dấu đỏ hanko, khoảng trắng kiểu ma (間), chữ viết tay mềm.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#FFF7F8` | Nền trang, trắng phớt hồng |
| `surface` | `#FFFFFF` | Thẻ sự kiện, form, lịch |
| `blossom` | `#F4B6C2` | Cánh hoa, chấm mốc, nền nhạt |
| `blossom-soft` | `#FBE3E8` | Khối nền nhạt (đếm ngược, QR) |
| `primary` | `#D9667F` | Nút, trái tim khoanh ngày, số lớn |
| `primary-dark` | `#B4475F` | Hover, chữ nhấn trên nền sáng |
| `branch` | `#6E4B4F` | Nét cành cây |
| `text` | `#5B3A44` | Chữ chính |
| `text-soft` | `#8C6B74` | Chữ phụ |

Tương phản: `text` trên `bg` ≈ 10:1 ✅. `text-soft` trên `bg` ≈ 4.8:1 ✅. Chữ trắng trên `primary` ≈ 3.6:1 ❌ → nút dùng `primary-dark` (`#B4475F`, chữ trắng ≈ 5.3:1 ✅); `primary` chỉ dùng cho chữ ≥ 24px hoặc trang trí.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Dancing Script 600 | 48px / 1.05 | 80px | Chỉ tên và chữ ký |
| Tiêu đề section | Playfair Display 500, VIẾT HOA, tracking 0.3em | 13px | 14px | "LỄ THÀNH HÔN" |
| Số lớn | Playfair Display 400 italic | 88px | 128px | ngày, giờ |
| Nội dung | Playfair Display 400 | 17px / 1.7 | 19px | |
| Chú thích | Playfair Display 400 italic | 14px | 15px | |

Cả hai font có subset `vietnamese` (giữ nguyên font của mẫu cũ).

### Hình khối và chất liệu
- **Không có khung card** ở phần lớn trang; chỉ thẻ sự kiện/form có `rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(91,58,68,0.25)]`.
- **Ảnh**: khung vòm `rounded-t-full` (bìa, chân dung), bo `rounded-2xl` (album).
- **Con dấu hanko**: hình vuông bo `rounded-md` màu `primary`, chữ viết tắt trắng, xoay −4°, dùng làm chữ ký cuối trang.
- **Cành cây**: 1 SVG `path` dài chạy dọc trang ở `left-3` (mobile) / `left-[8vw]` (desktop), nét `branch` 2px, nhánh con 1.25px.
- **Motion**: ease `power2.out`, vào 0.8s. Cánh hoa rơi `sine.inOut`. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: piano solo nhẹ, có thể thêm koto/đàn hạc rất khẽ, không lời.
- **Tempo**: 65–75 BPM. **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `japanese piano calm romantic`, `soft piano spring`
- **Hành vi**: phát khi bấm nút "Mở" (C1), âm lượng 0 → 0.6 trong 1.5s. Nút nổi góc trên phải. Ẩn tab → dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Màn mở (nút tròn)      │ 100svh  fixed, T4 mở vòng tròn
├───────────────────────────┤  ┊ ← cành cây SVG chạy suốt từ đây (A6 scrub)
│ C2  Tên + ảnh vòm          │ 100svh  ┊ gốc cành
│ C3  Nhà trai / nhà gái     │ 100svh  ┊ nhánh 1
│ C4  Chuyện tình (3 mốc)    │ 150svh  ┊ nhánh 2–4, mỗi mốc là 1 bông
│ C5+C11 Lịch + đếm ngược    │ 110svh  ┊ nhánh 5
│ C6+C7 Sự kiện + bản đồ     │ 140svh  ┊ nhánh 6
│ C8  Album masonry          │ 160svh  ┊ cành xoè rộng, nhiều hoa
│ C14 Mừng cưới              │  80svh  ┊
│ C10 Lời cảm ơn + hanko     │ 100svh  ┊ ngọn cành, mưa hoa dày nhất
└───────────────────────────┘
```

Chiều rộng nội dung `min(88vw, 520px)`, lệch phải trên mobile (chừa 40px cho cành bên trái). Desktop: nội dung giữa, cành ở `8vw`, bên phải có vài cánh hoa lớn parallax (A4, `data-speed="0.8"`).
Toàn trang chỉ dùng **T1** sau khi mở, sự liền mạch đến từ cành cây chứ không từ chuyển cảnh.

---

## 5. Chi tiết từng section

### C1 · Màn mở

**Mục đích:** khoảnh khắc chờ ngắn và cú bấm để được phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←(nút chung)               │
│                ╲ ✿ ✿       │  ← cành anh đào SVG góc trên phải
│                  ╲✿        │     (tránh góc nút nhạc: cành bắt đầu từ y=72px)
│                            │
│       Minh Quân            │  ← Dancing 36px
│           &                │
│         Thu Hà             │
│                            │
│          ╭────╮            │
│          │ Mở │            │  ← nút tròn 88px, primary-dark, chữ trắng
│          ╰────╯            │
│    Chạm để mở thiệp mời    │  ← italic 14px text-soft
│                            │
└────────────────────────────┘
```

**Nội dung:** `{groom.name}` & `{bride.name}`; nút "Mở"; dòng *"Chạm để mở thiệp mời"*.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Cành góc A6 vẽ `0% → 100%` (1.4s, `power1.inOut`) |
| 0.6s | Các bông hoa trên cành `scale 0 → 1` stagger 0.08 |
| 0.8s | Tên A1 |
| 1.4s → lặp | Nút A12 (`scale 1 ↔ 1.05`, 2s) + vòng sóng mờ lan ra (`scale 1 → 1.6`, `opacity 0.4 → 0`) |

**Khi bấm (tổng 1.4s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát, fade vào |
| 0.0s | Nút `scale 1 → 0.9` rồi chữ "Mở" fade |
| 0.1s | Lớp C1 `clip-path: circle(150% at <tâm nút>) → circle(0% at <tâm nút>)` (1.0s, `power3.inOut`) — lộ trang phía dưới (T4 đảo: C1 co lại vào nút) |
| 0.9s | 12 cánh hoa bung từ tâm nút ra ngoài (`x/y` ngẫu nhiên ±40vw, `rotate` ±180, 0.8s) rồi hoà vào lớp A8 |
| 1.1s | Mở khoá cuộn, khởi động ScrollSmoother |

**Reduced-motion:** không clip-path, crossfade 0.3s; không cánh hoa bung.
**Edge case:** tên > 20 ký tự → 28px, cho xuống dòng; tâm nút tính bằng `getBoundingClientRect()` lúc bấm (không hardcode 50% 50%).

---

### C2 · Tên và ảnh bìa

**Wireframe:**
```
┌────────────────────────────┐
│┊  TRÂN TRỌNG KÍNH MỜI      │  ← tiêu đề
│┊     ╭──────────╮          │
│┊     │ images[0]│          │  ← vòm 3:4, rộng 70%
│┊     │          │          │
│┊     ╰──────────╯          │
│┊  Minh Quân                │  ← Dancing 48px, căn trái
│┊            &              │  ← primary, lệch giữa
│┊              Thu Hà       │  ← căn phải (bố cục so le)
│✿  ─── 14 · 11 · 2026 ───   │  ← Playfair italic, cần `date` ⚠️
└────────────────────────────┘
 ┊ = cành cây (gốc bắt đầu ở đáy C2)
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI", tên, ngày dạng `dd · MM · yyyy`. Chưa có `date` → ngày mẫu `14 · 11 · 2026`.
**Animation:** ảnh A3 (1.1s). Tên A2 theo `chars` stagger 0.03, dòng chú rể đến trước dòng cô dâu 0.3s. "&" `scale 0 → 1` sau cùng.
**Chuyển tiếp:** T1. Gốc cành bắt đầu vẽ khi C2 cuộn tới 50%.

---

### C3 · Nhà trai / nhà gái

**Wireframe:**
```
┌────────────────────────────┐
│┊╲✿                         │  ← nhánh 1 vươn sang phải, kết thúc bằng bông hoa
│┊  ╭──────╮   ╭──────╮      │
│┊  │img[1]│   │img[2]│      │  ← 2 vòm 3:4, cột phải lệch xuống 48px
│┊  ╰──────╯   │      │      │
│┊  NHÀ TRAI   ╰──────╯      │
│┊  Minh Quân  NHÀ GÁI       │  ← Dancing 26px
│┊  {groom.    Thu Hà        │
│┊   address}  {bride.addr}  │  ← 15px, tối đa 3 dòng, line-clamp
└────────────────────────────┘
```
**Nội dung:** `groom.name/address`, `bride.name/address`. Tên bố mẹ ⚠️ chưa có trường → không render dòng "Ông … & Bà …" cho tới khi chốt.
**Animation:** A1 so le: cột trái t=0, cột phải t=0.2s; mỗi ảnh A3.
**Mobile < 340px:** 1 cột, bỏ lệch dọc.

---

### C4 · Chuyện tình (3 mốc)

**Wireframe:**
```
┌────────────────────────────┐
│┊  CHUYỆN CỦA CHÚNG MÌNH    │
│✿── 2019 · Lần đầu gặp      │  ← bông hoa trên cành = điểm mốc
│┊   ╭────────╮              │
│┊   │ img[3] │ Một buổi     │  ← ảnh 4:5 rộng 55%, chữ bên phải
│┊   ╰────────╯ chiều mưa…   │
│✿── 2022 · Thương nhau      │
│┊          ╭────────╮       │  ← mốc 2 ảnh bên phải (zig-zag)
│┊   Rồi mỗi│ img[4] │       │
│┊          ╰────────╯       │
│✿── 2025 · Lời hứa          │
│┊   ╭────────╮              │
│┊   │ img[5] │ …            │
└────────────────────────────┘
```
**Nội dung (viết sẵn):**
1. **Lần đầu gặp** — *"Một buổi chiều mưa, hai người lạ trú chung dưới một mái hiên."*
2. **Thương nhau** — *"Rồi mỗi mùa hoa nở, đều có nhau."*
3. **Lời hứa** — *"Và hôm nay, chúng mình muốn đi cùng nhau thật lâu."*
Năm là chữ viết sẵn (không lấy từ data).
**Animation (scrub theo cành):** khi đoạn cành tới mốc, bông hoa `scale 0 → 1` + `rotate -30 → 0` (0.5s, `back.out(1.4)` — ngoại lệ nhỏ duy nhất), rồi chữ A1, ảnh A3.
**Reduced-motion:** cành hiện đầy đủ ngay, hoa và chữ fade 0.3s.

---

### C5 + C11 · Lịch và đếm ngược

**Wireframe:**
```
┌────────────────────────────┐
│┊ ┌────────────────────────┐│  ← surface, rounded-2xl
│┊ │   THÁNG MƯỜI MỘT 2026   ││
│┊ │ T2 T3 T4 T5 T6 T7 CN    ││
│┊ │        …               ││
│┊ │  9 10 11 12 13 (♥) 15   ││  ← ♥ primary quanh ngày cưới
│┊ └────────────────────────┘│
│┊ ┌────────────────────────┐│  ← blossom-soft
│┊ │  45   06   12   33      ││  ← Playfair italic 40px, A7
│┊ │ ngày  giờ  phút  giây   ││
│┊ └────────────────────────┘│
└────────────────────────────┘
```
**Nội dung:** tên tháng tiếng Việt, tuần bắt đầu Thứ Hai, đếm ngược tới `date` ⚠️ (fallback ngày mẫu 14.11.2026 18:00). Đã qua → *"Chúng mình đã về chung một nhà ♥"*.
**Animation:** các ô ngày A1 stagger 0.015; trái tim A6 vẽ quanh ô (0.8s) sau khi lưới xong; chữ số đổi A7.

---

### C6 + C7 · Sự kiện và bản đồ

**Wireframe:**
```
┌────────────────────────────┐
│┊ ┌────────────────────────┐│
│┊ │ LỄ THÀNH HÔN           ││
│┊ │ 10:00 · Thứ Bảy        ││
│┊ │ Tư gia nhà trai        ││
│┊ │ {groom.address}        ││
│┊ └────────────────────────┘│
│┊ ┌────────────────────────┐│
│┊ │ TIỆC CƯỚI              ││
│┊ │ 18:00 · Thứ Bảy        ││
│┊ │ {venue.name}           ││
│┊ │ ┌────────────────────┐ ││
│┊ │ │  <MapEmbed> 4:3    │ ││
│┊ │ └────────────────────┘ ││
│┊ │ [ Chỉ đường ]          ││  ← primary-dark, ≥44px
│┊ └────────────────────────┘│
└────────────────────────────┘
```
**Nội dung:** giờ viết sẵn, tính theo `date` ⚠️ (lễ = 10:00 cùng ngày, tiệc = giờ của `date`). "Chỉ đường" → `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`. `venue.name` rỗng → "Địa điểm tổ chức".
**Animation:** hai thẻ A1 stagger 0.15. MapEmbed chỉ mount khi section cách viewport < 1 màn hình.

---

### C8 · Album masonry

**Wireframe:**
```
┌────────────────────────────┐
│┊       KHOẢNH KHẮC         │
│┊ ┌──────┐  ┌──────┐        │
│┊ │img 3 │  │      │        │  ← 2 cột; cột phải bắt đầu thấp hơn 15%
│┊ │      │  │img 4 │        │     cột trái data-speed=0.95, phải 1.08
│┊ └──────┘  │      │        │
│┊ ┌──────┐  └──────┘        │
│┊ │img 5 │  ┌──────┐        │
│┊ …                          │
└────────────────────────────┘
```
**Nội dung:** `images[3..]` (lặp lại ảnh của C4 là chấp nhận được — album là nơi xem ảnh to). Tỉ lệ xen kẽ 4:5 và 3:4.
**Hành vi:** bấm ảnh → A10 lightbox (Flip), đóng bằng nút ✕ / Esc / chạm nền. Lightbox `z-40`.
**Animation:** A3 từng ảnh khi vào viewport. `data-speed` tắt khi reduced-motion.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│┊        MỪNG CƯỚI          │
│┊ Sự hiện diện của bạn là   │
│┊ niềm vui lớn nhất.        │
│┊  ┌───────┐   ┌───────┐    │
│┊  │  QR   │   │  QR   │    │  ← QR mẫu ⚠️ (§8.3)
│┊  │Chú rể │   │Cô dâu │    │
│┊  └───────┘   └───────┘    │
└────────────────────────────┘
```
**Hành vi:** bấm QR → A10 phóng to. QR là ảnh mẫu trong `public/templates/sakura-2d/qr-sample.svg` cho tới khi chốt §8.3.

---

### C10 · Lời cảm ơn

```
┌────────────────────────────┐
│    ✿ ✿ ╱  ← ngọn cành       │
│     ╭──────────╮           │
│     │ img[n-1] │           │  ← vòm
│     ╰──────────╯           │
│  Cảm ơn bạn đã đến và cùng │
│  chúng mình đón mùa hoa    │
│  đẹp nhất.                 │
│   Minh Quân & Thu Hà  [QH] │  ← Dancing + hanko xoay −4°
└────────────────────────────┘
```
**Animation:** ngọn cành nở 5 bông liên tiếp; hanko "đóng dấu" `scale 1.3 → 1`, `opacity 0 → 1`, 0.35s `power4.out`. Lớp A8 đạt mật độ tối đa.

---

### Lớp toàn trang: cành cây (A6) và cánh hoa (A8)

| Tiến độ cuộn | Cành | Cánh hoa đang rơi |
|---|---|---|
| 0–10% (C2) | gốc | 6 |
| 10–60% | vẽ dần, nở nhánh C3/C4/C5 | 6 → 14 |
| 60–90% | xoè ở C8 | 14 → 22 |
| 90–100% | ngọn C10 | 22 → 30 (max; mobile 20) |

- Cánh hoa: 30 `<span>` SVG cố định (`fixed inset-0 pointer-events-none z-10`), mỗi cánh `gsap.to` lặp vô hạn rơi `y: -10vh → 110vh`, lắc `x` bằng `sine.inOut`. Mật độ = đặt `autoAlpha` của cánh thứ i theo `i < activeCount`.
- Cành: 1 `<svg>` tuyệt đối trong `#smooth-content`, cao bằng toàn trang; path tạo lúc build bằng tay (desktop) và một path đơn giản hơn cho mobile.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 bìa | 3:4 |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3..5]` | C4 ba mốc + C8 album | 4:5 |
| `images[n-1]` | C10 ảnh cuối (với n=6 là `images[5]`) | 3:4 |

`meta.media = { images: 6, videos: 0 }` (tăng từ 4 → 6). `sampleData` hiện có 4 ảnh → **phải bổ sung 2 ảnh vào `public/sample/`**.

## 7. Asset cần chuẩn bị
- [ ] SVG: cành góc C1, path cành dài (desktop + mobile), bông hoa (2 kiểu), 3 kiểu cánh hoa, trái tim khoanh ngày
- [ ] `music.mp3` + `CREDITS.md`
- [ ] 6 ảnh mẫu tông sáng ≤ 300KB `.webp`
- [ ] `qr-sample.svg`
- [ ] `thumb.webp` 600×800 (thay `sakura-thumb.svg`), `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Cành cây vẽ khớp tiến độ cuộn, không giật khi cuộn nhanh (chỉ `stroke-dashoffset` qua DrawSVG)
- [ ] 30 cánh hoa + cành chạy 60fps trên điện thoại tầm trung; mobile tối đa 20 cánh
- [ ] Vòng tròn T4 mở đúng tâm nút ở cả 360px và 1440px
- [ ] Reduced-motion: không cánh hoa, cành tĩnh, vẫn đọc đủ nội dung
- [ ] Tên 50 ký tự không đè cành cây

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/sakura-2d/
├── meta.ts                    # cập nhật media.images = 6, thumbnail
├── layout.tsx                 # giữ Dancing_Script + Playfair_Display
├── page.tsx                   # return <SakuraInvite />
└── _components/
    ├── sakura-invite.tsx      # viết lại: ghép section, SmoothScroll, OpenGate
    ├── tokens.ts              # object t
    ├── branch.tsx             # cành SVG dài + ScrollTrigger A6
    ├── petals.tsx             # lớp A8, prop activeCount
    ├── open-circle.tsx        # C1 + T4
    ├── sections/
    │   ├── names.tsx          # C2
    │   ├── families.tsx       # C3
    │   ├── story.tsx          # C4
    │   ├── date-block.tsx     # C5 + C11
    │   ├── events.tsx         # C6 + C7
    │   ├── album.tsx          # C8 + lightbox
    │   ├── gift.tsx           # C14
    │   └── thanks.tsx         # C10
    └── svg/
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. `@/components`: `MapEmbed`.

### 9.2 Tokens
```ts
// tokens.ts
export const t = {
  root: "min-h-screen bg-[#FFF7F8] text-[#5B3A44] font-(family-name:--font-serif)",
  script: "font-(family-name:--font-script)",
  heading: "text-[13px] lg:text-sm tracking-[0.3em] uppercase font-medium",
  soft: "text-[#8C6B74]",
  card: "rounded-2xl bg-white shadow-[0_8px_24px_-12px_rgba(91,58,68,0.25)]",
  btn: "min-h-11 rounded-full bg-[#B4475F] px-6 text-white",
  arch: "rounded-t-full object-cover",
} as const;
```

### 9.3 Mở bằng vòng tròn (C1)
```tsx
// open-circle.tsx (rút gọn)
const onOpen = contextSafe((e: React.MouseEvent) => {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const at = `${r.left + r.width / 2}px ${r.top + r.height / 2}px`;
  music.play();
  gsap.timeline({ onComplete: onOpened })
    .to(".open-btn", { scale: 0.9, duration: 0.15 })
    .fromTo(root.current, { clipPath: `circle(150% at ${at})` },
      { clipPath: `circle(0% at ${at})`, duration: 1, ease: "power3.inOut" }, 0.1);
});
```
`clip-path` không phải transform/opacity nhưng chỉ chạy 1 lần 1s trên 1 lớp — chấp nhận (ghi chú lại trong code).

### 9.4 Cành cây và mật độ cánh hoa
```tsx
// branch.tsx
useGSAP(() => {
  if (reduced) return;
  gsap.from(".branch-path", {
    drawSVG: "0%", ease: "none",
    scrollTrigger: { trigger: "#smooth-content", start: "top top", end: "bottom bottom", scrub: 0.5,
      onUpdate: (self) => setDensity(self.progress) },
  });
}, { dependencies: [reduced] });
```
`setDensity` ghi vào ref (không `setState` mỗi frame); `petals.tsx` đọc ref trong `gsap.ticker` và bật/tắt cánh theo `densityCount(progress)`.

### 9.5 Logic cần test
- `densityCount(progress, max)` → 6..max theo bảng §5 (`sakura-2d/_components/density.test.ts`).
- `monthGrid(date)` (tuần bắt đầu Thứ Hai) — nếu `@/kit` chưa có thì viết trong mẫu và test.

### 9.6 Thứ tự làm
1. `meta.ts` (6 ảnh), thêm 2 ảnh mẫu, tokens → trang có font đúng
2. Section tĩnh C2 → C10 khớp wireframe 360/1440
3. C1 + T4 + nhạc
4. Cành cây A6 (desktop path trước, rồi mobile)
5. Lớp cánh hoa + mật độ theo cuộn
6. Animation từng section, lightbox
7. Reduced-motion, tên dài, Lighthouse, checklist template-spec §12
