# 3D-03 · `lantern-3d` · Phố Hội Đèn Lồng

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `src/kit/3d/` đã dựng ở [galaxy-3d](./galaxy-3d.md).

---

## 1. Concept

**Một câu:** Khách ngồi trên một chiếc thuyền gỗ trôi chậm dọc sông Hoài đêm rằm; hai bên bờ đèn lồng thắp sáng dần, mỗi căn nhà cổ là một chương, và cuối hành trình cả phố cùng thả đèn trời chúc phúc.

**Cảm xúc muốn gợi:** ấm áp, truyền thống, trang trọng mà gần gũi. Cảm giác đêm phố Hội: chậm, lung linh, mùi gỗ cũ và tiếng đàn tranh.

**Phù hợp với:** cặp đôi yêu văn hoá Việt, cưới theo nghi thức truyền thống, gia đình hai bên đọc thiệp nhiều (thiệp phải trang trọng, dễ đọc cho người lớn tuổi). Hợp ảnh cưới áo dài, chụp ở Hội An.

**Điểm khác biệt:** camera **đi trên đường ray cố định** (thuyền trôi dọc sông, không bay tự do như galaxy). Người xem luôn nhìn về phía trước, chỉ **quay đầu** sang trái/phải để nhìn nhà hai bên. Ánh sáng là nhân vật chính: cảnh bắt đầu gần như tối đen, đèn **thắp lần lượt** theo cuộn. Có **tương tác chạm** thật: chạm hoa đăng thì sáng và ngân chuông; cuối thiệp khách tự **thả đèn trời** của mình.

**Moodboard:** phố Hội An đêm rằm, tường vàng rêu phong, mái ngói âm dương, đèn lồng lụa đỏ và vàng, hoa đăng giấy trên mặt sông đen, Chùa Cầu, giấy dó, triện đỏ.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `night` | `#1A0F0A` | Nền trang, trời đêm, mặt sông |
| `wall` | `#E3B04B` | Tường nhà cổ (trong scene), dải trang trí |
| `paper` | `#F7ECD8` / 90% | Nền card "giấy dó" |
| `lacquer` | `#D9361E` | Màu chủ đạo: đèn lồng, triện, viền, nút |
| `lacquer-dark` | `#A82816` | Chữ nhấn đỏ trên `paper` |
| `glow` | `#F5B83D` | Ánh đèn, số lớn trên nền tối, chữ nhấn trên `night` |
| `ink` | `#2B1A10` | Chữ chính trên `paper` |
| `ink-soft` | `#6B5140` | Chữ phụ trên `paper` |
| `moon` | `#F7ECD8` | Chữ trực tiếp trên canvas |

Tương phản: `ink` trên `paper` khoảng 14:1 ✅. `ink-soft` trên `paper` khoảng 6.3:1 ✅. `lacquer-dark` trên `paper` khoảng 6.2:1 ✅ (dùng cho tiêu đề nhỏ). `lacquer` trên `paper` chỉ khoảng 4.1:1 → **chỉ dùng cho chữ ≥ 24px** hoặc nền nút (chữ nút màu `paper`, khoảng 4.1:1, nút dùng chữ 18px đậm 600 → đạt mức chữ lớn 3:1 ✅). `glow` trên `night` khoảng 10:1 ✅.

Card giấy dó dùng cỡ chữ nội dung **18px** (lớn hơn các mẫu khác) vì người đọc nhiều là ông bà, bố mẹ.

### Typography
| Vai trò | Font | Mobile | Desktop | Ghi chú |
|---|---|---|---|---|
| Tên cặp đôi | Playfair Display 500 italic | 42px / 1.15 | 76px | |
| Tiêu đề chương | Playfair Display 700, VIẾT HOA, tracking 0.25em | 13px | 15px | "NHÀ TRAI · NHÀ GÁI" |
| Chữ trên biển gỗ | Playfair Display 700 | 26px | 36px | Tên trên bảng hiệu |
| Số lớn | Playfair Display 400 | 88px | 132px | |
| Nội dung | Lora 400 | 18px / 1.7 | 19px | |
| Nhãn nhỏ | Lora 500 italic | 15px | 16px | |

Cả hai font có subset `vietnamese`. Kiểm tra dấu "Nguyễn Thị Hằng", "Trịnh Đức Hưởng" trên biển gỗ (Playfair 700 hoa có dấu chồng cao, chừa `leading-[1.3]`).

### Hình khối và chất liệu
- **Card giấy dó:** `rounded-lg` (0.5rem), nền `paper`, viền trong `1px lacquer/30` cách mép 6px (khung đôi kiểu thiệp truyền thống), bóng ấm `shadow-[0_12px_32px_-12px_rgba(245,184,61,0.35)]`, vân giấy dó SVG `feTurbulence` opacity 0.05.
- **Biển gỗ:** nền `bg-[linear-gradient(#5A3522,#3E2416)]`, chữ `glow`, hai dây treo SVG ở mép trên, `rounded-sm`.
- **Triện đỏ:** ô vuông `lacquer` bo 2px, chữ "囍" hoặc chữ viết tắt tên, dùng làm "dấu" cuối card.
- **Hoạ tiết:** dải mái ngói (SVG lặp) làm vạch ngăn; góc card có hoạ tiết "chữ Vạn" nhỏ (SVG, `aria-hidden`).
- **Motion:** ease chủ đạo `power2.out`. Mọi thứ trong scene đều lắc nhẹ (đèn lồng, thuyền). Card vào như **treo xuống**: `y -24 → 0` + `rotate -2° → 0`, 0.9s.

---

## 3. Nhạc
- **Tâm trạng:** đàn tranh và sáo trúc, chậm, thanh bình, không lời.
- **Tempo:** khoảng 65 BPM. **Độ dài:** 2:30–3:00, lặp.
- **Từ khoá Pixabay:** `vietnamese traditional zither`, `asian flute calm`, `guzheng peaceful night`
- **Hành vi:**
  - Bắt đầu khi bấm "Thắp đèn" (C1). Âm lượng 0 → 0.55 trong 2.5s (chậm để khớp dãy đèn sáng lần lượt).
  - **Tiếng chuông** (`bell.mp3`, 1 nốt chuông gió ≤ 40KB): phát khi chạm hoa đăng (C4) và khi thả đèn trời (C10). Chỉ phát nếu nhạc đang bật. Dùng `new Audio()` riêng, `volume 0.5`, cho phép chồng nhau tối đa 3.
  - Khi thuyền chui dưới gầm cầu (0.62–0.66) giảm âm lượng còn 0.3 rồi trả lại (cảm giác không gian kín).
  - Ẩn tab thì tạm dừng.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **1000svh**. Canvas `fixed inset-0 -z-10`.

```
┌───────────────────────────┐
│ #gate    C1  Mũi thuyền    │ 100svh (khoá cuộn tới khi mở)
├───────────────────────────┤
│ #names   C2  Biển gỗ tên   │ 120svh  thuyền trôi thẳng
│ #couple  C3  Hai ngôi nhà  │ 150svh  quay trái ← → quay phải
│ #story   C4  Hoa đăng      │ 180svh  3 hoa đăng, chạm được
│ #album   C8  Chùa Cầu      │ 160svh  ảnh treo dưới mái cầu
│ #under   —   Gầm cầu       │  50svh  tối, chuyển cảnh T6
│ #dock    C5+C6+C7 Bến đỗ   │ 170svh  thuyền dừng
│ #thanks  C10 Đèn trời      │ 120svh  thả đèn
└───────────────────────────┘
```

| Chương | Progress | HTML section | Card | Camera |
|---|---|---|---|---|
| 0 | màn mở | `#gate` | C1 | đứng yên ở mũi thuyền |
| 1 | 0.00–0.12 | `#names` | C2 | trôi thẳng, nhìn trước |
| 2 | 0.12–0.27 | `#couple` | C3 | quay trái (nhà trai) rồi quay phải (nhà gái) |
| 3 | 0.27–0.45 | `#story` | C4 | nhìn xuống mặt sông |
| 4 | 0.45–0.61 | `#album` | C8 | ngẩng nhìn cầu |
| 5 | 0.61–0.66 | `#under` | (tối) | chui gầm cầu |
| 6 | 0.66–0.88 | `#dock` | C5 + C6 + C7 | thuyền chậm dần, dừng |
| 7 | 0.88–1.00 | `#thanks` | C10 | ngửa lên trời |

### Đường ray và keyframe camera
Sông chạy theo trục **−z**, rộng 14 đơn vị (bờ trái `x = −7`, bờ phải `x = 7`). Thuyền đi theo **một đường cong** `CatmullRomCurve3` qua 6 điểm (sông hơi uốn), camera ngồi mũi thuyền ở độ cao 1.6. Vị trí camera = `river.getPointAt(s(p))` với `s(p)` là hàm vận tốc (§10.3). **Chỉ hướng nhìn** dùng bảng keyframe (yaw/pitch so với tiếp tuyến sông):

| progress | yaw (độ, âm = trái) | pitch (độ) | Ghi chú |
|---|---|---|---|
| 0.00 | 0 | 0 | Nhìn thẳng ra sông tối |
| 0.12 | 0 | 4 | Hơi ngẩng nhìn biển gỗ |
| 0.16 | −55 | 2 | Quay sang nhà trai (bờ trái) |
| 0.21 | −55 | 2 | Giữ |
| 0.23 | 55 | 2 | Quay sang nhà gái (bờ phải) |
| 0.27 | 0 | 0 | Về trước |
| 0.30 | 0 | −22 | Cúi nhìn hoa đăng |
| 0.45 | 0 | −18 | |
| 0.52 | 0 | 14 | Ngẩng nhìn Chùa Cầu |
| 0.61 | 0 | 22 | Ảnh treo dưới mái cầu, sát đầu |
| 0.66 | 0 | 0 | Ra khỏi gầm cầu |
| 0.88 | 20 | 6 | Nhìn bến đỗ bên phải |
| 1.00 | 0 | 48 | Ngửa lên trời, đèn trời |

Nội suy yaw/pitch bằng `sampleKeyframes` (dùng mảng 2 chiều, vẫn API cũ vì `pos` chỉ dùng 2 thành phần đầu). Thêm **lắc thuyền**: `roll = sin(t·0.8)·1.2°`, `y += sin(t·1.1)·0.04`.

**Hàm vận tốc `s(p)`:** thuyền không trôi đều. Chậm lại quanh nhà (0.16–0.23), trôi đều ở hoa đăng, chậm dưới cầu, **dừng hẳn** từ 0.80. Định nghĩa bằng bảng mốc `[p, s]` rồi nội suy tuyến tính, `s` đơn điệu tăng từ 0 → 1.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Mặt sông | plane dài 30×400. Desktop: drei `<MeshReflectorMaterial blur={[300, 80]} mixStrength={3} resolution={512} color="#140B07" />`. Mobile: `meshBasicMaterial #140B07` + **vệt phản chiếu giả** (xem dòng dưới) | 1 |
| Vệt phản chiếu giả (mobile) | mỗi đèn gần sông có 1 sprite dọc dài (scale `0.4 × 3`) additive màu đèn, đặt dưới mặt nước đối xứng, `opacity` dao động theo sin | 0 / 60 |
| Nhà cổ | 1 `InstancedMesh` thân nhà (box `#E3B04B`, vertex color hơi loang) + 1 `InstancedMesh` mái (ExtrudeGeometry hình thang, `#6B2E1F`); cửa sổ = plane emissive vàng | 18 / 10 mỗi bờ |
| Đèn lồng | `LatheGeometry` từ 8 điểm profile (hình quả đèn), `meshStandardMaterial` emissive; `InstancedMesh` với `instanceColor` (đỏ, vàng, cam, hồng); lắc bằng vertex shader: `rotZ = sin(uTime·1.3 + instanceId·0.7)·0.08` | 140 / 60 |
| Thắp đèn lần lượt | uniform `uLit` (0 → 1 theo progress), mỗi instance có attribute `aOrder` (0..1 theo khoảng cách z); đèn sáng khi `uLit > aOrder`, emissive tween 0 → 2 trong khoảng 0.03 | — |
| Thuyền | mũi thuyền low-poly (ExtrudeGeometry) màu gỗ `#4A2E1D` ở dưới khung hình, 1 đèn lồng nhỏ ở mũi | 1 |
| Biển gỗ C2 | box mỏng treo ở mái nhà đầu tiên; chữ tên là **HTML** qua drei `<Html transform occlude={false}>` gắn lên mặt biển | 1 |
| Cửa sổ chân dung C3 | 2 plane ảnh `images[1]` (nhà bờ trái), `images[2]` (bờ phải) trong khung cửa gỗ; ánh sáng vàng từ trong ra (plane emissive phía sau ảnh, lộ ra ở viền) | 2 |
| Hoa đăng C4 | 3 hoa đăng lớn (8 cánh ConeGeometry xếp vòng + nến), mỗi cái mang 1 plane ảnh `images[3..5]` dựng đứng phía sau nến; trôi `z` chậm hơn thuyền | 3 |
| Hoa đăng nền | `InstancedMesh` hoa đăng nhỏ, trôi dạt | 50 / 20 |
| Chùa Cầu | cầu cong: 7 box ghép theo cung + mái ExtrudeGeometry, `#7A3B24`; 5 plane ảnh `images[3..7]` treo dưới mái bằng dây (line) | 1 |
| Bến đỗ | cầu gỗ ngắn + 4 cọc + 2 đèn lồng lớn + mái hiên nhà cuối (`images[0]` trong khung treo tường) | 1 |
| Đèn trời C10 | `InstancedMesh` hộp thang (CylinderGeometry 4 cạnh, top rộng hơn) emissive cam, bay lên `y += v·delta`, trôi ngang theo sin | 300 / 120 |
| Trăng | sphere r=5 `meshBasicMaterial #FFF1C9` + glow sprite, xa ở `[−40, 60, −380]` | 1 |
| Sương | `fog` `#1A0F0A` near 12 far 90 | — |

**Ánh sáng:** `ambientLight 0.15` + `hemisphereLight` cam/tím rất nhẹ. Không dùng pointLight cho từng đèn (quá nặng); ánh đèn toả ra tường làm bằng **decal sprite** vàng additive phía sau mỗi đèn trên tường (1 `InstancedMesh` plane). Desktop thêm 3 `pointLight` đi theo thuyền, chỉ để mặt nước và mũi thuyền có ánh ấm.

**Tương tác con trỏ:** kéo ngang/dọc lệch yaw ±8°, pitch ±5° (làm mượt). Chạm hoa đăng (C4) và chạm đèn lồng bất kỳ trên bờ: đèn đó `scale 1 → 1.15 → 1`, emissive 2 → 4 → 2 (0.6s) và ngân chuông.

---

## 6. Chi tiết từng section HTML

Card đặt **nửa dưới** màn hình (nửa trên để thấy mái nhà, đèn) trừ C5 ở giữa. Không đặt gì ở 3 góc dành cho nút chung.

### C1 · Mũi thuyền (màn mở)

**Mục đích:** tạo "nghi thức" thắp đèn, xin quyền nhạc.

**Wireframe (360px):**
```
┌────────────────────────────┐
│ ←                      ♪   │
│                            │
│      (sông tối, sương)     │
│             ◉              │  ← 1 đèn lồng đỏ gần, đang tắt (emissive 0.2)
│                            │
│  ╭────────────────────────╮│
│  │ 囍  THƯ MỜI            ││  ← card giấy dó nhỏ
│  │ Minh Quân · Thu Hà     ││  ← Playfair italic 26px
│  │ ┌────────────────────┐ ││
│  │ │    THẮP ĐÈN  ✦      │ ││  ← nền lacquer, chữ paper 18px 600
│  │ └────────────────────┘ ││
│  │ Bật âm thanh để nghe   ││
│  │ tiếng đàn tranh        ││  ← Lora italic 14px ink-soft
│  ╰────────────────────────╯│
│  ▔▔▔▔ mũi thuyền ▔▔▔▔       │
└────────────────────────────┘
```
**Timeline khi bấm (2.4s, có "Bỏ qua" không cần vì < 2.5s và cuộn mở khoá ở 1.2s):**
| t (s) | Việc | Ease |
|---|---|---|
| 0.0 | `music.play()` fade 2.5s | — |
| 0.0–0.4 | Card `y 0 → 30`, `opacity → 0` | `power2.in` |
| 0.2–0.8 | Đèn gần: emissive 0.2 → 2.5 (bùng nhẹ) → 2 | `power2.out` |
| 0.6–2.4 | `uLit` 0 → 0.15: dãy đèn phía trước sáng lần lượt từ gần ra xa | `none` |
| 1.2 | Mở khoá cuộn | — |

**Trước khi canvas sẵn sàng:** nền `night` + 1 đèn lồng CSS (div bo tròn `bg-[radial-gradient(#F5B83D,#D9361E_60%,transparent_70%)]`, `animate-pulse`).
**Reduced-motion:** không tween đèn; bấm là mở ngay.
**Edge case:** tên dài → dòng tên `text-balance`, cỡ `clamp(20px,6.5vw,26px)`.

---

### C2 · Biển gỗ tên (0.00–0.12)

**Mục đích:** h1. Tên treo trên bảng hiệu gỗ ở mái nhà đầu tiên, giống bảng hiệu cửa hàng phố cổ.

**Wireframe:**
```
│  ═╤═══════════════════╤═   │  ← mái ngói
│   │ ╔═══════════════╗ │    │
│   └─║  MINH QUÂN    ║─┘    │  ← biển gỗ (drei Html transform), chữ glow
│     ║   ─── & ───   ║      │
│     ║   THU HÀ      ║      │
│     ╚═══════════════╝      │
│  ◉    ◉    ◉    ◉    ◉     │  ← đèn sáng dần
│                            │
│   TRÂN TRỌNG KÍNH MỜI      │  ← 13px moon, tracking
│  quý khách tới dự lễ thành │
│  hôn của hai chúng tôi     │  ← Lora 18px moon
```
**Nội dung:** `<h1>` là khối HTML ở nửa dưới (dành cho SEO và screen reader): "{groom.name} & {bride.name}". Biển gỗ trong scene là **bản hiển thị thứ hai** (`aria-hidden`), vì `<Html transform>` có thể bị khuất.
Câu viết sẵn: "Trân trọng kính mời quý khách tới dự lễ thành hôn của hai chúng tôi".

**Timeline:**
| Mốc | Việc |
|---|---|
| progress 0.00–0.10 | `uLit` 0.15 → 0.35 (scrub): đèn tiếp tục sáng theo cuộn |
| section vào 60% | Biển gỗ đung đưa vào (`rotation.z 0.3 → 0`, `back.out(1.2)`, 1.2s); h1 HTML A2 theo từ |
| +0.8s | Câu mời A1 |

**Chuyển sang C3:** T8, thuyền chậm lại, camera bắt đầu quay trái.
**Edge case:** tên ≥ 20 ký tự → biển gỗ tự nới rộng (Html `transform` + `max-w-[14ch]`, chữ xuống dòng); ≥ 35 ký tự giảm cỡ 26 → 20px.

---

### C3 · Hai ngôi nhà (0.12–0.27)

**Mục đích:** nhà trai, nhà gái. Camera **quay đầu** sang từng bên, card đổi theo.

**Wireframe (lúc quay trái):**
```
│ ┌──────┐                   │
│ │ ảnh  │ ← cửa sổ nhà trai │  ← plane images[1], ánh vàng quanh viền
│ │chú rể│                   │
│ └──────┘   ◉  ◉            │
│ ╭────────────────────────╮ │
│ │ NHÀ TRAI            囍 │ │  ← 13px lacquer-dark, triện góc phải
│ │ Ông … · Bà …  ⚠️       │ │  ← tên bố mẹ, ẩn nếu chưa có trường
│ │ Minh Quân              │ │  ← Playfair italic 30px ink
│ │ Quận 1, TP. Hồ Chí Minh│ │  ← Lora 18px ink-soft
│ ╰────────────────────────╯ │
```
Lúc quay phải: card "NHÀ GÁI" với `bride.*` và `images[2]`, card căn phải.

**Timeline (scrub theo progress):**
| progress | Việc |
|---|---|
| 0.13–0.16 | Camera quay trái; cửa sổ nhà trai "bật đèn" (emissive 0 → 1.5) |
| 0.15 | Card nhà trai vào: treo xuống (`y -24 → 0`, `rotate -2° → 0`) |
| 0.21–0.23 | Card nhà trai ra (`x → -30`, `opacity → 0`); camera quay phải |
| 0.22 | Cửa sổ nhà gái sáng; card nhà gái vào |
| 0.26–0.27 | Card nhà gái ra, camera về trước |

Hai card là hai `<article>` nằm trong cùng section cao 150svh, mỗi card `sticky` ở nửa dưới màn hình trong nửa section của nó.
**Tương tác:** chạm cửa sổ → lightbox ảnh chân dung.
**Reduced-motion:** hai card xếp dọc, ảnh chân dung nằm trong card.
**Edge case:** ảnh chân dung ngang → `object-fit: cover` bằng cách chỉnh `texture.repeat/offset` (hàm `coverUV(imgAspect, planeAspect)`, có test).

---

### C4 · Hoa đăng (0.27–0.45)

**Mục đích:** chuyện tình 3 mốc. Mỗi hoa đăng mang một ảnh và một lời.

**Wireframe (1 mốc):**
```
│        ◉       ◉           │
│  ~~~~~~~~~~~~~~~~~~~~~~~~~ │  ← mặt sông, phản chiếu
│     ✿[ảnh]     ·  ✿  ·     │  ← hoa đăng lớn mang images[3], nến lập loè
│  ~~~~~~~~~~~~~~~~~~~~~~~~~ │
│ ╭────────────────────────╮ │
│ │ MỐC 1 · LẦN ĐẦU GẶP GỠ │ │
│ │ Giữa phố đông, anh     │ │
│ │ nhận ra em như nhận ra │ │
│ │ ngọn đèn quen.         │ │
│ ╰────────────────────────╯ │
│  Chạm vào hoa đăng ✦       │  ← gợi ý, chỉ hiện ở mốc 1
```
| Mốc | Progress | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|
| 1 | 0.27–0.33 | Lần đầu gặp gỡ | "Giữa phố đông, anh nhận ra em như nhận ra một ngọn đèn quen." | `images[3]` |
| 2 | 0.33–0.39 | Thương nhau | "Mình thương nhau chậm rãi, như dòng sông này, không vội mà chẳng bao giờ ngừng chảy." | `images[4]` |
| 3 | 0.39–0.45 | Lời hứa | "Đêm rằm năm ấy, anh thả một chiếc hoa đăng và xin em một lời hứa trọn đời." | `images[5]` |

**Timeline mỗi mốc:** hoa đăng trôi vào khung hình từ xa (scrub). Khi card vào 55% viewport: card A1 (0.8s), nến trên hoa đăng bùng sáng một nhịp.
**Tương tác (điểm nhấn):** chạm hoa đăng → sáng rực (emissive 1 → 4 → 1.5, 0.8s), **ngân chuông**, 12 hạt ánh vàng bay lên (Points nhỏ). Chạm lần 2 → mở lightbox ảnh. Bàn phím: mỗi hoa đăng có nút HTML ẩn tương ứng (`sr-only focus:not-sr-only`) "Thắp hoa đăng mốc 1" để dùng Tab/Enter.
**Reduced-motion:** không trôi, ảnh nằm trong card.

---

### C8 · Chùa Cầu (0.45–0.61)

**Mục đích:** album. Ảnh treo dưới mái cầu như tranh, thuyền đi dần tới rồi lọt dưới gầm.

**Wireframe:**
```
│   ╱▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔╲    │  ← mái cầu
│  ┃ ▯   ▯   ▯   ▯   ▯  ┃    │  ← 5 ảnh treo, lắc nhẹ
│  ┃                    ┃    │
│ ~~~~~~~~~~~~~~~~~~~~~~~~~~ │
│                            │
│    KỶ NIỆM DƯỚI MÁI CẦU    │  ← A2, moon
│  ╭──────────────────────╮  │
│  │  Xem tất cả ảnh  ⊞    │  │  ← nút viền glow
│  ╰──────────────────────╯  │
```
**Timeline (scrub):** progress 0.45–0.52 cầu lớn dần; 0.52–0.61 camera ngẩng lên, lướt ngang dưới dãy ảnh; từng ảnh khi vào tâm khung hình thì `scale 1 → 1.08` và đèn nhỏ cạnh ảnh sáng.
**Tương tác:** chạm ảnh → lightbox A10; nút "Xem tất cả ảnh" → lưới HTML 2 cột, ảnh A3 khi mở.
**Edge case:** ít hơn 5 ảnh album (không xảy ra vì `media.images = 8` bắt buộc) → dù vậy code vẫn render theo `images.slice(3, 8)` không crash.

---

### #under · Gầm cầu (0.61–0.66)

**Mục đích:** chuyển cảnh T6 bằng bóng tối, tạo nhịp nghỉ trước phần thông tin.
Không có card; 1 dòng chữ giữa màn hình: *"Qua cầu này là tới nhà rồi…"* (Playfair italic 22px, moon), A1 vào và ra.
Scene: toàn màn hình tối dần (`fog far 90 → 20`), âm lượng 0.55 → 0.3 → 0.55. Ra khỏi gầm là bến đỗ sáng rực (`uLit` nhảy 0.7 → 1 trong 0.03 progress).
**Reduced-motion / fallback:** chỉ còn dòng chữ.

---

### C5 + C6 + C7 · Bến đỗ (0.66–0.88)

**Mục đích:** ngày, giờ, địa điểm. Thuyền dừng hẳn từ 0.80, người xem đọc thong thả.

**Wireframe (3 card cuộn lần lượt, không pin):**
```
│ ╭────────────────────────╮ │
│ │  ┌──────────────────┐  │ │
│ │  │ images[0] khung  │  │ │  ← ảnh bìa trong khung gỗ
│ │  └──────────────────┘  │ │
│ │  NGÀY VU QUY           │ │
│ │  Thứ Bảy               │ │
│ │        14              │ │  ← Playfair 88px lacquer
│ │  THÁNG 11 · 2026       │ │  ← `date` ⚠️
│ │  (nhằm ngày 24 tháng 9 │ │
│ │   năm Bính Ngọ)        │ │  ← âm lịch, xem §10.4
│ │  45 : 06 : 12 : 33     │ │  ← A7, ô nền night chữ glow
│ ╰────────────────────────╯ │
│ ╭────────────────────────╮ │
│ │  LỊCH TRÌNH            │ │
│ │  ◉ 08:00 Lễ gia tiên   │ │  ← chấm đèn lồng làm bullet
│ │  ◉ 10:00 Lễ thành hôn  │ │
│ │  ◉ 18:00 Tiệc cưới     │ │
│ ╰────────────────────────╯ │
│ ╭────────────────────────╮ │
│ │  ĐỊA ĐIỂM              │ │
│ │  {venue.name}          │ │
│ │  [ <MapEmbed/> 200px ] │ │
│ │  [ Chỉ đường ➚ ]       │ │
│ ╰────────────────────────╯ │
```
**Nội dung:** ngày dương từ `date` ⚠️ (chưa có thì dùng ngày mẫu `2026-11-14T18:00` và ẩn đếm ngược); **ngày âm lịch** là điểm riêng của mẫu truyền thống (tính từ `date`, xem §10.4; nếu chưa có `date` thì ẩn dòng âm lịch). Sự kiện C6 hardcode 3 mốc như wireframe. Qua ngày cưới: *"Chúng tôi đã về chung một nhà ♥"*.
**Timeline:** mỗi card A1 kiểu "treo xuống" khi vào 60% viewport. Số "14" A2. Chấm đèn lồng trong lịch trình sáng lần lượt (stagger 0.2s).
**Edge case:** `venue.name` rỗng → "Nhà hàng tiệc cưới".

---

### C10 · Đèn trời (0.88–1.00)

**Mục đích:** kết. Khách **tự thả đèn**.

**Wireframe:**
```
│    ▵    ▵  ▵     ▵   ▵     │  ← đèn trời bay lên
│  ▵     ▵      ▵    ▵       │
│          ☾                 │
│  Cảm ơn quý khách đã cùng  │
│  chúng tôi thắp sáng ngày  │
│  trọng đại này.            │  ← Playfair italic 24px moon
│    Minh Quân & Thu Hà      │  ← glow
│  ╭──────────────────────╮  │
│  │  THẢ MỘT ĐÈN TRỜI ▵   │  │  ← nền lacquer
│  ╰──────────────────────╯  │
│  Đã có 1 lời chúc bay lên  │  ← đếm số lần bấm của chính khách
```
**Timeline:** progress 0.88 bắt đầu thả 300 đèn (mỗi đèn có `delay` ngẫu nhiên 0–6s), bay lên lặp vô hạn. Chữ A2 theo dòng.
**Tương tác:** bấm "Thả một đèn trời" → 1 đèn lớn hơn (scale 1.6) cất lên từ mũi thuyền, ngân chuông, bộ đếm +1 (state cục bộ, không lưu, không gửi đi đâu). Giới hạn 20 đèn "của khách" cùng lúc (tái dùng instance).
**Reduced-motion:** không có đèn bay; nút vẫn có, bấm thì hiện chữ "Lời chúc của bạn đã được gửi ✦".

---

## 7. Fallback (không có WebGL hoặc reduced-motion)
- Không mount canvas. Nền: ảnh minh hoạ `fallback-street.webp` (phố cổ đêm, vẽ phẳng, ≤ 150KB) cố định, phủ `bg-[#1A0F0A]/55`.
- Một dải 6 **đèn lồng CSS** treo ở mép trên (div bo tròn gradient đỏ vàng, lắc bằng `animate-lantern-3d-sway` khai báo trong `@theme`; tắt khi reduced-motion).
- Chân dung vào card C3; hoa đăng C4 thành 3 card có ảnh; C8 thành lưới 2 cột; nút "Thả đèn trời" vẫn hoạt động (chỉ đếm).
- Chuông vẫn ngân khi bấm.

## 8. Hiệu năng
- `dpr={[1, isMobile ? 1.5 : 2]}`, `frameloop="demand"` trước khi mở và khi tab ẩn.
- `MeshReflectorMaterial` chỉ desktop (render thêm 1 pass). Mobile dùng vệt phản chiếu giả.
- Đèn lồng, nhà, mái, hoa đăng nền, đèn trời: mỗi loại 1 `InstancedMesh` → toàn scene khoảng 20 draw call.
- Lắc đèn làm trong vertex shader (không cập nhật 140 ma trận mỗi frame).
- Nhà chỉ dựng 2 đoạn phố và **tái dùng** (đặt lại `z` khi thuyền đi qua) thay vì dựng cả con sông: hàm `recycleZ(z, cameraZ, span)`.
- Texture người dùng qua `useSafeTexture`.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Khung ảnh ở bến đỗ (C5), thumbnail, OG |
| `images[1]` / `images[2]` | Cửa sổ nhà trai / nhà gái (C3) |
| `images[3..5]` | 3 hoa đăng C4 |
| `images[3..7]` | 5 ảnh treo dưới Chùa Cầu C8 |
| `videos` | Không dùng |

`meta.media = { images: 8, videos: 0 }`
`meta`: `styles: ["traditional", "cinematic"]`, `colors: ["red", "gold"]`, `tags: ["hội an", "đèn lồng", "truyền thống"]`.

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/lantern-3d/
├── meta.ts, layout.tsx (Playfair_Display + Lora, vietnamese), page.tsx
└── _components/
    ├── lantern-invite.tsx    # "use client": sections + OpenGate + useScrollProgress + <LanternCanvas/>
    ├── lantern-canvas.tsx    # dynamic import scene + fallback
    ├── scene.tsx
    ├── boat-rig.tsx          # đường sông + s(p) + yaw/pitch keyframes + lắc thuyền
    ├── river.ts              # điểm sông, speedCurve(p), recycleZ (có test)
    ├── lanterns.tsx          # InstancedMesh + shader lắc + uLit
    ├── houses.tsx            # nhà, mái, cửa sổ, cửa sổ chân dung C3
    ├── water.tsx             # reflector (desktop) / vệt giả (mobile)
    ├── flower-lanterns.tsx   # hoa đăng C4 + chạm
    ├── bridge.tsx            # Chùa Cầu + ảnh treo C8
    ├── sky-lanterns.tsx      # đèn trời C10
    ├── lunar.ts              # đổi dương → âm lịch (có test)
    ├── bell.ts               # phát chuông, tối đa 3 tiếng chồng
    └── sections/*.tsx
```

### 10.2 Tokens
```ts
export const t = {
  root: "bg-[#1A0F0A] text-[#F7ECD8] font-(family-name:--font-body)",
  paper: "rounded-lg bg-[#F7ECD8]/90 text-[#2B1A10] shadow-[0_12px_32px_-12px_rgba(245,184,61,0.35)] outline outline-1 outline-[#D9361E]/30 -outline-offset-[6px]",
  board: "rounded-sm bg-[linear-gradient(#5A3522,#3E2416)] text-[#F5B83D]",
  display: "font-(family-name:--font-display)",
  heading: "text-[13px] tracking-[0.25em] uppercase font-bold text-[#A82816]",
  soft: "text-[#6B5140]",
  btn: "min-h-11 rounded-lg bg-[#D9361E] px-6 text-lg font-semibold text-[#F7ECD8]",
} as const;
```

### 10.3 Thắp đèn và lắc đèn trong shader
```tsx
// lanterns.tsx (rút gọn)
const uniforms = useMemo(() => ({ uTime: { value: 0 }, uLit: { value: 0 } }), []);
useLayoutEffect(() => {  // aOrder: 0..1 theo z, đèn gần sáng trước
  const order = new Float32Array(count).map((_, i) => positions[i].z / minZ);
  mesh.current.geometry.setAttribute("aOrder", new THREE.InstancedBufferAttribute(order, 1));
}, []);
<meshStandardMaterial vertexColors toneMapped={false} onBeforeCompile={(s) => {
  Object.assign(s.uniforms, uniforms);
  s.vertexShader = s.vertexShader
    .replace("#include <common>", "#include <common>\nuniform float uTime; uniform float uLit; attribute float aOrder; varying float vLit;")
    .replace("#include <begin_vertex>", `#include <begin_vertex>
      float a = sin(uTime * 1.3 + float(gl_InstanceID) * 0.7) * 0.08;
      transformed.xy = mat2(cos(a), -sin(a), sin(a), cos(a)) * transformed.xy;
      vLit = smoothstep(aOrder, aOrder + 0.03, uLit);`);
  s.fragmentShader = s.fragmentShader
    .replace("#include <common>", "#include <common>\nvarying float vLit;")
    .replace("#include <emissivemap_fragment>", "totalEmissiveRadiance = diffuseColor.rgb * mix(0.15, 2.0, vLit);");
}} />
useFrame((_, d) => { uniforms.uTime.value += d; uniforms.uLit.value = litFromProgress(progress.current); });
```
Lắc quanh gốc treo: dựng Lathe sao cho điểm treo ở `y = 0` (đèn nằm dưới gốc) để phép xoay quanh gốc toạ độ cục bộ đúng là lắc quanh dây.

### 10.4 Ngày âm lịch
Không thêm thư viện. Dùng `Intl.DateTimeFormat("vi-VN-u-ca-chinese", { day: "numeric", month: "numeric" })` (lịch Trung Hoa, trùng âm lịch Việt Nam gần như mọi năm; lệch ở một số năm hiếm do khác múi giờ UTC+7/UTC+8). Năm can chi tính bằng bảng 10 can × 12 chi từ `year`. Viết trong `lunar.ts`:
```ts
export function lunarLabel(d: Date): string // → "ngày 24 tháng 9 năm Bính Ngọ"
```
⚠️ Nếu trình duyệt không hỗ trợ `ca-chinese` (kiểm tra `resolvedOptions().calendar !== "chinese"`) thì **ẩn dòng âm lịch**, không hiện sai.

### 10.5 Logic cần test
- `river.test.ts`: `speedCurve` đơn điệu tăng, `speedCurve(0) = 0`, `speedCurve(1) = 1`, phẳng (đạo hàm ≈ 0) trong 0.80–1.00; `recycleZ` luôn trả `z` trong `[cameraZ - span, cameraZ]`.
- `lunar.test.ts`: `2026-11-14` → "ngày 6 tháng 10 năm Bính Ngọ" (⚠️ tra lại lịch vạn niên trước khi viết test, giá trị ở đây chưa kiểm); can chi của 2024 = Giáp Thìn, 2025 = Ất Tỵ, 2026 = Bính Ngọ.
- `cover-uv.test.ts`: ảnh ngang vào plane dọc thì `repeat.x < 1`, offset căn giữa.

### 10.6 Thứ tự làm
1. `meta`, `layout`, tokens, sections HTML tĩnh; kiểm tra chữ 18px dễ đọc ở 360px
2. `river.ts` + test, boat rig (vị trí theo đường cong, yaw/pitch keyframes)
3. Nhà + đèn lồng instanced + `uLit` + lắc; C1 timeline, nhạc
4. Mặt sông (reflector desktop / vệt giả mobile)
5. Cửa sổ chân dung C3, hoa đăng C4 + chạm + chuông
6. Chùa Cầu C8, gầm cầu, bến đỗ C5–C7 + âm lịch
7. Đèn trời C10 + nút thả đèn
8. Fallback, đo fps, bundle, Lighthouse mobile ≥ 75, checklist §12

## 11. Asset cần chuẩn bị
- [ ] `music.mp3` (Pixabay, ≤ 3MB), `bell.mp3` (≤ 40KB) + `CREDITS.md`
- [ ] `glow.png` 128px (sprite radial vàng), `streak.png` 32×256 (vệt phản chiếu)
- [ ] `fallback-street.webp` (minh hoạ phố cổ đêm, tự vẽ hoặc chụp từ scene)
- [ ] SVG: mái ngói lặp, chữ Vạn, dây treo, triện "囍"
- [ ] 8 ảnh mẫu (ưu tiên ảnh áo dài, phố cổ) từ Pexels/Unsplash
- [ ] `thumb.webp` 600×800 (sông + dãy đèn), `opengraph-image.png`

## 12. Tiêu chí nghiệm thu riêng
- [ ] Đèn sáng lần lượt đúng thứ tự gần → xa khi cuộn, cuộn ngược thì tắt ngược lại
- [ ] Ở C3 camera quay rõ sang trái rồi sang phải, card đúng bên đúng nhà
- [ ] Chạm hoa đăng: sáng + chuông trong ≤ 100ms; dùng được bằng bàn phím (Tab/Enter)
- [ ] Người lớn tuổi đọc được: chữ nội dung ≥ 18px, tương phản ≥ 4.5:1 trên mọi card
- [ ] Dòng âm lịch đúng với lịch vạn niên cho 5 ngày thử; trình duyệt không hỗ trợ thì ẩn
- [ ] iPhone 12 / Android tầm trung ≥ 45fps ở cảnh đèn trời
- [ ] Tắt WebGL vẫn đọc đủ thiệp và xem đủ 8 ảnh
