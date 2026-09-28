# 2D-25 · `dong-ho-2d` · Tranh Đông Hồ

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Thiệp cưới là **một xấp tranh Đông Hồ vừa in xong**: đoàn rước "Đám cưới chuột" đi ngang màn hình mở đầu, rồi mỗi thông tin được **"in" lên giấy dó theo từng bản khắc màu** — đen nét trước, rồi đỏ, xanh, vàng — đúng cách làm tranh dân gian.

**Cảm xúc muốn gợi:** vui, dí dỏm, gần gũi, rất "Việt Nam"; chút hoài niệm Tết và làng quê Kinh Bắc.

**Phù hợp với:** cặp đôi yêu văn hoá dân gian, thích sự tinh nghịch, cưới ở quê hoặc tiệc ấm cúng; ảnh cưới áo dài, khăn xếp, tông màu mộc.

**Khác các mẫu khác ở chỗ:**
- **Chuyển cảnh "ép bản khắc" (T4 biến thể theo lớp màu):** mỗi section xuất hiện như tờ tranh được in: bản gỗ ép xuống (bóng tối lướt qua), nhấc lên thì để lại lớp màu. 4 lớp màu lần lượt, chuyển động **giật cục theo `steps()`** như hoạt hình khắc gỗ.
- **Nhân vật chuột** dẫn chuyện: một chú chuột kiệu hoa chạy dọc lề trang theo cuộn (vị trí gắn progress, di chuyển theo `steps`), và đoàn rước quay lại ở C10.
- Bố cục **lưới tranh tờ rời** (khổ ~3:4 như tranh Đông Hồ), có **câu chữ Nôm-phong-cách ở cột dọc** (viết chữ quốc ngữ theo cột, không dùng chữ Hán/Nôm thật).

**Moodboard:** giấy dó điệp óng ánh, màu đỏ gạch non, xanh lá chàm, vàng hoè, đen than lá tre; tranh Đám cưới chuột, Lợn đàn, Gà đàn, Vinh hoa – Phú quý (chỉ lấy **tinh thần**, tự vẽ lại).

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#EFE1C6` | Nền trang: giấy dó |
| `surface` | `#F7ECD6` | Nền tờ tranh (giấy dó sáng hơn) |
| `sheen` | `#F3E6CF` | Lớp điệp óng (gradient rất nhẹ) |
| `primary` | `#B5382A` | Đỏ gạch son: tiêu đề, nút, khung |
| `accent` | `#2F5D50` | Xanh lá chàm: lớp màu thứ 2, icon |
| `yellow` | `#D9A628` | Vàng hoè: lớp màu thứ 3, điểm nhấn (không dùng cho chữ) |
| `ink` | `#2B1D12` | Nét đen than tre: chữ chính, nét khắc |
| `ink-soft` | `#6B5540` | Chữ phụ |

Tương phản: `ink` trên `surface` ≈ 14:1 ✅. `ink-soft` trên `surface` ≈ 6.3:1 ✅. `primary` trên `surface` ≈ 5.5:1 ✅. `accent` trên `surface` ≈ 6.9:1 ✅. Chữ `surface` trên nút `primary` ≈ 5.5:1 ✅. `yellow` trên `surface` ≈ 2:1 ❌ → chỉ tô mảng, không làm chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Noto Serif Display 700 | 40px / 1.15 | 68px | Màu `primary` |
| Câu cột dọc | Noto Serif Display 600 | 18px | 22px | `[writing-mode:vertical-rl]`, xem ghi chú |
| Tiêu đề section | Noto Serif Display 700, VIẾT HOA, tracking 0.12em | 16px | 18px | Trong băng khung đỏ |
| Số lớn (ngày) | Noto Serif Display 800 | 96px | 140px | |
| Nội dung | Arima 400 | 17px / 1.6 | 19px | Nét mềm, tròn, hợp tranh dân gian |
| Nhãn / lời thoại | Arima 600 | 15px | 16px | Bong bóng chữ trên tranh |

Hai font nằm trong danh sách đã kiểm subset `vietnamese`. **Cột dọc:** chữ Latin có dấu trong `vertical-rl` sẽ nằm nghiêng 90°; muốn đứng thẳng từng chữ cần `[text-orientation:upright]`, nhưng dấu tiếng Việt khi đứng thẳng dễ xấu → **dùng mỗi từ một dòng** trong một cột hẹp (flex-col, mỗi từ 1 `<span>`), không dùng `writing-mode`.

### Hình khối và chất liệu
- **Tờ tranh** (`<PrintSheet>`): `rounded-none`, nền `surface` + vân giấy dó (SVG `feTurbulence` baseFrequency cao, opacity 0.06, component `<DoPaper/>`) + lớp điệp `bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)]`. Khung: viền đen 3px + viền đỏ 6px bên trong cách 4px, như khung tranh in.
- **Nét khắc**: mọi minh hoạ SVG có **4 lớp tách riêng** `ink` / `red` / `green` / `yellow` (`<g data-layer="ink">`…). Mảng màu hơi lệch khỏi nét (`translate(1px,1px)`) để giống in lệch bản thật.
- **Góc bo**: 0 ở mọi nơi.
- **Ảnh**: khung tranh vuông 3:4 viền đen 3px; ảnh có lớp phủ `mix-blend-multiply` màu `surface` 25% để hoà vào giấy. **Không** lọc ảnh thành tranh khắc (tốn hiệu năng, xấu ảnh người dùng).
- **Motion**: ease chủ đạo `steps(6)` cho chuyển động nhân vật và "in"; `power2.out` cho chữ (dễ đọc). Vào 0.6s. Không dùng blur.

---

## 3. Nhạc

- **Tâm trạng**: dân gian vui, rộn ràng như đám rước: sáo trúc, trống, phách, có thể có đàn bầu nhẹ; không lời.
- **Tempo**: 100–120 BPM (mục tiêu ~110). **Độ dài**: 2:00–2:30, lặp.
- **Từ khoá Pixabay**: `vietnamese folk happy`, `asian folk festival flute drum`, `traditional celebration instrumental`
- **Hành vi**:
  - Bắt đầu khi bấm chiếc trống (C1), âm lượng 0 → 0.6 trong 1.5 giây.
  - C16 là "gánh hát": chú chuột thổi kèn; cùng thẻ `<audio>` với `<MusicPlayer>`. Chuột chỉ "thổi" (khung hình đổi) khi nhạc đang phát.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Đám cưới chuột         │ 100svh  (đoàn rước chạy ngang, bấm trống)
├───────────────────────────┤
│ C2  Tranh "Tin vui"        │ 100svh  ─┐
│ C3  Đôi tranh "Vinh–Hoa"   │ 110svh   │  "Ép bản khắc":
│ C4  Ba tranh chuyện tình   │ 160svh   │  mỗi tờ in qua 4 lớp màu
│ C5+C11 Tranh lịch          │ 120svh   │  theo steps
│ C12 Lịch trình dạng đám rước│ 100svh   │
│ C6+C7 Hai lễ + bản đồ      │ 150svh  ─┘
│ C8  Xấp tranh (lưới tờ rời)│ 140svh   A10
│ C16 Gánh hát               │  60svh
│ C13 Dress code (khay màu)  │  70svh
│ C14 Mừng cưới              │  80svh
│ C15 Xác nhận tham dự       │ 100svh
│ C10 Đoàn rước quay về      │ 100svh
└───────────────────────────┘
```

**Bố cục:** tờ tranh `min(90vw, 440px)` giữa màn hình; bên phải mỗi tờ (desktop) hoặc phía trên (mobile) có **một cột câu đối dọc** 3–5 từ. Chú chuột dẫn đường nằm ở **lề trái** (mobile: 8px, kích thước 36px, `pointer-events-none`), di chuyển dọc theo progress của cả trang — không đè vào 2 góc chung vì chỉ đi trong khoảng 15%–85% chiều cao màn hình.
**Chuyển cảnh:** "ép bản khắc" (mô tả dưới C2) áp cho mọi tờ tranh C2–C6; phần sau (C8 trở đi) dùng T1 đơn giản + in 1 lớp để nhịp trang không đơn điệu và nhẹ hơn.

---

## 5. Chi tiết từng section

### C1 · Đám cưới chuột (màn mở thiệp)

**Mục đích:** mở đầu vui nhộn, thể hiện ngay chất Đông Hồ; bấm trống để phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← khung tranh đôi đen/đỏ
│ │  TIN VUI · TIN VUI     │ │  ← băng chữ đỏ trên cùng
│ │                        │ │
│ │ 🐭🥁 🐭🎺 🐭[kiệu]🐭 → │ │  ← đoàn rước SVG chạy ngang (A5 tự chạy)
│ │  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔   │ │     vượt khung, lặp vô hạn
│ │      Minh Quân         │ │  ← tên đỏ 32px
│ │         &              │ │
│ │       Thu Hà           │ │
│ └────────────────────────┘ │
│          ( 🥁 )            │  ← nút trống tròn 88px
│   Gõ trống để mở thiệp     │
└────────────────────────────┘
```
(Emoji ở wireframe chỉ là ký hiệu; thực tế là SVG tự vẽ.)

**Nội dung:** `<h1>` `{groom.name}` & `{bride.name}`; băng chữ *"TIN VUI"*; dòng *"Gõ trống để mở thiệp"*; nút `aria-label="Gõ trống mở thiệp mời"`.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Khung tranh "in" 4 lớp nhanh (mỗi lớp 0.15s, xem kỹ thuật ở C2) |
| 0.6s | Tên A2 (`power2.out`) |
| 0.9s | Đoàn rước bắt đầu đi từ phải sang trái: `x: 100% → -100%` (12s, `none`, lặp). Mỗi chú chuột có 2 khung hình chân (SVG 2 `<g>`), đổi khung mỗi 0.2s bằng `steps` — dáng đi giật như tranh khắc |
| 1.2s | Nút trống "nhún" lặp `scaleY 1 ↔ 0.94` (`steps(2)`, 0.6s) |

**Khi bấm trống (timeline mở, tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | Trống "tùng": `scale 1 → 1.15 → 1` (`steps(3)`, 0.3s); 6 tia chữ "TÙNG!" màu đỏ bật ra quanh trống |
| 0.2s | Đoàn rước tăng tốc (`timeScale` 1 → 4 trong 0.5s) và chạy hết ra khỏi khung |
| 0.8s | Tờ tranh C1 "nhấc lên": `y: 0 → -110%`, `rotation: 0 → -3` (`steps(6)`, 0.8s) lộ C2 bên dưới |
| 1.8s | Mở khoá cuộn |

**Reduced-motion:** đoàn rước đứng yên (hiện tĩnh 1 khung); bấm trống: tờ tranh fade 0.3s.
**Edge case:** tên > 20 ký tự: 24px, xuống dòng; đoàn rước nằm trên tên nên không bị ảnh hưởng.

---

### C2 · Tranh "Tin vui" (thiệp mời chính) + kỹ thuật "ép bản khắc"

```
┌────────────────────────────┐
│  Trăm │ ┌──────────────────┐│  ← cột câu đối dọc (mỗi từ 1 dòng):
│  năm  │ │ TRÂN TRỌNG BÁO   ││     "Trăm năm hạnh phúc"
│  hạnh │ │ TIN VUI          ││
│  phúc │ │ ┌──────────────┐ ││
│       │ │ │ ẢNH BÌA 3:4  │ ││  ← images[0], khung đen
│       │ │ └──────────────┘ ││
│       │ │  Minh Quân       ││  ← đỏ 40px
│       │ │  sánh duyên      ││  ← Arima italic
│       │ │  Thu Hà          ││
│       │ │ ✿──[gà-lợn]──✿   ││  ← hoạ tiết nhỏ 4 lớp màu
│       │ │ THỨ BẢY 14.11.2026││ ← ⚠️ `date`
│       │ └──────────────────┘│
└────────────────────────────┘
```
Trên mobile cột câu đối nằm **ngang phía trên tờ tranh** (1 dòng, 4 từ ngăn cách "·") vì 360px không đủ chỗ; từ `sm` trở lên mới đặt dọc bên trái.

**Nội dung:** "TRÂN TRỌNG BÁO TIN VUI", tên, "sánh duyên", ngày. Thiếu `date` ⚠️ → hằng số mẫu.

**"Ép bản khắc" (áp cho C2–C6), khi tờ vào viewport 70%:**
| t | Hành động |
|---|---|
| 0.0s | Một "bản gỗ" (khối `ink` 90% opacity cùng kích thước tờ) hạ xuống: `yPercent: -100 → 0` (`steps(4)`, 0.25s) |
| 0.25s | Bản gỗ nhấc lên `yPercent: 0 → -100` (`steps(4)`, 0.25s); lớp `ink` (nét đen, chữ) của tờ đã hiện (`opacity 0 → 1` ngay khi bản chạm) |
| 0.5s | Lặp với bản màu `primary` 60% → lớp đỏ hiện |
| 1.0s | Bản `accent` → lớp xanh |
| 1.5s | Bản `yellow` → lớp vàng |
| 1.9s | Ảnh A3 bằng `steps(6)` (clip-path theo bậc) |

"Bản gỗ" là **một `div` duy nhất** mỗi tờ, đổi màu giữa các lần ép (`backgroundColor` thay tức thì bằng `gsap.set`, không tween màu). Chữ HTML thuộc lớp `ink` nên đọc được sau 0.25s (không chặn đọc > 2s).
**Reduced-motion:** không có bản gỗ; 4 lớp hiện cùng lúc fade 0.3s.

---

### C3 · Đôi tranh "Vinh – Hoa"

```
┌────────────────────────────┐
│ ┌───────────┐┌───────────┐ │  ← 2 tờ như cặp tranh Vinh hoa / Phú quý
│ │ NHÀ TRAI  ││ NHÀ GÁI   │ │     (tinh thần: tranh cặp đôi treo cạnh nhau)
│ │ images[1] ││ images[2] │ │  ← 3:4
│ │ Minh Quân ││ Thu Hà    │ │
│ │ Quận 1,   ││ Ba Đình,  │ │
│ │ TP.HCM    ││ Hà Nội    │ │
│ │ [gà trống]││ [gà mái]  │ │  ← hoạ tiết 4 lớp
│ └───────────┘└───────────┘ │
└────────────────────────────┘
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️: nếu có thì dòng *"Con ông … bà …"*; không thì bỏ.
**Animation:** hai tờ "ép bản khắc" lệch 0.3s. Hai con gà nhìn nhau, gật đầu 2 lần (`rotation` `steps(2)`) khi in xong.
**Mobile < 360px:** 1 cột.

---

### C4 · Ba tranh chuyện tình

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ ① GẶP GỠ               │ │  ← tờ tranh ngang 4:3
│ │ [ảnh images[3]]  ┌────┐│ │
│ │                  │"Chào││ │  ← bong bóng thoại dạng cuộn giấy
│ │                  │ em!"││ │
│ │                  └────┘│ │
│ │ Câu kể 2 dòng          │ │
│ └────────────────────────┘ │
│ ② THƯƠNG NHAU …            │
│ ③ CẦU HÔN …                │
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. **Gặp gỡ** — thoại *"Chào em!"* — *"Hội làng năm ấy, anh đứng xem hát quan họ, còn em đứng ngay bên cạnh."*
2. **Thương nhau** — thoại *"Mình đi đâu đấy?"* — *"Từ đó, đi đâu cũng có nhau: chợ Tết, bến sông, những mùa lúa chín."*
3. **Cầu hôn** — thoại *"Về làm vợ anh nhé!"* — *"Anh mang trầu cau sang hỏi, và em cười gật đầu."*

Ảnh: `images[3..5]`. Tờ tranh xếp **so le**: tờ 1 lệch trái `rotate-[-1.5deg]`, tờ 2 lệch phải `rotate-[1deg]`, tờ 3 lệch trái.
**Animation:** "ép bản khắc" từng tờ; bong bóng thoại bật ra sau cùng (`scale 0 → 1`, `steps(3)`).

---

### C5 + C11 · Tranh lịch

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │  NGÀY LÀNH THÁNG TỐT   │ │  ← băng đỏ
│ │  THÁNG MƯỜI MỘT · 2026 │ │
│ │ [lợn]   14    [lợn]    │ │  ← số 96px ink, hai chú lợn đàn hai bên
│ │        THỨ BẢY         │ │
│ │  Còn 45 ngày 06 giờ    │ │  ← A7 với steps
│ │  12 phút 33 giây       │ │
│ ├────────────────────────┤ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │ … 12 13 (✹) 15 …       │ │  ← ✹ vòng hoa vàng + nét đen
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** như letter-2d C5; sau ngày cưới: *"Đôi ta đã thành đôi, thành lứa ♥"*.
**Animation:** "ép bản khắc"; số "14" đếm với `snap: 1` và `steps`; vòng hoa ✹ quay `rotation: 0 → 30` `steps(3)`. Countdown đổi số **không** lật 3D (giữ phẳng như tranh) — số mới đẩy số cũ `yPercent -100` theo `steps(2)`.

---

### C12 · Lịch trình dạng đám rước

```
┌────────────────────────────┐
│        LỊCH TRÌNH          │
│  ───────────────────────── │  ← đường làng (nét đen ngang)
│  [chuột cờ]   17:00        │
│               Đón khách    │
│  [chuột trống] 18:00       │  ← mỗi mốc là 1 chú chuột cầm đồ vật khác
│               Làm lễ       │
│  [chuột mâm]  18:30        │
│               Khai tiệc    │
│  [chuột kèn]  20:00        │
│               Hát hò       │
└────────────────────────────┘
```
**Nội dung:** 4 mốc tính từ `date` (như letter-2d C12, mốc 4 đổi thành *"Hát hò giao lưu"*).
**Animation:** theo scrub, từng chú chuột bước từ trái vào vị trí (`x: -120 → 0`, `steps(6)`), chữ giờ A1.

---

### C6 + C7 · Hai lễ và bản đồ

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │  LỄ RƯỚC DÂU           │ │
│ │  08:00 · Thứ Bảy       │ │
│ │  Tư gia nhà gái        │ │
│ │  {bride.address}       │ │
│ │  [kiệu hoa nhỏ]        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │  TIỆC CƯỚI             │ │
│ │  18:00 · Thứ Bảy       │ │
│ │  {venue.name}          │ │
│ │  {venue.address}       │ │
│ │ ┌────────────────────┐ │ │  ← <MapEmbed> 16:10, khung đen 3px
│ │ └────────────────────┘ │ │
│ │  [ ⌖ CHỈ ĐƯỜNG ]       │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation:** "ép bản khắc" (bản đồ không bị ép, chỉ hiện ở bước cuối). Bản đồ lazy như letter-2d.

---

### C8 · Xấp tranh (album)

```
┌────────────────────────────┐
│       KHOẢNH KHẮC          │
│ ┌──────┐ ┌──────┐          │  ← lưới 2 cột tờ rời, xoay ±2°
│ │ [3]  │ │ [4]  │          │     như tranh bày bán ở chợ phiên
│ └──────┘ └──────┘          │
│ ┌──────┐ ┌──────┐          │
│ │ [5]  │ │ [0]  │          │
│ └──────┘ └──────┘          │
└────────────────────────────┘
```
**Hành vi:** tờ "rơi" vào chỗ khi vào viewport (`y: -30 → 0`, `steps(4)`), stagger 0.1. Bấm → A10 lightbox; trong lightbox có nút ← → và phím mũi tên, Esc để đóng.

---

### C16 · Gánh hát

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ [chuột thổi kèn]       │ │
│ │ ♪ Chạm để nghe bài hát │ │
│ │   của chúng tôi        │ │
│ │ [ ▶/❚❚ ] ───●── 1:12   │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** chuột thổi kèn đổi 2 khung hình mỗi 0.25s khi `!audio.paused`; các nốt nhạc SVG bay lên `steps(4)`. Cùng thẻ audio.

---

### C13 · Dress code (khay màu)

```
┌────────────────────────────┐
│        DRESS CODE          │
│  Dân dã · rực rỡ vừa phải  │
│  ▣   ▣   ▣   ▣             │  ← 4 bát màu của thợ in
│ Đỏ  Xanh Vàng  Ngà         │    #B5382A #2F5D50 #D9A628 #F7ECD6
│ "Áo dài càng vui nha!"     │
└────────────────────────────┘
```
**Animation:** mỗi bát "đầy màu" `scaleY 0 → 1` `steps(3)`, stagger 0.1.

---

### C14 · Mừng cưới · C15 · Xác nhận tham dự

- **C14**: tờ tranh "Lộc – Phúc" hai ô, mỗi ô QR mẫu ⚠️ (nhà trai / nhà gái), bấm → A10. Câu: *"Có lòng là quý, có mặt là vui!"*
- **C15**: form trên tờ giấy dó; input viền dưới đen 2px; nhãn *"Tên của bạn"*, *"Tôi sẽ đến"*, *"Tiếc quá, không đến được"*, *"Số người"*, nút đỏ *"GỬI"*. Bấm Gửi → form thu lại, con dấu đỏ *"ĐÃ NHẬN — cảm ơn {tên}!"* đóng xuống (`scale 1.5 → 1`, `steps(3)`). **Không gửi dữ liệu đi đâu**; ghi chú *"Bản xem thử — xác nhận không được gửi đi."*

---

### C10 · Đoàn rước quay về

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ [ảnh cuối images[n-1]] │ │  ← 3:4
│ │  Đa tạ quý khách!      │ │  ← đỏ 28px
│ │  Mời đến ăn cỗ cưới    │ │
│ │  cùng chúng tôi        │ │
│ │  Minh Quân & Thu Hà    │ │
│ │ ← 🐭🥁 🐭[kiệu] 🐭🎺   │ │  ← đoàn rước đi ngược lại (trái → phải)
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation (scrub):** đoàn rước (tái dùng component C1) đi theo scrub từ trái sang phải, chú chuột dẫn đường ở lề trái nhập vào cuối đoàn. Khép lại mở đầu C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C2 ảnh bìa; C8 tờ thứ 4 | 3:4 |
| `images[1]` | C3 chú rể | 3:4 |
| `images[2]` | C3 cô dâu | 3:4 |
| `images[3..5]` | C4 ba tranh + C8 | 4:3 (C4) / 3:4 (C8) |
| `images[n-1]` | C10 (= `images[5]`) | 3:4 |

`meta.media = { images: 6, videos: 0 }`
`meta.styles = ["traditional", "playful"]`, `meta.colors = ["beige", "red"]`.

## 7. Asset cần chuẩn bị
- [ ] SVG **tự vẽ theo phong cách** Đông Hồ, mỗi hình tách 4 lớp `ink/red/green/yellow`: chuột cầm cờ, chuột đánh trống (2 khung chân), chuột khiêng kiệu (2 khung), chuột thổi kèn (2 khung), chuột cầm mâm, gà trống, gà mái, lợn đàn (2), kiệu hoa, vòng hoa, bát màu
- [ ] Ghi vào `CREDITS.md`: *"Minh hoạ tự vẽ theo phong cách tranh dân gian Đông Hồ, không dùng bản quét tranh gốc."*
- [ ] `music.mp3` (Pixabay, sáo + trống ~110 BPM) + `CREDITS.md`
- [ ] 6 ảnh mẫu áo dài / không khí làng quê ≤ 300KB `.webp`
- [ ] `qr-sample.webp`
- [ ] `thumb.webp` 600×800: tờ "Tin vui" với đoàn rước chuột
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Bấm trống: nhạc phát ngay, cuộn được trong ≤ 2 giây
- [ ] Chữ của mỗi tờ đọc được sau ≤ 0.3s kể từ khi "ép bản" bắt đầu
- [ ] Chuyển động nhân vật rõ "giật theo bậc" (steps), chữ vẫn mượt
- [ ] Không có chữ màu `yellow`
- [ ] Chú chuột dẫn đường không bao giờ đè 2 góc chung và không chặn click (`pointer-events-none`)
- [ ] Tên 50 ký tự không vỡ C1, C2
- [ ] Không dùng hình ảnh quét từ tranh gốc (kiểm `CREDITS.md`)

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/dong-ho-2d/
├── meta.ts
├── layout.tsx                 # Noto_Serif_Display (--font-display) + Arima (--font-body), vietnamese
├── page.tsx                   # return <DongHoInvite />
└── _components/
    ├── dong-ho-invite.tsx     # "use client" — tokens t, ghép section, SmoothScroll, chuột dẫn đường
    ├── procession.tsx         # đoàn rước chuột (C1 tự chạy, C10 scrub)
    ├── drum-gate.tsx          # C1 dùng OpenGate
    ├── print-sheet.tsx        # tờ tranh + "ép bản khắc" 4 lớp
    ├── do-paper.tsx           # vân giấy dó (SVG filter)
    ├── guide-mouse.tsx        # chuột dẫn đường ở lề
    ├── press-plan.ts          # sinh thứ tự lớp in + thời điểm (thuần, test được)
    ├── press-plan.test.ts
    ├── sections/
    │   ├── good-news.tsx      # C2
    │   ├── pair-prints.tsx    # C3
    │   ├── story-prints.tsx   # C4
    │   ├── calendar-print.tsx # C5 + C11
    │   ├── parade-schedule.tsx# C12
    │   ├── events-print.tsx   # C6 + C7
    │   ├── market-album.tsx   # C8
    │   ├── troupe.tsx         # C16
    │   ├── paint-bowls.tsx    # C13
    │   ├── gift-print.tsx     # C14
    │   └── rsvp-print.tsx     # C15
    └── svg/                   # mỗi hình: <g data-layer="ink|red|green|yellow">
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. `@/components`: `MapEmbed`.

### 9.2 Tokens trong Tailwind
```ts
// dong-ho-invite.tsx
export const t = {
  root: "min-h-svh bg-[#EFE1C6] text-[#2B1D12] font-(family-name:--font-body) overflow-x-clip",
  display: "font-(family-name:--font-display)",
  sheet: "relative bg-[#F7ECD6] border-[3px] border-[#2B1D12] p-4 before:absolute before:inset-1 before:border-[6px] before:border-[#B5382A] before:pointer-events-none",
  band: "bg-[#B5382A] text-[#F7ECD6] font-(family-name:--font-display) font-bold uppercase tracking-[0.12em] px-3 py-1",
  soft: "text-[#6B5540]",
  red: "text-[#B5382A]",
  btn: "min-h-11 px-6 bg-[#B5382A] text-[#F7ECD6] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2B1D12]",
} as const;
```

### 9.3 "Ép bản khắc" (print-sheet.tsx)
```tsx
const LAYERS = [
  { layer: "ink", color: "#2B1D12" }, { layer: "red", color: "#B5382A" },
  { layer: "green", color: "#2F5D50" }, { layer: "yellow", color: "#D9A628" },
] as const;

useGSAP(() => {
  if (reduced) return gsap.from(root.current, { opacity: 0, duration: 0.3 });
  gsap.set("[data-layer]", { opacity: 0 });
  const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 70%", once: true } });
  LAYERS.forEach(({ layer, color }, i) => {
    tl.set(".block", { backgroundColor: color, opacity: i === 0 ? 0.9 : 0.6 }, i * 0.5)
      .fromTo(".block", { yPercent: -100 }, { yPercent: 0, duration: 0.25, ease: "steps(4)" }, i * 0.5)
      .set(`[data-layer="${layer}"]`, { opacity: 1 }, i * 0.5 + 0.25)
      .to(".block", { yPercent: -100, duration: 0.25, ease: "steps(4)" }, i * 0.5 + 0.25);
  });
}, { scope: root, dependencies: [reduced] });
```
Chữ HTML trong tờ mang `data-layer="ink"`. Khối `.block` là `absolute inset-0 pointer-events-none`, tờ có `overflow-hidden`.
`press-plan.ts` xuất `pressPlan(layers, gap = 0.5, press = 0.25)` → mảng `{ layer, downAt, revealAt, upAt }`; timeline trên đọc từ đây thay vì tính inline.
**Test** (`press-plan.test.ts`): lớp `ink` có `revealAt` = 0.25 (≤ 0.3s, tiêu chí đọc được); thứ tự lớp giữ nguyên; `upAt` lớp cuối + 0.25 = tổng thời lượng (1.75s với 4 lớp); với 0 lớp trả mảng rỗng.

### 9.4 Đoàn rước (procession.tsx)
```tsx
// mode "loop" (C1) hoặc "scrub" (C10)
useGSAP(() => {
  const walk = gsap.to(".leg-b", { opacity: 1, duration: 0.2, ease: "steps(1)", repeat: -1, yoyo: true }); // đổi khung chân
  const move = mode === "loop"
    ? gsap.fromTo(".parade", { xPercent: 100 }, { xPercent: -100, duration: 12, ease: "none", repeat: -1 })
    : gsap.fromTo(".parade", { xPercent: -100 }, { xPercent: 100, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
  if (reduced) { walk.kill(); move.kill(); }
  return () => { walk.kill(); move.kill(); };
}, { scope: root, dependencies: [mode, reduced] });
```
C1 khi bấm trống: `gsap.to(move, { timeScale: 4, duration: 0.5 })`.
Tối ưu: tạm dừng `walk`/`move` khi C1 ra khỏi viewport (`ScrollTrigger.create({ onToggle })`).

### 9.5 Chuột dẫn đường
Vì bên trong ScrollSmoother không dùng `fixed`, đặt chuột dẫn đường là **anh em** của `SmoothScroll` (bên trong root của mẫu, ngoài wrapper), `fixed left-2 z-20`. Vị trí dọc: `ScrollTrigger.create({ start: 0, end: "max", onUpdate: s => setY(s.progress) })` với `gsap.quickSetter(el, "y", "px")` và làm tròn theo bậc `Math.round(p * 40) / 40` để di chuyển giật theo steps.
⚠️ Cần kiểm `SmoothScroll` của kit có cho đặt phần tử fixed ngoài wrapper nhưng vẫn trong component mẫu không (theo todo §1 thì nút chung đã nằm ngoài, nên cấu trúc tương tự được).

### 9.6 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens `t`, `do-paper.tsx`
2. SVG nhân vật tách lớp (việc tốn thời gian nhất — làm song song với bước 3)
3. `print-sheet.tsx` tĩnh + section C2 → C10 tĩnh, khớp 360 / 1440px
4. `press-plan.ts` + test, rồi animation "ép bản khắc"
5. `procession.tsx` + `drum-gate.tsx` + nhạc
6. `guide-mouse.tsx`, C12 đám rước, C16 gánh hát
7. Reduced-motion, Lighthouse, checklist template-spec §12
