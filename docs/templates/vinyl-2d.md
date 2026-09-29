# 2D-14 · `vinyl-2d` · Đĩa Than 70s

> **Design Read:** Đọc là thiệp cưới dạng album đĩa than cho cặp đôi mê nhạc retro, ngôn ngữ bìa giấy kem, cam đất cháy và đĩa vinyl, nghiêng về mỹ học 70s warm-analog, nhịp chậm có chủ đích.
>
> **Dials:** `DESIGN_VARIANCE 7/10` · `MOTION_INTENSITY 5/10` · `VISUAL_DENSITY 3/10`.

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Thiệp cưới là một **album đĩa than thập niên 70** của hai người: mở bìa, đĩa trượt ra và bắt đầu quay, rồi mỗi phần của thiệp là một **track** trong tracklist — kim đĩa dịch dần vào trong theo tiến độ cuộn.

**Cảm xúc muốn gợi:** hoài cổ, ấm, "có groove", vui mà vẫn có gu. Nhạc là nhân vật chính chứ không phải nền.

**Phù hợp với:** cặp đôi mê nhạc, thích retro, tông ảnh ấm/film grain, tiệc có ban nhạc hoặc DJ.

**Khác các mẫu khác ở chỗ:**
- **Nhạc và hình gắn với nhau:** đĩa quay khi nhạc phát, dừng (có quán tính) khi tắt nhạc.
- **Thanh tiến độ là cần đĩa (tonearm):** cần đĩa nhỏ cố định ở mép trái, kim chạy từ rìa ngoài vào nhãn giữa khi cuộn từ đầu tới cuối trang — giống đĩa thật.
- Chuyển cảnh giữa các track là **"rãnh im lặng"**: một dải sọc đồng tâm tối ngăn cách, số track lật như bộ đếm cơ (T1 + A7).
- Album ảnh là **thùng đĩa (crate digging)**: lật qua từng bìa đĩa, bấm để rút bìa lên xem.

**Moodboard:** bìa album funk/soul 70s, chữ Fraunces béo mềm, sọc cam–nâu–mù tạt, sunburst tròn, mâm đĩa gỗ, nhãn đĩa tròn in chữ, vết mòn vòng tròn trên bìa, giấy ngả vàng.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#F2E3C6` | Nền trang (giấy bìa ngả vàng) |
| `surface` | `#FFF4DC` | Nền khối nội dung, nhãn đĩa |
| `orange` | `#D35400` | Sọc 70s, nhãn đĩa, nền khối lớn (chỉ với chữ lớn) |
| `orange-deep` | `#A84300` | Nút, chữ nhấn cỡ nhỏ trên nền sáng |
| `mustard` | `#E1A730` | Sọc thứ 2, sticker |
| `brown` | `#6D4C41` | Sọc thứ 3, gỗ mâm đĩa |
| `vinyl` | `#1B1512` | Đĩa than, rãnh im lặng |
| `text` | `#3E2723` | Chữ chính |
| `text-soft` | `#6D4C41` | Chữ phụ |

Tương phản: `text` trên `surface` khoảng 13:1 ✅. `text-soft` trên `surface` khoảng 7.3:1 ✅. Chữ trắng trên `orange` chỉ khoảng 3.9:1 → **chỉ dùng cho chữ ≥ 24px đậm** (đạt AA large). Chữ trắng trên `orange-deep` khoảng 5.4:1 ✅ → dùng cho nút và chữ nhỏ. `surface` trên `vinyl` khoảng 17:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi / tên album | Fraunces 900, `opsz` lớn, `[font-variation-settings:'SOFT'_100,'WONK'_1]` | 52px / 0.95 | 96px | Chữ béo mềm kiểu 70s, tracking -0.02em |
| Tiêu đề track | Fraunces 700 italic | 28px | 40px | "Track 03 — Ngày ấy" |
| Số track | Space Grotesk 700, tabular | 64px | 96px | Bộ đếm lật |
| Nội dung | Space Grotesk 400 | 16px / 1.6 | 18px | |
| Nhãn nhỏ | Space Grotesk 500, VIẾT HOA, tracking 0.15em | 12px | 13px | "SIDE A · 33⅓ RPM" |

Cả hai có subset `vietnamese`. Fraunces là variable font: khai báo `axes: ["SOFT", "WONK", "opsz"]` trong `next/font`. Kiểm dấu chồng ở 900: *"Nguyễn Thị Hằng"* cần `leading-[1.05]` tối thiểu với chữ có dấu 2 tầng.

### Hình khối và chất liệu
- **Đĩa than**: `rounded-full` + `repeating-radial-gradient(circle, #1B1512 0 2px, #2A221E 2px 3px)` (rãnh) + 1 lớp `conic-gradient` trắng alpha 0.08 làm vệt phản sáng (**lớp phản sáng không xoay** khi đĩa quay → cảm giác thật). Nhãn giữa `surface`/`orange` 36% đường kính.
- **Sọc 70s**: 3 dải `orange` / `mustard` / `brown` bo tròn (`rounded-full`) uốn cong theo góc — dùng cho header mỗi track.
- **Khối nội dung**: `rounded-[2rem]`, nền `surface`, không viền, bóng mềm `shadow-[0_12px_0_-4px_#6D4C41]` (bóng khối lệch kiểu retro).
- **Ảnh**: tròn (`rounded-full`, như nhãn đĩa) hoặc vuông "bìa album" có vết mòn tròn (`radial-gradient` ring alpha 0.12 phủ lên).
- **Grain**: SVG `feTurbulence` opacity 0.06 phủ toàn trang.
- **Motion**: ease `power2.out`; mọi thứ tròn thì xoay. Vào 0.7s. Nhịp stagger 0.14s ≈ 1/4 phách ở 105 BPM (cho cảm giác "theo nhạc").

---

## 3. Nhạc

- **Tâm trạng**: funk/soul 70s, bass groove, kèn, có thể có tiếng nổ lách tách của đĩa than, không lời.
- **Tempo**: 95–110 BPM. **Độ dài**: 2:30–3:30, lặp.
- **Từ khoá Pixabay**: `70s funk soul groove`, `retro soul vinyl`, `disco funk instrumental`
- **Hành vi**:
  - Bắt đầu khi bấm "Đặt kim" (C1), fade 0 → 0.6 trong 1.5s — trùng lúc kim chạm đĩa.
  - **Gắn với đĩa**: `play` → đĩa tăng tốc 0 → 33⅓ vòng/phút trong 0.8s; `pause` → giảm về 0 trong 1.2s. Áp dụng cho đĩa C1 (đã trượt ra) và đĩa nhỏ ở mép trái.
  - Bấm vào đĩa nhỏ ở mép trái cũng bật/tắt nhạc (nút thứ hai, cùng trạng thái với nút nổi chung).
  - Ẩn tab: dừng nhạc → đĩa dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Bìa album + đĩa lấp ló │ 100svh  (cố định tới khi mở)
├───────────────────────────┤
│ C2  SIDE A · tên + tracklist│ 110svh
│ ─── rãnh im lặng ───       │  12svh
│ Track 01 · C3 Hai gia đình │ 100svh
│ ─── rãnh ───               │
│ Track 02 · C4 Chuyện tình  │ 150svh
│ ─── rãnh ───               │
│ Track 03 · C5+C11 Ngày cưới│ 110svh
│ ─── rãnh ───               │
│ Track 04 · C12+C6 Chương trình│ 110svh
│ ─── rãnh ───               │
│ Track 05 · C7 Địa điểm      │ 110svh
│ ─── rãnh ───               │
│ Track 06 · C8 Thùng đĩa     │ 130svh
│ ─── rãnh ───               │
│ Bonus · C13+C14+C15        │ 150svh
│ C10 SIDE B — The End       │ 100svh
└───────────────────────────┘
Cố định suốt trang (sau khi mở): đĩa nhỏ 64px + cần đĩa ở MÉP TRÁI, GIỮA DỌC.
```

Cột nội dung `min(90vw, 480px)`; trên mobile lùi phải 16px so với tâm để không đè đĩa nhỏ (đĩa chỉ lộ 60% ra ngoài mép trái: `-translate-x-[40%]`). Desktop: cột nội dung giữa, đĩa nhỏ lớn hơn (120px) ở mép trái.

---

## 5. Chi tiết từng section

### C1 · Bìa album (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ┌──────────────────────┐   │
│ │≋≋ sọc cam/vàng/nâu ≋≋│◖  │  ← bìa vuông, đĩa lấp ló mép phải
│ │                      │◖  │
│ │  images[0] tròn      │◖  │  ← ảnh cắt tròn giữa bìa
│ │                      │◖  │
│ │ MINH QUÂN            │◖  │  ← Fraunces 900 34px
│ │  & THU HÀ            │   │
│ │ "Chung Một Giai Điệu"│   │  ← tên album, italic
│ └──────────────────────┘   │
│   SIDE A · 33⅓ RPM · 2026  │
│   ┌────────────────────┐   │
│   │  ● Đặt kim, bật    │   │  ← nút orange-deep chữ trắng, 52px
│   │    nhạc!           │   │
│   └────────────────────┘   │
└────────────────────────────┘
```

**Nội dung:** `{groom.name}` & `{bride.name}` · tên album viết sẵn *"Chung Một Giai Điệu"* · "SIDE A · 33⅓ RPM · {năm của date ⚠️}".

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Bìa `rotate -6 → -2`, `y: 30 → 0` (0.7s) |
| 0.3s | 3 dải sọc vẽ từ trái (`scaleX 0 → 1`, stagger 0.14) |
| 0.6s | Tên A2 `chars`, stagger 0.03 |
| 1.0s | Đĩa lấp ló `x: -20 → 0` (nhú ra thêm) |
| lặp | Đĩa lấp ló nhích ra-vào `x ±6` (A12, 2.2s) mời bấm |

**Khi bấm (tổng 2.4s):**
| t | Hành động |
|---|---|
| 0.0s | Đĩa trượt hẳn ra khỏi bìa sang phải `xPercent 0 → 60` (0.7s), bìa lùi trái `xPercent -30` |
| 0.7s | Cần đĩa (SVG, gốc ở góc phải trên của đĩa nhưng **dưới vùng nút nhạc 64px**) xoay `rotate -30° → 0` để kim chạm rìa đĩa (0.5s) |
| 1.2s | **Nhạc bắt đầu** (gọi `play()` ngay trong handler click lúc 0.0s nhưng `volume 0`, fade lên từ 1.2s — để không vi phạm autoplay) ; đĩa tăng tốc tới 33⅓ vòng/phút |
| 1.4s | Toàn cảnh `scale 1 → 0.2`, bay về vị trí đĩa nhỏ ở mép trái (Flip từ đĩa lớn sang đĩa nhỏ) (0.9s) |
| 2.3s | C2 vào; mở khoá cuộn |

**Reduced-motion:** không trượt/Flip; crossfade 0.3s; đĩa nhỏ vẫn xoay khi nhạc phát? **Không** — reduced-motion thì đĩa đứng yên, chỉ đổi icon ▶/❚❚ trên nhãn.
**Edge case:** tên dài > 22 ký tự → 26px, xuống dòng.

---

### Thành phần cố định: đĩa nhỏ + cần đĩa (tiến độ trang)

```
│◖◗  ← đĩa 64px, 60% lộ ra khỏi mép trái, giữa màn hình theo chiều dọc
│ ╲  ← cần đĩa: kim dịch từ rìa ngoài (progress 0) vào nhãn (progress 1)
```
- Quay: 1 tween `rotation: "+=360", duration: 1.8, repeat: -1, ease: "none"` (1.8s/vòng = 33⅓ vòng/phút); điều tốc bằng `gsap.to(spin, { timeScale: 1 | 0 })`.
- Kim: `rotation` của cần đĩa nội suy 0° → 22° theo progress toàn trang (`ScrollTrigger` trên `#smooth-content`, `scrub: true`).
- Là `<button aria-label="Bật/tắt nhạc" aria-pressed>`, vùng bấm 64×64.
- Ẩn ở C1 và khi lightbox mở.

---

### Rãnh im lặng (chuyển giữa các track)

```
┌────────────────────────────┐
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  ← dải vinyl 12svh, rãnh đồng tâm mờ
│        ▸ TRACK 03          │  ← bộ đếm lật "02" → "03"
│░░░░░░░░░░░░░░░░░░░░░░░░░░░░│
└────────────────────────────┘
```
**Animation:** khi dải đi qua giữa màn hình (`top center`), số track lật A7 (`rotateX` 0 → -90 số cũ, 90 → 0 số mới, 0.4s). Gradient rãnh dịch `backgroundPosition` theo scrub (ảo giác đang quay). Là `aria-hidden`.

---

### C2 · SIDE A — Tên + tracklist

```
┌────────────────────────────┐
│ SIDE A                     │  ← nhãn
│  Minh Quân                 │  ← h1 Fraunces 900 52px, orange
│  & Thu Hà                  │
│ ≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋≋       │  ← 3 sọc
│ TRÂN TRỌNG KÍNH MỜI        │
│ Thứ Bảy · 14.11.2026 ⚠️     │
│ ┌────────────────────────┐ │
│ │ 01 Hai gia đình   3:12 │ │  ← tracklist = mục lục thật
│ │ 02 Chuyện tình    4:05 │ │     bấm 1 dòng → cuộn tới track đó
│ │ 03 Ngày cưới      2:48 │ │     (ScrollSmoother.scrollTo)
│ │ 04 Chương trình   3:30 │ │     "thời lượng" là trang trí, cố định
│ │ 05 Địa điểm       2:15 │ │
│ │ 06 Khoảnh khắc    3:57 │ │
│ │ ★  Bonus          1:40 │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** tên A2; tracklist A1 stagger 0.14 (nhịp 1/4 phách). Dòng tracklist hover/focus: nền `mustard` alpha 0.3.
**A11y:** tracklist là `<nav aria-label="Mục lục thiệp"><ol>` với `<a href="#track-01">`.

---

### Track 01 · C3 Hai gia đình

```
┌────────────────────────────┐
│ TRACK 01                   │
│ Hai gia đình               │  ← Fraunces italic 28px
│   ◯ images1    ◯ images2   │  ← 2 ảnh tròn như 2 nhãn đĩa 128px
│   (quay nhẹ khi vào)       │     có lỗ giữa giả (chấm vinyl 8px)
│  NHÀ TRAI      NHÀ GÁI     │
│  {groom.name}  {bride.name}│
│  {address}     {address}   │
└────────────────────────────┘
```
**Animation:** 2 ảnh lăn vào từ 2 bên `x: ∓100, rotate: ∓180 → 0` (0.9s, `power2.out`). Tên bố mẹ ⚠️ ẩn.

---

### Track 02 · C4 Chuyện tình ("3 đoạn điệp khúc")

```
┌────────────────────────────┐
│ TRACK 02 · Chuyện tình     │
│ ┌──────┐ Verse 1           │
│ │img3  │ "Em bật một bài   │  ← ảnh vuông bìa album + lời như lyrics
│ └──────┘  hát, anh hỏi tên"│
│ Verse 2          ┌──────┐  │
│ "Cùng nghe…"     │img4  │  │
│                  └──────┘  │
│ ┌──────┐ Điệp khúc         │
│ │img5  │ "Và rồi…"         │
│ └──────┘                   │
└────────────────────────────┘
```
**Lời viết sẵn (dạng lyrics, in nghiêng):**
- *Verse 1 — Gặp gỡ:* "Một bài hát vô tình, một câu hỏi bâng quơ: 'Bạn cũng thích bài này à?'"
- *Verse 2 — Thương nhau:* "Những chuyến xe, những playlist chung, những đêm hát sai lời mà vẫn cười."
- *Điệp khúc — Về chung nhà:* "Và rồi mình chọn nghe cùng một giai điệu — cho tới cuối đời."

**Animation:** mỗi đoạn: ảnh A3, lời A2 theo `lines` với "highlight karaoke": từng dòng đổi màu `text-soft → text` theo scrub (như lời bài hát đang chạy).

---

### Track 03 · C5 + C11 Ngày cưới

```
┌────────────────────────────┐
│ TRACK 03 · Ngày cưới       │
│   ╭──────────────╮         │
│   │  ◉ nhãn đĩa  │         │  ← đĩa lớn 240px, nhãn orange
│   │  14.11       │         │  ← "14.11" Fraunces 900 trên nhãn
│   │  2026        │         │
│   ╰──────────────╯         │
│  45 : 06 : 12 : 33         │  ← đếm ngược, Space Grotesk tabular
│  ngày giờ  phút giây       │
│ T2 T3 T4 T5 T6 T7 CN       │
│  … 12 13 (◉14) 15 …        │  ← ngày cưới trong đĩa mini
└────────────────────────────┘
```
**Animation:** đĩa lớn xoay 1 vòng rồi dừng khi vào view (`rotate -360 → 0`, 1.2s, `power2.out`) — đĩa này không gắn với nhạc (trang trí). Đếm ngược A7. Qua ngày: *"Bản nhạc đã bắt đầu — mình cưới rồi!"*

---

### Track 04 · C12 + C6 Chương trình ("Setlist")

```
┌────────────────────────────┐
│ TRACK 04 · Setlist         │
│ ┌────────────────────────┐ │  ← giấy setlist dán băng keo, xoay -1.5°
│ │ 08:00 Lễ vu quy        │ │
│ │       {bride.address}  │ │
│ │ 17:00 Đón khách        │ │
│ │ 18:00 Lễ thành hôn     │ │
│ │ 18:30 Khai tiệc        │ │
│ │ 20:00 Nhảy thôi! ★     │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** giờ từ `date` (−1h/0/+30′/+2h); vu quy 08:00 viết sẵn.
**Animation:** giấy trượt vào A1; mỗi dòng có gạch chân bút dạ vẽ A6 lần lượt; ★ `rotate 0 → 360` khi tới.

---

### Track 05 · C7 Địa điểm

```
┌────────────────────────────┐
│ TRACK 05 · Địa điểm        │
│  {venue.name}              │  ← Fraunces 700 24px
│ ┌────────────────────────┐ │
│ │ <MapEmbed>             │ │  ← khung bo 2rem, 4:3
│ └────────────────────────┘ │
│ [ ▶ Chỉ đường ]            │  ← nút orange-deep
└────────────────────────────┘
```
Mount `<MapEmbed>` khi còn cách 1 màn hình. Thiếu `venue.name` → "Nhà hàng tiệc cưới".

---

### Track 06 · C8 Thùng đĩa (album)

**Mục đích:** album tương tác kiểu lục thùng đĩa ở tiệm.

```
┌────────────────────────────┐
│ TRACK 06 · Khoảnh khắc     │
│   ┌─────────────────┐      │  ← bìa đang được "rút lên" (images[k])
│   │                 │      │
│   │    images[k]    │      │
│   └─────────────────┘      │
│ ╔═╤═╤═╤═╤═╤═╗              │  ← thùng gỗ: gáy các bìa còn lại xếp đứng
│ ║ │ │▌│ │ │ ║              │     (dải mỏng, mỗi dải = 1 ảnh, màu lấy từ
│ ╚═╧═╧═╧═╧═╧═╝              │      ảnh qua object-position lệch)
│  ◀  3 / 6  ▶               │
└────────────────────────────┘
```
**Hành vi:**
- Vuốt ngang trên thùng (GSAP `Observer`, `type: "touch,pointer"`, `onLeft/onRight`) hoặc bấm ◀ ▶ / phím mũi tên → gáy bìa kế tiếp nghiêng tới (`rotateX -25°`) rồi **rút lên** thành ảnh lớn (Flip giữa gáy và vị trí lớn, 0.6s); bìa cũ trượt về thùng.
- Bấm ảnh lớn → A10 lightbox.
- Ảnh lớn có `alt="Ảnh cưới k/6"`; nút ◀ ▶ 44px, `aria-label`.

**Reduced-motion:** không Flip, đổi ảnh bằng crossfade 0.2s.

---

### Bonus Track · C13 + C14 + C15

```
┌────────────────────────────┐
│ ★ BONUS TRACK              │
│ Dress code: Retro 70s nhẹ  │
│ Quần ống loe, hoa văn,     │
│ tông ấm là "đúng bài".     │
│  ● ● ● ●                   │  ← #D35400 #E1A730 #6D4C41 #FFF4DC(viền)
│ ── Mừng cưới ──            │
│ ◉QR⚠️ nhà trai  ◉QR⚠️ nhà gái│  ← QR đặt giữa nhãn đĩa tròn
│ ── Hồi âm ──               │
│ Tên [____________]         │
│ [Có mặt!] [Tiếc quá]       │  ← 2 nút toggle như phím máy hát
│ Số người [- 1 +]           │
│ [ Gửi ]                    │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** QR bấm phóng to (A10). Gửi → hiện *"Đã thêm {tên} vào danh sách khách mời của album!"*. Không gửi đi.
**Animation:** chấm màu xoay vào như đĩa nhỏ (`rotate 180 → 0`, stagger 0.14).

---

### C10 · SIDE B — The End

```
┌────────────────────────────┐
│ SIDE B — THE END           │
│    ◯ images[n-1] tròn 240px│  ← như nhãn đĩa
│  Cảm ơn bạn đã nghe trọn   │
│  album của tụi mình.       │
│   Minh Quân & Thu Hà       │  ← Fraunces 900
│  ℗ 2026 · Chung Một Giai Điệu│
└────────────────────────────┘
```
**Animation:** khi section chạm `bottom bottom`, kim cần đĩa nhấc lên (`rotate 22 → 30`, `y: -6`) và **đĩa nhỏ giảm tốc về 0 (timeScale → 0 trong 2s) nhưng nhạc vẫn phát** — cảm giác "hết mặt đĩa". Cuộn ngược lên thì kim hạ, đĩa quay lại nếu nhạc đang phát. Ảnh cuối xoay chậm 1 vòng rồi dừng.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C1 bìa (cắt tròn) | 1:1 |
| `images[1]`, `images[2]` | Track 01 (tròn) | 1:1 |
| `images[3..5]` | Track 02 lyrics | 1:1 |
| `images[3..8]` | Track 06 thùng đĩa (6 bìa) | 1:1 |
| `images[9]` (= `n-1`) | C10 | 1:1 |

`meta.media = { images: 10, videos: 0 }`. Toàn bộ ảnh vuông (bìa đĩa) → `object-cover aspect-square`, không lo tỉ lệ người dùng upload. Nếu giữ 6 ảnh như bản tóm tắt: thùng đĩa dùng `images[3..4]` quá ít → khuyến nghị 10.

`date` ⚠️ (năm trên bìa lấy từ `date`, fallback năm của ngày mẫu), tên bố mẹ ⚠️, QR ⚠️. Không dùng `birthYear`.

**Giả định về kit:** cần đọc trạng thái nhạc (`playing`) và gọi `toggle()` từ component mẫu. Nếu `@/kit` `MusicPlayer` chưa expose, cần một hook dùng chung `useMusic()` (thêm ở kit, không viết riêng trong mẫu) ⚠️.

## 7. Asset cần chuẩn bị
- [ ] SVG: cần đĩa (tonearm) có tâm xoay rõ, mâm đĩa, thùng gỗ, sticker ★, băng keo
- [ ] Đĩa và rãnh: gradient Tailwind (không ảnh)
- [ ] `music.mp3` (nên có tiếng lách tách vinyl ở đầu) + `CREDITS.md`
- [ ] 10 ảnh vuông tông ấm/film (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: bìa album + đĩa trượt ra 1/3
- [ ] `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] Tắt nhạc (nút chung hoặc bấm đĩa nhỏ) → đĩa giảm tốc và dừng ≤ 1.2s; bật lại → quay lại. Hai nút luôn cùng trạng thái
- [ ] Kim cần đĩa tỉ lệ đúng với tiến độ cuộn (đầu trang = rìa, cuối trang = nhãn)
- [ ] Tracklist C2 cuộn đúng tới từng track, dùng được bằng bàn phím
- [ ] Đĩa nhỏ không đè nội dung ở 360px và không nằm trong 3 góc dành riêng
- [ ] Thùng đĩa: vuốt, nút và phím mũi tên đều hoạt động
- [ ] Reduced-motion: đĩa đứng yên, không Flip, không scrub karaoke

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/vinyl-2d/
├── meta.ts                    # styles ["vintage","playful"], colors ["beige","red"], media {10,0}
├── layout.tsx                 # Fraunces (axes SOFT,WONK,opsz) + Space_Grotesk (vietnamese)
├── page.tsx
└── _components/
    ├── vinyl-invite.tsx       # "use client" — tokens t, SmoothScroll, ghép, id các track
    ├── album-gate.tsx         # C1: bìa, đĩa trượt, cần đĩa, Flip sang đĩa nhỏ
    ├── record.tsx             # <Record size spinning /> đĩa dùng chung (gradient + nhãn)
    ├── mini-deck.tsx          # đĩa nhỏ + tonearm cố định, gắn nhạc + progress
    ├── use-spin.ts            # hook: tween quay + điều tốc theo `playing`
    ├── groove-divider.tsx     # rãnh im lặng + số track lật
    ├── tracks/                # side-a, t01-families, t02-story, t03-date, t04-setlist,
    │                          # t05-venue, t06-crate, bonus, side-b
    ├── tracklist.ts           # mảng {no, id, title, duration} — nguồn chung cho C2 và divider
    └── tracklist.test.ts
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#F2E3C6] text-[#3E2723] font-(family-name:--font-body)",
  block: "rounded-[2rem] bg-[#FFF4DC] p-6 shadow-[0_12px_0_-4px_#6D4C41]",
  display: "font-(family-name:--font-display) font-black tracking-[-0.02em] [font-variation-settings:'SOFT'_100,'WONK'_1]",
  trackTitle: "font-(family-name:--font-display) font-bold italic",
  label: "text-xs font-medium uppercase tracking-[0.15em]",
  btn: "min-h-12 rounded-full bg-[#A84300] px-6 font-bold text-white",
  vinyl: "rounded-full bg-[repeating-radial-gradient(circle,#1B1512_0_2px,#2A221E_2px_3px)]",
  stripes: "h-3 rounded-full", // ghép bg-[#D35400] / bg-[#E1A730] / bg-[#6D4C41]
} as const;
```

### 9.3 Quay theo nhạc
```ts
// use-spin.ts
export function useSpin(ref: RefObject<HTMLElement>, playing: boolean, reduced: boolean) {
  const spin = useRef<gsap.core.Tween>(null);
  useGSAP(() => {
    spin.current = gsap.to(ref.current, { rotation: "+=360", duration: 1.8, ease: "none", repeat: -1 });
    spin.current.timeScale(0);
  }, { scope: ref });
  useGSAP(() => {
    if (!spin.current) return;
    gsap.to(spin.current, { timeScale: playing && !reduced ? 1 : 0, duration: playing ? 0.8 : 1.2, ease: "power2.out" });
  }, { dependencies: [playing, reduced] });
}
```
`playing` lấy từ `useMusic()` của kit ⚠️ (lắng nghe sự kiện `play`/`pause` của thẻ `<audio>`).

### 9.4 Cần đĩa theo tiến độ trang
```tsx
useGSAP(() => {
  gsap.fromTo(".tonearm", { rotation: 0 }, {
    rotation: 22, ease: "none", transformOrigin: "85% 10%",
    scrollTrigger: { trigger: "#smooth-content", start: "top top", end: "bottom bottom", scrub: true },
  });
}, { scope: root });
```

### 9.5 Thùng đĩa
- `Observer.create({ target: crateRef.current, type: "touch,pointer", onLeft: next, onRight: prev, tolerance: 20 })`.
- `next()`: `const state = Flip.getState([spine[k], hero]); swap; Flip.from(state, { duration: 0.6, ease: "power2.out", absolute: true })`.
- `keydown` ArrowLeft/Right trên container `tabIndex={0}`.

### 9.6 Logic cần test
- `tracklist.ts`: số track liên tục, `id` khớp `href` trong C2; `formatTrackNo(3) === "03"`.
- Tốc độ quay: `33⅓ rpm → 1.8s/vòng` là hằng số, ghi comment, không cần test.
- Giờ setlist từ `date` và lưới lịch: dùng helper chung nếu kit đã có.

### 9.7 Thứ tự làm
1. Khung file, tokens, font Fraunces axes → kiểm dấu ở weight 900
2. `record.tsx`, các track tĩnh + rãnh im lặng khớp wireframe
3. `album-gate.tsx` (không Flip trước) + nhạc
4. `use-spin.ts` + `mini-deck.tsx` gắn nhạc; tonearm theo cuộn
5. Flip từ đĩa lớn sang đĩa nhỏ ở C1
6. Karaoke C4, thùng đĩa C8, divider lật số
7. Reduced-motion, tên dài, Lighthouse
8. Checklist template-spec §12
