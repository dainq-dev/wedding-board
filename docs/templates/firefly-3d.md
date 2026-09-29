# 3D-05 · `firefly-3d` · Rừng Đom Đóm

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `src/kit/3d/` đã dựng ở [galaxy-3d](./galaxy-3d.md).

---

## 1. Concept

**Một câu:** Giữa khu rừng tối, bầy đom đóm dẫn khách đi bộ theo lối mòn, qua những tấm ảnh treo trên cành, tới một khoảng rừng trống giăng đèn dây, nơi đom đóm tụ lại thành tên viết tắt của hai người.

**Cảm xúc muốn gợi:** huyền ảo, thân mật, thì thầm. Như một bí mật chỉ khách mời mới được biết đường tới. Hơi cổ tích.

**Phù hợp với:** cặp đôi thích thiên nhiên, cắm trại, cưới ngoài trời buổi tối (garden party, rừng thông Đà Lạt, resort); ảnh cưới tông xanh rêu, chụp giờ xanh.

**Điểm khác biệt:** camera là **góc nhìn người đi bộ** (ngôi thứ nhất, cao 1.6), có **nhịp bước** (head-bob) khi đang cuộn và **dừng lại** ở mỗi trạm. Cảnh gần như tối đen, **ánh sáng đến từ đom đóm**: đom đóm là nguồn sáng cho ảnh treo (ảnh sáng lên khi bầy đom đóm bay tới). Đom đóm là **một hệ hạt GPU duy nhất** đổi "đội hình" theo chương: bay tự do → dẫn đường → mũi tên → chữ cái. Và đom đóm **né ngón tay**.

**Moodboard:** Studio Ghibli "Mộ đom đóm"/"Totoro" cảnh đêm, ảnh phơi sáng dài đom đóm trong rừng Nhật, đèn dây Edison vòm, dây đay treo ảnh, rêu và dương xỉ.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `night` | `#050D0A` | Nền trang, fog, trời |
| `moss` | `#0F1F18` / 75% + `backdrop-blur-md` | Nền card |
| `bark` | `#1C2B22` | Thân cây, viền card `1px` /60% |
| `firefly` | `#E9F59A` | Màu chủ đạo: đom đóm, tên, số lớn, nút |
| `fern` | `#7FD1A8` | Điểm nhấn phụ: tiêu đề chương, liên kết, đèn dây |
| `amber` | `#F2C572` | Đèn dây (bóng Edison), ánh ấm ở khoảng rừng trống |
| `text` | `#EEF7EA` | Chữ chính |
| `text-soft` | `#A8BBAE` | Chữ phụ |

Tương phản (trên `moss` phủ `night`, màu hiệu dụng khoảng `#0C1914`): `text` khoảng 16:1 ✅, `text-soft` khoảng 8.5:1 ✅, `firefly` khoảng 15:1 ✅, `fern` khoảng 9.5:1 ✅. Nút: nền `firefly`, chữ `night` khoảng 17:1 ✅.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Great Vibes | 52px / 1.15 | 96px | Chữ script, có "glow" (xem dưới) |
| Tên viết tắt / chữ ký | Great Vibes | 32px | 44px | |
| Tiêu đề chương | Be Vietnam Pro 500, VIẾT HOA, tracking 0.35em | 11px | 12px | màu `fern` |
| Số lớn | Be Vietnam Pro 200 | 80px | 120px | Mảnh, sáng như vệt sáng |
| Nội dung | Be Vietnam Pro 300 | 16px / 1.75 | 17px | |

Cả hai font có subset `vietnamese`. Great Vibes ở cỡ nhỏ khó đọc có dấu → **chỉ dùng ≥ 32px** và chỉ cho tên, chữ ký. Kiểm tra "Trịnh Đức Hưởng": dấu nặng dưới "ị" không bị cắt (`leading-[1.3]`, `pb-2`).

**Glow chữ:** `drop-shadow-[0_0_12px_rgba(233,245,154,0.55)]` cho tên và số lớn. Chỉ dùng trên chữ lớn.

### Hình khối và chất liệu
- **Card:** `rounded-2xl` (1rem), `moss` + blur, viền `bark/60`, rộng tối đa 400px. Góc trên trái có **1 đom đóm HTML** nhỏ (chấm 4px `firefly` + `animate-pulse`, `aria-hidden`).
- **Dây đay:** ảnh HTML (trong fallback và lightbox) có 1 dây SVG `#8A7350` vắt lên trên, kẹp gỗ nhỏ.
- **Đường kẻ:** chấm tròn nối nhau (`border-dotted`) màu `fern/40`, như vệt đom đóm.
- **Motion:** ease `sine.inOut` mọi nơi. Chữ hiện **sáng dần** (opacity + glow tăng) thay vì trượt; không nảy, không trượt dài (y tối đa 12px).

---

## 3. Nhạc
- **Tâm trạng:** piano chậm, celesta lấp lánh, lẫn tiếng côn trùng đêm (dế, ếch xa), không lời.
- **Tempo:** khoảng 72 BPM. **Độ dài:** 2:30–3:00, lặp.
- **Từ khoá Pixabay:** `magical forest night piano`, `fairy tale celesta`, `night ambience crickets piano`
- **Hành vi:**
  - Bắt đầu khi bấm "Mở thiệp". Âm lượng 0 → 0.5 trong 2.5s.
  - **Điểm nhấn:** khi đom đóm tụ thành tên viết tắt (C10), âm lượng tăng 0.5 → 0.7 trong 2s (cao trào duy nhất).
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **950svh**. Canvas `fixed inset-0 -z-10`.

```
┌───────────────────────────┐
│ #gate    C1  Bóng tối      │ 100svh  vài đom đóm
├───────────────────────────┤
│ #names   C2  Bìa rừng      │ 120svh  tên được "vẽ" bằng ánh sáng
│ #couple  C3  Hai cành cây  │ 110svh  trạm dừng 1
│ #story   C4  Ba ảnh treo   │ 170svh  trạm dừng 2, 3, 4
│ #album   C8  Hành lang ảnh │ 140svh  đi bộ giữa 2 hàng ảnh
│ #date    C5+C6 Khoảng trống│ 140svh  đèn dây vòm
│ #venue   C7  Mũi tên sáng  │ 100svh
│ #thanks  C9+C10 Tên tắt    │  70svh + phần kết
└───────────────────────────┘
```

| Chương | Progress | HTML section | Card | Đội hình đom đóm |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | vài con lẻ |
| 1 | 0.00–0.12 | `#names` | C2 | bay tự do quanh camera |
| 2 | 0.12–0.24 | `#couple` | C3 | tụ quanh 2 ảnh chân dung |
| 3 | 0.24–0.42 | `#story` | C4 | tụ quanh từng ảnh mốc |
| 4 | 0.42–0.58 | `#album` | C8 | dải dẫn đường giữa lối |
| 5 | 0.58–0.76 | `#date` | C5 + C6 | toả ra khoảng trống, bay chậm |
| 6 | 0.76–0.88 | `#venue` | C7 | xếp thành mũi tên |
| 7 | 0.88–1.00 | `#thanks` | C9 + C10 | xếp thành tên viết tắt "Q ♥ H" |

### Keyframe camera
Lối mòn là một đường cong `CatmullRomCurve3` đi theo **−z**, uốn trái phải. Camera **đi bộ** trên đường cong: vị trí = `path.getPointAt(walk(p))`, cao 1.6. `walk(p)` có **các đoạn phẳng** (đứng lại ở trạm) và đoạn dốc (đi bộ). Hướng nhìn = tiếp tuyến + độ lệch theo bảng:

| progress | walk(p) | Nhìn | Ghi chú |
|---|---|---|---|
| 0.00 | 0.00 | thẳng, pitch 0 | Đứng ở bìa rừng |
| 0.10 | 0.08 | thẳng | Bước vào lối mòn |
| 0.15–0.21 | 0.14 (đứng) | yaw −20°→+20° | Trạm C3: 2 ảnh 2 bên lối |
| 0.26–0.30 | 0.24 (đứng) | yaw −30° | Trạm mốc 1 (cành bên trái) |
| 0.32–0.36 | 0.30 (đứng) | yaw +30° | Trạm mốc 2 (bên phải) |
| 0.38–0.42 | 0.36 (đứng) | pitch +15° | Trạm mốc 3 (treo cao phía trước) |
| 0.58 | 0.70 | thẳng | Hết hành lang, đi nhanh hơn |
| 0.62–0.76 | 0.80 (đứng) | pitch +20° → 0 | Khoảng trống, ngẩng nhìn đèn dây |
| 0.82 | 0.88 | yaw +10° | Mũi tên |
| 0.90–1.00 | 0.92 (đứng) | pitch +8° | Nhìn chữ viết tắt |

**Nhịp bước (head-bob):** chỉ khi `walk` đang thay đổi. Tính `speed = |walk(p) - walk(p_prev)| / delta`, biên độ `a = clamp(speed·k, 0, 1)`; `y += sin(phase)·0.035·a`, `roll = sin(phase/2)·0.4°·a`, `phase += speed·delta·40`. Tắt hoàn toàn khi reduced-motion (thực ra khi đó không có canvas) và có thể tắt cho người say sóng: không có nút riêng, biên độ đã nhỏ.

Làm mượt `lerp(1 - exp(-3·delta))`.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Đom đóm | **1 `Points`** với `ShaderMaterial` riêng: kích thước theo khoảng cách, nhấp nháy `0.4 + 0.6·pow(0.5 + 0.5·sin(uTime·f + phase), 3)`, additive, `depthWrite false`. Vị trí tính trong vertex shader: `mix(wander, target, uForm)` với `wander` là chuyển động sin nhiều tần số quanh `aHome` | 700 / 280 |
| Mục tiêu đội hình | **1 attribute `aTarget` duy nhất** được ghi lại (CPU) mỗi lần đổi chương, và `uForm` tween 0 → 1 lại từ đầu. Đổi chương thì copy vị trí hiện tại (ước lượng) sang `aHome` | — |
| Thân cây | `InstancedMesh` `CylinderGeometry(0.2–0.5, 0.3–0.6, 12, 6)` màu `#0B1510`, rải hai bên lối (cách lối ≥ 1.5), `flatShading` | 110 / 50 |
| Tán cây | `InstancedMesh` `IcosahedronGeometry(2.5, 0)` màu `#08130D` phía trên thân, gần như đen, chỉ viền sáng khi đom đóm gần | 110 / 50 |
| Dương xỉ và bụi | `InstancedMesh` plane chéo (2 plane cắt chữ X) texture `fern.webp` alphaTest | 300 / 120 |
| Mặt đất | plane `#07120D`, lối mòn là dải màu sáng hơn `#122219` (vẽ bằng vertex color theo khoảng cách tới đường cong) | 1 |
| Ảnh treo (C3, C4) | plane ảnh + khung gỗ mảnh + dây đay (`Line` từ cành xuống). `meshStandardMaterial` (ảnh **cần ánh sáng**), 1 `pointLight` màu `firefly` cường độ theo số đom đóm đang tụ quanh (điều khiển bằng progress) | 5 |
| Hành lang ảnh (C8) | 5 ảnh `images[3..7]` treo xen kẽ trái phải dọc lối, `meshBasicMaterial` nhân `uBright` (sáng dần khi camera tới gần) để khỏi cần 5 đèn | 5 |
| Đèn dây vòm (C5) | 4 dây catenary nối các cây quanh khoảng trống; mỗi dây 24 bóng = `Points` kích thước lớn màu `amber` + `Line` dây mảnh | 96 / 64 bóng |
| Đom đóm "mũi tên" (C7) | cùng hệ `Points`, `aTarget` = các điểm trên hình mũi tên chỉ về phía card bản đồ | — |
| Đom đóm "chữ" (C10) | cùng hệ `Points`, `aTarget` = điểm lấy mẫu từ chữ viết tắt vẽ trên canvas 2D (§10.3) | — |
| Fog | `FogExp2 #050D0A`, density 0.07 (rừng) → 0.035 (khoảng trống) | — |

**Ánh sáng:** `ambientLight 0.05` + `hemisphereLight` rất tối. Trạm C3/C4 có 1 `pointLight` di chuyển tới ảnh đang xem (không phải 5 đèn cùng lúc). Khoảng trống có 1 `pointLight amber` ở giữa vòm.

**Tương tác con trỏ (điểm nhấn):** đom đóm **né ngón tay**. Chiếu con trỏ lên mặt phẳng cách camera 4 đơn vị → `uPointer` (world). Trong vertex shader: `d = p - uPointer; p += normalize(d) * max(0.0, 1.2 - length(d)) * 0.8` (đẩy ra trong bán kính 1.2). Trên mobile dùng vị trí chạm cuối cùng, mờ dần sau 1.5s không chạm. Camera lệch theo con trỏ yaw ±6°.

---

## 6. Chi tiết từng section HTML

Card nằm ở **1/3 dưới** màn hình (ảnh treo và đom đóm ở 2/3 trên). Không đặt gì ở 3 góc nút chung.

### C1 · Bóng tối (màn mở)

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←                      ♪   │
│                            │
│       ·          ·         │  ← 6–8 đom đóm lập loè
│              ·             │
│                            │
│    MỘT LỐI NHỎ TRONG RỪNG  │  ← 11px fern tracking
│    Minh Quân & Thu Hà      │  ← Great Vibes 36px firefly, glow
│      ╭──────────────╮      │
│      │  MỞ THIỆP  ·   │      │  ← nền firefly chữ night, A12
│      ╰──────────────╯      │
│  Bật âm thanh để nghe      │
│  tiếng rừng đêm            │  ← 12px text-soft
└────────────────────────────┘
```
**Timeline khi bấm (2.4s):**
| t (s) | Việc | Ease |
|---|---|---|
| 0.0 | `music.play()` fade 2.5s; xin quyền gyro (iOS) | — |
| 0.0–0.4 | Nút và chữ **tắt sáng** (opacity → 0, glow → 0) | `sine.in` |
| 0.2–1.8 | Hàng trăm đom đóm **bay ra** từ vị trí nút: `aHome` từ điểm nút → rải khắp rừng (uniform `uBurst` 0 → 1) | `power2.out` |
| 0.8–2.4 | Fog density 0.12 → 0.07 (rừng hiện dần) | `sine.inOut` |
| 1.4 | Mở khoá cuộn, gợi ý "Theo đom đóm ↓" | — |

**Trước khi canvas sẵn sàng:** nền `night` + 12 đom đóm CSS (chấm `firefly` với `animate-pulse` lệch `delay`) = chính lớp fallback.
**Reduced-motion:** không bay ra, fade 0.3s.
**Edge case:** tên dài → `text-balance`, cỡ `clamp(26px,9vw,36px)`.

---

### C2 · Bìa rừng (0.00–0.12)

**Mục đích:** h1. Tên hiện như được **đom đóm vẽ**: một đốm sáng chạy ngang, chữ sáng dần theo sau.

**Wireframe:**
```
│   ▌   ·    ▐     ·   ▌     │  ← thân cây hai bên
│      ·        ·            │
│   TRÂN TRỌNG KÍNH MỜI      │  ← 11px fern
│  ·→ Minh Quân              │  ← Great Vibes 52px, sáng dần theo đốm
│          &                 │
│        Thu Hà              │
│  ····························│  ← đường chấm A6
│ Theo ánh đom đóm, mời bạn  │
│ đến chung vui cùng chúng   │
│ tôi.                       │  ← 16px text
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · `<h1>{groom.name} & {bride.name}</h1>` · "Theo ánh đom đóm, mời bạn đến chung vui cùng chúng tôi."

**Timeline (section vào 60%):**
| t (s) | Việc |
|---|---|
| 0.0 | Tiêu đề A1 (y 12) |
| 0.2–1.6 | Tên: `mask-image: linear-gradient(90deg,#000 var(--p),transparent calc(var(--p)+8%))`, GSAP tween biến `--p` từ `-8%` → `100%` (`style` động, được phép theo spec §5); đồng thời 1 chấm sáng HTML (div 6px `firefly` + glow) chạy theo mép `--p` |
| 1.6 | Glow chữ tăng 0 → 0.55 |
| 1.8 | Đường chấm A6, câu mời A1 |

**Chuyển sang C3:** camera bước vào lối (head-bob), đom đóm dạt ra hai bên như mở đường.
**Reduced-motion:** chữ hiện ngay có glow.
**Edge case:** tên 2 dòng → mask chạy riêng từng dòng (mỗi tên là 1 phần tử, tween nối tiếp).

---

### C3 · Hai cành cây (0.12–0.24)

**Wireframe:**
```
│   ╲│                │╱    │  ← 2 cành, 2 ảnh treo dây đay
│   [ảnh images[1]]  [ảnh images[2]]│
│      ·· ··      ·· ··      │  ← đom đóm tụ quanh, ảnh sáng lên
│ ╭──────────╮ ╭──────────╮  │
│ │ NHÀ TRAI │ │ NHÀ GÁI  │  │
│ │Minh Quân │ │ Thu Hà   │  │  ← Be Vietnam Pro 500 18px firefly
│ │Quận 1,   │ │Ba Đình,  │  │  ← 14px text-soft
│ │TP.HCM    │ │Hà Nội    │  │
│ ╰──────────╯ ╰──────────╯  │
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️ chờ chốt: có thì thêm dòng "Ông … · Bà …"; không thì bỏ.
**Timeline (scrub):**
| progress | Việc |
|---|---|
| 0.13 | Camera dừng; `aTarget` = 2 vòng elip quanh 2 ảnh; `uForm` 0 → 1 trong 0.03 progress |
| 0.14–0.16 | `pointLight` tăng 0 → 2.5: ảnh sáng lên từ bóng tối |
| 0.15 | 2 card A1 (stagger 0.15s), **sáng dần** (`opacity`, glow viền) |
| 0.22–0.24 | Đom đóm rời đi, ảnh tối lại, card ra |

**Tương tác:** chạm ảnh → lightbox chân dung.
**Mobile < 360px:** card xếp dọc.

---

### C4 · Ba ảnh treo (0.24–0.42)

**Wireframe (1 mốc):**
```
│   ╲                        │
│    [ ảnh images[3] ]  ··   │  ← treo cành trái, đom đóm quanh
│      ·· ·                  │
│ ╭────────────────────────╮ │
│ │ · LẦN ĐẦU GẶP GỠ        │ │  ← 11px fern
│ │ Đêm ấy có rất nhiều đom │ │
│ │ đóm, nhưng anh chỉ thấy │ │
│ │ một ánh mắt.            │ │
│ ╰────────────────────────╯ │
```
| Mốc | Progress | Tiêu đề | Nội dung viết sẵn | Ảnh | Vị trí trong rừng |
|---|---|---|---|---|---|
| 1 | 0.24–0.30 | Lần đầu gặp gỡ | "Đêm ấy có rất nhiều đom đóm, nhưng anh chỉ thấy một ánh mắt." | `images[3]` | cành trái |
| 2 | 0.30–0.36 | Thương nhau | "Mình đi cùng nhau qua những ngày tối nhất, và luôn có một đốm sáng nhỏ dẫn đường." | `images[4]` | cành phải |
| 3 | 0.36–0.42 | Lời hứa | "Dưới một tán cây, trong tiếng côn trùng rả rích, anh hỏi, và em nói: vâng." | `images[5]` | treo cao phía trước |

**Timeline mỗi mốc:** giống C3 (đom đóm tụ → ảnh sáng → card sáng dần). Giữa hai mốc camera **bước** (head-bob), đom đóm kéo thành dải dẫn tới trạm kế.
**Reduced-motion:** 3 card xếp dọc, ảnh trong card.

---

### C8 · Hành lang ảnh (0.42–0.58)

**Wireframe:**
```
│ [ảnh]  ▌    ·    ▐  [ảnh]  │  ← ảnh treo xen kẽ hai bên lối
│    ▌  [ảnh] · [ảnh]  ▐     │
│        ·  ·  ·  ·          │  ← dải đom đóm dẫn đường giữa lối
│     KỶ NIỆM TRÊN LỐI MÒN   │  ← A2
│ ╭──────────────────────╮   │
│ │  Xem tất cả ảnh  ⊞    │   │  ← viền fern
│ ╰──────────────────────╯   │
```
**Timeline:** camera đi đều, không dừng. Mỗi ảnh `uBright` 0.15 → 1 khi khoảng cách tới camera < 6, rồi giảm lại khi đi qua (A3 trong 3D). Tiêu đề A2 khi section vào.
**Tương tác:** chạm ảnh → lightbox A10; "Xem tất cả ảnh" → lưới 2 cột HTML.

---

### C5 + C6 · Khoảng rừng trống (0.58–0.76)

**Wireframe:**
```
│  ◠·◠·◠·◠·◠·◠·◠·◠·◠·◠       │  ← đèn dây vòm amber
│   ◠·◠·◠·◠·◠·◠·◠·◠          │
│ ╭────────────────────────╮ │
│ │    CHÚNG TÔI CƯỚI       │ │  ← 11px fern
│ │          14             │ │  ← Be Vietnam Pro 200 80px firefly, glow
│ │    THÁNG 11 · 2026      │ │  ← `date` ⚠️
│ │       Thứ Bảy           │ │
│ │ 45 · 06 · 12 · 33       │ │  ← A7
│ │ ngày  giờ  phút  giây   │ │
│ │ ······················  │ │
│ │ Lễ thành hôn    17:00   │ │
│ │ Tiệc cưới       18:30   │ │
│ │ Tiệc tối ngoài trời,    │ │
│ │ mời bạn mang áo khoác   │ │  ← ghi chú viết sẵn, text-soft
│ ╰────────────────────────╯ │
```
**Nội dung:** ngày từ `date` ⚠️ (chưa có thì ngày mẫu `2026-11-14T17:00`, ẩn đếm ngược). Qua ngày cưới: *"Chúng tôi đã về chung một nhà ♥"*. Sự kiện hardcode.
**Timeline (scrub + giây):**
| Mốc | Việc |
|---|---|
| progress 0.60–0.66 | Đèn dây sáng lần lượt từ 2 đầu vào giữa (attribute `aOrder` như lantern) |
| section vào 55% | Card sáng dần 0.9s; số "14" sáng + glow; đếm ngược A7 |
**Reduced-motion:** tĩnh.

---

### C7 · Mũi tên sáng (0.76–0.88)

**Wireframe:**
```
│          ·                 │
│         · ·   ← đom đóm    │
│        ·   ·   xếp mũi tên │
│          ·     chỉ xuống   │
│          ·                 │
│ ╭────────────────────────╮ │
│ │  ĐƯỜNG TỚI TIỆC         │ │
│ │  {venue.name}           │ │
│ │  [ <MapEmbed/> 200px ]  │ │
│ │  [ Chỉ đường ➚ ]        │ │  ← nền firefly chữ night
│ ╰────────────────────────╯ │
```
**Timeline:** progress 0.78: `aTarget` = mũi tên (khoảng 120 điểm, phần đom đóm còn lại tiếp tục bay tự do với `aForm` riêng = 0); mũi tên "đập" nhẹ `y ±0.2` lặp. Card A1.
**Nội dung:** `venue.name` (rỗng → "Nhà hàng tiệc cưới"), `<MapEmbed>`, "Chỉ đường".

---

### C9 + C10 · Tên viết tắt (0.88–1.00)

**Wireframe:**
```
│                            │
│    ·Q·    ·♥·    ·H·       │  ← đom đóm xếp thành "Q ♥ H"
│    · ·   · · ·   · ·       │
│                            │
│   Cảm ơn bạn đã theo ánh   │
│   đom đóm đến với chúng    │
│   tôi.                     │  ← 18px text
│   ┌──────────────────┐     │
│   │    images[7]     │     │  ← ảnh cuối, viền bark
│   └──────────────────┘     │
│    Minh Quân & Thu Hà      │  ← Great Vibes 32px firefly
│ [ ▶ Xem video của chúng tôi ] │  ← chỉ khi có videos[0]
```
**Nội dung:** chữ viết tắt = chữ cái đầu của **từ cuối** mỗi tên (hàm `initials()` như letter-2d: "Minh Quân" → "Q", "Thu Hà" → "H"); giữ nguyên dấu nếu có ("Đức" → "Đ"). Câu cảm ơn viết sẵn.
**Timeline:**
| progress / t | Việc |
|---|---|
| 0.88 | `aTarget` = điểm lấy mẫu chữ "Q ♥ H" (§10.3); `uForm` 0 → 1 trong 2.5s (theo giây, không scrub, để hình thành trọn vẹn) |
| +2.5s | Nhạc tăng 0.5 → 0.7; đom đóm trong chữ nhấp nháy **đồng bộ** (phase = 0) 3 nhịp rồi trở lại lệch pha |
| section vào 60% | Câu cảm ơn A1, ảnh A3, chữ ký sáng dần |

**Video:** lightbox `<video controls playsInline>`, nhạc tạm dừng khi video phát.
**Edge case:** tên không có chữ cái Latin đầu (ví dụ bắt đầu bằng số) → dùng ký tự đầu bất kỳ; mobile 280 đom đóm vẫn đủ nét chữ (lấy mẫu lưới thưa hơn).
**Reduced-motion:** không đội hình; chữ viết tắt hiện bằng HTML Great Vibes 48px có glow.

---

## 7. Fallback (không có WebGL hoặc reduced-motion)
- Không mount canvas. Nền `night` + ảnh `fallback-forest.webp` (bóng cây đen trên nền xanh đen, ≤ 100KB) cố định, phủ gradient tối ở đáy.
- **Đom đóm CSS (A8):** 30 chấm `firefly` 3–5px, vị trí ngẫu nhiên cố định theo index, bay bằng keyframe `animate-firefly-3d-drift` (khai báo trong `@theme`, tiền tố slug) + `animate-pulse`. Tắt chuyển động khi reduced-motion, chỉ giữ nhấp nháy opacity rất chậm (hoặc tắt luôn).
- Ảnh C3, C4 vào card; C8 lưới 2 cột; C10 chữ viết tắt HTML.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`, `frameloop="demand"` trước khi mở, khi tab ẩn.
- Đom đóm: 1 draw call, toàn bộ chuyển động trong shader. CPU chỉ ghi lại `aTarget` khi đổi chương (≤ 8 lần cả trang), `needsUpdate` 1 lần.
- Additive `Points` gây overdraw khi camera sát đám đông: giới hạn `gl_PointSize` tối đa 24px (mobile 16px).
- Cây, tán, dương xỉ: `InstancedMesh`, chỉ dựng dọc lối trong bán kính 12 đơn vị.
- Chỉ 1–2 `pointLight` hoạt động cùng lúc.
- Texture người dùng qua `useSafeTexture`.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, nền mờ của lightbox video |
| `images[1]` / `images[2]` | Ảnh treo C3 |
| `images[3..5]` | 3 ảnh mốc C4 |
| `images[3..7]` | Hành lang C8 (dùng lại 3..5, thêm 6, 7) |
| `images[7]` | Ảnh cuối C10 |
| `videos[0]` | C9 |

`meta.media = { images: 8, videos: 1 }`
`meta`: `styles: ["cinematic", "floral"]`, `colors: ["green", "gold"]`, `tags: ["đom đóm", "rừng đêm", "cổ tích"]`.

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/firefly-3d/
├── meta.ts, layout.tsx (Great_Vibes + Be_Vietnam_Pro, vietnamese), page.tsx
└── _components/
    ├── firefly-invite.tsx    # "use client": sections + OpenGate + useScrollProgress + <ForestCanvas/>
    ├── forest-canvas.tsx     # dynamic import scene + fallback
    ├── scene.tsx
    ├── walk-rig.tsx          # đường lối mòn, walk(p), hướng nhìn, head-bob
    ├── walk.ts               # walk(p) từ bảng mốc + tốc độ (có test)
    ├── fireflies.tsx         # Points + shader + đổi đội hình theo chương
    ├── formations.ts         # orbitAround, arrowPoints, textPoints (có test phần thuần)
    ├── trees.tsx             # thân, tán, dương xỉ instanced
    ├── hanging-photos.tsx    # C3, C4, C8
    ├── string-lights.tsx     # C5 đèn dây catenary
    ├── initials.ts           # chữ viết tắt (có test)
    └── sections/*.tsx
```

### 10.2 Tokens
```ts
export const t = {
  root: "bg-[#050D0A] text-[#EEF7EA] font-(family-name:--font-body)",
  card: "rounded-2xl bg-[#0F1F18]/75 backdrop-blur-md border border-[#1C2B22]/60",
  script: "font-(family-name:--font-script) leading-[1.3] text-[#E9F59A] drop-shadow-[0_0_12px_rgba(233,245,154,0.55)]",
  heading: "text-[11px] tracking-[0.35em] uppercase font-medium text-[#7FD1A8]",
  soft: "text-[#A8BBAE]",
  btn: "min-h-11 rounded-full bg-[#E9F59A] px-6 font-medium text-[#050D0A]",
  dots: "border-t border-dotted border-[#7FD1A8]/40",
} as const;
```

### 10.3 Lấy mẫu chữ thành điểm
```ts
// formations.ts
export function textPoints(text: string, font: string, n: number, width = 8): Float32Array {
  const c = document.createElement("canvas"); c.width = 512; c.height = 160;
  const g = c.getContext("2d")!;
  g.font = font; g.textAlign = "center"; g.textBaseline = "middle";
  g.fillText(text, 256, 80);
  const { data } = g.getImageData(0, 0, 512, 160);
  const hits: number[] = [];
  for (let y = 0; y < 160; y += 3) for (let x = 0; x < 512; x += 3)
    if (data[(y * 512 + x) * 4 + 3] > 128) hits.push(x, y);
  return pickEvenly(hits, n, (x, y) => [(x / 512 - 0.5) * width, (0.5 - y / 160) * width * 0.3125, 0]);
}
```
Font: `"96px var(--font-script)"` không dùng được trong canvas → lấy tên font thật từ `getComputedStyle(root).getPropertyValue("--font-script")` và **chờ `document.fonts.ready`** trước khi vẽ. `pickEvenly` (thuần, có test) chọn đều `n` điểm; nếu số điểm trúng < n thì lặp lại điểm (đom đóm trùng chỗ, không sao).

### 10.4 Shader đom đóm (phần then chốt)
```glsl
// vertex
uniform float uTime, uForm, uPixelRatio; uniform vec3 uPointer;
attribute vec3 aHome, aTarget; attribute float aPhase, aFreq;
varying float vBlink;
void main() {
  vec3 wander = aHome + vec3(sin(uTime*0.7*aFreq + aPhase), sin(uTime*0.9*aFreq + aPhase*1.7)*0.6, cos(uTime*0.5*aFreq + aPhase))*0.8;
  vec3 p = mix(wander, aTarget + wander*0.04, smoothstep(0.0, 1.0, uForm));
  vec3 d = p - uPointer; p += normalize(d) * max(0.0, 1.2 - length(d)) * 0.8;   // né ngón tay
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = min(24.0, 60.0 * uPixelRatio / -mv.z);
  vBlink = 0.4 + 0.6 * pow(0.5 + 0.5 * sin(uTime * aFreq * 3.0 + aPhase), 3.0);
}
// fragment: glow tròn mềm
float r = length(gl_PointCoord - 0.5); gl_FragColor = vec4(uColor, vBlink * smoothstep(0.5, 0.0, r));
```
Đổi đội hình: `aHome.copyArray(ướcLượngViTriHienTai)` rồi ghi `aTarget` mới, tween `uForm` 0 → 1. Ước lượng vị trí hiện tại = `mix(wander, aTarget, uForm)` tính lại trên CPU với cùng công thức (hàm `sampleFirefly` trong `formations.ts`).

### 10.5 Logic cần test
- `walk.test.ts`: `walk(p)` đơn điệu không giảm, phẳng trong các khoảng trạm dừng (§4), `walk(0) = 0`.
- `formations.test.ts`: `pickEvenly` trả đúng `n` điểm kể cả khi số điểm đầu vào ít hơn hoặc bằng 0 (trả toàn điểm gốc); `arrowPoints(n)` nằm trong hộp mũi tên.
- `initials.test.ts`: "Minh Quân" → "Q", "Trịnh Đức Hưởng" → "H", "  thu   hà " → "H" (viết hoa, bỏ khoảng trắng thừa).

### 10.6 Thứ tự làm
1. `meta`, `layout`, tokens, sections HTML tĩnh; kiểm tra Great Vibes có dấu ở 360px
2. `walk.ts` + test, walk rig + head-bob, cây + fog → đi bộ xuyên rừng được
3. Hệ đom đóm (wander + nhấp nháy + né con trỏ), C1 timeline, nhạc
4. Ảnh treo + đội hình quanh ảnh (C3, C4), hành lang C8
5. Đèn dây C5, mũi tên C7, chữ viết tắt C10 (`textPoints`)
6. Fallback CSS, đo fps, bundle, Lighthouse ≥ 75, checklist §12

## 11. Asset cần chuẩn bị
- [ ] `music.mp3` (Pixabay, ≤ 3MB) + `CREDITS.md`
- [ ] `fern.webp` 256px có alpha (dương xỉ, tự vẽ hoặc CC0)
- [ ] `fallback-forest.webp` (≤ 100KB)
- [ ] SVG: dây đay, kẹp gỗ
- [ ] 8 ảnh mẫu (ưu tiên ảnh ngoài trời, ánh sáng ấm) + 1 video ≤ 8MB (Pexels)
- [ ] `thumb.webp` 600×800 (lối mòn + đom đóm), `opengraph-image.png`

## 12. Tiêu chí nghiệm thu riêng
- [ ] Rê chuột / chạm: đom đóm dạt ra rõ ràng, quay lại mượt khi rời tay
- [ ] Chữ viết tắt ở C10 đọc được rõ ràng trên mobile 280 hạt (thử "Q ♥ H" và "Đ ♥ H")
- [ ] Ảnh treo tối trước khi đom đóm tới, sáng rõ khi đom đóm tụ quanh
- [ ] Head-bob chỉ có khi đang cuộn, đứng yên thì camera không rung
- [ ] iPhone 12 / Android tầm trung ≥ 45fps khi đom đóm đổi đội hình
- [ ] Tắt WebGL vẫn đọc đủ thiệp, xem đủ 8 ảnh và video
