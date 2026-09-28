# 2D-26 · `da-lat-2d` · Sương Đà Lạt

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu tham chiếu cấu trúc: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Khách đứng trên một con dốc Đà Lạt lúc 5 giờ sáng. Sương phủ kín đồi thông; càng cuộn xuống, sương càng mỏng, từng tấm thiệp kính mờ hiện ra sau màn sương, và ở cuối trang mặt trời lên, sương tan hẳn.

**Cảm xúc muốn gợi:** tĩnh, se lạnh, hơi hoài niệm, như một buổi sáng đi dạo cùng người thương. Nhịp chậm, nhiều khoảng thở.

**Phù hợp với:** cặp đôi yêu Đà Lạt, chụp ảnh cưới ở đồi thông / hồ / nhà gỗ, thích tông xanh rêu trầm, ảnh màu film lạnh. Hợp với tiệc cưới sân vườn, tiệc nhỏ ấm cúng.

**Khác các mẫu khác ở chỗ:** không có "chồng thiệp" hay "trang sách". Trang là **một phong cảnh liên tục**: nền đồi thông 4 lớp được ghim cố định phía sau (A4), nội dung trôi qua phía trước. Chuyển cảnh chủ đạo là **"sương dày lên rồi tan"** (biến thể T2): giữa hai section, một dải sương trắng dâng lên che màn hình rồi rút đi, card mới hiện từ `blur(12px)` về rõ nét. Mức sương tổng thể giảm dần theo tiến độ cuộn → thời gian trong ngày trôi từ bình minh sớm tới lúc nắng lên.

**Moodboard:** đồi thông Trại Mát, hồ Tuyền Lâm lúc sương, nhà gỗ mái dốc có ống khói, hoa dã quỳ vàng (chỉ điểm xuyết cuối trang), cửa kính đọng hơi nước, áo len dệt kim.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#E7ECE8` | Nền trời sương, màu nền phần tử gốc |
| `glass` | `#FFFFFF` @ 72% (`bg-white/70`) + `backdrop-blur-md` | Nền card kính mờ |
| `pine` | `#2F4F3E` | Màu chủ đạo: nút, tiêu đề, lớp đồi gần nhất |
| `pine-mid` | `#4E6B5A` | Lớp đồi giữa, icon |
| `sage` | `#B7C4B0` | Lớp đồi xa, đường kẻ, viền card (trang trí, không làm màu chữ) |
| `fog` | `#F4F6F3` | Dải sương (gradient trong suốt → `fog`) |
| `ink` | `#1F2D25` | Chữ chính |
| `ink-soft` | `#55665B` | Chữ phụ, chú thích |
| `sun` | `#E8C79A` | Chỉ dùng ở C10: quầng nắng, hoa dã quỳ |

Tương phản: `ink` trên `glass` (≈ trắng) khoảng 14:1 ✅. `ink-soft` trên `glass` khoảng 5.9:1 ✅, trên `bg` khoảng 5.1:1 ✅. Chữ trắng trên `pine` khoảng 9.5:1 ✅. `sage` và `sun` **không** dùng cho chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Cormorant Garamond 300 italic | 48px / 1.05 | 88px | Mảnh, như viết trên kính mờ |
| Tiêu đề section | Manrope 600, VIẾT HOA, tracking 0.3em | 12px | 13px | Ví dụ "NGÀY CHÚNG TÔI VỀ CHUNG NHÀ" |
| Số lớn (ngày, giờ) | Cormorant Garamond 300 | 88px | 128px | Chữ số kiểu cũ (oldstyle) mặc định của font |
| Trích dẫn / lời văn | Cormorant Garamond 400 italic | 22px / 1.4 | 28px | |
| Nội dung | Manrope 400 | 15px / 1.7 | 16px | |
| Nhãn nhỏ | Manrope 500, tracking 0.15em | 11px | 12px | |

Cả hai font đều có subset `vietnamese`. Kiểm tra: *Nguyễn Thị Hằng, Trịnh Đức Hưởng*.

### Hình khối và chất liệu
- **Card kính mờ**: `rounded-2xl bg-white/70 backdrop-blur-md border border-white/60 shadow-[0_20px_60px_-20px_rgba(31,45,37,0.35)]`. Trên máy không hỗ trợ `backdrop-filter` thì nền `bg-white/90` (Tailwind `supports-[backdrop-filter]:bg-white/70`).
- **Đồi thông**: 4 lớp SVG ngang (`viewBox 0 0 1440 400`), mỗi lớp một màu từ `sage` → `pine`, rặng thông vẽ bằng tam giác răng cưa. Lớp gần nhất có ngôi nhà gỗ nhỏ, ống khói.
- **Sương**: `div` phủ `bg-[linear-gradient(to_top,#F4F6F3_0%,#F4F6F3cc_40%,transparent_100%)]`, thêm 2 "cụm mây" SVG mờ (`blur-2xl`) trôi ngang.
- **Hạt sương / bụi nước**: không dùng (tránh trùng A8 của các mẫu khác, và tiết kiệm GPU cho `backdrop-blur`).
- **Ảnh**: bo `rounded-2xl`, phủ nhẹ `bg-[#E7ECE8]/10` và `saturate-[.85]` để ảnh ăn tông sương.
- **Icon**: nét 1.5px màu `pine-mid`, 6 icon tự vẽ: nhà gỗ, cây thông, ly cà phê, nhẫn, đĩa, ngọn lửa (lửa trại).
- **Motion**: ease chủ đạo `sine.inOut`. Vào 1.2s, ra 0.8s. Mọi thứ chậm, không nảy.

---

## 3. Nhạc

- **Tâm trạng**: indie piano mộc, hơi buồn nhẹ, có tiếng mưa/gió rất khẽ là được, không lời.
- **Tempo**: 65–75 BPM. **Độ dài**: 2:30–3:00, lặp lại.
- **Từ khoá Pixabay**: `indie piano misty`, `calm piano morning`, `lofi piano rain soft`
- **Hành vi**:
  - Bắt đầu khi bấm nút ở C1. Âm lượng 0 → 0.6 trong 2.5 giây (chậm hơn chuẩn 1.5s một chút cho hợp nhịp sương tan).
  - Không có C16 riêng; nút nổi góc trên phải là nơi duy nhất bật/tắt.
  - Ẩn tab thì tạm dừng, quay lại thì phát tiếp.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  Đồi thông phủ sương    │ 100svh (cố định tới khi mở)
├───────────────────────────┤  ┌─ nền đồi thông 4 lớp: position fixed,
│ C2  Tên trên đồi           │ 120svh │  A4 parallax suốt trang
│  ~ sương dâng/tan ~        │  40svh │
│ C3  Hai người              │ 110svh │  Độ dày sương tổng: 100% ở C2
│ C4  Ba buổi sáng (chuyện)  │ 180svh │  → 0% ở C10 (scrub theo
│  ~ sương dâng/tan ~        │  40svh │  toàn trang)
│ C5+C11 Ngày cưới + lịch    │ 120svh │
│ C12 Một ngày trên đồi      │ 110svh │
│ C6+C7 Lễ & đường lên đồi   │ 150svh │
│  ~ sương dâng/tan ~        │  40svh │
│ C8  Album cửa sổ kính      │ 160svh │
│ C14 Mừng cưới              │  80svh │
│ C15 Xác nhận               │ 100svh │
│ C10 Nắng lên               │ 110svh └─
└───────────────────────────┘
```

Chiều rộng nội dung: card `w-[min(90vw,480px)]`, căn giữa. Desktop ≥ 1024px: card lệch sang trái hoặc phải xen kẽ (`lg:ml-[12vw]` / `lg:mr-[12vw]`) để lộ phong cảnh — người xem thấy đồi thông giữa các card, đây là khác biệt so với các mẫu "card giữa màn hình".

Ba "dải sương" (~40svh mỗi dải) là khoảng trống có tác dụng làm chuyển cảnh, không chứa nội dung.

---

## 5. Chi tiết từng section

### C1 · Đồi thông phủ sương (màn mở thiệp)

**Mục đích:** tạo không khí ngay từ giây đầu; bấm nút là thao tác người dùng cho phép phát nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← sương dày, gần như trắng
│ ░░░░  ĐÀ LẠT · MÙA CƯỚI ░░ │  ← nhãn nhỏ, ink-soft
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│ ░░░   Minh Quân   ░░░░░░░░ │  ← Cormorant italic 40px, mờ 60%
│ ░░░░░░   &   ░░░░░░░░░░░░░ │
│ ░░░░░░   Thu Hà   ░░░░░░░░ │
│ ░░ /\  /\/\   /\ ░░░░░░░░░ │  ← lớp đồi xa (sage) lờ mờ
│ /\/  \/    \/\/  \/\ ⌂ ░░░ │  ← lớp gần, nhà gỗ
│                            │
│    ( Mở thiệp mời )        │  ← nút pill pine, 48px cao
│  Chạm để vén màn sương     │  ← 12px ink-soft
└────────────────────────────┘
```

**Nội dung:**
- Nhãn: "ĐÀ LẠT · MÙA CƯỚI" (viết sẵn; không lấy địa danh từ dữ liệu vì `venue` có thể ở nơi khác — đây là chủ đề, không phải địa chỉ).
- Tên: `{groom.name}` & `{bride.name}`
- Nút: "Mở thiệp mời". Dòng phụ: *"Chạm để vén màn sương"*

**Animation (timeline vào):**
| t | Hành động |
|---|---|
| 0.0s | 4 lớp đồi fade từ xa tới gần, stagger 0.2s (`opacity 0 → 1`, `y: 20 → 0`, 1.2s) |
| 0.6s | Tên fade `opacity 0 → 0.6`, `filter: blur(8px) → blur(2px)` (1.4s) |
| 1.4s | Nút A1 |
| lặp | Hai cụm mây trôi ngang `x: -10% ↔ 10%`, 14s, `sine.inOut`, yoyo |
| lặp | Khói ống khói: 3 vòng tròn nhỏ `y: 0 → -30`, `opacity 0.5 → 0`, 3s, stagger 1s |

**Khi bấm nút (timeline mở, tổng 2.2s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu, fade-in 2.5s |
| 0.0s | Nút `scale → 0.9`, `opacity → 0` (0.3s) |
| 0.1s | Sương tách đôi: nửa trái `xPercent: 0 → -110`, nửa phải `0 → 110` (1.6s, `sine.inOut`) |
| 0.4s | Tên `opacity → 1`, `blur → 0` (1.2s) |
| 0.8s | Lớp đồi dịch `yPercent` theo độ sâu (xa −2, gần −8) như máy ảnh lùi nhẹ (1.4s) |
| 2.2s | Mở khoá cuộn, khởi tạo ScrollSmoother, C1 trở thành phần đầu của C2 (không có cắt cảnh) |

**Reduced-motion:** không tách sương; sương fade `opacity → 0.3` trong 0.4s, bỏ khói và mây trôi.
**Edge case:** tên > 20 ký tự → cỡ 32px, cho xuống dòng, `text-balance`.

---

### C2 · Tên trên đồi

**Mục đích:** thông tin cốt lõi: ai cưới, ngày nào, lời mời.

**Wireframe:**
```
┌────────────────────────────┐
│                            │
│   TRÂN TRỌNG KÍNH MỜI      │  ← nhãn 12px tracking 0.3em
│                            │
│   Minh Quân                │  ← 48px italic, căn trái
│            &               │
│              Thu Hà        │  ← căn phải (lệch như chữ trên kính)
│                            │
│  ─────────                 │  ← đường sage A6
│  14 · 11 · 2026            │  ← Manrope 15px, cần `date` ⚠️
│  Thứ Bảy, giữa mùa dã quỳ  │  ← italic 18px
│                            │
│  /\/\  ⌂  /\/\/\  /\/\     │  ← đồi (nền fixed, không thuộc section)
└────────────────────────────┘
```

**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · tên · ngày `dd · MM · yyyy` · dòng thơ theo tháng (viết sẵn 12 câu, ví dụ tháng 11: *"Thứ Bảy, giữa mùa dã quỳ"*, tháng 12: *"Thứ Bảy, khi đồi thông vào đông"*…). Chưa có `date` ⚠️ → dùng ngày mẫu 14.11.2026.

Không có card kính ở section này: chữ nằm trực tiếp trên nền sương (đủ tương phản vì sương ở đây còn dày, gần `fog`).

**Animation:** A2 theo `chars`, nhưng thay mask bằng `filter: blur(10px) → 0` + `opacity`, stagger 0.04. Đường kẻ A6. Ngày A1.

**Chuyển sang C3:** dải sương #1 (xem 8.4). Khi cuộn qua, `FogBand` dâng `yPercent 100 → 0` rồi `0 → -100`, đồng thời chữ C2 blur ra `0 → 8px`.

---

### C3 · Hai người

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← card kính mờ
│ │ ┌──────────┐           │ │
│ │ │ images[1]│ CHÚ RỂ    │ │  ← ảnh 4:5, rộng 55%
│ │ │          │ Minh Quân │ │
│ │ └──────────┘ Quận 1,   │ │
│ │              TP.HCM    │ │
│ │ ────────────────────── │ │
│ │ CÔ DÂU     ┌──────────┐│ │
│ │ Thu Hà     │ images[2]││ │  ← đảo bên
│ │ Ba Đình,   │          ││ │
│ │ Hà Nội     └──────────┘│ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** `groom.name` + `groom.address`, `bride.name` + `bride.address`. Tên bố mẹ ⚠️ (chưa có trường): nếu có thì thêm dòng "Con ông … và bà …" 13px trên tên; nếu không thì bỏ trống, không hiển thị chỗ trống.
**Animation:** card từ sương ra: `filter: blur(12px) → 0`, `opacity 0 → 1`, `y: 30 → 0`, 1.2s. Ảnh bên trong A3 nhưng chạy theo chiều ngang (`inset(0 100% 0 0) → inset(0)`), ảnh 2 ngược chiều.
**Edge case:** địa chỉ dài → tối đa 3 dòng (`line-clamp-3`). Màn < 340px → ảnh lên trên, chữ xuống dưới.

---

### C4 · Ba buổi sáng (chuyện tình)

**Mục đích:** kể chuyện bằng 3 cảnh "buổi sáng", mỗi cảnh một card xuất hiện ở một độ cao khác nhau trên sườn đồi.

**Wireframe:**
```
┌────────────────────────────┐
│   BA BUỔI SÁNG             │
│ ┌──────────────┐           │  ← card 1 lệch trái
│ │ images[3]    │           │
│ │ 06:10 · Lần đầu gặp      │
│ │ "Một buổi sáng sương..." │
│ └──────────────┘           │
│           ┌──────────────┐ │  ← card 2 lệch phải
│           │ images[4]    │ │
│           │ 05:45 · Yêu  │ │
│           └──────────────┘ │
│ ┌──────────────┐           │  ← card 3 lệch trái
│ │ images[5]    │           │
│ │ 06:30 · Lời hứa          │
│ └──────────────┘           │
│  · · · đường mòn nét chấm  │  ← path SVG nối 3 card, A6 scrub
└────────────────────────────┘
```
**Nội dung (viết sẵn):**
1. **06:10 · Lần đầu gặp** — *"Một buổi sáng sương dày, hai người lạ cùng đứng chờ một ly cà phê nóng."*
2. **05:45 · Thương** — *"Có những con dốc chỉ muốn đi cùng một người, dù trời còn chưa sáng."*
3. **06:30 · Lời hứa** — *"Giữa đồi thông, một câu hỏi, một cái gật đầu."*

**Animation:** đường mòn nét chấm (`stroke-dasharray`) A6 theo scrub từ card 1 → 3. Mỗi card hiện từ sương (như C3) khi đường mòn chạm tới, dùng `ScrollTrigger` riêng `start: "top 75%"`.
**Chuyển sang C5:** dải sương #2.
**Edge case:** thiếu `images[5]` không xảy ra vì `media.images = 8` bắt buộc đủ.

---

### C5 + C11 · Ngày cưới và lịch

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │  ← card kính
│ │  NGÀY CHÚNG TÔI VỀ     │ │
│ │  CHUNG NHÀ             │ │
│ │          14            │ │  ← 88px, pine
│ │   THÁNG MƯỜI MỘT 2026  │ │
│ │ ────────────────────── │ │
│ │ T2 T3 T4 T5 T6 T7 CN   │ │
│ │                      1 │ │
│ │  2  3  4  5  6  7  8   │ │
│ │  9 10 11 12 13 (14) 15 │ │  ← vòng tròn nét mảnh pine A6
│ │ ────────────────────── │ │
│ │  45    06    12    33  │ │  ← đếm ngược A7
│ │ ngày  giờ  phút  giây  │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** tháng bằng chữ tiếng Việt, tuần bắt đầu Thứ Hai, đếm ngược tới `date`. Đã qua ngày cưới → *"Chúng tôi đã về chung một nhà, cảm ơn vì đã ghé thăm."*
**Animation:** card từ sương; "14" `opacity` + `blur` như hơi thở trên kính. Vòng tròn A6 vẽ 0.8s quanh ngày. A7 lật số.
**Edge case:** `date` chưa có ⚠️ → ngày mẫu; đếm ngược âm → hiện câu "đã về chung nhà".

---

### C12 · Một ngày trên đồi (lịch trình)

**Wireframe:**
```
┌────────────────────────────┐
│   MỘT NGÀY TRÊN ĐỒI        │
│                            │
│  15:30 ─(☕)─ Đón khách     │  ← đường ngang như đường chân trời,
│  16:00 ─(💍)─ Làm lễ        │    mỗi mốc là một cây thông nhỏ
│  17:00 ─(🍽)─ Khai tiệc     │    (icon tự vẽ, không dùng emoji)
│  19:30 ─(🔥)─ Lửa trại      │
│                            │
└────────────────────────────┘
```
**Nội dung (viết sẵn, giờ suy ra từ `date`):** đón khách = giờ tiệc − 1h30, làm lễ = −1h, khai tiệc = giờ tiệc, lửa trại & giao lưu = +2h30. Nếu `date` không có giờ, giờ tiệc mặc định 17:00.
**Animation:** danh sách **không có card**: 4 dòng chữ đặt thẳng lên lớp đồi thông; mỗi dòng A1 khi vào; icon cây thông "mọc" `scaleY 0 → 1` từ gốc (`origin-bottom`), stagger 0.15.

---

### C6 + C7 · Lễ cưới và đường lên đồi

**Wireframe:**
```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ LỄ GIA TIÊN            │ │
│ │ 08:00 · Thứ Bảy        │ │
│ │ Tư gia nhà gái         │ │
│ │ {bride.address}        │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ TIỆC CƯỚI              │ │
│ │ 17:00 · Thứ Bảy        │ │
│ │ {venue.name}           │ │
│ │ ┌────────────────────┐ │ │
│ │ │ <MapEmbed/> 4:3    │ │ │
│ │ └────────────────────┘ │ │
│ │ [ Chỉ đường lên đồi → ]│ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** `{bride.address}`, `{venue.name}` (thiếu → "Nhà hàng tiệc cưới"). Link chỉ đường `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`, `target="_blank" rel="noopener"`.
**Animation:** hai card từ sương, card 2 trễ 0.2s. `MapEmbed` bọc trong vùng chỉ mount khi cách viewport < 1 màn hình (IntersectionObserver `rootMargin: "100% 0px"`).
**Chuyển sang C8:** dải sương #3 (dải cuối, mỏng nhất: `opacity` tối đa 0.7).

---

### C8 · Album cửa sổ kính

**Mục đích:** album như nhìn ra ngoài qua cửa sổ nhà gỗ có hơi nước đọng.

**Wireframe:**
```
┌────────────────────────────┐
│   QUA Ô CỬA SỔ             │
│ ┌───────────┬────────────┐ │  ← khung cửa gỗ pine, 2×2 ô
│ │ images[6] │ images[3]  │ │    mỗi ô phủ lớp "hơi nước"
│ │  (mờ)     │  (mờ)      │ │    bg-white/50 backdrop-blur
│ ├───────────┼────────────┤ │
│ │ images[4] │ images[7]  │ │
│ │  (mờ)     │  (mờ)      │ │
│ └───────────┴────────────┘ │
│  Chạm vào kính để lau hơi   │
│  nước                       │
└────────────────────────────┘
```
**Hành vi:** mỗi ô mờ ban đầu. Chạm (hoặc hover trên desktop) một ô → lớp hơi nước `opacity 1 → 0` (0.6s), ảnh rõ. Chạm lần 2 → A10 mở lightbox. Khi cuộn qua giữa section mà ô chưa được chạm, ô tự lau lần lượt (stagger 0.4s) để người không tương tác vẫn xem được ảnh.
**Accessibility:** mỗi ô là `<button aria-label="Xem ảnh 1/4">`; lớp mờ chỉ là trang trí (`aria-hidden`). Lightbox có Esc để đóng, phím ←/→.
**Reduced-motion:** không có lớp mờ, ảnh hiện rõ ngay.

---

### C14 · Mừng cưới

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │  GỬI CHÚT ẤM ÁP        │ │
│ │  Sự hiện diện của bạn  │ │
│ │  đã là món quà quý nhất│ │
│ │ ┌────────┐ ┌────────┐  │ │
│ │ │  QR    │ │  QR    │  │ │  ← QR mẫu ⚠️
│ │ │nhà trai│ │nhà gái │  │ │
│ │ └────────┘ └────────┘  │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** bấm QR → A10 phóng to. QR là ảnh placeholder của mẫu (chờ chốt §8 todo-list) ⚠️; có dòng 11px *"Mã QR minh hoạ"*.

---

### C15 · Xác nhận tham dự (chỉ giao diện)

```
┌────────────────────────────┐
│ ┌────────────────────────┐ │
│ │ BẠN SẼ LÊN ĐỒI CHỨ?    │ │
│ │ [ Tên của bạn       ]  │ │
│ │ (•) Mình sẽ đến        │ │
│ │ ( ) Tiếc quá, bận rồi  │ │
│ │ Số người [ 1 ▾ ]       │ │
│ │ [   Gửi xác nhận    ]  │ │
│ │ Bản xem thử — không gửi│ │
│ │ dữ liệu đi đâu.        │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Hành vi:** bấm gửi → form blur ra (`blur 0 → 10px`, `opacity → 0`, 0.6s), câu *"Cảm ơn {tên}, hẹn gặp trên đồi!"* hiện từ sương. Không gửi dữ liệu. Input cao ≥ 44px.

---

### C10 · Nắng lên

**Mục đích:** kết thúc: sương tan hoàn toàn, mặt trời lên sau đồi. Đây là "phần thưởng" của việc cuộn hết trang.

```
┌────────────────────────────┐
│          \ | /             │  ← quầng nắng sun, radial gradient
│        ── (◯) ──           │
│  ┌──────────────────────┐  │
│  │  images[n-1] 3:2     │  │  ← ảnh cuối, không phủ sương
│  └──────────────────────┘  │
│  Cảm ơn vì đã đi cùng      │
│  chúng tôi tới đây.        │  ← italic 22px
│    Minh Quân & Thu Hà      │  ← 36px italic
│ ✿  /\/\  ⌂  /\/\  ✿        │  ← đồi rõ nét, dã quỳ vàng điểm xuyết
└────────────────────────────┘
```
**Animation (scrub):** mặt trời `yPercent 60 → 0` từ sau lớp đồi xa; nền phần tử gốc đổi `bg` sang ấm hơn bằng một lớp phủ `bg-[#F6EBD9]` `opacity 0 → 0.6`; lớp sương tổng về 0. Hoa dã quỳ `scale 0 → 1` stagger 0.08 (4–6 bông ở lớp đồi gần).
**Reduced-motion:** ảnh + chữ tĩnh, mặt trời đứng yên.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | Không hiển thị ở C1 (C1 là phong cảnh vẽ). Dùng làm `og:image` fallback và ảnh nền mờ của C2 trên desktop (`opacity-15`, phủ sương) | 16:9 |
| `images[1]` | C3 chú rể | 4:5 |
| `images[2]` | C3 cô dâu | 4:5 |
| `images[3..5]` | C4 ba buổi sáng; `[3]`, `[4]` dùng lại trong C8 | 4:5 |
| `images[6]`, `images[7]` | C8 cửa sổ | 1:1 |
| `images[7]` (= `images[n-1]`) | C10 ảnh cuối, cắt 3:2 | 3:2 |

`meta.media = { images: 8, videos: 0 }`

⚠️ `images[0]` chỉ hiện rõ trên desktop. Nếu review thấy "ảnh bìa không được dùng trên mobile" là vi phạm tinh thần §2.2 spec, phương án thay thế: đặt `images[0]` làm nền C2 trên mọi màn hình với lớp sương `bg-[#F4F6F3]/70`.

---

## 7. Asset cần chuẩn bị
- [ ] SVG: 4 lớp đồi thông (tách file), nhà gỗ + ống khói, 2 cụm mây, mặt trời, hoa dã quỳ (2 kiểu), khung cửa sổ gỗ, 6 icon lịch trình
- [ ] `music.mp3` (Pixabay) + ghi vào `CREDITS.md`
- [ ] 8 ảnh mẫu tông lạnh, có sương/rừng thông (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: đồi thông, sương đang tách đôi, tên ở giữa
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Từ lúc bấm nút tới lúc cuộn được ≤ 2.3 giây; nhạc phát ngay khi bấm
- [ ] Parallax 4 lớp đồi + `backdrop-blur` giữ ≥ 50fps trên điện thoại tầm trung (nếu không đạt: tắt `backdrop-blur` trên mobile, dùng `bg-white/90`)
- [ ] Không có chữ nào nằm trên nền sương mà tương phản < 4.5:1 ở bất kỳ vị trí cuộn nào (kiểm tra chữ C2, C12 ở đầu và cuối section)
- [ ] Album xem được đầy đủ mà không cần chạm (tự lau khi cuộn), và mở được bằng bàn phím
- [ ] Mức sương giảm đơn điệu từ đầu tới cuối trang, C10 không còn sương

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/da-lat-2d/
├── meta.ts
├── layout.tsx                 # Cormorant_Garamond (300,400 + italic) + Manrope (vietnamese)
├── page.tsx                   # return <DaLatInvite />
└── _components/
    ├── da-lat-invite.tsx      # "use client" — ghép section, SmoothScroll, tokens `t`
    ├── hills.tsx              # nền fixed 4 lớp + mặt trời + dã quỳ (A4)
    ├── fog-gate.tsx           # C1: sương tách đôi, nút mở
    ├── fog-band.tsx           # dải sương chuyển cảnh (dùng 3 lần)
    ├── fog-card.tsx           # card kính mờ, tự hiện từ blur
    ├── sections/
    │   ├── names.tsx          # C2
    │   ├── couple.tsx         # C3
    │   ├── mornings.tsx       # C4
    │   ├── date.tsx           # C5 + C11
    │   ├── schedule.tsx       # C12
    │   ├── events.tsx         # C6 + C7
    │   ├── window-album.tsx   # C8
    │   ├── gift.tsx           # C14
    │   ├── rsvp.tsx           # C15
    │   └── sunrise.tsx        # C10
    ├── month-line.ts          # 12 câu theo tháng + hàm chọn
    └── svg/                   # hill-1..4, cabin, cloud, sun, sunflower, window-frame, icons
```
Dùng chung `@/kit`: `SmoothScroll`, `OpenGate`, `MusicPlayer`, `Countdown`, `useReducedMotion`, `presets`. `@/components`: `MapEmbed`. Dữ liệu từ `useWedding()`.

### 9.2 Tokens Tailwind
```ts
// da-lat-invite.tsx
export const t = {
  root: "relative min-h-svh bg-[#E7ECE8] text-[#1F2D25] font-(family-name:--font-body)",
  glass: "rounded-2xl border border-white/60 bg-white/90 supports-[backdrop-filter]:bg-white/70 supports-[backdrop-filter]:backdrop-blur-md shadow-[0_20px_60px_-20px_rgba(31,45,37,0.35)]",
  display: "font-(family-name:--font-display) font-light italic",
  label: "text-[11px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-[#55665B]",
  soft: "text-[#55665B]",
  btn: "inline-flex h-12 items-center rounded-full bg-[#2F4F3E] px-7 text-white transition-colors hover:bg-[#1F2D25]",
} as const;
```

### 9.3 Nền đồi thông (A4) và mức sương tổng
```tsx
// hills.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  const speeds = [0.1, 0.2, 0.35, 0.5];                  // xa → gần
  gsap.utils.toArray<HTMLElement>(".hill").forEach((el, i) =>
    gsap.to(el, { yPercent: -speeds[i] * 40, ease: "none",
      scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: true } }));
  gsap.to(".global-fog", { opacity: 0, ease: "none",     // sương giảm dần tới C10
    scrollTrigger: { trigger: document.documentElement, start: 0, end: "max", scrub: 1 } });
}, { dependencies: [reduced] });
```
Lớp nền đặt `fixed inset-0 -z-0 pointer-events-none`; nội dung `relative z-10`. Không dùng `z-index` ≥ 50.

### 9.4 Card từ sương & dải sương
```tsx
// fog-card.tsx
useGSAP(() => {
  gsap.from(ref.current, {
    opacity: 0, y: 30, filter: reduced ? "none" : "blur(12px)",
    duration: reduced ? 0.3 : 1.2, ease: "sine.inOut",
    scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
  });
}, { scope: ref, dependencies: [reduced] });

// fog-band.tsx — 40svh, không nội dung
gsap.timeline({ scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: true } })
  .fromTo(".fog-sheet", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, ease: "sine.inOut" })
  .to(".fog-sheet", { yPercent: -100, opacity: 0, ease: "sine.inOut" });
```
⚠️ `filter: blur` không thuộc "chỉ transform/opacity" của spec §7. Chấp nhận vì chỉ chạy 1 lần/card (`once: true`), thời gian ngắn, và có nhánh reduced-motion. Nếu review không đồng ý: thay bằng một lớp sương `opacity 1 → 0` đè lên card.

### 9.5 C1 mở thiệp
```tsx
const tl = useRef<gsap.core.Timeline>(null);
useGSAP(() => {
  tl.current = gsap.timeline({ paused: true, defaults: { ease: "sine.inOut" } })
    .to(".btn-open", { scale: 0.9, opacity: 0, duration: 0.3 }, 0)
    .to(".fog-l", { xPercent: -110, duration: 1.6 }, 0.1)
    .to(".fog-r", { xPercent: 110, duration: 1.6 }, 0.1)
    .to(".gate-names", { opacity: 1, filter: "blur(0px)", duration: 1.2 }, 0.4)
    .call(onOpened, [], 2.2);
}, { scope: root });
<button className={t.btn} onClick={() => { music.play({ fadeMs: 2500 }); tl.current?.play(); }}>Mở thiệp mời</button>
```

### 9.6 Album cửa sổ
State `wiped: boolean[4]`. Bấm ô chưa lau → `wiped[i] = true` (lớp mờ dùng `transition-opacity duration-500` của Tailwind, không cần GSAP). ScrollTrigger `onEnter` ở `center center` → lau lần lượt các ô còn lại bằng `setTimeout` stagger 400ms, huỷ khi unmount.

### 9.7 Logic cần test
- `monthLine(date)` trả đúng câu cho 12 tháng; tháng lỗi → câu mặc định.
- `scheduleTimes(date)` (đón khách −1h30, lễ −1h, tiệc, lửa trại +2h30), mặc định 17:00 khi thiếu giờ.
- Lưới lịch tuần bắt đầu Thứ Hai (tái dùng logic như letter-2d nhưng viết trong mẫu này, không import chéo).

File test: `da-lat-2d/_components/month-line.test.ts`, `schedule.test.ts`.

### 9.8 Thứ tự làm
1. `meta.ts`, `layout.tsx`, `page.tsx`, tokens → trang có font đúng
2. `hills.tsx` tĩnh + các section tĩnh, khớp wireframe 360px / 1440px (desktop card xen kẽ trái/phải)
3. `fog-gate.tsx` + nhạc
4. `fog-card.tsx`, `fog-band.tsx`, mức sương tổng
5. Parallax đồi, C10 mặt trời
6. Album cửa sổ + lightbox
7. Reduced-motion, fallback không `backdrop-filter`, tên dài, đo fps trên mobile
8. Checklist template-spec §12
