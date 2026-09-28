# 2D-10 · `boho-2d` · Boho Đất Nung

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md). Mẫu chuẩn tham chiếu: [letter-2d.md](./letter-2d.md).

---

## 1. Concept

**Một câu:** Một ngày trọn vẹn từ bình minh tới hoàng hôn: mặt trời đất nung mọc lên ở màn mở, đi một vòng cung theo tiến độ cuộn, và lặn xuống ở lời cảm ơn; mọi nội dung nằm trong những ô cửa vòm như bức tường đất nung.

**Cảm xúc muốn gợi:** ấm áp, tự do, mộc mạc, hơi hoài cổ. Như buổi chiều nắng vàng ở một khu vườn khô có cỏ lau pampas.

**Phù hợp với:** cưới ngoài trời, cưới nhỏ, cưới ở Đà Lạt/Mũi Né; cặp đôi thích phong cách bohemian, đồ gốm, macramé; ảnh tông nắng ấm, film.

**Khác các mẫu khác ở chỗ:**
- **Màu nền cả trang đổi theo tiến độ cuộn** (cát → đất nung → olive → hoàng hôn tím nâu), như thời gian trong ngày trôi qua. Nội dung luôn nằm trên ô vòm nền `surface` nên độ tương phản chữ không đổi.
- **Một mặt trời cố định** (fixed) di chuyển theo cung parabol từ trái-dưới lên đỉnh rồi xuống phải-dưới khi cuộn hết trang, là "đồng hồ" tiến độ.
- Màn mở **T4 vòm mở lên**: ô vòm lớn giữa màn hình phóng rộng theo `clip-path` có bo tròn, như bước qua cổng vòm.
- Mọi ảnh/khối reveal bằng **A3 dạng vòm** (`inset(... round)`), ô vòm có **3 kích cỡ luân phiên** (hẹp–rộng–đôi) để nhịp trang không đều đặn, đúng tinh thần boho.

**Moodboard:** tường đất nung, cổng vòm Địa Trung Hải, cỏ lau pampas, gốm men thô, macramé, mặt trời vẽ nét dày, hoa khô, vải lanh.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `sand` | `#F3E9DC` | Nền trang lúc đầu (bình minh) |
| `surface` | `#FFFAF3` | Nền mọi ô vòm, form |
| `clay` | `#C0673E` | Đất nung chủ đạo: mặt trời, khối trang trí, nền trang đoạn giữa |
| `clay-deep` | `#9C4F2C` | Nút, chữ nhấn, tiêu đề trên `surface` |
| `olive` | `#8A9A5B` | Cỏ, lá, nền trang đoạn 3/4 |
| `dusk` | `#6E4B4B` | Nền trang cuối (hoàng hôn) |
| `pampas` | `#E8D8BF` | Cỏ lau, đường kẻ, viền vòm |
| `text` | `#4A3426` | Chữ chính (chỉ trên `sand`/`surface`) |
| `text-soft` | `#7D6553` | Chữ phụ |

Tương phản: `text` trên `surface` ≈ 11:1 ✅. `text-soft` trên `surface` ≈ 5.3:1 ✅. Chữ trắng trên `clay-deep` ≈ 6.1:1 ✅. Chữ trắng trên `clay` chỉ ≈ 3.8:1 → **không đặt chữ nhỏ trên `clay`**; chữ luôn nằm trên ô vòm `surface`. Nền trang nội suy (`clay`, `olive`, `dusk`) chỉ làm phông.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Fraunces 300 italic, `opsz` 144 (SOFT 100) | 46px / 1.05 | 84px | Mềm, mập nét, rất boho |
| Tiêu đề section | Fraunces 500 italic | 28px | 40px | *"Ngày của chúng mình"* |
| Nhãn | Josefin Sans 600, VIẾT HOA, tracking 0.3em | 12px | 13px | "LỄ THÀNH HÔN" |
| Số lớn | Fraunces 200 | 110px | 170px | |
| Nội dung | Josefin Sans 400 | 16px / 1.65 | 18px | |

Fraunces và Josefin Sans đều có subset `vietnamese`. Josefin Sans hiển thị dấu hơi cao: tăng `leading` (đã tính ở 1.65).

### Hình khối và chất liệu
- **Vòm**: radius token `9999px 9999px 0 0` → Tailwind `rounded-t-full`. Ba cỡ ô vòm: `narrow` (`w-[72vw] max-w-[340px]`), `wide` (`w-[88vw] max-w-[460px]`), `twin` (hai vòm hẹp cạnh nhau).
- **Viền vòm**: 2px `pampas`, lệch `-8px` (vòm đôi viền như gờ tường).
- **Vân đất**: `feTurbulence` hạt thô opacity 0.06 phủ lên toàn trang (1 lớp fixed).
- **Mặt trời**: tròn `clay` + 12 tia nét dày bo đầu (SVG), đường kính 96px mobile / 160px desktop.
- **Cỏ lau pampas**: SVG path cong + chùm lông (path nhiều nét mảnh), đung đưa.
- **Motion**: ease `power2.out`. Vào 0.9s. Đung đưa `sine.inOut`. Không nảy.

---

## 3. Nhạc

- **Tâm trạng**: folk mộc, guitar acoustic gảy, có thể có tiếng vỗ tay/hum nhẹ, vui ấm. Không lời hoặc chỉ ngân nga.
- **Tempo**: 88–96 BPM. **Độ dài**: 2:30–3:00, lặp.
- **Từ khoá Pixabay**: `boho folk acoustic`, `indie folk warm guitar`, `acoustic sunny folk`
- **Hành vi**:
  - Bắt đầu khi bấm "Bước vào" ở C1. Âm lượng 0 → 0.6 trong 1.5 giây.
  - C16 dạng "đĩa gốm" quay chậm khi phát.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang

```
tiến độ  nền trang     ┌───────────────────────────┐
  0%     sand          │ C1  Cổng vòm + mặt trời    │ 100svh (cố định; T4 vòm mở lên)
                       ├───────────────────────────┤
  5%     sand          │ C2  Tên (vòm rộng)         │ 100svh
 12%     sand          │ C16 Đĩa gốm                │  60svh
 18%     sand→clay     │ C3  Hai người (vòm đôi)    │ 110svh
 30%     clay          │ C4  Ba buổi (vòm hẹp ×3)   │ 200svh
 48%     clay→olive    │ C5+C11 Ngày (vòm rộng)     │ 110svh
 58%     olive         │ C6+C7 Lễ + bản đồ          │ 140svh
 70%     olive         │ C13 Dress code             │  70svh
 76%     olive→dusk    │ C8  Album vòm so le        │ 150svh
 88%     dusk          │ C14+C15 Mừng cưới / RSVP   │ 130svh
100%     dusk          │ C10 Mặt trời lặn           │ 100svh
                       └───────────────────────────┘
+ mặt trời fixed: vị trí theo cung parabol của tiến độ 0 → 1
+ 2 bụi pampas fixed ở đáy trái/phải (tránh góc dưới phải: bụi phải đặt ở 70–85% chiều ngang)
```

Chuyển giữa section: T1; mỗi ô vòm reveal A3 vòm. Nhịp ô vòm: rộng → hẹp → đôi → hẹp… để không lặp đều.

---

## 5. Chi tiết từng section

### C1 · Cổng vòm và mặt trời

**Wireframe (360px):**
```
┌────────────────────────────┐
│                            │  ← nền sand
│      ╭──────────────╮      │
│     ╱   \  |  /      ╲     │  ← ô vòm lớn nền clay,
│    │   ─ (☀) ─        │    │     mặt trời mọc từ đáy vòm
│    │    /  |  \       │    │
│    │  Minh Quân       │    │  ← Fraunces italic 38px, chữ surface
│    │      &           │    │     (trên clay-deep: overlay tối 20%)
│    │   Thu Hà         │    │
│    │ ψψ          ψψ   │    │  ← pampas trong vòm
│    └──────────────────┘    │
│    ╭────────────────╮      │
│    │  Bước vào  →   │      │  ← nút clay-deep, rounded-full, 52px
│    ╰────────────────╯      │
└────────────────────────────┘
```
**Nội dung:** tên, nút *"Bước vào"* (`aria-label="Mở thiệp mời và phát nhạc"`). Nền ô vòm là `clay-deep` (không phải `clay`) để chữ trắng đạt tương phản.

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Ô vòm A3 vòm từ dưới lên (1.0s) |
| 0.5s | Mặt trời `yPercent 80 → 0` (1.4s, `power2.out`), tia `rotate -20° → 0` |
| 0.9s | Tên A2 theo dòng |
| 1.3s | Pampas `scaleY 0 → 1` từ gốc, rồi lặp đung đưa `rotate ±4°` (A12, 3.5s) |
| 1.5s | Nút A1 |
| lặp | Mặt trời xoay chậm `rotate 360` trong 60s (tia) |

**Khi bấm (T4 vòm mở lên, tổng 1.5s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc phát |
| 0.0s | Nút + tên fade (0.3s) |
| 0.1s | Ô vòm phóng: `clip-path: inset(22% 12% 20% 12% round 999px 999px 0 0) → inset(-10% -10% 0% -10% round 999px 999px 0 0)` (1.1s, `power2.inOut`) — lòng vòm chiếm hết màn hình |
| 0.3s | Mặt trời bay lên vị trí xuất phát của "đồng hồ" (trái-dưới, nhỏ lại 60%) bằng Flip |
| 1.2s | Lớp C1 fade, C2 lộ ra; mở khoá cuộn |

**Reduced-motion:** crossfade 0.3s; mặt trời đứng yên ở góc, không di chuyển theo cuộn.
**Edge case:** tên > 18 ký tự → 30px, xuống dòng; vòm cao theo nội dung (`min-h`).

---

### C2 · Tên (vòm rộng)

```
┌────────────────────────────┐
│    ╭──────────────────╮    │  ← ô vòm rộng, nền surface
│   ╱                    ╲   │
│  │ CHÚNG MÌNH CƯỚI RỒI! │  │  ← nhãn Josefin 12px
│  │   Minh Quân          │  │  ← Fraunces italic 46px
│  │        &             │  │
│  │     Thu Hà           │  │
│  │  ~ ☀ ~               │  │
│  │ Trân trọng kính mời  │  │
│  │ bạn đến chung vui    │  │
│  │ Thứ Bảy · 14.11.2026 │  │  ← `date` ⚠️
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** *"CHÚNG MÌNH CƯỚI RỒI!"*, tên, *"Trân trọng kính mời bạn đến chung vui"*, ngày.
**Animation:** ô vòm A3 vòm; tên A2 theo ký tự, mỗi ký tự thêm `rotate 8° → 0` (nét tay mềm).

---

### C16 · Đĩa gốm

```
┌────────────────────────────┐
│        ╭──────╮            │
│       │ ◎ đĩa │  ▶/❚❚      │  ← đĩa gốm SVG (vân men), quay khi phát
│        ╰──────╯            │
│  Bài hát của chúng mình    │
│  ────●──────── 1:12        │
└────────────────────────────┘
```
**Hành vi:** đồng bộ `<MusicPlayer>`. Đĩa `rotate` 1 vòng/8s khi đang phát (GSAP tween `repeat: -1`, `paused` theo trạng thái nhạc). Reduced-motion: không quay.

---

### C3 · Hai người (vòm đôi)

```
┌────────────────────────────┐
│  ╭──────╮      ╭──────╮    │
│ ╱        ╲    ╱        ╲   │  ← 2 vòm hẹp, ảnh images[1] / images[2]
│ │  ẢNH   │    │  ẢNH   │   │     cao lệch nhau 32px (vòm phải thấp hơn)
│ │  [1]   │    │  [2]   │   │
│ └────────┘    └────────┘   │
│ CHÚ RỂ          CÔ DÂU     │
│ Minh Quân       Thu Hà     │  ← Fraunces italic 26px
│ {groom.address} {bride.…}  │  ← 14px, line-clamp-3
└────────────────────────────┘
```
**Nội dung:** tên bố mẹ ⚠️ nếu có → dòng nhỏ *"Con ông … & bà …"*.
**Animation:** hai vòm A3 vòm, vòm phải trễ 0.2s; ảnh bên trong `scale 1.2 → 1`. Bông hoa khô nhỏ (SVG) giữa hai vòm A12.
**Mobile < 360px:** chồng dọc, vòm thứ hai lệch phải 12vw.

---

### C4 · Ba buổi (chuyện tình)

**Mục đích:** kể chuyện theo 3 buổi trong ngày, khớp với mặt trời đang đi.

```
┌────────────────────────────┐
│ ☀ (thấp)  BÌNH MINH        │
│  ╭────╮   Lần đầu gặp      │  ← vòm hẹp trái, images[3]
│ │ [3] │   "…"              │
│ └─────┘                    │
│        TRƯA NẮNG   ☀ (cao) │
│    "…"          ╭────╮     │  ← vòm hẹp phải, images[4]
│                │ [4] │     │
│                └─────┘     │
│ ☀ (xiên)  CHIỀU VÀNG       │
│  ╭────╮   Lời hẹn ước      │  ← images[5]
│ │ [5] │   "…"              │
│ └─────┘                    │
└────────────────────────────┘
```
**Nội dung viết sẵn:**
1. *Bình minh · Lần đầu gặp* — "Như nắng sớm, anh đến rất nhẹ nhàng. Một câu chào, một nụ cười, thế là đủ."
2. *Trưa nắng · Thương nhau* — "Những chuyến đi xa, những bữa cơm vội, những lần giận rồi thương. Tình yêu lớn lên từ những ngày rất thường."
3. *Chiều vàng · Lời hẹn ước* — "Dưới ánh hoàng hôn, anh hỏi em có muốn đi cùng anh hết quãng đời còn lại. Em nói: có."

**Animation:** mỗi khối vòm A3 vòm + chữ A1 (trigger `top 75%`). Biểu tượng mặt trời nhỏ bên cạnh tiêu đề ở 3 độ cao khác nhau (tĩnh), khớp ý nghĩa với mặt trời lớn đang đi.

---

### C5 + C11 · Ngày cưới

```
┌────────────────────────────┐
│    ╭──────────────────╮    │
│   ╱   THÁNG MƯỜI MỘT   ╲   │
│  │        14            │  │  ← Fraunces 200 110px, clay-deep
│  │   Thứ Bảy · 2026     │  │
│  │ T2 T3 T4 T5 T6 T7 CN │  │
│  │  9 10 11 12 13 (☀)15 │  │  ← ngày cưới khoanh mặt trời nhỏ
│  │  45 ngày · 06 giờ    │  │  ← A7
│  └──────────────────────┘  │
└────────────────────────────┘
```
**Nội dung:** như chuẩn; `date` ⚠️; qua ngày cưới → *"Tụi mình đã về chung một nhà ☀"*.
**Animation:** "14" đếm lên; tia mặt trời quanh ô ngày mọc (`scale 0 → 1`, stagger 0.03).

---

### C6 + C7 · Lễ và bản đồ

```
┌────────────────────────────┐
│ ╭──────╮  ╭──────╮         │  ← vòm đôi: hai lễ
│ │VU QUY│  │ TIỆC │         │
│ │08:00 │  │18:00 │         │
│ │Tư gia│  │{venue│         │
│ │nhà gái│ │.name}│         │
│ └──────┘  └──────┘         │
│  ╭──────────────────╮      │
│ │  <MapEmbed> 4:5    │     │  ← vòm rộng, wrapper overflow-hidden
│ └────────────────────┘     │
│  [ Chỉ đường → ]           │
└────────────────────────────┘
```
**Nội dung:** địa chỉ lễ vu quy = `{bride.address}`; tiệc = `venue.name` (rỗng → *"Tiệc cưới"*); giờ tiệc từ `date` ⚠️. Map mount lười.

---

### C13 · Dress code

```
┌────────────────────────────┐
│   Mặc gì cũng được, miễn   │
│   là tông đất nhé!         │
│  (●)  (●)  (●)  (●)  (●)   │  ← 5 "viên gốm" tròn men thô
│  Kem  Be  Đất  Olive  Nâu  │     #FFFAF3 #E8D8BF #C0673E #8A9A5B #4A3426
│       nung                 │
└────────────────────────────┘
```
**Animation:** các viên `y: 30 → 0`, `rotate` ngẫu nhiên ±10° → 0, stagger 0.07.

---

### C8 · Album vòm so le

```
┌────────────────────────────┐
│   Những ngày nắng đẹp      │
│ ╭────╮                     │
│ │[0] │     ╭────────╮      │  ← 6 ảnh, xen kẽ vòm hẹp/rộng,
│ └────┘    │  [3]    │      │     so le trái/phải
│           └─────────┘      │
│ ╭────────╮      ╭────╮     │
│ │ [4]    │      │[5] │     │
│ └────────┘      └────┘     │
│   ╭────╮  ╭────╮           │
│   │[1] │  │[2] │           │
│   └────┘  └────┘           │
└────────────────────────────┘
```
**Nội dung:** `images[0], [3], [4], [5], [1], [2]`.
**Hành vi:** bấm → A10 lightbox. **Animation:** mỗi ảnh A3 vòm khi vào viewport; ảnh vòm hẹp `data-speed="1.08"`, vòm rộng `0.95`.

---

### C14 + C15 · Mừng cưới và xác nhận

```
┌────────────────────────────┐
│  ╭──────────────────╮      │
│ │   Quà mừng cưới    │     │
│ │ ┌─────┐  ┌─────┐   │     │  ← QR mẫu ⚠️
│ │ │ QR  │  │ QR  │   │     │
│ │ └─────┘  └─────┘   │     │
│ └────────────────────┘     │
│  ╭──────────────────╮      │
│ │ Bạn sẽ đến chứ?    │     │
│ │ [ Tên            ] │     │
│ │ (●) Có, nhất định! │     │
│ │ ( ) Tiếc quá, không│     │
│ │ Số người [ 1 ▾ ]   │     │
│ │ [ Gửi ☀ ]          │     │
│ │ Bản xem thử — không│     │
│ │ gửi đi             │     │
│ └────────────────────┘     │
└────────────────────────────┘
```
**Hành vi:** QR → A10. Gửi → form thu lại, hiện *"Cảm ơn {tên}! Hẹn gặp dưới nắng ☀"*. Không gửi đi đâu.

---

### C10 · Mặt trời lặn

```
┌────────────────────────────┐
│  (nền dusk)                │
│    ╭──────────────╮        │
│   │  ảnh cuối [5]  │       │  ← vòm rộng
│   └────────────────┘       │
│  Cảm ơn bạn đã đến và làm  │  ← chữ trên ô surface
│  ngày của chúng mình trọn  │
│  vẹn.                      │
│   Minh Quân & Thu Hà       │
│ ─────────(☀)───────────    │  ← mặt trời lặn xuống đường chân trời
└────────────────────────────┘
```
**Animation (scrub, 0.8 → 1 tiến độ trang):** mặt trời fixed về đường chân trời cuối trang và bị che nửa dưới (mask), tia co lại `scale 1 → 0.6`. Pampas ngả theo hướng gió (rotate 8°).

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | C8 mở đầu album | 3:4 |
| `images[1]` | C3 chú rể + C8 | 3:4 |
| `images[2]` | C3 cô dâu + C8 | 3:4 |
| `images[3]` | C4 bình minh + C8 | 3:4 |
| `images[4]` | C4 trưa nắng + C8 | 3:4 |
| `images[5]` | C4 chiều vàng + C8 + C10 | 3:4 |

`meta.media = { images: 6, videos: 0 }`. `styles = ["vintage", "floral"]`, `colors = ["beige", "red"]`.

⚠️ C1 không dùng ảnh bìa (mặt trời là hình chính). Nếu muốn ảnh bìa xuất hiện sớm hơn, đặt `images[0]` trong vòm C2 thay cho khối chữ thuần — cần quyết định khi làm thumbnail.

## 7. Asset cần chuẩn bị
- [ ] SVG: mặt trời (đĩa + nhóm tia tách riêng), pampas (3 biến thể), hoa khô, đĩa gốm có vân men, "viên gốm" dress code
- [ ] Vân đất (tạo bằng `feTurbulence`, không cần file)
- [ ] `music.mp3` folk acoustic + `CREDITS.md`
- [ ] 6 ảnh mẫu tông nắng ấm/film (Unsplash) ≤ 300KB `.webp`
- [ ] `thumb.webp` 600×800: cổng vòm + mặt trời + pampas
- [ ] `opengraph-image.png` 1200×630

## 8. Tiêu chí nghiệm thu riêng
- [ ] Màu nền đổi mượt, không có "bậc" thấy được, cuộn ngược thì màu quay lại đúng
- [ ] Mặt trời đúng vị trí theo tiến độ sau khi resize/xoay màn hình, không bao giờ đè nút nhạc (góc trên phải) hay nút "Quay lại"
- [ ] Mọi chữ nằm trên `surface` hoặc `clay-deep`, không có chữ trực tiếp trên nền nội suy (axe pass)
- [ ] Pampas dưới-phải không đè nút "Dùng thử"
- [ ] Tên 50 ký tự không làm vỡ ô vòm C1/C2

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/boho-2d/
├── meta.ts
├── layout.tsx                 # Fraunces (axes: ["SOFT","opsz"], style italic) + Josefin_Sans (vietnamese)
├── page.tsx                   # return <BohoInvite />
└── _components/
    ├── boho-invite.tsx        # "use client" — tokens t, ghép section, SmoothScroll, nền nội suy
    ├── arch-gate.tsx          # C1 + T4 vòm
    ├── sun-clock.tsx          # mặt trời fixed theo tiến độ
    ├── pampas.tsx             # bụi cỏ lau + đung đưa
    ├── arch.tsx               # ô vòm: prop `size: "narrow" | "wide" | "twin"`, A3 vòm khi vào
    ├── sections/              # names, song-plate, couple, three-times, date, events, dress, album, reply, sunset
    ├── sun-path.ts            # sunPos(progress) → {x, y} theo parabol (+ test)
    └── svg/
```
`MapEmbed`, `MusicPlayer`, `Countdown`, `SmoothScroll`, `OpenGate`, `useReducedMotion` dùng chung.

### 9.2 Tokens
```ts
export const t = {
  root: "text-[#4A3426] font-(family-name:--font-body)",     // nền do timeline điều khiển
  arch: "bg-[#FFFAF3] rounded-t-full border-2 border-[#E8D8BF]",
  archImg: "rounded-t-full overflow-hidden",
  clay: "bg-[#9C4F2C] text-[#FFFAF3]",
  label: "text-xs tracking-[0.3em] uppercase font-semibold",
  display: "font-(family-name:--font-display) italic font-light",
  soft: "text-[#7D6553]",
  btn: "bg-[#9C4F2C] hover:bg-[#7F3F22] text-[#FFFAF3] rounded-full min-h-11 px-7",
} as const;
```

### 9.3 Nền nội suy theo cuộn
```tsx
// boho-invite.tsx
useGSAP(() => {
  const set = gsap.quickSetter(root.current, "backgroundColor");
  const colors = ["#F3E9DC", "#F3E9DC", "#C0673E", "#8A9A5B", "#6E4B4B"];
  const stops = [0, 0.15, 0.35, 0.65, 0.9];
  ScrollTrigger.create({
    trigger: root.current, start: "top top", end: "bottom bottom",
    onUpdate: (s) => set(bgAt(s.progress, stops, colors)), // bgAt dùng gsap.utils.interpolate giữa 2 mốc
  });
}, { scope: root });
```
`backgroundColor` không phải transform/opacity; chấp nhận vì chỉ 1 phần tử và không gây layout. Nếu Lighthouse báo jank: thay bằng 4 lớp `fixed inset-0` mỗi lớp một màu, crossfade `opacity`. Reduced-motion: vẫn đổi màu (không phải chuyển động).
`bgAt(progress, stops, colors)` là hàm thuần → **viết test**.

### 9.4 Mặt trời đồng hồ
```tsx
// sun-clock.tsx — fixed, ngoài #smooth-content, z-20, pointer-events-none
ScrollTrigger.create({ start: 0, end: "max", onUpdate: (s) => {
  const { x, y } = sunPos(s.progress);          // x: 8vw → 72vw, y: parabol 70svh → 14svh → 70svh
  gsap.to(sun.current, { x, y, duration: 0.4, overwrite: true, ease: "power2.out" });
}});
```
`sunPos` giới hạn vùng: không vào góc trên-trái (0–64px), trên-phải (nút nhạc), dưới-phải. **Test**: tại 0, 0.5, 1 và kiểm biên không lọt vào 3 vùng cấm (giả lập viewport 360×740 và 1440×900).

### 9.5 A3 vòm
```tsx
gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0% round 999px 999px 0 0)" },
  { clipPath: "inset(0% 0% 0% 0% round 999px 999px 0 0)", duration: 1, ease: "power2.out",
    scrollTrigger: { trigger: el, start: "top 80%" } });
```

### 9.6 Thứ tự làm
1. `meta`, `layout` (kiểm Fraunces italic + trục SOFT tải đúng), `page`, tokens
2. `arch.tsx` + section tĩnh theo nhịp hẹp/rộng/đôi, 360/1440px
3. `arch-gate` + nhạc
4. Nền nội suy + `sun-clock` + test `bgAt`, `sunPos`
5. `pampas`, đĩa gốm, animation từng section
6. Album + lightbox
7. Reduced-motion, tên dài, kiểm vùng cấm, Lighthouse
8. Checklist template-spec §12
