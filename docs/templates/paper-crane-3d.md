# 3D-04 · `paper-crane-3d` · Ngàn Hạc Giấy

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `src/kit/3d/` đã dựng ở [galaxy-3d](./galaxy-3d.md).

---

## 1. Concept

**Một câu:** Một tờ giấy trắng tự gấp thành con hạc, dẫn khách bay qua một thế giới làm hoàn toàn bằng giấy gấp; mỗi chương là một trang sách pop-up bật dựng lên, và cuối cùng 1000 con hạc cùng bay tụ thành một trái tim, như điều ước của hai người đã thành.

**Cảm xúc muốn gợi:** trong trẻo, dễ thương, tỉ mỉ, "làm bằng tay cho nhau". Nhẹ như giấy, sáng như buổi sáng.

**Phù hợp với:** cặp đôi trẻ, thích phong cách Nhật, tối giản, pastel; ảnh cưới sáng màu, chụp ngoài trời.

**Điểm khác biệt:** mẫu 3D duy nhất có **nền sáng** và **không có ánh sáng động**: mọi thứ flat shading như giấy thật dưới nắng. Camera là **camera bám đuôi** (chase cam) phía sau con hạc, con hạc luôn nằm trong khung hình ở 1/3 dưới. Chuyển cảnh chính là **"gấp/mở giấy"**: mỗi cảnh pop-up **dựng đứng lên từ mặt phẳng** (rotateX quanh nếp gấp) như sách pop-up, và card HTML cũng **mở ra theo nếp gấp** thay vì fade. Kết thúc bằng con số "1000" đếm lên theo cuộn.

**Moodboard:** origami, sách pop-up, giấy washi, tranh cắt giấy (paper cut art) nhiều lớp, pastel hồng và xanh sương, bóng đổ mềm dưới lớp giấy.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `canvas` | `#FAF7F2` | Nền trang, trời trong scene |
| `sheet` | `#FFFFFF` | Nền card (tờ giấy), giấy trắng trong scene |
| `blush` | `#E76F7E` | Màu chủ đạo: hạc chính, trái tim, trang trí |
| `blush-deep` | `#C24F5E` | Nền nút, chữ nhấn hồng |
| `mist` | `#7AA6C2` | Núi giấy, nhà giấy, điểm nhấn phụ |
| `mist-deep` | `#3F6F8C` | Chữ nhấn xanh (liên kết, nhãn) |
| `ink` | `#3A3A3A` | Chữ chính |
| `ink-soft` | `#6E6A66` | Chữ phụ |
| `fold` | `#EDE6DC` | Nếp gấp, đường kẻ, bóng giấy |

Tương phản: `ink` trên `sheet` khoảng 11:1 ✅. `ink-soft` trên `sheet` khoảng 5.4:1 ✅. Chữ trắng trên `blush-deep` khoảng 4.7:1 ✅. `mist-deep` trên `sheet` khoảng 5.4:1 ✅. `blush` trên `sheet` chỉ khoảng 3.1:1 → **không dùng cho chữ** (chỉ trang trí, hoặc chữ ≥ 24px đậm như tên).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Fraunces 600 (opsz 144, SOFT 100) | 44px / 1.05 | 84px | Fraunces có trục "mềm", hợp giấy |
| Tiêu đề chương | Nunito 800, VIẾT HOA, tracking 0.22em | 12px | 13px | |
| Số lớn | Fraunces 700 italic | 96px | 144px | Ngày cưới, số "1000" |
| Nội dung | Nunito 500 | 16px / 1.7 | 18px | |
| Chú thích | Fraunces 400 italic | 15px | 16px | |

Cả hai font có subset `vietnamese`. Fraunces là variable font: khai báo `axes: ["opsz", "SOFT"]` trong `next/font`.

### Hình khối và chất liệu
- **Tờ giấy (card):** `rounded-[0.25rem]`, nền `sheet`, **không viền**, bóng giấy hai lớp `shadow-[0_1px_0_#EDE6DC,0_14px_28px_-14px_rgba(58,58,58,0.25)]`. Có **nếp gấp** giữa card: một đường `fold` 1px + gradient bóng `bg-[linear-gradient(90deg,transparent_49.5%,rgba(0,0,0,0.04)_50%,transparent_50.5%)]`.
- **Góc gấp:** góc dưới trái card gấp lên (tam giác CSS bằng `clip-path` + nền `fold`), trang trí.
- **Ảnh:** dán lên giấy bằng **băng washi** (2 dải chữ nhật xoay ±8°, nền `blush/40` hoặc `mist/40`, mép răng cưa bằng `mask`).
- **Icon:** hạc giấy, trái tim, nhà, nhẫn: SVG hình học nhiều tam giác (low-poly), nét 1.5px `mist-deep`.
- **Motion:** ease chủ đạo `back.out(1.4)` cho bật dựng (pop-up); `power2.inOut` cho camera. Có **nảy nhẹ**, khác hẳn galaxy/lantern.

---

## 3. Nhạc
- **Tâm trạng:** music box và piano, trong trẻo, vui nhẹ, không lời.
- **Tempo:** khoảng 90 BPM. **Độ dài:** 2:00–3:00, lặp.
- **Từ khoá Pixabay:** `music box lullaby`, `soft piano happy`, `cute music box love`
- **Hành vi:**
  - Bắt đầu khi bấm "Gấp hạc" (C1). Âm lượng 0 → 0.6 trong 1.5s.
  - **Tiếng giấy** (`paper-fold.mp3`, tiếng gấp giấy ngắn ≤ 30KB): phát 1 lần ở màn gấp hạc và mỗi khi một cảnh pop-up bật dựng. Chỉ phát khi nhạc đang bật, `volume 0.4`.
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **900svh**. Canvas `fixed inset-0 -z-10`, nền `canvas`.

```
┌───────────────────────────┐
│ #gate    C1  Tờ giấy       │ 100svh  gấp thành hạc
├───────────────────────────┤
│ #names   C2  Núi giấy      │ 120svh  hạc cất cánh
│ #couple  C3  Nhà pop-up    │ 120svh  2 nhà bật dựng
│ #story   C4  3 khung gấp   │ 160svh  tranh ba tấm
│ #album   C8  Dây thiệp     │ 140svh  thiệp treo trên dây, gió
│ #date    C5+C6 Thung lũng  │ 120svh
│ #venue   C7  Bản đồ gấp    │ 100svh  bản đồ giấy mở kiểu accordion (HTML)
│ #thanks  C10 Ngàn hạc      │ 120svh  1000 hạc tụ thành tim
└───────────────────────────┘
```

| Chương | Progress | HTML section | Card | Cảnh |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | tờ giấy phẳng |
| 1 | 0.00–0.13 | `#names` | C2 | bay qua núi giấy |
| 2 | 0.13–0.26 | `#couple` | C3 | 2 nhà pop-up bật từ mặt đất |
| 3 | 0.26–0.44 | `#story` | C4 | 3 khung ảnh gấp ba (triptych) |
| 4 | 0.44–0.60 | `#album` | C8 | dây phơi thiệp |
| 5 | 0.60–0.73 | `#date` | C5 + C6 | thung lũng giấy, mặt trời giấy |
| 6 | 0.73–0.84 | `#venue` | C7 | hạc đậu trên đỉnh đồi |
| 7 | 0.84–1.00 | `#thanks` | C10 | ngàn hạc, trái tim |

### Keyframe camera (bám đuôi con hạc)
Không nội suy vị trí camera tuyệt đối. Nội suy **vị trí con hạc** `crane(p)` và **độ lệch camera so với hạc** `offset(p)`; camera = `crane(p) + offset(p)`, nhìn vào `crane(p) + lookAhead(p)`. Thế giới trải dài theo **+x** (bay ngang sang phải, như lật từng trang sách).

| progress | crane(p) | offset(p) | lookAhead | Ghi chú |
|---|---|---|---|---|
| 0.00 | `[0, 0.5, 0]` | `[0, 2.5, 6]` | `[0, 0, 0]` | Nhìn hạc từ trước-trên, vừa gấp xong |
| 0.13 | `[40, 8, 0]` | `[-7, 2, 5]` | `[6, 0, 0]` | Bám đuôi, núi giấy hai bên |
| 0.26 | `[80, 4, 0]` | `[-4, 5, 10]` | `[4, -2, 0]` | Cao lên nhìn xuống 2 nhà pop-up |
| 0.44 | `[140, 5, 0]` | `[-2, 1, 9]` | `[3, 0, -2]` | Ngang tầm, lướt qua 3 khung |
| 0.60 | `[200, 6, 0]` | `[0, 0.5, 8]` | `[4, 0, 0]` | Dọc theo dây thiệp |
| 0.73 | `[240, 10, 0]` | `[-8, 3, 12]` | `[6, -1, 0]` | Toàn cảnh thung lũng |
| 0.84 | `[270, 6, 0]` | `[-3, 2, 6]` | `[0, 0, 0]` | Hạc đậu trên đỉnh đồi |
| 1.00 | `[270, 20, 0]` | `[0, 0, 44]` | `[0, 0, 0]` | Kéo xa, trái tim 1000 hạc |

Giữa các keyframe `crane(p)` được cộng dao động bay `y += sin(t·2.2)·0.25` và nghiêng cánh (`rotation.z` theo đạo hàm `y` của đường bay). Làm mượt `lerp(1 - exp(-3·delta))` (mềm hơn galaxy để cảm giác bồng bềnh).

---

## 5. Các đối tượng trong scene

Toàn bộ dùng `meshLambertMaterial flatShading` (hoặc `meshToonMaterial` với gradientMap 3 bậc) và **1 `directionalLight` cố định** + `ambientLight 0.7`. Bóng đổ **không** dùng shadow map; dùng drei `<ContactShadows>` 1 lần cho mỗi cảnh pop-up (desktop) hoặc plane bóng mờ vẽ sẵn (mobile).

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Hạc dẫn đường | `crane.glb` (≤ 300KB) có 2 clip: `fold` (tờ giấy phẳng → hạc, 1.6s) và `flap` (vỗ cánh lặp). `useAnimations` của drei. Màu `blush` mặt trên, `#F4A9B3` mặt dưới | 1 |
| Hạc dự phòng | nếu chưa có glb: hạc thủ tục từ `BufferGeometry` 14 tam giác (thân, cổ, đuôi, 2 cánh là mesh con xoay quanh trục thân), không có clip gấp → màn C1 dùng fade tờ giấy sang hạc | 1 |
| Núi giấy | `ConeGeometry(r, h, 4–6)` flat shading, 3 lớp xa gần (màu `mist` đậm dần), `InstancedMesh` | 40 / 20 |
| Mây giấy | plane cắt hình mây (ShapeGeometry từ 5 cung tròn) màu trắng, bóng lệch phía dưới | 12 / 6 |
| Mặt đất | plane `#F1ECE3` có vân nếp gấp (texture `fold-grid.webp` 512px lặp) | 1 |
| Nhà pop-up (C3) | mỗi nhà = 4 plane (2 tường, 2 mái) nối bằng **nếp gấp**; cả khối xoay `rotation.x` từ `-π/2` (nằm phẳng) → `0` (dựng đứng) theo progress, ease `back.out(1.4)`. Cửa sổ là plane ảnh `images[1]` (nhà trái) / `images[2]` (nhà phải) | 2 |
| Khung gấp ba (C4) | 3 tấm giấy dựng đứng nối nhau như bình phong; mỗi tấm 1 plane ảnh `images[3..5]` có viền trắng 6%; ba tấm mở dần từ gấp chồng (góc 170°) → phẳng (góc 20°) | 1 bộ |
| Dây thiệp (C8) | 1 đường catenary (drei `<Line>`) + 6 thiệp giấy (plane ảnh `images[0..5]` + viền trắng) treo bằng kẹp gỗ nhỏ (box); lắc theo "gió": `rotation.x = sin(t·1.6 + i)·0.12` | 6 |
| Mặt trời giấy (C5) | 12 tam giác xếp tròn quanh 1 đĩa, màu `#F6C177`, xoay chậm | 1 |
| Đồi và cờ (C7) | cone thấp + cột cờ + cờ tam giác `blush` gợn theo sin (vertex shader nhỏ) | 1 |
| Ngàn hạc (C10) | `InstancedMesh` dùng geometry hạc (lấy từ glb hoặc hạc thủ tục) 1000 / 400 instance, màu `instanceColor` xen `blush`, `mist`, trắng, `#F6C177`. Vị trí nội suy từ **đám mây ngẫu nhiên** → **điểm trên hình trái tim** (§10.3) | 1000 / 400 |

**Tương tác con trỏ:** hạc dẫn đường **nhìn theo** con trỏ (quay đầu `±15°`), camera lệch `x ± 0.5`. Chạm vào hạc: hạc vỗ cánh nhanh 3 nhịp + tiếng giấy. Chạm thiệp C8: mở lightbox.

---

## 6. Chi tiết từng section HTML

Card (tờ giấy) đặt ở **nửa dưới** màn hình, canh giữa, rộng `min(88vw, 400px)`. Chữ trực tiếp trên canvas màu `ink` (nền sáng nên không cần drop-shadow). Không đặt gì ở 3 góc nút chung.

### C1 · Tờ giấy (màn mở)

**Mục đích:** khoảnh khắc "phép màu" đầu tiên; xin quyền nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←                      ♪   │
│                            │
│       ┌────────────┐       │  ← tờ giấy vuông 3D (hồng), nằm nghiêng nhẹ
│       │ ╲        ╱ │       │     có nếp gấp mờ
│       │   ╲    ╱   │       │
│       │   ╱    ╲   │       │
│       └────────────┘       │
│   Minh Quân & Thu Hà       │  ← Fraunces 30px ink
│  gửi bạn một điều ước nhỏ  │  ← Fraunces italic 15px ink-soft
│      ╭──────────────╮      │
│      │  GẤP HẠC  ✈   │      │  ← nền blush-deep, chữ trắng, A12
│      ╰──────────────╯      │
└────────────────────────────┘
```
**Timeline khi bấm (2.0s):**
| t (s) | Việc | Ease |
|---|---|---|
| 0.0 | `music.play()` (fade 1.5s), tiếng gấp giấy | — |
| 0.0–0.3 | Nút và chữ `scale 1 → 0.95`, `opacity → 0` | `power2.in` |
| 0.1–1.7 | Clip `fold` của `crane.glb` (tờ giấy gấp thành hạc) | theo clip |
| 1.5–2.0 | Clip `flap` blend vào (crossFade 0.4s); hạc bay lên `y 0.5 → 1.5` | `back.out(1.4)` |
| 2.0 | Mở khoá cuộn; gợi ý "Cuộn để bay cùng hạc ↓" A12 | — |

**Trước khi canvas sẵn sàng:** nền `canvas` + SVG hạc giấy tĩnh ở giữa (cũng là ảnh fallback).
**Reduced-motion:** không chạy clip gấp, hạc hiện ngay (fade 0.3s).
**Edge case:** `crane.glb` tải lỗi → hạc thủ tục + fade (không chặn mở thiệp).

---

### C2 · Núi giấy (0.00–0.13)

**Wireframe:**
```
│   ▲    ✈      ▲▲           │  ← hạc bay giữa núi giấy
│  ▲▲▲       ☁      ▲▲▲      │
│                            │
│   TRÂN TRỌNG KÍNH MỜI      │  ← Nunito 800 12px mist-deep
│     Minh Quân              │  ← Fraunces 44px ink (h1)
│         &                  │  ← blush 32px
│       Thu Hà               │
│  ╭──────────────────────╮  │
│  │ "Người ta nói gấp đủ  │  │
│  │ nghìn con hạc sẽ được │  │
│  │ một điều ước. Điều ước│  │
│  │ của chúng tôi đã thành│  │
│  │ sự thật."             │  │  ← tờ giấy, Nunito 16px
│  ╰──────────────────────╯  │
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · `<h1>{groom.name} & {bride.name}</h1>` · câu viết sẵn như wireframe.
**Timeline (section vào 60%):**
| t (s) | Việc |
|---|---|
| 0.0 | Tiêu đề A1 |
| 0.15 | Tên A2 theo ký tự, mỗi ký tự `rotateX -90° → 0` (origin bottom, như gập lên), stagger 0.03, `back.out(1.4)` |
| 0.8 | Tờ giấy **mở theo nếp gấp**: nửa trên `rotateX -180° → 0` quanh nếp giữa (`origin-bottom`, `transform-3d`, `backface-hidden`), 0.7s |

**Chuyển sang C3:** T8, hạc bay vào vùng đất phẳng, camera nâng cao.
**Edge case:** tên ≥ 30 ký tự tắt hiệu ứng theo ký tự (chuyển sang theo từ) để tránh quá nhiều span.

---

### C3 · Nhà pop-up (0.13–0.26)

**Wireframe:**
```
│    ⌂[ảnh]        ⌂[ảnh]    │  ← 2 nhà giấy bật dựng, cửa sổ là ảnh
│   ▔▔▔▔▔▔▔       ▔▔▔▔▔▔▔    │
│ ╭──────────╮ ╭──────────╮  │
│ │ NHÀ TRAI │ │ NHÀ GÁI  │  │  ← 2 tờ giấy nhỏ, xoay -2° / +2°
│ │Minh Quân │ │ Thu Hà   │  │  ← Fraunces 22px
│ │Quận 1,   │ │Ba Đình,  │  │  ← Nunito 14px ink-soft
│ │TP.HCM    │ │Hà Nội    │  │
│ ╰──────────╯ ╰──────────╯  │
```
**Nội dung:** `groom.*`, `bride.*`. Tên bố mẹ ⚠️ chờ chốt: có thì thêm dòng "Ông … · Bà …" 13px; không có thì bỏ.
**Timeline (scrub theo progress):**
| progress | Việc |
|---|---|
| 0.14–0.18 | Nhà trái bật dựng (`rotation.x -π/2 → 0`), tiếng giấy khi đạt 90% |
| 0.16–0.20 | Nhà phải bật dựng |
| 0.18 | 2 card vào: **mở gấp** từ `rotateX 90° → 0` (origin top, như tấm thẻ lật xuống), stagger 0.15s |
| 0.24–0.26 | Nhà gập nằm xuống lại (đảo ngược), card ra `opacity → 0` |

**Tương tác:** chạm nhà → lightbox chân dung.
**Mobile < 360px:** card xếp dọc.
**Reduced-motion:** nhà đứng sẵn; ảnh chân dung nằm trong card.

---

### C4 · Khung gấp ba (0.26–0.44)

**Mục đích:** chuyện tình. Ba tấm tranh gấp như bình phong mở dần, mỗi tấm một mốc.

**Wireframe:**
```
│   ┌────┐┌────┐┌────┐       │  ← bình phong 3 tấm (3D), mở dần
│   │img3││img4││img5│       │
│   └────┘└────┘└────┘       │
│ ╭────────────────────────╮ │
│ │ ① ② ③                  │ │  ← 3 chấm, chấm hiện tại blush
│ │ LẦN ĐẦU GẶP GỠ         │ │
│ │ Một buổi sáng mưa, hai │ │
│ │ chiếc ô, một cái chạm  │ │
│ │ vai.                   │ │
│ ╰────────────────────────╯ │
```
| Mốc | Progress | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|
| 1 | 0.26–0.32 | Lần đầu gặp gỡ | "Một buổi sáng mưa, hai chiếc ô, một cái chạm vai. Chẳng ai ngờ đó là trang đầu tiên." | `images[3]` |
| 2 | 0.32–0.38 | Thương nhau | "Mỗi ngày gấp thêm một con hạc, mỗi con hạc là một điều nhỏ xíu mình thương ở nhau." | `images[4]` |
| 3 | 0.38–0.44 | Lời hứa | "Con hạc thứ một nghìn có giấu một chiếc nhẫn. Và em đã gật đầu." | `images[5]` |

**Section này pin (T2):** section cao 160svh, card `sticky` ở nửa dưới; nội dung card **crossfade** giữa 3 mốc theo progress, hiệu ứng mỗi lần đổi: nội dung cũ gập `rotateX 0 → 90°` (0.3s), nội dung mới mở `-90° → 0` (0.4s, `back.out(1.4)`).
**Scene:** góc mở bình phong nội suy `170° → 20°`, camera lướt qua từng tấm; tấm của mốc hiện tại `scale 1.06`.
**Reduced-motion:** 3 card xếp dọc, mỗi card có ảnh; không pin.

---

### C8 · Dây thiệp (0.44–0.60)

**Wireframe:**
```
│  ◠‿◠‿◠‿◠‿◠‿◠‿◠‿◠‿◠‿◠      │  ← dây (3D), 6 thiệp treo lắc theo gió
│  ▯   ▯   ▯   ▯   ▯   ▯     │
│                            │
│     NHỮNG TẤM THIỆP NHỎ    │  ← A2
│  Chạm vào tấm thiệp để xem │
│  ╭──────────────────────╮  │
│  │  Xem tất cả ảnh  ⊞    │  │  ← viền mist-deep
│  ╰──────────────────────╯  │
```
**Timeline:** camera lướt dọc dây (scrub). Khi section vào 50%: một **cơn gió** chạy dọc dây (biên độ lắc 0.12 → 0.35 → 0.12 trong 1.5s, lệch pha theo i) và 20 mảnh giấy vụn bay ngang.
**Tương tác:** chạm thiệp → A10 lightbox; "Xem tất cả ảnh" → lưới HTML 2 cột, mỗi ảnh có băng washi, xoay ngẫu nhiên ±2° (xoay cố định theo index, không random mỗi render).
**Edge case:** ảnh ngang → thiệp đổi sang tỉ lệ ngang (plane theo aspect thật).

---

### C5 + C6 · Thung lũng (0.60–0.73)

**Wireframe:**
```
│        ✹ mặt trời giấy     │
│   ▲▲   ▔▔▔▔▔▔▔▔▔▔   ▲▲▲    │
│ ╭────────────────────────╮ │
│ │     NGÀY CHÚNG TÔI      │ │
│ │      VỀ CHUNG NHÀ       │ │
│ │ ┌────┐┌────┐┌────┐      │ │
│ │ │ 14 ││ 11 ││2026│      │ │  ← 3 ô giấy gấp, Fraunces italic 40px
│ │ └────┘└────┘└────┘      │ │     ⚠️ `date`
│ │      Thứ Bảy            │ │
│ │ 45 ngày 06 giờ 12 phút  │ │  ← A7, mỗi số trong ô giấy nhỏ
│ │ ──────── ✈ ────────     │ │
│ │ Lễ thành hôn    10:00   │ │
│ │ Tiệc cưới       18:00   │ │
│ ╰────────────────────────╯ │
```
**Nội dung:** ngày từ `date` ⚠️ (chưa có thì ngày mẫu `2026-11-14T18:00`, ẩn đếm ngược). Qua ngày cưới: *"Điều ước đã thành sự thật ♥"*. Sự kiện hardcode.
**Timeline:** tờ giấy mở theo nếp giữa (như C2). 3 ô ngày **bật dựng** lần lượt (`rotateX 90° → 0`, stagger 0.12s, `back.out(1.8)`). Đếm ngược lật A7.
**Reduced-motion:** hiện tĩnh, đếm ngược vẫn chạy.

---

### C7 · Bản đồ gấp (0.73–0.84)

**Mục đích:** địa điểm. **Bản đồ giấy gấp accordion** mở ra trong HTML (khác mọi mẫu khác).

**Wireframe (trạng thái mở):**
```
│          ⛳ đồi, hạc đậu    │
│ ╭────────────────────────╮ │
│ │  ĐỊA ĐIỂM               │ │
│ │  {venue.name}           │ │
│ │ ┌──────┬──────┬──────┐  │ │  ← 3 nếp gấp dọc phủ lên bản đồ
│ │ │      │<Map  │      │  │ │
│ │ │      │Embed>│      │  │ │  ← MapEmbed cao 220px
│ │ └──────┴──────┴──────┘  │ │
│ │ [ Chỉ đường ➚ ]         │ │  ← nền blush-deep chữ trắng
│ ╰────────────────────────╯ │
```
**Hiệu ứng:** khung bản đồ ban đầu là 3 "tấm" gập chồng (chỉ thấy 1/3). Khi section vào 50%: 2 tấm bên mở ra `rotateY ±180° → 0` (origin ở nếp), 0.5s mỗi tấm, `power2.out`. Ba tấm là **lớp phủ** giấy trong suốt dần phía trên một `<MapEmbed>` duy nhất (không cắt iframe làm 3), sau khi mở xong lớp phủ `opacity → 0` và `pointer-events-none` để bản đồ tương tác bình thường.
**Nội dung:** `venue.name` (rỗng → "Nhà hàng tiệc cưới"), `<MapEmbed venue={data.venue}/>`, nút "Chỉ đường".
**Reduced-motion:** bản đồ hiện sẵn.

---

### C10 · Ngàn hạc (0.84–1.00)

**Mục đích:** cao trào. 1000 hạc bay tụ thành trái tim, con số đếm lên.

**Wireframe:**
```
│      ✈ ✈✈   ✈✈ ✈           │
│    ✈✈✈✈✈✈ ✈✈✈✈✈✈          │  ← hạc tụ thành trái tim
│     ✈✈✈✈✈✈✈✈✈✈✈           │
│       ✈✈✈✈✈✈✈             │
│          ✈                 │
│          1000              │  ← Fraunces italic 96px blush-deep, đếm theo cuộn
│   con hạc · một điều ước   │  ← Nunito 14px ink-soft
│ ╭────────────────────────╮ │
│ │ Cảm ơn bạn đã đến và   │ │
│ │ trở thành một con hạc  │ │
│ │ trong điều ước của     │ │
│ │ chúng tôi.             │ │
│ │  Minh Quân & Thu Hà    │ │  ← Fraunces 22px
│ ╰────────────────────────╯ │
```
**Timeline (scrub):**
| progress | Việc |
|---|---|
| 0.84–0.88 | Hạc dẫn đường bay vút lên; các hạc khác xuất hiện từ mép màn hình (scale 0 → 1) |
| 0.86–0.96 | `uForm` 0 → 1: mỗi hạc nội suy từ vị trí mây ngẫu nhiên tới điểm trái tim, có độ trễ theo index (`delay = i/N·0.4`) |
| 0.86–0.96 | Số đếm `Math.round(uForm·N)` → hiển thị (N = 1000 desktop; mobile vẫn **hiển thị 1000** dù chỉ vẽ 400 hạc, số là con số biểu tượng) |
| 0.96–1.00 | Trái tim "đập" 2 nhịp (scale 1 → 1.06 → 1), card cảm ơn mở theo nếp gấp |

Hạc trong trái tim vẫn vỗ cánh (vertex shader xoay 2 cánh theo `sin(uTime·8 + instanceId)`; cần geometry hạc có attribute đánh dấu đỉnh nào thuộc cánh, xem §10.3).
**Reduced-motion:** không bay; hiện ảnh tĩnh trái tim hạc `fallback-heart.webp` và số "1000" tĩnh.

---

## 7. Fallback (không có WebGL hoặc reduced-motion)
- Không mount canvas. Nền `canvas` + các lớp **giấy cắt SVG** (3 lớp núi `mist` đậm dần, có bóng `drop-shadow`) cố định ở đáy màn hình.
- Hạc giấy SVG bay theo đường cong bằng A6 (vẽ đường bay nét đứt) + hạc chạy theo đường bằng `MotionPathPlugin` của GSAP (miễn phí từ 3.13), `scrub` theo cuộn toàn trang. Tắt khi reduced-motion (chỉ còn hạc đứng yên).
- Ảnh chân dung vào card C3; C4 thành 3 card có ảnh; C8 thành lưới 2 cột; C10 dùng `fallback-heart.webp`.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`, `frameloop="demand"` trước khi mở và khi tab ẩn.
- Không shadow map; `ContactShadows` chỉ desktop, `frames={1}` (bake 1 lần mỗi cảnh).
- Ngàn hạc: 1 `InstancedMesh`, nội suy vị trí **trong vertex shader** qua 2 attribute `aFrom`, `aTo` và uniform `uForm` → không cập nhật 1000 ma trận mỗi frame. Mobile 400 instance.
- Geometry hạc cho instanced ≤ 40 tam giác (dùng hạc thủ tục, không dùng mesh glb chi tiết).
- Mỗi cảnh pop-up chỉ `visible` trong khoảng progress của nó ±0.06.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thiệp đầu tiên trên dây C8, thumbnail, OG |
| `images[1]` / `images[2]` | Cửa sổ nhà pop-up trái / phải (C3) |
| `images[3..5]` | 3 tấm bình phong C4 |
| `images[0..5]` | 6 thiệp trên dây C8 |
| `videos` | Không dùng |

`meta.media = { images: 6, videos: 0 }`
`meta`: `styles: ["minimalist", "playful"]`, `colors: ["white", "pink"]`, `tags: ["hạc giấy", "origami", "pastel"]`.

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/paper-crane-3d/
├── meta.ts, layout.tsx (Fraunces + Nunito, vietnamese), page.tsx
└── _components/
    ├── crane-invite.tsx      # "use client": sections + OpenGate + useScrollProgress + <CraneCanvas/>
    ├── crane-canvas.tsx      # dynamic import scene + fallback
    ├── scene.tsx             # ánh sáng cố định, nền canvas, các cảnh
    ├── chase-rig.tsx         # crane(p), offset(p), lookAhead → camera
    ├── lead-crane.tsx        # glb + useAnimations (fold/flap) hoặc hạc thủ tục
    ├── crane-geometry.ts     # hạc thủ tục 14 tam giác + attribute aWing
    ├── paper-mountains.tsx
    ├── popup-houses.tsx      # C3
    ├── triptych.tsx          # C4
    ├── card-line.tsx         # C8
    ├── valley.tsx            # C5–C7: mặt trời giấy, đồi, cờ
    ├── thousand-cranes.tsx   # C10
    ├── heart.ts              # heartPoints(n) (có test)
    ├── fold-card.tsx         # tờ giấy HTML mở theo nếp gấp (dùng chung các section)
    └── sections/*.tsx
```

### 10.2 Tokens
```ts
export const t = {
  root: "bg-[#FAF7F2] text-[#3A3A3A] font-(family-name:--font-body)",
  sheet: "rounded-[0.25rem] bg-white shadow-[0_1px_0_#EDE6DC,0_14px_28px_-14px_rgba(58,58,58,0.25)]",
  crease: "bg-[linear-gradient(90deg,transparent_49.5%,rgba(0,0,0,0.04)_50%,transparent_50.5%)]",
  display: "font-(family-name:--font-display)",
  heading: "text-xs tracking-[0.22em] uppercase font-extrabold text-[#3F6F8C]",
  soft: "text-[#6E6A66]",
  btn: "min-h-11 rounded-[0.25rem] bg-[#C24F5E] px-6 font-bold text-white",
  washi: "absolute h-5 w-16 bg-[#E76F7E]/40 [mask:radial-gradient(circle_at_2px_50%,transparent_2px,#000_2.5px)_left/4px_100%_repeat-y]",
} as const;
```

### 10.3 Ngàn hạc: trái tim trong shader
```ts
// heart.ts
export function heartPoints(n: number, scale = 0.9, seed = 1): Float32Array {
  const out = new Float32Array(n * 3);
  const rand = mulberry32(seed);             // random cố định để SSR/CSR và test ổn định
  for (let i = 0; i < n; i++) {
    const t = rand() * Math.PI * 2, r = Math.sqrt(rand()); // lấp đầy trong lòng tim, không chỉ viền
    out[i * 3]     = 16 * Math.sin(t) ** 3 * r * scale;
    out[i * 3 + 1] = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * r * scale;
    out[i * 3 + 2] = (rand() - 0.5) * 4;
  }
  return out;
}
```
```tsx
// thousand-cranes.tsx (rút gọn)
geo.setAttribute("aFrom", new THREE.InstancedBufferAttribute(cloudPoints(n), 3));
geo.setAttribute("aTo", new THREE.InstancedBufferAttribute(heartPoints(n), 3));
geo.setAttribute("aDelay", new THREE.InstancedBufferAttribute(delays(n), 1));
// vertex: vec3 p = mix(aFrom, aTo, smoothstep(aDelay, aDelay + 0.6, uForm));
//         nếu aWing > 0.5 thì xoay đỉnh quanh trục thân: angle = sin(uTime*8.0 + float(gl_InstanceID)) * 0.6
//         transformed = transformed + p;  (hạc luôn hướng +x, không cần ma trận instance)
useFrame((_, d) => { u.uTime.value += d; u.uForm.value = formFromProgress(progress.current); });
```
Vì vị trí nằm trong shader nên `InstancedMesh` cần `frustumCulled={false}` (bounding sphere không biết vị trí thật).

### 10.4 Tờ giấy HTML mở theo nếp
```tsx
// fold-card.tsx: 2 nửa, nửa trên gập lên
<div className="perspective-distant">
  <div ref={top} className={`${t.sheet} origin-bottom transform-3d backface-hidden`}>…nửa trên…</div>
  <div className={`${t.sheet}`}>…nửa dưới…</div>
</div>
useGSAP(() => {
  if (reduced) return;
  gsap.from(top.current, { rotateX: -180, duration: 0.7, ease: "back.out(1.4)",
    scrollTrigger: { trigger: root.current, start: "top 60%" } });
}, { scope: root, dependencies: [reduced] });
```
Chiều cao hai nửa tính theo nội dung; nếu nội dung nửa trên dài hơn nửa dưới, nếp gấp lệch cũng chấp nhận được (giấy thật cũng vậy). Không đo chiều cao bằng JS.

### 10.5 Logic cần test
- `heart.test.ts`: `heartPoints(n)` trả đúng `n·3` phần tử; mọi điểm nằm trong hộp `[-16·s, 16·s] × [-17·s, 13·s]`; cùng seed cho cùng kết quả.
- `chase.test.ts`: `crane(p)` liên tục và `x` đơn điệu tăng; camera tại `p` luôn cách hạc > 3 đơn vị (không xuyên hạc).
- `form.test.ts`: `formFromProgress` = 0 khi `p ≤ 0.86`, = 1 khi `p ≥ 0.96`, đơn điệu.

### 10.6 Thứ tự làm
1. `meta`, `layout` (Fraunces axes), tokens, sections HTML tĩnh + `fold-card`
2. `crane-geometry` (hạc thủ tục) + chase rig + núi giấy → bay xuyên suốt được
3. Tìm/làm `crane.glb` (fold + flap); C1 timeline, nhạc, tiếng giấy
4. Nhà pop-up C3, bình phong C4 (pin T2), dây thiệp C8
5. Thung lũng C5–C7, bản đồ accordion
6. Ngàn hạc + `heart.ts` + số đếm
7. Fallback SVG, reduced-motion, đo fps, bundle, Lighthouse ≥ 75, checklist §12

## 11. Asset cần chuẩn bị
- [ ] `crane.glb` ≤ 300KB, 2 clip `fold` và `flap` (Blender hoặc model CC0; ghi nguồn). ⚠️ Nếu không có, dùng hạc thủ tục + fade (mất khoảnh khắc gấp)
- [ ] `fold-grid.webp` 512px (vân nếp gấp mặt đất)
- [ ] `music.mp3` (≤ 3MB), `paper-fold.mp3` (≤ 30KB) + `CREDITS.md`
- [ ] SVG: hạc giấy (tĩnh + dùng cho fallback), 3 lớp núi giấy cắt, icon low-poly
- [ ] `fallback-heart.webp` (chụp từ scene C10)
- [ ] 6 ảnh mẫu sáng màu (Pexels/Unsplash)
- [ ] `thumb.webp` 600×800 (trái tim hạc), `opengraph-image.png`

## 12. Tiêu chí nghiệm thu riêng
- [ ] Màn gấp hạc chạy mượt, không nháy mesh khi chuyển clip `fold` → `flap`
- [ ] Nền sáng: mọi chữ đạt ≥ 4.5:1, không có chữ màu `blush` cỡ nhỏ
- [ ] Hạc dẫn đường luôn nằm trong khung hình khi cuộn nhanh từ đầu tới cuối
- [ ] 1000 hạc (desktop) / 400 hạc (mobile) tụ thành trái tim rõ hình; iPhone 12 ≥ 45fps ở cảnh này
- [ ] Bản đồ accordion mở xong vẫn kéo/zoom được bản đồ
- [ ] Tắt WebGL vẫn đọc đủ thiệp và xem đủ 6 ảnh
