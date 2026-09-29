# 3D-08 · `museum-3d` · Bảo Tàng Kỷ Niệm

> Spec chi tiết của mẫu. Mã C, A, T xem [todo-list-wedding-page.md §2](../todo-list-wedding-page.md). Tuân thủ [template-spec.md](../template-spec.md).
> Dùng bộ công cụ 3D chung `@/kit/3d` (dựng ở [galaxy-3d](./galaxy-3d.md)): `SceneCanvas`, `useScrollProgress`, `useSafeTexture`, `sampleKeyframes`.

---

## 1. Concept

**Một câu:** Người xem cầm vé bước vào một bảo tàng tối giản trắng và vàng, đi qua từng phòng trưng bày kỷ vật tình yêu của hai người; đèn rọi chỉ bật khi họ tới gần mỗi bức ảnh.

**Cảm xúc muốn gợi:** trang trọng, tĩnh lặng, trân quý, "câu chuyện của chúng tôi đáng được trưng bày". Nhịp chậm như bước chân trong bảo tàng.

**Phù hợp với:** cặp đôi có **nhiều ảnh đẹp** (mẫu dùng nhiều ảnh nhất: 12 ảnh + 1 video), yêu nghệ thuật, thích phong cách sang trọng tối giản.

**Cách kể chuyện:** khác galaxy (bay tự do), ở đây camera **đi bộ ngang tầm mắt** (y cố định 1.6m) theo một lộ trình trong kiến trúc có tường, cửa, hành lang. Cuộn = bước chân. Chữ HTML đóng vai **bảng chú thích bảo tàng** (placard): căn dưới-trái, nhỏ, chữ serif, đúng như nhãn cạnh hiện vật. Chuyển giữa các phòng là **đi qua khung cửa** (T6 lặp lại mỗi phòng).

**Moodboard:** Louvre Lens, bảo tàng Kyoto tường trắng, đèn rọi track light, bảng nhãn hiện vật chữ Cormorant, sàn gỗ sồi sáng, viền khung vàng mờ.

---

## 2. Design tokens

### Màu
| Token | Hex | Dùng cho |
|---|---|---|
| `wall` | `#F5F2ED` | Nền trang, tường trong scene |
| `surface` | `#FFFFFF` | Nền placard, vé |
| `ink` | `#1C1C1C` | Chữ chính (trên `wall` 15.6:1 ✅) |
| `gray` | `#5C5A56` | Chữ phụ (trên `wall` 6.3:1 ✅) |
| `gold` | `#B8924A` | Khung ảnh, đường kẻ, icon. **Không dùng cho chữ nhỏ** (trên `wall` chỉ 2.7:1) |
| `goldText` | `#8A6A2F` | Chữ vàng cỡ nhỏ (số phòng, nhãn) (trên `surface` 5.0:1 ✅) |
| `cinema` | `#111111` | Phòng chiếu phim cuối; chữ trên nền này dùng `wall` |
| `floor` | `#D8C3A5` | Sàn gỗ trong scene |

### Typography
| Vai trò | Font | Mobile | Desktop |
|---|---|---|---|
| Tên (khắc trên tường) | Cormorant Garamond 500, VIẾT HOA, tracking 0.12em | 36px | 72px |
| Tiêu đề placard | Cormorant Garamond 600 italic | 22px | 26px |
| Số phòng ("PHÒNG II") | Inter 500, VIẾT HOA, tracking 0.3em | 11px | 12px |
| Số lớn (ngày) | Cormorant Garamond 300 | 88px | 128px |
| Nội dung placard | Inter 400 | 14px / 1.6 | 15px |

### Hình khối và chất liệu
- **Radius 0 ở mọi nơi.** Placard: `surface`, viền trên `2px gold`, không bóng, rộng 300px mobile / 360px desktop.
- Khung ảnh 3D: hộp mỏng viền `gold` (`meshStandardMaterial metalness 0.6 roughness 0.35`), passe-partout trắng 8%, ảnh `meshBasicMaterial` bên trong.
- Motion: camera `power3.inOut`; đèn rọi bật `power2.out` 0.6s; placard A1 ngắn (y 16px, 0.6s). Không có gì nảy.

---

## 3. Nhạc
- Piano cổ điển solo, chậm, có vang phòng (reverb lớn), khoảng 60 BPM, dài 3:00.
- Từ khoá Pixabay: `classical piano elegant`, `solo piano gallery`, `slow piano wedding`.
- Bắt đầu khi bấm "Vào bảo tàng". Âm lượng 0 → 0.5 trong 2 giây.
- **Điểm nhấn**: vào phòng chiếu (0.88) nhạc giảm về 0 trong 1s và tạm dừng; nhạc chỉ tiếp tục khi người xem đóng video hoặc cuộn ngược ra khỏi phòng chiếu. Nếu không có `videos[0]` thì nhạc giữ nguyên.

---

## 4. Cấu trúc trang và chương

Trang HTML dài **1000svh** (dài nhất bộ 3D, vì có hành lang 6 ảnh). Canvas `fixed inset-0 -z-10`.

### Mặt bằng bảo tàng (nhìn từ trên, trục z âm là hướng đi)
```
             z=0   ┌──────┐  Cửa chính (C1)
                   │ SẢNH │  tên khắc tường (C2)
           z=-12   └──┬───┘
                   ┌──┴───┐
                   │ P.I  │  2 chân dung đối diện (C3)
           z=-24   └──┬───┘
                   ┌──┴───┐
                   │ P.II │  3 khung + bệ (C4)
           z=-38   └──┬───┘
                      │     Hành lang dài 30 đơn vị, 3 ảnh mỗi bên (C8)
           z=-68   ┌──┴───┐
                   │P.III │  tủ kính "giấy mời" (C5+C6+C7)
           z=-80   └──┬───┘
                   ┌──┴───┐
                   │CHIẾU │  phòng tối, màn chiếu (C9+C10)
           z=-94   └──────┘
```

| Chương | Progress | HTML section | Card | Nơi |
|---|---|---|---|---|
| 0 | màn mở | `#ticket` | C1 | trước cửa |
| 1 | 0.00–0.08 | `#door` | (đi qua cửa) | cửa chính |
| 2 | 0.08–0.20 | `#hall` | C2 | sảnh |
| 3 | 0.20–0.35 | `#room-1` | C3 | Phòng I |
| 4 | 0.35–0.55 | `#room-2` | C4 | Phòng II |
| 5 | 0.55–0.75 | `#corridor` | C8 | hành lang |
| 6 | 0.75–0.88 | `#room-3` | C5 + C6 + C7 + C14 | Phòng III |
| 7 | 0.88–1.00 | `#cinema` | C9 + C10 | phòng chiếu |

### Keyframe camera
y luôn 1.6 (tầm mắt), trừ C1. Mỗi phòng có 2 keyframe: **dừng** (nhìn hiện vật) và **quay đầu** tới cửa kế tiếp; nhờ vậy camera "đứng lại ngắm" trong phần lớn chương rồi mới bước tiếp.

| progress | camera.position | lookAt | Ghi chú |
|---|---|---|---|
| 0.00 | `[0, 1.6, 6]` | `[0, 2, 0]` | Trước cửa đóng |
| 0.08 | `[0, 1.6, -2]` | `[0, 2.2, -11]` | Vừa qua cửa (T6) |
| 0.18 | `[0, 1.6, -6]` | `[0, 2.2, -11.9]` | Dừng trước tường tên |
| 0.22 | `[0, 1.6, -15]` | `[0, 1.6, -18]` | Vào Phòng I |
| 0.28 | `[0, 1.6, -18]` | `[-4, 1.7, -18]` | Quay trái: chân dung chú rể |
| 0.33 | `[0, 1.6, -18]` | `[4, 1.7, -18]` | Quay phải: chân dung cô dâu |
| 0.37 | `[0, 1.6, -27]` | `[0, 1.6, -31]` | Vào Phòng II |
| 0.53 | `[0, 1.6, -33]` | `[0, 1.6, -37.9]` | Lướt ngang 3 khung (x −3 → 3 theo §6) |
| 0.57 | `[0, 1.6, -40]` | `[0, 1.6, -50]` | Đầu hành lang |
| 0.75 | `[0, 1.6, -66]` | `[0, 1.6, -76]` | Cuối hành lang |
| 0.86 | `[0, 1.4, -74]` | `[0, 1.0, -77]` | Cúi nhìn tủ kính |
| 0.90 | `[0, 1.6, -84]` | `[0, 2, -93.9]` | Vào phòng chiếu |
| 1.00 | `[0, 1.6, -86]` | `[0, 2, -93.9]` | Ngồi trước màn |

Nội suy như galaxy (`sampleKeyframes` + `power3.inOut` + lerp mượt `1 - exp(-4·delta)`). Ở Phòng II, keyframe 0.37–0.53 được **ghi đè x** bằng `lerp(-3, 3, k)` để camera trượt ngang qua 3 khung, rồi các keyframe tiếp tục bình thường.

---

## 5. Các đối tượng trong scene

| Đối tượng | Cách dựng | Số lượng (desktop / mobile) |
|---|---|---|
| Kiến trúc | Mỗi phòng là 1 `BoxGeometry` lật mặt trong (`side: BackSide`) màu `wall`, sàn plane màu `floor`; cửa là lỗ bằng cách dựng tường từ 3 box quanh khung cửa. Tất cả merge thành **1 mesh** | 1 |
| Cửa chính (C1) | 2 cánh box `0.1×3×1.2`, pivot ở bản lề, xoay `rotation.y` 0 → ±100° khi mở | 2 |
| Tên khắc tường (C2) | **Không** vẽ chữ trong canvas (spec §7: tên là HTML). Tường sảnh có 1 plane lõm nhẹ màu `#EDE8E0` làm "ô khắc"; chữ HTML đặt khớp vị trí qua drei `<Html transform occlude={false}>` hoặc HTML overlay cố định (§6) | 1 |
| Khung ảnh | `Frame` component: box viền gold + plane ảnh; kích thước theo tỉ lệ 3:4; treo ở y 1.7 | 2 (P.I) + 3 (P.II) + 6 (hành lang) = 11 |
| Bệ trưng bày (P.II) | box trắng 0.6×1×0.6 dưới mỗi khung, trên bệ là 1 vật nhỏ: nhẫn (`TorusGeometry` vàng), 2 cốc (cylinder), 1 lá thư (plane gấp) | 3 |
| Tủ kính (P.III) | box trong suốt `meshPhysicalMaterial transmission 0.9 roughness 0.05` (desktop) / `meshBasicMaterial opacity 0.15` (mobile); bên trong là tấm thiệp mời (plane `images[0]`) | 1 |
| **Đèn rọi** | Mỗi khung có 1 `SpotLight` (three, không volumetric) góc 0.35, penumbra 0.6; `intensity` = `smoothstep(6, 2, khoảng cách camera→khung) · 40`. Desktop thêm drei `<SpotLight volumetric>` (nón sáng) cho 2 chân dung | 11 / 6 (mobile chỉ bật đèn của khung gần nhất ±2) |
| Ánh sáng nền | `ambientLight 0.35` + `hemisphereLight` ấm; tắt dần (0.35 → 0.03) khi vào phòng chiếu | 1 |
| Màn chiếu | plane 16:9 rộng 6; khi có video: `VideoTexture` từ `<video>` HTML ẩn (dùng chung element với lightbox); không có video thì chiếu `images[11]` | 1 |
| Bụi trong nắng | drei `<Sparkles>` rất nhỏ, chậm, chỉ trong nón sáng chân dung | 60 / 0 |

**Hiệu năng ánh sáng:** tối đa 6 SpotLight hoạt động cùng lúc trên desktop, 3 trên mobile; các đèn xa đặt `visible=false` (không chỉ intensity 0) để shader không phải tính. Không shadow.

**Tương tác con trỏ:** "ngó quanh" — `lookAt.x += pointer.x · 0.6`, `lookAt.y += pointer.y · 0.3` (làm mượt). Mobile: kéo ngang một ngón tay trên canvas cũng đổi `lookAt.x` (không chặn cuộn dọc: chỉ nhận khi `|dx| > |dy|`).

---

## 6. Chi tiết từng section HTML

**Quy ước placard:** mọi card (trừ C1, C2, C9) là placard nằm `absolute bottom-24 left-4` (mobile) / `bottom-16 left-16` (desktop), bên trong `<section>` sticky của chương. Cách góc dưới-phải (Dùng thử) ít nhất 80px. Mỗi placard có số phòng La Mã ở trên cùng.

### C1 · Vé vào cửa
```
┌────────────────────────────┐
│   ▐█▌ cửa bảo tàng đóng ▐█▌│  ← canvas
│ ┌────────────────────────┐ │
│ │ BẢO TÀNG KỶ NIỆM   №001 │ │  ← vé surface, viền gold
│ │ ┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈ │ │
│ │ Triển lãm:              │ │
│ │ MINH QUÂN & THU HÀ     │ │  ← Cormorant 26px
│ │ Mở cửa: 14.11.2026 ⚠️   │ │
│ │ ┈┈┈┈┈┈┈┈ ◌ ┈┈┈┈┈┈┈┈┈┈┈ │ │  ← đường xé, lỗ tròn
│ │   [ VÀO BẢO TÀNG → ]    │ │  ← nút ink, chữ wall
│ └────────────────────────┘ │
└────────────────────────────┘
```
**Nội dung:** "Bảo tàng Kỷ niệm" · "Triển lãm: `{groom.name} & {bride.name}`" · "Mở cửa: {ngày cưới}" (⚠️ `date` chưa chốt → ngày mẫu viết sẵn) · nút "Vào bảo tàng".

| t | Sự kiện |
|---|---|
| 0.0s | Bấm → nhạc fade in 2s |
| 0.0–0.5s | Vé bị **xé cuống**: nửa dưới (từ đường xé) `y +60, rotation 8°, opacity 0`; nửa trên `y -40, opacity 0` |
| 0.4–1.6s | Hai cánh cửa 3D mở `rotation.y ±100°` `power3.inOut` |
| 0.8–2.2s | **T6**: camera `z 6 → 0` (tự bay, không phụ thuộc cuộn), khung cửa phóng to tràn màn hình |
| 2.2s | Mở khoá cuộn, progress bắt đầu ở 0.08 (tự `scrollTo` đầu `#hall`) |

Nút "Bỏ qua" sau 0.5s. **Trước khi canvas sẵn sàng:** nền `wall` + ảnh `fallback-door.webp`.

### C2 · Sảnh, tên khắc tường (0.08–0.20)
```
│                            │
│      MINH QUÂN             │  ← h1, Cormorant 36px, ink/85
│          &                 │     tracking 0.12em, căn giữa
│       THU HÀ               │     trên "ô khắc" của tường
│    ─────── ◆ ───────       │  ← gold A6
│  Trân trọng kính mời quý   │
│  khách đến tham quan        │  ← Inter 14px gray
```
- Chữ HTML overlay `fixed` căn giữa, chỉ hiện trong khoảng progress 0.10–0.20 (opacity nối với progress), trùng vị trí ô khắc vì camera đứng yên ở keyframe 0.18.
- A2 theo **chữ** (`chars`), `yPercent 100 → 0` stagger 0.04, như chữ đang được khắc.
- Hiệu ứng khắc: `text-shadow` không dùng (CSS thuần); thay bằng lớp chữ trùng lặp lệch 1px màu trắng/60% phía dưới (Tailwind `translate-y-px`).

### C3 · Phòng I · Hai chân dung (0.20–0.35)
Placard đổi nội dung theo hướng camera nhìn (0.28 chú rể, 0.33 cô dâu), crossfade 0.3s:
```
│┌──────────────────────┐    │
││ PHÒNG I · CHÂN DUNG  │    │  ← goldText 11px
││ Chú rể               │    │  ← Cormorant italic 22px
││ Minh Quân            │    │
││ Nhà trai: 12 Lê Lợi, │    │  ← Inter 14px
││ Quận 1, TP.HCM       │    │
││ Chất liệu: sự kiên   │    │  ← dòng vui kiểu nhãn hiện vật
││ nhẫn, trái tim ấm.   │    │     (KHÔNG in năm sinh, spec §4.1)
│└──────────────────────┘    │
```
**Nội dung:** "Phòng I · Chân dung" · `groom.name` / `bride.name` · "Nhà trai: `{groom.address}`" / "Nhà gái: `{bride.address}`" · dòng chất liệu viết sẵn: chú rể "Chất liệu: sự kiên nhẫn và một trái tim ấm." / cô dâu "Chất liệu: nụ cười và những điều dịu dàng." Tên bố mẹ ⚠️: nếu có thì thêm "Con ông … & bà …", không có thì ẩn.

Đèn rọi chân dung chú rể bật ở 0.26, cô dâu ở 0.31 (theo khoảng cách, §5).

### C4 · Phòng II · Chuyện tình (0.35–0.55)
Camera trượt ngang qua 3 khung, mỗi khung có bệ và vật kỷ niệm. Placard đổi theo khung gần nhất:

| Mốc | Tiêu đề placard | Nội dung viết sẵn | Hiện vật trên bệ | Ảnh |
|---|---|---|---|---|
| 1 | Hiện vật số 1 · Lần đầu | "Hai cốc cà phê nguội dần vì mải nói chuyện. Buổi hẹn đầu tiên." | 2 cốc | `images[3]` |
| 2 | Hiện vật số 2 · Những lá thư | "Những dòng tin nhắn lúc nửa đêm, được lưu lại như báu vật." | lá thư | `images[4]` |
| 3 | Hiện vật số 3 · Lời cầu hôn | "Một chiếc nhẫn nhỏ, một câu hỏi lớn, và một chữ 'Có'." | nhẫn (xoay chậm) | `images[5]` |

| Progress | Sự kiện |
|---|---|
| 0.37 | Placard mốc 1 A1 |
| 0.43 / 0.49 | Crossfade placard sang mốc 2 / 3 |
| Liên tục | Nhẫn xoay `rotation.y += 0.4·dt`, đèn rọi theo khoảng cách |

### C8 · Hành lang (0.55–0.75)
- 6 khung (`images[6..11]` — xem §9) xen kẽ trái/phải, cách nhau 5 đơn vị. Camera đi thẳng; đèn từng khung bật lên khi tới gần và tắt khi đi qua (**điểm nhấn** của mẫu).
- HTML: chỉ một dòng nhỏ cố định dưới-trái "HÀNH LANG · KHOẢNH KHẮC · 3/6" (số đếm theo khung gần nhất).
- Bấm khung ảnh 3D → lightbox HTML (A10). Nút "Xem toàn bộ bộ sưu tập" mở lưới 3 cột HTML nền `wall` (khung gold 1px) với **toàn bộ 12 ảnh**.

### C5 + C6 + C7 + C14 · Phòng III · Tủ kính giấy mời (0.75–0.88)
Placard **to hơn** (tràn ngang 360px trừ lề 16px), vì nhiều nội dung; cuộn tự nhiên bên trong section dài 130svh.
```
│┌──────────────────────────┐│
││ PHÒNG III · THƯ MỜI      ││
││         14               ││  ← Cormorant 88px ink
││   THÁNG MƯỜI MỘT · 2026  ││
││  45 : 06 : 12 : 33       ││  ← A7
││ ──────────── ◆ ───────── ││
││ Lễ thành hôn     17:00   ││
││ Tiệc cưới        18:00   ││
││ ──────────────────────── ││
││ {venue.name}             ││
││ {venue.address}          ││
││ ┌──────────────────────┐ ││
││ │   MapEmbed 200px     │ ││
││ └──────────────────────┘ ││
││ [ Chỉ đường ]  [ Mừng cưới ]│  ← nút thứ hai mở C14
│└──────────────────────────┘│
```
- `date` ⚠️: chưa có → ngày mẫu + ẩn đếm ngược. Đã qua → "Triển lãm đã khai mạc. Chúng tôi đã về chung một nhà ♥".
- C14 ("Quầy lưu niệm"): dialog HTML hiện QR mẫu placeholder ⚠️ (chờ chốt QR ngân hàng người dùng) với chú thích "Hộp mừng cưới". Nếu dữ liệu chưa có QR thì **ẩn nút** "Mừng cưới".

### C9 + C10 · Phòng chiếu (0.88–1.00)
Nền HTML chuyển `cinema` (overlay `bg-[#111]` opacity nối progress 0.86–0.90); ánh sáng scene tắt dần; màn chiếu sáng lên.
```
│                            │
│   ┌────────────────────┐   │
│   │   ▶  màn chiếu 3D  │   │  ← canvas
│   └────────────────────┘   │
│     [ ▶ Xem phim ]         │  ← nút viền wall, chỉ khi có videos[0]
│                            │
│   Cảm ơn bạn đã ghé thăm   │  ← Cormorant italic 26px wall
│   bảo tàng nhỏ của chúng   │
│   tôi.                     │
│   Minh Quân & Thu Hà       │
│   LỐI RA →                 │  ← Inter 11px, bấm về đầu trang
```
- Bấm "Xem phim": mở `<video controls>` HTML trong lightbox (spec §11: video có controls, không tự phát có tiếng); texture màn chiếu dùng chính element đó (muted mirror). Nhạc nền dừng (§3).
- Không có video → màn chiếu hiện `images[11]` chuyển động Ken Burns nhẹ (scale 1 → 1.08 theo progress), ẩn nút.

### Reduced-motion và edge case (chung)
- Tên 50 ký tự trên tường: cỡ chữ `clamp` theo độ dài (`name.length > 20` → 28px mobile), `text-balance`.
- Tỉ lệ ảnh người dùng không 3:4 → `texture` dùng `cover` (tính `repeat/offset` như `object-fit: cover`), khung không đổi.
- Lightbox mở → dừng pointer look để ảnh không trôi phía sau.

---

## 7. Fallback (không có WebGL hoặc bật reduced-motion)
- Không mount canvas. Trang thành **gallery trắng** cuộn dọc: nền `wall`, mỗi phòng là một section có số phòng, ảnh `<img>` trong khung gold 1px (`border border-[#B8924A] p-2 bg-white`), placard đặt ngay dưới ảnh.
- C1: vé vẫn xé cuống bằng fade ngắn (reduced-motion) rồi hiện ảnh `fallback-door.webp`.
- Hành lang → lưới 2 cột; phòng chiếu → `<video controls>` trực tiếp trên nền `cinema`.
- "Đèn rọi" giả lập bằng lớp `bg-[radial-gradient(...)]` ở trên mỗi khung, opacity A1 khi vào viewport (reduced-motion: hiện sẵn).

## 8. Hiệu năng
- 11 texture ảnh + 1 video là nhiều nhất bộ → **tải lười theo phòng**: chỉ `useSafeTexture` ảnh của phòng hiện tại và phòng kế tiếp; ảnh xa hiện khung với passe-partout trống.
- Kiến trúc 1 mesh merge; khung ảnh dùng chung geometry.
- SpotLight giới hạn như §5; mobile `dpr ≤ 1.5`, không volumetric, không transmission.
- `frameloop="demand"` trước khi vào và khi lightbox/video đang mở (scene đứng yên).

## 9. Dữ liệu và media
| Vị trí | Dùng ở |
|---|---|
| `images[0]` | Thumbnail, OG, thiệp mời trong tủ kính (P.III) |
| `images[1]` / `images[2]` | Chân dung chú rể / cô dâu (P.I) |
| `images[3..5]` | 3 khung chuyện tình (P.II) |
| `images[6..11]` | 6 khung hành lang (C8) |
| `images[11]` | Màn chiếu khi không có video (dùng lại ảnh cuối) |
| `images[0..11]` | Lưới "Xem toàn bộ bộ sưu tập" |
| `videos[0]` | Phòng chiếu C9 |

`meta.media = { images: 12, videos: 1 }`

---

## 10. Triển khai code

### 10.1 Cấu trúc
```
src/app/mau-thiep-cuoi/museum-3d/
├── meta.ts, layout.tsx, page.tsx
└── _components/
    ├── museum-invite.tsx     # "use client": sections + ticket gate + placard + <MuseumCanvas/>
    ├── museum-canvas.tsx     # next/dynamic(() => import("./scene"), { ssr: false }) + fallback gallery
    ├── scene.tsx             # <SceneCanvas> + đối tượng
    ├── walk-rig.tsx          # camera theo KEYFRAMES + ghi đè x ở Phòng II + look quanh
    ├── building.tsx          # phòng merge + cửa chính
    ├── frame.tsx             # khung ảnh + SpotLight theo khoảng cách
    ├── exhibits.tsx          # bệ, cốc, thư, nhẫn, tủ kính
    ├── cinema.tsx            # màn chiếu + VideoTexture
    ├── museum.ts             # KEYFRAMES, FRAMES (vị trí 11 khung), spotIntensity, activeFrames, roomAt (có test)
    └── sections/*.tsx        # ticket, hall, room-1, room-2, corridor, room-3, cinema
```
Layout: `Cormorant_Garamond({ subsets: ["vietnamese"], weight: ["300","500","600"], style: ["normal","italic"], variable: "--font-serif" })` + `Inter({ subsets: ["vietnamese"], variable: "--font-sans" })`.

### 10.2 Tokens
```ts
export const t = {
  root: "min-h-screen bg-[#F5F2ED] text-[#1C1C1C] font-(family-name:--font-sans)",
  engraved: "font-(family-name:--font-serif) font-medium uppercase tracking-[0.12em] text-[36px] lg:text-[72px] text-[#1C1C1C]/85",
  room: "text-[11px] lg:text-xs font-medium uppercase tracking-[0.3em] text-[#8A6A2F]",
  placard: "rounded-none bg-white border-t-2 border-[#B8924A] p-5 w-[300px] lg:w-[360px]",
  placardTitle: "font-(family-name:--font-serif) italic font-semibold text-[22px] lg:text-[26px]",
  btn: "min-h-11 rounded-none bg-[#1C1C1C] px-6 text-[#F5F2ED] uppercase tracking-[0.2em] text-xs",
} as const;
```

### 10.3 Đèn rọi theo khoảng cách (logic cần test)
```ts
// museum.ts
export function spotIntensity(dist: number, max = 40) {
  const k = Math.min(1, Math.max(0, (6 - dist) / 4)); // 6 → 0, 2 → 1
  return max * k * k * (3 - 2 * k);                    // smoothstep
}
export function activeFrames(camZ: number, frames: { z: number }[], limit: number): number[]
// trả index các khung gần nhất (theo |z|), tối đa `limit`
```
```tsx
// frame.tsx
useFrame(({ camera }) => {
  const d = camera.position.distanceTo(worldPos);
  spot.current!.intensity = spotIntensity(d);
  spot.current!.visible = active.current.includes(index);
});
```
Test `museum.test.ts`: `spotIntensity(10) === 0`, `spotIntensity(1) === 40`, đơn điệu giảm theo khoảng cách; `activeFrames` không vượt `limit` và luôn chứa khung gần nhất; `roomAt(p)` trả đúng phòng ở các ranh (0.08, 0.20, 0.35, 0.55, 0.75, 0.88); `sampleKeyframes(KEYFRAMES, p).pos.y` luôn 1.6 với p ≥ 0.08 trừ đoạn tủ kính.

### 10.4 Cửa mở và T6 (một timeline, không phụ thuộc cuộn)
```tsx
const { contextSafe } = useGSAP({ scope: root });
const enter = contextSafe(() => {
  audio.play(); fadeVolume(0.5, 2);
  gsap.timeline({ onComplete: () => { unlockScroll(); scrollToSection("#hall"); } })
    .to(".stub", { y: 60, rotation: 8, opacity: 0, duration: 0.5 })
    .to(doors.current.left.rotation, { y: -1.75, duration: 1.2, ease: "power3.inOut" }, 0.4)
    .to(doors.current.right.rotation, { y: 1.75, duration: 1.2, ease: "power3.inOut" }, 0.4)
    .to(introCam.current, { z: 0, duration: 1.4, ease: "power3.inOut" }, 0.8);
});
```
`introCam` là object `{ z }` mà `walk-rig` ưu tiên đọc khi `gateOpen === false`.

### 10.5 Thứ tự làm
1. `museum.ts` + test (spotIntensity, activeFrames, roomAt, keyframes)
2. Fallback gallery trắng (HTML đầy đủ, dùng luôn làm bản đọc được) → kiểm tra 360px
3. Canvas: building merge + walk rig theo keyframe
4. Khung ảnh + đèn rọi theo khoảng cách + tải texture lười
5. Bệ hiện vật, tủ kính, phòng chiếu + VideoTexture
6. Vé/cửa (C1), placard đổi theo khung, nhạc
7. Look quanh (pointer, kéo ngang mobile), lightbox, lưới bộ sưu tập, C14
8. Đo bundle, Lighthouse mobile ≥ 75, checklist template-spec §12

## 11. Asset cần chuẩn bị
- [ ] `fallback-door.webp` (cảnh cửa bảo tàng, chụp từ scene)
- [ ] `qr-sample.webp` (QR placeholder, không phải QR thật)
- [ ] `music.mp3` (Pixabay) + `CREDITS.md`
- [ ] 12 ảnh mẫu + 1 video mẫu ≤ 8MB (Pexels); bổ sung `public/sample/` nếu sampleData chưa đủ 12 ảnh
- [ ] `thumb.webp` 3:4, `opengraph-image.png` (chụp hành lang có đèn rọi)

## 12. Tiêu chí nghiệm thu riêng
- [ ] Camera không bao giờ đi xuyên tường (kiểm tra cuộn nhanh 2 chiều)
- [ ] Đèn rọi bật/tắt mượt theo khoảng cách, không nhấp nháy khi đứng yên
- [ ] ≤ 6 SpotLight `visible` cùng lúc desktop, ≤ 3 mobile (log `activeFrames`)
- [ ] 12 ảnh 12MP từ "Dùng thử" không crash tab iOS (nhờ tải lười + resize)
- [ ] Video có `controls`, nhạc nền dừng khi video phát và tiếp tục khi đóng
- [ ] Placard không đè nút "Dùng thử" ở 360×740
- [ ] Tắt WebGL: gallery trắng đọc đủ nội dung, xem được đủ 12 ảnh và video
