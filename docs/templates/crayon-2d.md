# 2D-29 · `crayon-2d` · Nét Sáp Màu

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu tham chiếu cấu trúc: [letter-2d.md](./letter-2d.md).

---

## 0. Design Read + điều chỉnh v2 (29/09/2026), ưu tiên hơn các mục bên dưới khi mâu thuẫn

**Design Read:** thiệp cưới online cho khách mời của một cặp đôi trẻ, vui tính, đám cưới nhỏ; ngôn ngữ *tranh sáp màu trẻ con trên giấy vẽ, băng keo, người que*; nghiêng về *hồn nhiên có chủ đích*: nét vụng là phong cách, còn bố cục, chữ và khoảng trắng vẫn chuẩn chỉnh.
**Dial:** VARIANCE 8 · MOTION 6 · DENSITY 3.

- **Font:** Mali (tên, tiêu đề) + Itim (nội dung), đúng spec; chưa mẫu nào dùng.
- **Nét vẽ:** SVG tay là bản chất concept (được phép, khác quy tắc chung "không tự vẽ SVG"), nhưng chỉ dùng hình rất đơn giản: khung méo vẽ hai lần, gạch chân, vòng tròn tô, mặt trời, ngôi nhà, trái tim, người que. Một filter vân sáp dùng chung.
- **Ảnh:** "bảng dán ảnh" chứa **toàn bộ** `data.images` (template-spec §2.2), dán băng keo xoay nhẹ, có "Xem trọn album".
- **Mừng cưới:** `<GiftButton>` chung trong "phiếu bé ngoan". Nhạc chung, bỏ C16 cát-sét.
- Không emoji; không dấu `—`; không viết hoa toàn bộ.

## 1. Concept

**Một câu:** Cả tấm thiệp là một tờ giấy vẽ của trẻ con: ngôi nhà, mặt trời, hai người que nắm tay — tất cả được "vẽ" ngay trước mắt bằng nét sáp màu run run, và mỗi lần chuyển trang là một nét tô nguệch ngoạc quét kín màn hình.

**Cảm xúc muốn gợi:** vui, hồn nhiên, ấm áp, hơi ngốc nghếch đáng yêu — như tấm thiệp con cháu vẽ tặng. Khách cười ngay từ màn đầu.

**Phù hợp với:** cặp đôi trẻ, vui tính, không thích trang trọng; đám cưới nhỏ, tiệc ngoài trời; cặp đôi làm giáo viên mầm non / thiết kế / hoạ sĩ minh hoạ. Hợp với ảnh chụp tự nhiên, nhiều màu.

**Khác các mẫu khác ở chỗ:** mọi đường nét (khung ảnh, gạch chân, icon, lịch) đều là **SVG được vẽ ra theo thời gian thực** (A6) với filter giả vết sáp; không có khung "sạch". Chuyển cảnh riêng: **"nét tô quét"** (biến thể T4) — một nét sáp dày chạy zigzag phủ kín màn hình rồi bị "tẩy" đi để lộ trang sau. Chuyển động dùng `back.out` nảy tưng tưng, khác hẳn các mẫu sang trọng.

**Moodboard:** giấy vẽ A4 hơi ngà, hộp sáp màu 12 màu, nét tô tràn ra ngoài viền, hình người que, mặt trời có tia, ngôi nhà mái tam giác, băng keo giấy, sticker ngôi sao, chữ viết tay nguệch ngoạc.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#FFFDF8` | Nền giấy vẽ |
| `paper` | `#FFFFFF` | Nền khung nội dung (hiếm dùng, chủ yếu vẽ thẳng lên nền) |
| `pink` | `#FF6B9A` | Màu sáp chủ đạo: nét vẽ, tô, trái tim |
| `pink-deep` | `#C93A6B` | Chữ màu hồng, nút |
| `blue` | `#4EA8DE` | Màu sáp phụ: trời, nước, nét tô |
| `blue-deep` | `#1F6FA8` | Chữ màu xanh, link |
| `yellow` | `#FFD23F` | Mặt trời, ngôi sao (trang trí) |
| `green` | `#6CC56B` | Cỏ, cây (trang trí) |
| `ink` | `#333333` | Chữ chính, nét viền người que |
| `ink-soft` | `#6B6B6B` | Chữ phụ |

Tương phản: `ink` trên `bg` khoảng 12.5:1 ✅. `ink-soft` trên `bg` khoảng 5.2:1 ✅. `pink-deep` trên `bg` khoảng 5.0:1 ✅, chữ trắng trên `pink-deep` khoảng 5.0:1 ✅. `blue-deep` trên `bg` khoảng 5.3:1 ✅. `pink` (≈ 2.9:1), `blue` (≈ 2.6:1), `yellow`, `green` **không dùng làm màu chữ** — chỉ cho nét vẽ và mảng tô.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Mali 700 | 40px / 1.1 | 68px | Hơi xoay `-2°` |
| Tiêu đề section | Mali 600 | 26px | 34px | Có gạch chân nguệch ngoạc A6 |
| Số lớn (ngày) | Mali 700 | 96px | 140px | Bên trong vòng tô tròn |
| Nội dung | Itim 400 | 18px / 1.5 | 20px | |
| Nhãn nhỏ, chú thích | Itim 400 | 15px | 16px | Kèm mũi tên vẽ tay |

Cả hai font có subset `vietnamese`. Không dùng chữ VIẾT HOA toàn bộ (mất cảm giác viết tay).

### Hình khối và chất liệu
- **Vết sáp**: 1 filter SVG dùng chung `<CrayonFilter id="crayon"/>`: `feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"` → `feDisplacementMap scale="2.5"` → thêm `feComposite` với noise lần 2 để nét có lỗ hổng như sáp trên giấy nhám. Mọi nét vẽ `filter="url(#crayon)"`.
- **Nét vẽ**: `stroke-width 4–6`, `stroke-linecap round`, `stroke-linejoin round`. Path cố tình run (thêm 2–3 điểm lệch 1–2px).
- **Khung "nguệch ngoạc"**: không dùng `border`. Mỗi khung là 1 path hình chữ nhật méo, **vẽ 2 lần lệch nhau 2px** (như trẻ con tô lại). Góc bo ≈ `1.5rem`.
- **Mảng tô**: path zigzag dày (`stroke-width 18`) màu `pink`/`blue` `opacity 0.35`, tràn ra ngoài khung một chút.
- **Băng keo**: hình chữ nhật `bg-[#FFD23F]/60` xoay ±8°, mép răng cưa.
- **Ảnh**: nằm trong khung nguệch ngoạc, `rounded-3xl`, xoay ±3°.
- **Motion**: ease chủ đạo `back.out(2)` cho xuất hiện; nét vẽ A6 `none` hoặc `power1.inOut`. Nhanh: vào 0.5s, pop 0.4s.

---

## 3. Nhạc

- **Tâm trạng**: ukulele + glockenspiel, vui tươi, hồn nhiên, có tiếng vỗ tay / huýt sáo càng tốt. Không lời.
- **Tempo**: 110–120 BPM. **Độ dài**: 2:00–2:30, lặp.
- **Từ khoá Pixabay**: `cute kids ukulele`, `happy glockenspiel`, `playful whistle ukulele`
- **Hành vi**: bắt đầu khi bấm mặt trời ở C1, 0 → 0.5 trong 1.5s (nhạc vui dễ chói, để thấp hơn chuẩn 0.6). C16 là "máy cát-sét vẽ tay". Ẩn tab tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Ngôi nhà + mặt trời    │ 100svh (cố định tới khi mở)
│ ▓▓ nét tô quét ▓▓          │
├───────────────────────────┤
│ C2  "Tụi mình cưới nè!"    │ 100svh
│ C3  Hai người que          │ 110svh
│ C4  Truyện 3 khung         │ 150svh
│ ▓▓ nét tô quét ▓▓          │  60svh (ghim, scrub)
│ C5+C11 Ngày + lịch tô màu  │ 120svh
│ C12 Lịch trình cầu vồng    │ 100svh
│ C6+C7 Đường tới tiệc       │ 140svh
│ C13 Hộp sáp dress code     │  70svh
│ ▓▓ nét tô quét ▓▓          │  60svh
│ C8  Bảng dán ảnh           │ 150svh
│ C16 Cát-sét                │  50svh
│ C14+C15 Phiếu bé ngoan     │ 140svh
│ C10 Chữ ký + tô trái tim   │ 100svh
└───────────────────────────┘
```

Chiều rộng nội dung: `w-[min(92vw,480px)]` căn giữa. Hai bên lề (desktop) có hình vẽ trang trí rải rác: mây, chim chữ "v", ngôi sao, xoay nhẹ theo cuộn. Bố cục bên trong mỗi section **cố tình lệch** (không căn giữa hoàn hảo): tiêu đề lệch trái, ảnh lệch phải, như trẻ vẽ.

---

## 5. Chi tiết từng section

### C1 · Ngôi nhà + mặt trời

**Wireframe (360px):**
```
┌────────────────────────────┐
│  \ | /                     │
│ ─(☀)─   ← mặt trời vàng,   │  ← nút mở (88×88), mặt cười
│  / | \    tia xoay          │
│                  ~ ~  mây  │
│        /\                  │
│       /  \                 │  ← nhà mái tam giác, cửa sổ ô vuông
│      |▢  ▢|                │
│      | ▯  |   웃 웃         │  ← 2 người que nắm tay
│ ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │  ← cỏ xanh
│   Quân  ♥  Hà              │  ← Mali 32px, tên gọi
│  ↖ bấm vào ông mặt trời    │  ← Itim 15px + mũi tên vẽ tay
│    đi nè!                  │
└────────────────────────────┘
```
**Nội dung:** tên **gọi** (từ cuối cùng) `{groom}` ♥ `{bride}` — ở màn mở dùng tên ngắn cho dễ thương; tên đầy đủ ở C2. Dòng hướng dẫn *"Bấm vào ông mặt trời đi nè!"*. Mặt trời là `<button aria-label="Mở thiệp mời">`.

**Animation vào (tổng ≈ 3s, nút bấm được ngay từ 0s):**
| t | Hành động |
|---|---|
| 0.0s | Mặt đất (cỏ) A6 vẽ trái → phải (0.5s) |
| 0.4s | Nhà: tường → mái → cửa → cửa sổ, mỗi nét A6 0.3s nối tiếp |
| 1.4s | Hai người que A6 (đầu tròn → thân → tay nắm nhau), 0.6s |
| 1.8s | Mặt trời pop `scale 0 → 1` `back.out(2)` 0.4s, tia A6 |
| 2.2s | Tên pop từng chữ cái (`y: 20 → 0`, `rotate` ngẫu nhiên ±6°, stagger 0.05, `back.out(2)`) |
| 2.6s | Dòng hướng dẫn + mũi tên A6 |
| lặp | Tia mặt trời xoay `rotate 360` 12s `linear`; mặt trời "nhún" `scale 1 ↔ 1.06` 0.8s |

**Khi bấm (tổng 1.4s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Mặt trời nháy mắt (path mắt phải `scaleY 1 → 0.1 → 1`, 0.25s) |
| 0.2s | **Nét tô quét** (xem 9.3): nét sáp hồng zigzag dày chạy từ trên-trái xuống dưới-phải phủ kín màn (0.7s) |
| 0.9s | C1 ẩn phía sau; nét tô bị "tẩy" (DrawSVG `0% 100% → 100% 100%`, 0.5s) để lộ C2 |
| 1.4s | Mở khoá cuộn |

**Reduced-motion:** hình vẽ hiện ngay (không A6), bấm → crossfade 0.3s.
**Edge case:** tên gọi dài > 10 ký tự → cỡ 24px. Tên chỉ có 1 từ → dùng nguyên tên.

---

### C2 · "Tụi mình cưới nè!"

```
┌────────────────────────────┐
│  Tụi mình cưới nè! ✦       │  ← Mali 26px, gạch chân A6
│  ~~~~~~~~~~~~~             │
│        ┌~~~~~~~~~~~~~┐     │  ← khung nguệch ngoạc hồng
│        │  images[0]  │     │    xoay 2°, băng keo 2 góc
│        │  ảnh bìa    │     │
│        └~~~~~~~~~~~~~┘     │
│  Minh Quân                 │  ← Mali 40px, xoay -2°
│      &                     │  ← "&" là trái tim tô hồng
│        Thu Hà              │
│  Thứ Bảy, 14.11.2026 ☺     │  ← Itim 18px, `date` ⚠️
└────────────────────────────┘
```
**Nội dung:** *"Tụi mình cưới nè!"*, tên đầy đủ, ngày. Dòng nhỏ dưới ngày: *"Nhớ tới chơi nha!"*
**Animation:** khung A6 vẽ (0.6s, 2 lượt lệch) → ảnh pop `scale 0.8 → 1` `back.out(2)` → băng keo "dán" (`scaleX 0 → 1` từ trái, 0.2s). Tên pop từng chữ. Trái tim "&" tô bằng mảng zigzag A6.

---

### C3 · Hai người que

```
┌────────────────────────────┐
│  Đây là tụi mình nè ↓      │
│ ┌~~~~~~┐        ┌~~~~~~┐   │
│ │img[1]│        │img[2]│   │  ← ảnh xoay -3° / +3°
│ └~~~~~~┘        └~~~~~~┘   │
│   웃 ─── ♥ ───  웃          │  ← 2 người que, tay nối bằng nét
│ Chú rể:          Cô dâu:   │
│ Minh Quân        Thu Hà    │  ← Mali 22px
│ Nhà ở:           Nhà ở:    │
│ Quận 1, TP.HCM   Ba Đình,  │  ← Itim 16px, địa chỉ
│                  Hà Nội    │
│ (vẽ nhà nhỏ ⌂ cạnh địa chỉ)│
└────────────────────────────┘
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️: nếu có → dòng "Con của ba … & mẹ …" (giọng thân mật); không có → bỏ.
**Animation:** ảnh pop so le 0.15s. Người que A6; nét nối tay có trái tim pop khi nét chạm giữa.
**Edge case:** < 340px → 1 cột, người que ẩn. Địa chỉ tối đa 3 dòng.

---

### C4 · Truyện 3 khung

**Mục đích:** chuyện tình kể như truyện tranh thiếu nhi 3 khung, mỗi khung 1 ảnh + 1 câu.

```
┌────────────────────────────┐
│  Chuyện tụi mình           │
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ ① images[3]            │ │
│ │ "Gặp nhau, ngại quá    │ │
│ │  trời ☺"               │ │
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
│          ↓ (mũi tên vẽ)    │
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ ② images[4]  "Thương"  │ │
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
│          ↓                 │
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ ③ images[5]  "Cưới!"   │ │
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
└────────────────────────────┘
```
**Nội dung (viết sẵn):**
1. *"Ngày đầu gặp nhau, ngại quá trời."*
2. *"Rồi tự nhiên thấy thương, thương hoài không hết."*
3. *"Thế là quyết định: cưới thôi!"*

**Animation:** mỗi khung khi vào viewport: khung A6 (0.5s) → ảnh pop → câu chữ hiện từng từ (stagger 0.06). Mũi tên giữa các khung A6 theo scrub. Số ①②③ là vòng tròn tô vàng.

---

### Nét tô quét (chuyển cảnh, dùng 3 lần)

```
┌────────────────────────────┐
│ ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱  │  ← path zigzag dày 80px (mobile)
│ ╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲  │    màu thay phiên: hồng → xanh → vàng
│ ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱  │    phủ kín viewport
└────────────────────────────┘
```
**Timeline (ghim 60svh, scrub):**
| progress | Hành động |
|---|---|
| 0 → 0.5 | Path zigzag DrawSVG `0% → 100%` — màn hình bị tô dần tới kín |
| 0.5 | Section trước ẩn (`opacity 0`), section sau đã nằm phía sau |
| 0.5 → 1 | DrawSVG `0% 100% → 100% 100%` — nét bị "tẩy" từ đầu, lộ section sau |

Path: 1 polyline zigzag ngang, `viewBox 0 0 100 100`, `preserveAspectRatio="none"`, `stroke-width` tính sao cho các lượt chồng nhau (≈ 14 lượt trên mobile), `vector-effect="non-scaling-stroke"`. Có filter `crayon` để mép nét lởm chởm.
**Reduced-motion:** bỏ hoàn toàn, section nối tiếp bình thường.

---

### C5 + C11 · Ngày cưới + lịch tô màu

```
┌────────────────────────────┐
│  Đánh dấu lịch nha! ✎      │
│      ╭~~~~~~~╮             │
│     (   14    )            │  ← vòng tròn tô hồng quanh số
│      ╰~~~~~~~╯             │
│    Tháng Mười Một 2026     │
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │  ← lịch kẻ tay, ô méo nhẹ
│ │  9 10 11 12 13 ♥ 15    │ │  ← ngày cưới là trái tim tô đỏ hồng
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
│  Còn:  45  06  12  33      │  ← mỗi số trong 1 bong bóng màu khác
│       ngày giờ phút giây   │
└────────────────────────────┘
```
**Nội dung:** tháng chữ tiếng Việt viết thường ("Tháng Mười Một"), tuần từ Thứ Hai, đếm ngược `date` ⚠️. Đã qua → *"Tụi mình cưới rồi nè! Cảm ơn nha ♥"*.
**Animation:** vòng tròn quanh số 14 A6 **2 vòng** không khép kín (như tay vẽ). Lưới lịch: đường kẻ A6 nhanh 0.4s; các số pop stagger 0.01. Trái tim tô bằng zigzag A6. Đếm ngược: thay A7 bằng **"pop" mỗi khi số đổi** (`scale 1.25 → 1`, `back.out(3)`, 0.3s) — hợp phong cách hơn lật số.

---

### C12 · Lịch trình cầu vồng

```
┌────────────────────────────┐
│  Hôm đó tụi mình sẽ...     │
│     ╭─────────────╮        │  ← cầu vồng 4 dải màu sáp
│   ╭─┼─────────────┼─╮      │     mỗi dải là 1 mốc
│  ╭┼─┼─────────────┼─┼╮     │
│  ││ │             │ ││     │
│ ① 17:00 Đón khách (ly)     │
│ ② 18:00 Làm lễ (nhẫn)      │
│ ③ 18:30 Ăn thiệt no (đĩa)  │
│ ④ 20:00 Quẩy! (nốt nhạc)   │
└────────────────────────────┘
```
**Nội dung (viết sẵn, giọng vui):** đón khách, làm lễ, *"Ăn thiệt no"* (khai tiệc), *"Quẩy!"* (giao lưu). Giờ suy ra từ `date` như letter-2d; mặc định tiệc 18:00.
**Animation:** 4 dải cầu vồng A6 lần lượt (0.4s mỗi dải, trái → phải) theo scrub; mỗi dải vẽ xong thì dòng tương ứng pop.

---

### C6 + C7 · Đường tới tiệc

```
┌────────────────────────────┐
│  Đường tới tiệc nè →       │
│  ⌂ nhà gái ┄┄┄┄┄┄┄┄ 🏰     │  ← nét đứt vẽ tay từ nhà tới "lâu đài"
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ Lễ rước dâu 08:00      │ │
│ │ {bride.address}        │ │
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │ Tiệc cưới 18:00        │ │
│ │ {venue.name}           │ │
│ │ ┌────────────────────┐ │ │
│ │ │ <MapEmbed/> 1:1    │ │ │  ← viền nguệch ngoạc vẽ đè lên mép
│ │ └────────────────────┘ │ │
│ │ [ Chỉ đường giùm! ]    │ │  ← nút pink-deep, viền sáp
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
└────────────────────────────┘
```
"Lâu đài" là icon nhà hàng vẽ tay (không dùng emoji). Nét đứt A6 theo scrub. Khung A6 + pop. `MapEmbed` mount khi gần viewport; khung SVG nguệch ngoạc đè lên mép iframe với `pointer-events-none`.

### C13 · Hộp sáp dress code

```
┌────────────────────────────┐
│  Mặc gì cũng được, nhưng   │
│  tụi mình thích mấy màu này│
│  ▮  ▮  ▮  ▮  ▮             │  ← 5 cây sáp đứng trong hộp
│ hồng xanh vàng trắng be    │
└────────────────────────────┘
```
Màu: `#FF6B9A #4EA8DE #FFD23F #FFFFFF #EADBC8`. Mỗi cây sáp `y: 40 → 0` `back.out(2)` stagger 0.08, như rút lên khỏi hộp.

---

### C8 · Bảng dán ảnh

```
┌────────────────────────────┐
│  Ảnh tụi mình (bấm để xem  │
│  to nha)                   │
│  ┌~~~~~┐ ┌~~~~~┐           │  ← lưới 2 cột lệch, mỗi ảnh
│  │img3 │ │img4 │           │    xoay ngẫu nhiên ±5°,
│  └~~~~~┘ └~~~~~┘ ┌~~~~~┐   │    băng keo vàng ở góc
│   ┌~~~~~┐        │img0 │   │
│   │img5 │        └~~~~~┘   │
│   └~~~~~┘                  │
│   ✦ sticker sao rải rác    │
└────────────────────────────┘
```
Ảnh `images[3]`, `[4]`, `[5]`, `[0]` (4 ảnh). Góc xoay cố định theo index (không random mỗi lần render để tránh lệch SSR/CSR): `[-4, 3, -2, 5]`.
**Hành vi:** bấm → A10 lightbox; trong lightbox khung nguệch ngoạc vẽ lại quanh ảnh lớn. Mỗi ảnh "dán" khi vào viewport: rơi `y: -30`, `rotate 0 → góc`, `back.out(2)`, băng keo dán sau 0.15s.
**Accessibility:** ảnh là `<button>`, `alt="Ảnh cưới 1/4"`; lightbox Esc / ←→.

### C16 · Cát-sét

```
┌────────────────────────────┐
│  ┌~~~~~~~~~~~~~~~~~~┐      │
│  │ (◎)  ▭▭▭  (◎)    │      │  ← băng cát-sét vẽ tay, 2 bánh xe quay
│  │ "Bài của tụi mình"│      │     khi đang phát
│  └~~~~~~~~~~~~~~~~~~┘      │
│      [ ▶ Bấm nghe nè ]     │
└────────────────────────────┘
```
Đồng bộ `MusicPlayer`. Bánh xe `rotate` liên tục khi phát (GSAP tween `repeat: -1`, pause khi dừng). Reduced-motion: bánh xe đứng yên.

---

### C14 + C15 · Phiếu bé ngoan

**Mục đích:** RSVP + mừng cưới trình bày như "phiếu bé ngoan" ở trường mẫu giáo.

```
┌────────────────────────────┐
│ ┌~~~~~~~~~~~~~~~~~~~~~~~~┐ │
│ │  ★ PHIẾU BÉ NGOAN ★    │ │  ← Mali 24px, sao vàng hai bên
│ │  Tên bạn: ____________ │ │  ← input chỉ gạch chân sáp
│ │  ☐ Mình sẽ tới!        │ │  ← checkbox vẽ tay, bấm → dấu ✓
│ │  ☐ Tiếc quá, mình bận  │ │     sáp A6
│ │  Đi mấy người: (1)(2)(3)│ │  ← 3 nút tròn, chọn → tô hồng
│ │  [ Nộp phiếu ]         │ │
│ │  Bản xem thử — phiếu   │ │
│ │  không được gửi đi.    │ │
│ └~~~~~~~~~~~~~~~~~~~~~~~~┘ │
│  Lì xì cho tụi mình nè:    │
│  ┌~~~~┐ ┌~~~~┐            │  ← 2 QR ⚠️ trong "phong bao" vẽ tay
│  │ QR │ │ QR │            │
│  └~~~~┘ └~~~~┘            │
└────────────────────────────┘
```
**Hành vi:** bấm "Nộp phiếu" → con dấu tròn "10 ĐIỂM" màu `pink-deep` đập xuống phiếu (`scale 1.8 → 1`, `rotate -15°`, 0.25s + rung), hiện *"Cảm ơn {tên}! Được 10 điểm nha ♥"*. Không gửi dữ liệu. Radio/checkbox thật (`<input>` ẩn trực quan, `peer`), vùng bấm ≥ 44px. QR bấm → A10, chú thích *"Mã QR minh hoạ"*.

---

### C10 · Chữ ký + tô trái tim

```
┌────────────────────────────┐
│ ┌~~~~~~~~~~~~~~~~┐         │
│ │ images[n-1]    │         │
│ └~~~~~~~~~~~~~~~~┘         │
│  Cảm ơn mọi người nhiều    │
│  lắm lắm!                  │
│    ♡  ← chạm để tô         │  ← trái tim viền, 96px
│  Ký tên: Quân & Hà ✎       │  ← chữ ký A6
└────────────────────────────┘
```
**Hành vi:** trái tim chỉ có viền; mỗi lần chạm → thêm 1 lượt zigzag tô (A6 0.3s, màu luân phiên hồng/xanh/vàng), sau 3 lượt trái tim "đầy" và pop + 6 ngôi sao nhỏ bắn ra (A8 rút gọn, 6 hạt, tắt khi reduced-motion). Không chạm thì khi cuộn tới cuối trang, trái tim tự tô 1 lượt.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa; lặp lại trong C8 | 4:5 |
| `images[1]` | C3 chú rể | 1:1 |
| `images[2]` | C3 cô dâu | 1:1 |
| `images[3..5]` | C4 ba khung truyện; lặp lại trong C8 | 4:3 |
| `images[5]` (= `n-1`) | C10 ảnh cuối | 4:5 |

`meta.media = { images: 6, videos: 0 }`

⚠️ C1 không dùng ảnh (hình vẽ tay). Ảnh bìa xuất hiện ngay ở C2 sau khi mở.

---

## 7. Asset cần chuẩn bị
- [ ] SVG vẽ tay (vẽ trực tiếp bằng path đơn nét, **không** fill, để A6 vẽ được): nhà, mặt trời + tia, mây, cỏ, 2 người que, trái tim, mũi tên (3 kiểu), ngôi sao, lâu đài, 4 icon lịch trình, cát-sét, 5 cây sáp, phong bao
- [ ] 4 path khung nguệch ngoạc (tỉ lệ 1:1, 4:3, 4:5, ngang) — co giãn bằng `preserveAspectRatio="none"` + `vector-effect="non-scaling-stroke"`
- [ ] `crayon-filter.tsx` (filter SVG dùng chung)
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 6 ảnh mẫu tươi sáng, nhiều màu ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: nhà + mặt trời + người que + tên
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Nút mặt trời bấm được ngay từ giây 0, không phải chờ hình vẽ xong
- [ ] Không chữ nào dùng `pink`/`blue`/`yellow`/`green` làm màu chữ (chỉ `*-deep`, `ink`)
- [ ] Filter `crayon` không làm tụt fps: số phần tử có filter đang animate cùng lúc ≤ 6; nếu tụt < 50fps trên mobile, bỏ `feDisplacementMap` khi đang animate và bật lại khi xong
- [ ] Nét tô quét phủ kín 100% viewport ở 360×740 và 1440×900 (không lộ khe)
- [ ] Góc xoay ảnh ổn định giữa SSR và client (không có hydration warning)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/crayon-2d/
├── meta.ts
├── layout.tsx                 # Mali (400,600,700) + Itim (400), vietnamese
├── page.tsx                   # return <CrayonInvite />
└── _components/
    ├── crayon-invite.tsx      # "use client" — tokens `t`, ghép section
    ├── crayon-filter.tsx      # <svg> ẩn chứa filter #crayon, render 1 lần
    ├── doodle.tsx             # <Doodle d=… color=… delay=…/> — path tự vẽ khi vào viewport
    ├── scribble-frame.tsx     # khung nguệch ngoạc 2 lượt quanh children
    ├── scribble-wipe.tsx      # chuyển cảnh nét tô quét (C1 dùng bản time-based, còn lại scrub)
    ├── sections/
    │   ├── house-gate.tsx     # C1
    │   ├── hello.tsx          # C2
    │   ├── stick-couple.tsx   # C3
    │   ├── comic-story.tsx    # C4
    │   ├── date.tsx           # C5 + C11
    │   ├── rainbow.tsx        # C12
    │   ├── directions.tsx     # C6 + C7
    │   ├── crayon-box.tsx     # C13
    │   ├── photo-board.tsx    # C8
    │   ├── cassette.tsx       # C16
    │   ├── good-kid-card.tsx  # C14 + C15
    │   └── heart-sign.tsx     # C10
    └── svg/paths.ts           # hằng `d` của mọi hình vẽ
```

### 9.2 Tokens
```ts
export const t = {
  root: "relative min-h-svh overflow-x-clip bg-[#FFFDF8] text-[#333333] font-(family-name:--font-body) text-lg",
  display: "font-(family-name:--font-display) font-bold",
  title: "font-(family-name:--font-display) font-semibold text-[26px] sm:text-[34px]",
  pink: "text-[#C93A6B]",
  blue: "text-[#1F6FA8]",
  soft: "text-[#6B6B6B]",
  btn: "relative inline-flex h-12 items-center px-6 font-(family-name:--font-display) font-semibold text-white bg-[#C93A6B] rounded-[1.5rem_1.2rem_1.6rem_1.1rem] -rotate-1 active:scale-95 transition-transform",
  tape: "absolute h-6 w-16 bg-[#FFD23F]/60 rotate-[-8deg]",
} as const;
```
Nút có `rounded` 4 góc khác nhau để trông méo tay, không cần SVG.

### 9.3 Doodle và nét tô quét
```tsx
// doodle.tsx
export function Doodle({ d, color = "#333", width = 4, delay = 0, trigger = true }: Props) {
  const ref = useRef<SVGPathElement>(null);
  useGSAP(() => {
    if (reduced) return;
    gsap.from(ref.current, {
      drawSVG: "0%", duration: 0.5, delay, ease: "power1.inOut",
      scrollTrigger: trigger ? { trigger: ref.current, start: "top 85%", once: true } : undefined,
    });
  }, { dependencies: [reduced] });
  return <path ref={ref} d={d} stroke={color} strokeWidth={width} fill="none"
    strokeLinecap="round" strokeLinejoin="round" filter="url(#crayon)" vectorEffect="non-scaling-stroke" />;
}

// scribble-wipe.tsx (bản scrub)
gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=60%", pin: true, scrub: true } })
  .fromTo(".wipe", { drawSVG: "0% 0%" }, { drawSVG: "0% 100%", ease: "none" })
  .set(".wipe-prev", { opacity: 0 })
  .to(".wipe", { drawSVG: "100% 100%", ease: "none" });
```
Bản C1 dùng cùng path nhưng `gsap.timeline()` thường (0.7s + 0.5s), gọi `onOpened` ở cuối.

### 9.4 Pop chữ
Dùng `SplitText` (`type: "chars"`), `gsap.from(chars, { y: 20, rotate: () => gsap.utils.random(-6, 6), scale: 0.6, opacity: 0, stagger: 0.05, ease: "back.out(2)", duration: 0.4 })`. Góc random chỉ dùng cho tween (chạy trên client), không render vào HTML nên không lệch SSR.

### 9.5 Logic cần test
- `nickname(fullName)`: "Nguyễn Minh Quân" → "Quân"; 1 từ → giữ nguyên; khoảng trắng thừa được bỏ.
- `scheduleTimes(date)`, lưới lịch tuần bắt đầu Thứ Hai.
- `heartFill` reducer: 0 → 1 → 2 → 3 (đầy), chạm thêm không vượt 3.
File: `crayon-2d/_components/nickname.test.ts`, `heart.test.ts`.

### 9.6 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens, `crayon-filter.tsx`
2. Vẽ `svg/paths.ts` (tốn thời gian nhất — làm sớm), `Doodle`, `ScribbleFrame`
3. Các section tĩnh, khớp wireframe ở 360 / 1440
4. C1 vẽ nhà + mở bằng nét tô quét + nhạc
5. `scribble-wipe` bản scrub ×3, đo fps với filter
6. Pop chữ, lịch, cầu vồng, bảng ảnh, phiếu bé ngoan, trái tim
7. Reduced-motion, tên dài, hydration check
8. Checklist template-spec §12
