# 3D-02 · `ocean-3d` · Thư Trong Chai

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `src/kit/3d/` đã dựng ở [galaxy-3d](./galaxy-3d.md) (`SceneCanvas`, `useScrollProgress`, `useSafeTexture`, `sampleKeyframes`).

---

## 1. Concept

**Một câu:** Một chai thư được thả xuống biển lúc hoàng hôn, trôi ra khơi, chìm xuống đáy đại dương qua những rạn san hô chứa kỷ niệm, rồi nổi lên ở một bến cảng lên đèn, nơi lời mời được mở ra.

**Cảm xúc muốn gợi:** lãng mạn, bồng bềnh, hơi hoài niệm. "Lời hứa được gửi đi rất lâu, cuối cùng cũng tới đúng người." Chuyển động luôn **lắc lư theo sóng**, không bao giờ đứng im hoàn toàn.

**Phù hợp với:** cặp đôi yêu biển, cưới ở thành phố biển (Nha Trang, Đà Nẵng, Vũng Tàu, Phú Quốc), có ảnh cưới chụp ở bãi biển.

**Điểm khác biệt:** đây là mẫu 3D duy nhất có **trục dọc**: camera đi từ trên mặt nước xuống đáy biển rồi trồi lên. Khoảnh khắc đẹp nhất là lúc camera nằm **đúng trên mặt nước**: nửa trên màn hình là trời hoàng hôn, nửa dưới là nước xanh, phân cách bằng đường sóng thật (hình học, không phải hiệu ứng giả). Âm thanh cũng "chìm" theo: xuống nước thì nhạc bị bóp nghẹt (lowpass).

**Moodboard:** ảnh chụp nửa trên nửa dưới mặt nước (split-level photography), low-poly ocean kiểu "Sea of Thieves" giản lược, giấy da cuộn buộc dây gai, đèn dầu bến cảng, hải đăng quét sáng trong sương.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `deep` | `#0B2A3C` | Nền trang, màu nước sâu, fog dưới nước |
| `abyss` | `#061722` | Đáy biển, gradient cuối fog |
| `parchment` | `#FDF6EC` / 85% + `backdrop-blur-sm` | Nền card "cuộn giấy" |
| `sunset` | `#F2A65A` | Màu chủ đạo: mặt trời, nút, số lớn, viền dấu |
| `sea` | `#5CC8D7` | Điểm nhấn: bong bóng, đường sóng, liên kết |
| `ink` | `#0B2A3C` | Chữ chính trên `parchment` |
| `ink-soft` | `#3E5A68` | Chữ phụ trên `parchment` |
| `foam` | `#F4FBFC` | Chữ nổi trực tiếp trên canvas (tên, tiêu đề) |

Tương phản: `ink` trên `parchment` khoảng 13:1 ✅. `ink-soft` trên `parchment` khoảng 6.8:1 ✅. `foam` trên `deep` khoảng 13:1 ✅. `sunset` trên `deep` khoảng 7.2:1 ✅ (dùng cho số lớn trên canvas). **Không** dùng `sunset` làm chữ trên `parchment` (khoảng 2:1 ❌), chỉ làm viền và nền nút (chữ nút màu `deep`, khoảng 7.2:1 ✅).

Chữ nổi trực tiếp trên canvas luôn có `drop-shadow-[0_2px_12px_rgba(6,23,34,0.8)]` vì nền canvas thay đổi (trời cam sáng lúc hoàng hôn).

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Playfair Display 400 italic | 44px / 1.1 | 80px | |
| Tiêu đề chương | Quicksand 600, VIẾT HOA, tracking 0.3em | 12px | 14px | "CHUYỆN CỦA CHÚNG TÔI" |
| Số lớn (ngày) | Playfair Display 700 | 84px | 128px | |
| Nội dung | Quicksand 500 | 16px / 1.7 | 18px | Quicksand 400 hơi mảnh trên nền sáng, dùng 500 |
| Nhãn nhỏ | Quicksand 600 | 13px | 14px | |

Cả hai font có subset `vietnamese`.

### Hình khối và chất liệu
- **Cuộn giấy** (card chính): `rounded-2xl`, nền `parchment`, hai mép trên dưới có dải "lõi cuộn" cao 10px màu `#E9DCC6` bo tròn `rounded-full`, bóng `shadow-[0_20px_40px_-20px_rgba(6,23,34,0.6)]`. Rộng `min(90vw, 420px)`.
- **Dây gai**: một dải SVG nhỏ màu `#B08A5B` vắt ngang góc trên phải cuộn giấy (trang trí, `aria-hidden`).
- **Đường sóng**: SVG path sin, `stroke sea`, dùng làm vạch ngăn giữa các khối trong card.
- **Ảnh trong scene**: plane 3:4 viền `parchment` 4% (plane lớn hơn phía sau), bo góc bằng alphaMap.
- **Motion:** ease chủ đạo `sine.inOut` (sóng). Chữ vào A1 `power2.out` 0.9s. Mọi vật trong scene "nhấp nhô" theo cùng hàm `waveHeight` để đồng bộ với mặt nước.

---

## 3. Nhạc
- **Tâm trạng:** guitar mộc fingerstyle ấm, lãng mạn, không lời, có thể lẫn tiếng sóng nhẹ.
- **Tempo:** khoảng 80 BPM. **Độ dài:** 2:30–3:00, lặp.
- **Từ khoá Pixabay:** `acoustic guitar ocean romantic`, `beach acoustic love`, `calm guitar waves`
- **Hành vi:**
  - Bắt đầu khi bấm "Mở thiệp". Âm lượng 0 → 0.6 trong 2 giây.
  - **Điểm nhấn "chìm":** khi camera ở dưới mặt nước (`camera.y < 0`), nhạc đi qua `BiquadFilterNode` lowpass, `frequency` nội suy 18000 → 900Hz theo độ sâu 0 → −6. Trồi lên thì mở lại. Làm bằng Web Audio `createMediaElementSource` trên chính thẻ audio của `<MusicPlayer>` (xem §10.4, cần kiểm tra kit có cho truy cập thẻ audio không).
  - Tiếng sóng nền (`waves.mp3`, loop 20s, ≤ 250KB) ở âm lượng 0.15 **chỉ khi ở trên mặt nước**. Tuỳ chọn, bỏ nếu nhạc chính đã có sóng.
  - Ẩn tab thì tạm dừng cả hai.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **950svh**. Canvas `fixed inset-0 -z-10`. `progress` 0 → 1 theo cuộn toàn trang.

```
┌───────────────────────────┐
│ #gate    C1  Bãi biển      │ 100svh (khoá cuộn tới khi mở)
├───────────────────────────┤
│ #names   C2  Tên trên cát  │ 130svh   ☀ trên mặt nước
│ #dive        Lặn xuống     │  90svh   ═ đường sóng giữa màn hình
│ #couple  C3  Hai rạn san hô│ 110svh   ┐
│ #story   C4  3 cuộn giấy   │ 170svh   │ 🌊 dưới nước
│ #album   C8  Bong bóng ảnh │ 150svh   ┘
│ #date    C5 + C6 Bến cảng  │ 130svh   ☾ trên mặt nước, đêm
│ #venue   C7  Hải đăng      │ 110svh
│ #thanks  C9 + C10 Pháo hoa │ 100svh
└───────────────────────────┘
```

| Chương | Progress | HTML section | Card | Trên / dưới nước |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | trên |
| 1 | 0.00–0.14 | `#names` | C2 | trên, hoàng hôn |
| 2 | 0.14–0.24 | `#dive` | (chuyển cảnh lặn) | ngang mặt nước |
| 3 | 0.24–0.34 | `#couple` | C3 | dưới |
| 4 | 0.34–0.50 | `#story` | C4 | dưới |
| 5 | 0.50–0.64 | `#album` | C8 | dưới → trồi lên |
| 6 | 0.64–0.78 | `#date` | C5 + C6 | trên, đêm |
| 7 | 0.78–0.90 | `#venue` | C7 | trên, đêm |
| 8 | 0.90–1.00 | `#thanks` | C9 + C10 | trên, đêm |

### Keyframe camera
Thế giới trải dài theo trục **−z** (bãi biển ở `z = 0`, bến cảng ở `z ≈ −190`). Mặt nước ở `y = 0`, đáy biển ở `y ≈ −30`. Chai thư ở `bottle(p)` (xem §5).

| progress | camera.position | lookAt | Ghi chú |
|---|---|---|---|
| 0.00 | `[0, 3, 12]` | `[0, 1, 0]` | Đứng trên cát nhìn ra biển, chai ở mép sóng |
| 0.10 | `[2, 2.5, -8]` | `[0, 0.5, -24]` | Bám sau chai đang trôi ra khơi |
| 0.18 | `[0, 0.0, -32]` | `[0, 0, -48]` | **Đúng mặt nước**: trời trên, nước dưới |
| 0.24 | `[0, -8, -40]` | `[0, -20, -56]` | Chúi xuống, tia sáng xuyên nước |
| 0.34 | `[-5, -22, -62]` | `[0, -26, -74]` | Rạn san hô C3 |
| 0.50 | `[6, -24, -96]` | `[0, -26, -112]` | Lướt qua 3 cuộn giấy C4 |
| 0.58 | `[0, -24, -120]` | `[0, -4, -126]` | Ngửa lên, bong bóng ảnh bay lên |
| 0.64 | `[0, 0.4, -140]` | `[0, 2, -160]` | Phá mặt nước, trời đã tối |
| 0.78 | `[-6, 4, -168]` | `[0, 2, -184]` | Cầu tàu, đèn dầu |
| 0.90 | `[10, 9, -178]` | `[0, 14, -205]` | Nhìn lên hải đăng |
| 1.00 | `[0, 5, -186]` | `[0, 16, -230]` | Pháo hoa trên biển |

Nội suy như galaxy (`sampleKeyframes` + `sine.inOut` + lerp mượt `1 - exp(-4·delta)`). **Riêng mẫu này:** cộng thêm dao động sóng `camera.position.y += waveHeight(cam.x, cam.z, t) * 0.35` khi camera ở trên nước và `|y| < 5`, để người xem có cảm giác đang dập dềnh. Tại keyframe 0.18 và 0.64 biên độ này cho phép camera "nhúng" lên xuống quanh mặt nước, tạo đường ranh giới đung đưa.

### Trời, ánh sáng và fog theo progress
| progress | Trời (`<color attach="background">` + mặt trời) | Fog | Ánh sáng |
|---|---|---|---|
| 0–0.18 | gradient `#F2A65A → #7A4A6B`, mặt trời chìm dần `y 6 → 0.5` | `#F2C39A`, near 30 far 140 | hemisphere cam/tím |
| dưới nước (`y < 0`) | `deep` | `FogExp2 deep`, density 0.035 → 0.05 theo độ sâu | 1 directional xanh từ trên + 5 cone tia sáng |
| 0.64–1 | `#0A1830`, drei `<Stars count=1500>` | `#0A1830`, near 40 far 200 | đèn cầu tàu + đèn hải đăng |

Chuyển trên/dưới nước quyết định theo `camera.position.y` thực tế mỗi frame (không theo progress) để ranh giới luôn khớp hình học.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Mặt biển | `PlaneGeometry(400, 400, 160, 160)` (mobile 80×80), `meshStandardMaterial flatShading` màu `#1F6F8B`, sóng bằng `onBeforeCompile` chèn cùng công thức `waveHeight` vào vertex shader. `side: DoubleSide` để nhìn từ dưới lên thấy mặt nước | 1 |
| Mặt nước nhìn từ dưới | chính plane trên, mặt sau `opacity 0.85`, màu sáng hơn `#7FD6E3` (giả phản xạ toàn phần) | — |
| Bãi cát | plane nghiêng `#E8C99A`, `z 0 → 20` | 1 |
| Mặt trời | sphere r=4 `meshBasicMaterial sunset` + sprite glow additive scale 30 | 1 |
| Chai thư | `LatheGeometry` từ 12 điểm profile chai; desktop `meshPhysicalMaterial` (`transmission 0.9, roughness 0.1, thickness 0.3`), mobile `meshStandardMaterial` trong suốt `opacity 0.4`; nút bần cylinder; cuộn giấy bên trong cylinder `parchment` | 1 |
| Tia sáng | 5 `ConeGeometry` mở, additive, `opacity 0.08`, xoay nhẹ | 5 / 3 |
| Đáy biển | plane `y = −30` có noise độ cao (tính 1 lần khi tạo), `flatShading #0E3B4E` | 1 |
| San hô | `InstancedMesh` 3 loại (cone, icosahedron, torusKnot thấp), `flatShading`, màu `#E76F51 #F4A261 #2A9D8F` | 90 / 40 |
| Bong bóng nhỏ | `InstancedMesh` sphere r=0.08–0.25, bay lên `y += speed·delta`, tới mặt nước thì về đáy | 240 / 90 |
| Rạn chân dung (C3) | 2 cụm đá + plane ảnh `images[1]` (trái) / `images[2]` (phải), plane lắc `rotation.z = sin(t)·0.03` | 2 |
| Cuộn giấy (C4) | 3 plane ảnh `images[3..5]`, mỗi cái có "lõi cuộn" 2 cylinder trên dưới. Mở bằng `scale.y 0 → 1` khi progress chạm mốc (xem §6 C4) | 3 |
| Bong bóng ảnh (C8) | 5 sphere r=2.4 vỏ fresnel (shader nhỏ: `pow(1 - dot(n, v), 3)` → `sea`, additive) + plane ảnh `images[3..7]` bên trong luôn `lookAt(camera)`. Bay lên theo progress 0.50–0.64 | 5 |
| Bến cảng | cầu tàu = 20 box cọc + 1 box sàn, `#5A4633`; 4 cột đèn dầu (sphere emissive `sunset`) | 1 |
| Đèn cầu tàu | desktop 2 `pointLight` cam; mobile chỉ emissive + sprite glow | 2 / 0 |
| Hải đăng | cylinder thon + 2 dải đỏ trắng + cone mái; chùm sáng = `ConeGeometry` dài 60, additive `opacity 0.12`, quay quanh trục y | 1 |
| Pháo hoa | `Points` 3 chùm × 220 hạt, vận tốc cầu ngẫu nhiên + trọng lực, màu `sunset / sea / foam`; lặp mỗi 2.2s trong chương 8 | 3×220 / 2×120 |
| Nền sao đêm | drei `<Stars>` bật khi progress > 0.62 | 1500 / 600 |

**Quỹ đạo chai:** `bottle(p)`:
- 0–0.18: trôi trên mặt `x = sin(p·20)·1.5`, `z = lerp(0, −40, p/0.18)`, `y = waveHeight(x, z, t)`, xoay lắc theo đạo hàm sóng.
- 0.18–0.64: chìm theo đường cong xuống `y −26` ở `z −70`, lướt ngang, rồi bay lên cùng bong bóng tới `z −140`.
- 0.64–0.78: nổi ở cầu tàu, **nút bần bật ra** ở progress 0.70 (cuộn thư được "mở" = card C5).

**Tương tác con trỏ:** kéo ngang nhẹ camera (`x += pointer.x·0.4`). Dưới nước: **bong bóng né ngón tay** (bong bóng nào cách tia raycast < 1 đơn vị thì bị đẩy ra, tính trên CPU vì chỉ 240 instance). Mobile có quyền gyro thì nghiêng camera `±3°`.

---

## 6. Chi tiết từng section HTML

Card nằm ở nửa dưới màn hình khi đang ở trên nước (để thấy trời) và ở giữa khi dưới nước. Không đặt nội dung ở góc trên trái, trên phải, dưới phải.

### C1 · Bãi biển (màn mở)

**Mục đích:** tạo không khí, xin quyền phát nhạc (và gyro trên iOS).

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←                      ♪   │  ← nút chung (không đè)
│          ☀                 │  ← mặt trời sát chân trời
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~~│  ← mặt biển 3D
│ ~~~~~~~~  🍾  ~~~~~~~~~~~~~ │  ← chai thư ở mép sóng
│ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │  ← cát
│      MỘT LÁ THƯ GỬI BẠN    │  ← Quicksand 12px foam
│     Minh Quân & Thu Hà     │  ← Playfair italic 30px
│      ╭───────────────╮     │
│      │   MỞ THIỆP  ≈  │     │  ← nền sunset, chữ deep, A12
│      ╰───────────────╯     │
│  🎧 Bật âm thanh để nghe   │
│      tiếng sóng            │  ← 12px foam/80
└────────────────────────────┘
```
**Nội dung:** "MỘT LÁ THƯ GỬI BẠN", `{groom.name} & {bride.name}`, nút "Mở thiệp", dòng gợi ý tai nghe.

**Timeline khi bấm (2.2s):**
| t (s) | Việc | Ease |
|---|---|---|
| 0.0 | `music.play()`, fade 0 → 0.6 trong 2s; xin quyền `DeviceOrientationEvent.requestPermission()` (iOS) | — |
| 0.0–0.5 | Nút `scale 1 → 0.9`, `opacity → 0`; chữ A1 ngược (`y 0 → −20`) | `power2.in` |
| 0.2–1.6 | Một con sóng lớn: biên độ `uAmp 1 → 2.2 → 1`, chai bị cuốn ra `z 0 → −6` | `sine.inOut` |
| 0.4–2.0 | Camera `[0, 4, 16] → [0, 3, 12]` | `power2.out` |
| 2.2 | Mở khoá cuộn (`OpenGate`), hiện gợi ý "Cuộn xuống ↓" A12 ở giữa đáy | — |

**Trước khi canvas sẵn sàng:** nền `bg-[linear-gradient(#F2A65A,#7A4A6B_55%,#0B2A3C_55%)]` (trời trên, biển dưới, ranh giới cứng) để không bao giờ trắng.
**Reduced-motion / fallback:** không có sóng lớn, chỉ fade 0.4s.
**Edge case:** tên dài 50 ký tự → dòng tên cho phép xuống 2 dòng, `text-balance`, cỡ giảm `text-[clamp(22px,7vw,30px)]`.

---

### C2 · Tên trên cát (0.00–0.14)

**Mục đích:** h1, tên hai người. "Viết trên cát" nhưng vẫn là HTML.

**Wireframe:**
```
│          ☀                 │
│ ~~~~~~~~~~~~ 🍾 ~~~~~~~~~~~ │  ← chai trôi xa dần
│                            │
│   TRÂN TRỌNG KÍNH MỜI      │  ← Quicksand 12px, foam
│      Minh Quân             │  ← Playfair italic 44px, foam
│          &                 │  ← sunset
│         Thu Hà             │
│   ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿      │  ← đường sóng SVG A6
│  "Gửi theo con sóng một    │
│   lời hẹn trăm năm"        │  ← Quicksand 16px, foam/90
│  ┌──────────────────────┐  │
│  │ ảnh bìa images[0]    │  │  ← khung 4:3 bo 2xl, viền parchment 4px
│  └──────────────────────┘  │
```
**Nội dung:** "TRÂN TRỌNG KÍNH MỜI" · `<h1>{groom.name} & {bride.name}</h1>` · "Gửi theo con sóng một lời hẹn trăm năm" · ảnh `images[0]`.

**Timeline (trigger: section vào 60% viewport):**
| t (s) | Việc |
|---|---|
| 0.0 | Tiêu đề A1 |
| 0.2 | Tên A2 theo ký tự, **thêm `filter: blur(6px) → 0`** như chữ hiện dần trên cát ướt, stagger 0.035 |
| 0.9 | Đường sóng A6 (scrub theo cuộn, không theo thời gian) |
| 1.1 | Câu phụ A1 |
| 1.3 | Ảnh bìa A3 |

**Chuyển sang #dive:** camera hạ dần về mặt nước (keyframe 0.10 → 0.18). Chữ C2 trôi lên với `y: -30%` scrub.
**Reduced-motion:** chỉ A1 cho cả khối.
**Edge case:** tên ≥ 30 ký tự thì hiện mỗi tên 1 dòng riêng, dấu "&" nằm dòng giữa.

---

### #dive · Lặn xuống (0.14–0.24)

**Mục đích:** khoảnh khắc "wow" của mẫu. Không có card, chỉ 1 dòng chữ.

**Wireframe:**
```
│       trời hoàng hôn       │
│                            │
│ ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈│  ← mặt nước cắt ngang giữa màn hình (3D thật)
│        nước xanh sâu       │
│   Và rồi, chúng tôi lặn    │
│   sâu vào những kỷ niệm…   │  ← Playfair italic 22px, foam
│         ◦   ∘   ◦          │  ← bong bóng
```
**Timeline (scrub theo progress, không theo giây):**
| progress | Việc |
|---|---|
| 0.14 | Camera hạ về `y 0` |
| 0.17–0.19 | Camera "nhúng" quanh mặt nước theo sóng; nhạc lowpass bắt đầu |
| 0.19 | Một vệt bong bóng (40 hạt) bùng lên trước camera, che khoảnh khắc chìm |
| 0.20–0.24 | Chữ A1 ở nửa dưới màn hình; tia sáng fade in |

**Reduced-motion / fallback:** không có; section này là một ảnh tĩnh `fallback-split.webp` (nửa trời nửa nước) với câu chữ ở giữa.

---

### C3 · Hai rạn san hô (0.24–0.34)

**Mục đích:** chân dung và địa chỉ hai nhà.

**Wireframe:**
```
│  [ảnh chú rể 3D]           │  ← plane images[1] trên rạn đá trái
│            [ảnh cô dâu 3D] │  ← plane images[2] trên rạn đá phải
│ ╭──────────╮ ╭──────────╮  │
│ │ NHÀ TRAI │ │ NHÀ GÁI  │  │  ← 2 cuộn giấy nhỏ, parchment
│ │Minh Quân │ │ Thu Hà   │  │  ← Playfair italic 22px
│ │Quận 1,   │ │Ba Đình,  │  │  ← Quicksand 14px ink-soft, tối đa 3 dòng
│ │TP.HCM    │ │Hà Nội    │  │
│ ╰──────────╯ ╰──────────╯  │
```
**Nội dung:** `groom.name`, `groom.address`, `bride.name`, `bride.address`. Tên bố mẹ ⚠️ (chờ chốt §8.2): nếu có thì thêm dòng "Ông … · Bà …" 13px trên tên; nếu không thì bỏ dòng, không để trống.

**Timeline (section vào 50%):**
| t (s) | Việc |
|---|---|
| 0.0 | Card trái `x: -24 → 0`, A1, đồng thời "lõi cuộn" dưới `scaleY 0 → 1` (cuộn giấy mở ra) |
| 0.15 | Card phải, gương đối xứng |
| 0.6 | Trong scene: một luồng bong bóng nhỏ bay lên từ mỗi rạn (scrub không cần, chạy 1 lần) |

**Tương tác:** chạm ảnh 3D → lightbox HTML (A10) với ảnh lớn.
**Mobile < 360px:** 2 card xếp dọc.
**Edge case:** địa chỉ > 3 dòng → `line-clamp-3`, `title` chứa địa chỉ đầy đủ.

---

### C4 · Ba cuộn giấy (0.34–0.50)

**Mục đích:** chuyện tình 3 mốc. Mỗi mốc gắn với 1 cuộn giấy 3D mở ra khi camera đi ngang.

**Wireframe (1 mốc):**
```
│   ╭──── cuộn ảnh 3D ────╮  │  ← plane images[3] scaleY 0→1
│   │                     │  │
│   ╰─────────────────────╯  │
│ ┌────────────────────────┐ │
│ │ 01 · LẦN ĐẦU GẶP GỠ     │ │  ← tiêu đề 12px sunset-dark #B5692A (4.6:1 ✅)
│ │ Biển hôm ấy lặng, còn   │ │
│ │ tim thì không.          │ │  ← Quicksand 16px ink
│ └────────────────────────┘ │
```
| Mốc | Progress | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|
| 1 | 0.34–0.39 | Lần đầu gặp gỡ | "Biển hôm ấy lặng, còn tim thì không. Một ánh nhìn, và mọi con sóng sau đó đều mang tên một người." | `images[3]` |
| 2 | 0.39–0.44 | Thương nhau | "Những chuyến đi, những buổi chiều ngồi đếm sóng. Thương nhau là thấy biển rộng mà lòng mình vừa đủ chỗ cho nhau." | `images[4]` |
| 3 | 0.44–0.50 | Lời hứa | "Một chiếc nhẫn, một câu hỏi thì thầm giữa tiếng sóng. Và câu trả lời là: có." | `images[5]` |

**Timeline:** mỗi mốc là một khoảng progress; cuộn giấy 3D `scale.y` scrub từ 0 → 1 trong nửa đầu khoảng, card HTML A1 khi vào 55% viewport, ra bằng `opacity → 0, y → −20` khi rời.
**Hiệu ứng lõi cuộn:** card HTML có 2 thanh lõi; khi vào, thanh dưới trượt `y: -100% → 0` còn nội dung `clip-path: inset(0 0 100% 0) → inset(0)`, 0.8s `power2.out`.
**Reduced-motion:** card hiện đủ, không clip.

---

### C8 · Bong bóng ảnh (0.50–0.64)

**Mục đích:** album. Ảnh "được gửi lên mặt nước".

**Wireframe:**
```
│         ◯ [ảnh]            │  ← bong bóng 3D chứa ảnh, bay lên
│   ◯ [ảnh]        ◯ [ảnh]   │
│                            │
│      KHOẢNH KHẮC           │  ← A2, foam
│  Chạm vào bong bóng để     │
│  xem ảnh                   │  ← 13px foam/80
│  ╭────────────────────╮    │
│  │  Xem tất cả ảnh  ⊞  │    │  ← nút viền sea, ≥44px
│  ╰────────────────────╯    │
```
**Timeline (scrub):** 5 bong bóng xuất phát từ đáy lệch pha 0.02 progress, bay lên theo đường xoắn nhỏ (`x += sin(y·0.3 + i)`), A12 lắc nhẹ độc lập với cuộn. Tới progress 0.62 bong bóng chạm mặt nước và **vỡ** (scale 1 → 1.2, opacity → 0, 30 hạt bắn ra), ảnh thì ở lại dạng plane nổi trên mặt nước rồi mờ đi.
**Tương tác:** chạm bong bóng (raycast `onClick` R3F) → lightbox HTML A10 bắt đầu từ vị trí màn hình của bong bóng (project world → screen). Nút "Xem tất cả ảnh" mở lưới 2 cột HTML (`images[3..7]`), có điều hướng phím ←/→ trong lightbox.
**Chuyển tiếp:** camera ngửa lên và phá mặt nước (0.64). Nhạc lowpass mở lại trong 0.6s.
**Edge case:** ảnh ngang (landscape) → plane dùng tỉ lệ thật của texture (`image.width / image.height`), bong bóng scale theo cạnh dài.

---

### C5 + C6 · Bến cảng (0.64–0.78)

**Mục đích:** ngày giờ. Cuộn thư trong chai được "mở" chính là card này.

**Wireframe:**
```
│      ☾   ✦    ✦            │
│  ▯ đèn    ▯ đèn    ▯ đèn   │  ← cầu tàu 3D
│ ╭══════════════════════╮   │  ← cuộn giấy lớn, lõi trên dưới
│ │  NGÀY CHÚNG TÔI       │   │
│ │  CẬP BẾN HẠNH PHÚC    │   │
│ │         14            │   │  ← Playfair 84px, ink
│ │   THÁNG 11 · 2026     │   │  ← cần `date` ⚠️
│ │   Thứ Bảy             │   │
│ │ 45 : 06 : 12 : 33     │   │  ← A7, ô số nền deep chữ foam
│ │ ngày giờ  phút  giây  │   │
│ │ ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿   │   │
│ │ ⚓ Lễ thành hôn 10:00 │   │
│ │ ⚓ Tiệc cưới    18:00 │   │  ← giờ viết sẵn trong mẫu
│ ╰══════════════════════╯   │
```
**Nội dung:** ngày từ `date` ⚠️. Nếu chưa có trường `date` thì dùng ngày mẫu `2026-11-14T18:00` viết trong `meta` của mẫu và **ẩn đếm ngược** (chỉ hiện ngày). Khi đã qua ngày cưới: thay đếm ngược bằng *"Chúng tôi đã cập bến hạnh phúc ♥"*. Sự kiện (C6) hardcode: "Lễ thành hôn 10:00", "Tiệc cưới 18:00".

**Timeline:**
| Mốc | Việc |
|---|---|
| progress 0.70 | Scene: nút bần bật ra khỏi chai (`y +1.2`, xoay 2 vòng, 0.6s `power2.out`), cuộn giấy nhỏ bay khỏi miệng chai rồi mờ đi |
| ngay sau (t 0.2s) | Card HTML mở như cuộn giấy: lõi trên `y +100% → 0`, nội dung `clip-path inset(0 0 100% 0) → inset(0)` 1s `power2.out` |
| +0.8s | Số "14" A2, đếm ngược A7 bắt đầu đếm |

**Reduced-motion:** card hiện ngay, đếm ngược vẫn chạy (không lật).

---

### C7 · Hải đăng (0.78–0.90)

**Wireframe:**
```
│            ▲               │  ← hải đăng, chùm sáng quét
│   ────────/ 💡            │     dừng lại chỉ về phía card
│ ╭══════════════════════╮   │
│ │  ĐỊA ĐIỂM             │   │
│ │  {venue.name}         │   │  ← Playfair 24px
│ │ ┌──────────────────┐  │   │
│ │ │   <MapEmbed/>    │  │   │  ← cao 200px, bo 2xl
│ │ └──────────────────┘  │   │
│ │ [ Chỉ đường ➚ ]       │   │  ← nền sunset, chữ deep
│ ╰══════════════════════╯   │
```
**Nội dung:** `venue.name` (nếu trống: "Nhà hàng tiệc cưới"), `<MapEmbed venue={data.venue} />`, nút "Chỉ đường" mở `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`.
**Timeline:** chùm sáng quay đều `0.6 rad/s`; khi section vào 50% thì tween góc quay về hướng card (góc cố định `−0.4 rad`) trong 1.2s `sine.inOut` rồi **dừng** ở đó, card A1. Rời section thì tiếp tục quay.
**Edge case:** iframe bản đồ chặn cuộn trên mobile → `MapEmbed` chung đã xử lý; card có padding hai bên ≥ 24px để ngón tay cuộn được.

---

### C9 + C10 · Pháo hoa (0.90–1.00)

**Wireframe:**
```
│    ✺       ✺      ✺        │  ← pháo hoa
│                            │
│   Cảm ơn bạn đã nhận lá    │
│   thư này. Hẹn gặp nhau    │
│   bên bờ hạnh phúc.        │  ← Playfair italic 24px foam
│   ┌──────────────────┐     │
│   │  images[7]       │     │  ← ảnh cuối, khung parchment
│   └──────────────────┘     │
│    Minh Quân & Thu Hà      │  ← chữ ký, sunset
│ [ ▶ Xem video của chúng tôi ] │  ← chỉ khi có videos[0]
```
**Timeline:** progress 0.90 bắt đầu bắn pháo hoa lặp 2.2s. Câu cảm ơn A2 theo dòng, ảnh A3, chữ ký A1 (delay 0.6s).
**Hành vi video:** mở lightbox `<video controls playsInline>`; khi video `play` → nhạc nền `pause`; đóng lightbox → nhạc tiếp tục (nếu người dùng chưa tắt).
**Reduced-motion:** không pháo hoa, ảnh tĩnh.
**Edge case:** không có video → ẩn nút, không để khoảng trống.

---

## 7. Fallback (không có WebGL hoặc reduced-motion)
- Không mount canvas. Nền trang là 3 ảnh tĩnh cố định theo chương, crossfade theo section: `fallback-sunset.webp` (C1–C2), `fallback-split.webp` (#dive), `fallback-underwater.webp` (C3–C8), `fallback-harbor.webp` (C5–C10). Mỗi ảnh ≤ 120KB, chụp từ scene.
- Ảnh chân dung vào trong card C3; cuộn giấy C4 có ảnh ở trên chữ; C8 thành lưới 2 cột; C5 giữ nguyên.
- Bỏ lowpass, bỏ tiếng sóng nền.
- Kiểm tra WebGL như galaxy: `!!document.createElement("canvas").getContext("webgl2")`.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`, `frameloop="demand"` trước khi mở thiệp và khi tab ẩn.
- Mặt biển mobile 80×80 segments; sóng tính trong vertex shader, không cập nhật geometry trên CPU.
- `meshPhysicalMaterial` transmission chỉ desktop (tốn 1 render pass). Mobile dùng material trong suốt thường.
- Pháo hoa và bong bóng: 1 draw call mỗi loại (`Points` / `InstancedMesh`), cập nhật buffer bằng `needsUpdate` 1 lần mỗi frame.
- Chỉ render những nhóm gần camera: mỗi nhóm cảnh (bãi biển, đáy biển, bến cảng) có `visible` bật theo khoảng progress ±0.08.
- Texture người dùng qua `useSafeTexture` (≤ 1024px).

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Ảnh bìa trong C2, thumbnail, OG |
| `images[1]` / `images[2]` | Plane chân dung trên rạn trái / phải (C3) |
| `images[3..5]` | 3 cuộn giấy C4 |
| `images[3..7]` | 5 bong bóng C8 (dùng lại 3..5, thêm 6, 7) |
| `images[7]` | Ảnh cuối C10 |
| `videos[0]` | C9 |

`meta.media = { images: 8, videos: 1 }`
`meta`: `styles: ["cinematic", "playful"]`, `colors: ["blue", "beige"]`, `tags: ["biển", "chai thư", "hoàng hôn"]`.

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/ocean-3d/
├── meta.ts, layout.tsx (Playfair_Display + Quicksand, vietnamese), page.tsx
└── _components/
    ├── ocean-invite.tsx      # "use client": sections + OpenGate + useScrollProgress + <OceanCanvas/>
    ├── ocean-canvas.tsx      # dynamic(() => import("./scene"), { ssr: false }) + fallback
    ├── scene.tsx             # <SceneCanvas> + các nhóm bên dưới + env (trời/fog theo camera.y)
    ├── camera-rig.tsx        # sampleKeyframes + dập dềnh sóng
    ├── wave.ts               # waveHeight(x, z, t) + chuỗi GLSL cùng công thức (có test)
    ├── ocean-surface.tsx     # plane + onBeforeCompile
    ├── bottle.tsx            # chai, quỹ đạo bottle(p), nút bần bật
    ├── seabed.tsx            # đáy, san hô instanced, tia sáng, bong bóng nhỏ
    ├── scroll-reels.tsx      # 3 cuộn giấy C4 + 2 rạn chân dung C3
    ├── photo-bubbles.tsx     # C8
    ├── harbor.tsx            # cầu tàu, đèn, hải đăng
    ├── fireworks.tsx         # C10
    ├── underwater-audio.ts   # lowpass theo độ sâu
    ├── keyframes.ts
    └── sections/*.tsx        # gate, names, dive, couple, story, album, date, venue, thanks
```

### 10.2 Tokens
```ts
export const t = {
  root: "bg-[#0B2A3C] text-[#F4FBFC] font-(family-name:--font-body)",
  scroll: "rounded-2xl bg-[#FDF6EC]/85 backdrop-blur-sm text-[#0B2A3C] shadow-[0_20px_40px_-20px_rgba(6,23,34,0.6)]",
  core: "h-2.5 rounded-full bg-[#E9DCC6]",
  display: "font-(family-name:--font-display)",
  heading: "text-xs tracking-[0.3em] uppercase font-semibold",
  soft: "text-[#3E5A68]",
  btn: "min-h-11 rounded-full bg-[#F2A65A] px-6 text-[#0B2A3C] font-semibold",
  onCanvas: "drop-shadow-[0_2px_12px_rgba(6,23,34,0.8)]",
} as const;
```

### 10.3 Một công thức sóng cho cả CPU và GPU
```ts
// wave.ts
export const WAVES = [ // [hướng x, hướng z, bước sóng, biên độ, tốc độ]
  [1, 0.3, 18, 0.45, 1.1], [-0.4, 1, 9, 0.22, 1.7], [0.7, -0.7, 5, 0.1, 2.4],
] as const;
export function waveHeight(x: number, z: number, t: number, amp = 1) {
  let y = 0;
  for (const [dx, dz, len, a, s] of WAVES) {
    const k = (2 * Math.PI) / len;
    y += a * amp * Math.sin(k * (dx * x + dz * z) + t * s);
  }
  return y;
}
// sinh GLSL từ cùng mảng WAVES để không lệch công thức
export const waveGLSL = `float waveHeight(vec2 p, float t, float amp){ float y = 0.0; ${WAVES.map(
  ([dx, dz, len, a, s]) => `y += ${a} * amp * sin(${(2 * Math.PI / len).toFixed(5)} * dot(vec2(${dx}, ${dz}), p) + t * ${s});`,
).join("")} return y; }`;
```
```tsx
// ocean-surface.tsx
const uniforms = useMemo(() => ({ uTime: { value: 0 }, uAmp: { value: 1 } }), []);
<meshStandardMaterial flatShading color="#1F6F8B" side={THREE.DoubleSide}
  onBeforeCompile={(s) => {
    Object.assign(s.uniforms, uniforms);
    s.vertexShader = `uniform float uTime; uniform float uAmp;\n${waveGLSL}\n${s.vertexShader}`
      .replace("#include <begin_vertex>",
        "#include <begin_vertex>\n transformed.z += waveHeight(position.xy, uTime, uAmp);");
  }} />
useFrame((_, d) => { uniforms.uTime.value += d; });
```
Plane đã xoay `-Math.PI/2` nên `position.xy` cục bộ ứng với `(x, −z)` thế giới; `bottle.tsx` gọi `waveHeight(x, -z, t)` cho khớp. Ghi chú này vào đầu `wave.ts`.

### 10.4 Lowpass dưới nước
```ts
// underwater-audio.ts: gọi 1 lần sau khi người dùng bấm "Mở thiệp"
const ctx = new AudioContext();
const src = ctx.createMediaElementSource(audioEl); // audioEl từ MusicPlayer (⚠️ cần kit expose ref)
const lp = Object.assign(ctx.createBiquadFilter(), { type: "lowpass" });
src.connect(lp).connect(ctx.destination);
export const setDepth = (y: number) =>
  lp.frequency.setTargetAtTime(y >= 0 ? 18000 : Math.max(900, 18000 + y * 2850), ctx.currentTime, 0.15);
```
`createMediaElementSource` chỉ gọi **một lần** cho một thẻ audio (gọi lại sẽ lỗi), giữ trong module. Gọi `setDepth` mỗi 100ms (không phải mỗi frame).

### 10.5 Logic cần test
- `wave.test.ts`: `waveHeight` tuần hoàn theo bước sóng thành phần lớn nhất; biên độ tuyệt đối ≤ tổng `a·amp`; `amp = 0` trả 0.
- `bottle-path.test.ts`: `bottle(0)` ở bãi biển, `bottle(0.5).y < -20`, `bottle(0.7)` gần cầu tàu; liên tục (chênh lệch giữa `p` và `p + 0.001` nhỏ).
- `keyframes.test.ts`: dùng lại test chung của kit với mảng KEYFRAMES của mẫu (đơn điệu `at`, bắt đầu 0 kết thúc 1).

### 10.6 Thứ tự làm
1. `meta`, `layout`, tokens, sections HTML tĩnh (không canvas), kiểm tra 360/768/1440
2. `wave.ts` + test, `ocean-surface`, camera rig, trời/fog theo `camera.y` → kiểm tra khoảnh khắc nửa trên nửa dưới
3. Chai + quỹ đạo, C1 timeline, nhạc
4. Đáy biển, san hô, bong bóng, C3–C4
5. Bong bóng ảnh C8 + lightbox
6. Bến cảng, hải đăng, pháo hoa
7. Lowpass, con trỏ/gyro
8. Fallback 4 ảnh, đo fps và bundle, Lighthouse mobile ≥ 75
9. Checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `music.mp3` (Pixabay, ≤ 3MB) + `waves.mp3` (tuỳ chọn, ≤ 250KB) + `CREDITS.md`
- [ ] `glow.png` 128px (sprite radial, dùng cho mặt trời, đèn, bong bóng vỡ)
- [ ] `fallback-sunset.webp`, `fallback-split.webp`, `fallback-underwater.webp`, `fallback-harbor.webp` (chụp từ scene, ≤ 120KB mỗi ảnh)
- [ ] SVG: đường sóng, dây gai, icon mỏ neo
- [ ] 8 ảnh mẫu (có ảnh biển) + 1 video mẫu ≤ 8MB (Pexels)
- [ ] `thumb.webp` 600×800 (khung nửa trên nửa dưới mặt nước), `opengraph-image.png`

## 12. Tiêu chí nghiệm thu riêng
- [ ] Ở progress 0.18 đường mặt nước nằm ngang giữa màn hình ±10%, đung đưa theo sóng, không nhấp nháy khi camera qua lại `y = 0`
- [ ] Chai thư luôn nằm đúng trên mặt sóng (không chìm lún, không bay lơ lửng) ở mọi thời điểm chương 1
- [ ] Xuống nước nghe rõ nhạc bị bóp nghẹt, lên lại thì trong trở lại (Chrome, Safari iOS)
- [ ] iPhone 12 / Android tầm trung ≥ 45fps ở chương dưới nước và pháo hoa
- [ ] Tắt WebGL vẫn đọc đủ thiệp, xem đủ 8 ảnh và video
- [ ] Chữ trên canvas lúc hoàng hôn (nền cam sáng) vẫn đọc được nhờ drop-shadow
