# 2D-08 · `swiss-2d` · Swiss Mono

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Thiệp cưới dàn trang như một tấm poster Thuỵ Sĩ: lưới 12 cột lộ rõ, chữ cực lớn cắt ra ngoài mép, chỉ đen–trắng và một màu đỏ, mỗi chương đánh số 01, 02, 03… như mục lục.

**Cảm xúc muốn gợi:** tự tin, hiện đại, rõ ràng. Không lãng mạn kiểu hoa lá mà lãng mạn kiểu "chúng tôi biết mình muốn gì".

**Phù hợp với:** cặp đôi làm thiết kế, kiến trúc, công nghệ; cưới tối giản, tiệc cocktail, ảnh cưới đen trắng hoặc tương phản cao.

**Khác các mẫu khác ở chỗ:**
- **Lưới 12 cột hiển thị thật** (đường kẻ mảnh) và được **vẽ dần** khi cuộn (A6). Mọi phần tử đặt đúng cột.
- **Cột mục lục chạy dọc** (sticky) bên trái hiện số chương hiện tại "03 / 10" và thanh tiến độ đỏ.
- Chuyển cảnh **T3 kiểu cứng**: panel sau trượt lên **che phủ toàn màn hình**, panel trước đẩy lên `-20%` **không thu nhỏ, không tối đi, không bóng** — cắt như lật trang poster. Khác hẳn chồng thiệp mềm của letter-2d.
- Không có hình minh hoạ, chỉ chữ, lưới, ảnh đen trắng và các khối màu.

**Moodboard:** poster Josef Müller-Brockmann, bảng giờ tàu SBB, Helvetica/Inter đen đậm, lịch dạng bảng, chấm đỏ tròn duy nhất trên trang.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#FFFFFF` | Nền panel sáng |
| `surface` | `#F2F2F2` | Panel xen kẽ, ô lưới được tô |
| `ink` | `#000000` | Chữ chính, panel tối (đảo màu) |
| `grid` | `#D9D9D9` | Đường lưới trên nền trắng (trên nền đen dùng `#262626`) |
| `mute` | `#6B6B6B` | Chữ phụ, chú thích |
| `accent` | `#FF3B30` | Đỏ nhấn: số chương, chấm ngày cưới, thanh tiến độ |
| `accent-text` | `#D70015` | Khi đỏ phải là chữ nhỏ trên nền trắng |

Tương phản: `ink` trên `bg` 21:1 ✅. `mute` trên `bg` ≈ 5.3:1 ✅. `accent #FF3B30` trên trắng ≈ 3.6:1 → **chỉ dùng cho chữ ≥ 24px hoặc đậm ≥ 19px** và khối trang trí. Chữ đỏ nhỏ dùng `accent-text` (≈ 5.3:1 ✅). Chữ trắng trên `accent` ≈ 3.6:1 → chỉ cho nút chữ đậm ≥ 18px.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Inter 900, tracking `-0.05em`, leading 0.85 | `22vw` | `20vw` | Cắt ra ngoài mép phải, cố ý |
| Số chương | Inter 900, tracking `-0.04em` | 96px | 200px | Đỏ `accent` |
| Tiêu đề chương | Inter 800, VIẾT HOA | 28px | 56px | "ĐỊA ĐIỂM" |
| Dữ liệu (giờ, ngày, toạ độ) | Space Mono 400 | 14px | 16px | Dạng bảng, căn cột |
| Nội dung | Inter 400 | 16px / 1.5 | 18px | |
| Nhãn | Space Mono 700, VIẾT HOA | 11px | 12px | "/ NHÀ TRAI" |

Inter và Space Mono đều có subset `vietnamese` (Space Mono kiểm lại dấu tiếng Việt ở chữ hoa ⚠️; nếu vỡ dấu thì thay bằng Inter `tabular-nums`).

### Hình khối và chất liệu
- **Radius `0`** ở mọi nơi. Không bóng đổ. Không gradient.
- **Đường lưới**: 12 cột trên desktop, 4 cột trên mobile; kẻ 1px `grid`; gutter 16px mobile / 24px desktop; margin 16px / 48px.
- **Ảnh**: đen trắng (`grayscale`), tràn cột, cắt tỉ lệ cứng 3:4 hoặc 1:1. Hover (desktop) → màu gốc.
- **Chấm đỏ**: một hình tròn `accent` 16px, xuất hiện đúng một lần mỗi panel (điểm nhìn).
- **Motion**: ease `expo.inOut` cho chuyển panel, `expo.out` cho chữ. Nhanh: vào 0.5s. Không nảy, không mềm.

---

## 3. Nhạc

- **Tâm trạng**: điện tử tối giản, synth sạch, nhịp đều, hơi lạnh nhưng ấm ở giai điệu. Không lời.
- **Tempo**: 110–122 BPM. **Độ dài**: 2:00–3:00, lặp.
- **Từ khoá Pixabay**: `minimal electronic modern`, `minimal techno clean`, `ambient electronic pulse`
- **Hành vi**:
  - Bắt đầu khi bấm nút "MỞ" ở C1. Âm lượng 0 → 0.6 trong 1.5 giây.
  - Không có C16 riêng; trạng thái nhạc hiển thị dạng chữ mono trong cột mục lục: `♪ 01:12 / 02:48`, bấm vào để tạm dừng (đồng bộ nút nổi).
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  01 + nút MỞ            │ 100svh  (cố định; bấm → dải inset T4 mở)
├───────────────────────────┤
│ 02  C2  Tên (20vw)         │ 100svh  ─┐
│ 03  C3  Hai người          │ 100svh   │
│ 04  C5+C11 Ngày / lịch     │ 100svh   │  T3 cứng: mỗi panel ghim,
│ 05  C12 Lịch trình (bảng)  │ 100svh   │  panel sau trượt lên che kín,
│ 06  C6+C7 Địa điểm         │ 120svh   │  panel trước đẩy y -20%.
│ 07  C13 Dress code         │ 100svh   │  Nền xen kẽ trắng / F2 / đen.
│ 08  C8  Index ảnh          │ 120svh   │
│ 09  C14+C15 Mừng cưới/RSVP │ 140svh   │
│ 10  C10 Kết                │ 100svh  ─┘
└───────────────────────────┘
+ cột mục lục sticky (desktop: cột 1 bên trái; mobile: dải ngang 32px ở đáy trái)
```

Nền xen kẽ: 02 trắng · 03 `surface` · 04 **đen** · 05 trắng · 06 `surface` · 07 trắng · 08 **đen** · 09 trắng · 10 **đỏ**. Panel đen đảo màu toàn bộ token (chữ trắng, lưới `#262626`).

Cột mục lục trên mobile đặt **dưới-trái** (góc dưới-phải là nút "Dùng thử", trên-trái là "Quay lại", trên-phải là nút nhạc).

---

## 5. Chi tiết từng section

### C1 · 01 (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ │    │    │    │    │      │  ← lưới 4 cột, kẻ mảnh
│ │    │    │    │    │      │
│ 01                         │  ← Inter 900, 40vw, đen, cắt mép trái
│ │    │    │    │    │      │
│ LỜI MỜI                    │  ← Inter 800 28px
│ CƯỚI                       │
│ Q ─ H              ●       │  ← chữ viết tắt mono + chấm đỏ
│ │    │    │    │    │      │
│ ┌──────────────┐           │
│ │ MỞ →         │           │  ← nút đen, chữ trắng, 56px cao, cột 1–3
│ └──────────────┘           │
│ 14.11.2026 / 18:00         │  ← Space Mono 12px, `date` ⚠️
└────────────────────────────┘
```

**Nội dung:** "01", "LỜI MỜI CƯỚI", chữ viết tắt (chữ đầu của từ cuối mỗi tên, "Q ─ H"), nút *"MỞ →"* (`aria-label="Mở thiệp và phát nhạc"`), ngày giờ mono.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Đường lưới dọc vẽ từ trên xuống (A6, `scaleY 0 → 1`, stagger 0.05, 0.6s) |
| 0.3s | "01" `yPercent 100 → 0` trong mask (0.7s, `expo.out`) |
| 0.6s | "LỜI MỜI CƯỚI" A2 theo dòng |
| 0.9s | Chấm đỏ `scale 0 → 1` (0.3s) |
| 1.0s | Nút + ngày A1 nhanh (0.4s) |

**Khi bấm (T4 dạng dải inset, tổng 1.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát, âm lượng tăng |
| 0.0s | Màn C1 chia thành **4 dải dọc** (đúng 4 cột lưới mobile, 12 trên desktop). Mỗi dải `yPercent 0 → -100` (0.7s, `expo.inOut`), stagger 0.06 từ trái sang |
| 0.3s | Panel 02 phía dưới lộ ra; tên bắt đầu A2 |
| 1.2s | Mở khoá cuộn |

Cách dựng: nội dung C1 fade ra lúc 0.0s (0.2s); phía trên panel 02 có 4 (desktop 12) `div` nền trắng, mỗi `div` rộng đúng 1 cột, trượt lên `yPercent -100`. Không cắt nội dung C1 theo cột (phức tạp, không đáng).

**Reduced-motion:** không vẽ lưới, không dải; bấm → crossfade 0.3s.
**Edge case:** không có tên dài ở C1 (chỉ chữ viết tắt).

---

### 02 · C2 · Tên

**Wireframe:**
```
┌────────────────────────────┐
│ 02 ─────────── / CẶP ĐÔI   │
│ MINH QUÂ│                  │  ← Inter 900 22vw, cắt mép phải
│ N       │                  │     (cố ý tràn, `overflow-hidden` ở panel)
│ ●                          │  ← chấm đỏ đóng vai "&"
│ THU HÀ                     │
│ │    │    │    │    │      │
│ TRÂN TRỌNG / KÍNH MỜI      │  ← mono 12px, cột 1–2
│ THỨ BẢY / 14.11.2026       │  ← mono, cột 3–4
└────────────────────────────┘
```
**Nội dung:** `{groom.name}` và `{bride.name}` viết HOA (dùng `uppercase`, giữ dấu tiếng Việt), chấm đỏ thay "&" (`aria-label="và"` trên chữ ẩn `sr-only`), "TRÂN TRỌNG / KÍNH MỜI", thứ + ngày.

**Animation:** mỗi tên A2 theo ký tự (`yPercent 100 → 0`, mask, stagger 0.02, 0.5s, `expo.out`); chấm đỏ `scale 0 → 1`. Khi cuộn qua panel (scrub), tên chú rể `xPercent 0 → -15`, tên cô dâu `xPercent 0 → 10` — hai dòng trượt ngược chiều.
**Edge case:** tên 50 ký tự → cỡ chữ theo công thức `min(22vw, 140vw / số ký tự dài nhất)`, cho phép xuống dòng ở khoảng trắng; không bao giờ < 12vw. Viết test cho hàm này.
**Chuyển sang 03:** T3 cứng.

---

### 03 · C3 · Hai người

```
┌────────────────────────────┐
│ 03 ─────────── / HAI NGƯỜI │
│ ┌──────────┐┌──────────┐   │
│ │images[1] ││images[2] │   │  ← đen trắng, 3:4, mỗi ảnh 2 cột
│ │   B/W    ││   B/W    │   │
│ └──────────┘└──────────┘   │
│ / NHÀ TRAI   / NHÀ GÁI     │  ← mono 11px, đỏ accent-text
│ MINH QUÂN    THU HÀ        │  ← Inter 800 20px
│ Quận 1,      Ba Đình,      │  ← 14px mute, line-clamp-3
│ TP.HCM       Hà Nội        │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️: nếu có → thêm dòng mono *"CON ÔNG … / BÀ …"*; nếu không thì bỏ.
**Animation:** ảnh A3 nhưng theo chiều ngang (`inset(0 100% 0 0) → inset(0)`, 0.6s, `expo.inOut`), ảnh 2 trễ 0.1s. Chữ A1 nhanh (0.5s).
**Mobile < 360px:** 1 cột, ảnh 1:1.

---

### 04 · C5 + C11 · Ngày (panel đen)

```
┌────────────────────────────┐
│ 04 ─────────── / NGÀY      │  ← nền đen, chữ trắng
│ 14                         │  ← Inter 900 40vw
│ 11                         │
│ 26                         │
│ ┌──┬──┬──┬──┬──┬──┬──┐     │  ← lịch là bảng lưới thật, viền #262626
│ │T2│T3│T4│T5│T6│T7│CN│     │     mono 12px
│ ├──┼──┼──┼──┼──┼──┼──┤     │
│ │ 9│10│11│12│13│●│15│      │  ← ô ngày cưới tô đỏ accent, số trắng
│ └──┴──┴──┴──┴──┴──┴──┘     │
│ T–45D 06H 12M 33S          │  ← mono, A7
└────────────────────────────┘
```
**Nội dung:** ngày/tháng/năm xếp dọc hai chữ số; lịch tuần bắt đầu Thứ Hai; đếm ngược dạng `T–45D 06H 12M 33S` (có `aria-label` đầy đủ tiếng Việt "Còn 45 ngày 6 giờ…"). Đã qua ngày cưới → *"ĐÃ CƯỚI. / MARRIED."*. `date` ⚠️ fallback ngày mẫu.
**Animation:** ba dòng số `yPercent 100 → 0` stagger 0.08. Các ô lịch hiện theo đường chéo (stagger `grid: [6,7], from: "start"`, 0.02). Ô ngày cưới đổi nền đỏ cuối cùng.

---

### 05 · C12 · Lịch trình (bảng giờ tàu)

```
┌────────────────────────────┐
│ 05 ─────────── / LỊCH TRÌNH│
│ GIỜ    │ HẠNG MỤC          │
│────────┼───────────────────│
│ 17:00  │ Đón khách         │
│ 18:00  │ Làm lễ          ● │  ← mốc chính có chấm đỏ
│ 18:30  │ Khai tiệc         │
│ 20:00  │ Giao lưu          │
└────────────────────────────┘
```
**Nội dung viết sẵn:** 4 mốc tính từ giờ tiệc trong `date` ⚠️ (−1h, 0, +30′, +2h), fallback 18:00.
**Animation:** kiểu bảng giờ tàu: mỗi ô giờ "lật" ký tự ngẫu nhiên 0.4s rồi dừng ở giá trị đúng (TextPlugin/scramble tự viết: đổi `textContent` mỗi 40ms, dùng `gsap.delayedCall`). Đường kẻ ngang A6 `scaleX 0 → 1` từ trái. Reduced-motion: hiện ngay.
**Logic cần test:** `scheduleFrom(date)` → 4 chuỗi giờ đúng, không tràn qua 24:00 sai (vd tiệc 23:30 → giao lưu 01:30).

---

### 06 · C6 + C7 · Địa điểm

```
┌────────────────────────────┐
│ 06 ─────────── / ĐỊA ĐIỂM  │
│ LỄ VU QUY     08:00        │  ← mono giờ căn phải
│ Tư gia nhà gái             │
│ {bride.address}            │
│────────────────────────────│
│ TIỆC CƯỚI     18:00        │
│ {venue.name}               │
│ ┌────────────────────────┐ │
│ │ <MapEmbed> grayscale   │ │  ← 1:1 mobile, 16:9 desktop, radius 0
│ └────────────────────────┘ │
│ 10.7769° N / 106.7009° E   │  ← venue.lat/lng, mono
│ [ CHỈ ĐƯỜNG → ]            │  ← nút viền đen 2px
└────────────────────────────┘
```
**Hành vi:** toạ độ định dạng 4 chữ số thập phân + N/S, E/W (viết test). Bản đồ bọc `grayscale` (Tailwind class trên wrapper), hover về màu. Map mount lười.
**Edge case:** `venue.name` rỗng → *"ĐỊA ĐIỂM TIỆC"*.

---

### 07 · C13 · Dress code

```
┌────────────────────────────┐
│ 07 ─────────── / DRESS CODE│
│ ┌──────┐┌──────┐┌──────┐   │
│ │██████││      ││██████│   │  ← 3 khối vuông đúng lưới
│ │ ĐEN  ││TRẮNG ││ ĐỎ   │   │     #000 #FFF(viền) #FF3B30
│ └──────┘└──────┘└──────┘   │
│ Đen – trắng. Một điểm đỏ   │
│ nếu bạn muốn.              │
└────────────────────────────┘
```
**Animation:** khối `scaleY 0 → 1` từ đáy, stagger 0.08.

---

### 08 · C8 · Index ảnh (panel đen)

```
┌────────────────────────────┐
│ 08 ─────────── / INDEX     │
│ ┌────┐┌────┐┌────┐┌────┐   │  ← 4 ảnh 1:1, grayscale, đánh số
│ │ 01 ││ 02 ││ 03 ││ 04 │   │     mono "01"… góc trên trái mỗi ảnh
│ └────┘└────┘└────┘└────┘   │     (mobile: lưới 2×2)
│ Chạm vào ảnh để xem lớn    │
└────────────────────────────┘
```
**Nội dung:** `images[0..3]` (mẫu chỉ có 4 ảnh nên index dùng lại toàn bộ ảnh, kể cả ảnh chân dung — đây là "contact sheet").
**Hành vi:** bấm → A10 Flip: ảnh phóng full panel, hiện màu gốc, mono *"02 / 04"*; bấm lại hoặc Esc để đóng; ← → chuyển ảnh.
**Animation vào:** 4 ô lộ bằng `clip-path inset` theo 4 hướng khác nhau (trái, trên, phải, dưới), 0.5s.

---

### 09 · C14 + C15 · Mừng cưới và xác nhận

```
┌────────────────────────────┐
│ 09 ─────────── / TRẢ LỜI   │
│ / MỪNG CƯỚI                │
│ ┌────────┐ ┌────────┐      │
│ │  QR    │ │  QR    │      │  ← QR mẫu ⚠️
│ └────────┘ └────────┘      │
│ NHÀ TRAI     NHÀ GÁI       │
│────────────────────────────│
│ / XÁC NHẬN                 │
│ TÊN ____________________   │  ← input gạch chân 2px đen
│ [ĐẾN ●] [KHÔNG ○]          │  ← segmented, đen/trắng
│ SỐ NGƯỜI  [-] 1 [+]        │
│ [ GỬI → ]                  │
│ Bản xem thử — không gửi đi │
└────────────────────────────┘
```
**Hành vi:** QR bấm phóng to (A10). Gửi → form thay bằng chữ Inter 900 *"CẢM ƠN, {TÊN}."* + chấm đỏ. Không gửi đi đâu. Số người 1–10.

---

### 10 · C10 · Kết (panel đỏ)

```
┌────────────────────────────┐
│ 10 ─────────── / KẾT       │  ← nền accent, chữ đen
│ HẸN                        │  ← Inter 900 28vw
│ GẶP                        │
│ BẠN.                       │
│ Minh Quân / Thu Hà         │
│ 14.11.2026                 │
└────────────────────────────┘
```
**Animation:** ba dòng A2; khi đến cuối trang, lưới dọc (màu đen 10%) vẽ lại một lần như "đóng" trang poster. Mẫu không có ảnh cuối (media chỉ 4 ảnh) — cố ý, kết bằng chữ.

---

### Cột mục lục (sticky, xuyên suốt 02 → 10)
```
desktop (cột 1, 1/12 rộng):       mobile (đáy trái, 32px cao):
  03                               03/10 ▬▬▬───── ♪
  ──                                
  10                                
  ▮ (thanh đỏ theo tiến độ)          
  ♪ 01:12                           
```
Số hiện tại đổi bằng `yPercent` trong mask khi panel mới ghim. Thanh đỏ `scaleY`/`scaleX` = tiến độ cuộn tổng (scrub). `z-index: 40`.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | 08 index ô 01 | 1:1 |
| `images[1]` | 03 chú rể + 08 ô 02 | 3:4 |
| `images[2]` | 03 cô dâu + 08 ô 03 | 3:4 |
| `images[3]` | 08 ô 04 | 1:1 |

`meta.media = { images: 4, videos: 0 }`. `styles = ["minimalist", "modern"]`, `colors = ["white", "black"]`.

Ảnh bìa `images[0]` chỉ xuất hiện ở index — vì C1/C2 của mẫu là chữ thuần. ⚠️ Nếu nhóm muốn ảnh bìa nổi bật hơn, có thể đặt `images[0]` làm nền đen trắng mờ 10% ở panel 02.

## 7. Asset cần chuẩn bị
- [ ] Không cần SVG minh hoạ (chỉ lưới vẽ bằng `div`)
- [ ] `music.mp3` electronic tối giản + `CREDITS.md`
- [ ] 4 ảnh mẫu tương phản cao, chụp kiến trúc/đô thị (Unsplash) ≤ 250KB `.webp`
- [ ] `thumb.webp` 600×800: "01" to + lưới + chấm đỏ
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Mọi phần tử nằm đúng cột lưới ở 360, 768, 1440px (bật lưới debug để soi)
- [ ] Tên cắt mép phải có chủ đích nhưng **không gây cuộn ngang** trang ở 360px
- [ ] Không có `border-radius` hay `box-shadow` nào (grep `rounded`, `shadow` trong thư mục mẫu = 0 kết quả, trừ `rounded-full` cho chấm đỏ)
- [ ] Chữ đỏ nhỏ dùng `accent-text`, qua kiểm tra tương phản axe
- [ ] Cột mục lục luôn đúng số panel khi cuộn nhanh lên/xuống

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/swiss-2d/
├── meta.ts
├── layout.tsx                 # Inter + Space_Mono (vietnamese)
├── page.tsx                   # return <SwissInvite />
└── _components/
    ├── swiss-invite.tsx       # "use client" — tokens t, ghép panel, SmoothScroll
    ├── grid-lines.tsx         # lưới 4/12 cột, prop `tone: "light" | "dark"`, A6 khi vào
    ├── panel.tsx              # 1 panel: số chương, tiêu đề, nền theo tone
    ├── panel-stack.tsx        # T3 cứng
    ├── running-index.tsx      # cột mục lục sticky + trạng thái nhạc
    ├── strips-gate.tsx        # C1 + dải inset
    ├── sections/              # names, people, date, schedule, venue, dress, index, reply, end
    └── format.ts              # fitNameSize, scheduleFrom, formatCoord (+ format.test.ts)
```

### 9.2 Tokens
```ts
export const t = {
  root: "bg-white text-black font-(family-name:--font-sans) antialiased",
  light: "bg-white text-black", alt: "bg-[#F2F2F2] text-black",
  dark: "bg-black text-white", red: "bg-[#FF3B30] text-black",
  num: "font-black tracking-[-0.04em] leading-[0.85] text-[#FF3B30]",
  h: "font-extrabold uppercase text-[28px] lg:text-[56px] leading-none",
  mono: "font-(family-name:--font-mono) text-sm tracking-wide",
  label: "font-(family-name:--font-mono) font-bold uppercase text-[11px]",
  mute: "text-[#6B6B6B]",
  cols: "grid grid-cols-4 lg:grid-cols-12 gap-x-4 lg:gap-x-6 px-4 lg:px-12",
} as const;
```

### 9.3 T3 cứng
```tsx
// panel-stack.tsx
useGSAP(() => {
  if (reduced) return;
  const panels = gsap.utils.toArray<HTMLElement>(".panel");
  panels.forEach((p, i) => {
    const next = panels[i + 1];
    if (!next) return;
    ScrollTrigger.create({ trigger: p, start: "top top", endTrigger: next, end: "top top", pin: true, pinSpacing: false,
      onToggle: (s) => s.isActive && setCurrent(i) });
    gsap.to(p, { yPercent: -20, ease: "none",
      scrollTrigger: { trigger: next, start: "top bottom", end: "top top", scrub: true } });
  });
}, { scope: root, dependencies: [reduced] });
```
Panel cao hơn 100svh (06, 08, 09): chỉ ghim khi đáy panel chạm đáy màn hình (`start: "bottom bottom"`) để đọc hết nội dung rồi mới bị che.

### 9.4 Lưới vẽ dần
```tsx
gsap.from(".grid-line", { scaleY: 0, transformOrigin: "top", stagger: 0.04, duration: 0.6, ease: "expo.out",
  scrollTrigger: { trigger: panel, start: "top 80%" } });
```

### 9.5 Logic cần test (`format.test.ts`)
- `fitNameSize(name)` → vw, trong khoảng [12, 22].
- `scheduleFrom(date)` → 4 mốc, vượt nửa đêm đúng.
- `formatCoord(lat, lng)` → `"10.7769° N / 106.7009° E"`, số âm → S/W.
- `initials(groom, bride)` (dùng chung với letter-2d nếu đã đưa vào `@/kit`).

### 9.6 Thứ tự làm
1. `meta`, `layout`, `page`, tokens, `grid-lines` → trang trống có lưới đúng
2. Panel tĩnh 02 → 10 theo lưới, khớp 360/1440px
3. `strips-gate` + nhạc
4. `panel-stack` (T3 cứng) + `running-index`
5. Animation riêng: tên A2, lịch chéo, bảng giờ lật, index Flip
6. Reduced-motion, tên dài, kiểm không cuộn ngang
7. Checklist template-spec §12
