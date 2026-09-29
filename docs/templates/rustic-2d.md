# 2D-22 · `rustic-2d` · Gỗ Mộc Đèn Dây

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 0. Design Read + điều chỉnh v2 (29/09/2026), ưu tiên hơn các mục bên dưới khi mâu thuẫn

**Design Read:** thiệp cưới online cho khách mời của một cặp đôi cưới ngoài trời ở quê / farmstay; ngôn ngữ *kho thóc gỗ, dây thừng đay, bảng gỗ sơn tay, đèn sợi đốt*; nghiêng về *thủ công mộc mạc, ấm, có chiều sâu vật liệu*.
**Dial:** VARIANCE 7 · MOTION 6 · DENSITY 3.

- **Khác cafe-2d (cũng nền gỗ tối):** không bảng phấn, không dây đèn treo ảnh. Xương sống là **một sợi dây thừng dọc liền mạch** (vẽ theo cuộn), mọi nội dung là **bảng gỗ treo bằng dây chữ V** có giấy kraft dán lên; album là **dây phơi cuộn ngang được ghim**.
- **Font:** **Alex Brush** (chữ sơn tay cho tên và tiêu đề phụ) + **Gelasio** (nội dung). Không dùng Great Vibes / Lora (đã có mẫu khác dùng).
- **h1** nằm ở bảng tên lớn C2 (màn C1 bị gỡ sau khi mở nên không chứa h1).
- **Ảnh:** dây phơi chứa **toàn bộ** `data.images` (template-spec §2.2) + nút "Xem trọn album".
- **Mừng cưới:** bảng "Mừng cưới" dùng `<GiftButton>` chung; nhạc chung, bỏ C16 radio (trùng `MusicToggle`).
- Không emoji / ký hiệu ♥ trong chữ; không dấu `—`.

## 1. Concept

**Một câu:** Một buổi tối ở kho thóc gỗ ngoài đồng quê: khách bật công tắc, dây đèn bóng tròn sáng lên từng bóng một, rồi đi dọc theo **một sợi dây thừng chạy suốt trang**, trên đó treo các tấm bảng gỗ ghi thông tin đám cưới.

**Cảm xúc muốn gợi:** ấm cúng, mộc mạc, "về quê ăn cưới". Ánh vàng của đèn sợi đốt trên nền gỗ tối, mùi rơm và hoa baby.

**Phù hợp với:** cặp đôi cưới ngoài trời, sân vườn, farmstay, homestay Đà Lạt / Ba Vì; ảnh cưới tông nâu ấm, có nắng chiều.

**Khác các mẫu khác ở chỗ:**
- **Cột sống của trang là một sợi dây thừng dọc** (SVG path) được vẽ dần theo cuộn (A6 scrub). Mọi tấm bảng gỗ đều "móc" vào sợi dây này và **đung đưa** khi xuất hiện, như vật thật treo trên dây.
- **Ánh sáng là trạng thái:** trang bắt đầu tối hoàn toàn, sáng dần khi mở thiệp, và **tắt dần từng bóng** ở cuối (C10), đảo ngược C1.
- Album là **dây phơi ảnh nằm ngang** kẹp bằng kẹp gỗ (T5 cuộn ngang).

**Moodboard:** ván gỗ thông sần, dây thừng đay, bóng đèn Edison dây tóc, lọ thuỷ tinh cắm hoa baby, kẹp gỗ, bao bố, lá bạch đàn khô.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `night` | `#1E1510` | Nền lúc "tắt đèn" (C1 trước khi bấm, C10 cuối) |
| `bg` | `#3B2A1E` | Nền trang: vách gỗ tối |
| `wood` | `#8A6440` | Vân gỗ tấm bảng (lớp gradient) |
| `surface` | `#F4EAD9` | Giấy kraft sáng dán trên bảng gỗ, nền chữ chính |
| `primary` | `#C89F65` | Vàng mật ong: nút, đường kẻ, số lớn |
| `glow` | `#FFD68A` | Ánh đèn (bóng đèn, quầng sáng) |
| `accent` | `#8AA17C` | Xanh lá bạch đàn: icon, chấm trang trí |
| `rope` | `#B89B72` | Dây thừng, dây phơi |
| `text` | `#3B2A1E` | Chữ trên `surface` |
| `text-soft` | `#6E5A48` | Chữ phụ trên `surface` |
| `cream` | `#F4EAD9` | Chữ trên nền `bg` (trùng `surface`) |

Tương phản: `text` trên `surface` khoảng 11.5:1 ✅. `text-soft` trên `surface` khoảng 5.4:1 ✅. `cream` trên `bg` khoảng 11:1 ✅. `primary` trên `bg` khoảng 5.2:1 ✅ (chỉ dùng cho chữ ≥ 18px). `text` trên nút `primary` khoảng 5.6:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Great Vibes | 48px / 1.1 | 80px | Như viết phấn/sơn trắng lên gỗ |
| Tiêu đề section | Lora 600, VIẾT HOA, tracking 0.18em | 13px | 15px | "LỄ THÀNH HÔN" |
| Tiêu đề phụ viết tay | Great Vibes | 30px | 40px | "Ngày chung đôi", "Khoảnh khắc" |
| Số lớn (ngày) | Lora 500 | 88px | 128px | màu `primary` |
| Nội dung | Lora 400 | 17px / 1.65 | 19px | |
| Nhãn nhỏ | Lora 400 italic | 14px | 15px | |

Cả hai font nằm trong danh sách đã kiểm subset `vietnamese`.

### Hình khối và chất liệu
- **Tấm bảng gỗ** (`<WoodSign>`): nền gradient vân gỗ `bg-[repeating-linear-gradient(92deg,#8A6440_0_6px,#7C5937_6px_9px,#93704A_9px_15px)]`, `rounded-lg` (0.5rem), bóng `shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)]`. Bên trong dán một tờ giấy kraft `surface` lệch 1°, mép hơi răng cưa (mask arbitrary). Hai lỗ đinh ở góc trên, từ đó hai sợi dây chữ V nối lên sợi dây thừng chính.
- **Dây thừng**: SVG path `stroke rope`, `stroke-width 3`, `stroke-dasharray` giả sợi xoắn (`6 2`).
- **Bóng đèn**: SVG hình giọt (22×30), khi sáng có quầng `bg-[radial-gradient(circle,rgba(255,214,138,0.55),transparent_70%)]` 80px phía sau.
- **Vân gỗ nền**: gradient dọc rất mờ trên `bg`, không dùng ảnh bitmap.
- **Icon**: nét 1.5px, màu `accent`, phong cách khắc gỗ (6 icon: lọ hoa, nhẫn, đĩa, đàn guitar, nhà kho, định vị).
- **Ảnh**: khung polaroid kraft (viền `surface` 10px, dưới 36px) hoặc khung gỗ mỏng.
- **Motion**: ease chủ đạo `sine.out`. Đung đưa dùng `elastic.out(1, 0.35)` **chỉ cho `rotation`** của tấm bảng (điểm khác duy nhất so với "không nảy"). Thời lượng vào 0.8s; đung đưa tắt dần 1.6s.

---

## 3. Nhạc

- **Tâm trạng**: guitar mộc (acoustic fingerpicking), có thể kèm harmonica hoặc banjo nhẹ; ấm, vui vừa, không lời.
- **Tempo**: 80–95 BPM (mục tiêu ~88). **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `country acoustic wedding`, `folk guitar warm`, `rustic acoustic love`
- **Hành vi**:
  - Bắt đầu khi bấm công tắc đèn (C1). Âm lượng 0 → 0.6 trong 1.5 giây, **đồng bộ với các bóng đèn sáng dần**.
  - C16 là "chiếc radio gỗ" trên một tấm bảng, điều khiển cùng thẻ `<audio>` với `<MusicPlayer>`.
  - Ẩn tab thì tạm dừng, quay lại thì phát tiếp.
  - Ở C10 khi các bóng tắt dần, **không** tắt nhạc (chỉ trang trí).

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Công tắc & dây đèn     │ 100svh  (tối, cố định tới khi mở)
├───────────────────────────┤ ← sợi dây thừng dọc bắt đầu từ đây
│ C2  Bảng tên lớn           │ 100svh   │
│ C16 Radio gỗ               │  60svh   │
│ C3  Hai bảng gia đình      │ 110svh   │  T1 "treo":
│ C4  Ba bảng chuyện tình    │ 150svh   │  bảng rơi xuống móc vào dây,
│ C5+C11 Ngày cưới + lịch    │ 130svh   │  đung đưa rồi đứng yên
│ C12 Lịch trình (thước gỗ)  │ 110svh   │
│ C6+C7 Hai lễ + bản đồ      │ 150svh   │
│ C13 Dress code (lọ hoa)    │  70svh   │
├───────────────────────────┤ ← dây thừng rẽ ngang thành dây phơi
│ C8  Dây phơi ảnh (T5)      │ ghim, cuộn ngang ≈ 250svh
├───────────────────────────┤
│ C14 Mừng cưới              │  80svh   │
│ C15 Xác nhận tham dự       │ 100svh   │
│ C10 Tắt đèn                │ 100svh  (các bóng tắt lần lượt)
└───────────────────────────┘
```

**Bố cục:** trên mobile dây thừng chạy ở **mép trái** (x = 20px), các bảng lệch phải, rộng `min(84vw, 420px)`. Trên desktop (`lg`) dây chạy **zigzag** giữa trang, bảng lần lượt treo lệch trái/phải (ghi chú `lg:` trong từng section). Dây đèn ngang chỉ xuất hiện ở C1 và C10 (không ghim suốt trang, vì bên trong ScrollSmoother không dùng `fixed`/`sticky`); phần giữa trang chỉ có vài bóng đèn đơn treo trên dây thừng.

**Chuyển cảnh chính (T1 biến thể "treo"):** mỗi bảng vào bằng `y: -80 → 0`, `rotation: -8 → 0` (elastic), dây chữ V vẽ bằng A6 trước khi bảng rơi.

---

## 5. Chi tiết từng section

### C1 · Công tắc và dây đèn (màn mở thiệp)

**Mục đích:** khoảnh khắc "bật đèn khai tiệc"; cú bấm công tắc là tương tác người dùng để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ∩   ∩   ∩   ∩   ∩   ∩   ∩  │  ← dây đèn võng (catenary), 7 bóng tắt (màu #4A3A2C)
│  ╲_╱ ╲_╱ ╲_╱ ╲_╱ ╲_╱ ╲_╱   │
│                            │
│      Minh Quân             │  ← Great Vibes 40px, màu #6E5A48 (mờ vì "tối")
│          &                 │
│         Thu Hà             │
│                            │
│       ┌──────────┐         │
│       │   ┌──┐   │         │  ← công tắc gỗ 88×120, cần gạt 44×64
│       │   │▓▓│   │         │
│       │   └──┘   │         │
│       └──────────┘         │
│   Bật đèn để mở thiệp      │  ← italic 14px, cream 70%
└────────────────────────────┘
```

**Nội dung:**
- Tên: `{groom.name}` & `{bride.name}` (là `<h1>` của trang; C2 dùng `<p aria-hidden>` lặp lại tên cỡ lớn).
- Dòng hướng dẫn: *"Bật đèn để mở thiệp"*
- Nút: `<button aria-label="Bật đèn và mở thiệp mời">` bọc toàn bộ công tắc.

**Animation vào (timeline):**
| t | Hành động |
|---|---|
| 0.0s | Nền `night`. Dây đèn A6 vẽ từ trái sang phải (1.2s) |
| 0.6s | Tên A1 (`opacity 0 → 0.6`, vì đang "tối") |
| 1.2s | Công tắc `y: 20 → 0` fade (0.6s) |
| sau đó, lặp | Một bóng đèn ngẫu nhiên nhấp nháy yếu (`opacity 0.15 ↔ 0.35`, 0.2s) mỗi 3s, gợi ý "sắp sáng" |

**Khi bấm công tắc (timeline mở, tổng 2.2s):**
| t | Hành động |
|---|---|
| 0.0s | Cần gạt `y: 0 → 28px` (0.15s, `power2.in`) — "tách" |
| 0.0s | Nhạc bắt đầu, âm lượng tăng dần |
| 0.15s | 7 bóng đèn sáng lần lượt, stagger 0.12s từ giữa ra (`stagger: { from: "center" }`): bóng đổi màu `glow`, quầng sáng `scale 0.3 → 1`, `opacity 0 → 1` |
| 0.4s | Lớp phủ tối (`night` 100%) `opacity 1 → 0` (1.4s, `sine.out`) để lộ `bg` gỗ |
| 0.6s | Tên sáng hẳn `opacity 0.6 → 1`, màu chuyển sang `cream` (qua 2 lớp chồng, crossfade) |
| 1.4s | Công tắc trượt xuống `y: 120%` và fade |
| 1.8s | Dây thừng dọc xuất hiện ở đầu C2 (A6 phần đầu 0 → 8%) |
| 2.2s | Mở khoá cuộn, bắt đầu ScrollSmoother |

**Reduced-motion:** bỏ stagger bóng đèn và nhấp nháy; bấm là tất cả bóng sáng cùng lúc, lớp phủ fade 0.3s.
**Edge case:** tên > 20 ký tự thì 30px và xuống dòng; công tắc luôn nằm ở nửa dưới, không lọt vào góc dưới phải (cách phải ≥ 80px trên mobile, căn giữa).

---

### C2 · Bảng tên lớn

**Mục đích:** thông tin cốt lõi trên tấm bảng to nhất, đọc riêng card này cũng đủ.

**Wireframe:**
```
┌────────────────────────────┐
│┃  ╲   ╱                    │  ← dây thừng dọc ở mép trái; dây chữ V
│┃ ┌─●───●─────────────────┐ │
│┃ │ ╭───────────────────╮ │ │  ← ảnh bìa images[0], khung gỗ mỏng, 4:5
│┃ │ │     ẢNH BÌA       │ │ │
│┃ │ ╰───────────────────╯ │ │
│┃ │ ┌───────────────────┐ │ │  ← giấy kraft dán lệch 1°
│┃ │ │ TRÂN TRỌNG KÍNH MỜI│ │ │
│┃ │ │   Minh Quân        │ │ │  ← Great Vibes 48px
│┃ │ │       &            │ │ │
│┃ │ │     Thu Hà         │ │ │
│┃ │ │ ── ✿ baby ✿ ──     │ │ │
│┃ │ │ THỨ BẢY · 14.11.2026│ │ │  ← cần `date` ⚠️
│┃ │ └───────────────────┘ │ │
│┃ └───────────────────────┘ │
└────────────────────────────┘
```

**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · tên · dòng *"cùng về chung một nhà"* (italic) · ngày `EEEE · dd.MM.yyyy`. Chưa có `date` ⚠️ thì dùng ngày mẫu `2026-11-14T18:00` hằng số trong `wedding-date.ts`.

**Animation:**
| t (khi vào viewport 70%) | Hành động |
|---|---|
| 0.0s | Dây chữ V A6 (0.4s) |
| 0.3s | Bảng rơi `y: -80 → 0`, `rotation: -8 → 0` (`elastic.out(1,0.35)`, 1.6s), `transformOrigin: "50% -40px"` (điểm treo) |
| 0.6s | Ảnh bìa A3 |
| 0.9s | Tên A2 theo `chars`, stagger 0.03 |
| 1.4s | Nhánh hoa baby SVG A6 |

**Chuyển sang C16:** T1; dây thừng tiếp tục vẽ theo scrub khi cuộn (một path duy nhất cho cả trang, xem §9.4).

---

### C16 · Radio gỗ (bài hát của chúng tôi)

```
┌────────────────────────────┐
│┃     ┌──────────────────┐  │  ← bảng nhỏ, lệch phải, rotation 2°
│┃  ●──┤ ◉  ░░░░░  ◉      │  │  ← radio: 2 núm vặn, lưới loa
│┃     │ ♪ Chạm để nghe    │  │
│┃     │   bài hát của     │  │
│┃     │   chúng tôi       │  │
│┃     │  [ ▶ / ❚❚ ]       │  │  ← nút 48×48
│┃     │ ─────●──── 1:12   │  │
│┃     └──────────────────┘  │
└────────────────────────────┘
```
**Hành vi:** cùng `<audio>` với `<MusicPlayer>`. Khi đang phát, kim dò đài trên radio trượt qua lại (`x ±6px`, 3s, `sine.inOut`, lặp) và núm vặn xoay theo `currentTime`. Thanh tiến độ cập nhật mỗi giây.
**Animation:** treo (như C2) nhưng biên độ nhỏ `rotation: 6 → 2`.

---

### C3 · Hai bảng gia đình

```
┌────────────────────────────┐
│┃  ┌────────┐               │
│┃──┤polaroid│  NHÀ TRAI     │  ← images[1], kẹp gỗ trên dây
│┃  │ chú rể │  Minh Quân    │  ← Great Vibes 30px
│┃  └────────┘  Quận 1,      │
│┃              TP.HCM       │
│┃               ┌────────┐  │
│┃   NHÀ GÁI  ───┤polaroid│  │  ← images[2], lệch phải
│┃   Thu Hà      │ cô dâu │  │
│┃   Ba Đình,    └────────┘  │
│┃   Hà Nội                  │
└────────────────────────────┘
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️ chưa chốt: nếu có trường thì thêm dòng *"Ông … & Bà …"* nhỏ trên tên; nếu không có thì bỏ dòng, không để trống.
**Animation:** hai bảng lần lượt (cách 0.25s) treo theo kiểu C2, ảnh xoay `-3°`/`+3°`. Kẹp gỗ "bấm" `scaleY 1.2 → 1` (0.15s) khi ảnh chạm vị trí.
**Edge case:** địa chỉ dài quá 3 dòng thì `line-clamp-3` + `title` đầy đủ.

---

### C4 · Ba bảng chuyện tình

```
┌────────────────────────────┐
│┃   Chuyện của chúng mình    │  ← Great Vibes 30px
│┃ ┌──────────────────────┐   │
│┃●┤ 01 · GẶP GỠ          │   │  ← mỗi mốc là 1 bảng; một bóng đèn nhỏ
│┃ │ [ảnh images[3] 4:3]  │   │     treo trên dây cạnh bảng, sáng khi tới
│┃ │ Một chiều mưa ở quán │   │
│┃ │ cà phê nhỏ…          │   │
│┃ └──────────────────────┘   │
│┃●┤ 02 · THƯƠNG …          │   │
│┃●┤ 03 · CẦU HÔN …         │   │
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. **Gặp gỡ** — *"Một chiều mưa, hai người lạ trú chung mái hiên quán cà phê nhỏ. Không ai ngờ đó là khởi đầu."*
2. **Thương nhau** — *"Những chuyến xe về quê, những bữa cơm nhà, và rất nhiều lần cùng nhau đi qua mùa gặt."*
3. **Cầu hôn** — *"Dưới một dây đèn vàng như thế này, anh hỏi, và em gật đầu."*

Ảnh: `images[3]`, `images[4]`, `images[5]`.
**Animation:** mỗi bảng treo khi vào viewport; bóng đèn cạnh bảng sáng (`glow`, 0.3s) đúng lúc bảng đứng yên. Trên `lg`, 3 bảng xếp zigzag.

---

### C5 + C11 · Ngày cưới và lịch

```
┌────────────────────────────┐
│┃ ┌──────────────────────┐   │  ← bảng gỗ, chữ khắc (màu primary trên wood tối)
│┃●┤   Ngày chung đôi      │   │
│┃ │  THÁNG MƯỜI MỘT       │   │
│┃ │ THỨ BẢY │ 14 │ 2026   │   │  ← "14" Lora 88px
│┃ │  CÒN 45 NGÀY 06 GIỜ   │   │
│┃ │  12 PHÚT 33 GIÂY      │   │  ← A7, mỗi số là 1 miếng gỗ nhỏ
│┃ └──────────────────────┘   │
│┃ ┌──────────────────────┐   │  ← giấy kraft ghim bằng đinh
│┃ │ T2 T3 T4 T5 T6 T7 CN │   │
│┃ │  …    12 13 (◯) 15   │   │  ← ngày cưới khoanh vòng tròn dây thừng
│┃ └──────────────────────┘   │
└────────────────────────────┘
```
**Nội dung:** tháng viết chữ tiếng Việt; lịch bắt đầu Thứ Hai; đếm ngược tới `date` ⚠️. Đã qua ngày cưới: *"Chúng mình đã về chung một nhà ♥"* và ẩn bộ đếm.
**Animation:** "14" đếm 1 → 14 (0.8s, `snap: 1`). Vòng tròn dây thừng quanh ô ngày A6 (0.8s). Mỗi chữ số lật A7.
**Tương phản chữ khắc:** chữ `#F4EAD9` trên nền gỗ trung bình `#7C5937` ≈ 5.6:1 ✅; không dùng `primary` cho chữ nhỏ trên gỗ.

---

### C12 · Lịch trình (thước gỗ)

```
┌────────────────────────────┐
│┃        LỊCH TRÌNH          │
│┃ ┌──┬──┬──┬──┬──┬──┬──┐    │  ← thước gỗ ngang, vạch giờ 16h→21h
│┃ │16│17│18│19│20│21│  │    │
│┃ └──┴─▲┴─▲┴▲─┴──┴▲─┴──┘    │  ← 4 móc treo thẻ nhỏ
│┃      │  │  │     │         │
│┃   [lọ] [nhẫn][đĩa] [đàn]   │  ← thẻ gỗ nhỏ 72×90, xếp 2×2 trên mobile
│┃   17:00 18:00 18:30 20:00  │
│┃   Đón   Làm   Khai  Giao   │
│┃   khách lễ    tiệc  lưu    │
└────────────────────────────┘
```
**Nội dung:** 4 mốc tính từ `date` (đón khách = giờ tiệc − 1h, làm lễ = giờ tiệc, khai tiệc = +30′, giao lưu = +2h). Trên mobile < 400px thước chuyển thành **dọc** (cột trái), thẻ nằm bên phải.
**Animation:** kim chỉ (tam giác `primary`) chạy dọc thước theo scrub; khi kim đi qua mốc nào, thẻ đó "treo" xuống (`y: -30 → 0`, `rotation: -6 → 0` elastic).

---

### C6 + C7 · Hai lễ và bản đồ

```
┌────────────────────────────┐
│┃ ┌──────────────────────┐   │
│┃●┤   LỄ VU QUY          │   │
│┃ │ 08:00 · Thứ Bảy      │   │
│┃ │ Tư gia nhà gái       │   │
│┃ │ {bride.address}      │   │
│┃ └──────────────────────┘   │
│┃ ┌──────────────────────┐   │
│┃●┤   TIỆC CƯỚI          │   │
│┃ │ 18:00 · Thứ Bảy      │   │
│┃ │ {venue.name}         │   │
│┃ │ ┌──────────────────┐ │   │  ← <MapEmbed>, khung gỗ, 16:10
│┃ │ │   Google Map     │ │   │
│┃ │ └──────────────────┘ │   │
│┃ │ [ ⌖ Chỉ đường ]      │   │  ← nút primary, ≥ 44px
│┃ └──────────────────────┘   │
└────────────────────────────┘
```
**Nội dung:** Lễ vu quy (giờ viết sẵn 08:00 ngày cưới), Tiệc cưới (giờ từ `date`), `venue.name`, `venue.address`, link `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`.
**Animation:** hai bảng treo lần lượt. Bản đồ chỉ mount khi section cách viewport < 1 màn hình (IntersectionObserver `rootMargin: "100% 0px"`), bên trong `<MapEmbed>` đã `loading="lazy"`.

---

### C13 · Dress code (lọ hoa)

```
┌────────────────────────────┐
│┃        DRESS CODE          │
│┃   Mộc mạc · tông đất ấm    │
│┃   ⌂    ⌂    ⌂    ⌂         │  ← 4 lọ thuỷ tinh SVG, nước màu
│┃  Kem  Nâu  Xanh  Mật ong   │     #F4EAD9 #6E5A48 #8AA17C #C89F65
│┃  "Mời bạn chọn giày dễ đi  │
│┃   trên cỏ nhé!"            │
└────────────────────────────┘
```
**Animation:** mực nước trong lọ dâng `scaleY 0 → 1` (origin bottom), stagger 0.1. Hoa baby cắm trong lọ A12 nhẹ.

---

### C8 · Dây phơi ảnh (T5 cuộn ngang)

```
┌────────────────────────────┐
│  KHOẢNH KHẮC               │  ← Great Vibes 30px
│ ──┬──────┬──────┬──────┬── │  ← dây phơi võng, nối từ dây thừng dọc
│  ▌▐     ▌▐     ▌▐     ▌▐   │  ← kẹp gỗ
│ ┌────┐ ┌────┐ ┌────┐ ┌───  │  ← polaroid images[3..5] (+ images[0])
│ │ảnh │ │ảnh │ │ảnh │ │     │     rộng 62vw, xoay ±3°
│ └────┘ └────┘ └────┘ └───  │
│      ← kéo / cuộn →         │
└────────────────────────────┘
```
**Hành vi:** ghim section, dịch ngang A5 theo cuộn (`x: -(track.scrollWidth - innerWidth)`, `scrub: 1`). Mỗi ảnh đung đưa theo **vận tốc cuộn**: `rotation = clamp(-6, 6, velocity / 300)` rồi trả về 0 bằng `quickTo` (0.6s). Bấm ảnh → A10 lightbox.
**Danh sách ảnh:** `images.slice(3)` + `images[0]` nếu ít hơn 4 tấm.
**Reduced-motion:** không ghim; hiển thị thành dải `overflow-x-auto snap-x` cuộn ngang bằng tay, không đung đưa.
**Accessibility:** mỗi ảnh là `<button>` có `aria-label="Mở ảnh 2/4"`; lightbox đóng bằng Esc.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│┃        MỪNG CƯỚI           │
│┃ Sự hiện diện của bạn là    │
│┃ món quà quý nhất.          │
│┃ ┌────────┐   ┌────────┐    │  ← 2 hộp gỗ nhỏ, QR mẫu ⚠️
│┃ │  QR    │   │  QR    │    │
│┃ │nhà trai│   │nhà gái │    │
│┃ └────────┘   └────────┘    │
└────────────────────────────┘
```
**Hành vi:** bấm QR → A10 phóng to. QR là ảnh placeholder `public/templates/rustic-2d/qr-sample.webp` có chữ "QR MẪU" — ⚠️ chờ chốt cách người dùng đưa QR thật (todo §8).

---

### C15 · Xác nhận tham dự (chỉ giao diện)

```
┌────────────────────────────┐
│┃ ┌──────────────────────┐   │  ← bảng kraft kiểu "sổ khách"
│┃ │  XÁC NHẬN THAM DỰ    │   │
│┃ │ [ Tên của bạn     ]  │   │
│┃ │ ( ) Mình sẽ đến      │   │
│┃ │ ( ) Tiếc quá, bận rồi│   │
│┃ │ Số người: [ 1 ▾ ]    │   │
│┃ │ [ Gửi lời hẹn ]      │   │
│┃ └──────────────────────┘   │
└────────────────────────────┘
```
**Hành vi:** bấm Gửi → form thu `height → 0`, hiện *"Cảm ơn {tên}! Hẹn gặp bạn dưới dây đèn ♥"*. **Không gửi dữ liệu đi đâu.** Ghi chú nhỏ: *"Bản xem thử — xác nhận không được gửi đi."* Tên trống thì dùng "bạn".

---

### C10 · Tắt đèn (lời cảm ơn)

```
┌────────────────────────────┐
│ ∩   ∩   ∩   ∩   ∩   ∩   ∩  │  ← dây đèn như C1, đang sáng
│                            │
│     ╭──────────╮           │  ← images[n-1], khung gỗ
│     │ ẢNH CUỐI │           │
│     ╰──────────╯           │
│  Cảm ơn bạn đã đến chung   │
│  vui cùng chúng mình!      │
│   Minh Quân & Thu Hà       │  ← Great Vibes
└────────────────────────────┘
```
**Animation (scrub, 100svh):** dây thừng dọc kết thúc bằng một nút thắt. Khi cuộn từ 40% → 100% section: 7 bóng đèn **tắt dần từng bóng từ ngoài vào giữa**, lớp phủ `night` `opacity 0 → 0.75`; bóng cuối cùng ở giữa giữ sáng, chiếu lên tên (quầng sáng to hơn). Đảo ngược cảm giác của C1.
**Reduced-motion:** không tắt đèn, tĩnh.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa (và bù vào C8 nếu thiếu) | 4:5 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..5]` | C4 ba mốc chuyện tình, đồng thời C8 dây phơi | 4:3 (C4) / 4:5 (C8, `object-cover`) |
| `images[n-1]` | C10 ảnh cuối (= `images[5]` khi đủ 6 ảnh) | 3:4 |

`meta.media = { images: 6, videos: 0 }`
`meta.styles = ["vintage", "floral"]`, `meta.colors = ["beige", "green"]`.
Nếu người dùng upload ít hơn 6 ảnh (không nên xảy ra vì form bắt buộc), mọi chỗ dùng `images[i] ?? images[0]`.

## 7. Asset cần chuẩn bị
- [ ] SVG: dây đèn (path catenary + 7 bóng), bóng đèn đơn, công tắc (đế + cần gạt tách riêng), kẹp gỗ, dây chữ V, nút thắt dây, lọ thuỷ tinh, nhánh hoa baby (2 kiểu), 6 icon lịch trình, radio gỗ
- [ ] `music.mp3` (Pixabay, guitar mộc ~88 BPM) + ghi `CREDITS.md`
- [ ] 6 ảnh mẫu tông nâu ấm, ngoài trời (Unsplash) ≤ 300KB `.webp`
- [ ] `qr-sample.webp` (QR giả có chữ "QR MẪU")
- [ ] `thumb.webp` 600×800: dây đèn vừa sáng trên nền gỗ, bảng tên treo
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Bấm công tắc: nhạc phát ngay, bóng đèn sáng xong và cuộn được trong ≤ 2.3 giây
- [ ] Dây thừng dọc liền mạch từ C2 tới C10 ở 360px và 1440px (không đứt khi section đổi chiều cao do tên dài)
- [ ] Đung đưa của bảng dừng hẳn sau ≤ 1.8s, không lặp vô hạn
- [ ] C8 cuộn ngang mượt 60fps trên điện thoại tầm trung; reduced-motion thành dải vuốt tay
- [ ] Không có chữ nhỏ (< 18px) màu `primary` trên nền gỗ
- [ ] Tên 50 ký tự không làm vỡ công tắc C1 và bảng C2

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/rustic-2d/
├── meta.ts
├── layout.tsx                  # Great_Vibes (--font-script) + Lora (--font-body), vietnamese
├── page.tsx                    # return <RusticInvite />
└── _components/
    ├── rustic-invite.tsx       # "use client" — tokens t, ghép section, SmoothScroll, rope path
    ├── light-string.tsx        # dây đèn dùng cho C1 (mode "on") và C10 (mode "off", scrub)
    ├── switch-gate.tsx         # C1: công tắc + timeline mở, dùng OpenGate
    ├── rope.tsx                # SVG path dây thừng dọc, tính path theo vị trí các .sign
    ├── wood-sign.tsx           # tấm bảng gỗ + dây V + animation treo
    ├── wedding-date.ts         # date ⚠️ fallback + tính giờ 4 mốc lịch trình
    ├── wedding-date.test.ts
    ├── sections/
    │   ├── name-sign.tsx       # C2
    │   ├── radio-sign.tsx      # C16
    │   ├── family-signs.tsx    # C3
    │   ├── story-signs.tsx     # C4
    │   ├── date-sign.tsx       # C5 + C11
    │   ├── ruler-schedule.tsx  # C12
    │   ├── events-sign.tsx     # C6 + C7
    │   ├── jar-dresscode.tsx   # C13
    │   ├── clothesline.tsx     # C8 (A5 + velocity sway)
    │   ├── gift-sign.tsx       # C14
    │   ├── rsvp-sign.tsx       # C15
    │   └── lights-out.tsx      # C10
    └── svg/                    # bulb, switch, clip, jar, baby-flower, icons
```
Dùng chung từ `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. Từ `@/components`: `MapEmbed`. Dữ liệu từ `useWedding()`.

### 9.2 Tokens trong Tailwind
```ts
// rustic-invite.tsx
export const t = {
  root: "min-h-svh bg-[#3B2A1E] text-[#F4EAD9] font-(family-name:--font-body) overflow-x-clip",
  wood: "rounded-lg bg-[repeating-linear-gradient(92deg,#8A6440_0_6px,#7C5937_6px_9px,#93704A_9px_15px)] shadow-[0_18px_30px_-12px_rgba(0,0,0,0.6)]",
  kraft: "bg-[#F4EAD9] text-[#3B2A1E] rotate-[1deg] p-5",
  heading: "text-[13px] lg:text-[15px] tracking-[0.18em] uppercase font-semibold",
  script: "font-(family-name:--font-script)",
  soft: "text-[#6E5A48]",
  btn: "min-h-11 px-5 rounded-lg bg-[#C89F65] text-[#3B2A1E] font-semibold focus-visible:outline-2 focus-visible:outline-[#FFD68A]",
  glow: "bg-[radial-gradient(circle,rgba(255,214,138,0.55),transparent_70%)]",
} as const;
```

### 9.3 Luồng mở thiệp (C1)
```tsx
// switch-gate.tsx (rút gọn)
const tl = useRef<gsap.core.Timeline>(null);
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true, defaults: { ease: "sine.out" } })
    .to(".lever", { y: 28, duration: 0.15, ease: "power2.in" }, 0)
    .to(".bulb", { fill: "#FFD68A", duration: 0.2, stagger: { each: 0.12, from: "center" } }, 0.15)
    .fromTo(".halo", { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: { each: 0.12, from: "center" } }, 0.15)
    .to(".dark-veil", { opacity: 0, duration: 1.4 }, 0.4)
    .to(".switch", { yPercent: 120, opacity: 0, duration: 0.6 }, 1.4)
    .call(onOpened, [], 2.2);
}, { scope: root });

<button aria-label="Bật đèn và mở thiệp mời" className="switch min-h-11" onClick={() => { music.play(); tl.current?.play(); }}>…</button>
```
`fill` của SVG là thuộc tính màu chứ không phải layout; chấp nhận được. Nếu muốn tuyệt đối chỉ `opacity`, xếp 2 lớp bóng (tắt/sáng) và fade lớp sáng.

### 9.4 Dây thừng dọc + bảng treo
```tsx
// rope.tsx — một <svg> absolute phủ toàn bộ #smooth-content, pointer-events-none
useGSAP(() => {
  gsap.from(".rope-path", {
    drawSVG: "0%", ease: "none",
    scrollTrigger: { trigger: container, start: "top 80%", end: "bottom bottom", scrub: true },
  });
}, { scope: container, dependencies: [pathD] });
```
- `pathD` tính trong `useLayoutEffect` + `ResizeObserver` trên container: lấy `offsetTop` của các `.sign-anchor`, mobile là đường thẳng x=20, `lg` là đường cong bậc 3 đi qua anchor trái/phải. Gọi `ScrollTrigger.refresh()` sau khi đổi path.
- `wood-sign.tsx`:
```tsx
useGSAP(() => {
  if (reduced) return;
  gsap.timeline({ scrollTrigger: { trigger: el.current, start: "top 75%", once: true } })
    .from(".v-rope", { drawSVG: "50% 50%", duration: 0.4 })
    .from(el.current, { y: -80, opacity: 0, duration: 0.5, ease: "sine.out" }, 0.2)
    .from(el.current, { rotation: -8, duration: 1.6, ease: "elastic.out(1, 0.35)", transformOrigin: "50% -40px" }, 0.2);
}, { scope: el });
```

### 9.5 Dây phơi (C8)
```tsx
const sway = gsap.utils.toArray<HTMLElement>(".photo").map((p) => gsap.quickTo(p, "rotation", { duration: 0.6, ease: "sine.out" }));
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth), ease: "none",
  scrollTrigger: {
    trigger: section, pin: true, scrub: 1, end: () => `+=${track.scrollWidth}`, invalidateOnRefresh: true,
    onUpdate: (s) => { const r = gsap.utils.clamp(-6, 6, s.getVelocity() / 300); sway.forEach((q) => q(r)); },
  },
});
```
Sau mỗi `onUpdate`, dùng `gsap.delayedCall(0.15, () => sway.forEach(q => q(0)))` (kill cái cũ trước) để ảnh trả về thẳng khi dừng cuộn.

### 9.6 Ngày giờ
`wedding-date.ts` xuất `getWeddingDate(data)` (trả `data.date` nếu có, không thì hằng số mẫu) và `scheduleTimes(date)` → 4 mốc. Định dạng bằng `Intl.DateTimeFormat("vi-VN", …)`. Lưới lịch tự tính như letter-2d §9.6.
**Test** (`wedding-date.test.ts`): fallback khi thiếu `date`; 4 mốc đúng khi giờ tiệc 18:00; mốc qua nửa đêm (tiệc 23:00 → giao lưu 01:00 hôm sau) vẫn đúng.

### 9.7 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t` → nền gỗ, font đúng
2. `wood-sign.tsx` tĩnh + các section C2 → C10 tĩnh, khớp wireframe 360px và 1440px
3. `switch-gate.tsx` + `light-string.tsx` + nhạc
4. `rope.tsx` (tính path + DrawSVG scrub), kiểm tra với tên 50 ký tự
5. Animation treo từng bảng, C12 kim thước, C5 đếm số
6. `clothesline.tsx` (A5 + đung đưa theo vận tốc)
7. `lights-out.tsx` (C10 scrub)
8. Reduced-motion, Lighthouse, checklist template-spec §12
