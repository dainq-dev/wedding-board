# 2D-12 · `picnic-2d` · Tiệc Vườn Picnic

> **Design Read:** Đọc là thiệp cưới online cho cặp đôi trẻ yêu dã ngoại, ngôn ngữ khăn caro đỏ trắng, thẻ menu và ảnh dán ngẫu hứng, nghiêng về mỹ học folk-playful vui tươi nhưng thân mật.
>
> **Dials:** `DESIGN_VARIANCE 7/10` · `MOTION_INTENSITY 6/10` · `VISUAL_DENSITY 3/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Khách được mời ra một buổi picnic: tấm khăn caro đỏ trắng được giũ ra, và mọi thông tin đám cưới là những món đồ được "bày" lên khăn — thẻ menu, giỏ quả, dây phơi ảnh kẹp gỗ.

**Cảm xúc muốn gợi:** vui, gần gũi, nắng chiều cuối tuần. Như được bạn thân rủ đi chơi chứ không phải nhận một thiệp trang trọng.

**Phù hợp với:** cặp đôi trẻ, cưới ngoài trời / sân vườn / tiệc thân mật, ảnh cưới sáng màu, nhiều ảnh cười đùa.

**Khác các mẫu khác ở chỗ:** không có "trang" hay "thẻ xếp chồng". Toàn trang là **một tấm khăn trải dài**, người xem cuộn dọc theo khăn; các món đồ **bật lên từ khăn** (`back.out`) khi tới gần, rồi album là **dây phơi ảnh cuộn ngang** (T5) đung đưa theo quán tính. Chuyển động có độ nảy — ngược hẳn tinh thần "không nảy" của `letter-2d`.

**Moodboard:** khăn gingham đỏ trắng, giỏ mây, bánh sandwich cắt tam giác, dâu tây, chanh leo, hoa cúc dại, kẹp phơi đồ bằng gỗ, cốc limonade có ống hút sọc, nắng xuyên tán lá.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#FFFDF7` | Nền giữa các ô caro, nền trang ngoài khăn |
| `check` | `#D62828` | Ô caro đậm (opacity 0.9) và màu chủ đạo: nút, tiêu đề |
| `check-soft` | `#F2B8B8` | Ô caro giao nhau (vạch nhạt) |
| `surface` | `#FFFFFF` | Nền thẻ menu, bưu thiếp |
| `accent` | `#F4A261` | Cam đào: sticker, chấm nhấn, nắng. **Chỉ trang trí, không làm màu chữ** |
| `leaf` | `#6A994E` | Lá, cuống dâu, icon phụ |
| `wood` | `#B08157` | Kẹp gỗ, dây phơi, quai giỏ |
| `text` | `#2B2D42` | Chữ chính |
| `text-soft` | `#5C5F77` | Chữ phụ |

Tương phản: `text` trên `surface` khoảng 13.9:1 ✅. `text-soft` trên `surface` khoảng 6.2:1 ✅. Chữ trắng trên `check` khoảng 5.6:1 ✅. `check` trên `surface` (tiêu đề đỏ) khoảng 5.6:1 ✅. `accent` trên trắng chỉ khoảng 2.2:1 ❌ → không bao giờ dùng cho chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Lobster | 48px / 1.05 | 80px | Màu `check`, bóng chữ `2px 2px 0 #FFFFFF` |
| Tiêu đề thẻ | Lobster | 28px | 36px | "Thực đơn hôm ấy", "Chỗ ngồi" |
| Số lớn (ngày) | Nunito 900 | 72px | 112px | |
| Nội dung | Nunito 500 | 17px / 1.6 | 18px | |
| Nhãn nhỏ | Nunito 800, VIẾT HOA, tracking 0.12em | 12px | 13px | "MÓN CHÍNH", "ĐÓN KHÁCH" |

Hai font đều có subset `vietnamese` (danh sách đã kiểm). Kiểm dấu Lobster với *"Nguyễn Thị Hằng"* — Lobster có dấu nối chữ, dấu mũ chồng (ễ, ằ) cần `leading-[1.25]` trở lên để không bị cắt.

### Hình khối và chất liệu
- **Khăn caro**: 2 lớp `repeating-linear-gradient` (ngang + dọc, `check` alpha 0.55 trên `bg`), ô 28px mobile / 40px desktop. Viết trong 1 hằng `t.gingham`, không có ảnh.
- **Thẻ menu**: `rounded-2xl` (1rem), viền răng cưa trên-dưới bằng `mask` radial lặp, bóng cứng `shadow-[4px_6px_0_rgba(43,45,66,0.18)]`, xoay nhẹ ±1.5°.
- **Sticker**: hình tròn/khiên màu `accent` hoặc `leaf`, viền trắng 3px, chữ Nunito 800 — dán chéo ở góc thẻ ("Nhớ tới nha!").
- **Ảnh**: bưu thiếp viền trắng 10px + kẹp gỗ trên đỉnh; không khung vòm.
- **Icon**: đồ ăn vẽ tay phẳng (flat, 2 màu), 8 cái: bánh sandwich, dâu, chanh, bánh kem, ly nước, giỏ, nhẫn, ghim bản đồ.
- **Motion**: ease chủ đạo `back.out(1.7)` cho đồ vật xuất hiện; `sine.inOut` cho đung đưa; `power2.out` cho chữ. Vào 0.6s, ra 0.4s. Có nảy, nhưng **không lắc liên tục quá 1 vật cùng lúc** (tránh rối mắt).

---

## 3. Nhạc

- **Tâm trạng**: swing/ukulele vui, huýt sáo, tiếng vỗ tay nhẹ, không lời.
- **Tempo**: 110–125 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `happy whistle picnic`, `ukulele sunny acoustic`, `cheerful swing summer`
- **Hành vi**:
  - Bắt đầu khi bấm "Trải khăn thôi!" (C1). Âm lượng 0 → 0.6 trong 1.5s.
  - Nút nhạc nổi (góc trên phải) có hình **cốc limonade**: đang phát thì ống hút xoay nhẹ (A12), tắt thì đứng yên.
  - Ẩn tab thì tạm dừng, quay lại thì phát tiếp.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Khăn gấp + giỏ         │ 100svh  (cố định tới khi mở)
├───────────────────────────┤  ← từ đây nền là khăn caro liền mạch
│ C2  Tên + ảnh bưu thiếp    │ 100svh  ┐
│ C3  Hai gia đình           │  90svh  │
│ C4  Chuyện tình (3 món)    │ 130svh  │  T1: cuộn tự nhiên,
│ C5+C11 Ngày + lịch         │ 110svh  │  đồ vật bật lên từ khăn
│ C12 Thực đơn (lịch trình)  │ 110svh  │
│ C6+C7 Hai lễ + bản đồ      │ 130svh  ┘
│ C8  Dây phơi ảnh           │ ghim, cuộn ngang ≈ 250svh (T5)
│ C13 Dress code             │  70svh
│ C14+C15 Mừng cưới + RSVP   │ 130svh
│ C10 Lời cảm ơn (gói giỏ)   │ 100svh
└───────────────────────────┘
```

Nội dung nằm trong cột `min(92vw, 480px)` ở giữa. Desktop (≥1024px): khăn phủ toàn màn, hai bên có đồ trang trí lớn (giỏ, bình hoa cúc) chạy parallax A4 chậm hơn nội dung (`yPercent -20`). Đồ trang trí đặt ở mép trái giữa và mép phải giữa, **không chạm góc trên-trái / dưới-phải / trên-phải**.

---

## 5. Chi tiết từng section

### C1 · Khăn gấp và giỏ picnic (màn mở thiệp)

**Mục đích:** khoảnh khắc "trải khăn". Nút bấm là tương tác cần có để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│  (nền cỏ #EAF4DC, vài hoa) │
│                            │
│   Minh Quân & Thu Hà       │  ← Lobster 36px, check
│   rủ bạn đi picnic!        │  ← Nunito 600 18px
│                            │
│      ┌──────────────┐      │
│      │▓░▓░▓░▓░▓░▓░▓░│      │  ← khăn caro gấp vuông, đặt trên giỏ
│      └──────────────┘      │
│       ╭────────────╮       │
│       │  GIỎ MÂY   │       │  ← SVG giỏ, quai đung đưa A12
│       ╰────────────╯       │
│                            │
│   ┌────────────────────┐   │
│   │ Trải khăn thôi! 🧺 │   │  ← nút pill check, chữ trắng, 52px cao
│   └────────────────────┘   │
└────────────────────────────┘
```

**Nội dung:**
- `{groom.name} & {bride.name}` / *"rủ bạn đi picnic!"*
- Nút: **"Trải khăn thôi!"** (`aria-label="Mở thiệp mời"`)

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Giỏ rơi xuống `y: -80 → 0`, `back.out(1.7)` (0.6s) |
| 0.3s | Khăn gấp rơi lên đỉnh giỏ, nảy nhẹ (0.5s) |
| 0.6s | Tên A2 theo `chars`, `yPercent 100 → 0`, stagger 0.03 |
| 1.1s | Nút `scale 0 → 1`, `back.out(2)` (0.4s) |
| lặp | Quai giỏ lắc `rotate ±4°` (A12, 2.4s); nút "thở" `scale 1 ↔ 1.05` |

**Khi bấm (timeline mở, tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu, fade in |
| 0.0s | Nút `scale → 0.9 → 0`, tên và giỏ `y: +40, opacity 0` (0.3s) |
| 0.2s | Khăn "giũ": `scaleY 0.15 → 1.1 → 1` + `skewX 0 → 8° → -4° → 0` (0.9s, 3 keyframe), `transform-origin: top` — khăn phủ kín màn hình |
| 0.9s | Lớp cỏ C1 fade out, khăn phẳng thành nền trang |
| 1.1s | C2 bắt đầu timeline vào (không đợi cuộn) |
| 1.8s | Mở khoá cuộn, bật ScrollSmoother |

**Reduced-motion:** không giũ khăn; crossfade 0.3s từ C1 sang nền khăn.
**Trường hợp đặc biệt:** tên > 24 ký tự: xuống dòng quanh "&", cỡ 28px.

---

### C2 · Tên cặp đôi + ảnh bưu thiếp

**Mục đích:** nói ngay ai cưới, ngày nào.

**Wireframe:**
```
┌────────────────────────────┐
│  ▓░▓░▓ khăn caro ░▓░▓░▓░▓  │
│   ┌─────kẹp─────┐          │
│   │ ┌─────────┐ │   ●sticker│  ← "Save the date!" xoay 12°, accent
│   │ │ images0 │ │          │  ← bưu thiếp 4:5, xoay -2°
│   │ └─────────┘ │          │
│   └─────────────┘          │
│ ┌────────────────────────┐ │
│ │ TRÂN TRỌNG KÍNH MỜI    │ │  ← nhãn nhỏ
│ │   Minh Quân            │ │  ← Lobster 48px
│ │        &               │ │
│ │          Thu Hà        │ │  ← lệch phải, tạo nhịp chéo
│ │ Thứ Bảy · 14.11.2026   │ │  ← cần `date` ⚠️
│ └────────────────────────┘ │
│  🍓   🍋                  │  ← 2 món nhỏ trang trí
└────────────────────────────┘
```

**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · `{groom.name}` · "&" · `{bride.name}` · ngày `EEEE · dd.MM.yyyy` (⚠️ chưa có `date` → dùng ngày mẫu `2026-11-14T17:00` hằng số trong mẫu).

**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Bưu thiếp rơi `y: -60, rotate: -10 → -2`, `back.out(1.4)` (0.6s) |
| 0.4s | Kẹp gỗ "bấm" `y: -8 → 0` (0.15s) |
| 0.5s | Thẻ tên trượt lên A1 |
| 0.7s | Tên A2 `chars` |
| 1.0s | Sticker `scale 0 → 1, rotate 30 → 12`, `back.out(3)` |
| 1.2s | Dâu, chanh nảy lên từ khăn lần lượt (stagger 0.1) |

**Chuyển sang C3:** T1. Không ghim.

---

### C3 · Hai gia đình

**Wireframe:**
```
┌────────────────────────────┐
│      Hai nhà mình          │  ← Lobster 28px
│ ┌──────────┐  ┌──────────┐ │
│ │ images1  │  │ images2  │ │  ← bưu thiếp 4:5, xoay -3° / +3°
│ │          │  │          │ │     sticker "Chú rể" / "Cô dâu"
│ └──────────┘  └──────────┘ │
│  NHÀ TRAI       NHÀ GÁI    │
│  Minh Quân      Thu Hà     │  ← Lobster 22px
│  Quận 1,        Ba Đình,   │  ← address, tối đa 3 dòng
│  TP.HCM         Hà Nội     │
└────────────────────────────┘
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️ chưa có trường → không hiển thị dòng đó (thêm khi có).
**Animation:** hai ảnh "tung" từ giỏ ở giữa: bắt đầu cùng tâm, `x: ∓50%`, `rotate ∓20 → ∓3`, `back.out(1.5)` 0.6s. Sticker dán sau 0.2s.
**Mobile < 360px:** 1 cột.

---

### C4 · Chuyện tình = 3 món trên khăn

**Mục đích:** kể 3 mốc bằng 3 "món ăn", mỗi món là một đoạn chuyện.

**Wireframe:**
```
┌────────────────────────────┐
│   Chuyện của tụi mình      │
│ ┌────────┐                 │
│ │images3 │  🥪 Món khai vị │  ← zigzag: ảnh trái, chữ phải
│ └────────┘  Gặp nhau…      │
│         ┌────────┐         │
│ 🍰 Món  │images4 │         │  ← ảnh phải, chữ trái
│ chính…  └────────┘         │
│ ┌────────┐                 │
│ │images5 │  🍋 Tráng miệng │
│ └────────┘  Cầu hôn…       │
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. **Khai vị — Gặp nhau:** *"Một buổi chiều rất bình thường, hai đứa ngồi chung một bàn. Ai ngờ đó là món khai vị của cả một đời."*
2. **Món chính — Thương nhau:** *"Những chuyến đi, những bữa ăn vội, những lần giận rồi lại làm lành."*
3. **Tráng miệng — Về chung nhà:** *"Và rồi một ngày, anh hỏi, em gật đầu. Phần ngọt nhất để dành cho hôm nay."*

**Animation (mỗi món, khi `top 75%`):** icon đồ ăn nảy `scale 0 → 1.15 → 1` (0.5s) → ảnh A3 (clip từ dưới) → chữ A1. Không scrub.
**Edge case:** thiếu `images[5]` (người dùng chỉ đưa 4–5 ảnh — không xảy ra vì `media.images = 8`, nhưng nếu `images[i]` rỗng thì ẩn ảnh, giữ chữ).

---

### C5 + C11 · Ngày cưới và lịch

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← thẻ trắng, viền răng cưa
│ │  Hẹn nhau ngày         │ │
│ │     THỨ BẢY            │ │
│ │  ╭────╮                │ │
│ │  │ 14 │  THÁNG 11      │ │  ← "14" Nunito 900 72px trong đĩa đỏ
│ │  ╰────╯  2026          │ │
│ │ 45 ngày 06 giờ 12 phút │ │  ← đếm ngược, số trong ô caro nhỏ
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │  …  12 13 (🍓) 15 …    │ │  ← ngày cưới thay bằng quả dâu
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** tháng viết chữ tiếng Việt; tuần bắt đầu Thứ Hai; đếm ngược tới `date` ⚠️. Đã qua ngày cưới: *"Tụi mình cưới rồi nè! ♥"*.
**Animation:** đĩa đỏ lăn vào từ trái (`x: -120, rotate: -360 → 0`, 0.7s, `back.out(1.2)`). Số đếm A7. Quả dâu `scale 0 → 1` nảy khi lịch vào view.

---

### C12 · Thực đơn (lịch trình)

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← thẻ menu nhà hàng, viền đôi check
│ │     ~ Thực đơn ~       │ │  ← Lobster 28px
│ │   hôm ấy có gì?        │ │
│ │ ─────────────────────  │ │
│ │ KHAI VỊ ·········17:00 │ │  ← dòng chấm dẫn (leader)
│ │  Đón khách, chụp ảnh   │ │
│ │ MÓN CHÍNH ·······18:00 │ │
│ │  Làm lễ thành hôn      │ │
│ │ TIỆC NGỌT ·······18:30 │ │
│ │  Khai tiệc             │ │
│ │ ĐỒ UỐNG ·········20:00 │ │
│ │  Giao lưu, nhảy múa    │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** 4 mốc cố định, giờ tính từ `date`: −1h, 0, +30′, +2h (giống letter-2d).
**Animation:** thẻ menu "mở gập" `rotateX -90° → 0` quanh mép trên (0.6s, `back.out(1.3)`, cha có `perspective-[900px]`). Mỗi dòng A1 stagger 0.12, dòng chấm leader `scaleX 0 → 1` (origin left).

---

### C6 + C7 · Hai lễ và bản đồ

**Wireframe:**
```
┌────────────────────────────┐
│ ┌───────────┐┌───────────┐ │
│ │ LỄ VU QUY ││ TIỆC CƯỚI │ │  ← 2 vé "tấm thẻ đồ ăn", ≥360 xếp 2 cột
│ │ 08:00     ││ 18:00     │ │     <360 xếp 1 cột
│ │ Tư gia    ││{venue.name│ │
│ │ nhà gái   ││}          │ │
│ └───────────┘└───────────┘ │
│ ┌────────────────────────┐ │
│ │  <MapEmbed venue>      │ │  ← 4:3, bo 1rem, viền trắng 8px
│ │  📍 ghim quả dâu        │ │  ← SVG phủ, pointer-events-none
│ └────────────────────────┘ │
│  [ 📍 Chỉ đường tới tiệc ] │  ← pill check, 48px
└────────────────────────────┘
```
**Nội dung:** Lễ vu quy: giờ viết sẵn 08:00 + `bride.address`. Tiệc cưới: giờ từ `date` + `venue.name` (thiếu `name` → "Nhà hàng tiệc cưới"). Link `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`, `target="_blank" rel="noopener"`.
**Animation:** hai vé bật lên từ khăn (stagger 0.15, `back.out`). Bản đồ A3. Ghim dâu rơi xuống `y: -40 → 0` và nảy 2 lần (`bounce.out`, 0.8s) — đây là chỗ duy nhất dùng `bounce`.
**Lưu ý:** chỉ mount `<MapEmbed>` khi section cách viewport < 1 màn hình (IntersectionObserver `rootMargin: "100% 0px"`).

---

### C8 · Dây phơi ảnh (album cuộn ngang, T5)

**Mục đích:** điểm nhấn của mẫu. Ảnh treo trên dây phơi, cuộn dọc thì dây chạy ngang, ảnh đung đưa theo quán tính.

**Wireframe (lúc đang ghim):**
```
┌────────────────────────────┐
│   Khoảnh khắc              │  ← Lobster 28px, cố định
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~~│  ← dây phơi (SVG path hơi võng), wood
│   ▯kẹp     ▯kẹp     ▯kẹp   │
│ ┌──────┐ ┌──────┐ ┌──────┐ │  ← ảnh images[3..7] 4:5, rộng 62vw
│ │ ảnh  │ │ ảnh  │ │ ảnh  │→│     xoay ngẫu nhiên ±4° (seed cố định)
│ └──────┘ └──────┘ └──────┘ │
│  ● ● ○ ○ ○                 │  ← chấm tiến độ
│  Cuộn tiếp để xem →        │
└────────────────────────────┘
```
**Hành vi:**
- A5: ghim section, `x: -(track.scrollWidth - innerWidth)`, `scrub: 1`, `end: "+=" + trackWidth`.
- Đung đưa theo vận tốc: đọc `self.getVelocity()` trong `onUpdate`, đặt `rotate` mỗi ảnh bằng `gsap.quickTo(el, "rotation", { duration: 0.8, ease: "elastic.out(1, 0.4)" })` về `base ± clamp(v / 300, -8, 8)`. Khi dừng cuộn thì tự lắc về vị trí nghỉ.
- Bấm ảnh → A10 lightbox (Flip), nền tối `bg-[#2B2D42]/85`, nút đóng 44px ở **trên-giữa** (không ở góc trên-phải vì đó là nút nhạc).
- Bàn phím: ảnh là `<button>`; Tab lần lượt, Enter mở lightbox, Esc đóng.

**Reduced-motion:** không ghim; hiển thị lưới 2 cột, không đung đưa.
**Edge case:** số ảnh album = `images.length - 3` (tối thiểu 5 với media 8). Ảnh dọc/ngang lẫn lộn → `object-cover` trong khung 4:5 cố định.

---

### C13 · Dress code

```
┌────────────────────────────┐
│   Mặc gì đi picnic?        │
│  Tươi sáng, thoải mái,     │
│  giày đi được trên cỏ nhé! │
│   (●)   (●)   (●)   (●)    │  ← 4 "quả" tròn màu
│   Đỏ   Trắng  Đào   Lá     │  ← #D62828 #FFFFFF #F4A261 #6A994E
└────────────────────────────┘
```
**Animation:** các chấm lăn vào từ phải `x: 200, rotate: 360 → 0` stagger 0.08, `back.out(1.5)`. Chấm trắng có viền `text-soft` 1px để thấy trên nền.

---

### C14 + C15 · Mừng cưới + RSVP ("phiếu gọi món")

```
┌────────────────────────────┐
│ ┌──────────┐ ┌──────────┐  │
│ │  QR ⚠️    │ │  QR ⚠️    │  │  ← 2 hũ mứt dán nhãn "Nhà trai"/"Nhà gái"
│ │ Nhà trai │ │ Nhà gái  │  │     QR nằm trong nhãn hũ
│ └──────────┘ └──────────┘  │
│ ┌────────────────────────┐ │  ← phiếu order giấy kẻ dòng
│ │ PHIẾU GỌI MÓN          │ │
│ │ Tên: [____________]    │ │
│ │ ( ) Có mặt đúng giờ!   │ │
│ │ ( ) Tiếc quá, bận mất  │ │
│ │ Số người: [ - 1 + ]    │ │  ← stepper, nút 44px
│ │ [ Gửi order ]          │ │
│ │ Bản xem thử — xác nhận │ │
│ │ không được gửi đi.     │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** *"Sự có mặt của bạn là món quà ngon nhất."* QR mẫu ⚠️ (chờ chốt §8.3 todo-list) — hiện ảnh QR placeholder có chữ "QR mẫu".
**Hành vi:** bấm QR → A10 phóng to. Gửi: validate tên không rỗng (`required`), phiếu bị "xé" (`clip-path` inset từ trên xuống 0.5s) và hiện *"Đã nhận order của {tên}! Hẹn gặp nhé 🧺"*. **Không gửi dữ liệu đi đâu.** Stepper giới hạn 1–10.

---

### C10 · Lời cảm ơn (gói giỏ)

```
┌────────────────────────────┐
│   ┌───────────────────┐    │
│   │  images[n-1] 4:5  │    │  ← bưu thiếp cuối
│   └───────────────────┘    │
│  Cảm ơn bạn đã tới         │  ← Lobster 32px
│  buổi picnic của tụi mình! │
│   Minh Quân & Thu Hà       │
│       ╭──────────╮         │
│       │ GIỎ MÂY  │         │  ← giỏ C1 quay lại
│       ╰──────────╯         │
└────────────────────────────┘
```
**Animation (scrub, `top 60%` → `bottom bottom`):** các món trang trí trên khăn quanh section bay vào giỏ (`x,y` về tâm giỏ, `scale → 0.3`, `rotate` ngẫu nhiên), khăn caro ở đáy trang gấp lại `scaleY 1 → 0.2` (origin bottom). Đảo ngược cảnh mở C1. Kết thúc: nắp giỏ đậy `rotate -30 → 0`.
**Reduced-motion:** chỉ fade ảnh và chữ.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 bưu thiếp bìa | 4:5 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..5]` | C4 chuyện tình (3 món) — đồng thời 3 ảnh đầu của C8 | 4:5 |
| `images[3..7]` | C8 dây phơi (5 ảnh) | 4:5 |
| `images[7]` (= `images[n-1]`) | C10 ảnh cuối | 4:5 |

`meta.media = { images: 8, videos: 0 }` (tăng từ 6 ở bản tóm tắt để dây phơi đủ dài; C4 và C8 dùng chung `images[3..5]` là chấp nhận được vì C8 là "album tổng").

Dữ liệu khác: `groom.name`, `bride.name`, `groom.address`, `bride.address`, `venue.{lat,lng,name}`. `date` ⚠️, tên bố mẹ ⚠️, QR ⚠️ → fallback như trên. Không dùng `birthYear`.

## 7. Asset cần chuẩn bị
- [ ] SVG: giỏ mây (thân + nắp + quai tách riêng), khăn gấp, kẹp gỗ, dây phơi (path), 8 icon đồ ăn phẳng, 3 hoa cúc dại, cốc limonade (nút nhạc)
- [ ] `music.mp3` (Pixabay, từ khoá §3) + ghi `CREDITS.md`
- [ ] 8 ảnh mẫu sáng, ngoài trời (Unsplash) ≤ 300KB `.webp`
- [ ] QR placeholder `qr-sample.webp`
- [ ] `thumb.webp` 600×800: khăn caro, giỏ, dây phơi 2 ảnh
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Bấm "Trải khăn thôi!" → nhạc phát ngay, cuộn được sau ≤ 2 giây
- [ ] Khăn caro là gradient CSS thuần Tailwind, không có ảnh nền, không cuộn ngang ở 360px
- [ ] Dây phơi: ảnh đung đưa theo tốc độ cuộn và tự đứng yên < 1.5s sau khi dừng; 60fps trên điện thoại tầm trung
- [ ] Tắt reduced-motion: không ghim, album thành lưới, không có vật nảy
- [ ] Tên 50 ký tự có dấu (Lobster) không bị cắt dấu và không vỡ thẻ C2
- [ ] Nút đóng lightbox và mọi nút không nằm ở 3 góc dành riêng

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/picnic-2d/
├── meta.ts                    # styles ["playful"], colors ["red","white"], media {8,0}
├── layout.tsx                 # Lobster + Nunito (vietnamese)
├── page.tsx                   # return <PicnicInvite />
└── _components/
    ├── picnic-invite.tsx      # "use client" — tokens t, nền khăn, ghép section, SmoothScroll
    ├── basket-gate.tsx        # C1: giỏ + khăn gấp + timeline giũ khăn
    ├── pop-in.tsx             # wrapper: con bật lên back.out khi vào view (dùng ở mọi section)
    ├── sections/
    │   ├── hero.tsx           # C2
    │   ├── families.tsx       # C3
    │   ├── story-menu.tsx     # C4
    │   ├── date.tsx           # C5 + C11
    │   ├── menu-schedule.tsx  # C12
    │   ├── events.tsx         # C6 + C7
    │   ├── clothesline.tsx    # C8 (A5 + đung đưa)
    │   ├── dress.tsx          # C13
    │   ├── gift-rsvp.tsx      # C14 + C15
    │   └── thanks.tsx         # C10
    ├── schedule.ts            # tính 4 mốc giờ từ date
    ├── schedule.test.ts
    └── svg/                   # basket, cloth, peg, foods, daisy, lemonade
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. `@/components`: `MapEmbed`. Dữ liệu: `useWedding()`.

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#FFFDF7] text-[#2B2D42] font-(family-name:--font-body)",
  gingham:
    "bg-[repeating-linear-gradient(0deg,rgba(214,40,40,.55)_0_28px,transparent_28px_56px),repeating-linear-gradient(90deg,rgba(214,40,40,.55)_0_28px,transparent_28px_56px)]", // desktop: thêm bản lg:bg-[…] với 40px/80px
  card: "bg-white rounded-2xl shadow-[4px_6px_0_rgba(43,45,66,0.18)]",
  display: "font-(family-name:--font-display) text-[#D62828] leading-[1.25]",
  label: "text-xs font-extrabold uppercase tracking-[0.12em]",
  btn: "min-h-12 rounded-full bg-[#D62828] px-6 font-extrabold text-white active:scale-95 transition-transform",
  soft: "text-[#5C5F77]",
} as const;
```

### 9.3 Giũ khăn (C1)
```tsx
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true })
    .to([".c1-name", ".c1-basket", ".c1-btn"], { y: 40, opacity: 0, duration: 0.3, ease: "power2.in" }, 0)
    .fromTo(".c1-cloth",
      { scaleY: 0.15, skewX: 0 },
      { keyframes: [{ scaleY: 1.1, skewX: 8 }, { scaleY: 0.96, skewX: -4 }, { scaleY: 1, skewX: 0 }],
        duration: 0.9, ease: "power2.out", transformOrigin: "50% 0%" }, 0.2)
    .to(".c1-grass", { opacity: 0, duration: 0.3 }, 0.9)
    .call(onOpened, [], 1.1);
}, { scope: root });

<button aria-label="Mở thiệp mời" onClick={() => { music.play(); reduced ? onOpened() : tl.current?.play(); }} …>
```

### 9.4 Pop-in dùng chung
```tsx
// pop-in.tsx — mỗi con trực tiếp bật lên khi container vào view
useGSAP(() => {
  if (reduced) return;
  gsap.from(root.current!.children, {
    scale: 0, rotate: () => gsap.utils.random(-15, 15), opacity: 0,
    duration: 0.6, ease: "back.out(1.7)", stagger: 0.1,
    scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
  });
}, { scope: root, dependencies: [reduced] });
```

### 9.5 Dây phơi (C8)
```tsx
useGSAP(() => {
  if (reduced) return;
  const track = trackRef.current!;
  const pics = gsap.utils.toArray<HTMLElement>(".pic");
  const base = pics.map((_, i) => [-4, 3, -2, 4, -3][i % 5]);
  const rot = pics.map((p) => gsap.quickTo(p, "rotation", { duration: 0.8, ease: "elastic.out(1,0.4)" }));
  gsap.to(track, {
    x: () => -(track.scrollWidth - innerWidth), ease: "none",
    scrollTrigger: {
      trigger: sectionRef.current, pin: true, scrub: 1, invalidateOnRefresh: true,
      end: () => "+=" + (track.scrollWidth - innerWidth),
      onUpdate: (self) => {
        const v = gsap.utils.clamp(-8, 8, self.getVelocity() / 300);
        rot.forEach((to, i) => to(base[i] - v));
      },
      onScrubComplete: () => rot.forEach((to, i) => to(base[i])),
    },
  });
}, { scope: sectionRef, dependencies: [reduced, images.length] });
```
Ảnh xoay quanh kẹp: `origin-top` trên `.pic`.

### 9.6 Logic cần test
- `schedule.ts`: `scheduleFrom(date)` trả 4 mốc −60/0/+30/+120 phút, định dạng `HH:mm`; test cả mốc qua nửa đêm.
- Lưới lịch C11: ngày 1 rơi vào Chủ Nhật thì có 6 ô trống đầu (tuần bắt đầu Thứ Hai) — viết chung helper `monthGrid(year, month)` trong `date.tsx` hoặc tách file nếu cần test (NÊN tách: `month-grid.ts` + test).

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t`, nền khăn caro → kiểm 360px không cuộn ngang
2. Các section tĩnh C2 → C10 khớp wireframe 360/1440
3. `basket-gate.tsx` + nhạc
4. `pop-in.tsx`, gắn vào các section
5. `clothesline.tsx` (A5 + đung đưa + lightbox)
6. C12 gập menu, C10 gói giỏ
7. Reduced-motion, tên dài, Lighthouse
8. Checklist template-spec §12
