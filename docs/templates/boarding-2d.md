# 2D-17 · `boarding-2d` · Thẻ Lên Máy Bay

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Cấu trúc tài liệu theo mẫu chuẩn [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Khách được "cấp" một cuốn hộ chiếu của hãng bay *Hạnh Phúc Airlines*; lật từng trang hộ chiếu, đi qua cổng khởi hành và cuối cùng cầm trên tay tấm thẻ lên máy bay dẫn tới tiệc cưới.

**Cảm xúc muốn gợi:** háo hức trước chuyến đi, vui tươi, hiện đại, một chút tinh nghịch ("chuyến bay một chiều, không hoàn vé").

**Phù hợp với:** cặp đôi thích du lịch, gặp nhau ở sân bay/trong chuyến đi, cưới ở thành phố khác quê một bên (FROM → TO có ý nghĩa thật), ảnh cưới sáng, trời xanh.

**Khác các mẫu khác ở chỗ:** có **một đường bay nét đứt chạy dọc toàn trang** (A6 scrub) với chiếc máy bay nhỏ bám theo đường đó như thanh tiến độ. Các section được dàn như các "điểm dừng" của hành trình: hộ chiếu (lật trang T7) → cổng soát vé → bảng giờ bay lật chữ (split-flap) → dãy cửa sổ máy bay cuộn ngang (T5) → thẻ lên máy bay bị xé cuống ở cuối.

**Moodboard:** bìa hộ chiếu xanh navy dập chữ vàng, trang hộ chiếu có hoa văn guilloche, con dấu nhập cảnh mực tím/đỏ, bảng giờ bay Solari lật chữ, cửa sổ máy bay bo tròn, tem hành lý, vé có khấc tròn và mã vạch.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#EEF4FB` | Nền trang, như bầu trời nhạt |
| `surface` | `#FFFFFF` | Nền vé, trang hộ chiếu |
| `navy` | `#0B3D91` | Màu chủ đạo: bìa hộ chiếu, header vé, nút |
| `navy-deep` | `#072A66` | Hover, nền bảng giờ bay |
| `sun` | `#F7B32B` | Nhấn: máy bay, chữ dập trên bìa, ô ngày cưới |
| `stamp` | `#C2185B` | Mực con dấu nhập cảnh (chỉ dùng cho con dấu) |
| `ink` | `#0B1F3A` | Chữ chính |
| `ink-soft` | `#52627A` | Chữ phụ, nhãn trường vé ("FROM", "GATE") |
| `line` | `#C9D6E8` | Đường kẻ, đường bay nét đứt, viền vé |

Tương phản: `ink` trên `surface` ≈ 16:1 ✅. `ink-soft` trên `surface` ≈ 6:1 ✅. Chữ trắng trên `navy` ≈ 10:1 ✅. `sun` trên `navy-deep` ≈ 7.6:1 ✅ (dùng cho chữ bảng giờ bay). `sun` trên trắng chỉ ≈ 1.8:1 ❌ → **không dùng `sun` làm màu chữ trên nền sáng**, chỉ làm nền/viền/icon.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Montserrat 800, VIẾT HOA, tracking 0.04em | 34px / 1.05 | 60px | Như tên in trên vé |
| Tiêu đề section | Montserrat 700, VIẾT HOA, tracking 0.18em | 13px | 15px | "BOARDING PASS", "CỔNG KHỞI HÀNH" |
| Mã lớn (SGN, HAN, giờ bay) | Montserrat 800 | 56px | 88px | |
| Dữ liệu vé, bảng giờ bay | Space Mono 400/700 | 14px / 1.5 | 16px | Mọi con số, mã, nhãn trường |
| Nội dung | Space Mono 400 | 15px / 1.65 | 17px | Lời văn ngắn |

Hai font đều có subset `vietnamese`. Kiểm dấu trên Space Mono với *Nguyễn Thị Hằng, Trịnh Đức Hưởng* (monospace hay bị lệch dấu chồng; nếu lệch thì nội dung dài chuyển sang Montserrat 500, chỉ giữ Space Mono cho số/mã).

### Hình khối và chất liệu
- **Vé**: `rounded-2xl`, 2 **khấc tròn** ở mép trái/phải chỗ đường xé, làm bằng `mask-[radial-gradient(circle_at_0_62%,transparent_14px,#000_15px),…]` (arbitrary). Đường xé là viền `border-dashed` `line`.
- **Trang hộ chiếu**: nền `surface` + hoa văn guilloche SVG (`<Guilloche/>`, opacity 0.08, màu `navy`), số trang ở góc dưới.
- **Con dấu**: SVG tròn/chữ nhật, viền kép, chữ Space Mono, `mix-blend-multiply`, opacity 0.85, xoay ngẫu nhiên ±12°.
- **Cửa sổ máy bay**: `rounded-[40%]` với viền dày `surface` 14px và bóng trong `shadow-[inset_0_0_0_6px_#DDE6F2]`.
- **Icon**: nét 1.5px, `navy`, 6 icon (máy bay, vali, ly, nhẫn, đĩa ăn, định vị).
- **Motion**: ease chủ đạo `power3.out`. Vào 0.7s, ra 0.5s. Được phép nảy nhẹ `back.out(1.4)` **chỉ** cho con dấu đập xuống.

---

## 3. Nhạc

- **Tâm trạng**: lounge/chill-hop nhẹ, guitar điện sạch + keys, cảm giác phòng chờ sân bay sang trọng, không lời.
- **Tempo**: 90–100 BPM. **Độ dài**: 2:00–3:00, lặp lại.
- **Từ khoá Pixabay**: `travel lounge chill`, `airport lounge jazzy`, `summer travel acoustic`
- **Hành vi**:
  - Bắt đầu khi bấm "Mở hộ chiếu" (C1). Âm lượng 0 → 0.6 trong 1.5s.
  - Trước nhạc có 1 tiếng "ding-dong" thông báo sân bay (SFX ngắn ≤ 1s, file riêng `chime.mp3`, phát 1 lần lúc mở). Nếu không tìm được SFX hợp lệ thì bỏ, không bắt buộc.
  - C16 dựng thành màn hình giải trí trên ghế, đồng bộ với nút nổi.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Hộ chiếu đóng          │ 100svh  (cố định tới khi mở)
├───────────────────────────┤  ← đường bay nét đứt bắt đầu (A6 scrub toàn trang)
│ C2+C3 Trang thông tin      │ 200svh  ghim, lật 2 trang (T7): chú rể → cô dâu
│ C4  Trang visa · con dấu   │ 120svh  3 con dấu = 3 mốc chuyện tình
│ C5+C11 Bảng giờ bay        │ 100svh  split-flap đếm ngược + lịch tháng
│ C12 Lịch trình chuyến bay  │ 100svh  itinerary nhiều chặng
│ C16 Giải trí trên máy bay  │  60svh
│ C8  Dãy cửa sổ (album)     │ 300svh  ghim, cuộn ngang (T5)
│ C6+C7 Boarding pass        │ 140svh  vé + bản đồ cổng
│ C13 Hành lý xách tay       │  70svh  dress code
│ C14 Duty free · mừng cưới  │  80svh
│ C15 Làm thủ tục (RSVP)     │ 100svh
│ C10 Xé cuống vé            │ 100svh
└───────────────────────────┘
```

Chiều rộng nội dung: `min(92vw, 480px)` ở giữa. Riêng C8 tràn toàn chiều ngang. Trên desktop, đường bay nét đứt uốn lượn hai bên lề (SVG `preserveAspectRatio="none"` cao bằng toàn trang), trên mobile đường bay chạy sát lề trái 16px để không đè chữ.

**Máy bay tiến độ:** icon máy bay 20px, `position: fixed` ở lề trái, `y` theo `ScrollTrigger` progress toàn trang (0 → 100%), xoay theo hướng đường cong nhờ `MotionPathPlugin` (`autoRotate: 90`). Không đặt ở góc trên-trái (nút Quay lại): chỉ bắt đầu hiển thị sau `top: 72px`, kết thúc trước `bottom: 88px`.

---

## 5. Chi tiết từng section

### C1 · Hộ chiếu đóng (màn mở thiệp)

**Mục đích:** khoảnh khắc "nhận hộ chiếu", đồng thời là thao tác người dùng để trình duyệt cho phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│                            │
│     ┌──────────────────┐   │
│     │   HẠNH PHÚC      │   │  ← bìa navy, chữ sun dập nổi
│     │   AIRLINES       │   │
│     │                  │   │
│     │      (✈ ♥)       │   │  ← quốc huy giả: máy bay ôm trái tim
│     │                  │   │
│     │  HỘ CHIẾU CƯỚI   │   │
│     │  WEDDING PASS    │   │
│     │  QUÂN  ·  HÀ     │   │  ← tên gọi, Montserrat 700 14px
│     └──────────────────┘   │
│                            │
│   [ ✈  Mở hộ chiếu ]       │  ← nút navy, cao 48px
│   Chuyến bay khởi hành     │
│   lúc 18:00 · 14.11.2026   │  ← Space Mono 13px, ink-soft ⚠️ date
└────────────────────────────┘
```

**Nội dung:**
- Bìa: "HẠNH PHÚC AIRLINES", "HỘ CHIẾU CƯỚI · WEDDING PASS", tên gọi hai người (từ cuối cùng của `{groom.name}`, `{bride.name}`).
- Nút: *"Mở hộ chiếu"*.
- Dòng dưới: *"Chuyến bay khởi hành lúc {HH:mm} · {dd.MM.yyyy}"* ⚠️ cần `date`; chưa có thì dùng ngày mẫu `14.11.2026 18:00` viết sẵn.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Bìa hộ chiếu `y: 40 → 0`, `rotate: -6° → -2°`, opacity (0.8s) |
| 0.5s | Chữ dập trên bìa ánh kim quét qua (gradient `sun` chạy `x: -100% → 100%` trong lớp mask, 1.2s) |
| 1.0s | Nút + dòng giờ bay A1 |
| lặp | Bìa A12 (float, biên độ 6px) |

**Khi bấm "Mở hộ chiếu" (tổng 1.8s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu (và chime nếu có) |
| 0.0s | Bìa thẳng lại `rotate → 0`, `scale 1 → 1.05` (0.3s) |
| 0.3s | Bìa lật mở T7: `rotateY 0 → -180°`, `transform-origin: left`, `perspective: 1400px` (0.9s) để lộ trang C2 phía sau |
| 1.2s | Bìa đã lật fade ra; trang C2 phóng từ kích thước hộ chiếu lên kích thước section (0.6s) |
| 1.8s | Mở khoá cuộn, khởi tạo ScrollSmoother, đường bay bắt đầu vẽ |

**Reduced-motion:** không lật, crossfade 0.3s.
**Trường hợp đặc biệt:** tên gọi > 12 ký tự thì giảm còn 12px; bìa không hiển thị họ tên đầy đủ nên không vỡ.

---

### C2 + C3 · Trang thông tin hộ chiếu (ghim, lật 2 trang)

**Mục đích:** giới thiệu hai người như trang nhân thân hộ chiếu. Kết hợp C2 (tên + lời mời) và C3 (ảnh, nhà trai/nhà gái).

**Wireframe (trang 1 · chú rể):**
```
┌────────────────────────────┐
│ HẠNH PHÚC AIRLINES   P.01  │  ← header navy mảnh
│ ┌───────┐ Họ tên / Name    │
│ │ ẢNH   │ NGUYỄN MINH QUÂN │  ← Montserrat 800 18px
│ │images │ Vai trò / Role   │
│ │  [1]  │ CHÚ RỂ · GROOM   │
│ └───────┘ Xuất phát / From │
│           Quận 1, TP.HCM   │  ← {groom.address}, tối đa 3 dòng
│ ───────── guilloche ───────│
│ P<WED<<MINH<QUAN<<<<<<<<<< │  ← dòng MRZ giả, Space Mono 11px
│ 1411202<<HAPPY<<FOREVER<<< │
└────────────────────────────┘
```
Trang 2 giống hệt, `images[2]`, `{bride.name}`, "CÔ DÂU · BRIDE", "Điểm đến / To", `{bride.address}`.

Trên cả hai trang, phía trên khung là dòng tiêu đề chung (không lật):
```
TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH
cùng bay chuyến bay hạnh phúc của
MINH QUÂN & THU HÀ            ← <h1>, Montserrat 800
```

**Nội dung:** tên in hoa lấy từ `name.toLocaleUpperCase("vi")`. Dòng MRZ dựng từ tên bỏ dấu (`normalize("NFD")` + bỏ ký tự kết hợp, thay khoảng trắng bằng `<`), cắt/đệm đủ 28 ký tự. Nếu có tên bố mẹ (⚠️ chưa chốt) thì thêm trường "Gia đình / Family: Ông … & Bà …" dưới vai trò; không có thì ẩn trường.

**Animation (scrub, section ghim 200svh):**
| progress | Hành động |
|---|---|
| 0 → 0.1 | Tiêu đề A2 theo `lines` |
| 0.1 → 0.3 | Trang 1: ảnh A3, các trường A1 stagger 0.06 |
| 0.45 → 0.7 | Trang 1 lật T7 `rotateY 0 → -180°` quanh mép trái, trang 2 lộ ra phía dưới |
| 0.7 → 0.9 | Trang 2: ảnh A3, trường A1 |
| 0.9 → 1 | Giữ yên để đọc |

**Chuyển sang C4:** T1, đường bay nét đứt tiếp tục vẽ xuống.
**Reduced-motion:** không ghim; hai trang xếp dọc, A1 0.3s.
**Edge case:** tên 50 ký tự: trường tên cho phép 2 dòng `break-words`, cỡ 16px; MRZ luôn cắt 28 ký tự nên không tràn.

---

### C4 · Trang visa · con dấu nhập cảnh (chuyện tình)

**Mục đích:** kể 3 mốc chuyện tình như 3 con dấu trên trang visa.

**Wireframe:**
```
┌────────────────────────────┐
│ VISA · VISAS          P.07 │
│  ╭─────────╮               │
│  │ GẶP GỠ  │ ← dấu tròn,   │
│  │ 2019    │   mực stamp   │
│  ╰─────────╯   ┌────────┐  │
│                │ THƯƠNG │  │ ← dấu chữ nhật, xoay 8°
│  ┌─────┐       │ 2021   │  │
│  │ảnh 3│       └────────┘  │
│  └─────┘   ╭──────────╮    │
│            │ CẦU HÔN  │    │
│            │ 2024 ✈   │    │
│            ╰──────────╯    │
│ "Ngày đầu gặp nhau ở …"    │ ← chú thích mốc đang active
└────────────────────────────┘
```

**Nội dung viết sẵn:**
1. **GẶP GỠ** — *"Một chuyến đi tình cờ, hai chiếc ghế cạnh nhau."* (ảnh `images[3]`)
2. **THƯƠNG** — *"Từ đó, mọi hành trình đều có thêm một người đồng hành."* (ảnh `images[4]`)
3. **CẦU HÔN** — *"Và rồi một câu hỏi, một cái gật đầu."* (ảnh `images[5]`)
Năm trên con dấu là chữ mẫu cố định (không phải dữ liệu người dùng).

**Animation (mỗi con dấu kích hoạt khi vào 60% viewport):**
| t | Hành động |
|---|---|
| 0.0s | Con dấu từ `scale: 1.8, opacity: 0, rotate: r-10°` đập xuống `scale 1, rotate r` (0.35s, `back.out(1.4)`) |
| 0.3s | Trang rung nhẹ `x: ±2` 2 lần (0.12s) |
| 0.35s | Ảnh polaroid nhỏ tương ứng trượt ra từ dưới con dấu A1 |
| 0.4s | Chú thích đổi (crossfade 0.3s) |

**Tương tác:** chạm vào con dấu thì mở ảnh tương ứng bằng A10.
**Reduced-motion:** con dấu hiện sẵn, fade 0.3s.

---

### C5 + C11 · Bảng giờ bay (đếm ngược) + lịch tháng

**Mục đích:** ngày cưới và đếm ngược, dựng như bảng khởi hành sân bay.

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← nền navy-deep, chữ sun
│ │ KHỞI HÀNH · DEPARTURES │ │
│ │ CHUYẾN  ĐẾN     GIỜ    │ │
│ │ HP1411  HẠNH PHÚC 18:00│ │  ← mỗi ký tự là 1 ô lật
│ │ TRẠNG THÁI: ĐÚNG GIỜ   │ │
│ │ ┌──┐┌──┐ ┌──┐┌──┐ …    │ │
│ │ │4 ││5 │:│0 ││6 │      │ │  ← A7 split-flap
│ │ └──┘└──┘ └──┘└──┘      │ │
│ │ ngày    giờ   phút giây│ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │  ← surface
│ │   THÁNG MƯỜI MỘT 2026  │ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │  …  12 13 [14✈] 15 …   │ │  ← ô ngày cưới nền sun, icon máy bay
│ └────────────────────────┘ │
└────────────────────────────┘
```

**Nội dung:** mã chuyến `HP` + `ddMM` của ngày cưới (vd `HP1411`). "ĐẾN: HẠNH PHÚC". Giờ = giờ tiệc. Trạng thái: trước ngày cưới *"ĐÚNG GIỜ"*, trong ngày *"ĐANG LÊN MÁY BAY"*, sau ngày cưới *"ĐÃ HẠ CÁNH ♥"* và đếm ngược thay bằng *"Chúng tôi đã hạ cánh an toàn xuống tổ ấm."* ⚠️ phụ thuộc `date`, fallback ngày mẫu.

**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Bảng A1 |
| 0.3s | Từng ô chữ của dòng HP1411… lật qua 4–8 ký tự ngẫu nhiên trước khi dừng ở ký tự đúng (split-flap, mỗi lật 0.06s, các ô stagger 0.04s) |
| 1.2s | Lịch A1; ô ngày cưới `scale 0.6 → 1` + máy bay nhỏ bay vào ô |
| mỗi giây | Chữ số đếm ngược A7 khi đổi |

**Reduced-motion:** không lật ngẫu nhiên, hiện thẳng giá trị; A7 đổi thành thay số tức thì.

---

### C12 · Lịch trình chuyến bay

**Wireframe:**
```
┌────────────────────────────┐
│     HÀNH TRÌNH · ITINERARY │
│ 17:00 ●─ Check-in          │  ← icon vali
│       │  Đón khách         │
│ 18:00 ●─ Cất cánh          │  ← icon nhẫn
│       │  Làm lễ thành hôn  │
│ 18:30 ●─ Phục vụ bữa ăn    │  ← icon đĩa
│       │  Khai tiệc         │
│ 20:00 ●─ Giải trí          │  ← icon ly
│          Giao lưu, chụp ảnh│
│  Tổng thời gian bay: 4h ✈  │
└────────────────────────────┘
```
**Nội dung:** 4 chặng viết sẵn, giờ tính từ `date` (−1h, 0, +30′, +2h) như letter-2d. Mỗi chặng có "tên hàng không" (Check-in / Cất cánh / Phục vụ bữa ăn / Giải trí) và "nghĩa thật" bên dưới.
**Animation:** trục dọc là **đường nét đứt** (không phải nét liền) vẽ bằng A6 scrub; máy bay nhỏ chạy trên trục theo cùng progress. Mỗi chặng A1 khi máy bay đi qua.

---

### C16 · Giải trí trên máy bay

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← màn hình ghế ngồi, viền navy dày
│ │ ▶ ĐANG PHÁT            │ │
│ │ Bài hát của chúng tôi  │ │
│ │ ━━━━●──────── 1:12     │ │  ← thanh tiến độ thật
│ │   [ ▶ / ❚❚ ]   🎧       │ │
│ └────────────────────────┘ │
│  Chạm để nghe bài hát      │
│  của chúng tôi             │
└────────────────────────────┘
```
**Hành vi:** dùng chung audio với `<MusicPlayer>`. Nút ▶/❚❚ 48px. Icon tai nghe `aria-hidden`.
**Animation:** màn hình "bật" — `scaleY 0.02 → 1` rồi nội dung fade (0.5s), như TV cũ bật lên.

---

### C8 · Dãy cửa sổ máy bay (album, cuộn ngang T5)

**Mục đích:** ngắm ảnh cưới như nhìn qua các ô cửa sổ khi máy bay lướt đi.

**Wireframe (khung nhìn, đang cuộn ngang):**
```
┌────────────────────────────┐
│ KHOẢNH KHẮC · VIEW         │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← thân máy bay (surface, vân panel)
│ ░ ╭──────╮   ╭──────╮   ╭─ │
│ ░ │ảnh 3 │   │ảnh 4 │   │  │  ← cửa sổ rounded-[40%], 3:4
│ ░ │      │   │      │   │  │
│ ░ ╰──────╯   ╰──────╯   ╰─ │
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│   ← cuộn để nhìn ra ngoài  │
└────────────────────────────┘
```
**Nội dung:** `images[3..]` (số lượng = `images.length - 3`, tối thiểu 3). Mỗi cửa sổ có `alt="Ảnh cưới i/n"`.
**Animation:** A5: ghim section, track `x: -(scrollWidth - innerWidth)`, `scrub: 1`. Ảnh bên trong mỗi cửa sổ dịch ngược `xPercent: 10 → -10` (parallax trong khung). Rèm cửa sổ (tấm che `surface` phía trên) kéo lên `yPercent -100` khi cửa sổ đi vào giữa màn hình (`containerAnimation`).
**Tương tác:** chạm cửa sổ → A10 lightbox; phím ←/→ trong lightbox.
**Reduced-motion:** không ghim; lưới 2 cột cuộn dọc, rèm đã mở sẵn.
**Edge case:** chỉ 3 ảnh album thì track ngắn → chiều cao ghim tính theo số ảnh (`n × 60svh`, tối thiểu 150svh).

---

### C6 + C7 · Boarding pass (hai lễ + bản đồ)

**Mục đích:** trung tâm của mẫu: tấm vé chứa toàn bộ thông tin tiệc.

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ HẠNH PHÚC AIRLINES  ✈  │ │  ← header navy
│ │ BOARDING PASS          │ │
│ │ FROM            TO     │ │
│ │ NHÀ TRAI  ─✈─  NHÀ GÁI │ │  ← Montserrat 800 22px
│ │ Quận 1,TP.HCM  Ba Đình │ │  ← address 12px, 2 dòng, ellipsis
│ │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │ │
│ │ DATE      BOARDING GATE│ │
│ │ 14 NOV    17:00    ♥   │ │
│ │ FLIGHT    DEPART   SEAT│ │
│ │ HP1411    18:00    VIP │ │
│ │ GATE: {venue.name}     │ │
│ ◖┈┈┈┈┈┈┈ xé tại đây ┈┈┈┈┈◗ │  ← khấc tròn 2 bên
│ │ ▌▌▌▌ ▌▌ ▌▌▌ ▌ ▌▌▌▌ ▌▌▌ │ │  ← mã vạch trang trí
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ LỄ VU QUY · 08:00      │ │  ← vé phụ nhỏ hơn: lễ tại tư gia
│ │ Tư gia nhà gái         │ │
│ │ {bride.address}        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │      <MapEmbed/>       │ │  ← 16:10, rounded-xl
│ └────────────────────────┘ │
│ [ ⌖ Chỉ đường tới cổng ]   │
└────────────────────────────┘
```
**Nội dung:** FROM = nhà trai, TO = nhà gái (theo ý tưởng gốc: hành trình từ nhà trai sang nhà gái). DATE/DEPART từ `date` ⚠️. GATE = `{venue.name}` (không có thì *"Nhà hàng tiệc cưới"*). SEAT luôn là "VIP". Link chỉ đường `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`.
**Animation:**
| t | Hành động |
|---|---|
| 0.0s | Vé trượt ra từ dưới như từ máy in vé: `clip-path: inset(0 0 100% 0) → inset(0)` (0.9s, `power2.out`) |
| 0.6s | Đường cong FROM→TO vẽ A6, máy bay bay theo đường bằng MotionPath (1.2s) |
| 1.2s | Các trường dữ liệu A1 stagger 0.05 |
| 1.5s | Vé phụ và bản đồ A1 |

**Lưu ý:** `<MapEmbed>` chỉ mount khi section cách viewport < 1 màn hình (IntersectionObserver `rootMargin: "100% 0px"`).
**Edge case:** địa chỉ dài → `line-clamp-2` trên vé, địa chỉ đầy đủ vẫn nằm ở vé phụ / C2+C3.

---

### C13 · Hành lý xách tay (dress code)

```
┌────────────────────────────┐
│  HÀNH LÝ XÁCH TAY          │
│  Quy định trang phục:      │
│  Lịch sự · tông xanh–trắng │
│ ┌──┐ ┌──┐ ┌──┐ ┌──┐        │  ← tem hành lý bo góc, mỗi tem 1 màu
│ │  │ │  │ │  │ │  │        │     #FFFFFF #C9D6E8 #0B3D91 #F7B32B
│ └──┘ └──┘ └──┘ └──┘        │
│ Trắng Xanh nhạt Navy Vàng  │
└────────────────────────────┘
```
**Animation:** các tem hành lý rơi xuống theo băng chuyền: `x: 120 → 0` stagger 0.1, `rotate` ngẫu nhiên ±6°.

---

### C14 · Duty free · Mừng cưới

```
┌────────────────────────────┐
│  DUTY FREE                 │
│  Sự hiện diện của bạn là   │
│  món quà quý nhất.         │
│ ┌─────────┐  ┌─────────┐   │
│ │   QR    │  │   QR    │   │  ← QR mẫu ⚠️ §8.3
│ │ nhà trai│  │ nhà gái │   │
│ └─────────┘  └─────────┘   │
└────────────────────────────┘
```
**Hành vi:** chạm QR → A10 phóng to. Nhãn QR ghi rõ *"QR mẫu"* khi đang dùng dữ liệu mẫu. Nếu sau này §8.3 chốt cho upload QR thì thay ảnh QR, layout giữ nguyên.

---

### C15 · Làm thủ tục (RSVP, chỉ giao diện)

```
┌────────────────────────────┐
│  QUẦY LÀM THỦ TỤC          │
│  Họ tên hành khách         │
│  [                    ]    │
│  ( ) Tôi sẽ lên chuyến bay │
│  ( ) Rất tiếc, tôi lỡ chuyến│
│  Số hành khách: [ 1 ▾ ]    │
│  [ ✈ Check-in ]            │
│  Bản xem thử — không gửi đi│
└────────────────────────────┘
```
**Hành vi:** bấm "Check-in" → form thu lại, **in ra một vé mini** mang tên khách (`clip-path` từ trên xuống 0.6s): *"Chào mừng {tên} lên chuyến bay HP1411! ♥"*. Không gửi dữ liệu. Tên khách trống thì nút disabled.

---

### C10 · Xé cuống vé (lời cảm ơn)

```
┌────────────────────────────┐
│ ╭──────────────╮           │  ← images[n-1], khung cửa sổ lớn
│ │  ẢNH CUỐI    │           │
│ ╰──────────────╯           │
│ ┌────────────────────────┐ │
│ │ CHÚC QUÝ KHÁCH MỘT     │ │
│ │ CHUYẾN BAY VUI VẺ!     │ │
│ │ Cảm ơn vì đã đồng hành │ │
│ │ cùng Minh Quân & Thu Hà│ │
│ ◖┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈◗ │
│ │ HP1411 · ONE WAY · ♥   │ │  ← cuống vé
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Animation (scrub khi section đi từ 30% → 80%):** cuống vé tách ra dọc đường răng cưa: `y: 0 → 40`, `rotate: 0 → 6°`, mép xé hiện ra (mask răng cưa). Đồng thời máy bay tiến độ đến cuối đường bay và "hạ cánh" (`scale 1 → 0.6`, đổi icon thành ♥). Đây là điểm kết của đường bay.
**Reduced-motion:** cuống vé tách sẵn, không scrub.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | Thumbnail/OG; nền mờ phía sau hộ chiếu ở C1 (blur 24px, opacity 0.25) | 3:4 |
| `images[1]` | C2+C3 trang chú rể | 3:4 |
| `images[2]` | C2+C3 trang cô dâu | 3:4 |
| `images[3..5]` | C4 ba con dấu + C8 cửa sổ | 3:4 |
| `images[3..n-2]` | C8 (nếu người dùng upload nhiều hơn) | 3:4 |
| `images[n-1]` | C10 ảnh cuối | 4:3 |

`meta.media = { images: 7, videos: 0 }` (7 = bìa + 2 chân dung + 3 album + 1 ảnh cuối). Nếu upload > 7, ảnh thừa được thêm vào C8.

Trường ⚠️: `date` (giờ bay, mã chuyến, lịch, đếm ngược) — fallback ngày mẫu cố định; tên bố mẹ — ẩn trường; QR — QR mẫu.

---

## 7. Triển khai code

### 7.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/boarding-2d/
├── meta.ts
├── layout.tsx                  # Montserrat + Space_Mono (vietnamese)
├── page.tsx                    # return <BoardingInvite />
└── _components/
    ├── boarding-invite.tsx     # "use client" — ghép section, SmoothScroll, tokens `t`
    ├── flight-path.tsx         # SVG đường bay toàn trang + máy bay tiến độ (fixed)
    ├── passport-cover.tsx      # C1
    ├── ticket.tsx              # khung vé có khấc + đường xé (dùng lại ở C6, C15, C10)
    ├── split-flap.tsx          # ô chữ lật (C5)
    ├── flight-utils.ts         # flightCode(date), mrzLine(name), flightStatus(date, now)
    ├── flight-utils.test.ts
    ├── sections/
    │   ├── passport-pages.tsx  # C2+C3
    │   ├── visa-stamps.tsx     # C4
    │   ├── departures.tsx      # C5+C11
    │   ├── itinerary.tsx       # C12
    │   ├── inflight.tsx        # C16
    │   ├── windows-track.tsx   # C8
    │   ├── boarding-pass.tsx   # C6+C7
    │   ├── baggage.tsx         # C13
    │   ├── duty-free.tsx       # C14
    │   ├── check-in.tsx        # C15
    │   └── tear-stub.tsx       # C10
    └── svg/                    # guilloche, emblem, plane, stamps, 6 icon
```
Dùng chung: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets` từ `@/kit`; `MapEmbed` từ `@/components`; dữ liệu từ `useWedding()`.

### 7.2 Tokens Tailwind
```ts
export const t = {
  root: "min-h-screen bg-[#EEF4FB] text-[#0B1F3A] font-(family-name:--font-mono)",
  display: "font-(family-name:--font-display) font-extrabold uppercase",
  heading: "font-(family-name:--font-display) text-[13px] lg:text-[15px] font-bold tracking-[0.18em] uppercase",
  ticket: "bg-white rounded-2xl border border-[#C9D6E8] shadow-[0_12px_32px_-12px_rgba(11,31,58,0.35)]",
  navy: "bg-[#0B3D91] text-white",
  board: "bg-[#072A66] text-[#F7B32B]",
  label: "text-[11px] tracking-[0.12em] uppercase text-[#52627A]",
  notch: "[mask-image:radial-gradient(circle_at_0_62%,transparent_14px,#000_15px),radial-gradient(circle_at_100%_62%,transparent_14px,#000_15px)] [mask-composite:intersect]",
} as const;
```
(Mask 2 lớp dùng `mask-composite: intersect` qua arbitrary property; nếu Safari cũ lỗi thì fallback: 2 `<span>` tròn màu `bg` đè lên mép.)

### 7.3 Mở hộ chiếu (C1)
```tsx
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } })
    .to(".cover", { rotate: 0, scale: 1.05, duration: 0.3 })
    .to(".cover", { rotateY: -180, duration: 0.9, ease: "power2.inOut" }, 0.3) // origin-left, [perspective:1400px] ở cha
    .to(".cover", { autoAlpha: 0, duration: 0.3 }, 1.0)
    .fromTo(".first-page", { scale: 0.7 }, { scale: 1, duration: 0.6 }, 1.2)
    .call(onOpened);
}, { scope: root });

<button onClick={() => { music.play(); tl.current?.play(); }}>✈ Mở hộ chiếu</button>
```

### 7.4 Đường bay + máy bay tiến độ
```tsx
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, DrawSVGPlugin);
useGSAP(() => {
  if (reduced) return;
  gsap.from("#route", { drawSVG: "0%", ease: "none",
    scrollTrigger: { trigger: main, start: "top top", end: "bottom bottom", scrub: 0.5 } });
  gsap.to("#plane", { ease: "none",
    motionPath: { path: "#route-mini", align: "#route-mini", autoRotate: 90, alignOrigin: [0.5, 0.5] },
    scrollTrigger: { trigger: main, start: "top top", end: "bottom bottom", scrub: 0.5 } });
}, { scope: root, dependencies: [reduced] });
```
`#route-mini` là bản thu nhỏ của đường bay nằm trong lớp `fixed` cao `calc(100svh-160px)`, `top-[72px]` — để máy bay luôn nằm trong viewport và tránh 2 góc nút chung.

### 7.5 Split-flap (C5)
- Mỗi ô là 2 nửa (`overflow-hidden h-1/2`), nửa trên lật `rotateX: 0 → -90`, nửa dưới `90 → 0`.
- Hàm thuần `flapSequence(from, to, alphabet)` trả mảng ký tự trung gian (4–8 bước, dùng seed cố định theo index để SSR/CSR khớp). Có test.

### 7.6 Cuộn ngang (C8)
```tsx
const tween = gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: "none",
  scrollTrigger: { trigger: section, pin: true, scrub: 1, end: () => `+=${track.scrollWidth}`, invalidateOnRefresh: true } });
windows.forEach(w => gsap.to(w.querySelector(".shade"), { yPercent: -100,
  scrollTrigger: { trigger: w, containerAnimation: tween, start: "left 70%", end: "left 40%", scrub: true } }));
```

### 7.7 Logic cần test (`flight-utils.test.ts`)
- `flightCode(new Date(2026,10,14))` → `"HP1411"`.
- `mrzLine("Nguyễn Minh Quân")` → chỉ chứa `A–Z<`, dài đúng 28, đ → D.
- `flightStatus(date, now)` → `"ontime" | "boarding" | "landed"` ở 3 mốc biên (trước 1 giây, cùng ngày, sau ngày).
- `flapSequence` kết thúc đúng ký tự đích, độ dài 4–8.

### 7.8 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens → trang có font đúng, kiểm dấu tiếng Việt trên Space Mono
2. `flight-utils.ts` + test
3. `ticket.tsx` và các section tĩnh C2 → C10, khớp wireframe 360px / 1440px
4. `passport-cover.tsx` + nhạc
5. Trang hộ chiếu ghim + lật T7
6. `flight-path.tsx` (đường bay + máy bay tiến độ)
7. Split-flap, con dấu, cuộn ngang C8, xé cuống
8. Reduced-motion, tên 50 ký tự, Lighthouse, checklist template-spec §12

---

## 8. Asset cần chuẩn bị
- [ ] SVG: bìa hộ chiếu + emblem máy bay-trái tim, guilloche, 3 con dấu (tròn, chữ nhật, oval), máy bay, 6 icon, mã vạch trang trí
- [ ] `music.mp3` (Pixabay, lounge 90–100 BPM) + (tuỳ chọn) `chime.mp3` ≤ 1s, ghi `CREDITS.md`
- [ ] 7 ảnh mẫu tông trời xanh / du lịch (Unsplash) ≤ 300KB `.webp`
- [ ] 2 ảnh QR mẫu (placeholder)
- [ ] `thumb.webp` 600×800: hộ chiếu mở hé, boarding pass thò ra
- [ ] `opengraph-image.png` 1200×630: boarding pass nằm ngang

## 9. Tiêu chí nghiệm thu riêng
- [ ] Từ lúc bấm "Mở hộ chiếu" tới lúc cuộn được ≤ 2 giây; nhạc phát ngay khi bấm
- [ ] Máy bay tiến độ bám đúng progress trang, không đè góc trên-trái/dưới-phải/trên-phải ở 360px
- [ ] Đường bay không đè chữ ở 360px (nằm trong lề 16px)
- [ ] Split-flap dừng đúng ký tự, không nhảy layout (mỗi ô có kích thước cố định)
- [ ] Cuộn ngang C8 mượt 60fps trên điện thoại tầm trung, và đổi thành lưới dọc khi reduced-motion
- [ ] Dấu tiếng Việt hiển thị đúng trên Space Mono; tên 50 ký tự không vỡ trang hộ chiếu và boarding pass
- [ ] Trạng thái chuyến bay đổi đúng khi đặt `date` trước/đúng/sau hôm nay
