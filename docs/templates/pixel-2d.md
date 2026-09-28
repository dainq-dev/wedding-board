# 2D-16 · `pixel-2d` · Nhiệm Vụ 8-bit

> Spec chi tiết của mẫu. Mã card (C…), animation (A…) và chuyển cảnh (T…) xem trong [todo-list-wedding-page.md §2](../todo-list-wedding-page.md).
> Tuân thủ [template-spec.md](../template-spec.md).

---

## 1. Concept

**Một câu:** Thiệp cưới là một **game nhập vai 8-bit "Nhiệm Vụ: Cưới"** — khách bấm PRESS START, chọn xem hai nhân vật, rồi cuộn qua từng **màn chơi** cho tới "Trận cuối" là ngày cưới, và kết thúc bằng màn hình CONGRATULATIONS.

**Cảm xúc muốn gợi:** vui, hoài niệm tuổi thơ máy điện tử, tinh nghịch. Khách thấy mình là "người chơi phụ" được mời vào game.

**Phù hợp với:** cặp đôi mê game, dân IT, thích sự lầy lội; tiệc thân mật, khách trẻ.

**Khác các mẫu khác ở chỗ:**
- Có **HUD game cố định** ở cạnh trên–giữa (không chạm góc): `LV` màn hiện tại, thanh ♥ tiến độ, điểm số tăng theo cuộn.
- Chuyển màn bằng **"pixel dissolve"**: lưới ô vuông lớn lấp đầy màn hình theo thứ tự ngẫu nhiên có `steps`, rồi tan ra lộ màn mới (biến thể T4 nhưng bằng ô lưới, không phải clip-path tròn).
- Chuyện tình là **màn side-scroll** (T5): hai nhân vật sprite chạy ngang qua 3 cột mốc khi cuộn.
- Mọi chuyển động dùng `steps()` — không có ease mượt nào, đúng tinh thần 8-bit.

**Moodboard:** bảng màu Sweetie-16, hộp thoại viền trắng 2px của game RPG, sprite 16×16, thanh máu, rương báu, cờ đích, màn "STAGE CLEAR", chữ pixel nhấp nháy, scanline CRT.

---

## 2. Design tokens

### Màu (lấy từ bảng Sweetie-16)
| Token | Hex | Dùng cho |
|---|---|---|
| `bg` | `#1A1C2C` | Nền màn chơi |
| `surface` | `#333C57` | Nền hộp thoại, ô |
| `surface-2` | `#29366F` | Nền màn xen kẽ |
| `gold` | `#FFCD75` | Màu chủ đạo: tiêu đề, xu, nút |
| `green` | `#38B764` | Thanh HP, "OK", nền cỏ |
| `red` | `#B13E53` | Tim, cảnh báo |
| `sky` | `#41A6F6` | Nước, nền trời màn side-scroll |
| `text` | `#F4F4F4` | Chữ chính |
| `text-soft` | `#94B0C2` | Chữ phụ |

Tương phản: `text` trên `bg` ~16:1 ✅; `text` trên `surface` ~10:1 ✅; `gold` trên `bg` ~11.6:1 ✅; `green` trên `bg` ~6.4:1 ✅; `text-soft` trên `surface` ~5.2:1 ✅; chữ `bg` trên nút `gold` ~11.6:1 ✅. `red` trên `bg` ~2.9:1 ❌ → chỉ cho icon tim, không cho chữ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tiêu đề game / tên | VT323 | 48px / 1 | 88px | `gold`, bóng cứng `4px 4px 0 #29366F` |
| Tiêu đề màn ("LEVEL 3") | VT323, tracking 0.1em | 32px | 44px | |
| Hộp thoại / nội dung | VT323 | 22px / 1.3 | 24px | VT323 hiển thị nhỏ hơn cỡ danh nghĩa → không dưới 20px |
| HUD / nhãn | VT323 VIẾT HOA | 20px | 22px | |

**Chỉ 1 font** (VT323, có subset `vietnamese`). Không dùng Press Start 2P (không có tiếng Việt). Phải kiểm dấu thật kỹ: *"Nguyễn Thị Hằng, Trịnh Đức Hưởng"* — VT323 có dấu nhưng ở cỡ lớn dấu hai tầng sát dòng trên → `leading-[1.1]` cho tên. Chữ không bật `font-smoothing` (để giữ nét pixel): `[-webkit-font-smoothing:none]`.

### Hình khối và chất liệu
- **Ô pixel cơ sở**: 4px mobile / 6px desktop. Mọi viền, bóng, khoảng cách là bội của đơn vị này.
- **Hộp thoại RPG**: nền `surface`, viền trắng 4px + viền ngoài `bg` 4px (`shadow-[0_0_0_4px_#F4F4F4,0_0_0_8px_#1A1C2C]`), `rounded-none`. Góc dưới-phải có mũi tên ▼ nhấp nháy khi chữ gõ xong.
- **Sprite**: SVG `<rect>` 16×16 (chú rể, cô dâu, tim, xu, rương, cờ), `shape-rendering="crispEdges"`; spritesheet chạy bằng dịch `x` theo `steps(4)`.
- **Ảnh**: `[image-rendering:pixelated]` + viền 4px trắng; lọc nhẹ bằng lớp phủ scanline `bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.18)_0_2px,transparent_2px_4px)]`. **Không** hạ độ phân giải ảnh thật (để ảnh cưới vẫn đẹp); chỉ khung + scanline tạo cảm giác pixel.
- **Nền màn**: dải đất/cỏ pixel ở đáy mỗi màn (SVG lặp).
- **Motion**: mọi tween dùng `steps(n)` (n = 4–8), chữ gõ A11 30ms/ký tự. Nhấp nháy dùng GSAP `repeat: -1, ease: "steps(1)"` (`animate-pulse` quá mượt, không hợp 8-bit).

---

## 3. Nhạc

- **Tâm trạng**: chiptune vui, giai điệu phiêu lưu, không lời.
- **Tempo**: 130–150 BPM. **Độ dài**: 1:30–2:30, lặp (chiptune gắt → âm lượng mục tiêu 0.45).
- **Từ khoá Pixabay**: `8bit chiptune happy`, `retro game adventure`, `pixel level music`
- **Hành vi**:
  - Bắt đầu khi bấm PRESS START (C1), fade 0 → 0.45 trong 1.5s.
  - **Không có hiệu ứng âm thanh (SFX) riêng** — chỉ 1 file nhạc, đúng quy chuẩn và tránh ồn. (Nếu muốn tiếng "bíp" khi chuyển màn: để sau, cần chốt vì thêm file.)
  - Ẩn tab dừng.

---

## 4. Cấu trúc trang

```
┌───────────────────────────┐
│ C1  PRESS START            │ 100svh  (cố định tới khi mở)
├───────────────────────────┤  ── HUD cố định cạnh trên–giữa từ đây ──
│ LV1 C2  Chọn nhân vật      │ 100svh
│   ▦ pixel dissolve ▦       │  (ghim 60svh ở ranh giới mỗi màn)
│ LV2 C3  Chỉ số nhân vật    │ 110svh
│   ▦                        │
│ LV3 C4  Hành trình (side-  │ ghim, cuộn ngang ≈ 300svh (T5)
│         scroll 3 cột mốc)  │
│   ▦                        │
│ LV4 C12 Bản đồ nhiệm vụ    │ 110svh
│   ▦                        │
│ BOSS C5+C11+C6+C7 Trận cuối│ 160svh
│   ▦                        │
│ LV5 C8  Kho báu (album)    │ 120svh
│ SHOP C13+C14 Cửa hàng       │ 100svh
│ SAVE C15 Lưu game (RSVP)   │  90svh
│ C10 CONGRATULATIONS        │ 100svh
└───────────────────────────┘
```

**HUD:** thanh cao 40px, `fixed top-3 left-1/2 -translate-x-1/2`, rộng `min(60vw, 320px)` → nằm giữa, không đè nút "Quay lại" (trên-trái) và nút nhạc (trên-phải). Nội dung: `LV 3` · ♥♥♥♡♡ (tiến độ trang theo 5 tim) · `SCORE 002450` (= progress × 10000, tăng theo `steps`). `aria-hidden="true"` (trang trí; tiêu đề màn là `<h2>` thật trong nội dung). z-index 40.

Cột nội dung `min(92vw, 460px)`. Desktop: màn chơi phủ toàn chiều rộng, nền trời + mây pixel parallax A4 (dịch `x` theo `steps`).

---

## 5. Chi tiết từng section

### C1 · PRESS START (màn mở thiệp)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ░ scanline ░░░░░░░░░░░░░░░ │
│      ★ NHIỆM VỤ ★          │  ← gold 28px
│       C Ư Ớ I              │  ← VT323 72px, gold, bóng cứng
│                            │
│    🧍‍♂️(sprite)  ♥  🧍‍♀️(sprite)  │  ← 2 sprite 64px nhún 2 khung
│    MINH QUÂN     THU HÀ    │  ← 22px
│                            │
│   ▶ PRESS START ◀          │  ← nút, nhấp nháy steps(1) 0.6s
│                            │
│  © 2026 QUÂN & HÀ STUDIO ⚠️ │  ← năm từ date
└────────────────────────────┘
```

**Nội dung:** "★ NHIỆM VỤ ★ / CƯỚI" · `{groom.name}` · `{bride.name}` · nút **"PRESS START"** (`aria-label="Mở thiệp mời"`) · "© {năm} {Q} & {H} STUDIO" (chữ cái tên gọi như letter-2d).

**Animation vào:**
| t | Hành động |
|---|---|
| 0.0s | Màn hình "bật CRT": 1 vạch ngang trắng `scaleY 0.01 → 1` (0.3s, `steps(4)`) |
| 0.3s | "CƯỚI" rơi từ trên `y: -120 → 0` (`steps(6)`, 0.4s) |
| 0.7s | 2 sprite xuất hiện; lặp: nhún 2 khung (`y 0 ↔ -4`, `steps(1)`, 0.4s) |
| 1.0s | Tên A11 gõ chữ |
| 1.4s | PRESS START nhấp nháy `autoAlpha 1 ↔ 0`, `steps(1)`, 0.6s, lặp |

**Khi bấm (tổng 1.6s):**
| t | Hành động |
|---|---|
| 0.0s | Nhạc bắt đầu |
| 0.0s | PRESS START nhấp nháy nhanh 6 lần (0.05s mỗi lần) |
| 0.3s | Nhiễu màn hình: lớp noise (SVG turbulence) `autoAlpha 0 → 1`, dịch `y` ngẫu nhiên 6 khung (`steps`), 0.4s |
| 0.7s | Pixel dissolve lấp đầy (0.4s) → đổi sang LV1 → dissolve tan (0.4s) |
| 1.5s | HUD trượt xuống `y: -60 → 0` (`steps(4)`); mở khoá cuộn |

**Reduced-motion:** không nhiễu, không dissolve, không nhấp nháy (chữ PRESS START đứng yên); crossfade 0.3s. Nhấp nháy liên tục là **bắt buộc tắt** ở reduced-motion.
**Edge case:** tên > 14 ký tự: 18px, xuống dòng dưới sprite.

---

### Pixel dissolve (chuyển giữa các màn)

- Lưới phủ màn hình: 8 cột × 14 hàng (mobile) / 16 × 9 (desktop), mỗi ô là 1 `div` màu `bg` (chỉ tạo 1 lưới dùng chung, `fixed inset-0 z-30 pointer-events-none`).
- Tại ranh giới giữa 2 màn: ScrollTrigger `scrub` ghim 60svh; progress 0 → 0.5: các ô `scale 0 → 1` theo thứ tự `stagger: { each: …, from: "random", grid: [rows, cols] }`; 0.5 → 1: `scale 1 → 0`. Mỗi ô dùng `ease: "steps(2)"`.
- Thứ tự random cố định (`gsap.utils.shuffle` với mảng chỉ số tạo 1 lần) để cuộn ngược khớp.
- Cập nhật `LV` trên HUD ở progress 0.5 (khi màn bị che kín).

---

### LV1 · C2 Chọn nhân vật

```
┌────────────────────────────┐
│    LEVEL 1                 │
│   CHỌN NHÂN VẬT            │
│ ┌──────────┐ ┌──────────┐  │
│ │ images1  │ │ images2  │  │  ← khung 4px, scanline, 3:4
│ │  P1      │ │  P2      │  │     nhãn "P1"/"P2"
│ └──────────┘ └──────────┘  │
│  ▶MINH QUÂN   THU HÀ       │  ← con trỏ ▶ nhảy qua lại giữa 2 tên
│ ╔════════════════════════╗ │
│ ║ 2 người chơi đã sẵn    ║ │  ← hộp thoại, A11
│ ║ sàng! TRÂN TRỌNG KÍNH  ║ │
│ ║ MỜI bạn tham gia nhiệm ║ │
│ ║ vụ lớn nhất đời họ.  ▼ ║ │
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Nội dung:** h1 = tên cặp đôi (`{groom.name}` & `{bride.name}` nằm trong 1 `<h1>` gồm 2 nhãn tên). Hộp thoại viết sẵn như trên + dòng "NGÀY: {thứ, dd.MM.yyyy} ⚠️".
**Animation:** 2 khung ảnh "tải" bằng `clip-path inset(0 0 100% 0) → inset(0)` với `steps(8)` (như ảnh tải từng dòng). Con trỏ ▶ nhảy giữa 2 tên mỗi 0.8s (`steps(1)`). Hộp thoại A11.
**Hộp thoại:** chạm/Enter khi đang gõ → hiện hết chữ ngay (không bắt chờ).

---

### LV2 · C3 Chỉ số nhân vật

```
┌────────────────────────────┐
│   LEVEL 2 · CHỈ SỐ         │
│ ┌────────────────────────┐ │
│ │ P1 MINH QUÂN   LV 30   │ │  ← LV = tuổi tính từ birthYear
│ │ HP ██████████░ 100%    │ │  ← thanh xanh, chạy đầy
│ │ LOVE ██████████ MAX    │ │
│ │ CLASS: Chú rể          │ │
│ │ HOME: {groom.address}  │ │
│ └────────────────────────┘ │
│ ┌────────────────────────┐ │
│ │ P2 THU HÀ      LV 28   │ │
│ │ HP ██████████ 100%     │ │
│ │ LOVE ██████████ MAX    │ │
│ │ CLASS: Cô dâu          │ │
│ │ HOME: {bride.address}  │ │
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Dữ liệu:** `LV = năm của date ⚠️ (fallback năm hiện tại) − birthYear`. Theo template-spec §4.1: **không hiển thị năm sinh trực tiếp** — chỉ hiện LV (tuổi) cho vui. Nếu `birthYear` không hợp lệ (≤ 1900 hoặc > năm hiện tại, hoặc tuổi < 18) → hiện `LV ??`.
⚠️ Có thể có cặp đôi không muốn lộ tuổi → cần chốt: có cho tắt LV không (đề xuất: mặc định hiện, vì mẫu này đã nói rõ trong mô tả).
Tên bố mẹ ⚠️ → nếu có, thêm dòng "GUILD: Ông … & Bà …".
**Animation:** thanh HP/LOVE chạy đầy `scaleX 0 → 1` với `steps(10)` (từng ô), LV đếm từ 1 lên (0.8s, `snap: 1`). "MAX" nhấp nháy 3 lần rồi dừng.

---

### LV3 · C4 Hành trình (side-scroll, T5)

**Mục đích:** điểm nhấn. Cuộn dọc → màn chơi chạy ngang, hai sprite chạy cạnh nhau qua 3 cột mốc.

```
┌────────────────────────────┐
│ LEVEL 3 · HÀNH TRÌNH       │  ← cố định
│  ☁      ☁         ☁        │  ← mây (parallax chậm hơn)
│ ┌──────┐     ┌──────┐      │
│ │img3  │     │img4  │   →  │  ← ảnh trên cột mốc (bảng hiệu pixel)
│ └──┬───┘     └──┬───┘      │
│    │  🧍‍♂️🧍‍♀️→      │          │  ← 2 sprite chạy (đứng yên giữa màn,
│▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│     thế giới trôi ngược lại)
│ ╔════════════════════════╗ │
│ ║ MỐC 1: Gặp nhau…       ║ │  ← hộp thoại đổi theo mốc gần nhất
│ ╚════════════════════════╝ │
└────────────────────────────┘
```
**Nội dung viết sẵn (3 mốc + đích):**
1. `images[3]` — "MỐC 1 · GẶP NHAU: Player 1 gặp Player 2. Một đồng xu tình yêu rơi ra!"
2. `images[4]` — "MỐC 2 · PHIÊU LƯU: Cùng nhau vượt qua bao nhiêu màn khó. HP vẫn đầy!"
3. `images[5]` — "MỐC 3 · CẦU HÔN: Mở được rương báu: một chiếc nhẫn! Nhiệm vụ mới đã mở khoá."
4. Cờ đích — "STAGE CLEAR!"

**Hành vi:**
- A5: ghim, `x` của lớp "thế giới" chạy `-(worldWidth - innerWidth)`; mây `x` chỉ bằng 30% (parallax).
- Sprite chạy tại chỗ: spritesheet 4 khung, đổi khung theo **quãng đường** (không theo thời gian): `frame = floor(progress * 80) % 4` → dừng cuộn thì nhân vật đứng yên ở khung 0.
- Hộp thoại: đổi nội dung khi mốc đi qua giữa màn hình, chạy A11 lại.
- Tim/xu nhặt được: mỗi mốc có 1 xu, khi sprite chạm (mốc qua tâm) xu bay lên `y: -40, autoAlpha 0` (`steps(4)`) và SCORE +1000.
- Bấm ảnh mốc → A10 lightbox.

**Reduced-motion:** không ghim; 3 mốc xếp dọc (ảnh + hộp thoại), sprite đứng yên cạnh mốc cuối.

---

### LV4 · C12 Bản đồ nhiệm vụ (lịch trình)

```
┌────────────────────────────┐
│ LEVEL 4 · BẢN ĐỒ NHIỆM VỤ   │
│  [08:00]──┐                 │  ← mỗi mốc là 1 "ô màn" trên bản đồ
│  Lễ vu quy│                 │     kiểu overworld, nối bằng đường chấm
│           └──[17:00]        │
│              Đón khách      │
│           ┌──[18:00]        │
│  Làm lễ ★ │                 │  ← ★ = màn chính
│  [18:30]──┘                 │
│  Khai tiệc                  │
│      └──[20:00] Giao lưu 🏁 │
└────────────────────────────┘
```
Giờ từ `date` (−1h/0/+30′/+2h), vu quy 08:00 + `bride.address` viết sẵn.
**Animation:** đường chấm vẽ theo scrub từng đoạn (DrawSVG, `steps` không dùng được với scrub mượt → dùng `strokeDasharray` ô 8px, tween `drawSVG` rồi làm tròn tiến độ theo bội số 8px bằng `modifiers` hoặc `snap`). Sprite mini đi theo đường (MotionPath, `snap` theo từng mốc). Ô màn đã qua đổi màu `green` + chữ "CLEAR".

---

### BOSS · C5 + C11 + C6 + C7 Trận cuối

```
┌────────────────────────────┐
│ ⚠ BOSS STAGE ⚠              │  ← red nền, chữ text, nhấp nháy 3 lần
│   TRẬN CUỐI: NGÀY CƯỚI      │
│ ┌────────────────────────┐ │
│ │  THỨ BẢY 14.11.2026 ⚠️  │ │  ← VT323 40px gold
│ │  TIME LEFT             │ │
│ │  045:06:12:33          │ │  ← đếm ngược kiểu đồng hồ game
│ │  ♥♥♥♥♥♥♥♥♥♥ BOSS HP    │ │  ← thanh "HP boss" = % thời gian còn lại
│ └────────────────────────┘ │
│ T2 T3 T4 T5 T6 T7 CN        │  ← lịch lưới ô pixel
│  … 13 [♥] 15 …              │
│ ╔════════════════════════╗ │
│ ║ ĐỊA ĐIỂM: {venue.name} ║ │
│ ╚════════════════════════╝ │
│ ┌────────────────────────┐ │
│ │ <MapEmbed>             │ │  ← viền 4px trắng
│ └────────────────────────┘ │
│ [ ▶ CHỈ ĐƯỜNG ]             │
└────────────────────────────┘
```
**Nội dung:** đếm ngược tới `date` ⚠️. "BOSS HP" = `min(1, daysLeft / 100)` (còn ≥ 100 ngày = đầy). Qua ngày: "BOSS DEFEATED! Tụi mình cưới rồi!" và thanh HP rỗng.
Thiếu `venue.name` → "NHÀ HÀNG TIỆC CƯỚI".
**Animation:** banner BOSS nhấp nháy 3 lần (`steps(1)`), khung ngày "rung" `x ±4` 2 lần. Đếm ngược A7 nhưng lật bằng `steps(2)`. Mount `<MapEmbed>` khi cách 1 màn hình.

---

### LV5 · C8 Kho báu (album)

```
┌────────────────────────────┐
│ LEVEL 5 · KHO BÁU          │
│      ┌─────────┐           │
│      │ RƯƠNG   │           │  ← rương pixel 96px, bấm để mở
│      └─────────┘           │
│ ┌────┐┌────┐┌────┐         │  ← sau khi mở: lưới 3 cột images[3..7]
│ │    ││    ││    │         │
│ └────┘└────┘└────┘         │
│ ┌────┐┌────┐               │
│ └────┘└────┘               │
│ "Bạn nhận được 5 KỶ NIỆM!" │
└────────────────────────────┘
```
**Hành vi:** rương mở tự động khi vào view (không bắt bấm — tránh ẩn nội dung): nắp `y: -12` + `steps(3)`, các ảnh "bay" ra khỏi rương vào ô lưới (Flip, `ease: steps(6)`), stagger 0.1. Bấm ảnh → A10 lightbox (nền `bg` 95%, ← → Esc, nút đóng trên-giữa).

---

### SHOP · C13 + C14 Cửa hàng

```
┌────────────────────────────┐
│ SHOP · TRANG BỊ & QUÀ       │
│ ╔════════════════════════╗ │
│ ║ TRANG PHỤC GỢI Ý:      ║ │  ← dress code
│ ║ Thoải mái, màu tươi.   ║ │
│ ║ ■ ■ ■ ■                ║ │  ← ô vuông #FFCD75 #38B764 #41A6F6 #F4F4F4
│ ╚════════════════════════╝ │
│ ┌─────────┐  ┌─────────┐   │
│ │ QR ⚠️    │  │ QR ⚠️    │   │  ← "Túi xu nhà trai / nhà gái"
│ │ [pixel] │  │ [pixel] │   │
│ └─────────┘  └─────────┘   │
│ "Quà mừng = +1000 hạnh phúc"│
└────────────────────────────┘
```
**Hành vi:** bấm QR phóng to (A10). QR dùng `[image-rendering:pixelated]` để khi phóng to vẫn nét, dễ quét; ảnh cưới thì không.

---

### SAVE · C15 Lưu game (RSVP)

```
┌────────────────────────────┐
│  SAVE GAME?                 │
│ ╔════════════════════════╗ │
│ ║ TÊN NGƯỜI CHƠI:        ║ │
│ ║ [__________]           ║ │  ← input nền bg, viền 4px, caret nhấp nháy
│ ║ ▶ THAM GIA             ║ │  ← chọn bằng ↑↓ hoặc chạm (radio thật)
│ ║   BỎ LƯỢT              ║ │
│ ║ SỐ NGƯỜI: ◀ 1 ▶        ║ │  ← nút 44px
│ ║ [ SAVE ]               ║ │
│ ╚════════════════════════╝ │
│ Bản xem thử — không gửi đi  │
└────────────────────────────┘
```
**Hành vi:** "SAVE" → thanh "SAVING…" chạy `steps(10)` 0.8s → *"ĐÃ LƯU! Hẹn gặp {tên} ở trận cuối."*. Không gửi dữ liệu đi đâu. Radio thật (`<input type="radio">` ẩn trực quan + label hiện ▶).

---

### C10 · CONGRATULATIONS

```
┌────────────────────────────┐
│  ✦ CONGRATULATIONS! ✦      │  ← VT323 40px gold, nhấp nháy màu
│  ┌──────────────────┐      │
│  │ images[n-1]      │      │
│  └──────────────────┘      │
│   🧍‍♂️ ♥ 🧍‍♀️  (sprite ôm nhau)│
│  NHIỆM VỤ HOÀN THÀNH!       │
│  Cảm ơn bạn đã chơi cùng    │
│  Minh Quân & Thu Hà         │
│  FINAL SCORE: 010000        │
│  THANK YOU FOR PLAYING      │
│  ▶ CHƠI LẠI                 │  ← nút cuộn lên đầu (scrollTo 0)
└────────────────────────────┘
```
**Animation:** confetti pixel A8 (30 ô vuông 6px màu bảng, rơi `steps(12)`), 1 lần 3s. Chữ CONGRATULATIONS đổi màu qua 4 màu bảng `steps(1)` lặp 6 lần rồi dừng `gold`. HUD: tim đầy, score chốt 010000. Tắt confetti + đổi màu khi reduced-motion.
"CHƠI LẠI": `ScrollSmoother.get()?.scrollTo(0, true)`; không hiện lại C1.

---

## 6. Dữ liệu và media

| Vị trí | Dùng ở | Tỉ lệ |
|---|---|---|
| `images[0]` | Nền mờ C1 (opacity 0.2 + scanline + lớp phủ `bg` để chữ đạt tương phản) | 3:4 |
| `images[1]`, `images[2]` | LV1 chọn nhân vật | 3:4 |
| `images[3..5]` | LV3 ba cột mốc | 4:3 |
| `images[3..7]` | LV5 kho báu (5 ảnh) | 1:1 |
| `images[7]` (= `n-1`) | C10 | 3:4 |

`meta.media = { images: 8, videos: 0 }` (tăng từ 6 để kho báu đủ 5 ảnh).
Dữ liệu: `groom.name`, `bride.name`, `*.address`, **`*.birthYear`** (chỉ để tính LV, không hiển thị trực tiếp), `venue`. `date` ⚠️, tên bố mẹ ⚠️, QR ⚠️.

## 7. Asset cần chuẩn bị
- [ ] SVG sprite 16×16 (`crispEdges`): chú rể (4 khung chạy + 2 khung nhún + 1 ôm), cô dâu (tương tự), tim, xu, rương (đóng/mở), cờ đích, mây, dải cỏ/đất lặp
- [ ] Noise CRT: SVG `feTurbulence` inline
- [ ] `music.mp3` chiptune + `CREDITS.md`
- [ ] 8 ảnh mẫu (Unsplash) ≤ 300KB `.webp`
- [ ] QR placeholder
- [ ] `thumb.webp` 600×800: màn PRESS START với 2 sprite
- [ ] `opengraph-image.png`

## 8. Tiêu chí nghiệm thu riêng
- [ ] HUD không đè 3 góc dành riêng ở 360px và 1440px; z-index < 50
- [ ] Pixel dissolve ≤ 150 phần tử, chỉ animate `transform`, 60fps; cuộn ngược khớp thứ tự
- [ ] Sprite LV3 đứng yên khi ngừng cuộn, chạy khi cuộn
- [ ] VT323 hiển thị đúng dấu tiếng Việt ở 22px và 48px; tên 50 ký tự không vỡ hộp thoại
- [ ] `birthYear` không hiện ở bất kỳ đâu; LV tính đúng, sai dữ liệu → `LV ??`
- [ ] Reduced-motion: không nhấp nháy, không dissolve, không side-scroll ghim, không confetti
- [ ] Hộp thoại đang gõ có thể bỏ qua bằng chạm/Enter

---

## 9. Triển khai code

### 9.1 Cấu trúc file
```
src/app/mau-thiep-cuoi/pixel-2d/
├── meta.ts                    # styles ["playful"], colors ["blue","green"], media {8,0}
├── layout.tsx                 # VT323 (vietnamese) — 1 font duy nhất
├── page.tsx
└── _components/
    ├── pixel-invite.tsx       # "use client" — tokens t, SmoothScroll, ghép, HUD
    ├── start-gate.tsx         # C1 PRESS START + nhiễu
    ├── hud.tsx                # LV / tim / score (đọc progress qua ScrollTrigger)
    ├── dissolve.tsx           # lưới ô dùng chung + hàm tạo trigger cho mỗi ranh giới
    ├── dialog-box.tsx         # hộp thoại RPG + typewriter bỏ qua được
    ├── sprite.tsx             # <Sprite name frame /> SVG crispEdges
    ├── levels/                # lv1-select, lv2-stats, lv3-journey, lv4-map,
    │                          # boss, lv5-treasure, shop, save, congrats
    ├── game-math.ts           # level(birthYear, year), bossHp(daysLeft), score(progress)
    └── game-math.test.ts
```

### 9.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#1A1C2C] text-[#F4F4F4] font-(family-name:--font-pixel) [-webkit-font-smoothing:none]",
  box: "bg-[#333C57] shadow-[0_0_0_4px_#F4F4F4,0_0_0_8px_#1A1C2C] rounded-none p-4 text-[22px] leading-[1.3]",
  title: "text-[#FFCD75] [text-shadow:4px_4px_0_#29366F] leading-[1.1]",
  label: "uppercase text-xl",
  btn: "min-h-12 bg-[#FFCD75] px-6 text-2xl uppercase text-[#1A1C2C] shadow-[4px_4px_0_#29366F] active:translate-y-1 active:shadow-none",
  frame: "border-4 border-[#F4F4F4]",
  scan: "pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.18)_0_2px,transparent_2px_4px)]",
  pixelated: "[image-rendering:pixelated]",
} as const;
```

### 9.3 Pixel dissolve
```tsx
// dissolve.tsx (rút gọn)
useGSAP(() => {
  if (reduced) return;
  const cells = gsap.utils.toArray<HTMLElement>(".cell");       // cols*rows div, scale 0
  const order = gsap.utils.shuffle(cells.map((_, i) => i));     // cố định 1 lần
  const delay = (i: number) => order.indexOf(i) / cells.length;
  boundaries.forEach(({ trigger, onMid }) => {
    gsap.timeline({ scrollTrigger: { trigger, start: "top top", end: "+=60%", pin: true, scrub: true } })
      .to(cells, { scale: 1, ease: "steps(2)", duration: 0.1, stagger: (i) => delay(i) * 0.4 })
      .call(onMid)                                              // đổi LV trên HUD
      .to(cells, { scale: 0, ease: "steps(2)", duration: 0.1, stagger: (i) => delay(i) * 0.4 });
  });
}, { dependencies: [reduced] });
```
`stagger` dạng hàm trả thời điểm bắt đầu tuyệt đối của từng phần tử (API gsap 3). Chú ý `.call` trong timeline scrub chạy cả khi cuộn ngược → `onMid` nhận hướng qua `self.direction` và đặt LV tương ứng.

### 9.4 Side-scroll + sprite theo quãng đường
```tsx
useGSAP(() => {
  if (reduced) return;
  const dist = () => world.current!.scrollWidth - innerWidth;
  gsap.to(world.current, {
    x: () => -dist(), ease: "none",
    scrollTrigger: {
      trigger: section.current, pin: true, scrub: true, invalidateOnRefresh: true, end: () => "+=" + dist(),
      onUpdate: (self) => {
        setFrame(Math.floor(self.progress * 80) % 4);            // hoặc gsap.set trên <use href>
        setMilestone(Math.min(3, Math.floor(self.progress * 4)));
      },
    },
  });
  gsap.to(clouds.current, { x: () => -dist() * 0.3, ease: "none", scrollTrigger: { trigger: section.current, scrub: true, end: () => "+=" + dist() } });
}, { scope: section, dependencies: [reduced] });
```
Đổi khung sprite bằng `gsap.set(spriteEl, { x: -frame * 64 })` (không setState mỗi frame) để tránh re-render; `setMilestone` chỉ gọi khi giá trị đổi.

### 9.5 Logic cần test (`game-math.test.ts`)
- `level(1996, 2026) === 30`; `level(0, 2026) === null`; `level(2020, 2026) === null` (< 18) → UI hiện `LV ??`.
- `bossHp(150) === 1`, `bossHp(50) === 0.5`, `bossHp(-1) === 0`.
- `score(0.2451) === "002450"` (làm tròn xuống bội 50, 6 chữ số).
- Giờ bản đồ nhiệm vụ và lưới lịch: dùng helper chung.

### 9.6 Thứ tự làm
1. Khung file, tokens, VT323 → kiểm dấu ở 22/48px, 360px
2. `dialog-box`, `sprite`, các màn tĩnh xếp dọc (= bản reduced-motion)
3. `start-gate.tsx` + nhạc
4. `hud.tsx` + `dissolve.tsx`
5. LV3 side-scroll + sprite; LV4 đường đi
6. Boss, kho báu Flip, Save, Congrats confetti
7. `game-math` + test; reduced-motion; tên dài; Lighthouse
8. Checklist template-spec §12
