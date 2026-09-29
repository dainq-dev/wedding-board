# 2D-11 · `tropical-2d` · Biển Nhiệt Đới

> **Design Read:** Đọc là thiệp cưới bên biển cho cặp đôi trẻ yêu xê dịch, ngôn ngữ hoàng hôn cam, biển xanh ngọc và bưu thiếp, nghiêng về mỹ học tropical-playful rộng mở, nhiều khoảng thở.
>
> **Dials:** `DESIGN_VARIANCE 8/10` · `MOTION_INTENSITY 6/10` · `VISUAL_DENSITY 2/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một buổi hoàng hôn trên biển: sóng tràn lên cuốn khách vào thiệp, mỗi phần nội dung là một "hòn đảo" trắng nổi giữa những dải sóng, và album là xấp bưu thiếp du lịch trải ngang.

**Cảm xúc muốn gợi:** vui vẻ, thư thái, mặn mòi, "đi nghỉ mát". Nhẹ nhàng nhưng tươi, không trang trọng.

**Phù hợp với:** cưới ở biển (Phú Quốc, Nha Trang, Đà Nẵng, Hội An), tiệc cưới ngoài trời, cặp đôi mê du lịch; ảnh tông sáng, nhiều nắng và nước.

**Khác các mẫu khác ở chỗ:**
- Màn mở **T4 sóng tràn**: một con sóng SVG dâng từ đáy lên phủ kín màn hình rồi rút xuống để lộ thiệp (mặt nạ là path sóng, không phải hình tròn/chữ nhật).
- **Dải sóng giữa mọi section**: mỗi ranh giới là một đường sóng SVG chạy ngang liên tục (A9), màu nền section đổi theo "độ sâu" (cát → nước nông → nước sâu → hoàng hôn), như đi từ bờ ra khơi và quay về.
- Card trắng bo `1.5rem` kiểu **hòn đảo** có lá cọ nhô ở góc, đung đưa (A12).
- **C8 bưu thiếp cuộn ngang** (T5): mỗi ảnh là một bưu thiếp có tem, dấu bưu điện và dòng chú thích tay; có tới 5 bưu thiếp (mẫu 8 ảnh — nhiều nhất trong nhóm 2D này).

**Moodboard:** hoàng hôn cam hồng, lá cọ/lá chuối, sóng vẽ nét tròn trĩnh, bưu thiếp retro, tem thư có răng cưa, cát, vỏ sò, ly nước dừa, ván lướt sóng.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `sand` | `#FFF5E9` | Nền "bờ cát" (đầu trang, C10) |
| `surface` | `#FFFFFF` | Card đảo, bưu thiếp |
| `coral` | `#FF7F50` | Mặt trời, sóng hoàng hôn, trang trí (không cho chữ) |
| `coral-deep` | `#C4502A` | Nút, chữ nhấn, tiêu đề |
| `teal` | `#2BB3A3` | Sóng nước nông, lá cọ, trang trí |
| `teal-deep` | `#1F7F74` | Nền "nước sâu" (có chữ trắng), link |
| `sunset` | `#FFC48C` | Dải trời hoàng hôn, gradient C1 |
| `foam` | `#E6F6F3` | Nền "nước nông" |
| `text` | `#1E3A4C` | Chữ chính |
| `text-soft` | `#557083` | Chữ phụ |

Tương phản: `text` trên `sand` ≈ 11.5:1 ✅. `text-soft` trên `surface` ≈ 5.1:1 ✅. Chữ trắng trên `coral-deep` ≈ 5.0:1 ✅, trên `teal-deep` ≈ 4.9:1 ✅. `coral` (≈ 2.5:1) và `teal` (≈ 2.6:1) trên trắng **không** dùng cho chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Pacifico | 40px / 1.25 | 72px | Pacifico có nét cao; line-height rộng để dấu không đụng dòng trên |
| Tiêu đề section | Pacifico | 28px | 40px | *"Hẹn nhau ở biển"* |
| Nhãn | Quicksand 700, VIẾT HOA, tracking 0.18em | 12px | 13px | "TIỆC CƯỚI" |
| Số lớn | Quicksand 700 | 96px | 150px | Tròn trĩnh, hợp sóng |
| Nội dung | Quicksand 500 | 16px / 1.6 | 18px | Quicksand 400 hơi mảnh trên màn hình nhỏ → dùng 500 |
| Chú thích bưu thiếp | Patrick Hand | 18px | 20px | Chữ viết tay trên bưu thiếp |

Pacifico, Quicksand, Patrick Hand đều có subset `vietnamese`.

### Hình khối và chất liệu
- **Card đảo**: `rounded-3xl` (1.5rem), nền trắng, bóng mềm màu nước `shadow-[0_18px_40px_-18px_rgba(31,127,116,0.45)]`.
- **Sóng**: SVG path lặp tuần hoàn (chu kỳ = 1/2 chiều rộng SVG) để trượt vô hạn. 2 lớp sóng lệch pha, lớp sau opacity 0.5.
- **Lá cọ**: SVG fill `teal`, gốc đặt ngoài mép card, `transform-origin` ở cuống.
- **Bưu thiếp**: viền trắng 10px, tem răng cưa (mask radial lặp bằng arbitrary value), dấu bưu điện tròn nét `coral-deep` opacity 0.6.
- **Icon**: nét tròn 2px, bo đầu, `teal-deep` (ly dừa, nhẫn, đĩa, ván lướt, pháo hoa).
- **Motion**: ease `sine.inOut` (sóng, lá), `back.out(1.4)` **chỉ** cho tem dán và nút (vui, nảy nhẹ — mẫu này là `playful`). Vào 0.8s.

---

## 3. Nhạc

- **Tâm trạng**: bossa nova, guitar nylon, bộ gõ nhẹ, không lời; ấm và thư thả như quán bar trên biển lúc hoàng hôn.
- **Tempo**: 95–110 BPM. **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `bossa nova beach`, `summer bossa guitar`, `tropical lounge acoustic`
- **Hành vi**:
  - Bắt đầu khi bấm "Ra biển thôi" ở C1. Âm lượng 0 → 0.6 trong 1.5 giây. Chỉ 1 file nhạc, không thêm hiệu ứng âm thanh sóng.
  - C16 là "radio bãi biển" nhỏ trong trang, đồng bộ nút nổi.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
nền           ┌───────────────────────────┐
sunset→coral  │ C1  Hoàng hôn + sóng       │ 100svh (cố định; T4 sóng tràn)
              ├───────────────────────────┤
sand          │ C2+C16 Tên + radio         │ 110svh
  ~~~~ sóng ~~~~
foam          │ C3  Hai người              │ 100svh
foam          │ C4  Ba đảo nhỏ             │ 180svh
  ~~~~ sóng ~~~~
teal-deep     │ C5+C11 Ngày cưới           │ 110svh   ← chữ trắng / card trắng
teal-deep     │ C12 Lịch trình             │ 110svh
  ~~~~ sóng ~~~~
foam          │ C6+C7 Tiệc + bản đồ        │ 130svh
foam          │ C13 Dress code             │  70svh
  ~~~~ sóng ~~~~
sunset→sand   │ C8  Bưu thiếp cuộn ngang   │ pin ~350svh (T5 / A5)
  ~~~~ sóng ~~~~
sand          │ C14+C15 Mừng cưới / RSVP   │ 130svh
sand          │ C10 Cảm ơn + dấu chân      │ 100svh
              └───────────────────────────┘
```
Cột nội dung `min(90vw, 460px)` căn giữa. Dải sóng: SVG cao 48px mobile / 80px desktop, `w-[200%]`, nằm tuyệt đối ở mép trên section có nền mới, fill = màu section sau.

---

## 5. Chi tiết từng section

### C1 · Hoàng hôn (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│   (nền gradient sunset →   │
│    coral từ trên xuống)    │
│  🌴                    🌴  │  ← 2 lá cọ góc trái-dưới/phải-giữa
│           ◐                │  ← mặt trời coral, nửa chìm
│  ~~~~~~~~~~~~~~~~~~~~~~~~  │  ← sóng lớp sau (teal 50%)
│  ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈  │  ← sóng lớp trước (teal)
│     Minh Quân              │  ← Pacifico 36px, text trên nền foam
│        & Thu Hà            │
│   14 · 11 · 2026           │  ← `date` ⚠️
│   ╭──────────────────╮     │
│   │ Ra biển thôi! 🌊  │     │  ← nút coral-deep, 52px, rounded-full
│   ╰──────────────────╯     │
└────────────────────────────┘
```
**Nội dung:** tên, ngày, nút *"Ra biển thôi!"* (`aria-label="Mở thiệp mời và phát nhạc"`). Tên và nút nằm trên vùng nước `foam` phía dưới đường sóng để đủ tương phản.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Mặt trời `yPercent 60 → 0` (1.4s, `sine.out`) |
| 0.0s | Hai lớp sóng bắt đầu trượt ngang vô hạn (A9: `xPercent 0 → -50`, 6s / 9s, `ease: none`, `repeat: -1`) |
| 0.4s | Lá cọ `rotate -20° → 0` từ cuống (1.0s) rồi A12 đung đưa `±3°` |
| 0.8s | Tên A2 theo ký tự |
| 1.2s | Ngày + nút A1; nút nảy nhẹ `back.out(1.4)` |

**Khi bấm (T4 sóng tràn, tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Nút + tên fade (0.3s) |
| 0.1s | Lớp "sóng tràn" (div nền `teal` có mép trên là path sóng, SVG mask) `yPercent 100 → 0` (0.8s, `sine.inOut`); trong lúc dâng, mép sóng trượt ngang |
| 0.9s | C1 ẩn phía sau; C2 sẵn sàng |
| 0.9s | Sóng rút: `yPercent 0 → -100` (0.8s) — mép dưới cũng là path sóng (lật dọc) |
| 1.7s | Mở khoá cuộn; ScrollSmoother bắt đầu |

**Reduced-motion:** sóng đứng yên (không A9), lá không đung đưa; bấm → crossfade 0.3s.
**Edge case:** tên > 18 ký tự → 28px; Pacifico không có chữ đậm nên không bôi đậm tên.

---

### C2 + C16 · Tên và radio bãi biển

```
┌────────────────────────────┐
│ ╭────────────────────────╮ │
│ │🌿  ╭──────────────╮    │ │  ← card đảo, lá cọ góc trên trái
│ │    │ images[0] 4:5 │    │ │     ảnh bìa bo rounded-2xl
│ │    ╰──────────────╯    │ │
│ │ CHÚNG MÌNH CƯỚI NHAU!  │ │
│ │   Minh Quân            │ │  ← Pacifico 40px
│ │      & Thu Hà          │ │
│ │ Thứ Bảy · 14.11.2026   │ │
│ ╰────────────────────────╯ │
│  ╭────────────────────╮    │
│  │ 📻 ▶  Bossa của     │    │  ← radio: nút ▶/❚❚, sóng âm 5 vạch
│  │     tụi mình ▮▮▮▮▮ │    │
│  ╰────────────────────╯    │
└────────────────────────────┘
```
**Nội dung:** *"CHÚNG MÌNH CƯỚI NHAU!"*, tên, ngày; radio *"Bossa của tụi mình"*.
**Animation:** ảnh A3; tên A2; card đảo "nổi" lên từ nước `y: 60 → 0` + `rotate 2° → 0`. 5 vạch sóng âm `scaleY` ngẫu nhiên khi nhạc phát (tween lặp, dừng khi pause/reduced-motion).
**Chuyển sang C3:** dải sóng, nền `sand → foam`.

---

### C3 · Hai người

```
┌────────────────────────────┐
│ ╭──────────╮ ╭──────────╮  │
│ │  [1]     │ │  [2]     │  │  ← ảnh bo 2xl, xoay -2°/+2°
│ │ chú rể   │ │ cô dâu   │  │     mỗi ảnh có vỏ sò SVG ở góc
│ ╰──────────╯ ╰──────────╯  │
│  NHÀ TRAI     NHÀ GÁI      │
│  Minh Quân    Thu Hà       │  ← Pacifico 24px
│  {address}    {address}    │  ← line-clamp-3
└────────────────────────────┘
```
**Nội dung:** tên bố mẹ ⚠️ → dòng *"Con ông … & bà …"* nếu có.
**Animation:** hai ảnh "trôi vào" từ hai bên như phao: `x: ∓60 → 0`, `y` dao động nhỏ (A12 `y ±4`, 3s) sau khi vào.
**Mobile < 360px:** 1 cột.

---

### C4 · Ba đảo nhỏ (chuyện tình)

```
┌────────────────────────────┐
│ ╭───────────╮              │
│ │ 🏝 ĐẢO 1   │  ~ ~ ~       │  ← card đảo trái, images[3]
│ │ Lần đầu   │              │
│ ╰───────────╯              │
│       ⋯ đường chấm nét ⋯    │  ← "hành trình" nối đảo, A6
│              ╭───────────╮ │
│              │ 🏝 ĐẢO 2   │ │  ← images[4]
│              ╰───────────╯ │
│       ⋯                    │
│ ╭───────────╮              │
│ │ 🏝 ĐẢO 3   │              │  ← images[5]
│ ╰───────────╯              │
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. *Đảo thứ nhất · Lần đầu* — "Một chuyến đi biển cùng nhóm bạn. Anh đưa em ly nước dừa, và thế là bắt đầu."
2. *Đảo thứ hai · Cùng nhau* — "Những chuyến đi dài, những bãi biển mới, những buổi hoàng hôn ngồi đếm sóng."
3. *Đảo thứ ba · Cầu hôn* — "Trên bãi cát lúc mặt trời lặn, anh quỳ xuống. Sóng làm chứng, em gật đầu."

**Animation:** đường chấm nét (SVG `stroke-dasharray`) vẽ A6 theo scrub; một chiếc thuyền giấy nhỏ chạy trên đường (MotionPath `align` theo path, scrub). Mỗi đảo A1 + ảnh A3 khi thuyền tới gần.
**Reduced-motion:** đường vẽ sẵn, thuyền đứng ở đảo 3.

---

### C5 + C11 · Ngày cưới (nền teal-deep)

```
┌────────────────────────────┐
│  (nền teal-deep, chữ trắng)│
│   Hẹn nhau ở biển          │  ← Pacifico 28px
│      THÁNG MƯỜI MỘT        │
│          14                │  ← Quicksand 700 96px
│      Thứ Bảy · 2026        │
│ ╭────────────────────────╮ │  ← card trắng
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │  9 10 11 12 13 (🐚) 15 │ │  ← ngày cưới trong vỏ sò coral
│ ╰────────────────────────╯ │
│  45 ngày · 06 giờ · 12 phút│  ← A7, chữ trắng
└────────────────────────────┘
```
**Fallback:** `date` ⚠️ ngày mẫu; qua ngày cưới → *"Tụi mình đã cưới rồi! 🌊"*.
**Animation:** "14" đếm lên; vỏ sò `scale 0 → 1` + `rotate -20° → 0` (`back.out(1.4)`); bong bóng nhỏ (6 hạt, A8 nhẹ) nổi lên nền teal, tắt khi reduced-motion.

---

### C12 · Lịch trình (nền teal-deep)

```
┌────────────────────────────┐
│ ╭────────────────────────╮ │
│ │ (🥥) 16:30 Đón khách   │ │  ← giờ từ `date` ⚠️ (−1h30)
│ │ (💍) 17:30 Lễ trên cát │ │     (tiệc biển thường sớm hơn: lễ lúc hoàng hôn)
│ │ (🍽) 18:30 Khai tiệc   │ │
│ │ (🏄) 20:00 Tiệc bãi    │ │
│ │           biển         │ │
│ ╰────────────────────────╯ │
└────────────────────────────┘
```
**Nội dung viết sẵn:** 4 mốc tính từ giờ tiệc trong `date`: đón khách −2h, lễ −1h, khai tiệc 0, tiệc bãi biển +1h30. Fallback giờ tiệc 18:30.
**Animation:** mỗi dòng trượt vào từ trái như sóng (`x: -30 → 0`, stagger 0.12); icon trong vòng tròn nảy nhẹ.
**Logic cần test:** `beachSchedule(date)`.

---

### C6 + C7 · Tiệc và bản đồ

```
┌────────────────────────────┐
│ ╭────────────────────────╮ │
│ │ LỄ VU QUY · 08:00      │ │
│ │ Tư gia nhà gái         │ │
│ │ {bride.address}        │ │
│ ╰────────────────────────╯ │
│ ╭────────────────────────╮ │
│ │🌴 TIỆC CƯỚI · 18:30    │ │
│ │ {venue.name}           │ │
│ │ ╭────────────────────╮ │ │
│ │ │  <MapEmbed> 4:3    │ │ │  ← rounded-2xl qua wrapper
│ │ ╰────────────────────╯ │ │
│ │ [ Chỉ đường 🧭 ]        │ │  ← nút teal-deep
│ ╰────────────────────────╯ │
└────────────────────────────┘
```
**Edge case:** `venue.name` rỗng → *"Tiệc cưới bên biển"*. Map mount lười.

---

### C13 · Dress code

```
┌────────────────────────────┐
│   Dress code: đi biển!     │
│  Váy hoa, sơ mi linen, dép │
│  quai hậu cũng được nha    │
│  (●)  (●)  (●)  (●)        │  ← 4 phao tròn
│ Trắng Cam   Xanh  Be       │     #FFFFFF #FF7F50 #2BB3A3 #F3E1C7
│       san hô ngọc          │
└────────────────────────────┘
```
**Animation:** các phao rơi xuống "mặt nước" `y: -40 → 0` (`back.out(1.4)`), stagger 0.08, sau đó nhấp nhô A12.

---

### C8 · Bưu thiếp cuộn ngang

**Wireframe (section ghim):**
```
┌────────────────────────────┐
│  Gửi từ biển 💌  3/5       │
│ ┌────────────┐ ┌────────── │
│ │┌──────────┐│ │┌───────── │  ← bưu thiếp 4:3 ngang (mobile 80vw)
│ ││ images[6]││ ││ images[7]│
│ │└──────────┘│ │└───────── │
│ │ "Chiều ở   │ │ "…"       │  ← Patrick Hand, chú thích viết sẵn
│ │  Mũi Né" ✉ │ │     ✉     │  ← tem góc trên phải, dấu bưu điện
│ └────────────┘ └────────── │
│  ≈≈≈≈≈≈≈ sóng ≈≈≈≈≈≈≈      │
└────────────────────────────┘
```
**Nội dung:** 5 bưu thiếp: `images[0], [3], [4], [6], [7]`; chú thích viết sẵn: *"Nắng ơi là nắng!"*, *"Chiều ở biển"*, *"Hai đứa mình"*, *"Ước gì ngày nào cũng thế này"*, *"Hẹn bạn ở đám cưới nha!"*. Mỗi bưu thiếp xoay ngẫu nhiên cố định (−3°…3°, lấy theo index, không `Math.random` để SSR khớp).
**Animation:** T5 ghim, `x: -(scrollWidth - innerWidth)` scrub 1 (A5). Tem "dán" vào khi bưu thiếp vào giữa màn hình (`scale 1.4 → 1`, `rotate 15° → 0`, `back.out(1.4)`, `containerAnimation`). Sóng dưới chạy A9.
**Hành vi:** bấm bưu thiếp → A10 lật (`rotateY 180`) hiện mặt sau ghi *"Thương gửi, {groom.name} & {bride.name}"*. Bấm lại lật về.
**Reduced-motion:** không ghim; `overflow-x-auto snap-x snap-mandatory`, vuốt tay; không lật (hiện mặt trước).

---

### C14 + C15 · Mừng cưới và xác nhận

```
┌────────────────────────────┐
│ ╭────────────────────────╮ │
│ │ 🎁 Mừng cưới           │ │
│ │ ┌─────┐   ┌─────┐      │ │  ← QR mẫu ⚠️
│ │ │ QR  │   │ QR  │      │ │
│ │ └─────┘   └─────┘      │ │
│ ╰────────────────────────╯ │
│ ╭────────────────────────╮ │
│ │ Bạn có ra biển cùng    │ │
│ │ tụi mình không?        │ │
│ │ [ Tên              ]   │ │
│ │ [ Có chứ! ] [ Tiếc quá]│ │  ← 2 nút toggle lớn
│ │ Số người  [-] 2 [+]    │ │
│ │ [ Gửi 🌊 ]             │ │
│ │ Bản xem thử — không    │ │
│ │ gửi đi                 │ │
│ ╰────────────────────────╯ │
└────────────────────────────┘
```
**Hành vi:** QR → A10. Gửi → form thu lại, sóng nhỏ quét qua card (T4 thu nhỏ), hiện *"Cảm ơn {tên}! Gặp nhau ở biển nhé 🌴"*. Không gửi đi đâu.

---

### C10 · Cảm ơn (bờ cát)

```
┌────────────────────────────┐
│   ╭──────────────╮         │
│   │ images[5]    │         │  ← ảnh cuối, bo 2xl
│   ╰──────────────╯         │
│  Cảm ơn bạn đã đến chung   │
│  vui cùng tụi mình!        │
│    Minh Quân & Thu Hà      │  ← Pacifico 32px
│   👣 👣 👣                 │  ← dấu chân trên cát
│ ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈   │  ← sóng vỗ vào bờ cuối trang
└────────────────────────────┘
```
**Animation:** dấu chân xuất hiện lần lượt (stagger 0.25) như ai đó đi dọc bờ; khi cuộn tới đáy, sóng cuối trang dâng `yPercent` 20% rồi rút, xoá bớt dấu chân (opacity), lặp mỗi 6s khi section trong viewport. Reduced-motion: dấu chân hiện sẵn, không sóng.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa + C8 bưu thiếp 1 | 4:5 / 4:3 |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3]` | C4 đảo 1 + C8 | 4:3 |
| `images[4]` | C4 đảo 2 + C8 | 4:3 |
| `images[5]` | C4 đảo 3 + C10 | 4:3 |
| `images[6]` | C8 bưu thiếp 4 | 4:3 |
| `images[7]` | C8 bưu thiếp 5 | 4:3 |

`meta.media = { images: 8, videos: 0 }`. `styles = ["playful"]`, `colors = ["blue", "green"]`.
`sampleData` hiện cần ≥ 8 ảnh; nếu `public/sample/` chưa đủ thì bổ sung (template-spec §2.2).

## 7. Asset cần chuẩn bị
- [ ] SVG: sóng tuần hoàn (2 biến thể), mặt nạ sóng tràn, mặt trời, lá cọ (3 kiểu), vỏ sò, thuyền giấy, tem, dấu bưu điện, dấu chân, radio, 5 icon lịch trình, phao
- [ ] Path hành trình C4 (mobile + desktop)
- [ ] `music.mp3` bossa nova + `CREDITS.md`
- [ ] 8 ảnh mẫu biển/hoàng hôn (Unsplash) ≤ 300KB `.webp`; bổ sung vào `public/sample/` nếu thiếu
- [ ] `thumb.webp` 600×800: hoàng hôn + sóng + lá cọ
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Sóng A9 liền mạch, không thấy "khớp nối" khi lặp, ở 360 và 1440px
- [ ] Sóng tràn C1: không lộ mép thẳng nào; ≤ 2 giây tới lúc cuộn được, nhạc phát ngay khi bấm
- [ ] Mọi dải sóng dừng animate khi ra khỏi viewport (ScrollTrigger `toggleActions` hoặc `onToggle` pause/play)
- [ ] Bưu thiếp C8 lật được bằng chạm và bằng Enter/Space (là `<button>`)
- [ ] Không dùng `coral`/`teal` cho chữ (axe pass)
- [ ] Lá cọ góc không đè 3 nút chung

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/tropical-2d/
├── meta.ts
├── layout.tsx                 # Pacifico + Quicksand + Patrick_Hand (vietnamese)
├── page.tsx                   # return <TropicalInvite />
└── _components/
    ├── tropical-invite.tsx    # "use client" — tokens t, ghép section, SmoothScroll
    ├── wave-gate.tsx          # C1 + T4 sóng tràn
    ├── wave-band.tsx          # dải sóng A9 giữa section, prop `from`, `to` (màu)
    ├── island-card.tsx        # card đảo + lá cọ góc (prop `palm: "tl" | "tr" | "none"`)
    ├── palm.tsx               # lá cọ + A12
    ├── sections/              # hero (C2+C16), couple, islands (C4), date, schedule, venue, dress, postcards (C8), reply, thanks
    ├── schedule.ts            # beachSchedule(date) (+ test)
    └── svg/
```

### 9.2 Tokens
```ts
export const t = {
  root: "bg-[#FFF5E9] text-[#1E3A4C] font-(family-name:--font-body) font-medium",
  island: "bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(31,127,116,0.45)]",
  deep: "bg-[#1F7F74] text-white", foam: "bg-[#E6F6F3]",
  script: "font-(family-name:--font-script)", hand: "font-(family-name:--font-hand)",
  label: "text-xs tracking-[0.18em] uppercase font-bold",
  soft: "text-[#557083]",
  btn: "bg-[#C4502A] hover:bg-[#A8421F] text-white rounded-full min-h-11 px-7",
} as const;
```

### 9.3 Sóng A9 (dải sóng)
```tsx
// wave-band.tsx
useGSAP(() => {
  if (reduced) return;
  const tw = gsap.to(".wave", { xPercent: -50, ease: "none", duration: (i) => [6, 9][i], repeat: -1 });
  ScrollTrigger.create({ trigger: root.current, start: "top bottom", end: "bottom top",
    onToggle: (s) => (s.isActive ? tw.play() : tw.pause()) });
}, { scope: root, dependencies: [reduced] });
```
SVG rộng `200%`, path gồm 2 chu kỳ giống hệt nhau → dịch −50% là liền mạch.

### 9.4 Sóng tràn (C1)
```tsx
tl.current = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } })
  .to(".gate-ui", { autoAlpha: 0, duration: 0.3 }, 0)
  .fromTo(".flood", { yPercent: 100 }, { yPercent: 0, duration: 0.8 }, 0.1)
  .set(".gate-scene", { autoAlpha: 0 })
  .to(".flood", { yPercent: -100, duration: 0.8 })
  .call(onOpened);
```
`.flood` = `div` nền `teal` cao `120svh`, mép trên và mép dưới là 2 SVG sóng (fill cùng màu) nằm ngoài khối, bản thân `.flood-crest` chạy A9 trong lúc dâng.

### 9.5 Bưu thiếp (C8)
- Track A5 như ao-dai-2d §9.5 (`pin`, `scrub: 1`, `invalidateOnRefresh`).
- Lật: mỗi bưu thiếp là `<button>` với 2 mặt `[backface-visibility:hidden]`, container `[transform-style:preserve-3d]`; `gsap.to(card, { rotateY: flipped ? 180 : 0, duration: 0.6 })`.
- Tem dán: `gsap.from(stamp, { scale: 1.4, rotate: 15, opacity: 0, ease: "back.out(1.4)", scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 60%" } })`.

### 9.6 Logic cần test
- `beachSchedule(date)` → 4 mốc (−2h, −1h, 0, +1h30), vượt nửa đêm đúng.
- Góc xoay bưu thiếp theo index là tất định (cùng input → cùng output).

### 9.7 Thứ tự làm
1. `meta`, `layout`, `page`, tokens; kiểm Pacifico hiển thị dấu tiếng Việt không bị cắt
2. Section tĩnh + nền theo độ sâu, khớp 360/1440px
3. `wave-band` (A9 liền mạch + pause ngoài viewport)
4. `wave-gate` + nhạc
5. C4 hành trình (MotionPath), C8 bưu thiếp (A5 + lật)
6. Animation nhỏ: lá cọ, phao, bong bóng, dấu chân
7. Reduced-motion, tên dài, Lighthouse (nhiều SVG động → kiểm CPU)
8. Checklist template-spec §12
