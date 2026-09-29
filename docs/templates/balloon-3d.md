# 3D-09 · `balloon-3d` · Khinh Khí Cầu

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `@/kit/3d` (dựng ở [galaxy-3d](./galaxy-3d.md)): `SceneCanvas`, `useScrollProgress`, `useSafeTexture`, `sampleKeyframes`.

---

## 0. Thiết kế lại v2 (29/09/2026) — thay thế các mục bên dưới khi mâu thuẫn

Bản v1 bị đánh giá không đạt ([visual-quality.md §7](../visual-quality.md)): thành phố hình hộp, khinh khí cầu nhựa, ảnh là plane trần, gần như không thấy ảnh cưới.

**Design Read:** thiệp cưới online cho cặp đôi mê xê dịch, ngôn ngữ *điện ảnh giờ vàng, mơ màng và thoáng*, nghiêng về *sky cinematic*: trời chuyển từ sáng trong → hoàng hôn → đêm sao, mây mềm thể tích, ảnh cưới lơ lửng như những khoảnh khắc bay cùng gió.
**Dial:** VARIANCE 7 · MOTION 6 · DENSITY 2.

**Art direction**
- *Tham chiếu:* ảnh chụp từ khinh khí cầu Cappadocia lúc bình minh; poster phim "Up" (Pixar) phần bầu trời; khung hình hoàng hôn trên biển mây của các phim hàng không.
- *Phong cách hình khối:* **particle / ánh sáng mềm**: trời là shader gradient, mây thể tích (drei `Clouds` + texture pmndrs), khinh khí cầu ở trung/viễn cảnh với vải có gân + sheen, lửa đốt phát sáng (bloom) khi trời tối. Không có khối hộp.
- *Chất liệu:* vải khinh khí cầu (sọc gân, sheen), giỏ mây đan; ảnh cưới bo góc 24px, không viền, như ảnh trong tạp chí du lịch.
- *Bảng màu:* trời `#7FB3E0 → #F7C59F → #3B3F74 → #0E1330`; chữ ban ngày `#1F2433`, về đêm `#FFF8F0`; nhấn duy nhất *ember* `#E8735A`.
- *Chữ:* tên cặp đôi **Italianno** (script mảnh, sang); nội dung **Hanken Grotesk**. Không nhãn chữ in hoa nhỏ trên mọi section.
- *3 hero shot:* (1) màn mở: tên cặp đôi trên nền trời sớm, mây trôi dưới chân, vài khinh khí cầu xa; (2) album: 20+ ảnh xếp nhịp tạp chí, uốn nhẹ theo tốc độ cuộn, hiện dần như vén mây; (3) kết: trời sao, lửa khinh khí cầu toả sáng, nút *Gửi lời chúc*.
- *Nhịp cuộn:* sáng (tên, cặp đôi) → trưa (chuyện tình) → giờ vàng (album) → chạng vạng (ngày cưới, địa điểm) → đêm (lời cảm ơn).

---

## 1. Concept

**Một câu:** Hai người cùng bước lên giỏ một chiếc khinh khí cầu trên sân thượng thành phố, cuộn trang là bay lên, xuyên qua mây, ngắm hoàng hôn trên biển mây rồi chạm tới bầu trời sao.

**Cảm xúc muốn gợi:** vui tươi, bay bổng, phiêu lưu, "cùng nhau bay cao hơn". Nhẹ nhàng như gió, có chút tinh nghịch.

**Phù hợp với:** cặp đôi trẻ, thích du lịch, muốn thiệp tươi sáng, dễ thương nhưng vẫn "điện ảnh".

**Cách kể chuyện:** khác galaxy (bay quanh các điểm) và museum (đi ngang), đây là **chuyển động một chiều theo phương thẳng đứng**. Khinh khí cầu luôn ở giữa màn hình (camera đi kèm, hơi chếch), **thế giới trôi xuống dưới**. Cuộn = độ cao. Bầu trời đổi màu theo độ cao. Một **đồng hồ đo độ cao** HTML ở mép phải cho biết đang ở mấy mét (con số vui, không thực tế). Card HTML **treo trên dải ruy băng** thả từ giỏ khinh khí cầu xuống, đung đưa theo gió.

**Moodboard:** lễ hội khinh khí cầu Cappadocia, minh hoạ Ghibli, mây bông pastel, ruy băng vải, chữ tròn Pacifico.

---

## 2. Design tokens

### Màu
Bầu trời gradient 2 điểm (đỉnh/chân trời), lerp theo độ cao:

| Mốc trời | Đỉnh | Chân trời |
|---|---|---|
| Ngày (0–0.30) | `#8FD0F2` | `#BFE3F7` |
| Trong mây (0.30–0.50) | `#DCEFFA` | `#FFFFFF` |
| Hoàng hôn (0.65–0.85) | `#F59E8B` | `#F9C6C9` |
| Đêm (0.85–1) | `#1B1F4B` | `#3A3470` |

| Token | Hex | Dùng cho |
|---|---|---|
| `card` | `#FFFFFF` / 85% + `backdrop-blur-sm` | Nền card ruy băng |
| `ink` | `#23303F` | Chữ chính (trên `card` ≈ 12:1 ✅) |
| `soft` | `#52606D` | Chữ phụ (trên `card` ≈ 6:1 ✅) |
| `coral` | `#EF6F6C` | Tên, nút, vỏ khinh khí cầu. Trên `card` chỉ ≈ 3:1 → **chỉ cho chữ ≥ 24px** (đạt AA large) |
| `coralDeep` | `#C8433F` | Chữ coral cỡ nhỏ, nhãn (trên `card` ≈ 4.8:1 ✅) |
| `sky` | `#3D84A8` | Ruy băng, sọc khinh khí cầu, icon |
| `night` | `#1B1F4B` | Nền trang phần cuối; chữ trên nền này dùng `#FFFFFF` |

### Typography
| Vai trò | Font | Mobile | Desktop |
|---|---|---|---|
| Tên | Pacifico 400 | 40px | 72px |
| Tiêu đề card | Pacifico 400 | 24px | 30px |
| Nhãn độ cao ("1.200 M") | Quicksand 700, tracking 0.15em | 12px | 13px |
| Số lớn (ngày) | Quicksand 700 | 72px | 110px |
| Nội dung | Quicksand 500 | 16px / 1.7 | 17px |

Pacifico không có chữ đậm/nghiêng, chỉ dùng ở cỡ lớn; không viết hoa toàn bộ bằng Pacifico.

### Hình khối và chất liệu
- Card: `rounded-[1.5rem]`, `card`, bóng mềm; phía trên có **nút thắt ruy băng** (SVG nhỏ màu `sky`) và 2 dải ruy băng dọc chạy lên mép trên màn hình.
- Scene phong cách **đồ chơi mềm**: `meshToonMaterial` (3 bậc gradientMap) cho khinh khí cầu và nhà; mây drei.
- Motion: bay lên `sine.inOut`; card đung đưa quanh điểm treo (`rotation ±2°`, A12 kéo dài 4s); nút `back.out(1.7)` khi xuất hiện (vui hơn các mẫu khác).

---

## 3. Nhạc
- Ukulele, glockenspiel, vỗ tay nhẹ, tươi vui, không lời, khoảng 110 BPM, dài 2:00–2:30 (lặp).
- Từ khoá Pixabay: `ukulele happy wedding`, `happy ukulele glockenspiel`, `cheerful acoustic travel`.
- Bắt đầu khi bấm "Cất cánh". Âm lượng 0 → 0.6 trong 1.5 giây.
- **Điểm nhấn**: khi bắn lửa (C1) phát thêm hiệu ứng "phụt lửa" ngắn (`burner.mp3` ≤ 30KB, âm lượng 0.4). Vào trời sao (0.85) âm lượng nhạc giảm từ 0.6 xuống 0.35 trong 2s cho không khí lặng hơn.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **850svh**. Canvas `fixed inset-0 -z-10`. Nền `<body>` phần tử gốc đổi màu theo độ cao (cùng giá trị với bầu trời) để không lộ mép khi overscroll trên iOS.

```
  ☾ ✦   ✦      ← 1.00  #stars    C10        ĐÊM     y = 400
  ▒▒ hoàng hôn ← 0.65  #sunset   C5+C6+C7   CHẠNG VẠNG  y = 300
  ☁ ◯ ◯ ◯ ☁    ← 0.50  #flotilla C8         BIỂN MÂY y = 220
  ☁☁☁☁☁☁☁      ← 0.30  #clouds   C4         XUYÊN MÂY y = 120–200
  ▙▟▙▟ phố     ← 0.10  #rise     C2 + C3    ĐI LÊN   y = 10–100
  ▀▀ sân thượng← 0.00  #rooftop  C1                  y = 0
```

| Chương | Progress | HTML section | Card | Độ cao hiển thị |
|---|---|---|---|---|
| 0 | màn mở | `#rooftop` | C1 | 0 m |
| 1 | 0.00–0.30 | `#rise` | C2 + C3 | 0 → 900 m |
| 2 | 0.30–0.50 | `#clouds` | C4 | 900 → 2.000 m |
| 3 | 0.50–0.65 | `#flotilla` | C8 | 2.000 → 2.600 m |
| 4 | 0.65–0.85 | `#sunset` | C5 + C6 + C7 | 2.600 → 3.500 m |
| 5 | 0.85–1.00 | `#stars` | C10 | "∞" |

### Keyframe camera và khinh khí cầu
Khinh khí cầu ở `balloon.y = altitude(p)`; camera **tương đối** với khinh khí cầu (offset), nên keyframe gồm độ cao và offset.

| progress | altitude | camera offset | lookAt (tương đối) | Ghi chú |
|---|---|---|---|---|
| 0.00 | 0 | `[0, 2, 10]` | `[0, 3, 0]` | Ngang giỏ trên sân thượng |
| 0.10 | 20 | `[4, -2, 12]` | `[0, 3, 0]` | Chếch dưới, thấy khinh khí cầu và phố |
| 0.30 | 110 | `[-6, 6, 14]` | `[0, -10, 0]` | Nhìn xuống, phố nhỏ như đồ chơi |
| 0.40 | 160 | `[0, 1, 9]` | `[0, 3, 0]` | Giữa mây, cận cảnh |
| 0.50 | 220 | `[0, 8, 26]` | `[0, 0, -20]` | Lùi xa, thấy đoàn khinh khí cầu |
| 0.65 | 300 | `[10, 2, 16]` | `[-30, 0, -60]` | Quay về phía mặt trời lặn |
| 0.85 | 360 | `[0, -4, 14]` | `[0, 20, 0]` | Nhìn ngửa lên trời sao |
| 1.00 | 400 | `[0, -2, 18]` | `[0, 12, 0]` | Khinh khí cầu nhỏ dưới dải ngân hà |

`altitude` nội suy `sine.inOut` giữa các keyframe; camera = `balloon.position + offset` rồi lerp mượt `1 - exp(-3·delta)` (chậm hơn galaxy một chút, cho cảm giác bồng bềnh).
Khinh khí cầu còn **trôi ngang nhẹ**: `x = sin(t·0.2)·1.5`, `rotation.y += 0.05·dt`.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Bầu trời | sphere r=500 `BackSide`, `ShaderMaterial` gradient 2 màu theo `normal.y`, uniforms `uTop`, `uHorizon` lerp theo §2 | 1 |
| Khinh khí cầu chính | `LatheGeometry` (profile giọt nước 16 điểm, 24 phân đoạn), `meshToonMaterial`; sọc bằng vertex color xen `coral`/`#FFFFFF`/`sky`; giỏ box nâu, 4 dây `Line` | 1 |
| Ngọn lửa | cone nhỏ additive vàng cam + `pointLight` cam; `scale.y` nhấp nháy theo noise; bùng to khi "bắn lửa" | 1 |
| Thành phố | `InstancedMesh` box (nhà) với chiều cao và màu pastel ngẫu nhiên (seed), trên plane lưới 200×200; sân thượng xuất phát là 1 box lớn ở tâm | 300 / 150 |
| Mây | drei `<Clouds material={MeshLambertMaterial}>` + nhiều `<Cloud segments bounds volume>` rải trong dải y 120–200 và một "biển mây" phẳng ở y 205 | 14 cụm / 7 cụm (segments 20 / 10) |
| Đoàn khinh khí cầu nhỏ (C8) | 6 bản clone scale 0.4 (dùng chung geometry), mỗi chiếc treo **1 ảnh** (plane 3:4 dưới giỏ, như biển quảng cáo kéo theo) `images[3..7]` + `images[0]` (xem §9); trôi A12 3D (`y ±0.5`, lệch pha) | 6 |
| Mặt trời | sprite additive lớn, màu `#FFB38A`, lặn dần (`y` giảm) trong 0.65–0.85 | 1 |
| Trời sao | drei `<Stars radius={300} count fade>`; `opacity` material 0 → 1 trong 0.80–0.90 | 3000 / 1200 |
| Chim | 5 chấm `Points` hình chữ V bay ngang một lần trong chương 1 (chi tiết vui) | 5 / 5 |

**Tương tác con trỏ:** pointer.x nghiêng khinh khí cầu (`rotation.z = -pointer.x·0.08`) và đẩy camera offset.x ±1.5 như gió thổi. **Chạm đúp** vào canvas (mobile) hoặc bấm vào ngọn lửa = "bắn lửa": lửa bùng 0.6s + tiếng lửa (chỉ trang trí, không đổi progress).

---

## 6. Chi tiết từng section HTML

**Quy ước card ruy băng:** card nằm **giữa-dưới** màn hình (khinh khí cầu ở nửa trên). Hai dải ruy băng là `div` 2px màu `sky` chạy từ đỉnh card lên hết màn hình (`fixed`, như thả từ giỏ). Card vào bằng **"thả xuống"**: `y -120 → 0`, `rotation -4° → 0`, `back.out(1.4)` 0.9s, sau đó A12 đung đưa quanh `transform-origin: top center`. Card ra: kéo lên `y -80, opacity 0` (như được kéo về giỏ). Đây là chuyển tiếp HTML riêng của mẫu, không dùng A1.

**Đồng hồ độ cao:** `fixed right-4 top-1/2`, thanh dọc 120px với vạch chia, chấm coral chạy theo progress, số "1.200 M" cập nhật qua ref (`textContent`, không setState). Ở chương 5 đổi thành "∞". Không đè góc trên-phải (nút nhạc) và dưới-phải (Dùng thử).

### C1 · Sân thượng
```
┌────────────────────────────┐
│          ╭───╮             │
│         │ ◯◯◯ │            │  ← khinh khí cầu trên sân thượng (canvas)
│          ╰┬─┬╯             │
│           └█┘              │
│  ▙▟▙▟▙▟▙▟▙▟▙▟▙▟▙▟▙▟▙▟      │
│   Cùng chúng mình          │  ← Quicksand 14px soft
│   bay lên nhé!             │
│   Minh Quân & Thu Hà       │  ← Pacifico 32px coral
│    ╭──────────────╮        │
│    │ 🔥 CẤT CÁNH   │        │  ← nút coral, chữ trắng, back.out
│    ╰──────────────╯        │
└────────────────────────────┘
```
**Nội dung:** "Cùng chúng mình bay lên nhé!" · `{groom.name} & {bride.name}` · nút "Cất cánh".

| t | Sự kiện |
|---|---|
| 0.0s | Bấm → nhạc fade in; tiếng lửa |
| 0.0–0.3s | **Chớp sáng**: overlay `bg-[#FFD9A0]` opacity 0 → 0.6 → 0 (0.3s); `pointLight` intensity 2 → 30 → 4 |
| 0.1–0.8s | Ngọn lửa bùng `scale.y 1 → 3 → 1.2`; vỏ khinh khí cầu phồng `scale 0.92 → 1` `elastic.out(1, 0.5)` |
| 0.6–2.2s | Khinh khí cầu tự bay lên `altitude 0 → 8` (intro, không phụ thuộc cuộn), camera đi theo |
| 1.0s | Chữ và nút `y 20, opacity 0` |
| 2.2s | Mở khoá cuộn, altitude theo progress (keyframe 0.00 đã khớp 8 m bằng offset intro) |

Nút "Bỏ qua" sau 0.5s. **Trước khi canvas sẵn sàng:** nền gradient trời ngày + SVG khinh khí cầu tĩnh (A12).

### C2 · Tên (0.00–0.15)
```
│      ║            ║        │  ← 2 ruy băng sky
│   ╭──╨────────────╨──╮     │
│   │ Trân trọng kính mời│    │  ← soft 14px
│   │   Minh Quân        │    │  ← h1, Pacifico 40px coral
│   │       &            │    │
│   │    Thu Hà          │    │
│   │ đến chung vui chuyến│    │
│   │ bay hạnh phúc       │    │
│   ╰────────────────────╯   │
```

### C3 · Cặp đôi (0.15–0.30)
Hai card ruy băng nhỏ **treo so le** (trái cao hơn phải 40px), mỗi card có ảnh tròn 96px (HTML `<img>` `rounded-full`) + tên + địa chỉ.
```
│ ║        ║                 │
│╭╨────────╨╮  ║        ║    │
││ (ảnh CR) │ ╭╨────────╨╮   │
││ NHÀ TRAI │ │ (ảnh CD) │   │
││Minh Quân │ │ NHÀ GÁI  │   │
││12 Lê Lợi…│ │ Thu Hà   │   │
│╰──────────╯ │34 Trần…  │   │
│             ╰──────────╯   │
```
**Nội dung:** `images[1]`, `groom.name`, "Nhà trai: `{groom.address}`" · `images[2]`, `bride.name`, "Nhà gái: `{bride.address}`". Tên bố mẹ ⚠️: có thì thêm dòng "Con ông … & bà …", không thì ẩn. Địa chỉ dài: `line-clamp-3` + nút "xem thêm" mở rộng.

### C4 · Chuyện tình, xuyên mây (0.30–0.50)
Ba card thả xuống **lần lượt thay nhau** (card trước kéo lên khi card sau thả xuống). Mây cắt ngang màn hình giữa các card (khoảnh khắc camera đi xuyên cụm mây làm màn hình trắng mờ 0.2s — tự nhiên từ scene, không cần overlay).

| Mốc | Nhãn độ cao | Tiêu đề | Nội dung viết sẵn | Ảnh |
|---|---|---|---|---|
| 1 | 1.000 M | Cất cánh | "Lần đầu gặp nhau, tim đập như tiếng lửa phụt, chẳng biết sẽ bay tới đâu." | `images[3]` |
| 2 | 1.400 M | Vượt mây | "Có những ngày mây mù, nhưng tụi mình vẫn nắm tay bay tiếp." | `images[4]` |
| 3 | 1.800 M | Trời quang | "Và rồi anh ngỏ lời, em gật đầu. Phía trước là cả bầu trời." | `images[5]` |

Ảnh trong card: `<img>` 3:4 rộng 120px nghiêng 3° như polaroid dán cạnh chữ.

| Progress | Sự kiện |
|---|---|
| 0.31 / 0.37 / 0.43 | Card 1/2/3 thả xuống |
| 0.36 / 0.42 / 0.48 | Card trước kéo lên |

### C8 · Đoàn khinh khí cầu (0.50–0.65)
- Tiêu đề HTML nhỏ phía trên "Những khoảnh khắc bay cùng tụi mình" (Pacifico 24px, card không nền, chữ `ink` trên biển mây trắng).
- 6 khinh khí cầu nhỏ mang ảnh trôi quanh. Bấm vào ảnh/khinh khí cầu → lightbox HTML (A10). Hover desktop: khinh khí cầu nhích lên `y +0.3`.
- Nút "Xem tất cả ảnh" (card ruy băng nhỏ) mở lưới 2 cột HTML.

### C5 + C6 + C7 · Hoàng hôn (0.65–0.85)
Card ruy băng lớn, cuộn tự nhiên trong section 180svh (card cao hơn màn hình trên mobile nên ruy băng co giãn theo).
```
│   ╭──────────────────────╮ │
│   │ ✈ ĐIỂM HẠ CÁNH        │ │  ← Quicksand 12px coralDeep
│   │        14            │ │  ← Quicksand 72px ink
│   │   THÁNG 11 · 2026    │ │
│   │ ┌──┐┌──┐┌──┐┌──┐     │ │
│   │ │45││06││12││33│     │ │  ← A7, ô bo tròn
│   │ └──┘└──┘└──┘└──┘     │ │
│   │ ngày giờ phút giây   │ │
│   │ ───────────────────  │ │
│   │ 🎈 Lễ thành hôn 17:00 │ │
│   │ 🥂 Tiệc cưới    18:00 │ │
│   │ ───────────────────  │ │
│   │ {venue.name}         │ │
│   │ ┌──────────────────┐ │ │
│   │ │  MapEmbed 200px  │ │ │
│   │ └──────────────────┘ │ │
│   │ [ Chỉ đường ]        │ │
│   ╰──────────────────────╯ │
```
- `date` ⚠️: chưa có → ngày mẫu viết sẵn, ẩn đếm ngược. Đã qua → "Tụi mình đã hạ cánh an toàn ở bến hạnh phúc ♥".
- Mặt trời lặn dần phía sau khinh khí cầu, bầu trời lerp sang hồng.

### C10 · Trời sao (0.85–1.00)
```
│        ✦    ☾     ✦        │
│   ✦        ◯               │  ← khinh khí cầu nhỏ, lửa sáng
│                            │
│  Cảm ơn bạn đã bay cùng    │  ← Pacifico 26px trắng
│  tụi mình!                 │
│   ┌──────────┐             │
│   │images[n-1]│             │  ← ảnh cuối, A3
│   └──────────┘             │
│  Minh Quân & Thu Hà        │  ← Quicksand 16px trắng/85
```
- Nền phần tử gốc chuyển sang `night`; chữ trắng (tương phản trên `night` ≈ 16:1 ✅). Không dùng card ruy băng (ruy băng fade ra), chữ nổi trực tiếp trên trời sao.
- Đồng hồ độ cao đổi thành "∞".

### Reduced-motion và edge case (chung)
- Card ruy băng: reduced-motion → chỉ fade 0.3s, không đung đưa, không thả.
- Tên 50 ký tự bằng Pacifico (chữ rộng): tên đặt `text-balance break-words`, cỡ giảm 40 → 30px khi `length > 22`.
- Ruy băng `fixed` phải ẩn khi lightbox mở (tránh vẽ đè).

---

## 7. Fallback (không có WebGL hoặc bật reduced-motion)
- Không mount canvas. Nền phần tử gốc là gradient trời (cùng màu §2) đổi theo chương.
- **Mây SVG parallax (A4)**: 3 lớp mây SVG `fixed` trôi `yPercent` theo tốc độ khác nhau (reduced-motion: đứng yên); khinh khí cầu SVG cố định giữa-trên, A12 (reduced-motion: tắt).
- Ảnh C8 thành lưới 2 cột; ảnh chân dung vẫn trong card C3.
- Trời sao cuối: 40 chấm sao CSS.

## 8. Hiệu năng
- Mây drei là phần nặng nhất: mobile 7 cụm, `segments 10`; **unmount** `<Clouds>` khi progress < 0.25 hoặc > 0.70 (không chỉ ẩn).
- Thành phố `InstancedMesh` 1 draw call; unmount khi progress > 0.40 (đã khuất dưới mây).
- `Stars` chỉ mount khi progress > 0.75.
- `dpr ≤ 1.5` mobile, không shadow, `frameloop="demand"` trước khi mở thiệp / tab ẩn.

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, nền lightbox |
| `images[1]` / `images[2]` | Ảnh tròn trong card C3 |
| `images[3..5]` | Polaroid 3 mốc C4 (và cũng nằm trên 3 khinh khí cầu nhỏ) |
| `images[3..7]` | 5 khinh khí cầu nhỏ C8 (chiếc thứ 6 dùng `images[0]`) |
| `images[7]` | Ảnh cuối C10 (`images[n-1]`) |

`meta.media = { images: 8, videos: 0 }`

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/balloon-3d/
├── meta.ts, layout.tsx, page.tsx
└── _components/
    ├── balloon-invite.tsx    # "use client": sections + gate + Altimeter + Ribbons + <BalloonCanvas/>
    ├── balloon-canvas.tsx    # next/dynamic(() => import("./scene"), { ssr: false }) + fallback mây SVG
    ├── scene.tsx             # <SceneCanvas> + sky + mount/unmount theo progress
    ├── flight-rig.tsx        # balloon.y = altitude(p), camera = balloon + offset
    ├── balloon.tsx           # Lathe + giỏ + lửa (dùng lại cho đoàn nhỏ)
    ├── city.tsx, cloud-layer.tsx, flotilla.tsx, sunset.tsx
    ├── flight.ts             # FLIGHT_KFS, sampleFlight, skyColors(p), altitudeLabel(p) (có test)
    ├── ribbon-card.tsx       # card ruy băng + timeline thả/kéo
    ├── altimeter.tsx
    └── sections/*.tsx        # rooftop, rise, clouds, flotilla, sunset, stars
```
Layout: `Pacifico({ subsets: ["vietnamese"], weight: "400", variable: "--font-script" })` + `Quicksand({ subsets: ["vietnamese"], variable: "--font-sans" })`.

### 10.2 Tokens
```ts
export const t = {
  root: "min-h-screen text-[#23303F] font-(family-name:--font-sans)",
  name: "font-(family-name:--font-script) text-[40px] lg:text-[72px] text-[#EF6F6C] leading-[1.2] text-balance break-words",
  title: "font-(family-name:--font-script) text-2xl lg:text-[30px] text-[#EF6F6C]",
  label: "text-xs font-bold uppercase tracking-[0.15em] text-[#C8433F]",
  card: "relative rounded-[1.5rem] bg-white/85 backdrop-blur-sm shadow-[0_10px_40px_rgb(35_48_63/0.12)] p-6 max-w-[380px] origin-top",
  ribbon: "fixed top-0 w-0.5 bg-[#3D84A8]",
  btn: "min-h-11 rounded-full bg-[#EF6F6C] px-7 text-white font-bold",
} as const;
```

### 10.3 Lộ trình bay (logic cần test)
```ts
// flight.ts
export type FlightKf = { at: number; alt: number; offset: V3; look: V3 };
export function sampleFlight(kfs: FlightKf[], p: number): { alt: number; offset: Vector3; look: Vector3 };
export function skyColors(p: number): { top: Color; horizon: Color };   // lerp theo bảng §2
export function altitudeLabel(p: number): string;                      // "1.200 M" | "∞" (vi-VN, bội số 50)
```
Test `flight.test.ts`: `alt` đơn điệu tăng theo p (không bao giờ tụt xuống); `altitudeLabel(0) === "0 M"`, `altitudeLabel(0.9) === "∞"`, định dạng dấu chấm nghìn; `skyColors(0.4)` là trắng mây; p ngoài [0,1] bị kẹp.

### 10.4 Rig và card ruy băng
```tsx
// flight-rig.tsx
useFrame(({ camera, clock }, dt) => {
  const s = sampleFlight(FLIGHT_KFS, progress.current);
  balloon.current!.position.set(Math.sin(clock.elapsedTime * 0.2) * 1.5, s.alt, 0);
  const k = 1 - Math.exp(-3 * dt);
  camPos.lerp(tmp.copy(balloon.current!.position).add(s.offset), k);
  lookAt.lerp(tmp.copy(balloon.current!.position).add(s.look), k);
  camera.position.copy(camPos); camera.lookAt(lookAt);
});

// ribbon-card.tsx
useGSAP(() => {
  const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 70%", end: "bottom 30%", toggleActions: "play reverse play reverse" } });
  tl.from(ref.current, { y: -120, rotation: -4, opacity: 0, duration: 0.9, ease: "back.out(1.4)" });
  gsap.to(ref.current, { rotation: 2, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.9 });
}, { scope: ref });
```

### 10.5 Thứ tự làm
1. `flight.ts` + test
2. HTML sections + card ruy băng + đồng hồ độ cao (chưa có canvas, nền gradient) → kiểm tra 360px
3. Canvas: sky shader + khinh khí cầu + flight rig
4. Thành phố instancing, mây drei, mount/unmount theo progress
5. Đoàn khinh khí cầu mang ảnh + raycast → lightbox
6. Mặt trời, trời sao, chim
7. Màn mở (bắn lửa), nhạc + tiếng lửa, tương tác gió/chạm đúp
8. Fallback mây SVG, đo bundle, Lighthouse mobile ≥ 75, checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `cloud-1..3.svg` (fallback) và `balloon.svg` (placeholder + fallback)
- [ ] `cloud.png` 256px (texture mây nếu không dùng texture mặc định của drei `Cloud`, để không phụ thuộc CDN)
- [ ] `burner.mp3` ≤ 30KB (Pixabay) + `music.mp3` + `CREDITS.md`
- [ ] 8 ảnh mẫu (Pexels, ưu tiên ảnh ngoài trời, bầu trời)
- [ ] `thumb.webp` 3:4, `opengraph-image.png` (chụp cảnh đoàn khinh khí cầu trên biển mây)

## 12. Tiêu chí nghiệm thu riêng
- [ ] Cuộn nhanh 2 chiều: khinh khí cầu luôn trong khung hình, không giật
- [ ] Mây không làm tụt dưới 40fps trên Android tầm trung khi xuyên mây
- [ ] `drei Cloud` dùng texture local (kiểm tra Network không gọi CDN ngoài)
- [ ] Card ruy băng đọc được (≥ 4.5:1) trên cả nền trắng mây lẫn nền hoàng hôn
- [ ] Đồng hồ độ cao không đè nút nhạc (trên-phải) và "Dùng thử" (dưới-phải) ở 360×740
- [ ] Tắt WebGL: mây SVG parallax hiển thị, đọc đủ nội dung, xem đủ 8 ảnh
